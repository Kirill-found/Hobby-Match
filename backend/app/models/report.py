from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Report(Base):
    """User reports"""
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reported_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    reason = Column(String(100), nullable=False)  # harassment, fake_profile, inappropriate_content
    description = Column(Text, nullable=True)

    # Status
    status = Column(String(20), default="pending")  # pending, reviewed, action_taken

    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    reporter = relationship("User", foreign_keys=[reporter_id])
    reported_user = relationship("User", foreign_keys=[reported_user_id])

    def __repr__(self):
        return f"<Report {self.id}: {self.reason}>"


class Block(Base):
    """User blocks"""
    __tablename__ = "blocks"

    id = Column(Integer, primary_key=True, index=True)
    blocker_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    blocked_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    blocker = relationship("User", foreign_keys=[blocker_id])
    blocked_user = relationship("User", foreign_keys=[blocked_user_id])

    def __repr__(self):
        return f"<Block {self.blocker_id} -> {self.blocked_user_id}>"
