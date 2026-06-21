import os
from google import genai

# کلید API تو برای تست
api_key = "AQ.Ab8RN6I5TIEbDk9gIt-YutBkGSxalaWmlMA5Z0s-oW-5r_HK8Q"

# راه اندازی کلاینت جدید گوگل
client = genai.Client(api_key=api_key)

# فرستادن درخواست به مدل جمینای
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents='سلام! اگر منو داری و کد درست کار میکنه بهم بگو.',
)

print(response.text)