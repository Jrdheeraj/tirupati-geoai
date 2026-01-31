import { TreePine, Droplets, Wheat, Mountain, Building2 } from "lucide-react";

interface LegendProps {
  vertical?: boolean;
}

const LULC_CLASSES = [
  { name: "Forest", color: "bg-lulc-forest", icon: TreePine },
  { name: "Water Bodies", color: "bg-lulc-water", icon: Droplets },
  { name: "Agriculture", color: "bg-lulc-agriculture", icon: Wheat },
  { name: "Barren Land", color: "bg-lulc-barren", icon: Mountain },
  { name: "Built-up", color: "bg-lulc-builtup", icon: Building2 },
];

const MapLegend = ({ vertical = false }: LegendProps) => {
  return (
    <div
      className={`glass-card rounded-xl p-4 ${
        vertical ? "flex flex-col gap-3" : "flex flex-wrap gap-4"
      }`}
    >
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
        Land Use Classes
      </span>
      {LULC_CLASSES.map((lulcClass) => (
        <div key={lulcClass.name} className="legend-item">
          <div
            className={`w-4 h-4 rounded ${lulcClass.color} flex items-center justify-center`}
          >
            <lulcClass.icon className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="text-sm text-foreground">{lulcClass.name}</span>
        </div>
      ))}
    </div>
  );
};

export default MapLegend;
