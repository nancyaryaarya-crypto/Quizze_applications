from rest_framework import serializers
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "username",
            "role",
            "created_at",
        ]



class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) 
    password2 = serializers.CharField(write_only=True) 

    class Meta:
        model = CustomUser
        fields = [
            "email",
            "username",
            "password",
            "password2",
            "role",
        ]

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Passwords do not match."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        password = validated_data.pop("password")

        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()

        return user



    # def create(self, validated_data):
    #     validated_data.pop("password2")
    #     role = validated_data.pop("role", CustomUser.Role.STUDENT)
    #     user = CustomUser.objects.create_user(
    #         email=validated_data["email"],
    #         username=validated_data["username"],
    #         password=validated_data["password"],
    #     )
        # return user