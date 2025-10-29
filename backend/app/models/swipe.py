from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Swipe(Base):
    """Swipe history"""
    __tablename__ = "swipes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    target_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    is_like = Column(Boolean, nullable=False)  # True for like, False for dislike
    swiped_at = Column(DateTime, nullable=False)

    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    target_user = relationship("User", foreign_keys=[target_user_id])

    def __repr__(self):
        action = "like" if self.is_like else "dislike"
        return f"<Swipe {self.user_id} -> {self.target_user_id}: {action}>"
