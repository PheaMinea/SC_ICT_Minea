import httpx
from typing import Optional
from datetime import datetime
import html
import logging

from ..config import settings


# =========================================================
# LOGGING
# =========================================================

logger = logging.getLogger(__name__)


# =========================================================
# TELEGRAM BOT SERVICE
# =========================================================

class TelegramBot:
    """
    Simple Telegram bot service for sending notifications.
    """

    def __init__(self):
        self.bot_token = settings.TELEGRAM_BOT_TOKEN
        self.chat_id = settings.TELEGRAM_CHAT_ID
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}"
        self.timeout = 10.0

    def is_configured(self) -> bool:
        """
        Check if bot is properly configured.
        """
        if not self.bot_token or not self.chat_id:
            logger.warning("Telegram bot not configured: missing token or chat_id")
            return False
        return True

    async def send_message(
        self,
        text: str,
        parse_mode: Optional[str] = "HTML",
        disable_web_page_preview: bool = True,
    ) -> bool:
        """
        Send a message to the configured chat.

        Args:
            text: Message text
            parse_mode: Optional parse mode (HTML, Markdown, etc.)
            disable_web_page_preview: Disable web page preview

        Returns:
            True if successful, False otherwise
        """
        if not self.is_configured():
            return False

        url = f"{self.base_url}/sendMessage"

        payload = {
            "chat_id": self.chat_id,
            "text": text,
            "disable_web_page_preview": disable_web_page_preview,
        }

        if parse_mode:
            payload["parse_mode"] = parse_mode

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(url, json=payload)

                if response.status_code == 200:
                    result = response.json()
                    if result.get("ok"):
                        logger.info("Telegram message sent successfully")
                        return True

                logger.error(f"Telegram API error: {response.text}")
                return False

        except httpx.TimeoutException:
            logger.error("Telegram request timeout")
            return False
        except httpx.HTTPError as e:
            logger.error(f"Telegram HTTP error: {e}")
            return False
        except Exception as e:
            logger.error(f"Failed to send Telegram message: {e}")
            return False

    async def send_contact_notification(
        self,
        name: str,
        email: str,
        phone: Optional[str],
        subject: Optional[str],
        message: str,
    ) -> bool:
        """
        Send a formatted contact form notification.

        Args:
            name: Sender name
            email: Sender email
            phone: Sender phone (optional)
            subject: Message subject (optional)
            message: Message content

        Returns:
            True if successful, False otherwise
        """
        # Get current datetime
        now = datetime.now()
        days_khmer = {
            'Monday': 'ចន្ទ',
            'Tuesday': 'អង្គារ',
            'Wednesday': 'ពុធ',
            'Thursday': 'ព្រហស្បតិ៍',
            'Friday': 'សុក្រ',
            'Saturday': 'សៅរ៍',
            'Sunday': 'អាទិត្យ'
        }
        day_name = days_khmer.get(now.strftime('%A'), '')
        current_datetime = f"{day_name} {now.strftime('%d/%m/%Y %H:%M')}"

        # Escape values to prevent HTML injection
        name_escaped = self._escape_text(name)
        email_escaped = self._escape_text(email)
        phone_escaped = self._escape_text(phone if phone else "N/A")
        subject_escaped = self._escape_text(subject if subject else "N/A")
        message_escaped = self._escape_text(message)

        text = f"""
📩 <b>សារថ្មីពី Website</b>
━━━━━━━━━━━━━━━━━━━━━━━━━

👤 <b>ឈ្មោះ:</b> {name_escaped}
📧 <b>អ៊ីមែល:</b> {email_escaped}
📞 <b>ទូរស័ព្ទ:</b> {phone_escaped}
📌 <b>ប្រធានបទ:</b> {subject_escaped}

💬 <b>សារ:</b>
{message_escaped}

━━━━━━━━━━━━━━━━━━━━━━━━━
🕐 <b>ទទួលបាននៅ:</b> {current_datetime}
""".strip()

        return await self.send_message(text, parse_mode="HTML")

    async def send_enrollment_notification(
        self,
        enrollment_data: dict,
        course_name: str,
        status: Optional[str] = None,
    ) -> bool:
        """
        Send a formatted enrollment notification.

        Args:
            enrollment_data: Dictionary with enrollment data
            course_name: Name of the course
            status: Optional status (for status updates)

        Returns:
            True if successful, False otherwise
        """
        # Get current datetime
        now = datetime.now()
        days_khmer = {
            'Monday': 'ចន្ទ',
            'Tuesday': 'អង្គារ',
            'Wednesday': 'ពុធ',
            'Thursday': 'ព្រហស្បតិ៍',
            'Friday': 'សុក្រ',
            'Saturday': 'សៅរ៍',
            'Sunday': 'អាទិត្យ'
        }
        day_name = days_khmer.get(now.strftime('%A'), '')
        current_datetime = f"{day_name} {now.strftime('%d/%m/%Y %H:%M')}"

        # Escape values - show empty string for empty/None values
        data = {}
        for k, v in enrollment_data.items():
            if v is None or v == "" or v == "None":
                data[k] = "N/A"
            else:
                data[k] = self._escape_text(str(v))

        # Determine header
        if status:
            header = "📋 <b>ការផ្លាស់ប្តូរស្ថានភាពចុះឈ្មោះ</b>"
            status_line = f"\n📌 <b>ស្ថានភាពថ្មី:</b> {self._escape_text(status)}"
            footer = f"\n🕐 <b>បានផ្លាស់ប្តូរនៅ:</b> {current_datetime}"
        else:
            header = "🎓 <b>ការចុះឈ្មោះចូលរៀនថ្មី</b>"
            status_line = f"\n📌 <b>ស្ថានភាព:</b> {data.get('status', 'pending')}"
            footer = f"\n🕐 <b>ចុះឈ្មោះនៅ:</b> {current_datetime}"

        text = f"""
{header}
━━━━━━━━━━━━━━━━━━━━━━━━━

📚 <b>វគ្គសិក្សា:</b> {self._escape_text(course_name)}
{status_line}

👤 <b>ឈ្មោះខ្មែរ:</b> {data.get('khmer_name', 'N/A')}
👤 <b>ឈ្មោះអង់គ្លេស:</b> {data.get('english_name', 'N/A')}
🚻 <b>ភេទ:</b> {data.get('gender', 'N/A')}
🎂 <b>អាយុ:</b> {data.get('age', 'N/A')}
📅 <b>ថ្ងៃខែឆ្នាំកំណើត:</b> {data.get('date_of_birth', 'N/A')}
🌍 <b>សញ្ជាតិ:</b> {data.get('nationality', 'N/A')}
🏛️ <b>ប្រទេស:</b> {data.get('nation', 'N/A')}
⛪ <b>សាសនា:</b> {data.get('religion', 'N/A')}

🪪 <b>អត្តសញ្ញាណប័ណ្ណ:</b> {data.get('state_id_no', 'N/A')}
📅 <b>ចេញផ្សាយ:</b> {data.get('issued_on', 'N/A')}
📅 <b>ផុតកំណត់:</b> {data.get('expired_on', 'N/A')}

🏠 <b>ផ្ទះលេខ:</b> {data.get('house_no', 'N/A')}
🏘️ <b>ភូមិ:</b> {data.get('village', 'N/A')}
🏘️ <b>ឃុំ/សង្កាត់:</b> {data.get('commune_sangkat', 'N/A')}
🏙️ <b>ស្រុក/ខណ្ឌ:</b> {data.get('district_khan', 'N/A')}
🏙️ <b>ខេត្ត/ក្រុង:</b> {data.get('province_city', 'N/A')}

📞 <b>ទូរស័ព្ទ:</b> {data.get('phone', 'N/A')}
📧 <b>អ៊ីមែល:</b> {data.get('email', 'N/A')}
{footer}
""".strip()

        return await self.send_message(text, parse_mode="HTML")

    async def send_enrollment_status_notification(
        self,
        enrollment_data: dict,
        course_name: str,
        old_status: str,
        new_status: str,
    ) -> bool:
        """
        Send enrollment status change notification.

        Args:
            enrollment_data: Dictionary with enrollment data
            course_name: Name of the course
            old_status: Previous status
            new_status: New status

        Returns:
            True if successful, False otherwise
        """
        # Get current datetime
        now = datetime.now()
        days_khmer = {
            'Monday': 'ចន្ទ',
            'Tuesday': 'អង្គារ',
            'Wednesday': 'ពុធ',
            'Thursday': 'ព្រហស្បតិ៍',
            'Friday': 'សុក្រ',
            'Saturday': 'សៅរ៍',
            'Sunday': 'អាទិត្យ'
        }
        day_name = days_khmer.get(now.strftime('%A'), '')
        current_datetime = f"{day_name} {now.strftime('%d/%m/%Y %H:%M')}"

        # Escape values - preserve empty strings, only replace None with N/A
        data = {k: self._escape_text(str(v)) if v is not None else 'N/A' for k, v in enrollment_data.items()}
        course_name_escaped = self._escape_text(course_name) if course_name else 'N/A'
        old_status_escaped = self._escape_text(old_status) if old_status else 'N/A'
        new_status_escaped = self._escape_text(new_status) if new_status else 'N/A'

        text = f"""📋 <b>ការផ្លាស់ប្តូរស្ថានភាពចុះឈ្មោះ</b>
━━━━━━━━━━━━━━━━━━━━━━━━━

📚 <b>វគ្គសិក្សា:</b> {course_name_escaped}

📌 <b>ស្ថានភាពចាស់:</b> {old_status_escaped}
📌 <b>ស្ថានភាពថ្មី:</b> {new_status_escaped}

👤 <b>ឈ្មោះខ្មែរ:</b> {data.get('khmer_name', 'N/A')}
👤 <b>ឈ្មោះអង់គ្លេស:</b> {data.get('english_name', 'N/A')}
📞 <b>ទូរស័ព្ទ:</b> {data.get('phone', 'N/A')}
📧 <b>អ៊ីមែល:</b> {data.get('email', 'N/A')}

━━━━━━━━━━━━━━━━━━━━━━━━━
🕐 <b>បានផ្លាស់ប្តូរនៅ:</b> {current_datetime}
""".strip()

        return await self.send_message(text, parse_mode="HTML")

    async def send_custom_message(
        self,
        title: str,
        content: str,
        footer: Optional[str] = None,
    ) -> bool:
        """
        Send a custom formatted message.

        Args:
            title: Message title
            content: Message content
            footer: Optional footer text

        Returns:
            True if successful, False otherwise
        """
        now = datetime.now()
        current_datetime = now.strftime('%d/%m/%Y %H:%M')

        text = f"""
📢 <b>{self._escape_text(title)}</b>
━━━━━━━━━━━━━━━━━━━━━━━━━

{self._escape_text(content)}

━━━━━━━━━━━━━━━━━━━━━━━━━
🕐 {current_datetime}
{f'<i>{self._escape_text(footer)}</i>' if footer else ''}
""".strip()

        return await self.send_message(text, parse_mode="HTML")

    def _escape_text(self, text: str) -> str:
        """
        Escape text for HTML format to prevent injection.
        """
        if text is None:
            return "N/A"
        return html.escape(str(text))


# =========================================================
# GLOBAL BOT INSTANCE
# =========================================================

telegram_bot = TelegramBot()