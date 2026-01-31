import { MapContainer, TileLayer, ImageOverlay, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Layers, Shield, Maximize2, Info } from "lucide-react";
import MapLegend from "./MapLegend";
import { useEffect, useState, useCallback } from "react";
import { fetchMapBounds, getLULCMapUrl, getChangeMapUrl, getConfidenceMapUrl } from "@/services/api";

interface MapViewerProps {
    startYear: number;
    endYear: number;
    showOverlay: boolean;
    onToggleOverlay: () => void;
}

const DEFAULT_BOUNDS: [[number, number], [number, number]] = [[13.2934492, 78.9805086], [14.2662349, 80.2686029]];
const CENTER: [number, number] = [13.6288, 79.4192];
const ZOOM = 11;

// Component to sync maps
const MapSyncController = ({ viewState, onMove }: { viewState: { center: [number, number], zoom: number }, onMove: (state: { center: [number, number], zoom: number }) => void }) => {
    const map = useMap();

    useEffect(() => {
        if (viewState.center[0] !== map.getCenter().lat || viewState.center[1] !== map.getCenter().lng || viewState.zoom !== map.getZoom()) {
            map.setView(viewState.center, viewState.zoom, { animate: false });
        }
    }, [viewState, map]);

    useEffect(() => {
        const handleMove = () => {
            onMove({
                center: [map.getCenter().lat, map.getCenter().lng],
                zoom: map.getZoom()
            });
        };
        map.on("moveend", handleMove);
        return () => { map.off("moveend", handleMove); };
    }, [map, onMove]);

    return null;
};

const MapViewer = ({
    startYear,
    endYear,
    showOverlay,
    onToggleOverlay,
}: MapViewerProps) => {
    const [bounds, setBounds] = useState<[[number, number], [number, number]]>(DEFAULT_BOUNDS);
    const [showLULC, setShowLULC] = useState(true);
    const [showConfidence, setShowConfidence] = useState(false);
    const [viewState, setViewState] = useState<{ center: [number, number], zoom: number }>({ center: CENTER, zoom: ZOOM });

    useEffect(() => {
        const loadBounds = async () => {
            const b = await fetchMapBounds();
            if (b) setBounds(b);
        };
        loadBounds();
    }, []);

    const handleMove = useCallback((newState: { center: [number, number], zoom: number }) => {
        setViewState(newState);
    }, []);

    return (
        <div className="space-y-6" id="map-snapshot-area">
            {/* Enhanced Map Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border shadow-sm">
                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">Overlay Layers:</span>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={showLULC}
                            onChange={() => setShowLULC(!showLULC)}
                            className="rounded border-border text-primary focus:ring-primary h-4 w-4 transition-all"
                        />
                        <span className="text-sm group-hover:text-primary transition-colors">Land Use (LULC)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={showOverlay}
                            onChange={onToggleOverlay}
                            className="rounded border-border text-primary focus:ring-primary h-4 w-4 transition-all"
                        />
                        <span className="text-sm group-hover:text-primary transition-colors">Change Hotspots</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={showConfidence}
                            onChange={() => setShowConfidence(!showConfidence)}
                            className="rounded border-border text-primary focus:ring-primary h-4 w-4 transition-all"
                        />
                        <span className="text-sm group-hover:text-primary transition-colors flex items-center gap-1">
                            AI Confidence <Shield className="w-3 h-3 text-primary/60" />
                        </span>
                    </label>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                    <div className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-primary" />
                        <span>Interactive Multi-Layer View</span>
                    </div>
                </div>
            </div>

            {/* Side by Side Maps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Before Map */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h4 className="text-lg font-semibold text-foreground">Before ({startYear})</h4>
                            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border font-bold">Baseline</span>
                        </div>
                    </div>
                    <div className="rounded-xl border border-border overflow-hidden shadow-sm h-[500px] relative z-0 group bg-muted/20">
                        <MapContainer
                            center={CENTER}
                            zoom={ZOOM}
                            style={{ height: "100%", width: "100%" }}
                            zoomControl={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                opacity={showLULC || showConfidence ? 0.3 : 1}
                            />

                            {showLULC && (
                                <ImageOverlay
                                    url={getLULCMapUrl(startYear)}
                                    bounds={bounds}
                                    opacity={0.8}
                                />
                            )}

                            {showConfidence && (
                                <ImageOverlay
                                    url={getConfidenceMapUrl(startYear)}
                                    bounds={bounds}
                                    opacity={0.6}
                                />
                            )}

                            <MapSyncController viewState={viewState} onMove={handleMove} />
                        </MapContainer>

                        <div className="absolute top-4 left-4 z-[1000] glass-card rounded-lg px-3 py-2 pointer-events-none border-primary/20 shadow-md">
                            <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-tighter">
                                <Maximize2 className="w-3 h-3" /> Tirupati District Boundary
                            </span>
                        </div>
                    </div>
                </div>

                {/* After Map */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h4 className="text-lg font-semibold text-foreground">After ({endYear})</h4>
                            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold">Monitoring</span>
                        </div>
                    </div>
                    <div className="rounded-xl border border-border overflow-hidden shadow-sm h-[500px] relative z-0 group bg-muted/20">
                        <MapContainer
                            center={CENTER}
                            zoom={ZOOM}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                opacity={showLULC || showConfidence || showOverlay ? 0.3 : 1}
                            />

                            {showLULC && (
                                <ImageOverlay
                                    url={getLULCMapUrl(endYear)}
                                    bounds={bounds}
                                    opacity={0.8}
                                />
                            )}

                            {showOverlay && (
                                <ImageOverlay
                                    url={getChangeMapUrl(startYear, endYear)}
                                    bounds={bounds}
                                    opacity={0.9}
                                />
                            )}

                            {showConfidence && (
                                <ImageOverlay
                                    url={getConfidenceMapUrl(endYear)}
                                    bounds={bounds}
                                    opacity={0.6}
                                />
                            )}

                            <MapSyncController viewState={viewState} onMove={handleMove} />
                        </MapContainer>

                        {/* Quick Status Overlay */}
                        {showOverlay && (
                            <div className="absolute bottom-4 right-4 z-[1000] animate-fade-in shadow-xl">
                                <div className="bg-destructive text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    PIXEL-LEVEL TRANSITIONS ACTIVE
                                </div>
                            </div>
                        )}

                        <div className="absolute top-4 left-4 z-[1000] glass-card rounded-lg px-3 py-2 pointer-events-none border-primary/20 shadow-md">
                            <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-tighter">
                                <Shield className="w-3 h-3" /> Verified AI Classification
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Legend */}
            <div className="flex flex-col items-center gap-6 py-4">
                <MapLegend />
                {showConfidence && (
                    <div className="flex flex-wrap items-center justify-center gap-6 px-6 py-3 bg-card border border-border rounded-2xl shadow-sm text-xs animate-fade-in">
                        <span className="font-bold text-muted-foreground uppercase tracking-widest text-[10px]">AI Confidence scale</span>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 rounded-full bg-[#22c55e] shadow-sm shadow-green-500/20" />
                                <span className="font-medium">High (&gt;90%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 rounded-full bg-[#f59e0b] shadow-sm shadow-amber-500/20" />
                                <span className="font-medium">Medium (80-90%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 rounded-full bg-[#ef4444] shadow-sm shadow-red-500/20" />
                                <span className="font-medium">Low (&lt;80%)</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapViewer;
