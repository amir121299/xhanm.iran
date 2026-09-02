# pip install iotype-ai
from iotype import Iotype
 
# Reads IOTYPE_TOKEN from the environment.
# To pass it explicitly: Iotype("YOUR_TOKEN")
io = Iotype()
 
url = io.synthesize(
    "سلام! امروز هوا بسیار عالی است.",
    speaker="tanaz",
    tone="general",       # general | formal
)
 
# The response is a URL, not the audio itself. Download it if you need
# to keep the file — the retention period is not published.
print(url)
