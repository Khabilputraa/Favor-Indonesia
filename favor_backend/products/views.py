from rest_framework.decorators import api_view, parser_classes, renderer_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .models import Product, Brand, Category
from .serializers import (
    ProductSerializer, 
    ProductListSerializer,
    BrandSerializer, 
    CategorySerializer
)
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
def product_catalog(request):
    products = Product.objects.filter(is_active=True).select_related('brand', 'category')
    
    brand_slug = request.GET.get('brand', None)
    if brand_slug and brand_slug != 'all':
        products = products.filter(brand__slug=brand_slug)
    
    category_slug = request.GET.get('category', None)
    if category_slug:
        products = products.filter(category__slug=category_slug)
    
    search = request.GET.get('search', None)
    if search:
        products = products.filter(
            Q(name__icontains=search) | 
            Q(description__icontains=search) |
            Q(ingredients__icontains=search)
        )
    
    featured = request.GET.get('featured', None)
    if featured == 'true':
        products = products.filter(featured=True)
    
    serializer = ProductListSerializer(products, many=True)
    
    return Response({
        'status': 'success',
        'count': len(serializer.data),
        'data': serializer.data
    })

@api_view(['GET'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
def product_detail(request, slug):
    try:
        product = Product.objects.select_related('brand', 'category').get(
            slug=slug, 
            is_active=True
        )
        serializer = ProductSerializer(product)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    except Product.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Product not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
def brand_list(request):
    brands = Brand.objects.filter(is_active=True)
    serializer = BrandSerializer(brands, many=True)
    return Response({
        'status': 'success',
        'data': serializer.data
    })

@api_view(['GET'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
def brand_detail(request, slug):
    try:
        brand = Brand.objects.get(slug=slug, is_active=True)
        brand_serializer = BrandSerializer(brand)
        
        products = Product.objects.filter(brand=brand, is_active=True)
        products_serializer = ProductListSerializer(products, many=True)
        
        return Response({
            'status': 'success',
            'data': {
                'brand': brand_serializer.data,
                'products': products_serializer.data
            }
        })
    except Brand.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Brand not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
def category_list(request):
    categories = Category.objects.filter(is_active=True).select_related('brand')
    
    brand_slug = request.GET.get('brand', None)
    if brand_slug:
        categories = categories.filter(brand__slug=brand_slug)
    
    serializer = CategorySerializer(categories, many=True)
    return Response({
        'status': 'success',
        'data': serializer.data
    })

@api_view(['GET'])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
def featured_products(request):
    limit = request.GET.get('limit', 8)
    
    products = Product.objects.filter(
        is_active=True, 
        featured=True
    ).select_related('brand', 'category')[:int(limit)]
    
    serializer = ProductListSerializer(products, many=True)
    return Response({
        'status': 'success',
        'data': serializer.data
    })

@api_view(['GET', 'POST'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
def product_list_create(request):
    try:
        if request.method == 'GET':
            products = Product.objects.all().select_related('brand', 'category')
            serializer = ProductSerializer(products, many=True)
            return Response({
                'status': 'success',
                'data': serializer.data
            })
        
        elif request.method == 'POST':
            logger.info(f"POST data: {request.data}")
            logger.info(f"POST files: {request.FILES}")
            
            serializer = ProductSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'status': 'success',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
            
            logger.error(f"Validation errors: {serializer.errors}")
            return Response({
                'status': 'error',
                'message': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT', 'DELETE'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
def product_detail_update_delete(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Product not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    
    elif request.method == 'PUT':
        logger.info(f"PUT data: {request.data}")
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'data': serializer.data
            })
        logger.error(f"Validation errors: {serializer.errors}")
        return Response({
            'status': 'error',
            'message': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        product.delete()
        return Response({
            'status': 'success',
            'message': 'Product deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)