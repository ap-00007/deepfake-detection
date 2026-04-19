import io

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

try:
    from .model_loader import predict_image, predict_image_debug, generate_heatmap
except ImportError:
    from model_loader import predict_image, predict_image_debug, generate_heatmap

app = FastAPI(title="Deepfake Detection API")

# Allow local frontend apps (Vite/Bolt) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)) -> dict[str, float | str]:
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except UnidentifiedImageError as exc:
        raise HTTPException(status_code=400, detail="Invalid image file.") from exc

    result = predict_image(image)
    return {
        "prediction": result["prediction"],
        "real_score": result["real_score"],
        "fake_score": result["fake_score"],
    }


@app.post("/predict-debug")
async def predict_debug(file: UploadFile = File(...)) -> dict[str, float | str | bool]:
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except UnidentifiedImageError as exc:
        raise HTTPException(status_code=400, detail="Invalid image file.") from exc

    return predict_image_debug(image)


@app.post("/heatmap")
async def heatmap(file: UploadFile = File(...)) -> dict[str, str]:
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        original_size = image.size
    except UnidentifiedImageError as exc:
        raise HTTPException(status_code=400, detail="Invalid image file.") from exc

    heatmap_base64 = generate_heatmap(image, original_size)
    return {"heatmap": heatmap_base64}
