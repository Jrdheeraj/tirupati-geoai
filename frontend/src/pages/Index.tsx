import { useState, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import TimelineInput from "@/components/TimelineInput";
import MapViewer from "@/components/MapViewer";
import LandUseChart from "@/components/LandUseChart";
import ChangeMatrix from "@/components/ChangeMatrix";
import ConfidenceCards from "@/components/ConfidenceCards";
import ConfidenceByClass from "@/components/ConfidenceByClass";
import ChangeConfidence from "@/components/ChangeConfidence";
import ExportSection from "@/components/ExportSection";
import InsightsPanel from "@/components/InsightsPanel";
import MethodologySection from "@/components/MethodologySection";
import { Satellite, MapPin, BarChart3, Shield } from "lucide-react";

const Index = () => {
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYears, setSelectedYears] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const analysisRef = useRef<HTMLDivElement>(null);
  const methodologyRef = useRef<HTMLDivElement>(null);

  const handleStartAnalysis = () => {
    analysisRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleViewMethodology = () => {
    methodologyRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAnalyze = (start: number, end: number) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSelectedYears({ start, end });
      setAnalysisStarted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Satellite className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">GeoAI Tirupati</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={handleStartAnalysis}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Analysis
              </button>
              <button
                onClick={handleViewMethodology}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Methodology
              </button>
              <a
                href="#export"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Export
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* WEBSITE 1: Immersive Landing */}
      <HeroSection
        onStartAnalysis={handleStartAnalysis}
        onViewMethodology={handleViewMethodology}
      />

      {/* WEBSITE 2: Interactive Analysis */}
      <section ref={analysisRef} className="story-section">
        <div className="section-container">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <BarChart3 className="w-4 h-4" />
              Interactive Analysis
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore Land Use Changes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select a time period and discover how Tirupati District has
              transformed over the years.
            </p>
          </div>

          {/* Timeline Input */}
          <TimelineInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>
      </section>

      {/* Analysis Results */}
      {analysisStarted && selectedYears && (
        <>
          {/* Map Comparison */}
          <section className="story-section bg-muted/30">
            <div className="section-container">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">
                  <MapPin className="w-4 h-4" />
                  Spatial Comparison
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Before & After
                </h2>
                <p className="text-lg text-muted-foreground">
                  Compare land use patterns between {selectedYears.start} and{" "}
                  {selectedYears.end}
                </p>
              </div>

              <MapViewer
                startYear={selectedYears.start}
                endYear={selectedYears.end}
                showOverlay={showOverlay}
                onToggleOverlay={() => setShowOverlay(!showOverlay)}
              />
            </div>
          </section>

          {/* Story-Driven Analytics */}
          <section className="story-section">
            <div className="section-container">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                  <Shield className="w-4 h-4" />
                  Deep Analytics
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Understanding the Data
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Progressive insights from land distribution to AI confidence metrics
                </p>
              </div>

              <div className="space-y-12">
                {/* Row 1: Land Use Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="animate-fade-in-up">
                    <LandUseChart year={selectedYears.start} />
                  </div>
                  <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <LandUseChart year={selectedYears.end} />
                  </div>
                </div>

                {/* Row 2: Change Matrix */}
                <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  <ChangeMatrix
                    startYear={selectedYears.start}
                    endYear={selectedYears.end}
                  />
                </div>

                {/* AI Insights Panel */}
                <div className="animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
                  <InsightsPanel
                    startYear={selectedYears.start}
                    endYear={selectedYears.end}
                  />
                </div>

                {/* Row 3: Confidence Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                    <ConfidenceCards year={selectedYears.end} />
                  </div>
                  <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                    <ConfidenceByClass year={selectedYears.end} />
                  </div>
                </div>

                {/* Row 4: Hero - Change Confidence */}
                <div className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
                  <ChangeConfidence
                    startYear={selectedYears.start}
                    endYear={selectedYears.end}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* WEBSITE 3: Export Section */}
          <div id="export">
            <ExportSection
              startYear={selectedYears.start}
              endYear={selectedYears.end}
            />
          </div>
        </>
      )}

      {/* Methodology Section */}
      <div ref={methodologyRef}>
        <MethodologySection />
      </div>

      {/* Footer */}
      <footer className="py-12 bg-foreground text-background">
        <div className="section-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Satellite className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold">GeoAI Tirupati</span>
            </div>
            <p className="text-sm text-background/60 text-center">
              AI-Powered Urban Intelligence Platform for Sustainable Development
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
