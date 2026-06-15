from PIL import Image

def make_transparent(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    # Replace white-ish pixels with transparent
    for item in datas:
        # Check if the pixel is near white
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    make_transparent("apps/web/public/logos/green-a-logo.png", "apps/web/public/logos/green-a-logo.png")
