import pandas as pd
from django.core.management.base import BaseCommand
from rental.models import temp_cultural_facilities

class Command(BaseCommand):
    help = 'Import cultural facilities from CSV file'

    def handle(self, *args, **kwargs):
        # CSV 파일 경로
        facilities_path = "/Users/foxrainswap/Desktop/아시아경제/1차프로젝트/데이터/문화시설/facilities_info_04.csv"

        # 기존 데이터를 삭제
        temp_cultural_facilities.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Successfully deleted existing cultural facilities'))

        # CSV 파일 읽기
        df = pd.read_csv(facilities_path)

        # 데이터베이스에 저장
        for index, row in df.iterrows():
            temp_cultural_facilities.objects.create(
                name=row['시설명'],
                category=row['중분류'],
                loc=row['구명'],
                latitude=row['위도'],
                longitude=row['경도'],
                address=row['주소'],
                rate=row['평점']
            )

        self.stdout.write(self.style.SUCCESS('Successfully imported cultural facilities'))
