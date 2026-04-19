# Deepfake Detection App

A full-stack deepfake detection demo with a React + Vite frontend and a FastAPI + PyTorch backend. The app accepts image uploads, returns a prediction, shows real/fake scores, and renders a Grad-CAM heatmap for model explainability.

## Features

- Image upload with live preview
- Backend inference using a PyTorch EfficientNet-B0 classifier
- Real and fake scores returned separately for UI display
- Grad-CAM heatmap visualization
- Debug endpoint for inspecting raw model probabilities

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: FastAPI, Uvicorn, PyTorch, TorchVision, Pillow
- Visualization: Grad-CAM heatmap generation

## Project Structure

```text
.
├── backend/
│   ├── main.py
│   ├── model_loader.py
│   └── requirements.txt
├── src/
│   ├── components/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+ recommended
- A trained model file named `deepfake_model.pth`

Place the model file in one of these locations:

- `/Users/ashishsmac/Projects/deepfake/deepfake_model.pth`
- `/Users/ashishsmac/Projects/deepfake/backend/deepfake_model.pth`

## Setup

### Frontend

```bash
npm install
```

### Backend

Install Python dependencies:

```bash
pip install -r backend/requirements.txt
```

If you prefer a virtual environment, create and activate it first, then install the requirements.

## Running the App

### Start the backend

From the project root:

```bash
npm run backend
```

Or directly:

```bash
uvicorn backend.main:app --reload
```

### Start the frontend

```bash
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Available Scripts

From `package.json`:

```bash
npm run dev
npm run backend
npm run build
npm run lint
npm run preview
npm run typecheck
```

## Backend API

### `GET /health`

Returns backend status.

Response:

```json
{ "status": "ok" }
```

### `POST /predict`

Uploads an image and returns the prediction plus separate scores.

Response:

```json
{
	"prediction": "REAL",
	"real_score": 0.91,
	"fake_score": 0.09
}
```

### `POST /predict-debug`

Returns the prediction with raw model values and active inference settings.

### `POST /heatmap`

Returns a base64-encoded Grad-CAM heatmap image.

## Inference Notes

- The backend currently uses this preprocessing pipeline:

```python
transform = transforms.Compose([
		transforms.Resize((224, 224)),
		transforms.ToTensor(),
])
```

- The backend exposes separate `real_score` and `fake_score` values so the frontend can display both probabilities clearly.
- If you see suspiciously flat or extreme outputs, use `/predict-debug` and the `DEEPFAKE_DEBUG_PROBABILITIES=true` environment flag to inspect raw values.

## Troubleshooting

- If backend startup fails, confirm `deepfake_model.pth` exists in one of the supported paths.
- If the frontend cannot reach the backend, make sure the FastAPI server is running on `http://127.0.0.1:8000`.
- If scores look wrong, verify that your training preprocessing matches the backend transform exactly.

## License

No license has been specified yet.
