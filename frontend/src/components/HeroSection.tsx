import { ChevronDown, Satellite, BarChart3, Download } from "lucide-react";
import earthHero from "@/assets/earth-hero.jpg";

interface HeroSectionProps {
  onStartAnalysis: () => void;
  onViewMethodology: () => void;
}

const HeroSection = ({ onStartAnalysis, onViewMethodology }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={earthHero}
          alt="Earth from space"
          className="w-full h-full object-cover animate-pulse-slow"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-container text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
          <Satellite className="w-4 h-4 text-primary-foreground" />
          <span className="text-sm font-medium text-white/90">AI-Powered Urban Intelligence</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-delay-1 leading-tight">
          Understanding Urban Change
          <br />
          <span className="text-primary-foreground/80">from Space</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 animate-fade-in-delay-2 leading-relaxed">
          AI-powered land use intelligence with confidence insights for Tirupati District.
          Track changes, measure confidence, make informed decisions.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-3">
          <button onClick={onStartAnalysis} className="btn-hero group">
            <span className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Start Analysis
            </span>
          </button>
          <button onClick={onViewMethodology} className="btn-secondary-hero">
            View Methodology
          </button>
        </div>

        {/* Stats Preview - REMOVED MOCK DATA */}
        {/* <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in-delay-3">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">5+</div>
            <div className="text-sm text-white/60">Land Classes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">7</div>
            <div className="text-sm text-white/60">Years of Data</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">Pixel</div>
            <div className="text-sm text-white/60">Level Analysis</div>
          </div>
        </div> */}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={onStartAnalysis}
          className="flex flex-col items-center gap-2 text-white/60 hover:text-white/80 transition-colors scroll-indicator"
        >
          <span className="text-xs uppercase tracking-wider">Explore</span>
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
