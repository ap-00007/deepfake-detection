import { Shield, Github, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-white/10 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Deepfake Detection System</p>
              <p className="text-slate-400 text-xs">Developed as an ML project demonstration</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span>EfficientNet-B0</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>PyTorch</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>99.86% Accuracy</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <Github className="w-4 h-4" />
              </div>
              <span className="group-hover:text-white transition-colors">View on GitHub</span>
              <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-slate-500 text-xs">
          Built for academic demonstration purposes only. Predictions are not guaranteed and should not be used as sole evidence in any decision.
        </div>
      </div>
    </footer>
  );
}
