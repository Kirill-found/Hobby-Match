"""
Script to reset swipes for a user to refresh their discovery feed
"""
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.database import get_db_url

def reset_user_swipes(telegram_id: int = None, user_id: int = None):
    """Reset all swipes for a specific user"""

    # Get database URL
    db_url = get_db_url()
    engine = create_engine(db_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        # Find user
        if telegram_id:
            result = db.execute(
                text("SELECT id, first_name, telegram_id FROM users WHERE telegram_id = :telegram_id"),
                {"telegram_id": telegram_id}
            )
        elif user_id:
            result = db.execute(
                text("SELECT id, first_name, telegram_id FROM users WHERE id = :user_id"),
                {"user_id": user_id}
            )
        else:
            print("Error: Please provide either telegram_id or user_id")
            return

        user = result.fetchone()
        if not user:
            print(f"User not found")
            return

        print(f"Found user: {user.first_name} (ID: {user.id}, Telegram ID: {user.telegram_id})")

        # Count swipes
        count_result = db.execute(
            text("SELECT COUNT(*) FROM swipes WHERE user_id = :user_id"),
            {"user_id": user.id}
        )
        swipe_count = count_result.fetchone()[0]

        print(f"Found {swipe_count} swipes")

        if swipe_count > 0:
            # Delete swipes
            db.execute(
                text("DELETE FROM swipes WHERE user_id = :user_id"),
                {"user_id": user.id}
            )
            db.commit()
            print(f"✅ Successfully deleted {swipe_count} swipes!")
            print("Discovery feed will now show all users again")
        else:
            print("No swipes to delete")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Example: python reset_swipes.py --telegram-id 123456789
    # Or: python reset_swipes.py --user-id 1

    if len(sys.argv) < 3:
        print("Usage:")
        print("  python reset_swipes.py --telegram-id <telegram_id>")
        print("  python reset_swipes.py --user-id <user_id>")
        sys.exit(1)

    if sys.argv[1] == "--telegram-id":
        reset_user_swipes(telegram_id=int(sys.argv[2]))
    elif sys.argv[1] == "--user-id":
        reset_user_swipes(user_id=int(sys.argv[2]))
    else:
        print("Invalid argument. Use --telegram-id or --user-id")
