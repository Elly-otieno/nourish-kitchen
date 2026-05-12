from django.contrib import admin
from .models import User, Recipe, Ingredient, Step, BlogPost, Comment, NewsletterSubscription

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'status', 'joined_at')
    list_filter = ('role', 'status')
    search_fields = ('username', 'email')

class IngredientInline(admin.TabularInline):
    model = Ingredient
    extra = 1

class StepInline(admin.TabularInline):
    model = Step
    extra = 1

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'cuisine', 'spice_level', 'is_published', 'is_deleted')
    list_filter = ('cuisine', 'spice_level', 'is_published', 'is_deleted')
    search_fields = ('title', 'story')
    inlines = [IngredientInline, StepInline]
    
    actions = ['mark_as_deleted', 'restore_recipes']

    def mark_as_deleted(self, request, queryset):
        queryset.update(is_deleted=True)
    mark_as_deleted.short_description = "Archive selected recipes"

    def restore_recipes(self, request, queryset):
        queryset.update(is_deleted=False)
    restore_recipes.short_description = "Restore selected recipes"

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'date', 'is_published', 'is_deleted')
    list_filter = ('category', 'is_published', 'is_deleted')
    search_fields = ('title', 'excerpt', 'content')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'type', 'is_approved', 'is_read', 'created_at')
    list_filter = ('type', 'is_approved', 'is_read')
    search_fields = ('content', 'user_name', 'user_email')

@admin.register(NewsletterSubscription)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ('email', 'date')
    search_fields = ('email',)
