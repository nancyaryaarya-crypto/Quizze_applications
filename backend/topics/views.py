
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Topic
from .serializer import TopicSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def topic_list_create(request):

    if request.method == "GET":

        topics = Topic.objects.filter(is_active=True)

        serializer = TopicSerializer(topics, many=True)

        return Response(serializer.data)


    elif request.method == "POST":

        # Only admin can create topic
        if request.user.role != "ADMIN":
            return Response(
                {"error": "Only Admin can create topics."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = TopicSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(created_by=request.user)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def topic_detail(request, pk):

    try:
        topic = Topic.objects.get(pk=pk)

    except Topic.DoesNotExist:
        return Response(
            {"error": "Topic not found"},
            status=status.HTTP_404_NOT_FOUND
        )


    if request.method == "GET":

        serializer = TopicSerializer(topic)

        return Response(serializer.data)


    elif request.method == "PUT":

        if request.user.role != "ADMIN":
            return Response(
                {"error": "Only Admin can update topics."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = TopicSerializer(topic, data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


    elif request.method == "DELETE":

        if request.user.role != "ADMIN":
            return Response(
                {"error": "Only Admin can delete topics."},
                status=status.HTTP_403_FORBIDDEN
            )

        topic.delete()

        return Response(
            {"message": "Topic deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )