from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Payment(Base):
    """Payment transactions"""
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Payment details
    payment_id = Column(String(255), unique=True, nullable=False)  # YooKassa payment ID
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="RUB")
    payment_type = Column(String(50), nullable=False)  # subscription, boost, super_swipes

    # Status
    status = Column(String(20), default="pending")  # pending, succeeded, cancelled

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User")

    def __repr__(self):
        return f"<Payment {self.id}: {self.amount} {self.currency}>"


class Subscription(Base):
    """User premium subscriptions"""
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    plan = Column(String(20), nullable=False)  # monthly, yearly
    is_active = Column(Boolean, default=True)

    started_at = Column(DateTime, server_default=func.now())
    expires_at = Column(DateTime, nullable=False)
    cancelled_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User")

    def __repr__(self):
        return f"<Subscription {self.id}: {self.plan}>"
