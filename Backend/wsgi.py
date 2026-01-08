"""
WSGI configuration for PythonAnywhere deployment.

This file is used by PythonAnywhere to serve the Flask application.
"""

from app import create_app
import sys
import os

# Add your project directory to the sys.path
project_home = '/home/YOUR_USERNAME/Job_Portal_Web/Backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set environment variables
os.environ['FLASK_ENV'] = 'production'

# Import the Flask app

application = create_app()
