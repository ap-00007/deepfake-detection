import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UploadPanel from './components/UploadPanel';
import ModelInfo from './components/ModelInfo';
import About from './components/About';
import Footer from './components/Footer';
import { ActiveSection } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('home');

  const handleNavigate = (section: ActiveSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <Hero onNavigate={handleNavigate} />;
      case 'upload':
        return <UploadPanel />;
      case 'model':
        return <ModelInfo />;
      case 'about':
        return <About />;
      default:
        return <Hero onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral font-sans">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
      <main>{renderSection()}</main>
      <Footer />
    </div>
  );
}
