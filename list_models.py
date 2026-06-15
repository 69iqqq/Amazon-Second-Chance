import urllib.request
import json

api_key = "<YOUR_API_KEY>"
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

try:
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print("Available Models:")
        for model in data.get('models', []):
            if 'gemini' in model['name'].lower():
                print(f"- {model['name']}")
except Exception as e:
    print(f"Error: {e}")
