from rest_framework import permissions

class IsAdminRole(permissions.BasePermission):
    """
    Allows access only to users with the 'ADMIN' role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'ADMIN')
    

class IsStaffOrCommentAuthor(permissions.BasePermission):
    """
    Custom permission to only allow staff members or the original 
    authenticated author of a comment to delete it.
    """
    def has_object_permission(self, request, view, obj):
        # Allow safe read operations (GET, HEAD, OPTIONS) for public views
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check if user is authenticated
        if not request.user or request.user.is_anonymous:
            return False

        # Admins and Chefs can delete anything
        if request.user.role in ['ADMIN', 'CHEF'] or request.user.is_staff:
            return True

        # Registered user can delete their own comment
        # (obj.user points to the ForeignKey relationship on the Comment model)
        return obj.user == request.user