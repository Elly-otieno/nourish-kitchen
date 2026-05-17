from rest_framework import serializers
from .models import User, UserRole, Recipe, Ingredient, Step, BlogPost, Comment, NewsletterSubscription

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'avatar', 'bio', 'joined_at', 'last_seen', 'status']
        read_only_fields = ['id', 'joined_at']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'avatar', 'bio']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', UserRole.USER),
            avatar=validated_data.get('avatar', ''),
            bio=validated_data.get('bio', '')
        )
        return user

import json
from rest_framework import serializers
from .models import User, Recipe, Ingredient, Step

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
        fields = '__all__'
       
        read_only_fields = ['id', 'author', 'created_at', 'updated_at', 'views', 'rating', 'liked_by']

    def to_internal_value(self, data):
        """
        Customizes how data is received. This is crucial for handling FormData,
        which sends JSON arrays (ingredients, steps, categories) as strings.
        """
        import json
        # Handle the QueryDict from MultiPartParser
        # We convert to a dict to make it mutable
        if hasattr(data, 'dict'):
            resource_data = data.dict()
        else:
            resource_data = data.copy() if hasattr(data, 'copy') else data

        # Parse strings into lists/objects
        for field in ['ingredients', 'steps', 'categories']:
            value = resource_data.get(field)
            if isinstance(value, str):
                try:
                    resource_data[field] = json.loads(value)
                except (ValueError, TypeError):
                    # If it's not JSON, let it pass to standard validation
                    pass
        
        # Remove empty image strings/nulls to prevent URL errors
        if 'hero_image' in resource_data:
            if not resource_data['hero_image'] or resource_data['hero_image'] in ['null', 'undefined', '']:
                resource_data.pop('hero_image')

        return super().to_internal_value(resource_data)

    def create(self, validated_data):
        """
        Handles nested creation of Ingredients and Steps.
        """
        ingredients_data = validated_data.pop('ingredients', [])
        steps_data = validated_data.pop('steps', [])
        
        recipe = Recipe.objects.create(**validated_data)
        
        for ingredient_data in ingredients_data:
            Ingredient.objects.create(recipe=recipe, **ingredient_data)
            
        for step_data in steps_data:
            Step.objects.create(recipe=recipe, **step_data)
            
        return recipe

    def update(self, instance, validated_data):
        """
        Handles nested updates by clearing old records and creating new ones.
        """
        ingredients_data = validated_data.pop('ingredients', None)
        steps_data = validated_data.pop('steps', None)

        # Update the main recipe fields
        instance = super().update(instance, validated_data)

        # Update Ingredients if provided
        if ingredients_data is not None:
            instance.ingredients.all().delete()
            for ingredient_data in ingredients_data:
                Ingredient.objects.create(recipe=instance, **ingredient_data)

        # Update Steps if provided
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
            'content', 'type', 'created_at', 'parent', 'is_approved', 'is_anonymous'
        ]
        extra_kwargs = {
            'user_name': {'required': False, 'allow_blank': True},
            'user_avatar': {'required': False, 'allow_blank': True},
            'user_email': {'required': False, 'allow_null': True},
            'user_website': {'required': False, 'allow_null': True},
        }

    def validate(self, attrs):
        request = self.context.get('request')
        user = request.user if request else None
        is_anon = attrs.get('is_anonymous', False)

        # Case A: User wants to hide completely (Logged-in or Guest)
        if is_anon:
            attrs['user_name'] = "Anonymous Foodie"
            attrs['user_avatar'] = "https://api.dicebear.com/7.x/bottts/svg?seed=HiddenGuest"
            # We don't touch their email/website here; we clear them out during representation output below
            
        # Case B: Logged-out Public Guest providing their own info
        elif not user or user.is_anonymous:
            if not attrs.get('user_name'):
                attrs['user_name'] = "Guest Chef" # Fallback if they left it blank
            if not attrs.get('user_avatar'):
                # Give them a dynamic avatar based on their name!
                seed = attrs.get('user_name', 'Guest')
                attrs['user_avatar'] = f"https://api.dicebear.com/7.x/fun-emoji/svg?seed={seed}"

        return attrs

    def to_representation(self, instance):
        """Mask identity attributes ONLY if explicitly marked as anonymous"""
        data = super().to_representation(instance)
        if instance.is_anonymous:
            data['user'] = None
            data['user_name'] = "Anonymous Foodie"
            data['user_avatar'] = "https://api.dicebear.com/7.x/bottts/svg?seed=HiddenGuest"
            data['user_email'] = None
            data['user_website'] = None
        else:
            # For public guests, hide their email from other public users to prevent spam scrapers
            data['user_email'] = None 
        return data
class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscription
        fields = ['id', 'email', 'date']
        read_only_fields = ['id', 'date']

class AccountSetupSerializer(serializers.Serializer):
    token = serializers.UUIDField(required=True)
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    name = serializers.CharField(required=False, allow_blank=True)

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    password_new = serializers.CharField(write_only=True, min_length=8)
