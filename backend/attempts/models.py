from django.db import models
from django.conf import settings
from quizzes.models import Quiz, Question, Option


class Attempt(models.Model):

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="attempts",
        limit_choices_to={"role": "STUDENT"}
    )

    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name="attempts"
    )

    score = models.PositiveIntegerField(default=0)

    total_marks = models.PositiveIntegerField(default=0)

    is_passed = models.BooleanField(default=False)

    completed = models.BooleanField(default=False) 

    started_at = models.DateTimeField(auto_now_add=True)

    submitted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["started_at"]

    def __str__(self):
        return f"{self.student.email} - {self.quiz.title}"





class StudentAnswer(models.Model):

    attempt = models.ForeignKey(
        Attempt,
        on_delete=models.CASCADE,
        related_name="answers"
    )

    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE
    )

    selected_option = models.ForeignKey(
        Option,
        on_delete=models.CASCADE
    )

    is_correct = models.BooleanField(default=False)

    marks_obtained = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.attempt.student.email} - {self.question.id}"