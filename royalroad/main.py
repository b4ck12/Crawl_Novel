import requests
from bs4 import BeautifulSoup
import time

url = "https://www.royalroad.com/fiction/21220/mother-of-learning"

session = requests.Session()
response = session.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

urls = []
content = ""

title = soup.find('h1', class_='font-white')
title_text = title.text.strip() if title else 'Title not found'

author = soup.find('h4', class_='font-white')
author_text = author.text.strip() if author else 'Author not found'

#chapter list
chapter_rows = soup.find_all('tr', class_='chapter-row')

#get the a href in each chapter row
for chapter in chapter_rows:
    chapter_link = chapter.find('a')
    if chapter_link:
        chapter_url = "https://www.royalroad.com" + chapter_link['href'] 
        chapter_name = chapter_link.text.strip()
        urls.append((chapter_name, chapter_url))

print(f"Bắt đầu tải {len(urls)} chương của truyện: {title_text}...")
for chapter_name, chapter_url in urls:
    print(f"Đang tải: {chapter_name}")
    chapter_response = session.get(chapter_url)
    chapter_soup = BeautifulSoup(chapter_response.text, 'html.parser')
    chapter_content = chapter_soup.find('div', class_='chapter-inner chapter-content')
    chapter_text = chapter_content.text.strip() if chapter_content else 'Chapter content not found'
    
    # Thêm ngăn cách chương và lùi dòng cho phần nội dung
    separator = "=" * 50
    indented_text = "\n".join("    " + line if line.strip() else line for line in chapter_text.split("\n"))
    
    content += f"{separator}\n{chapter_name}\n{separator}\n\n{indented_text}\n\n"
    print(f"Done: {chapter_name}")
    time.sleep(0.5) 
    
with open('mother_of_learning.txt', 'w', encoding='utf-8') as file:
    file.write(f"{title_text}\n{author_text}\n\n{content}")

print("Đã tải và lưu thành công!")
