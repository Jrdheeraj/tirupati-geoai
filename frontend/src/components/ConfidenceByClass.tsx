import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { useEffect, useState } from "react";
import { fetchConfidenceByClass } from "@/services/api";

interface ConfidenceByClassProps {
  year: number;
}

interface ConfidenceItem {
  class: string;
  confidence: number;
}

const getConfidenceColor = (value: number) => {
  if (value >= 90) return "hsl(var(--confidence-high))";
  if (value >= 80) return "hsl(var(--confidence-medium))";
  return "hsl(var(--confidence-low))";
};

const ConfidenceByClass = ({ year }: ConfidenceByClassProps) => {
  const [data, setData] = useState<ConfidenceItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchConfidenceByClass(year);

        if (result) {
          // Normalize function: if values are 0-1, scale to 0-100. 
          // If they are class IDs (1-5), we leave them but they'll look low (intentional to signal data issue).
          const norm = (v: number | undefined) => {
            if (v === undefined) return 0;
            return v <= 1.0 ? v * 100 : v;
          };

          const chartData: ConfidenceItem[] = [
            { class: "Forest", confidence: norm(result.Forest?.mean_confidence) },
            { class: "Water", confidence: norm(result["Water Bodies"]?.mean_confidence) },
            { class: "Agriculture", confidence: norm(result.Agriculture?.mean_confidence) },
            { class: "Barren", confidence: norm(result["Barren Land"]?.mean_confidence) },
            { class: "Built-up", confidence: norm(result["Built-up"]?.mean_confidence) },
          ];
          setData(chartData);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Failed to fetch confidence by class:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [year]);

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed rounded-xl">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Loading reliability stats...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed rounded-xl bg-muted/5">
        <p className="text-muted-foreground font-medium">No reliability data available</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Year: {year}</p>
      </div>
    );
  }

  return (
    <div className="chart-container" id={`chart-confidence-class-${year}`}>
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-foreground mb-1">
          Which Land Types Are Reliable
        </h4>
        <p className="text-sm text-muted-foreground">
          Classification confidence by land use class ({year})
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="class"
              tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
            />
            <YAxis
              domain={[60, 100]}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, "Confidence"]}
            />
            <ReferenceLine
              y={85}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              label={{
                value: "Target: 85%",
                position: "right",
                fill: "hsl(var(--muted-foreground))",
                fontSize: 10,
              }}
            />
            <Bar dataKey="confidence" radius={[4, 4, 0, 0]} animationDuration={800}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getConfidenceColor(entry.confidence)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-confidence-high" />
          <span>≥90% (High)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-confidence-medium" />
          <span>80–89% (Medium)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-confidence-low" />
          <span>&lt;80% (Low)</span>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceByClass;
