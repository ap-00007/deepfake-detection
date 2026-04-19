import { useState } from 'react';
import { Shield, Menu, X } from 'lucide-react';
import { ActiveSection } from '../types';

type NavbarProps = {
  activeSection: ActiveSection;
  onNavigate: (section: ActiveSection) => void;
};

const navLinks: { label: string; id: ActiveSection }[] = [
  { label: 'Home', id: 'home' },
  { label: 'Upload', id: 'upload' },
  { label: 'About', id: 'about' },
  { label: 'Model Info', id: 'model' },
];

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center group-hover:bg-cyan-400/30 transition-colors">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            Deepfake Detection System
          </span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeSection === link.id
                  ? 'bg-cyan-400/20 text-cyan-400'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <button
          className="md:hidden text-slate-300 hover:text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-navy px-6 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileOpen(false);
              }}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all duration-200 ${
                activeSection === link.id
                  ? 'bg-cyan-400/20 text-cyan-400'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
