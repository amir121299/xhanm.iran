import requests
 
response = requests.post(
    "https://iotype.com/io/v1/synthesis",
    headers={
        "Authorization": "Bearer YOUR_TOKEN",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
    json={
        "tone": "general",      # general | formal
        "speaker": "tanaz",
        "text": "سلام! امروز هوا بسیار عالی است.",
    },
    timeout=60,
)
response.raise_for_status()
 
# The response is a URL to the generated MP3, not the audio itself.
print(response.json()["url"])
