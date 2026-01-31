from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "data" / "gee_outputs"

LULC_DIR = DATA_DIR / "lulc"
CHANGE_DIR = DATA_DIR / "change"
CONFIDENCE_DIR = DATA_DIR / "confidence"
