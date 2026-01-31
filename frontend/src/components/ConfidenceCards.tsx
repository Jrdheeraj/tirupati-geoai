
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchConfidence } from "@/services/api";
import { ConfidenceSummaryResponse } from "@/types/api";

interface ConfidenceCardsProps {
  year: number;
}

interface ConfidenceData {
  metric: string;
  value: number;
  trend: "up" | "down" | "stable";
  description: string;
}

const ConfidenceCards = ({ year }: ConfidenceCardsProps) => {
  const [stats, setStats] = useState<ConfidenceSummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchConfidence(year);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch confidence data:", error);
        setStats(null); // Ensure stats is null on error
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [year]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-confidence-high" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-confidence-low" />;
      default:
        return <Minus className="w-4 h-4 text-confidence-medium" />;
    }
  };

  const getConfidenceLevel = (value: number) => {
    if (value >= 0.85) return "confidence-high";
    if (value >= 0.7) return "confidence-medium";
    return "confidence-low";
  };

  if (loading) {
    return (
      <div className="chart-container flex flex-col items-center justify-center h-80 border border-dashed rounded-xl">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Loading confidence metrics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="chart-container flex flex-col items-center justify-center h-80 border border-dashed rounded-xl bg-muted/5">
        <p className="text-muted-foreground font-medium">Confidence metrics unavailable</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Year: {year}</p>
      </div>
    );
  }

  const data: ConfidenceData[] = [
    {
      metric: "Mean Confidence",
      value: stats.mean,
      trend: "stable",
      description: "Average confidence across all pixels",
    },
    {
      metric: "Valid Pixels",
      value: stats.valid_pixels,
      trend: "stable",
      description: "Number of classified pixels",
    },
    {
      metric: "Coverage",
      value: stats.coverage_percent,
      trend: "stable",
      description: "Percentage of area with valid confidence",
    },
    {
      metric: "Median Confidence",
      value: stats.median,
      trend: "stable",
      description: "Median confidence score",
    }
  ];

  return (
    <div className="chart-container" id={`chart-confidence-summary-${year}`}>
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-foreground mb-1">
          How Confident is the AI
        </h4>
        <p className="text-sm text-muted-foreground">
          Model confidence metrics for {year}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div
            key={item.metric}
            className="p-4 rounded-lg bg-muted/50 border border-border animate-fade-in"
            style={{ animationDelay: `${index * 100} ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {item.metric}
                </span>
                <div className="group relative">
                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {item.description}
                  </div>
                </div>
              </div>
              {getTrendIcon(item.trend)}
            </div>

            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-foreground">
                {item.metric === "Valid Pixels"
                  ? item.value.toLocaleString()
                  : item.value.toFixed(2)}
              </span>
              {/* Confidence badge only for confidence metrics */}
              {item.metric.includes("Confidence") && (
                <span
                  className={`text - xs px - 2 py - 1 rounded - full ${getConfidenceLevel(item.value)} `}
                >
                  {getConfidenceLevel(item.value) === "confidence-high" ? "High" :
                    getConfidenceLevel(item.value) === "confidence-medium" ? "Medium" : "Low"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfidenceCards;
