from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import HousePost
from .serializers import HousePostSerializer


class HousePostAPIView(APIView):

    def get(self, request):
        house_posts = HousePost.objects.all()
        serializer = HousePostSerializer(house_posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = HousePostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
