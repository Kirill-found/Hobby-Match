from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func
from app.database import get_db
from app.models.user import User
from app.models.match import Match
from app.models.message import Message
from app.api.deps import get_current_user
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()


# Schemas
class MessageCreate(BaseModel):
    match_id: int
    receiver_id: int
    text: str


class MessageResponse(BaseModel):
    id: int
    match_id: int
    sender_id: int
    receiver_id: int
    text: str
    is_read: bool
    read_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationPreview(BaseModel):
    """Preview of a conversation for chat list"""
    match_id: int
    partner_id: int
    partner_name: str
    partner_photo: Optional[str]
    last_message: Optional[str]
    last_message_time: Optional[datetime]
    unread_count: int
    is_last_message_from_me: bool


@router.get("/conversations", response_model=List[ConversationPreview])
def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all conversations (matches with messages) for current user
    Sorted by last message time
    """

    # Get all matches for current user
    matches = db.query(Match).filter(
        or_(
            Match.user1_id == current_user.id,
            Match.user2_id == current_user.id
        )
    ).all()

    conversations = []

    for match in matches:
        # Determine partner
        partner_id = match.user2_id if match.user1_id == current_user.id else match.user1_id
        partner = db.query(User).filter(User.id == partner_id).first()

        if not partner:
            continue

        # Get last message in this match
        last_message = db.query(Message).filter(
            Message.match_id == match.id
        ).order_by(desc(Message.created_at)).first()

        # Count unread messages from partner
        unread_count = db.query(Message).filter(
            and_(
                Message.match_id == match.id,
                Message.receiver_id == current_user.id,
                Message.is_read == False
            )
        ).count()

        conversation = ConversationPreview(
            match_id=match.id,
            partner_id=partner.id,
            partner_name=partner.first_name,
            partner_photo=partner.photos[0] if partner.photos and len(partner.photos) > 0 else None,
            last_message=last_message.text if last_message else None,
            last_message_time=last_message.created_at if last_message else match.matched_at,
            unread_count=unread_count,
            is_last_message_from_me=last_message.sender_id == current_user.id if last_message else False
        )

        conversations.append(conversation)

    # Sort by last message time (most recent first)
    conversations.sort(key=lambda x: x.last_message_time or datetime.min, reverse=True)

    return conversations


@router.get("/conversations/{match_id}/messages", response_model=List[MessageResponse])
def get_conversation_messages(
    match_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all messages in a conversation
    """

    # Verify match exists and user is part of it
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )

    if match.user1_id != current_user.id and match.user2_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not part of this conversation"
        )

    # Get all messages
    messages = db.query(Message).filter(
        Message.match_id == match_id
    ).order_by(Message.created_at).all()

    # Mark messages as read if they are sent to current user
    unread_messages = [m for m in messages if m.receiver_id == current_user.id and not m.is_read]
    for msg in unread_messages:
        msg.is_read = True
        msg.read_at = datetime.utcnow()

    if unread_messages:
        db.commit()

    return messages


@router.post("/messages", response_model=MessageResponse)
def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Send a message to a matched user
    """

    # Verify match exists and user is part of it
    match = db.query(Match).filter(Match.id == message_data.match_id).first()
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )

    if match.user1_id != current_user.id and match.user2_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not part of this match"
        )

    # Verify receiver is the other person in the match
    expected_receiver_id = match.user2_id if match.user1_id == current_user.id else match.user1_id
    if message_data.receiver_id != expected_receiver_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Receiver must be the other person in the match"
        )

    # Create message
    message = Message(
        match_id=message_data.match_id,
        sender_id=current_user.id,
        receiver_id=message_data.receiver_id,
        text=message_data.text,
        is_read=False,
        created_at=datetime.utcnow()
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message


@router.put("/messages/{message_id}/read")
def mark_message_as_read(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark a message as read
    """

    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )

    # Only receiver can mark as read
    if message.receiver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only mark messages sent to you as read"
        )

    message.is_read = True
    message.read_at = datetime.utcnow()
    db.commit()

    return {"success": True, "message": "Message marked as read"}
