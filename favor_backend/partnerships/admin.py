from django.contrib import admin
from .models import Partnership, PartnershipInquiry


@admin.register(Partnership)
class PartnershipAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'is_active', 'order', 'created_at']
    list_filter = ['is_active']
    search_fields = ['company_name']
    list_editable = ['is_active', 'order']


@admin.register(PartnershipInquiry)
class PartnershipInquiryAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'contact_person', 'email', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['company_name', 'contact_person', 'email']
    list_editable = ['status']
    readonly_fields = ['created_at']