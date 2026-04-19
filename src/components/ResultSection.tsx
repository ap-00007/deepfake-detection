import { CheckCircle2, XCircle, Info, BarChart3 } from 'lucide-react';
import { PredictionResult } from '../types';

type ResultSectionProps = {
  result: PredictionResult;
};

export default function ResultSection({ result }: ResultSectionProps) {
  const isReal = result.label === 'REAL';
  const realPercent = result.real_score * 100;
  const fakePercent = result.fake_score * 100;
  const predictedPercent = isReal ? realPercent : fakePercent;

  return (
    <div className="space-y-4">
      <div
        className={`rounded-2xl border-2 p-6 flex items-center gap-5 ${
          isReal
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-red-50 border-red-200'
        }`}
      >
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isReal ? 'bg-emerald-100' : 'bg-red-100'
          }`}
        >
          {isReal ? (
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          ) : (
            <XCircle className="w-7 h-7 text-red-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span
              className={`text-2xl font-bold tracking-tight ${
                isReal ? 'text-emerald-700' : 'text-red-700'
              }`}
            >
              {result.label}
            </span>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase ${
                isReal
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {isReal ? 'Authentic' : 'Synthetic'}
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            Prediction confidence: <span className="font-semibold text-charcoal">{predictedPercent.toFixed(2)}%</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <h4 className="font-semibold text-charcoal text-sm">Classification Scores</h4>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">REAL</span>
              <span className="font-bold text-emerald-600">{realPercent.toFixed(2)}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-1000 ease-out"
                style={{ width: `${realPercent}%` }}
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">FAKE</span>
              <span className="font-bold text-red-600">{fakePercent.toFixed(2)}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-red-500 transition-all duration-1000 ease-out"
                style={{ width: `${fakePercent}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 border-t border-slate-100 pt-3">
            Scores represent sigmoid output probabilities from the final classification layer.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Info className="w-4 h-4 text-slate-400" />
            <h4 className="font-semibold text-charcoal text-sm">Model Explanation</h4>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{result.explanation}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-charcoal text-sm">Activation Heatmap</h4>
          {!result.heatmap && (
            <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
              Loading
            </span>
          )}
        </div>
        {result.heatmap ? (
          <div className="rounded-xl overflow-hidden border border-slate-100">
            <img
              src={result.heatmap}
              alt="Grad-CAM Heatmap"
              className="w-full h-auto object-contain"
            />
            <p className="text-xs text-slate-400 p-3 bg-slate-50 border-t border-slate-100">
              Grad-CAM visualization showing model attention regions. Warmer colors (red/yellow) indicate areas with higher activation.
            </p>
          </div>
        ) : (
          <div className="h-36 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-slate-400 text-sm font-medium">Grad-CAM Visualization</p>
            <p className="text-slate-300 text-xs">Generating heatmap overlay...</p>
          </div>
        )}
      </div>
    </div>
  );
}
