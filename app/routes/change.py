from fastapi import APIRouter
from app.services.raster_service import load_lulc
from app.services.analytics_service import change_stats

router = APIRouter()

@router.get("/{start_year}/{end_year}")
def lulc_change(start_year: int, end_year: int):
    old = load_lulc(start_year)
    new = load_lulc(end_year)
    return change_stats(old, new)
