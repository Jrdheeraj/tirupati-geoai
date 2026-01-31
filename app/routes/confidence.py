import os
import numpy as np
import rasterio
from fastapi import APIRouter, HTTPException
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# --------------------------------------------------
# Base paths
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
GEE_DIR = os.path.join(BASE_DIR, "gee_outputs")

CONFIDENCE_DIR = os.path.join(GEE_DIR, "confidence")
LULC_DIR = os.path.join(GEE_DIR, "lulc")
CHANGE_DIR = os.path.join(GEE_DIR, "change")

# --------------------------------------------------
# Mappings
# --------------------------------------------------
LULC_CLASSES = {
    1: "Forest",
    2: "Water Bodies",
    3: "Agriculture",
    4: "Barren Land",
    5: "Built-up"
}

CONFIDENCE_MAP = {
    2024: "Tirupati_Confidence_2024.tif",
    2025: "Tirupati_Confidence_2025.tif"
}

CHANGE_MAP = {
    (2019, 2024): "Tirupati_LULC_Change_2019_2024.tif",
    (2018, 2025): "Tirupati_LULC_Change_2018_2025.tif"
}

# --------------------------------------------------
# Overall confidence summary
# --------------------------------------------------
@router.get("/{year}")
def confidence_summary(year: int):
    """
    Get confidence statistics for a given year.
    
    Available years: 2024, 2025
    """
    try:
        # Validate year
        if year not in CONFIDENCE_MAP:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": f"Confidence data not available for year {year}",
                    "available_years": list(CONFIDENCE_MAP.keys())
                }
            )

        # Construct path
        conf_path = os.path.join(CONFIDENCE_DIR, CONFIDENCE_MAP[year])
        
        # Check file existence
        if not os.path.exists(conf_path):
            # List what files ARE in the directory
            available_files = []
            if os.path.exists(CONFIDENCE_DIR):
                available_files = os.listdir(CONFIDENCE_DIR)
            
            raise HTTPException(
                status_code=404,
                detail={
                    "error": "Confidence file not found",
                    "expected_path": conf_path,
                    "confidence_dir": CONFIDENCE_DIR,
                    "confidence_dir_exists": os.path.exists(CONFIDENCE_DIR),
                    "available_files": available_files
                }
            )

        # Open and read raster
        try:
            with rasterio.open(conf_path) as src:
                data = src.read(1)
        except Exception as raster_error:
            logger.error(f"Rasterio error: {str(raster_error)}")
            raise HTTPException(
                status_code=500,
                detail={
                    "error": "Failed to read raster file",
                    "file_path": conf_path,
                    "rasterio_error": str(raster_error)
                }
            )

        # Filter valid data: confidence value 0 represents nodata/background
        valid = data[data > 0]

        if valid.size == 0:
            raise HTTPException(
                status_code=404,
                detail="No valid confidence pixels found in raster"
            )

        # Calculate statistics with JSON-safe types
        return {
            "year": year,
            "min": int(valid.min()),
            "max": int(valid.max()),
            "mean": round(float(valid.mean()), 2),
            "median": int(np.median(valid)),
            "valid_pixels": int(valid.size),
            "total_pixels": int(data.size),
            "coverage_percent": round((valid.size / data.size) * 100, 2)
        }
    
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    
    except Exception as e:
        # Log unexpected errors
        logger.error(f"Unexpected error in confidence_summary: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Unexpected server error",
                "message": str(e),
                "type": type(e).__name__
            }
        )

# --------------------------------------------------
# Confidence by LULC class
# --------------------------------------------------
@router.get("/lulc/{year}")
def confidence_by_lulc(year: int):
    if year not in CONFIDENCE_MAP:
        raise HTTPException(status_code=400, detail="Confidence data not available for this year")

    lulc_path = os.path.join(LULC_DIR, f"Tirupati_LULC_{year}.tif")
    conf_path = os.path.join(CONFIDENCE_DIR, CONFIDENCE_MAP[year])

    if not os.path.exists(lulc_path):
        raise HTTPException(
            status_code=404,
            detail=f"LULC file not found at {lulc_path}"
        )

    if not os.path.exists(conf_path):
        raise HTTPException(
            status_code=404,
            detail=f"Confidence file not found at {conf_path}"
        )

    with rasterio.open(lulc_path) as lulc_src, rasterio.open(conf_path) as conf_src:
        lulc = lulc_src.read(1)
        conf = conf_src.read(1)

        lulc_nodata = lulc_src.nodata

    # Create valid data mask
    # Confidence value 0 represents nodata/background
    mask = (conf > 0)
    
    if lulc_nodata is not None:
        mask &= lulc != lulc_nodata

    result = {"year": year}

    for class_id, class_name in LULC_CLASSES.items():
        class_mask = (lulc == class_id) & mask

        result[class_name] = {
            "mean_confidence": round(float(conf[class_mask].mean()), 2)
            if class_mask.any() else None,
            "pixel_count": int(class_mask.sum())
        }

    return result

# --------------------------------------------------
# Confidence analysis for change detection
# --------------------------------------------------
@router.get("/change/{start_year}/{end_year}")
def confidence_by_change(start_year: int, end_year: int):
    """
    Analyze confidence statistics for changed vs unchanged pixels.
    
    Valid year pairs:
    - 2019 → 2024
    - 2018 → 2025
    """
    # Validate year combination
    year_pair = (start_year, end_year)
    if year_pair not in CHANGE_MAP:
        raise HTTPException(
            status_code=400,
            detail={
                "error": f"Invalid year combination: {start_year} → {end_year}",
                "valid_combinations": ["2019 → 2024", "2018 → 2025"]
            }
        )
    
    # Validate end year has confidence data
    if end_year not in CONFIDENCE_MAP:
        raise HTTPException(
            status_code=400,
            detail={
                "error": f"No confidence data available for end year {end_year}",
                "available_years": list(CONFIDENCE_MAP.keys())
            }
        )
    
    # Construct file paths
    change_path = os.path.join(CHANGE_DIR, CHANGE_MAP[year_pair])
    conf_path = os.path.join(CONFIDENCE_DIR, CONFIDENCE_MAP[end_year])
    
    # Check file existence
    if not os.path.exists(change_path):
        raise HTTPException(
            status_code=404,
            detail=f"Change detection file not found: {change_path}"
        )
    
    if not os.path.exists(conf_path):
        raise HTTPException(
            status_code=404,
            detail=f"Confidence file not found: {conf_path}"
        )
    
    try:
        # Load rasters
        with rasterio.open(change_path) as change_src, rasterio.open(conf_path) as conf_src:
            change_data = change_src.read(1)
            conf_data = conf_src.read(1)
        
        # Create valid data mask
        # Confidence value 0 represents nodata/background
        valid_mask = (conf_data > 0)
        
        # Identify changed vs unchanged pixels
        # Change raster: 0 = unchanged, non-zero = changed
        changed_mask = (change_data != 0) & valid_mask
        unchanged_mask = (change_data == 0) & valid_mask
        
        # Calculate statistics for changed pixels
        changed_conf = conf_data[changed_mask]
        changed_stats = {
            "mean_confidence": round(float(changed_conf.mean()), 2) if changed_conf.size > 0 else None,
            "pixel_count": int(changed_mask.sum())
        }
        
        # Calculate statistics for unchanged pixels
        unchanged_conf = conf_data[unchanged_mask]
        unchanged_stats = {
            "mean_confidence": round(float(unchanged_conf.mean()), 2) if unchanged_conf.size > 0 else None,
            "pixel_count": int(unchanged_mask.sum())
        }
        
        return {
            "period": f"{start_year}-{end_year}",
            "changed": changed_stats,
            "unchanged": unchanged_stats
        }
    
    except Exception as e:
        logger.error(f"Error in confidence_by_change: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Failed to process confidence change analysis",
                "message": str(e)
            }
        )
