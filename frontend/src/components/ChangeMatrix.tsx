import { useEffect, useState } from "react";
import { fetchChange } from "@/services/api";
import { Table, LayoutGrid, Percent } from "lucide-react";

interface ChangeMatrixProps {
  startYear: number;
  endYear: number;
}

const LULC_CLASSES = ["Forest", "Water Bodies", "Agriculture", "Barren Land", "Built-up"];

const ChangeMatrix = ({ startYear, endYear }: ChangeMatrixProps) => {
  const [data, setData] = useState<{ area: number[][], percent: number[][] } | null>(null);
  const [viewMode, setViewMode] = useState<"percent" | "area">("percent");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchChange(startYear, endYear);
        if (result && result.matrix_percentage && result.matrix_area) {
          setData({
            area: result.matrix_area,
            percent: result.matrix_percentage
          });
          setTimeout(() => setIsVisible(true), 100);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error("Matrix data fetch error:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [startYear, endYear]);

  const getIntensityColor = (value: number) => {
    // Color intensity based on percentage always for visual consistency
    if (value > 70) return "bg-primary/80 text-primary-foreground";
    if (value > 40) return "bg-primary/50 text-foreground";
    if (value > 20) return "bg-primary/30 text-foreground";
    if (value > 10) return "bg-primary/20 text-foreground";
    if (value > 0.1) return "bg-primary/10 text-muted-foreground";
    return "bg-muted text-muted-foreground/30";
  };

  if (loading) {
    return (
      <div className="chart-container flex items-center justify-center h-96 border border-dashed rounded-xl">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Generating full transition matrix...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="chart-container flex items-center justify-center h-80 border border-dashed rounded-xl bg-muted/5">
        <div className="text-center">
          <p className="text-muted-foreground font-medium">No transition data available</p>
          <p className="text-xs text-muted-foreground/60 mt-1">{startYear} → {endYear}</p>
        </div>
      </div>
    );
  }

  const currentMatrix = viewMode === "percent" ? data.percent : data.area;

  return (
    <div className="chart-container overflow-hidden" id="chart-transition-matrix">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h4 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            Land Use Transition Matrix
          </h4>
          <p className="text-sm text-muted-foreground">
            Analysis of pixel-wise class conversions ({startYear} to {endYear})
          </p>
        </div>

        <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border">
          <button
            onClick={() => setViewMode("percent")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${viewMode === "percent"
              ? "bg-card text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Percent className="w-3.5 h-3.5" />
            Percentage
          </button>
          <button
            onClick={() => setViewMode("area")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${viewMode === "area"
              ? "bg-card text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Table className="w-3.5 h-3.5" />
            Area (Ha)
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[600px]">
          {/* Header Row */}
          <div className="grid grid-cols-6 gap-1.5 mb-2">
            <div className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground p-3 border-b border-border/50">
              Origin \ Destination
            </div>
            {LULC_CLASSES.map((cls) => (
              <div
                key={cls}
                className="text-[10px] font-black uppercase tracking-tighter text-center p-3 text-foreground border-b border-border/50"
              >
                {cls}
              </div>
            ))}
          </div>

          {/* Matrix Rows */}
          {LULC_CLASSES.map((fromClass, i) => (
            <div key={fromClass} className="grid grid-cols-6 gap-1.5 mb-1.5">
              <div className="text-xs font-bold p-3 text-foreground bg-muted/20 rounded-l-lg border-l-2 border-primary/20">
                {fromClass}
              </div>
              {currentMatrix[i]?.map((value, j) => (
                <div
                  key={j}
                  className={`p-3 text-center text-xs font-bold rounded-lg transition-all duration-700 ${isVisible ? getIntensityColor(data.percent[i][j]) : "bg-muted shadow-inner"
                    }`}
                  style={{
                    transitionDelay: `${(i * 5 + j) * 20}ms`,
                    opacity: isVisible ? 1 : 0,
                  }}
                >
                  {viewMode === "percent" ? `${value.toFixed(1)}%` : value.toLocaleString()}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Insight Footer */}
      <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <LayoutGrid className="w-4 h-4 text-primary" />
          </div>
          <div className="text-sm">
            <span className="font-bold text-foreground block mb-1">How to read this matrix:</span>
            <p className="text-muted-foreground leading-relaxed">
              Rows represent the land use in <strong>{startYear}</strong>, and columns represent the land use in <strong>{endYear}</strong>.
              The diagonal represents unchanged area, while off-diagonal cells show exactly which land types were converted (Transition Intelligence).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeMatrix;
