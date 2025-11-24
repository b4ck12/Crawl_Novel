import requests
from bs4 import BeautifulSoup

url = "https://novelight.net/book/ajax/read-chapter/185754"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    "Referer": "https://novelight.net/book/chapter/185754",
    "originUrl": "https://novelight.net/book/chapter/185754",
    "X-Requested-With": "XMLHttpRequest"
}
    
    
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.content, "html.parser")
with open("output.html", "w", encoding="utf-8") as file:
    file.write(soup.prettify())