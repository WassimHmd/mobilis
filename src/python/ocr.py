import sys
import easyocr
import cv2
import os
import uuid

def preprocess_image(image_path):
    img = cv2.imread(image_path)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    denoised = cv2.fastNlMeansDenoising(gray, h=10)

    processed = cv2.adaptiveThreshold(
        denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 2
    )

    return processed

reader = easyocr.Reader(['fr', 'en'], gpu=True)

image_path = sys.argv[1]
processed_img = preprocess_image(image_path)

output_dir = "uploads/ocr"
os.makedirs(output_dir, exist_ok=True)

random_filename = f"{uuid.uuid4().hex}.png"
output_path = os.path.join(output_dir, random_filename)

cv2.imwrite(output_path, processed_img)

result = reader.readtext(
    processed_img,
    detail=0,
    contrast_ths=0.5,
    adjust_contrast=0.5,
    add_margin=0.05
)

texts = [detection[1] for detection in result]

print(result)
