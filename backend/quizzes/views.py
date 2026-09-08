from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Quiz, Question, Option
from .serializer import QuizSerializer, QuizDetailSerializer, AdminQuestionSerializer

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def quiz_list_create(request):

    if request.method == "GET":

        quizzes = Quiz.objects.filter(is_active=True)
        serializer = QuizSerializer(quizzes, many=True)
        return Response(serializer.data)

    elif request.method == "POST":

        if request.user.role != "ADMIN":
            return Response(
                {"error": "Only Admin can create quizzes."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = QuizSerializer(data=request.data)

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
def quiz_detail(request, pk):

    try:
        quiz = Quiz.objects.get(pk=pk)
    except Quiz.DoesNotExist:
        return Response(
            {"error": "Quiz not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "GET":
        serializer = QuizDetailSerializer(quiz)
        return Response(serializer.data)

    elif request.method == "PUT":
        if request.user.role != "ADMIN":
            return Response(
                {"error": "Only Admin can update quizzes."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = QuizSerializer(quiz, data=request.data)

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
                {"error": "Only Admin can delete quizzes."},
                status=status.HTTP_403_FORBIDDEN
            )

        quiz.delete()
        return Response(
            {"message": "Quiz deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def quiz_questions_list_create(request, quiz_id):
    if request.user.role != 'ADMIN':
        return Response({'error': 'Only Admin can manage questions.'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        quiz = Quiz.objects.get(pk=quiz_id)
    except Quiz.DoesNotExist:
        return Response({'error': 'Quiz not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        questions = quiz.questions.all()
        serializer = AdminQuestionSerializer(questions, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        question_text = request.data.get('question_text')
        marks = request.data.get('marks', 1)
        options_data = request.data.get('options', [])

        if not question_text or not options_data:
            return Response({'error': 'Question text and options are required.'}, status=status.HTTP_400_BAD_REQUEST)

        question = Question.objects.create(quiz=quiz, question_text=question_text, marks=marks)
        
        for opt in options_data:
            Option.objects.create(
                question=question,
                option_text=opt.get('option_text', ''),
                is_correct=opt.get('is_correct', False)
            )

        serializer = AdminQuestionSerializer(question)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def question_detail(request, pk):
    if request.user.role != 'ADMIN':
        return Response({'error': 'Only Admin can manage questions.'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        question = Question.objects.get(pk=pk)
    except Question.DoesNotExist:
        return Response({'error': 'Question not found.'}, status=status.HTTP_404_NOT_FOUND)

    question.delete()
    return Response({'message': 'Question deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
