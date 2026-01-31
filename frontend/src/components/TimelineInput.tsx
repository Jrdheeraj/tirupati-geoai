import { useState } from "react";
import { ArrowRight, AlertCircle } from "lucide-react";

interface TimelineInputProps {
  onAnalyze: (startYear: number, endYear: number) => void;
  isLoading?: boolean;
}

const VALID_PAIRS = [
  { start: 2018, end: 2025 },
  { start: 2019, end: 2024 },
];

const TimelineInput = ({ onAnalyze, isLoading = false }: TimelineInputProps) => {
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateAndAnalyze = () => {
    const start = parseInt(startYear);
    const end = parseInt(endYear);

    if (isNaN(start) || isNaN(end)) {
      setError("Please enter valid years");
      return;
    }

    const isValidPair = VALID_PAIRS.some(
      (pair) => pair.start === start && pair.end === end
    );

    if (!isValidPair) {
      setError("Valid combinations: 2018→2025 or 2019→2024");
      return;
    }

    setError(null);
    onAnalyze(start, end);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      validateAndAnalyze();
    }
  };

  return (
    <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Select Analysis Timeline
        </h3>
        <p className="text-muted-foreground">
          Enter the start and end years to analyze land use changes
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Start Year
          </label>
          <input
            type="text"
            placeholder="e.g., 2018"
            value={startYear}
            onChange={(e) => {
              setStartYear(e.target.value.replace(/\D/g, "").slice(0, 4));
              setError(null);
            }}
            onKeyPress={handleKeyPress}
            className="input-premium w-full text-center"
            maxLength={4}
          />
        </div>

        <ArrowRight className="w-6 h-6 text-muted-foreground hidden sm:block mt-6" />

        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            End Year
          </label>
          <input
            type="text"
            placeholder="e.g., 2025"
            value={endYear}
            onChange={(e) => {
              setEndYear(e.target.value.replace(/\D/g, "").slice(0, 4));
              setError(null);
            }}
            onKeyPress={handleKeyPress}
            className="input-premium w-full text-center"
            maxLength={4}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-destructive mb-6 justify-center animate-fade-in">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Hint */}
      <div className="text-center text-sm text-muted-foreground mb-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted">
          Valid: 2018 → 2025 or 2019 → 2024
        </span>
      </div>

      {/* Analyze Button */}
      <button
        onClick={validateAndAnalyze}
        disabled={isLoading || !startYear || !endYear}
        className="btn-hero w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Analyzing...
          </span>
        ) : (
          "Analyze Land Use Change"
        )}
      </button>
    </div>
  );
};

export default TimelineInput;
