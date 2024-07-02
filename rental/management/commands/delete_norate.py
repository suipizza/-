import pandas as pd




# CSV 파일 경로
input_csv_path = '/Users/foxrainswap/Desktop/아시아경제/1차프로젝트/데이터/문화시설/test_0626.csv'  # 실제 파일 경로로 변경해야 합니다.
output_csv_path = '/Users/foxrainswap/Desktop/아시아경제/1차프로젝트/데이터/문화시설/test_0626_delete.csv'


# CSV 파일 읽기
df = pd.read_csv(input_csv_path)

# '평점' 열에 "평점없음"이라고 적힌 행 삭제
df_filtered = df[df['평점'] != "평점없음"]

# 결과를 새로운 CSV 파일로 저장
df_filtered.to_csv(output_csv_path, index=False)

print("필터링된 CSV 파일이 저장되었습니다.")