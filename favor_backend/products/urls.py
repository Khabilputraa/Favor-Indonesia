from django.urls import path
from . import views

urlpatterns = [
    path('', views.product_list_create, name='product-list-create'),
    path('<int:pk>/', views.product_detail_update_delete, name='product-detail-update-delete'),
    
    path('catalog/', views.product_catalog, name='product-catalog'),
    path('catalog/<slug:slug>/', views.product_detail, name='product-detail'),
    path('brands/', views.brand_list, name='brand-list'),
    path('brands/<slug:slug>/', views.brand_detail, name='brand-detail'),
    path('categories/', views.category_list, name='category-list'),
    path('featured/', views.featured_products, name='featured-products'),
]