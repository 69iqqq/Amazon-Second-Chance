import urllib.request
import json

api_key = "<YOUR_API_KEY>"
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:predict?key={api_key}"

payload = {
    "instances": [
        {"prompt": "A beautiful sunset over the ocean."}
    ],
    "parameters": {
        "sampleCount": 1
    }
}

try:
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req) as response:
        resp_data = json.loads(response.read().decode())
        print("Success! Keys in response:", resp_data.keys())
        if 'predictions' in resp_data:
            print("First prediction keys:", resp_data['predictions'][0].keys())
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(e.read().decode())
except Exception as e:
    print(f"Error: {e}")
