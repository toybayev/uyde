from rest_framework import serializers
from .models import HousePost

class HousePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = HousePost
        fields = "__all__"