# GeoAI Tirupati – Pixel-Level LULC Transition Analytics for Smart City Governance

## 1. Project Overview
GeoAI Tirupati is a sophisticated geospatial intelligence platform designed to monitor and analyze Land Use and Land Cover (LULC) changes in the Tirupati District. By leveraging deep learning and automated satellite analytics, the platform provides pixel-level insights into landscape transformations, enabling urban planners and governance bodies to drive sustainable urban development and climate-resilient city management.

## 2. Problem Statement
Rapid urbanization in regions like Tirupati often outpaces the ability of traditional monitoring systems to track land-use shifts accurately. 
- **Monitoring Challenges**: Conventional mapping is infrequent and often lacks the granularity to detect subtle transitions at the neighborhood or pixel level.
- **Pixel-Level Importance**: Understanding exactly where forest cover is lost or where urban sprawl is encroaching into agricultural land is critical for localized intervention.
- **Modern Governance**: Smart city governance requires empirical, high-frequency data to enforce zoning regulations and protect ecological sensitive areas.

## 3. Solution Overview
Our solution provides an end-to-end GeoAI pipeline that transforms raw satellite data into actionable decision-support artifacts:
- **Satellite Analytics Pipeline**: Automates the processing of multispectral imagery into classification layers.
- **Pixel-wise LULC Classification**: Categorizes every pixel into five critical classes: Forest, Water Bodies, Agriculture, Barren Land, and Built-up.
- **Change Detection**: A post-classification comparison engine that identifies "hotspots" of urban movement across years.
- **Confidence-Aware Analysis**: Integrates reliability metrics directly into the analytics, ensuring that decisions are based on high-trust AI verdicts.

## 4. Key Features
- **Pixel-level LULC Maps**: Interactive Leaflet-based visualization of land cover distribution.
- **Change Detection Overlays**: Visual hotspots highlighting exactly where transitions (e.g., Agriculture to Built-up) occurred.
- **Dual Timeline Support**: Comparative analysis available for both 2019–2024 and 2018–2025 windows.
- **Transition Matrix Analytics**: Detailed 5x5 numerical breakdown of hectare-wise and percentage-based shifts.
- **Confidence & Reliability Metrics**: Mean/Median confidence scoring at the district and class level.
- **AI-Driven Insights Panel**: Automatically generated human-readable summaries of urban dynamics and land stability.
- **Export Tools**: High-resolution PNG chart exports, map snapshots, and full CSV/JSON analytical reports.

## 5. Supported Timelines
The platform is designed to handle independent and equally supported analytical windows:
- **Timeline A: 2019 → 2024**: Focuses on immediate short-term changes and recent urban consolidation cycles.
- **Timeline B: 2018 → 2025**: Provides a broader perspective on long-term landscape transformation and cumulative developmental impact.
The system dynamically fetches the corresponding raster overlays and statistical data for the selected period.

## 6. System Architecture
- **Frontend**: Built with **React** and **TypeScript**, utilizing **Leaflet** for geospatial visualization and **Tailwind CSS** for a premium dashboard experience.
- **Backend**: **FastAPI (Python)** serving as a scalable analytics engine, performing on-the-fly math on NumPy rasters.
- **Data Layer**: Optimized storage of preprocessed classification rasters and change maps.
- **Visualization**: Tile-based rendering system for serving high-resolution map overlays.

## 7. Installation & Setup

### Prerequisites
- **Node.js**: v18 or higher
- **Python**: v3.9 or higher
- **Package Managers**: npm and pip

### Backend Setup
```bash
# Navigate to project root
python -m venv venv
# Linux/MacOS:
source venv/bin/activate
# Windows:
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend
# Install dependencies
npm install

# Start the development server
npm run dev
```
The application will be accessible at `http://localhost:5173`. The frontend is pre-configured to communicate with the backend on port `8001`.

## 8. Usage Guide
1. **Initialize Analysis**: Scroll to the interactive section and select a timeline.
2. **Explore Maps**: Toggle layers to see LULC maps, change hotspots, or confidence gradients.
3. **Analyze Data**: Scroll down to view the Transition Matrix and AI Insights for a numerical breakdown of changes.
4. **Reliability Check**: Review the confidence cards to assess the trust level of the current year's classification.
5. **Generate Reports**: Use the Export section to download standardized PNG images or CSV tables for external presentations.

## 9. Key Deliverables (Hackathon Alignment)
- **Interactive Visualization**: Full-featured dashboard for spatial exploration.
- **Transition Analytics**: Automated calculation of hectares changed between classes.
- **Confidence Metrics**: Empirical reliability scores for all AI predictions.
- **Exportable Outputs**: High-resolution artifacts for governance and reporting.

## 10. Social Impact & Use Cases
- **Urban Planning**: Identifying sprawl trends to optimize public infrastructure.
- **Environmental Monitoring**: Tracking the health of water bodies and forest cover.
- **Policy Support**: Providing audit-proof data for land-use policy enforcement.
- **Governance**: Enhancing transparency in urban development projects.

## 11. Limitations
- **Geographic Scope**: Optimized for the Tirupati District boundary.
- **Offline Preprocessing**: Classification models are run prior to deployment; the system serves pre-calculated results for maximum performance.
- **Real-time Ingestion**: The current prototype does not ingest live satellite feeds directly but processes batch historical/future datasets.

## 12. Future Scope
- **Real-time Satellite Ingestion**: Integrating Sentinel-2 or Landsat APIs for continuous monitoring.
- **Higher Temporal Resolution**: Support for monthly or seasonal change detection.
- **GIS Integration**: Direct export to Shapefiles or GeoJSON for use in desktop GIS software (QGIS/ArcGIS).
- **Predictive Growth Modeling**: Using historical trends to predict land-use states for 2030+.

*Disclaimer: This project is a functional prototype developed for hackathon demonstration purposes.*
