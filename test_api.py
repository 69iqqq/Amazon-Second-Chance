import urllib.request
import json

url = "http://localhost:3001/api/v1/grading/00000000-0000-0000-0000-000000000000"
payload = {"imageUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz"}
req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='POST')

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"Error: {e.code}")
    print(e.read().decode())
except Exception as e:
    print(f"Error: {e}")
