import cv2
import numpy as np
import os
import sys

image_path = r"C:\Users\abird\.gemini\antigravity-ide\brain\6219fa03-abad-496d-9fa3-2b1c8fbdbe5d\media__1781469933453.png"
output_dir = r"C:\Users\abird\personal\HackOn\amahawk\apps\web\public\icons"

img = cv2.imread(image_path)
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

# Looser bounds to catch all shades of Amazon Gold/Orange
lower_orange = np.array([5, 40, 40])
upper_orange = np.array([40, 255, 255])

mask = cv2.inRange(hsv, lower_orange, upper_orange)

contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

centers = []
for cnt in contours:
    x, y, w, h = cv2.boundingRect(cnt)
    if w * h > 5: 
        cx = x + w // 2
        cy = y + h // 2
        if not any(abs(cx - ex) < 60 and abs(cy - ey) < 60 for ex, ey in centers):
            centers.append((cx, cy))

print(f"Found {len(centers)} icons.")

centers.sort(key=lambda pt: pt[1])

if len(centers) >= 7:
    row1 = sorted(centers[:4], key=lambda pt: pt[0])
    row2 = sorted(centers[4:7], key=lambda pt: pt[0])
    sorted_centers = row1 + row2
else:
    sorted_centers = centers

names = [
    "manage_listings",
    "list_used_item",
    "pricing_dashboard",
    "fba_shipments",
    "manage_returns",
    "a_to_z_claims",
    "chargebacks"
]

CROP_SIZE = 80

for i, (cx, cy) in enumerate(sorted_centers):
    if i >= len(names):
        break
    
    # We want to crop from the original image (not the mask)
    x1 = max(0, cx - CROP_SIZE // 2)
    y1 = max(0, cy - CROP_SIZE // 2)
    x2 = min(img.shape[1], cx + CROP_SIZE // 2)
    y2 = min(img.shape[0], cy + CROP_SIZE // 2)
    
    crop = img[y1:y2, x1:x2]
    
    out_path = os.path.join(output_dir, f"{names[i]}.png")
    cv2.imwrite(out_path, crop)
    print(f"Saved {names[i]}.png")

print("Done cropping.")
