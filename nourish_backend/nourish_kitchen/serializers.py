from rest_framework import serializers
from .models import User, Recipe, Ingredient, Step, BlogPost, Comment, NewsletterSubscription

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'avatar', 'bio', 'joined_at', 'last_seen', 'status']
        read_only_fields = ['id', 'joined_at']

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'qty', 'unit', 'custom_unit', 'category', 'name']

class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ['id', 'title', 'description', 'image']

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True)
    steps = StepSerializer(many=True)
    author_name = serializers.ReadOnlyField(source='author.username')
    liked_by_count = serializers.IntegerField(source='liked_by.count', read_only=True)

    class Meta:
        model = Recipe
        fields = [
            'id', 'title', 'story', 'author', 'author_name', 'prep_time',
            'cuisine', 'categories', 'hero_image', 'youtube_link',
            'calories', 'spice_level', 'ingredients', 'steps',
            'pro_tip', 'rating', 'views', 'liked_by', 'liked_by_count',
            'created_at', 'updated_at', 'is_published', 'is_deleted'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'views', 'rating']

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        steps_data = validated_data.pop('steps')
        recipe = Recipe.objects.create(**validated_data)
        for ingredient_data in ingredients_data:
            Ingredient.objects.create(recipe=recipe, **ingredient_data)
        for step_data in steps_data:
            Step.objects.create(recipe=recipe, **step_data)
        return recipe

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('ingredients', None)
        steps_data = validated_data.pop('steps', None)

        instance = super().update(instance, validated_data)

        if ingredients_data is not None:
            instance.ingredients.all().delete()
            for ingredient_data in ingredients_data:
                Ingredient.objects.create(recipe=instance, **ingredient_data)

        if steps_data is not None:
            instance.steps.all().delete()
            for step_data in steps_data:
                Step.objects.create(recipe=instance, **step_data)

        return instance

class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')
    bookmarked_by_count = serializers.IntegerField(source='bookmarked_by.count', read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'excerpt', 'content', 'category', 'author', 
            'author_name', 'hero_image', 'date', 'reading_time', 
            'syndication_links', 'is_published', 'bookmarked_by', 
            'bookmarked_by_count', 'is_deleted'
        ]
        read_only_fields = ['id', 'date']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            'id', 'recipe', 'blog_post', 'user', 'user_name', 
            'user_avatar', 'user_email', 'user_website', 'rating', 
            'content', 'type', 'created_at', 'is_read', 'parent', 
            'is_approved', 'is_anonymous'
        ]
        read_only_fields = ['id', 'created_at', 'is_read']

class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscription
        fields = ['id', 'email', 'date']
        read_only_fields = ['id', 'date']
