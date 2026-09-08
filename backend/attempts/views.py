from django.utils import timezone
from django.db import transaction

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from quizzes.models import Quiz, Question, Option
from .models import Attempt, StudentAnswer
from .serializer import AttemptSerializer




@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_quiz(request, quiz_id):

    # Only students can attempt quiz
    if request.user.role != "STUDENT":
        return Response(
            {"error": "Only students can attempt quizzes."},
            status=status.HTTP_403_FORBIDDEN
        )

    
    try:
        quiz = Quiz.objects.get(pk=quiz_id, is_active=True)

    except Quiz.DoesNotExist:
        return Response(
            {"error": "Quiz not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    # Check unfinished attempt
    attempt = Attempt.objects.filter(
        student=request.user,
        quiz=quiz,
        submitted_at__isnull=True
    ).first()

    if attempt is None:
        attempt = Attempt.objects.create(
            student=request.user,
            quiz=quiz
        )

    serializer = AttemptSerializer(attempt)

    return Response(
        {
            "message": "Quiz started successfully.",
            "attempt": serializer.data
        },
        status=status.HTTP_201_CREATED
    )




@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_quiz(request, attempt_id):

    try:
        attempt = Attempt.objects.get(
            id=attempt_id,
            student=request.user
        )

    except Attempt.DoesNotExist:
        return Response(
            {"error": "Attempt not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    if attempt.completed:
        return Response(
            {"error": "Quiz already submitted."},
            status=status.HTTP_400_BAD_REQUEST
        )

    answers = request.data.get("answers", [])

    if not answers:
        return Response(
            {"error": "Answers are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    score = 0

    with transaction.atomic():

        for answer in answers:

            question_id = answer.get("question")
            option_id = answer.get("option")

            try:
                question = Question.objects.get(
                    id=question_id,
                    quiz=attempt.quiz
                )

                selected_option = Option.objects.get(
                    id=option_id,
                    question=question
                )

            except (Question.DoesNotExist, Option.DoesNotExist):

                return Response(
                    {"error": "Invalid question or option."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            StudentAnswer.objects.update_or_create(
                attempt=attempt,
                question=question,
                defaults={
                    "selected_option": selected_option,
                    "is_correct": selected_option.is_correct
                }
            )

            if selected_option.is_correct:
                score += question.marks

        attempt.score = score
        attempt.total_marks = attempt.quiz.total_marks
        attempt.is_passed = score >= attempt.quiz.passing_marks
        attempt.completed = True
        attempt.submitted_at = timezone.now()   # FIXED: was completed_at (doesn't exist on model)
        attempt.save()

    serializer = AttemptSerializer(attempt)

    return Response(
        {
            "message": "Quiz submitted successfully.",
            "score": score,
            "result": serializer.data
        },
        status=status.HTTP_200_OK
    )



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def attempt_list(request):

    attempts = Attempt.objects.filter(
        student=request.user
    ).order_by("-started_at")

    serializer = AttemptSerializer(
        attempts,
        many=True
    )

    return Response(serializer.data)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def attempt_detail(request, pk):

    try:
        attempt = Attempt.objects.get(
            pk=pk,
            student=request.user
        )

    except Attempt.DoesNotExist:
        return Response(
            {"error": "Attempt not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = AttemptSerializer(attempt)

    return Response(serializer.data)