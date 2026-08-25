# Telegram Bot Integration - Setup Guide

## ✅ Integration Complete

The Telegram bot has been successfully integrated with your website. Here's what's been set up:

## 📁 Files Created/Modified

1. **Created:** `backend/app/utils/telegram.py` - Telegram bot service
2. **Modified:** `backend/app/config.py` - Added Telegram configuration
3. **Modified:** `backend/app/routers/contact.py` - Contact form notifications
4. **Modified:** `backend/app/routers/enrollments.py` - Enrollment notifications
5. **Modified:** `backend/requirements.txt` - Added httpx dependency
6. **Created:** `backend/test_telegram.py` - Test script

## 🚀 How to Activate

### Step 1: Install Dependencies
```bash
cd backend
pip install httpx
```

### Step 2: Configure Environment Variables
Your `.env` file already has the Telegram credentials:
```
TELEGRAM_BOT_TOKEN=8222720752:AAFItVLUoVgJq2cRb2GfGw-OGKixNp4sA6Y
TELEGRAM_CHAT_ID=6976377739
```

### Step 3: Restart Backend Server
```bash
cd backend
python run.py
```

### Step 4: Test the Integration
```bash
cd backend
python test_telegram.py
```

## 📱 What Happens Now

### 1. Contact Form Messages
When a student sends a message via the contact form:
- ✅ Message saved to database
- ✅ Telegram notification sent with:
  - Student name
  - Email
  - Phone (if provided)
  - Subject (if provided)
  - Message content
  - Timestamp

### 2. Enrollment Registrations
When a student registers for a course:
- ✅ Enrollment saved to database
- ✅ Telegram notification sent with:
  - Course name
  - Student details (Khmer/English name)
  - Personal information
  - Contact information
  - Timestamp

### 3. Enrollment Status Changes
When admin updates enrollment status (approved/rejected/etc):
- ✅ Status updated in database
- ✅ Telegram notification sent with:
  - Course name
  - Old status → New status
  - Student information
  - Timestamp

## 🔧 Features

- **Non-blocking:** Telegram failures don't break form submissions
- **Khmer formatted messages** with day names and timestamps
- **HTML escaping** for security
- **Logging** for debugging
- **Empty fields handled** gracefully (shows N/A)

## 📊 Message Format Example

```
🎓 ការចុះឈ្មោះចូលរៀនថ្មី
━━━━━━━━━━━━━━━━━━━━━━━━━

📚 វគ្គសិក្សា: Digital Marketing & Social Media Management
📌 ស្ថានភាព: pending

👤 ឈ្មោះខ្មែរ: ចាន់ សុខា
👤 ឈ្មោះអង់គ្លេស: Chan Sokha
🚻 ភេទ: female
🎂 អាយុ: 25
📅 ថ្ងៃខែឆ្នាំកំណើត: 2017-05-21
🌍 សញ្ជាតិ: ខ្មែរ
🏛️ ប្រទេស: ខ្មែរ
⛪ សាសនា: N/A

🪪 អត្តសញ្ញាណប័ណ្ណ: 123456789
📅 ចេញផ្សាយ: N/A
📅 ផុតកំណត់: N/A

🏠 ផ្ទះលេខ: N/A
🏘️ ភូមិ: N/A
🏘️ ឃុំ/សង្កាត់: N/A
🏙️ ស្រុក/ខណ្ឌ: N/A
🏙️ ខេត្ត/ក្រុង: N/A

📞 ទូរស័ព្ទ: 012345678
📧 អ៊ីមែល: chan.sokha@gmail.com

🕐 ចុះឈ្មោះនៅ: ព្រហស្បតិ៍ 06/08/2026 11:45
```

## ⚠️ Important Notes

1. **No frontend code was modified** - All changes are in the backend
2. **Optional fields** that are left empty will show as "N/A"
3. **Telegram failures** won't break the website functionality
4. **Rate limiting** is already in place (3 requests/minute)

## 🐛 Troubleshooting

If Telegram messages are not being sent:

1. Check if httpx is installed: `pip install httpx`
2. Verify .env file has correct Telegram credentials
3. Check backend logs for errors
4. Run test script: `python test_telegram.py`
5. Ensure backend server is restarted after changes

## 📞 Support

If you need to change the Telegram chat ID or bot token, edit the `.env` file in the backend folder.