#!/usr/bin/env bash
# exit on error
set -o errexit

# Install production dependencies
pip install -r requirements.txt

# Compile database schemas safely during the build phase
python manage.py makemigrations
python manage.py migrate

# Collect static files for production styling assets
python manage.py collectstatic --no-input

# Create a superuser automatically without user prompts
if [ "$CREATE_SUPERUSER" ]; then
  python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
if not User.objects.filter(username='$SUPERUSER_USERNAME').exists():
    User.objects.create_superuser('$SUPERUSER_USERNAME', '$SUPERUSER_EMAIL', '$SUPERUSER_PASSWORD')
    print('Superuser created successfully.')
else:
    print('Superuser already exists.')
"
fi