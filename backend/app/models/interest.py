from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base


class InterestCategory(Base):
    """Tree structure for interests (4 levels)"""
    __tablename__ = "interest_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    icon = Column(String(50), nullable=True)  # Emoji
    level = Column(Integer, nullable=False)  # 1, 2, 3, 4
    parent_id = Column(Integer, ForeignKey("interest_categories.id"), nullable=True)
    requires_skill_level = Column(Boolean, default=True, nullable=False)  # Whether skill level makes sense for this interest

    # Self-referential relationship
    parent = relationship("InterestCategory", remote_side=[id], backref="children")

    def __repr__(self):
        return f"<InterestCategory {self.id}: {self.name} (L{self.level})>"


class UserInterest(Base):
    """User's selected interests"""
    __tablename__ = "user_interests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("interest_categories.id"), nullable=False)

    # Skill level
    skill_level = Column(String(50), nullable=True)  # новичок, любитель, продвинутый, профессионал
    want_to_try = Column(Boolean, default=False)  # Хочу попробовать

    # Relationships
    user = relationship("User", backref="interests")
    category = relationship("InterestCategory")

    def __repr__(self):
        return f"<UserInterest user={self.user_id} category={self.category_id}>"
