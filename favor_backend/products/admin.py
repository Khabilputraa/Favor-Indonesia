from django.contrib import admin
from .models import Brand, Category, Product

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'order', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['order', 'is_active']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'brand', 'slug', 'is_active']
    list_filter = ['brand', 'is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'brand', 'category', 'price', 'is_active', 'featured', 'stock_available', 'created_at']
    list_filter = ['brand', 'category', 'is_active', 'featured', 'stock_available']
    search_fields = ['name', 'description', 'ingredients']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_active', 'featured', 'stock_available']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'brand', 'category')
        }),
        ('Product Details', {
            'fields': ('short_description', 'description', 'price', 'image')
        }),
        ('Additional Info', {
            'fields': ('ingredients', 'nutritional_info')
        }),
        ('Settings', {
            'fields': ('is_active', 'featured', 'stock_available', 'order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )