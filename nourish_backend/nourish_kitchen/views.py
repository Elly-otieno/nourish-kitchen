from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from django.db.models import Sum
from .models import User, Recipe, BlogPost, Comment, NewsletterSubscription
from .serializers import (
    UserSerializer, RecipeSerializer, BlogPostSerializer, 
    CommentSerializer, NewsletterSubscriptionSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'story', 'ingredients__name']

    def get_queryset(self):
        queryset = Recipe.objects.all()
        category = self.request.query_params.get('cat')
        if category:
            queryset = queryset.filter(categories__contains=category)
        return queryset

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        recipe = Recipe.all_objects.get(pk=pk)
        recipe.restore()
        return Response(self.get_serializer(recipe).data)

    @action(detail=True, methods=['delete'])
    def permanent(self, request, pk=None):
        recipe = Recipe.all_objects.get(pk=pk)
        recipe.delete(permanent=True)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'], url_path='toggle-like')
    def toggle_like(self, request, pk=None):
        recipe = self.get_object()
        user_id = request.data.get('userId')
        if not user_id:
            return Response({'error': 'userId required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.get(id=user_id)
        if recipe.liked_by.filter(id=user.id).exists():
            recipe.liked_by.remove(user)
        else:
            recipe.liked_by.add(user)
        
        return Response(self.get_serializer(recipe).data)

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        blog = BlogPost.all_objects.get(pk=pk)
        blog.restore()
        return Response(self.get_serializer(blog).data)

    @action(detail=True, methods=['delete'])
    def permanent(self, request, pk=None):
        blog = BlogPost.all_objects.get(pk=pk)
        blog.delete(permanent=True)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'], url_path='toggle-bookmark')
    def toggle_bookmark(self, request, pk=None):
        blog = self.get_object()
        user_id = request.data.get('userId')
        if not user_id:
            return Response({'error': 'userId required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.get(id=user_id)
        if blog.bookmarked_by.filter(id=user.id).exists():
            blog.bookmarked_by.remove(user)
        else:
            blog.bookmarked_by.add(user)
        
        return Response(self.get_serializer(blog).data)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        comment = self.get_object()
        comment.is_approved = True
        comment.save()
        return Response(self.get_serializer(comment).data)

class StatsViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def list(self, request):
        recipes = Recipe.objects.all()
        blogs = BlogPost.objects.all()
        comments = Comment.objects.all()
        users = User.objects.all()
        subs = NewsletterSubscription.objects.all()

        data = {
            'totalRecipes': recipes.count(),
            'totalViews': recipes.aggregate(Sum('views'))['views__sum'] or 0,
            'unreadComments': comments.filter(is_read=False).count(),
            'totalComments': comments.count(),
            'totalBlogs': blogs.count(),
            'totalUsers': users.count(),
            'totalSubscribers': subs.count()
        }
        return Response(data)

class ArchiveViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        data = {
            'recipes': RecipeSerializer(Recipe.all_objects.filter(is_deleted=True), many=True).data,
            'blogs': BlogPostSerializer(BlogPost.all_objects.filter(is_deleted=True), many=True).data
        }
        return Response(data)

class NewsletterViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def subscribe(self, request):
        serializer = NewsletterSubscriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def subscribers(self, request):
        subs = NewsletterSubscription.objects.all()
        serializer = NewsletterSubscriptionSerializer(subs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def send(self, request):
        subject = request.data.get('subject')
        content = request.data.get('content')
        subs_count = NewsletterSubscription.objects.count()
        # Mocking email send
        return Response({'success': True, 'count': subs_count})
