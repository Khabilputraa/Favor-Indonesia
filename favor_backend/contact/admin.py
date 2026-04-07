from django.contrib import admin
from .models import Contact, CompanyInfo

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    list_editable = ['is_read']
    readonly_fields = ['created_at']


@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Company Information', {
            'fields': ('company_name', 'address', 'city', 'postal_code')
        }),
        ('Contact Details', {
            'fields': ('phone', 'email', 'whatsapp', 'business_hours')
        }),
        ('Social Media', {
            'fields': ('facebook', 'instagram', 'twitter', 'linkedin')
        }),
        ('About Us', {
            'fields': ('about_us', 'vision', 'mission')
        }),
    )
    
    def has_add_permission(self, request):
        return not CompanyInfo.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False