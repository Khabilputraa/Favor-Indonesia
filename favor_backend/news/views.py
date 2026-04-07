from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import News, NewsCategory
from .serializers import NewsSerializer, NewsCategorySerializer

class NewsCategoryViewSet(viewsets.ModelViewSet):
    queryset = NewsCategory.objects.all()
    serializer_class = NewsCategorySerializer

class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    
    def list(self, request):
        news = self.get_queryset()
        serializer = self.get_serializer(news, many=True)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    
    def retrieve(self, request, pk=None):
        news = get_object_or_404(News, pk=pk)
        serializer = self.get_serializer(news)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'News created successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'status': 'error',
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, pk=None):
        news = get_object_or_404(News, pk=pk)
        serializer = self.get_serializer(news, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'News updated successfully',
                'data': serializer.data
            })
        return Response({
            'status': 'error',
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        news = get_object_or_404(News, pk=pk)
        news.delete()
        return Response({
            'status': 'success',
            'message': 'News deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_news = self.get_queryset().filter(is_featured=True, is_active=True)
        serializer = self.get_serializer(featured_news, many=True)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
