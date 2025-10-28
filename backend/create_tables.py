# -*- coding: utf-8 -*-
"""
Script to create database tables
"""
from app.database import Base, engine

try:
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("[SUCCESS] Tables created successfully!")
except Exception as e:
    print(f"[ERROR] {e}")
    print("\nTroubleshooting:")
    print("1. Check internet connection")
    print("2. Verify DATABASE_URL in .env")
    print("3. Check if Supabase project is running")
