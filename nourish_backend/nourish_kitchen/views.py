from rest_framework import viewsets, status, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Recipe, BlogPost, Comment, NewsletterSubscription
from .serializers import (
    UserSerializer, RegisterSerializer, RecipeSerializer, BlogPostSerializer, 
    CommentSerializer, NewsletterSubscriptionSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAdminUser]
    def get_permissions(self):
        if self.action in ['login', 'register']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all().prefetch_related('liked_by', 'ingredients')
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categories']
    search_fields = ['title', 'story', 'ingredients__name']

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        # Assumes a custom Manager 'all_objects' exists for soft-delete logic
        recipe = Recipe.all_objects.filter(pk=pk, is_deleted=True).first()
        if not recipe:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        recipe.restore()
        return Response(self.get_serializer(recipe).data)

    @action(detail=True, methods=['post'], url_path='toggle-like')
    def toggle_like(self, request, pk=None):
        recipe = self.get_object()
        # Securely use request.user instead of passing userId in body
        if recipe.liked_by.filter(id=request.user.id).exists():
            recipe.liked_by.remove(request.user)
        else:
            recipe.liked_by.add(request.user)
        return Response({'status': 'toggled', 'likes_count': recipe.liked_by.count()})

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all().select_related('author')
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'], url_path='toggle-bookmark')
    def toggle_bookmark(self, request, pk=None):
        blog = self.get_object()
        if blog.bookmarked_by.filter(id=request.user.id).exists():
            blog.bookmarked_by.remove(request.user)
        else:
            blog.bookmarked_by.add(request.user)
        return Response({'status': 'toggled'})

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    
    def get_permissions(self):
        if self.action in ['approve', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        comment = self.get_object()
        comment.is_approved = True
        comment.save()
        return Response({'status': 'approved'})

class StatsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser]

    def list(self, request):
        data = {
            'totalRecipes': Recipe.objects.count(),
            'totalViews': Recipe.objects.aggregate(Sum('views'))['views__sum'] or 0,
            'unreadComments': Comment.objects.filter(is_read=False).count(),
            'totalUsers': User.objects.count(),
            'totalSubscribers': NewsletterSubscription.objects.count()
        }
        return Response(data)

class NewsletterViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscription.objects.all()
    serializer_class = NewsletterSubscriptionSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @action(detail=False, methods=['post'])
    def send_broadcast(self, request):
        # Implementation for Celery task would go here
        return Response({'message': 'Newsletter queued for delivery'})

class ArchiveViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        data = {
            'recipes': RecipeSerializer(Recipe.all_objects.filter(is_deleted=True), many=True).data,
            'blogs': BlogPostSerializer(BlogPost.all_objects.filter(is_deleted=True), many=True).data
        }
        return Response(data)