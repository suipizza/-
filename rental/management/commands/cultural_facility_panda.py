import pandas as pd
# CSV 파일 불러오기
df = pd.read_csv('/Users/foxrainswap/Desktop/아시아경제/1차프로젝트/데이터/문화시설/문화시설정보01.csv')

# 중복된 행 제거하기
df.drop_duplicates(subset='name', keep='first', inplace=True)

# 빈칸을 특정 값으로 채우기 (예: 빈칸을 'N/A'로 채우기)
df.replace('N', '기타', inplace=True)

# 수정된 DataFrame 확인
print(df.info())
print(df)
df.to_csv('문화시설정보_02.csv', index=False)
