from django.urls import path
from .views import map_view, main_view, filter_by_category

urlpatterns = [
    path('map/<str:region>/', map_view, name='map_view'),
    path('mainpage', main_view, name='main_view'),
    path('filter/<str:region>/', filter_by_category, name='filter_by_category'),

]
