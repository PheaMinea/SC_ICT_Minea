"""
Test script for Telegram bot integration
Run this to verify Telegram bot is working
"""
import asyncio
from app.utils.telegram import telegram_bot


async def test_telegram():
    print("Testing Telegram Bot...")
    print(f"Bot Token: {telegram_bot.bot_token[:10]}...")
    print(f"Chat ID: {telegram_bot.chat_id}")
    print(f"Is Configured: {telegram_bot.is_configured()}")
    
    if not telegram_bot.is_configured():
        print("ERROR: Telegram bot not configured!")
        return
    
    # Test contact notification
    print("\n1. Testing contact notification...")
    result = await telegram_bot.send_contact_notification(
        name="Test Student",
        email="test@example.com",
        phone="012345678",
        subject="Test Subject",
        message="This is a test message from the website."
    )
    print(f"   Result: {'SUCCESS' if result else 'FAILED'}")
    
    # Test enrollment notification
    print("\n2. Testing enrollment notification...")
    result = await telegram_bot.send_enrollment_notification(
        enrollment_data={
            "khmer_name": "សុខា",
            "english_name": "Sokha",
            "gender": "male",
            "age": 25,
            "date_of_birth": "2001-05-15",
            "nationality": "ខ្មែរ",
            "nation": "កម្ពុជា",
            "religion": "ព្រះពុទ្ធសាសនា",
            "state_id_no": "123456789",
            "phone": "012345678",
            "email": "sokha@example.com",
            "status": "pending",
        },
        course_name="Digital Marketing Course",
    )
    print(f"   Result: {'SUCCESS' if result else 'FAILED'}")
    
    # Test status change notification
    print("\n3. Testing status change notification...")
    result = await telegram_bot.send_enrollment_status_notification(
        enrollment_data={
            "khmer_name": "សុខា",
            "english_name": "Sokha",
            "phone": "012345678",
            "email": "sokha@example.com",
        },
        course_name="Digital Marketing Course",
        old_status="pending",
        new_status="approved",
    )
    print(f"   Result: {'SUCCESS' if result else 'FAILED'}")
    
    print("\n✅ All tests completed!")
    print("Check your Telegram for the test messages.")


if __name__ == "__main__":
    asyncio.run(test_telegram())