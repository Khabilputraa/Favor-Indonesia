from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Partnership, PartnershipInquiry
from .serializers import PartnershipSerializer, PartnershipInquirySerializer

@api_view(['GET', 'POST'])
def partnership_list(request):
    if request.method == 'GET':
        partnerships = Partnership.objects.all()
        serializer = PartnershipSerializer(partnerships, many=True)
        return Response({'status': 'success', 'data': serializer.data})
    
    elif request.method == 'POST':
        serializer = PartnershipSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'status': 'error', 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def partnership_detail(request, pk):
    try:
        partnership = Partnership.objects.get(pk=pk)
    except Partnership.DoesNotExist:
        return Response({'status': 'error', 'message': 'Partnership not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = PartnershipSerializer(partnership)
        return Response({'status': 'success', 'data': serializer.data})
    
    elif request.method in ['PUT', 'PATCH']:
        serializer = PartnershipSerializer(partnership, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'data': serializer.data})
        return Response({'status': 'error', 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        partnership.delete()
        return Response({'status': 'success', 'message': 'Partnership deleted'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def inquiry_list(request):
    if request.method == 'GET':
        inquiries = PartnershipInquiry.objects.all()
        serializer = PartnershipInquirySerializer(inquiries, many=True)
        return Response({'status': 'success', 'data': serializer.data})
    
    elif request.method == 'POST':
        serializer = PartnershipInquirySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'status': 'error', 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def inquiry_detail(request, pk):
    try:
        inquiry = PartnershipInquiry.objects.get(pk=pk)
    except PartnershipInquiry.DoesNotExist:
        return Response({'status': 'error', 'message': 'Inquiry not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = PartnershipInquirySerializer(inquiry)
        return Response({'status': 'success', 'data': serializer.data})
    
    elif request.method in ['PUT', 'PATCH']:
        serializer = PartnershipInquirySerializer(inquiry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'data': serializer.data})
        return Response({'status': 'error', 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        inquiry.delete()
        return Response({'status': 'success', 'message': 'Inquiry deleted'}, status=status.HTTP_204_NO_CONTENT)