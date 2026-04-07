from django.urls import path
from . import views

urlpatterns = [
    path('', views.partnership_list, name='partnership-list'),
    path('<int:pk>/', views.partnership_detail, name='partnership-detail'),
    path('inquiries/', views.inquiry_list, name='inquiry-list'),
    path('inquiries/<int:pk>/', views.inquiry_detail, name='inquiry-detail'),
]