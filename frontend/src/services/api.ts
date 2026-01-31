import axios from "axios";
import {
    LULCResponse,
    ChangeResponse,
    ConfidenceSummaryResponse,
    ConfidenceByClassResponse,
    ChangeConfidenceResponse,
} from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const fetchLULC = async (year: number): Promise<LULCResponse | null> => {
    try {
        const response = await api.get<LULCResponse>(`/lulc/${year}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching LULC data for ${year}:`, error);
        return null;
    }
};

export const fetchChange = async (
    startYear: number,
    endYear: number
): Promise<ChangeResponse | null> => {
    try {
        const response = await api.get<ChangeResponse>(`/change/${startYear}/${endYear}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching change data for ${startYear}-${endYear}:`, error);
        return null;
    }
};

export const fetchConfidence = async (
    year: number
): Promise<ConfidenceSummaryResponse | null> => {
    try {
        const response = await api.get<ConfidenceSummaryResponse>(`/confidence/${year}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching confidence summary for ${year}:`, error);
        return null;
    }
};

export const fetchConfidenceByClass = async (
    year: number
): Promise<ConfidenceByClassResponse | null> => {
    try {
        const response = await api.get<ConfidenceByClassResponse>(
            `/confidence/lulc/${year}`
        );
        return response.data;
    } catch (error) {
        console.error(`Error fetching confidence by class for ${year}:`, error);
        return null;
    }
};

export const fetchChangeConfidence = async (
    startYear: number,
    endYear: number
): Promise<ChangeConfidenceResponse | null> => {
    try {
        const response = await api.get<ChangeConfidenceResponse>(
            `/confidence/change/${startYear}/${endYear}`
        );
        return response.data;
    } catch (error) {
        console.error(
            `Error fetching change confidence for ${startYear}-${endYear}:`,
            error
        );
        return null;
    }
};

export default api;
export const fetchMapBounds = async (): Promise<[[number, number], [number, number]] | null> => {
    try {
        const response = await api.get<{ bounds: [[number, number], [number, number]] }>("/map/bounds");
        return response.data.bounds;
    } catch (error) {
        console.error("Error fetching map bounds:", error);
        return null;
    }
};

export const getLULCMapUrl = (year: number) => `${API_BASE_URL}/map/lulc/${year}`;
export const getChangeMapUrl = (start: number, end: number) => `${API_BASE_URL}/map/change/${start}/${end}`;
export const getConfidenceMapUrl = (year: number) => `${API_BASE_URL}/map/confidence/${year}`;
