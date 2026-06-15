import urllib.request
import json

api_key = "<YOUR_API_KEY>"
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

try:
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print("Available models:")
        for model in data.get('models', []):
            print(f"- {model['name']}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(e.read().decode())
except Exception as e:
    print(f"Error: {e}")
