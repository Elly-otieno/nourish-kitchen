from django.urls import path, include
from rest_framework.routers import DefaultRouter
from nourish_kitchen.views import (
    UserViewSet, RecipeViewSet, BlogPostViewSet, 
    CommentViewSet, StatsViewSet, ArchiveViewSet, NewsletterViewSet
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'recipes', RecipeViewSet)
router.register(r'posts', BlogPostViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', StatsViewSet.as_view({'get': 'list'})),
    path('archives/', ArchiveViewSet.as_view({'get': 'list'})),
    
    # Newsletter endpoints
    path('newsletter/subscribe/', NewsletterViewSet.as_view({'post': 'subscribe'})),
    path('newsletter/subscribers/', NewsletterViewSet.as_view({'get': 'subscribers'})),
    path('newsletter/send/', NewsletterViewSet.as_view({'post': 'send'})),
    
    # Authentication
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]