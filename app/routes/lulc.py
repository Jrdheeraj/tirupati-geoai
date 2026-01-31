from fastapi import APIRouter
from app.services.raster_service import load_lulc
from app.services.analytics_service import area_stats

router = APIRouter()

@router.get("/{year}")
def lulc_area(year: int):
    lulc = load_lulc(year)
    return area_stats(lulc)