from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Authentication
    path('login/', auth_views.LoginView.as_view(template_name='admin/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),

    # Protected pages (perlu login)
    path('dashboard/', login_required(TemplateView.as_view(template_name='admin/admin_dashboard.html')), name='admin_dashboard'),
    path('products/', login_required(TemplateView.as_view(template_name='admin/products.html')), name='products'),
    path('brands/', login_required(TemplateView.as_view(template_name='admin/brands.html')), name='brands'),
    path('partnerships/', login_required(TemplateView.as_view(template_name='admin/partnerships.html')), name='partnerships'),
    path('news/', login_required(TemplateView.as_view(template_name='admin/news.html')), name='news'),
    path('contact/', login_required(TemplateView.as_view(template_name='admin/contact.html')), name='contact'),
    
    # API endpoints
    path('api/brands/', include('brands.urls')),
    path('api/contact/', include('contact.urls')),
    path('api/news/', include('news.urls')),
    path('api/partnerships/', include('partnerships.urls')),
    path('api/products/', include('products.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)