from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Date, Time, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class MeetingProposal(Base):
    """Meeting proposal between matched users"""
    __tablename__ = "meeting_proposals"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id", ondelete="CASCADE"), nullable=False)
    proposer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Meeting details
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    location = Column(String(500), nullable=False)
    activity = Column(String(255), nullable=False)

    # Status
    status = Column(String(20), default="pending")  # pending, accepted, declined, cancelled

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    match = relationship("Match")
    proposer = relationship("User")

    def __repr__(self):
        return f"<MeetingProposal {self.id}: {self.status}>"


class MeetingRating(Base):
    """Rating after meeting completion"""
    __tablename__ = "meeting_ratings"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("meeting_proposals.id", ondelete="CASCADE"), nullable=False)
    rater_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rated_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    showed_up = Column(Boolean, nullable=False)
    rating = Column(Integer, nullable=True)  # 1-5 stars
    comment = Column(Text, nullable=True)

    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    proposal = relationship("MeetingProposal")
    rater = relationship("User", foreign_keys=[rater_id])
    rated_user = relationship("User", foreign_keys=[rated_user_id])

    def __repr__(self):
        return f"<MeetingRating {self.id}: {self.rating}⭐>"
