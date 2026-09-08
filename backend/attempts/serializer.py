from rest_framework import serializers
from .models import Attempt, StudentAnswer

class StudentAnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    selected_option_text = serializers.CharField(source='selected_option.option_text', read_only=True)
    correct_option_text = serializers.SerializerMethodField()

    class Meta:
        model = StudentAnswer
        fields = [
            "id", "question", "question_text", "selected_option", 
            "selected_option_text", "is_correct", "marks_obtained",
            "correct_option_text"
        ]

    def get_correct_option_text(self, obj):
        correct = obj.question.options.filter(is_correct=True).first()
        return correct.option_text if correct else "N/A"


class AttemptSerializer(serializers.ModelSerializer):
    answers = StudentAnswerSerializer(many=True,read_only=True)

    class Meta:
        model = Attempt
        fields = "__all__"
       