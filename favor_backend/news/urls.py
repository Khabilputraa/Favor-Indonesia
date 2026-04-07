from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NewsViewSet, NewsCategoryViewSet

router = DefaultRouter()
router.register(r'categories', NewsCategoryViewSet, basename='newscategory')
router.register(r'', NewsViewSet, basename='news')

urlpatterns = [
    path('', include(router.urls)),
]