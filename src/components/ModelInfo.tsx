import { Cpu, Database, Target, GitBranch, Layers, TrendingUp, FlaskConical, Award } from 'lucide-react';

type MetricCard = {
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string;
  description: string;
  accent: string;
};

const metrics: MetricCard[] = [
  {
    icon: Cpu,
    label: 'Base Model',
    value: 'EfficientNet-B0',
    description: 'Compound-scaled CNN architecture with optimal depth, width, and resolution balancing.',
    accent: 'text-cyan-600 bg-cyan-50',
  },
  {
    icon: GitBranch,
    label: 'Framework',
    value: 'PyTorch',
    description: 'Trained using PyTorch 2.x with mixed-precision training and CUDA acceleration.',
    accent: 'text-orange-600 bg-orange-50',
  },
  {
    icon: Target,
    label: 'Test Accuracy',
    value: '99.86%',
    description: 'Evaluated on a held-out test split using stratified sampling for class balance.',
    accent: 'text-emerald-600 bg-emerald-50',
  },
  {
    icon: Database,
    label: 'Dataset',
    value: 'Real vs Fake Faces',
    description: 'Balanced dataset of authentic portraits and GAN-generated synthetic faces at 256×256 resolution.',
    accent: 'text-blue-600 bg-blue-50',
  },
  {
    icon: Layers,
    label: 'Input Size',
    value: '224 × 224 px',
    description: 'Images normalized to ImageNet mean and standard deviation prior to inference.',
    accent: 'text-violet-600 bg-violet-50',
  },
  {
    icon: TrendingUp,
    label: 'AUC-ROC Score',
    value: '0.9994',
    description: 'Near-perfect separation between real and synthetic class distributions.',
    accent: 'text-pink-600 bg-pink-50',
  },
];

const pipeline = [
  { step: '01', title: 'Preprocessing', desc: 'Resize, normalize, and augment input media frames.' },
  { step: '02', title: 'Feature Extraction', desc: 'EfficientNet backbone extracts multi-scale spatial features.' },
  { step: '03', title: 'Classification Head', desc: 'Fully-connected layers with dropout produce binary logits.' },
  { step: '04', title: 'Softmax Output', desc: 'Probability scores for REAL and FAKE classes.' },
];

export default function ModelInfo() {
  return (
    <section className="min-h-screen bg-neutral pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-navy/10 rounded-full px-4 py-1.5 mb-4">
            <FlaskConical className="w-4 h-4 text-navy" />
            <span className="text-navy text-sm font-semibold">Technical Specifications</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-3 tracking-tight">
            Model Architecture & Performance
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            A fine-tuned EfficientNet-B0 classifier achieving state-of-the-art accuracy on binary deepfake detection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {metrics.map(({ icon: Icon, label, value, description, accent }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${accent}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-xl font-bold text-charcoal mb-2">{value}</p>
              <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
          <div className="flex items-center gap-2 mb-8">
            <Award className="w-5 h-5 text-cyan-500" />
            <h3 className="font-bold text-charcoal text-lg">Inference Pipeline</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {pipeline.map(({ step, title, desc }, i) => (
              <div key={step} className="relative">
                {i < pipeline.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-full w-full h-0.5 bg-gradient-to-r from-slate-200 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold mb-3">
                    {step}
                  </div>
                  <h4 className="font-semibold text-charcoal mb-1">{title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-navy rounded-2xl p-8 text-white">
          <h3 className="font-bold text-lg mb-4">API Integration</h3>
          <p className="text-slate-300 text-sm mb-5">
            Connect a prediction backend by replacing the simulation in{' '}
            <code className="text-cyan-400 bg-white/10 px-1.5 py-0.5 rounded font-mono text-xs">UploadPanel.tsx</code>.
            The following endpoint schema is expected:
          </p>
          <div className="bg-black/30 rounded-xl p-5 font-mono text-sm overflow-x-auto">
            <p className="text-slate-400 mb-2">{'// POST /api/predict'}</p>
            <p className="text-slate-200">{'{'}</p>
            <p className="text-slate-200 pl-4">
              <span className="text-cyan-400">"label"</span>
              {': "REAL" | "FAKE",'}
            </p>
            <p className="text-slate-200 pl-4">
              <span className="text-cyan-400">"confidence"</span>
              {': number,    // 0–100'}
            </p>
            <p className="text-slate-200 pl-4">
              <span className="text-cyan-400">"explanation"</span>
              {': string,'}
            </p>
            <p className="text-slate-200 pl-4">
              <span className="text-cyan-400">"heatmap_url"</span>
              {': string | null'}
            </p>
            <p className="text-slate-200">{'}'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
