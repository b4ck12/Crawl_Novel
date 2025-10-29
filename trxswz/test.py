import requests
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm
import time

# --- CÁC THAM SỐ CẤU HÌNH ---
START_CHAPTER = 1
END_CHAPTER = 759 # Tăng lên 1 vì range() không bao gồm số cuối
MAX_WORKERS = 15     # Số luồng chạy đồng thời, có thể tăng/giảm tùy vào mạng và máy của bạn
OUTPUT_FILE = "四臂神.txt"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
}

# Sử dụng Session để tái sử dụng kết nối, tăng tốc độ
session = requests.Session()
session.headers.update(HEADERS)

def scrape_chapter(chapter_num):
    url = f"https://www.trxswz.com/book/59ZP-{chapter_num}.html"
    try:
        response = session.get(url, timeout=10)
        response.raise_for_status() 

        soup = BeautifulSoup(response.content, "lxml")
        
        div_big = soup.find("div", class_="box single")
        if not div_big:
            return None 
        
        name_tag = div_big.find("h1")
        content_tag = div_big.find("article")

        if not name_tag or not content_tag:
            return None

        name = name_tag.get_text(strip=True)
        text = content_tag.get_text(separator="\n", strip=True)

        return (chapter_num, name, text)

    except requests.exceptions.RequestException as e:
        print(f"Lỗi khi tải chương {chapter_num}: {e}")
        return None

def main():
    all_chapters_data = []
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(scrape_chapter, i): i for i in range(START_CHAPTER, END_CHAPTER)}
        
        for future in tqdm(as_completed(futures), total=len(futures), desc="Đang tải các chương"):
            result = future.result()
            if result:
                all_chapters_data.append(result)
    
    print("\nĐã tải xong! Đang sắp xếp và ghi ra file...")

    # Sắp xếp lại các chương theo đúng thứ tự
    all_chapters_data.sort(key=lambda x: x[0])

    # Mở file một lần duy nhất và ghi toàn bộ nội dung
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        for name, text in all_chapters_data:
            f.write(name + "\n\n")
            # Thêm \t ở đầu mỗi dòng trong nội dung
            formatted_text = "\t" + text.replace("\n", "\n\t")
            f.write(formatted_text + "\n\n")
            
    print(f"Hoàn tất! Đã lưu truyện vào file: {OUTPUT_FILE}")


if __name__ == "__main__":
    start_time = time.time()
    main()
    end_time = time.time()
    print(f"Tổng thời gian thực thi: {end_time - start_time:.2f} giây.")