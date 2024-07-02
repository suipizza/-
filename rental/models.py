from django.db import models

# Create your models here.
class RentalStation(models.Model):
    name = models.CharField(max_length=100)
    loc = models.CharField(max_length=255,default="Unknown Location")  # 새로운 컬럼 추가
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name


class temp_cultural_facilities(models.Model):
    name = models.CharField(max_length=255)
    loc = models.CharField(max_length=255)
    category= models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    rate = models.FloatField(default=0.0)
    address = models.CharField(max_length=255)

    def __str__(self):
        return self.name