import { useEffect, useState } from "react";
import { Brain, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { fetchChange } from "@/services/api";

interface InsightsPanelProps {
    startYear: number;
    endYear: number;
}

const InsightsPanel = ({ startYear, endYear }: InsightsPanelProps) => {
    const [insightData, setInsightData] = useState<{
        stability: string;
        expansion: string;
        transition: string;
        footprint: string;
        loading: boolean;
    }>({
        stability: "",
        expansion: "",
        transition: "",
        footprint: "",
        loading: true,
    });

    useEffect(() => {
        const generateInsights = async () => {
            try {
                const data = await fetchChange(startYear, endYear);
                if (!data || !data.matrix_area) return;

                const classes = ["Forest", "Water Bodies", "Agriculture", "Barren Land", "Built-up"];
                const matrix = data.matrix_area;

                // 1. Stability: Which class had the highest retention (diagonal / row sum)
                let maxRetention = -1;
                let stableClass = "";
                matrix.forEach((row, i) => {
                    const rowSum = row.reduce((a, b) => a + b, 0);
                    const retention = rowSum > 0 ? row[i] / rowSum : 0;
                    if (retention > maxRetention) {
                        maxRetention = retention;
                        stableClass = classes[i];
                    }
                });

                // 2. Urban Expansion: Growth of Built-up
                const builtupIdx = 4;
                const builtupStart = matrix[builtupIdx].reduce((a, b) => a + b, 0);
                const builtupEnd = matrix.reduce((sum, row) => sum + row[builtupIdx], 0);
                const expansionHa = builtupEnd - builtupStart;

                // 3. Dominant Transition: Largest off-diagonal element
                let maxTrans = -1;
                let fromClass = "", toClass = "";
                matrix.forEach((row, i) => {
                    row.forEach((val, j) => {
                        if (i !== j && val > maxTrans) {
                            maxTrans = val;
                            fromClass = classes[i];
                            toClass = classes[j];
                        }
                    });
                });

                // 4. Net Footprint Change for Ecology (Forest + Agriculture)
                const forestIdx = 0;
                const agriIdx = 2;
                const forestStart = matrix[forestIdx].reduce((a, b) => a + b, 0);
                const forestEnd = matrix.reduce((sum, row) => sum + row[forestIdx], 0);
                const forestDiff = forestEnd - forestStart;

                const agriStart = matrix[agriIdx].reduce((a, b) => a + b, 0);
                const agriEnd = matrix.reduce((sum, row) => sum + row[agriIdx], 0);
                const agriDiff = agriEnd - agriStart;

                setInsightData({
                    stability: `${stableClass} remains the most stable land class with ${(maxRetention * 100).toFixed(1)}% retention.`,
                    expansion: expansionHa > 0
                        ? `Tirupati experienced an urban expansion of ${expansionHa.toLocaleString()} hectares in built-up area.`
                        : `Urban footprint remained relatively stable with minor shifts in infrastructure.`,
                    transition: maxTrans > 0
                        ? `The most significant landscape shift was the conversion of ${fromClass} to ${toClass}.`
                        : "No significant inter-class transitions were detected in this period.",
                    footprint: `Net Footprint: Forest (${forestDiff > 0 ? '+' : ''}${forestDiff.toLocaleString()} Ha), Agriculture (${agriDiff > 0 ? '+' : ''}${agriDiff.toLocaleString()} Ha)`,
                    loading: false,
                });
            } catch (err) {
                console.error("Insight generation error:", err);
                setInsightData(prev => ({ ...prev, loading: false }));
            }
        };

        generateInsights();
    }, [startYear, endYear]);

    if (insightData.loading) return null;

    const insights = [
        {
            icon: ShieldCheck,
            title: "Land Stability",
            text: insightData.stability,
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
        {
            icon: TrendingUp,
            title: "Urban Dynamics",
            text: insightData.expansion,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            icon: Zap,
            title: "Primary Transition",
            text: insightData.transition,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
    ];

    return (
        <div className="glass-card rounded-2xl p-8 border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent" id="chart-ai-insights">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <Brain className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-foreground">AI Intelligence Insights</h3>
                        <p className="text-sm text-muted-foreground">Automated behavioral analysis of Tirupati's landscape</p>
                    </div>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
                    {insightData.footprint}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {insights.map((insight) => (
                    <div key={insight.title} className="flex flex-col gap-3">
                        <div className={`w-10 h-10 rounded-lg ${insight.bg} flex items-center justify-center`}>
                            <insight.icon className={`w-5 h-5 ${insight.color}`} />
                        </div>
                        <h4 className="font-bold text-foreground">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {insight.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InsightsPanel;
