from django.urls import path
from . import views

urlpatterns = [
    path('', views.brand_list, name='brand-list'),
    path('<int:pk>/', views.brand_detail, name='brand-detail'),
]