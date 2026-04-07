from django.db import models

class Contact(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.subject}"


ContactMessage = Contact


class CompanyInfo(models.Model):
    company_name = models.CharField(max_length=200, default='Favor Indonesia')
    address = models.TextField()
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10)
    
    # Contact Details
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    whatsapp = models.CharField(max_length=20, blank=True)
    business_hours = models.TextField(help_text='Contoh: Senin-Jumat: 09:00-17:00')
    
    # Social Media
    facebook = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    
    # About Us
    about_us = models.TextField(blank=True)
    vision = models.TextField(blank=True)
    mission = models.TextField(blank=True)
    
    class Meta:
        verbose_name = 'Company Information'
        verbose_name_plural = 'Company Information'
    
    def __str__(self):
        return self.company_name
    
    def save(self, *args, **kwargs):
        if not self.pk and CompanyInfo.objects.exists():
            raise ValueError('Hanya boleh ada satu Company Info')
        return super().save(*args, **kwargs)