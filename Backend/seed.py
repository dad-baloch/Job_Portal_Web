"""Seed professional demo data into the database.

Usage:
  1) Ensure migrations are applied:
     flask db upgrade
  2) Run (with venv active):
      python3 seed.py
"""

import os
from app import create_app
from app.seeder import run_seeder_logic


def run_seed():
    app = create_app()
    with app.app_context():
        # Clean sync of all demo data and permanent admin creation
        run_seeder_logic()

        admin_email = os.environ.get(
            "PERMANENT_ADMIN_EMAIL", "admin@example.com")
        # Mask password in output

        print("Seeding complete!")
        print("========================================")
        print(f"  Permanent Admin: {admin_email} / [HIDDEN] (Set in .env)")
        print("  Demo Admin:      admin@demo.com      / demo123")
        print("  Demo Employer:   employer@demo.com   / demo123")
        print("  Demo Seeker:     seeker@demo.com     / demo123")
        print("========================================")


if __name__ == "__main__":
    run_seed()
