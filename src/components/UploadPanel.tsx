import { useState, useRef, useCallback } from 'react';
import { Upload, FileImage, X, Loader2 } from 'lucide-react';
import { UploadedFile, PredictionResult } from '../types';
import ResultSection from './ResultSection';

const PREDICT_API_URL = 'http://127.0.0.1:8000/predict';
const HEATMAP_API_URL = 'http://127.0.0.1:8000/heatmap';
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

async function runPrediction(file: File): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(PREDICT_API_URL, {
    method: 'POST',
    body: formData,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = typeof payload?.detail === 'string' ? payload.detail : 'Prediction request failed.';
    throw new Error(detail);
  }

  const backendLabel = payload?.prediction === 'FAKE' ? 'FAKE' : 'REAL';
  const rawRealScore = Number(payload?.real_score);
  const rawFakeScore = Number(payload?.fake_score);
  
  const real_score = Number.isFinite(rawRealScore)
    ? Math.min(1, Math.max(0, rawRealScore))
    : 0;
  const fake_score = Number.isFinite(rawFakeScore)
    ? Math.min(1, Math.max(0, rawFakeScore))
    : 0;

  let heatmap: string | undefined;
  try {
    const heatmapFormData = new FormData();
    heatmapFormData.append('file', file);
    const heatmapResponse = await fetch(HEATMAP_API_URL, {
      method: 'POST',
      body: heatmapFormData,
    });
    const heatmapPayload = await heatmapResponse.json().catch(() => ({}));
    if (heatmapResponse.ok && heatmapPayload?.heatmap) {
      heatmap = heatmapPayload.heatmap;
    }
  } catch {
  }

  return {
    label: backendLabel,
    real_score,
    fake_score,
    explanation:
      backendLabel === 'FAKE'
        ? 'The uploaded media is predicted as synthetic. This score is generated directly from the backend EfficientNet-B0 model output.'
        : 'The uploaded media is predicted as authentic. This score is generated directly from the backend EfficientNet-B0 model output.',
    heatmap,
  };
}

export default function UploadPanel() {
  const [dragOver, setDragOver] = useState(false);
  const [uploaded, setUploaded] = useState<UploadedFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Unsupported file type. Please upload an image (JPG, PNG, WEBP, GIF).');
      return;
    }
    setError(null);
    setResult(null);

    const previewUrl = URL.createObjectURL(file);
    const type = file.type.startsWith('video') ? 'video' : 'image';
    setUploaded({ file, previewUrl, type });

    setLoading(true);
    try {
      const prediction = await runPrediction(file);
      setResult(prediction);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze file.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearUpload = () => {
    if (uploaded) URL.revokeObjectURL(uploaded.previewUrl);
    setUploaded(null);
    setResult(null);
    setError(null);
    setLoading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <section className="min-h-screen bg-neutral pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-3 tracking-tight">
            Analyze Your Media
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Upload an image file and receive an instant authenticity assessment powered by our EfficientNet-B0 model.
          </p>
        </div>

        {!uploaded ? (
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 md:p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
              dragOver
                ? 'border-cyan-400 bg-cyan-50 scale-[1.01]'
                : 'border-slate-300 bg-white hover:border-cyan-300 hover:bg-cyan-50/30'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={onInputChange}
            />
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors ${dragOver ? 'bg-cyan-400/20' : 'bg-slate-100'}`}>
              <Upload className={`w-9 h-9 transition-colors ${dragOver ? 'text-cyan-500' : 'text-slate-400'}`} />
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">
              Drag & drop your file here
            </h3>
            <p className="text-slate-400 mb-6">or click anywhere to browse</p>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileImage className="w-4 h-4" /> JPG, PNG, WEBP, GIF
              </span>
            </div>
            {error && (
              <p className="mt-4 text-red-500 text-sm font-medium bg-red-50 px-4 py-2 rounded-lg">
                {error}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <FileImage className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-charcoal text-sm">{uploaded.file.name}</p>
                    <p className="text-slate-400 text-xs">
                      {(uploaded.file.size / (1024 * 1024)).toFixed(2)} MB · {uploaded.type.toUpperCase()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearUpload}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 flex justify-center bg-slate-50">
                <img
                  src={uploaded.previewUrl}
                  alt="Upload preview"
                  className="max-h-80 max-w-full rounded-xl object-contain shadow-sm"
                />
              </div>
            </div>

            {loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-charcoal">Analyzing media...</p>
                  <p className="text-slate-400 text-sm mt-1">Running EfficientNet-B0 inference pipeline</p>
                </div>
                <div className="flex gap-2 mt-1">
                  {['Preprocessing', 'Feature Extraction', 'Classification'].map((step, i) => (
                    <span key={step} className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Loader2 className="w-3 h-3 animate-spin text-cyan-400" style={{ animationDelay: `${i * 0.2}s` }} />
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result && !loading && <ResultSection result={result} />}
          </div>
        )}
      </div>
    </section>
  );
}
