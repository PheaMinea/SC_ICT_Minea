import asyncio
from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    status,
)

from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..db.database import get_db

from ..core.dependencies import (
    get_current_active_admin,
)

from ..core.rate_limiter import (
    limiter,
)

from ..core.spam_detector import (
    inspect_security,
    sanitize_text,
)

from ..utils.telegram import (
    telegram_bot,
)


router = APIRouter()


# =========================================================
# CREATE CONTACT MESSAGE - PUBLIC
#
# POST /api/contact/
#
# RATE LIMIT: 5 REQUESTS / MINUTE / IP
# =========================================================

@router.post(
    "/",
    response_model=schemas.ContactMessage,
    status_code=status.HTTP_201_CREATED,
)
@limiter.limit("5/minute")
async def create_contact_message(
    request: Request,
    message: schemas.ContactMessageCreate,
    db: Session = Depends(get_db),
):

    # -----------------------------------------------------
    # 1. HONEYPOT BOT TRAP CHECK (SILENTLY TRAP BOTS)
    # -----------------------------------------------------
    if message.hp_trap and message.hp_trap.strip():
        from datetime import datetime
        return schemas.ContactMessage(
            id=0,
            name=message.name,
            email=message.email,
            phone=message.phone,
            subject=message.subject,
            message=message.message,
            is_read=True,
            is_replied=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

    # -----------------------------------------------------
    # 2. ADVANCED SECURITY SHIELD (XSS, SQLi, Bot & Spam Check)
    # -----------------------------------------------------
    is_safe, error_reason = inspect_security(
        name=message.name,
        email=message.email,
        phone=message.phone,
        subject=message.subject,
        message=message.message,
    )

    if not is_safe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_reason or "Suspicious activity detected. Message rejected.",
        )

    # -----------------------------------------------------
    # 3. SANITIZE INPUTS (CLEAN HTML & DANGEROUS CHARACTERS)
    # -----------------------------------------------------
    message.name = sanitize_text(message.name)
    if message.subject:
        message.subject = sanitize_text(message.subject)
    message.message = sanitize_text(message.message)

    try:
        result = crud.create_contact_message(
            db,
            message,
        )

        # Send Telegram notification (non-blocking)
        try:
            await telegram_bot.send_contact_notification(
                name=message.name,
                email=message.email,
                phone=message.phone or None,
                subject=message.subject or None,
                message=message.message,
            )
        except Exception as telegram_error:
            # Don't fail the request if Telegram fails
            print(
                "Telegram notification error:",
                str(telegram_error),
            )

        return result

    except Exception as e:
        db.rollback()
        print(
            "Create Contact Message Error:",
            str(e),
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send message",
        )


# =========================================================
# GET ALL CONTACT MESSAGES - ADMIN ONLY
#
# GET /api/contact/
# =========================================================

@router.get(
    "/",
    response_model=List[
        schemas.ContactMessage
    ],
)
def get_contact_messages(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin=Depends(
        get_current_active_admin
    ),
):

    try:

        return crud.get_contact_messages(
            db,
            skip=skip,
            limit=limit,
        )

    except Exception as e:

        print(
            "Get Contact Messages Error:",
            str(e),
        )

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail="Failed to load messages",
        )


# =========================================================
# GET UNREAD CONTACT MESSAGES - ADMIN ONLY
#
# GET /api/contact/unread
# =========================================================

@router.get(
    "/unread",
    response_model=List[
        schemas.ContactMessage
    ],
)
def get_unread_messages(
    db: Session = Depends(get_db),
    current_admin=Depends(
        get_current_active_admin
    ),
):

    try:

        return (
            db.query(
                models.ContactMessage
            )
            .filter(
                models.ContactMessage.is_read
                == False
            )
            .order_by(
                models.ContactMessage.created_at.desc()
            )
            .all()
        )

    except Exception as e:

        print(
            "Get Unread Messages Error:",
            str(e),
        )

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Failed to load unread messages"
            ),
        )


# =========================================================
# GET SINGLE CONTACT MESSAGE - ADMIN ONLY
#
# GET /api/contact/{message_id}
# =========================================================

@router.get(
    "/{message_id}",
    response_model=schemas.ContactMessage,
)
def get_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(
        get_current_active_admin
    ),
):

    message = (
        db.query(
            models.ContactMessage
        )
        .filter(
            models.ContactMessage.id
            == message_id
        )
        .first()
    )


    if not message:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )


    return message


# =========================================================
# MARK MESSAGE AS READ - ADMIN ONLY
#
# PUT /api/contact/{message_id}/read
# =========================================================

@router.put(
    "/{message_id}/read",
    response_model=schemas.ContactMessage,
)
def mark_message_read(
    message_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(
        get_current_active_admin
    ),
):

    message = (
        db.query(
            models.ContactMessage
        )
        .filter(
            models.ContactMessage.id
            == message_id
        )
        .first()
    )


    if not message:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )


    try:

        message.is_read = True

        db.commit()

        db.refresh(
            message
        )

        return message

    except Exception as e:

        db.rollback()

        print(
            "Mark Message Read Error:",
            str(e),
        )

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Failed to mark message as read"
            ),
        )


# =========================================================
# MARK MESSAGE AS UNREAD - ADMIN ONLY
#
# PUT /api/contact/{message_id}/unread
# =========================================================

@router.put(
    "/{message_id}/unread",
    response_model=schemas.ContactMessage,
)
def mark_message_unread(
    message_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(
        get_current_active_admin
    ),
):

    message = (
        db.query(
            models.ContactMessage
        )
        .filter(
            models.ContactMessage.id
            == message_id
        )
        .first()
    )


    if not message:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )


    try:

        message.is_read = False

        db.commit()

        db.refresh(
            message
        )

        return message

    except Exception as e:

        db.rollback()

        print(
            "Mark Message Unread Error:",
            str(e),
        )

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Failed to mark message as unread"
            ),
        )


# =========================================================
# MARK MESSAGE AS REPLIED - ADMIN ONLY
#
# PUT /api/contact/{message_id}/replied
# =========================================================

@router.put(
    "/{message_id}/replied",
    response_model=schemas.ContactMessage,
)
def mark_message_replied(
    message_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(
        get_current_active_admin
    ),
):

    message = (
        db.query(
            models.ContactMessage
        )
        .filter(
            models.ContactMessage.id
            == message_id
        )
        .first()
    )


    if not message:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )


    try:

        message.is_replied = True

        # Usually a replied message is also read
        message.is_read = True

        db.commit()

        db.refresh(
            message
        )

        return message

    except Exception as e:

        db.rollback()

        print(
            "Mark Message Replied Error:",
            str(e),
        )

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Failed to mark message as replied"
            ),
        )


# =========================================================
# MARK MESSAGE AS NOT REPLIED - ADMIN ONLY
#
# PUT /api/contact/{message_id}/not-replied
# =========================================================

@router.put(
    "/{message_id}/not-replied",
    response_model=schemas.ContactMessage,
)
def mark_message_not_replied(
    message_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(
        get_current_active_admin
    ),
):

    message = (
        db.query(
            models.ContactMessage
        )
        .filter(
            models.ContactMessage.id
            == message_id
        )
        .first()
    )


    if not message:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )


    try:

        message.is_replied = False

        db.commit()

        db.refresh(
            message
        )

        return message

    except Exception as e:

        db.rollback()

        print(
            "Mark Message Not Replied Error:",
            str(e),
        )

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Failed to update reply status"
            ),
        )


# =========================================================
# DELETE CONTACT MESSAGE - ADMIN ONLY
#
# DELETE /api/contact/{message_id}
# =========================================================

@router.delete(
    "/{message_id}",
    response_model=schemas.ResponseMessage,
)
def delete_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(
        get_current_active_admin
    ),
):

    message = (
        db.query(
            models.ContactMessage
        )
        .filter(
            models.ContactMessage.id
            == message_id
        )
        .first()
    )


    if not message:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )


    try:

        db.delete(
            message
        )

        db.commit()

    except Exception as e:

        db.rollback()

        print(
            "Delete Contact Message Error:",
            str(e),
        )

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Failed to delete message"
            ),
        )


    return {
        "message": (
            "Message deleted successfully"
        ),
        "success": True,
    }