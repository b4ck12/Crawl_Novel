from bs4 import BeautifulSoup
import requests


headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
}
for i in range(1, 1140):
    url = f"https://www.trxswz.com/book/59ZP-{i}.html"

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, "html.parser")
    div_big = soup.find("div", class_="box single")
    name = div_big.find("h1").get_text()
    content = div_big.find("article")
    text = content.get_text(separator="\n", strip=True)
    with open("四臂神皇.txt", "a", encoding="utf-8") as f:
        f.write(name + "\n\n")
        f.write("\t" + text + "\n\n")    
        print(f"Done: {name}")  