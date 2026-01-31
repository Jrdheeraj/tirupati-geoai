import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { fetchLULC } from "@/services/api";
import { LULCStats } from "@/types/api";

interface LandUseChartProps {
  year: number;
}

const LULC_COLORS = {
  Forest: "hsl(142, 50%, 35%)",
  "Water Bodies": "hsl(205, 70%, 45%)",
  Agriculture: "hsl(95, 55%, 45%)",
  "Barren Land": "hsl(35, 40%, 55%)",
  "Built-up": "hsl(0, 0%, 45%)",
};

const LandUseChart = ({ year }: LandUseChartProps) => {
  const [chartData, setChartData] = useState<LULCStats[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchLULC(year);
        if (data && data.stats && data.stats.length > 0) {
          setChartData(data.stats);
        } else {
          setChartData([]);
        }
      } catch (err) {
        console.error("Chart data fetch error:", err);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [year]);

  if (loading) {
    return (
      <div className="chart-container flex items-center justify-center h-64 border border-dashed rounded-xl">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading land use data...</p>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="chart-container flex items-center justify-center h-64 border border-dashed rounded-xl bg-muted/5">
        <div className="text-center">
          <p className="text-muted-foreground font-medium">No land use data available</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Year: {year}</p>
        </div>
      </div>
    );
  }



  return (
    <div className="chart-container" id={`chart-lulc-${year}`}>
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-foreground mb-1">
          How Land Was Used
        </h4>
        <p className="text-sm text-muted-foreground">
          Land use distribution in {year}
        </p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 80, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              dataKey="class_name"
              type="category"
              tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
              width={75}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, "Coverage"]}
            />
            <Bar
              dataKey="percentage"
              radius={[0, 4, 4, 0]}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={LULC_COLORS[entry.class_name as keyof typeof LULC_COLORS] || "hsl(var(--muted))"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LandUseChart;
