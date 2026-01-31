import rasterio
from app.config import LULC_DIR, CHANGE_DIR, CONFIDENCE_DIR
from pathlib import Path

# Year-to-file mapping for confidence rasters
CONFIDENCE_YEAR_MAP = {
    2024: "Tirupati_Confidence_2024.tif",
    2025: "Tirupati_Confidence_2025.tif"
}

def load_raster(path):
    """Load a single-band raster and return as numpy array."""
    with rasterio.open(path) as src:
        return src.read(1), src.nodata

def load_lulc(year: int):
    """Load LULC raster for a given year."""
    data, _ = load_raster(LULC_DIR / f"Tirupati_LULC_{year}.tif")
    return data

def load_change(start: int, end: int):
    """Load change raster for a given year range."""
    data, _ = load_raster(
        CHANGE_DIR / f"Tirupati_LULC_Change_{start}_{end}.tif"
    )
    return data

def load_confidence(year: int):
    """
    Load confidence raster for a given year.
    Returns tuple of (data, nodata_value).
    Raises FileNotFoundError if year is not supported.
    """
    if year not in CONFIDENCE_YEAR_MAP:
        raise FileNotFoundError(
            f"Confidence data not available for year {year}. "
            f"Available years: {list(CONFIDENCE_YEAR_MAP.keys())}"
        )
    
    filepath = CONFIDENCE_DIR / CONFIDENCE_YEAR_MAP[year]
    return load_raster(filepath)
