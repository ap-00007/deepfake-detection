import os
from pathlib import Path
import base64
import io

import torch
import torch.nn as nn
from PIL import Image
from torchvision import models, transforms
import numpy as np
import cv2

_BACKEND_DIR = Path(__file__).resolve().parent
_PROJECT_ROOT = _BACKEND_DIR.parent
_MODEL_CANDIDATES = [
    _PROJECT_ROOT / "deepfake_model.pth",
    _BACKEND_DIR / "deepfake_model.pth",
]
MODEL_PATH = next((p for p in _MODEL_CANDIDATES if p.exists()), _MODEL_CANDIDATES[0])
DEVICE = torch.device("cpu")
THRESHOLD = float(os.getenv("DEEPFAKE_THRESHOLD", "0.5"))
POSITIVE_LABEL = os.getenv("DEEPFAKE_POSITIVE_LABEL", "REAL").strip().upper()


def _env_bool(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


USE_IMAGENET_NORM = _env_bool("DEEPFAKE_USE_IMAGENET_NORM", False)
DEBUG_PROBABILITIES = _env_bool("DEEPFAKE_DEBUG_PROBABILITIES", False)

if POSITIVE_LABEL not in {"FAKE", "REAL"}:
    raise ValueError("DEEPFAKE_POSITIVE_LABEL must be either 'FAKE' or 'REAL'.")


# Build the same architecture used during training.
model = models.efficientnet_b0(weights=None)
classifier_head = model.classifier[1]
if not isinstance(classifier_head, nn.Linear):
    raise TypeError("Unexpected EfficientNet classifier head type.")
model.classifier[1] = nn.Linear(classifier_head.in_features, 1)

if not MODEL_PATH.exists():
    expected_paths = "\n".join(f"- {p}" for p in _MODEL_CANDIDATES)
    raise FileNotFoundError(
        "Model file not found. Checked:\n"
        f"{expected_paths}\n"
        "Place deepfake_model.pth in either location."
    )

state_dict = torch.load(MODEL_PATH, map_location=DEVICE)
model.load_state_dict(state_dict)
model.to(DEVICE)
model.eval()

transform = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ]
)


def _predict_probabilities(image: Image.Image) -> tuple[float, float]:
    transformed = transform(image)
    if not isinstance(transformed, torch.Tensor):
        transformed = transforms.ToTensor()(transformed)
    image_tensor = transformed.unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        output = model(image_tensor)
        positive_probability = torch.sigmoid(output).item()

    if DEBUG_PROBABILITIES:
        print(f"Raw probability: {positive_probability:.6f}")

    fake_probability = (
        positive_probability
        if POSITIVE_LABEL == "FAKE"
        else 1 - positive_probability
    )

    return float(positive_probability), float(fake_probability)


def predict_image(image: Image.Image) -> dict[str, str | float]:
    _, fake_probability = _predict_probabilities(image)
    real_probability = 1 - fake_probability

    label = "FAKE" if fake_probability >= THRESHOLD else "REAL"

    return {
        "prediction": label,
        "real_score": float(real_probability),
        "fake_score": float(fake_probability),
    }


def predict_image_debug(image: Image.Image) -> dict[str, float | str | bool]:
    positive_probability, fake_probability = _predict_probabilities(image)
    real_probability = 1 - fake_probability
    label = "FAKE" if fake_probability >= THRESHOLD else "REAL"

    return {
        "prediction": label,
        "real_score": float(real_probability),
        "fake_score": float(fake_probability),
        "positive_probability": float(positive_probability),
        "positive_label": POSITIVE_LABEL,
        "threshold": float(THRESHOLD),
        "use_imagenet_norm": USE_IMAGENET_NORM,
    }


class GradCAM:
    def __init__(self, model_net: nn.Module, target_layer: nn.Module):
        self.model_net = model_net
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None

        target_layer.register_forward_hook(self._save_activation)
        target_layer.register_full_backward_hook(self._save_gradient)

    def _save_activation(self, module: nn.Module, input, output):
        self.activations = output.detach()

    def _save_gradient(self, module: nn.Module, grad_input, grad_output):
        self.gradients = grad_output[0].detach()

    def generate(self, image_tensor: torch.Tensor) -> np.ndarray:
        self.model_net.zero_grad()
        output = self.model_net(image_tensor)
        output.backward()

        if self.gradients is None or self.activations is None:
            raise RuntimeError("Gradients or activations not captured during backward pass.")

        gradients = self.gradients.cpu().numpy()[0]
        activations = self.activations.cpu().numpy()[0]

        weights = np.mean(gradients, axis=(1, 2))
        cam = np.zeros(activations.shape[1:], dtype=np.float32)
        for i, w in enumerate(weights):
            cam += w * activations[i, :, :]

        cam = np.maximum(cam, 0)
        cam_normalized = cam / (cam.max() + 1e-8)

        return cam_normalized


def generate_heatmap(image: Image.Image, original_size: tuple[int, int]) -> str:
    transformed = transform(image)
    if not isinstance(transformed, torch.Tensor):
        transformed = transforms.ToTensor()(transformed)
    image_tensor = transformed.unsqueeze(0).to(DEVICE)

    grad_cam = GradCAM(model, model.features[-1])
    cam = grad_cam.generate(image_tensor)

    cam_resized = cv2.resize(cam, original_size)
    cam_colored = cv2.applyColorMap((cam_resized * 255).astype(np.uint8), cv2.COLORMAP_JET)
    cam_colored = cv2.cvtColor(cam_colored, cv2.COLOR_BGR2RGB)

    pil_heatmap = Image.fromarray(cam_colored)
    buffer = io.BytesIO()
    pil_heatmap.save(buffer, format="PNG")
    buffer.seek(0)
    base64_image = base64.b64encode(buffer.read()).decode("utf-8")

    return f"data:image/png;base64,{base64_image}"