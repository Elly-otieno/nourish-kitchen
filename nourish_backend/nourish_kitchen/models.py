from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class UserRole(models.TextChoices):
    ADMIN = 'ADMIN', 'Admin'
    CHEF = 'CHEF', 'Chef'
    USER = 'USER', 'User'

class User(AbstractUser):
    role = models.CharField(max_length=10, choices=UserRole.choices, default=UserRole.USER)
    avatar = models.URLField(max_length=500, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    joined_at = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, default='active')

    def __str__(self):
        return self.username

class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)

class SoftDeleteModel(models.Model):
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    def delete(self, permanent=False, **kwargs):
        if permanent:
            return super().delete(**kwargs)
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    def restore(self):
        self.is_deleted = False
        self.deleted_at = None
        self.save()

    class Meta:
        abstract = True

class Recipe(SoftDeleteModel):
    SPICE_LEVELS = [
        ('Mild', 'Mild'),
        ('Medium', 'Medium'),
        ('Hot', 'Hot'),
        ('Extra Hot', 'Extra Hot'),
    ]

    title = models.CharField(max_length=255)
    story = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipes')
    prep_time = models.CharField(max_length=50)
    cuisine = models.CharField(max_length=100)
    categories = models.JSONField(default=list)  # Using JSONField for categories list
    hero_image = models.ImageField(upload_to='recipes/', null=True, blank=True)
    youtube_link = models.URLField(max_length=500, blank=True, null=True)
    calories = models.CharField(max_length=50, blank=True, null=True)
    spice_level = models.CharField(max_length=20, choices=SPICE_LEVELS, default='Mild')
    pro_tip = models.TextField()
    rating = models.FloatField(default=5.0)
    views = models.PositiveIntegerField(default=0)
    liked_by = models.ManyToManyField(User, related_name='liked_recipes', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class Ingredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')
    qty = models.CharField(max_length=50)
    unit = models.CharField(max_length=50)
    custom_unit = models.CharField(max_length=50, blank=True, null=True)
    category = models.CharField(max_length=100)
    name = models.CharField(max_length=255)

class Step(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='steps')
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.URLField(max_length=500, blank=True, null=True)

class BlogPost(SoftDeleteModel):
    title = models.CharField(max_length=255)
    excerpt = models.TextField()
    content = models.TextField()
    category = models.CharField(max_length=100)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    hero_image = models.URLField(max_length=500)
    date = models.CharField(max_length=50)  # Replicating original "short" date string
    reading_time = models.CharField(max_length=50)
    syndication_links = models.JSONField(default=list)
    is_published = models.BooleanField(default=True)
    bookmarked_by = models.ManyToManyField(User, related_name='bookmarked_blogs', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='comments', blank=True, null=True)
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments', blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    user_name = models.CharField(max_length=255)
    user_avatar = models.URLField(max_length=500)
    user_email = models.EmailField(blank=True, null=True)
    user_website = models.URLField(blank=True, null=True)
    rating = models.PositiveIntegerField(blank=True, null=True)
    content = models.TextField()
    type = models.CharField(max_length=20, default='comment')
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    is_approved = models.BooleanField(default=False)
    is_anonymous = models.BooleanField(default=False)

class NewsletterSubscription(models.Model):
    email = models.EmailField(unique=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

class RecipeArchive(Recipe):
    class Meta:
        proxy = True  # Doesn't create a new table in DB
        verbose_name = "Archived Recipe"
        verbose_name_plural = "Archive: Recipes"


class BlogArchive(BlogPost):
    class Meta:
        proxy = True  # Doesn't create a new table in DB
        verbose_name = "Archived Blogs"
        verbose_name_plural = "Archive: Blogs"