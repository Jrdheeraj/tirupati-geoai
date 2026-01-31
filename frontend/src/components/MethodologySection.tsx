import { Book, GitBranch, Database, Brain } from "lucide-react";

const MethodologySection = () => {
  const steps = [
    {
      icon: Database,
      title: "Data Acquisition",
      description:
        "Satellite imagery from Landsat and Sentinel missions covering Tirupati District from 2018–2025.",
    },
    {
      icon: Brain,
      title: "AI Classification",
      description:
        "Deep learning models classify each pixel into five land-use categories using spatial–spectral features.",
    },
    {
      icon: GitBranch,
      title: "Change Detection",
      description:
        "Pixel-level post-classification comparison identifies land-use transitions across selected timelines.",
    },
    {
      icon: Book,
      title: "Confidence Analysis",
      description:
        "AI confidence scores quantify prediction reliability and change trustworthiness for decision support.",
    },
  ];

  return (
    <section id="methodology" className="story-section bg-card">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Methodology
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A structured GeoAI workflow combining satellite remote sensing,
            machine learning, and spatial analytics.
          </p>
        </div>

        {/* Methodology Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative p-6 rounded-xl bg-muted/50 border border-border card-hover"
            >
              {/* Step Number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>

              <step.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
