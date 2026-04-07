from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def products_admin(request):
    return render(request, 'products.html')