import pandas as pd
from django.core.management.base import BaseCommand
from rental.models import RentalStation

class Command(BaseCommand):
    help = 'Import rental stations from CSV file'

    def handle(self, *args, **kwargs):
        # CSV 파일 경로
        bikecsv_path = "/Users/foxrainswap/Desktop/아시아경제/1차프로젝트/데이터/따릉이대여소/rental_stations.csv"

        # CSV 파일 읽기
        df = pd.read_csv(bikecsv_path)

        # 데이터베이스에 저장
        for index, row in df.iterrows():
            RentalStation.objects.create(
                name=row['name'],
                loc=row['loc'],
                latitude=row['latitude'],
                longitude=row['longitude']
            )

        self.stdout.write(self.style.SUCCESS('Successfully imported rental stations'))
