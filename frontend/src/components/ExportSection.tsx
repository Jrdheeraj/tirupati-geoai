import { Download, FileImage, FileText, FileSpreadsheet, Camera } from "lucide-react";
import { toast } from "sonner";
import { fetchLULC, fetchChange } from "@/services/api";
import { toPng } from "html-to-image";
import html2canvas from "html2canvas";

interface ExportSectionProps {
  startYear: number;
  endYear: number;
}

const ExportSection = ({ startYear, endYear }: ExportSectionProps) => {
  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  const handleExport = async (type: string) => {
    try {
      if (type === "CSV Data") {
        const lulcData = await fetchLULC(endYear);
        if (!lulcData) throw new Error("No data available");

        const csvContent = "data:text/csv;charset=utf-8," +
          "Class,Area (Ha),Percentage\n" +
          lulcData.stats.map(s => `${s.class_name},${s.area_ha},${s.percentage}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `tirupati_lulc_stats_${endYear}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV Data exported successfully");
      }
      else if (type === "JSON Data") {
        const changeData = await fetchChange(startYear, endYear);
        const blob = new Blob([JSON.stringify(changeData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `tirupati_change_analysis_${startYear}_${endYear}.json`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("JSON Data exported successfully");
      }
      else if (type === "Chart Images") {
        toast.info("Generating high-resolution charts...");
        const charts = [
          { id: `chart-lulc-${startYear}`, name: `lulc_distribution_${startYear}.png` },
          { id: `chart-lulc-${endYear}`, name: `lulc_distribution_${endYear}.png` },
          { id: "chart-transition-matrix", name: `transition_matrix_${startYear}_${endYear}.png` },
          { id: `chart-confidence-summary-${endYear}`, name: `confidence_metrics_${endYear}.png` },
          { id: "chart-change-confidence", name: `change_detection_trust_${startYear}_${endYear}.png` },
          { id: "chart-ai-insights", name: `ai_driven_insights_${startYear}_${endYear}.png` }
        ];

        let successCount = 0;
        for (const chart of charts) {
          const el = document.getElementById(chart.id);
          if (el) {
            // High resolution capture
            const dataUrl = await toPng(el, {
              pixelRatio: 2,
              backgroundColor: "#ffffff",
              style: {
                borderRadius: '0' // For cleaner edges in export
              }
            });
            downloadImage(dataUrl, chart.name);
            successCount++;
          }
        }

        if (successCount > 0) {
          toast.success(`${successCount} charts exported successfully`);
        } else {
          toast.error("No visible charts found to export. Please ensure analysis is active.");
        }
      }
      else if (type === "Map Snapshot") {
        toast.info("Preparing map snapshot...");
        const mapArea = document.getElementById("map-snapshot-area");
        if (!mapArea) {
          throw new Error("Map analysis area not found");
        }

        // Wait a bit for Leaflet tiles and layers to stabilize
        await new Promise(resolve => setTimeout(resolve, 800));

        const canvas = await html2canvas(mapArea, {
          useCORS: true,
          scale: 2,
          backgroundColor: "#ffffff",
          logging: false,
          ignoreElements: (el) => el.tagName === "BUTTON" || (el.classList && el.classList.contains('leaflet-control-zoom'))
        });

        const dataUrl = canvas.toDataURL("image/png");
        downloadImage(dataUrl, `map_snapshot_${startYear}_${endYear}.png`);
        toast.success("Map snapshot saved successfully");
      }
    } catch (err) {
      console.error("Export error:", err);
      toast.error(`Export failed: ${err instanceof Error ? err.message : "Unknown error"}. Please ensure all layers are loaded.`);
    }
  };

  const exportOptions = [
    {
      id: "report",
      title: "Download JSON",
      description: "Full analytical breakdown in machine-readable format",
      icon: FileText,
      action: () => handleExport("JSON Data"),
      primary: true,
    },
    {
      id: "data",
      title: "Export CSV",
      description: "Class distribution tables for spreadsheet tools",
      icon: FileSpreadsheet,
      action: () => handleExport("CSV Data"),
      primary: false,
    },
    {
      id: "charts",
      title: "Export Charts",
      description: "High-resolution PNG charts with labels and legends",
      icon: FileImage,
      action: () => handleExport("Chart Images"),
      primary: false,
    },
    {
      id: "snapshot",
      title: "Save Snapshot",
      description: "Current map view with all active overlays",
      icon: Camera,
      action: () => handleExport("Map Snapshot"),
      primary: false,
    },
  ];

  return (
    <section className="story-section bg-muted/30">
      <div className="section-container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
            <Download className="w-4 h-4" />
            Export & Share
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Take Your Insights Further
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Export your analysis for {startYear}–{endYear} in multiple formats for
            presentations, reports, or further analysis.
          </p>
        </div>

        {/* Report Summary Card */}
        <div className="glass-card rounded-2xl p-8 mb-8 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Report Contents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Selected Timeline: {startYear} → {endYear}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Land Use Distribution Charts</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Change Transition Matrix</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Confidence Metrics & Analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Key Findings Summary</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Visual Map Comparisons</span>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {exportOptions.map((option) => (
            <button
              key={option.id}
              onClick={option.action}
              className={`p-6 rounded-xl text-left transition-all duration-300 card-hover ${option.primary
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border border-border hover:border-primary/30"
                }`}
            >
              <option.icon
                className={`w-8 h-8 mb-4 ${option.primary ? "text-primary-foreground" : "text-primary"
                  }`}
              />
              <h4
                className={`font-semibold mb-2 ${option.primary ? "text-primary-foreground" : "text-foreground"
                  }`}
              >
                {option.title}
              </h4>
              <p
                className={`text-sm ${option.primary
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground"
                  }`}
              >
                {option.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExportSection;
