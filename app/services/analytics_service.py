import numpy as np
from app.constants import LULC_CLASSES

def area_stats(lulc_array, pixel_size=10):
    pixel_area_ha = (pixel_size * pixel_size) / 10000
    total_pixels = lulc_array.size
    valid_pixels = (lulc_array != 0).sum() # Assuming 0 is nodata
    
    if valid_pixels == 0:
        return {"total_area_ha": 0, "stats": []}

    total_area = valid_pixels * pixel_area_ha
    stats = []

    for cls, name in LULC_CLASSES.items():
        pixel_count = (lulc_array == cls).sum()
        area = pixel_count * pixel_area_ha
        percentage = (pixel_count / valid_pixels) * 100 if valid_pixels > 0 else 0
        
        stats.append({
            "class_name": name,
            "area_ha": round(area, 2),
            "percentage": round(percentage, 2)
        })

    return {
        "total_area_ha": round(total_area, 2),
        "stats": stats
    }


def change_stats(old_lulc, new_lulc, pixel_size=10):
    pixel_area_ha = (pixel_size * pixel_size) / 10000
    
    # Initialize matrix (5x5 for 5 classes)
    # LULC_CLASSES keys are 1-5, so we need to map to 0-4 indices or just use list
    num_classes = len(LULC_CLASSES)
    matrix = np.zeros((num_classes, num_classes))
    
    breakdown = []
    
    # Calculate transitions
    for i, (cls_i, name_i) in enumerate(LULC_CLASSES.items()):
        for j, (cls_j, name_j) in enumerate(LULC_CLASSES.items()):
            # Count pixels transitioning from class i to class j
            mask = (old_lulc == cls_i) & (new_lulc == cls_j)
            count = mask.sum()
            area = count * pixel_area_ha
            
            # Fill matrix (row=from, col=to)
            matrix[i, j] = round(area, 2)
            
            if count > 0:
                breakdown.append({
                    "from_class": name_i,
                    "to_class": name_j,
                    "area_ha": round(area, 2)
                })

    # Normalize matrix to percentages for frontend heatmap if needed, 
    # but usually raw area or row-normalized is better. 
    # Let's provide row-normalized (percentage of "from" class)
    matrix_normalized = np.zeros_like(matrix)
    row_sums = matrix.sum(axis=1)
    with np.errstate(divide='ignore', invalid='ignore'):
        matrix_normalized = (matrix.T / row_sums).T * 100
        matrix_normalized = np.nan_to_num(matrix_normalized) # Replace NaNs with 0

    return {
        "matrix_area": matrix.tolist(),
        "matrix_percentage": np.round(matrix_normalized, 1).tolist(),
        "breakdown": breakdown
    }
