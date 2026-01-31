// Backend API Response Types

export interface LULCStats {
    class_name: string;
    area_ha: number;
    percentage: number;
}

export interface LULCResponse {
    total_area_ha: number;
    stats: LULCStats[];
    // Fallback for handling empty data
    error?: string;
}

export interface ChangeBreakdown {
    from_class: string;
    to_class: string;
    area_ha: number;
}

export interface ChangeResponse {
    matrix_area: number[][];
    matrix_percentage: number[][];
    breakdown: ChangeBreakdown[];
}

export interface ConfidenceSummaryResponse {
    year: number;
    min: number;
    max: number;
    mean: number;
    median: number;
    valid_pixels: number;
    total_pixels: number;
    coverage_percent: number;
}

export interface ConfidenceClassStat {
    mean_confidence: number | null;
    pixel_count: number;
}

export interface ConfidenceByClassResponse {
    year: number;
    [key: string]: number | ConfidenceClassStat | undefined; // Allow dynamic class keys
    // Specific keys we expect (optional because they might be missing in some years)
    Forest?: ConfidenceClassStat;
    "Water Bodies"?: ConfidenceClassStat;
    Agriculture?: ConfidenceClassStat;
    "Barren Land"?: ConfidenceClassStat;
    "Built-up"?: ConfidenceClassStat;
}

export interface ConfidenceChangeStat {
    mean_confidence: number | null;
    pixel_count: number;
}

export interface ChangeConfidenceResponse {
    period: string;
    changed: ConfidenceChangeStat;
    unchanged: ConfidenceChangeStat;
}
