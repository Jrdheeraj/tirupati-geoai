import { useEffect, useState } from "react";
import { Check, X, Shield, AlertTriangle } from "lucide-react";
import { fetchChangeConfidence } from "@/services/api";

interface ChangeConfidenceProps {
  startYear: number;
  endYear: number;
}

const ChangeConfidence = ({ startYear, endYear }: ChangeConfidenceProps) => {
  const [data, setData] = useState<{ changed: number; unchanged: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchChangeConfidence(startYear, endYear);
        if (result && result.changed && result.unchanged) {
          const norm = (v: number | null) => {
            if (v === null) return 0;
            return v <= 1.0 ? v * 100 : v;
          };
          setData({
            changed: norm(result.changed.mean_confidence),
            unchanged: norm(result.unchanged.mean_confidence),
          });
        } else {
          setData(null);
        }
      } catch (err) {
        console.error("Change confidence fetch error:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [startYear, endYear]);

  if (loading) {
    return (
      <div className="chart-container flex flex-col items-center justify-center h-80 border border-dashed rounded-xl">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Analyzing detecting change trust...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="chart-container flex flex-col items-center justify-center h-80 border border-dashed rounded-xl bg-muted/5">
        <p className="text-muted-foreground font-medium">Change trust analysis unavailable</p>
        <p className="text-xs text-muted-foreground/60 mt-1">{startYear} → {endYear}</p>
      </div>
    );
  }

  const { changed: changedConfidence, unchanged: unchangedConfidence } = data;
  const diff = unchangedConfidence - changedConfidence;

  // Placeholders for area percentages since endpoint doesn't return total area comparison directly in this view, 
  // or we can just hide the % of total area if not available.
  // The endpoint returns pixel_count, so we could calculate it if we knew total pixels.
  // For now, removing the "of total area" part or hardcoding placeholders is safer than guessing.
  // Let's just hide the "of total area" part.

  return (
    <div className="chart-container bg-gradient-to-br from-card to-muted/30" id="chart-change-confidence">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Shield className="w-4 h-4" />
          Key Metric
        </div>
        <h4 className="text-2xl font-bold text-foreground mb-2">
          Trust in Detected Change
        </h4>
        <p className="text-muted-foreground">
          Comparing AI confidence: Changed vs Unchanged areas ({startYear} → {endYear})
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Changed Areas */}
        <div className="relative p-6 rounded-xl bg-destructive/5 border border-destructive/20">
          <div className="absolute -top-4 left-4 px-3 py-1 rounded-full bg-card border border-destructive/30 text-sm font-medium text-destructive flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Changed Areas
          </div>

          <div className="mt-4 text-center">
            <div className="text-5xl font-bold text-foreground mb-2">
              {changedConfidence.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              Confidence Score
            </div>

            {/* Visual Progress */}
            <div className="relative h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-destructive/70 to-destructive rounded-full transition-all duration-1000"
                style={{ width: `${changedConfidence * 100}%` }}
              />
            </div>

            {/* Removed % of total area placeholder */}
          </div>
        </div>

        {/* Unchanged Areas */}
        <div className="relative p-6 rounded-xl bg-primary/5 border border-primary/20">
          <div className="absolute -top-4 left-4 px-3 py-1 rounded-full bg-card border border-primary/30 text-sm font-medium text-primary flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            Unchanged Areas
          </div>

          <div className="mt-4 text-center">
            <div className="text-5xl font-bold text-foreground mb-2">
              {unchangedConfidence.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              Mean Confidence
            </div>

            {/* Visual Progress */}
            <div className="relative h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/70 to-primary rounded-full transition-all duration-1000"
                style={{ width: `${unchangedConfidence * 100}%` }}
              />
            </div>

            {/* Removed % of total area placeholder */}
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h5 className="font-medium text-foreground mb-1">Key Insight</h5>
            <p className="text-sm text-muted-foreground">
              The AI shows{" "}
              <span className="font-medium text-foreground">
                {Math.abs(diff).toFixed(2)} higher confidence
              </span>{" "}
              in {diff > 0 ? "unchanged" : "changed"} areas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeConfidence;
