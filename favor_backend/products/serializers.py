from rest_framework import serializers
from .models import Product, Brand, Category

class BrandSerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'description', 'logo', 'is_active', 'products_count']
    
    def get_products_count(self, obj):
        return obj.products.filter(is_active=True).count()

class CategorySerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    products_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'brand', 'brand_name', 'description', 'products_count']
    
    def get_products_count(self, obj):
        return obj.products.filter(is_active=True).count()

class ProductSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.name', read_only=True, allow_null=True, default=None)
    brand_slug = serializers.CharField(source='brand.slug', read_only=True, allow_null=True, default=None)
    category_name = serializers.CharField(source='category.name', read_only=True, allow_null=True, default=None)
    ingredients_list = serializers.SerializerMethodField()
    formatted_price = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'short_description',
            'price', 'formatted_price', 'image',
            'brand', 'brand_name', 'brand_slug',
            'category', 'category_name',
            'ingredients', 'ingredients_list',
            'nutritional_info',
            'is_active', 'featured', 'stock_available',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'slug': {'required': False, 'allow_blank': True}
        }
    
    def validate(self, data):
        if 'slug' in data and not data['slug']:
            data.pop('slug')
        return data
    
    def get_ingredients_list(self, obj):
        try:
            if obj.ingredients:
                return obj.get_ingredients_list()
            return []
        except Exception as e:
            print(f"Error getting ingredients: {e}")
            return []
    
    def get_formatted_price(self, obj):
        try:
            return obj.formatted_price()
        except Exception as e:
            print(f"Error formatting price: {e}")
            return str(obj.price) if obj.price else "0"

class ProductListSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.name', read_only=True, allow_null=True, default=None)
    brand_slug = serializers.CharField(source='brand.slug', read_only=True, allow_null=True, default=None)
    formatted_price = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'short_description',
            'description',  # ✅ DITAMBAHKAN
            'price', 'formatted_price', 'image',
            'brand_name', 'brand_slug',
            'featured', 'stock_available'
        ]
    
    def get_formatted_price(self, obj):
        try:
            return obj.formatted_price()
        except Exception as e:
            print(f"Error formatting price: {e}")
            return str(obj.price) if obj.price else "0"