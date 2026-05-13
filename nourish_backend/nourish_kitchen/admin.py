from django.contrib import admin
from django.utils.html import format_html
import csv
from django.http import HttpResponse
from django.db.models import Count
from .models import User, Recipe, Ingredient, Step, BlogPost, Comment, NewsletterSubscription, RecipeArchive, BlogArchive

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'status', 'joined_at')
    list_filter = ('role', 'status')
    search_fields = ('username', 'email')

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.annotate(_recipe_count=Count('recipes', distinct=True))
        return queryset

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

    readonly_fields = ('created_at', 'updated_at')
    
    actions = ['mark_as_deleted', 'restore_recipes']

    def mark_as_deleted(self, request, queryset):
        queryset.update(is_deleted=True)
    mark_as_deleted.short_description = "Archive selected recipes"

    def restore_recipes(self, request, queryset):
        queryset.update(is_deleted=False)
    restore_recipes.short_description = "Restore selected recipes"

    def status_tag(self, obj):
        if obj.is_deleted:
            return format_html('<span style="color: red;">Archived</span>')
        return format_html('<span style="color: green;">Active</span>')
    status_tag.short_description = "Status"

    def thumbnail(self, obj):
        if obj.hero_image: 
            return format_html('<img src="{}" style="width: 45px; height:45px; border-radius: 50%;" />', obj.hero_image.url)
        return "No Image"
    
    list_display = ('thumbnail', 'title', 'author', 'is_published')

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

    list_display = ('user_name', 'content_excerpt', 'is_approved', 'created_at')
    actions = ['approve_comments', 'reject_comments']

    def content_excerpt(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content

    def approve_comments(self, request, queryset):
        queryset.update(is_approved=True)
    approve_comments.short_description = "Approve selected comments"

def export_newsletter_emails(modeladmin, request, queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="subscribers.csv"'
    writer = csv.writer(response)
    writer.writerow(['Email', 'Date Subscribed'])
    for obj in queryset:
        writer.writerow([obj.email, obj.date])
    return response

@admin.register(NewsletterSubscription)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ('email', 'date')
    search_fields = ('email',)
    actions = [export_newsletter_emails]

@admin.register(RecipeArchive)
class RecipeArchiveAdmin(admin.ModelAdmin):
    # Only show deleted items
    def get_queryset(self, request):
        return self.model.all_objects.filter(is_deleted=True)

    list_display = ('title', 'author', 'is_deleted')
    
    # Custom action to restore items from here
    actions = ['restore_selected']

    @admin.action(description="Restore selected items to Live")
    def restore_selected(self, request, queryset):
        queryset.update(is_deleted=False)


@admin.register(BlogArchive)
class BlogArchiveAdmin(admin.ModelAdmin):
    # Only show deleted items
    def get_queryset(self, request):
        return self.model.all_objects.filter(is_deleted=True)

    list_display = ('title', 'author', 'is_deleted')
    
    # Custom action to restore items from here
    actions = ['restore_selected']

    @admin.action(description="Restore selected items to Live")
    def restore_selected(self, request, queryset):
        queryset.update(is_deleted=False)