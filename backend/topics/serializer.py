from rest_framework import serializers
from .models import Topic


class TopicSerializer(serializers.ModelSerializer):

    created_by = serializers.StringRelatedField()

    class Meta:
        model = Topic
        fields = [
            "id",
            "name",
            "description",
            "created_by",
            "is_active",
            "created_at",
            "updated_at",
        ]