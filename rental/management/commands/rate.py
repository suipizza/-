import time
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# CSV 파일 경로
input_csv_path = '/Users/foxrainswap/Desktop/아시아경제/1차프로젝트/데이터/문화시설/test_05.csv'  # 실제 파일 경로로 변경해야 합니다.
output_csv_path = '/Users/foxrainswap/Desktop/아시아경제/1차프로젝트/데이터/문화시설/tes_04.csv'

# 구글 크롬 드라이버 설정
options = webdriver.ChromeOptions()
options.add_argument('--headless')  # 브라우저 창을 띄우지 않음
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

def get_google_maps_rating(place_name):
    driver.get("https://www.google.com/maps")
    search_box = driver.find_element(By.ID, "searchboxinput")
    search_box.clear()
    search_box.send_keys(place_name)
    search_box.send_keys(Keys.ENTER)
    time.sleep(3)  # 페이지 로드 대기

    try:
        # 평점 HTML 태그를 찾아서 가져오기
        rating_element = driver.find_element(By.XPATH, '//div[@class="F7nice "]//span[@aria-hidden="true"]')
        rating = rating_element.text
        return rating
    except:
        return "평점없음"

# CSV 파일 읽기
places_df = pd.read_csv(input_csv_path)

# 각 장소에 대해 평점 가져오기
ratings = []
for idx, place_name in enumerate(places_df['시설명']):
    rating = get_google_maps_rating(place_name)
    ratings.append(rating)
    print(f"평점 크롤링 완료 {idx + 1}개")

# 평점을 CSV 파일에 추가하여 저장
places_df['평점'] = ratings

# 기존 '평점' 열이 없으면 삽입
if '평점' not in places_df.columns:
    # URL 열 다음에 평점 열을 삽입
    cols = places_df.columns.tolist()
    url_index = cols.index('URL') + 1
    cols = cols[:url_index] + ['평점'] + cols[url_index:]
    places_df = places_df[cols]

places_df.to_csv(output_csv_path, index=False)

# 드라이버 종료
driver.quit()
