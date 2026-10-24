#!/bin/bash
# Build script for Render

echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Running migrations..."
python manage.py migrate

echo "Creating superuser..."
python create_superuser.py

echo "Build completed successfully!"
