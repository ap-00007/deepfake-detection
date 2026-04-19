import { Upload, ShieldCheck, Zap } from 'lucide-react';
import { ActiveSection } from '../types';

type HeroProps = {
  onNavigate: (section: ActiveSection) => void;
};

const stats = [
  { icon: ShieldCheck, label: 'Model Accuracy', value: '99.86%' },
  { icon: Zap, label: 'Avg. Inference Time', value: '< 2s' },
  { icon: Upload, label: 'Supported Formats', value: 'IMG + VIDEO' },
];

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-navy via-slate to-navy flex flex-col items-center justify-center px-6 pt-20 pb-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 text-sm font-medium tracking-wide">
            Deep Learning · Computer Vision · Media Forensics
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
          AI-Powered{' '}
          <span className="text-cyan-400">Deepfake</span>{' '}
          Detection
        </h1>

        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload an image or video to verify authenticity using a deep learning model
          trained on thousands of real and synthetic media samples.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={() => onNavigate('upload')}
            className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-navy font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 hover:-translate-y-0.5"
          >
            <Upload className="w-5 h-5" />
            Upload File
          </button>
          <button
            onClick={() => onNavigate('model')}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3.5 rounded-xl transition-all duration-200 border border-white/10 hover:border-white/20"
          >
            View Model Info
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-white/5 border border-white/10 rounded-xl px-6 py-5 text-center hover:bg-white/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-cyan-400" />
              </div>
              <p className="text-white font-bold text-xl">{value}</p>
              <p className="text-slate-400 text-sm mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
