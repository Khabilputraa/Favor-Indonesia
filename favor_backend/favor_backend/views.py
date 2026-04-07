from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from products.models import Product
from brands.models import Brand
from partnerships.models import Partnership
from news.models import News
from contact.models import Contact

@login_required
def admin_dashboard(request):
    context = {
        'total_products': Product.objects.count(),
        'total_brands': Brand.objects.count(),
        'total_partnerships': Partnership.objects.count(),
        'total_news': News.objects.count(),
        'recent_products': Product.objects.all()[:5],
        'recent_contacts': Contact.objects.all().order_by('-created_at')[:5],
    }
    return render(request, 'admin_dashboard.html', context)