from rest_framework import viewsets, status, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import authenticate
from django.db.models import Sum
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import IsAdminRole, IsStaffOrCommentAuthor
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_str
from .models import User, Recipe, UserRole, BlogPost, Comment, NewsletterSubscription
from .serializers import (
    UserSerializer, RegisterSerializer, RecipeSerializer, BlogPostSerializer, 
    CommentSerializer, NewsletterSubscriptionSerializer
)


from .models import Invitation
from .serializers import (
    AccountSetupSerializer, 
    PasswordResetRequestSerializer, 
    PasswordResetConfirmSerializer
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

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data, 
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'detail': 'Invalid credentials'}, status=401)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all().prefetch_related('liked_by', 'ingredients')
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    # filterset_fields = ['categories']
    search_fields = ['title', 'story', 'ingredients__name']
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('categories')
        if category:
            # Filters if the string exists within the JSON list
            queryset = queryset.filter(categories__contains=category)
        return queryset

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
        user = request.user
        
        if recipe.liked_by.filter(id=user.id).exists():
            recipe.liked_by.remove(user)
            is_liked = False
        else:
            recipe.liked_by.add(user)
            is_liked = True
            
        return Response({
            'liked': is_liked, 
            'count': recipe.liked_by.count()
        }, status=status.HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Check if 'permanent=true' was passed in the URL params
        is_permanent = request.query_params.get('permanent') == 'true'
        
        if is_permanent:
            # Security check: Ensure only Admins can hard-delete
            if request.user.role != UserRole.ADMIN:
                print(f"LOG: Unauthorized permanent delete attempt by {request.user.username}")
                raise PermissionDenied("Only administrators can permanently delete records.")
            
            print(f"LOG: Hard-deleting recipe from DB: {instance.title}")
            instance.delete(permanent=True) # Calls your SoftDeleteModel logic
        else:
            print(f"LOG: Soft-deleting recipe: {instance.title}")
            instance.delete() # Calls your SoftDeleteModel logic (defaults to permanent=False)
            
        return Response(status=status.HTTP_204_NO_CONTENT)

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
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Check if 'permanent=true' was passed in the URL params
        is_permanent = request.query_params.get('permanent') == 'true'
        
        if is_permanent:
            # Security check: Ensure only Admins can hard-delete
            if request.user.role != UserRole.ADMIN:
                print(f"LOG: Unauthorized permanent delete attempt by {request.user.username}")
                raise PermissionDenied("Only administrators can permanently delete records.")
            
            print(f"LOG: Hard-deleting recipe from DB: {instance.title}")
            instance.delete(permanent=True) # Calls your SoftDeleteModel logic
        else:
            print(f"LOG: Soft-deleting recipe: {instance.title}")
            instance.delete() # Calls your SoftDeleteModel logic (defaults to permanent=False)
            
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        # use all_objects because the default manager hides soft-deleted items
        blog = BlogPost.all_objects.filter(pk=pk, is_deleted=True).first()
        if not blog:
            return Response({'error': 'Blog not found in archives'}, status=404)
        blog.restore()
        return Response(self.get_serializer(blog).data)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    
    def get_permissions(self):
        if self.action in ['approve']:
            return [permissions.IsAdminUser()]
        
        if self.action in ['destroy', 'update', 'partial_update']:
            return [IsStaffOrCommentAuthor()]
        
        return [permissions.AllowAny()]

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        comment = self.get_object()
        comment.is_approved = True
        comment.save()
        return Response({'status': 'approved'})
    
    def perform_create(self, serializer):
        user = self.request.user
        is_anon = self.request.data.get('is_anonymous', False)

        if user.is_authenticated:
            if is_anon:
                # Logged-in user explicitly going incognito
                serializer.save(user=user, is_anonymous=True)
            else:
                # Standard user comment
                serializer.save(
                    user=user,
                    user_name=user.username,
                    user_avatar=user.avatar if hasattr(user, 'avatar') else "",
                    user_email=user.email,
                    is_anonymous=False
                )
        else:
            # A public guest visitor (NOT forced anonymous unless they checked a box or left fields empty)
            serializer.save(user=None, is_anonymous=is_anon)

    def _recalculate_recipe_rating(self, recipe_id):
        """Helper method to update recipe average score when reviews change"""
        if not recipe_id:
            return
        
        # Calculate new average rating from approved comments containing a rating score
        stats = Comment.objects.filter(
            recipe_id=recipe_id, 
            is_approved=True, 
            rating__isnull=False
        ).aggregate(Avg('rating'))
        
        new_avg = stats['rating__avg'] or 5.0 # Fallback to 5.0 if no reviews remain
        
        # Save directly to the parent recipe instance
        Recipe.objects.filter(id=recipe_id).update(rating=round(new_avg, 1))

    def update(self, request, *args, **kwargs):
        """
        PUT: Full modification of a comment instance.
        Requires all non-optional serializer fields to be supplied in the payload body.
        """
        print(f"LOG: Initiating full update for comment ID: {kwargs.get('pk')}")
        
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Recalculate rating in case they changed their star count review score
        if instance.recipe:
            self._recalculate_recipe_rating(instance.recipe.id)

        return Response({
            'message': 'Comment successfully updated.',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        """
        PATCH: Delta optimization modification.
        Allows the client to send only the fields that changed (e.g., just the text content).
        """
        print(f"LOG: Initiating partial patch for comment ID: {kwargs.get('pk')}")
        
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        DELETE: Complete database purge of a comment node.
        """
        instance = self.get_object()
        comment_id = instance.id
        recipe_id = instance.recipe.id if instance.recipe else None
        
        print(f"LOG: Purging comment node ID: {comment_id} from database storage tables.")
        
        # Execute the core delete hook
        self.perform_destroy(instance)

        # Side effect: Recalculate rating since a review was eliminated
        if recipe_id:
            self._recalculate_recipe_rating(recipe_id)

        return Response({
            'message': 'Comment permanently removed from system registries.',
            'id': comment_id
        }, status=status.HTTP_200_OK)

class StatsViewSet(viewsets.ViewSet):
    # permission_classes = [permissions.IsAdminUser]
    permission_classes = [IsAdminRole]

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

class AuthViewSet(viewsets.ViewSet):
    """
    A unified ViewSet handling custom authentication pipelines including
    invitation workflows and password resets.
    """
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'], url_path='invite/verify')
    def verify_invite(self, request):
        token_str = request.query_params.get('token')
        if not token_str:
            return Response({"detail": "Token parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            invite = Invitation.objects.get(token=token_str)
            if not invite.is_valid():
                return Response({"detail": "This invitation link has expired or already been used."}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({
                "email": invite.user.email,
                "role": getattr(invite.user, 'role', 'CHEF'),
                "valid": True
            }, status=status.HTTP_200_OK)
            
        except (Invitation.DoesNotExist, ValueError):
            return Response({"detail": "This invitation link is invalid."}, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False, methods=['post'], url_path='invite/setup')
    def setup_account(self, request):
        serializer = AccountSetupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['token']
        password = serializer.validated_data['password']
        name = serializer.validated_data.get('name', '')

        try:
            invite = Invitation.objects.get(token=token)
            if not invite.is_valid():
                return Response({"detail": "Invalid or expired invitation token."}, status=status.HTTP_400_BAD_REQUEST)
            
            user = invite.user
            user.set_password(password)
            if name:
                user.name = name
            
            user.status = 'active'
            user.is_active = True
            user.save()

            invite.is_used = True
            invite.save()

            return Response({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "status": "active"
            }, status=status.HTTP_200_OK)

        except Invitation.DoesNotExist:
            return Response({"detail": "Invitation data record missing."}, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False, methods=['post'], url_path='password-reset/request')
    def password_reset_request(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Log tokens to console for local testing environments
            print(f"DEBUG RECOVERY LINK: /reset-password?uid={uid}&token={token}")
            
        except User.DoesNotExist:
            pass # Silent mitigation against account enumeration vectors
            
        return Response({
            "message": "If this account is registered, a recovery link has been generated.",
            "success": True
        }, status=status.HTTP_200_OK)


    @action(detail=False, methods=['post'], url_path='password-reset/confirm')
    def password_reset_confirm(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        uid = serializer.validated_data['uid']
        token = serializer.validated_data['token']
        password_new = serializer.validated_data['password_new']

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
            
            if not default_token_generator.check_token(user, token):
                return Response({"detail": "Reset link is either expired or signature verification failed."}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(password_new)
            user.save()
            
            return Response({"message": "Password changed successfully.", "success": True}, status=status.HTTP_200_OK)
            
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"detail": "Invalid parameters provided."}, status=status.HTTP_400_BAD_REQUEST)