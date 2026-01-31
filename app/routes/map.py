from fastapi import APIRouter, Response, HTTPException
from app.services.raster_service import load_lulc, load_change, load_confidence
from app.services.image_service import create_lulc_image, create_change_image, create_confidence_image

router = APIRouter()

# Spatial bounds for Tirupati rasters (extracted from TIFF metadata)
# Format: [ [lat_min, lon_min], [lat_max, lon_max] ] for Leaflet
MAP_BOUNDS = [[13.2934492, 78.9805086], [14.2662349, 80.2686029]]

@router.get("/bounds")
def get_bounds():
    """Return the spatial bounds for the rasters."""
    return {"bounds": MAP_BOUNDS}

@router.get("/lulc/{year}")
async def get_lulc_map(year: int):
    """Return a color-coded PNG for LULC of a specific year."""
    try:
        data = load_lulc(year)
        img_bytes = create_lulc_image(data)
        return Response(content=img_bytes, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/change/{start}/{end}")
async def get_change_map(start: int, end: int):
    """Return a red-themed change overlay PNG for a year range."""
    try:
        data = load_change(start, end)
        img_bytes = create_change_image(data)
        return Response(content=img_bytes, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/confidence/{year}")
async def get_confidence_map(year: int):
    """Return a heat-map PNG for classification confidence."""
    try:
        data, _ = load_confidence(year)
        img_bytes = create_confidence_image(data)
        return Response(content=img_bytes, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
