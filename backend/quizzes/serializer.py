from rest_framework import serializers
from .models import Quiz, Question, Option


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = [
            "id",
            "option_text",
        ]


class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = [
            "id",
            "question_text",
            "marks",
            "options",
        ]


class QuizSerializer(serializers.ModelSerializer):
    # Read: show topic name as a string
    topic_name = serializers.StringRelatedField(source="topic", read_only=True)
    # Read: show creator email as a string
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Quiz
        fields = [
            "id",
            "title",
            "description",
            "topic",        # writable integer FK for POST/PUT
            "topic_name",   # readable string for GET responses
            "created_by",
            "total_marks",
            "passing_marks",
            "time_limit",   # FIXED: was "duration" which doesn't exist on model
            "is_active",
        ]
        extra_kwargs = {
            "topic": {"write_only": True},  # hide raw FK int from GET; use topic_name instead
        }


class QuizDetailSerializer(serializers.ModelSerializer):
    topic_name = serializers.StringRelatedField(source="topic", read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = [
            "id",
            "title",
            "description",
            "topic",        # writable
            "topic_name",   # readable
            "total_marks",
            "passing_marks",
            "time_limit",   # FIXED: was "duration"
            "is_active",
            "questions",
        ]
        extra_kwargs = {
            "topic": {"write_only": True},
        }

# Added for Admin to manage questions
class AdminOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ["id", "option_text", "is_correct"]

class AdminQuestionSerializer(serializers.ModelSerializer):
    options = AdminOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ["id", "question_text", "marks", "options"]