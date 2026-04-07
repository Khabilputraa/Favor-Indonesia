from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Contact, CompanyInfo
from .serializers import ContactSerializer, CompanyInfoSerializer

@api_view(['GET', 'POST'])
def contact_list(request):
    if request.method == 'GET':
        contacts = Contact.objects.all().order_by('-created_at')
        serializer = ContactSerializer(contacts, many=True)
        return Response({'status': 'success', 'data': serializer.data})
    
    elif request.method == 'POST':
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'status': 'error', 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def contact_detail(request, pk):
    try:
        contact = Contact.objects.get(pk=pk)
    except Contact.DoesNotExist:
        return Response({'status': 'error', 'message': 'Contact not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ContactSerializer(contact)
        return Response({'status': 'success', 'data': serializer.data})
    
    elif request.method == 'PUT':
        serializer = ContactSerializer(contact, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'data': serializer.data})
        return Response({'status': 'error', 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        contact.delete()
        return Response({'status': 'success', 'message': 'Contact deleted'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'PUT'])
def company_info(request):
    try:
        info = CompanyInfo.objects.first()
        if not info:
            return Response({'status': 'error', 'message': 'Company info not found'}, status=status.HTTP_404_NOT_FOUND)
    except CompanyInfo.DoesNotExist:
        return Response({'status': 'error', 'message': 'Company info not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = CompanyInfoSerializer(info)
        return Response({'status': 'success', 'data': serializer.data})
    
    elif request.method == 'PUT':
        serializer = CompanyInfoSerializer(info, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'data': serializer.data})
        return Response({'status': 'error', 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)