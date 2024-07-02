from django.shortcuts import render
from .models import RentalStation, temp_cultural_facilities
from django.core.serializers import serialize
from math import radians, sin, cos, sqrt, atan2
from django.http import JsonResponse
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import json  # json 모듈 import

# Create your views here.

def map_view(request,region):
    # 사용자가 고른 지역구로 대여소와 문화시설 필터링
    rental_locations = RentalStation.objects.filter(loc=region)
    cultural_facilities= temp_cultural_facilities.objects.filter(loc=region)

    # 대여소와 문화시설 정보 json 형식으로 직렬화
    rental_locations_json = serialize('json', rental_locations, fields=('name', 'latitude', 'longitude', 'loc'))
    cultural_facilities_json = serialize('json',cultural_facilities,fields=('name','loc','category','latitude','longitude','address','rate'))

    # 각 구의 중심 좌표와 줌 수준을 정의
    region_settings = {
        '종로구': {'center': [37.5696829, 126.984256], 'zoom': 16},
        '송파구': {'center': [37.5098535, 127.109668], 'zoom': 16},
        '용산구': {'center': [37.5303065,126.970067], 'zoom': 16},
        '중구': {'center': [37.561296,126.9940965], 'zoom': 16},
        '강남구': {'center': [37.4983031,127.032640], 'zoom': 16},
    }
    # 기본값 설정
    settings = region_settings.get(region, {'center': [37.5665, 126.9780], 'zoom': 15})

    return render(request, 'test.html', {
        'locations': rental_locations_json,
        'cultural_facilities': cultural_facilities_json,
        'region': region,
        'center': settings['center'],
        'zoom': settings['zoom']
    })

def main_view(request):
    return render(request, 'mainpage.html')



# 카테고리로 필터링된 문화시설을 가져오는 뷰
def filter_by_category(request, region):
    category1 = request.GET.get('category1')
    category2 = request.GET.get('category2')


    cultural_facilities = temp_cultural_facilities.objects.filter(loc=region)
    rental_locations = RentalStation.objects.filter(loc=region)

    # 카테고리 1로 필터링
    filtered_facilities1 = cultural_facilities.filter(category=category1) if category1 else []

    # 카테고리 2로 필터링
    filtered_facilities2 = cultural_facilities.filter(category=category2) if category2 else []

    # JSON 형식으로 데이터 반환
    data = {
        'filtered_facilities1': list(filtered_facilities1.values()) if filtered_facilities1 else [],
        'filtered_facilities2': list(filtered_facilities2.values()) if filtered_facilities2 else [],
        'rental_locations': list(rental_locations.values()) if rental_locations else []

    }
    return JsonResponse(data)

