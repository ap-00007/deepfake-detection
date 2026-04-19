export type PredictionResult = {
  label: 'REAL' | 'FAKE';
  real_score: number;
  fake_score: number;
  explanation: string;
  heatmap?: string;
};

export type UploadedFile = {
  file: File;
  previewUrl: string;
  type: 'image' | 'video';
};

export type NavLink = {
  label: string;
  href: string;
};

export type ActiveSection = 'home' | 'upload' | 'about' | 'model';
