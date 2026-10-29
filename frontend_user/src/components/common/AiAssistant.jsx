import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";

const AiAssistant = () => {
  const { language } = useLanguage();
  const isKhmer = language === "km";

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const TELEGRAM_LINK = "https://t.me/SC_Academy";

  // =====================================================
  // COMPREHENSIVE EXPERT KNOWLEDGE BASE FOR SC ACADEMY
  // =====================================================
  const knowledgeBase = {
    greetings: {
      km: "សួស្ដីបង! ខ្ញុំជា SC AI Assistant ជំនួយការឆ្លាតវៃរបស់សាលា SC Academy។ ខ្ញុំអាចជួយប្រឹក្សាអំពីព័ត៌មានវគ្គសិក្សារបស់អ្នកបាន។\n\nតើបងចង់ដឹងអំពីវគ្គសិក្សាអ្វីដែរ?",
      en: "👋 Hello! I am SC AI Assistant 🤖, your smart virtual advisor for SC Academy. I can help you with:\n\n• Course Information (Web Dev, Graphic, Video, Network)\n• Class Schedules (Morning/Afternoon/Evening/Weekend)\n• Campus Location & Registration\n\nWhat would you like to ask about?",
    },

    thanks: {
      km: "🙏 មិនអីទេបាទ/ចាស! រីករាយដែលបានជួយលោកអ្នក។ ប្រសិនបើមានចម្ងល់បន្ថែម ឬចង់ចុះឈ្មោះចូលរៀន លោកអ្នកអាចឆាតទៅកាន់ Telegram Admin @SC_Academy បានគ្រប់ពេលវេលា!",
      en: "🙏 You're very welcome! Glad to assist you. If you have further questions or wish to enroll, feel free to message our Telegram Admin @SC_Academy anytime!",
    },

    courses: [
      {
        id: "web",
        keywords: [
          "web", "coding", "code", "programming", "developer", "react", "html", "css",
          "javascript", "js", "frontend", "backend", "fullstack", "full-stack",
          "វេបសាយ", "កូដ", "បង្កើតវេបសាយ", "web development", "រៀនកូដ", "បង្កើត web"
        ],
        title_km: "🌐 វគ្គបង្កើតវេបសាយអាជីព (Full-Stack Web Development)",
        title_en: "🌐 Full-Stack Web Development Masterclass",
        response_km:
          "💻 **វគ្គសិក្សា Full-Stack Web Development:**\n\n" +
          "• **មេរៀនដែលត្រូវរៀន:** HTML5, CSS3, Tailwind CSS, JavaScript (ES6+), React.js, Node.js, Express, MongoDB/SQL និង REST APIs\n" +
          "• **រយៈពេលសិក្សា:** 12 សប្តាហ៍ (៣ ខែ)\n" +
          "• **លក្ខណៈពិសេស:** អនុវត្តជាក់ស្ដែង 80% បង្កើត Website & Web App ពិតប្រាកដយ៉ាងតិច 4 គម្រោងសម្រាប់ដាក់ Portfolio ដាក់ពាក្យធ្វើការងារ\n" +
          "• **តម្លៃសិក្សា:** សូមទាក់ទងមកកាន់សាលាផ្ទាល់ដើម្បីទទួលបានតម្លៃប្រូម៉ូសិនពិសេស!\n\n" +
          "👉 លោកអ្នកអាចចុចប៊ូតុងខាងក្រោមដើម្បីចុះឈ្មោះតាម Telegram ឥឡូវនេះ!",
        response_en:
          "💻 **Full-Stack Web Development Course:**\n\n" +
          "• **Curriculum:** HTML5, CSS3, Tailwind CSS, JavaScript (ES6+), React.js, Node.js, MongoDB/SQL & REST APIs\n" +
          "• **Duration:** 12 Weeks (3 Months)\n" +
          "• **Highlights:** 80% hands-on lab training with 4+ real client-ready portfolio projects\n" +
          "• **Tuition:** Please contact our school for special promotional pricing!\n\n" +
          "👉 Tap the button below to enroll via Telegram now!",
      },
      {
        id: "design",
        keywords: [
          "design", "graphic", "photoshop", "illustrator", "logo", "branding", "banner",
          "ui", "ux", "ឌីហ្សាញ", "រចនា", "រូបភាព", "ឡូហ្គោ", "ក្រាហ្វិក", "កាត់តរូប"
        ],
        title_km: "🎨 វគ្គរចនាក្រាហ្វិក & Brand Identity (Graphic Design)",
        title_en: "🎨 Graphic Design & Brand Identity",
        response_km:
          "🎨 **វគ្គសិក្សា Graphic Design & Brand Identity:**\n\n" +
          "• **មេរៀនដែលត្រូវរៀន:** Adobe Photoshop, Adobe Illustrator, Logo Design, Brand Identity, Poster/Banner ពាណិជ្ជកម្ម, Typography, Social Media Visuals\n" +
          "• **រយៈពេលសិក្សា:** 8 សប្តាហ៍ (២ ខែ)\n" +
          "• **លក្ខណៈពិសេស:** បង្រៀនគំនិតច្នៃប្រឌិត (Design Thinking) និងការរៀបចំ Portfolio ដាក់ពាក្យធ្វើការ ឬទទួលការងារ Freelance\n" +
          "• **តម្លៃសិក្សា:** សូមទាក់ទងសាលាសម្រាប់តម្លៃពិសេស\n\n" +
          "👉 ចុចខាងក្រោមដើម្បីចុះឈ្មោះ ឬសាកសួរកាលវិភាគ!",
        response_en:
          "🎨 **Graphic Design & Brand Identity Course:**\n\n" +
          "• **Curriculum:** Adobe Photoshop, Illustrator, Brand Identity, Logo Creation, Social Media Visuals, Typography & Commercial Layouts\n" +
          "• **Duration:** 8 Weeks (2 Months)\n" +
          "• **Highlights:** Real client branding projects with a polished portfolio for employment or freelancing\n" +
          "• **Tuition:** Contact us for special pricing\n\n" +
          "👉 Tap below to enroll or check start dates!",
      },
      {
        id: "video",
        keywords: [
          "video", "edit", "premiere", "after effects", "capcut", "motion", "vfx", "sound",
          "youtube", "tiktok", "reels", "វីដេអូ", "កាត់ត", "កាត់តវីដេអូ", "ស្ពត", "ថត"
        ],
        title_km: "🎬 វគ្គកាត់តវីដេអូពាណិជ្ជកម្ម & Motion Graphics (Video Editing)",
        title_en: "🎬 Video Editing & Motion Graphics",
        response_km:
          "🎬 **វគ្គសិក្សា Video Editing & Content Creation:**\n\n" +
          "• **មេរៀនដែលត្រូវរៀន:** Adobe Premiere Pro, CapCut PC Pro, After Effects (Motion Graphics), Color Grading, Audio Synchronization, Video Storytelling\n" +
          "• **រយៈពេលសិក្សា:** 8 សប្តាហ៍ (២ ខែ)\n" +
          "• **លក្ខណៈពិសេស:** ផលិតស្ពតពាណិជ្ជកម្ម វីដេអូខ្លឹមសារសម្រាប់ TikTok, YouTube, Facebook Reels\n" +
          "• **តម្លៃសិក្សា:** សូមទាក់ទងសាលាសម្រាប់តម្លៃពិសេស\n\n" +
          "👉 ចុះឈ្មោះឥឡូវនេះដើម្បីចាប់ផ្តើមផលិតវីដេអូអាជីព!",
        response_en:
          "🎬 **Commercial Video Editing & Motion Graphics:**\n\n" +
          "• **Curriculum:** Adobe Premiere Pro, CapCut PC, After Effects Motion Graphics, Color Grading, Audio Mixing & Commercial Storytelling\n" +
          "• **Duration:** 8 Weeks (2 Months)\n" +
          "• **Highlights:** Produce high-converting video ads, TikTok/Reels, and corporate video projects\n" +
          "• **Tuition:** Contact us for special pricing\n\n" +
          "👉 Enroll today to elevate your video production skills!",
      },
      {
        id: "network",
        keywords: [
          "network", "it", "support", "router", "switch", "cisco", "mikrotik", "lan", "wan",
          "ip", "subnet", "cabling", "server", "repair", "hardware", "បណ្តាញ", "ជួសជុល", "it support", "ម៉ាស៊ីន"
        ],
        title_km: "🛠️ វគ្គគ្រប់គ្រងប្រព័ន្ធបណ្តាញ & IT Support (Network & IT)",
        title_en: "🛠️ Network Administration & IT Support",
        response_km:
          "🛠️ **វគ្គសិក្សា Network Administration & IT Support:**\n\n" +
          "• **មេរៀនដែលត្រូវរៀន:** LAN/WAN Cabling, IP Routing & Subnetting, MikroTik Router Configuration, Cisco Switch Setup, Windows Server Admin, ជួសជុលកុំព្យូទ័រ និងដោះស្រាយបញ្ហា Hardware/Software\n" +
          "• **រយៈពេលសិក្សា:** 10 សប្តាហ៍ (២ ខែន្លះ)\n" +
          "• **លក្ខណៈពិសេស:** អនុវត្តផ្ទាល់លើឧបករណ៍ពិត 80% ក្នុងបន្ទប់ Lab\n" +
          "• **តម្លៃសិក្សា:** សូមទាក់ទងសាលាសម្រាប់តម្លៃពិសេស\n\n" +
          "👉 ចុចខាងក្រោមដើម្បីចុះឈ្មោះចូលរៀន!",
        response_en:
          "🛠️ **Network Administration & IT Support Course:**\n\n" +
          "• **Curriculum:** LAN/WAN Cabling, IP Subnetting, MikroTik Setup, Cisco Switch Management, Windows Server, PC Hardware Assembly & Troubleshooting\n" +
          "• **Duration:** 10 Weeks (2.5 Months)\n" +
          "• **Highlights:** 80% hands-on training with physical routers, switches and server racks\n" +
          "• **Tuition:** Contact us for special pricing\n\n" +
          "👉 Tap below to register for the upcoming cohort!",
      },
      {
        id: "office",
        keywords: [
          "office", "excel", "word", "powerpoint", "admin", "អុិចសែល", "កុំព្យូទ័ររដ្ឋបាល", "រដ្ឋបាល", "microsoft"
        ],
        title_km: "📊 វគ្គកុំព្យូទ័ររដ្ឋបាលកម្រិតខ្ពស់ (Advanced Microsoft Office)",
        title_en: "📊 Advanced Microsoft Office & Administrative IT",
        response_km:
          "📊 **វគ្គសិក្សា Advanced Microsoft Office:**\n\n" +
          "• **មេរៀនដែលត្រូវរៀន:** Advanced Excel (VLOOKUP, XLOOKUP, INDEX/MATCH, Pivot Table, Interactive Dashboard, Charts), Word Formatting លិខិតរដ្ឋបាលស្ដង់ដារ, PowerPoint Presentation វិជ្ជាជីវៈ\n" +
          "• **រយៈពេលសិក្សា:** 8 សប្តាហ៍ (២ ខែ)\n" +
          "• **តម្លៃសិក្សា:** សូមទាក់ទងសាលាសម្រាប់តម្លៃពិសេស\n\n" +
          "👉 ចុះឈ្មោះឥឡូវនេះដើម្បីបង្កើនប្រសិទ្ធភាពការងាររដ្ឋបាល!",
        response_en:
          "📊 **Advanced Microsoft Office Course:**\n\n" +
          "• **Curriculum:** Advanced Excel (Formulas, XLOOKUP, Pivot Tables, Dashboards), Official Document Formatting with Word, High-Impact PowerPoint Presentations\n" +
          "• **Duration:** 8 Weeks (2 Months)\n" +
          "• **Tuition:** Contact us for special pricing\n\n" +
          "👉 Enroll today to boost your workplace productivity!",
      },
    ],

    pricing: {
      km: "💰 **ព័ត៌មានតម្លៃសិក្សា និងការបង់ប្រាក់នៅ SC Academy:**\n\n" +
          "សម្រាប់តម្លៃលម្អិតនៃវគ្គសិក្សានីមួយៗ និងប្រូម៉ូសិនពិសេសប្រចាំខែ សូមលោកអ្នកធ្វើការទំនាក់ទំនងមកកាន់សាលាផ្ទាល់។\n\n" +
          "✨ **អត្ថប្រយោជន៍ពិសេសដែលសាលាមានជូន:**\n" +
          "✔️ អាចបង់រំលស់ជាដំណាក់កាលបានសម្រាប់វគ្គវែង\n" +
          "✔️ បង់ប្រាក់ងាយស្រួលតាមរយៈ Bakong KHQR\n" +
          "✔️ ទទួលបានការបញ្ចុះតម្លៃពិសេសពេលចុះឈ្មោះជាក្រុមចាប់ពី ២ នាក់ឡើងទៅ!\n\n" +
          "👉 សូមចុចឆាតទៅកាន់ Telegram Admin @SC_Academy ឥឡូវនេះដើម្បីសាកសួរតម្លៃ និងទទួលប្រូម៉ូសិន!",
      en: "💰 **Tuition Fees & Payment Options at SC Academy:**\n\n" +
          "For detailed pricing of each course and current monthly promotions, please contact our school administration directly.\n\n" +
          "✨ **Special Benefits:**\n" +
          "✔️ Installment payment plans available for long courses\n" +
          "✔️ Easy payment via Bakong KHQR\n" +
          "✔️ Group registration discounts available!\n\n" +
          "👉 Tap below to contact our Telegram Admin @SC_Academy to inquire about pricing and active promotions!",
    },

    beginners: {
      km: "🌟 **តើអ្នកដែលមិនធ្លាប់មានមូលដ្ឋានគ្រឹះ អាចរៀនបានដែរឬទេ?**\n\n" +
          "**ពិតជាបាន ១០០%!** គ្រប់វគ្គសិក្សាទាំងអស់នៅ SC Academy ត្រូវបានរចនាឡើងជាពិសេសសម្រាប់អ្នកចាប់ផ្តើមពីកម្រិតសូន្យ (Zero Basics)៖\n\n" +
          "1. បង្រៀនជាជំហានៗចាប់ពីគ្រឹះដំបូង\n" +
          "2. អនុវត្តជាក់ស្ដែងលើកុំព្យូទ័រក្នុង Lab 80%\n" +
          "3. មានលោកគ្រូអ្នកគ្រូជំនាញណែនាំផ្ទាល់ជាប់ជានិច្ច\n" +
          "4. មានវីដេអូ Recap មេរៀនសម្រាប់មើលរំលឹកឡើងវិញនៅផ្ទះ",
      en: "🌟 **Can complete beginners with no background join?**\n\n" +
          "**Absolutely 100%!** All SC Academy programs are designed from zero basics:\n\n" +
          "1. Step-by-step foundational guidance\n" +
          "2. 80% practical hands-on computer lab training\n" +
          "3. Dedicated instructor mentorship throughout\n" +
          "4. Lesson recordings available for home review",
    },

    schedules: {
      km: "📅 **វេនសិក្សា និងកាលវិភាគនៅ SC Academy:**\n\n" +
          "• **វេនព្រឹក (ចន្ទ - សុក្រ):** ៨:៣០ ដល់ ១០:៣០ ព្រឹក\n" +
          "• **វេនរសៀល (ចន្ទ - សុក្រ):** ២:០០ ដល់ ៤:០០ រសៀល\n" +
          "• **វេនយប់ (ចន្ទ - សុក្រ):** ៥:៣០ ដល់ ៧:០០ យប់ ឬ ៧:០០ ដល់ ៨:៣០ យប់\n" +
          "• **វេនចុងសប្តាហ៍ (សៅរ៍ - អាទិត្យ):**\n" +
          "  - ព្រឹក: ៨:០០ ដល់ ១១:០០ ព្រឹក\n" +
          "  - រសៀល: ២:០០ ដល់ ៥:០០ ល្ងាច\n\n" +
          "👉 សមស្របបំផុតសម្រាប់ទាំងសិស្ស និស្សិត និងអ្នកកំពុងបំពេញការងារ!",
      en: "📅 **Class Shifts & Schedules at SC Academy:**\n\n" +
          "• **Morning (Mon - Fri):** 8:30 AM - 10:30 AM\n" +
          "• **Afternoon (Mon - Fri):** 2:00 PM - 4:00 PM\n" +
          "• **Evening (Mon - Fri):** 5:30 PM - 7:00 PM / 7:00 PM - 8:30 PM\n" +
          "• **Weekend (Sat - Sun):**\n" +
          "  - Morning: 8:00 AM - 11:00 AM\n" +
          "  - Afternoon: 2:00 PM - 5:00 PM\n\n" +
          "👉 Perfect for both university students and working professionals!",
    },

    certificates: {
      km: "📜 **វិញ្ញាបនបត្របញ្ចប់ការសិក្សា (Official Certification):**\n\n" +
          "បាទ/ចាស! ក្រោយពីបញ្ចប់ការសិក្សា និងការធ្វើបទបង្ហាញគម្រោង (Project Presentation) ដោយជោគជ័យ សិស្សនឹងទទួលបាន៖\n\n" +
          "1. វិញ្ញាបនបត្រផ្លូវការដែលទទួលស្គាល់ដោយស្ថាប័ន និងក្រុមហ៊ុនដៃគូ\n" +
          "2. Digital Portfolio បង្ហាញស្នាដៃជាក់ស្ដែងលើ CV\n" +
          "3. លិខិតបញ្ជាក់សមត្ថភាពសម្រាប់ដាក់ពាក្យធ្វើការងារ ឬចុះកម្មសិក្សា",
      en: "📜 **Official Certificate of Completion:**\n\n" +
          "Yes! Upon completing course assignments and final project presentations, students receive:\n\n" +
          "1. Official Accredited Certificate recognized by industry hiring partners\n" +
          "2. Verified Digital Portfolio to showcase real projects on CV\n" +
          "3. Recommendation for job placements & internships",
    },

    jobSupport: {
      km: "💼 **ការគាំទ្រឱកាសការងារ និងការចុះហាត់ការ (Career Support):**\n\n" +
          "ក្រុមការងារ Career Placement របស់ SC Academy ជួយសិស្សគ្រប់រូបដូចជា៖\n\n" +
          "• ពិនិត្យ និងរៀបចំប្រវត្តិរូបសង្ខេប (CV & Portfolio)\n" +
          "• សម្ភាសន៍សាកល្បង (Mock Interview)\n" +
          "• បញ្ជូនឈ្មោះសិស្សឆ្នើមទៅកាន់បណ្តាញក្រុមហ៊ុនដៃគូដើម្បីទទួលបានឱកាសការងារ ឬហាត់ការភ្លាមៗ!",
      en: "💼 **Job Placement & Career Support:**\n\n" +
          "SC Academy's Career Support team provides:\n\n" +
          "• Professional resume & portfolio reviews\n" +
          "• Interview coaching & mock sessions\n" +
          "• Direct referrals and priority placement with corporate hiring partners in Cambodia!",
    },

    location: {
      km: "📍 **ទីតាំង និងព័ត៌មានទំនាក់ទំនង SC Academy:**\n\n" +
          "• **អាសយដ្ឋាន:** 14 Street 349, រាជធានីភ្នំពេញ, កម្ពុជា\n" +
          "• **ទូរស័ព្ទ:** 086 306 615\n" +
          "• **អ៊ីមែល:** scacademy9@gmail.com\n" +
          "• **Telegram Admin:** @SC_Academy\n" +
          "• **ម៉ោងធ្វើការ:** ច័ន្ទ - អាទិត្យ (៨:០០ ព្រឹក - ៨:០០ យប់)\n\n" +
          "👉 លោកអ្នកអាចចុចលើ Link ផែនទីដើម្បីបើកមើលលើ Google Maps បានភ្លាមៗ!",
      en: "📍 **Location & Contact Info for SC Academy:**\n\n" +
          "• **Address:** 14 Street 349, Phnom Penh, Cambodia\n" +
          "• **Phone:** 086 306 615\n" +
          "• **Email:** scacademy9@gmail.com\n" +
          "• **Telegram Admin:** @SC_Academy\n" +
          "• **Opening Hours:** Mon - Sun (8:00 AM - 8:00 PM)\n\n" +
          "👉 You can open Google Maps directly using our location link!",
    },

    enrollment: {
      km: "📝 **របៀបចុះឈ្មោះចូលរៀន (How to Enroll):**\n\n" +
          "**ជំហានទី ១:** ជ្រើសរើសវគ្គសិក្សា និងវេនសិក្សាដែលលោកអ្នកពេញចិត្ត\n" +
          "**ជំហានទី ២:** ឆាតទៅកាន់ Telegram Admin ផ្លូវការ @SC_Academy\n" +
          "**ជំហានទី ៣:** បំពេញព័ត៌មាន និងជ្រើសរើសវិធីសាស្ត្របង់ប្រាក់ (KHQR ឬបង់ផ្ទាល់)\n" +
          "**ជំហានទី ៤:** ទទួលបានការបញ្ជាក់កាលវិភាគ និងចូលរៀនក្នុងបន្ទប់ Lab!",
      en: "📝 **How to Enroll at SC Academy:**\n\n" +
          "**Step 1:** Choose your preferred course and class shift\n" +
          "**Step 2:** Message our official Telegram Admin @SC_Academy\n" +
          "**Step 3:** Fill out details and choose payment method (KHQR or cash)\n" +
          "**Step 4:** Receive class schedule confirmation and start learning!",
    },

    teachers: {
      km: "👨‍🏫 **គ្រូបង្រៀននៅ SC Academy:**\n\n" +
          "លោកគ្រូអ្នកគ្រូទាំងអស់សុទ្ធតែជាអ្នកជំនាញដែលកំពុងបម្រើការងារជាក់ស្តែងក្នុងវិស័យបច្ចេកវិទ្យា (Industry Practitioners) ដែលមានបទពិសោធន៍ការងារចាប់ពី ៤ ទៅ ៨ ឆ្នាំឡើងទៅ មានគរុកោសល្យល្អ និងយកចិត្តទុកដាក់ខ្ពស់ចំពោះការអនុវត្តជាក់ស្ដែងរបស់សិស្សម្នាក់ៗ។",
      en: "👨‍🏫 **Instructors at SC Academy:**\n\n" +
          "All our instructors are active industry practitioners and senior specialists with 4-8+ years of real-world expertise, ensuring you learn modern techniques demanded by employers today.",
    },
  };

  const initialGreeting = isKhmer
    ? "សួស្ដីបង! ខ្ញុំជា SC AI Assistant ជំនួយការឆ្លាតវៃរបស់សាលា SC Academy។ ខ្ញុំអាចជួយប្រឹក្សាអំពីព័ត៌មានវគ្គសិក្សារបស់អ្នកបាន។\n\nតើបងចង់ដឹងអំពីវគ្គសិក្សាអ្វីដែរ?"
    : "👋 Hello! I am SC AI Assistant 🤖, your smart virtual advisor for SC Academy. I can help you with:\n\n• Course Information (Web Dev, Graphic, Video, Network)\n• Class Schedules (Morning/Afternoon/Evening/Weekend)\n• Campus Location & Registration\n\nWhat would you like to ask about?";

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "initial",
          sender: "ai",
          text: initialGreeting,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isKhmer]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  // Quick Suggested Prompts
  const quickPrompts = [
    {
      label_en: "📊 Microsoft Office",
      label_km: "📊 វគ្គ Microsoft Office",
      query: isKhmer ? "ប្រាប់អំពីវគ្គសិក្សា Microsoft Office" : "Tell me about Microsoft Office course",
    },
    {
      label_en: "📈 Advanced Excel",
      label_km: "📈 វគ្គ Advanced Excel",
      query: isKhmer ? "ប្រាប់អំពីវគ្គសិក្សា Advanced Excel" : "Tell me about Advanced Excel course",
    },
    {
      label_en: "🎨 Graphic Design",
      label_km: "🎨 វគ្គ Graphic Design",
      query: isKhmer ? "ប្រាប់អំពីវគ្គសិក្សា Graphic Design" : "Tell me about Graphic Design course",
    },
    {
      label_en: "📱 Digital Marketing",
      label_km: "📱 វគ្គ Digital Marketing",
      query: isKhmer ? "ប្រាប់អំពីវគ្គសិក្សា Digital Marketing" : "Tell me about Digital Marketing course",
    },
    {
      label_en: "🛠️ IT Support",
      label_km: "🛠️ វគ្គ IT Support",
      query: isKhmer ? "ប្រាប់អំពីវគ្គសិក្សា IT Support" : "Tell me about IT Support course",
    },
    {
      label_en: "🎬 Video Editing",
      label_km: "🎬 វគ្គ Video Editing",
      query: isKhmer ? "ប្រាប់អំពីវគ្គសិក្សា Video Editing" : "Tell me about Video Editing course",
    },
    {
      label_en: "✨ UX/UI Design",
      label_km: "✨ វគ្គ UX/UI Design",
      query: isKhmer ? "ប្រាប់អំពីវគ្គសិក្សា UX/UI Design" : "Tell me about UX/UI Design course",
    },
    {
      label_en: "🎥 Video Edits & Color",
      label_km: "🎥 វគ្គ Video Editing & Coloring",
      query: isKhmer ? "ប្រាប់អំពីវគ្គសិក្សា Video Editing & Coloring" : "Tell me about Video Editing & Coloring course",
    },
    {
      label_en: "🎞️ Motion Graphic",
      label_km: "🎞️ វគ្គ Motion Graphic",
      query: isKhmer ? "ប្រាប់អំពីវគ្គសិក្សា Motion Graphic" : "Tell me about Motion Graphic course",
    },
    {
      label_en: "📅 Class Shifts",
      label_km: "📅 ម៉ោង និងវេនសិក្សា",
      query: isKhmer ? "តើមានវេនសិក្សាពេលណាខ្លះ?" : "What are the class shifts and schedule?",
    },
    {
      label_en: "🌟 Zero Basics?",
      label_km: "🌟 គ្មានគ្រឹះរៀនបានទេ?",
      query: isKhmer ? "តើអ្នកដែលមិនធ្លាប់មានមូលដ្ឋានគ្រឹះអាចរៀនបានទេ?" : "Can complete beginners join the courses?",
    },
    {
      label_en: "📍 Campus Location",
      label_km: "📍 ទីតាំងសាលា",
      query: isKhmer ? "តើសាលា SC Academy មានទីតាំងនៅឯណា?" : "Where is SC Academy located?",
    },
  ];

  // =====================================================
  // ADVANCED NATURAL INTENT & MULTI-MATCH ENGINE
  // =====================================================
  const generateAiAnswer = (userQuery) => {
    const q = userQuery.toLowerCase().trim();

    // 1. Greetings
    if (/^(hi|hello|hey|hola|សួស្តី|ជម្រាបសួរ|ជំរាបសួរ|សួស្ដី|hello admin|admin)/i.test(q)) {
      return knowledgeBase.greetings[isKhmer ? "km" : "en"];
    }

    // 2. Thank you
    if (/^(thanks|thank you|ok thanks|អរគុណ|សូមអរគុណ|ok admin|អរគុណច្រើន|bye)/i.test(q)) {
      return knowledgeBase.thanks[isKhmer ? "km" : "en"];
    }

    // 3. Beginners / No Background
    if (
      q.includes("basic") || q.includes("beginner") || q.includes("zero") ||
      q.includes("គ្មានមូលដ្ឋាន") || q.includes("មិនចេះសោះ") || q.includes("អត់ចេះ") ||
      q.includes("មិនធ្លាប់រៀន") || q.includes("ទើបរៀនដំបូង") || q.includes("មូលដ្ឋាន")
    ) {
      return knowledgeBase.beginners[isKhmer ? "km" : "en"];
    }

    // 4. Check specific courses
    for (const c of knowledgeBase.courses) {
      if (c.keywords.some((k) => q.includes(k))) {
        return isKhmer ? c.response_km : c.response_en;
      }
    }

    // 5. Pricing / Fees / Discounts
    if (
      q.includes("price") || q.includes("fee") || q.includes("cost") || q.includes("how much") ||
      q.includes("discount") || q.includes("scholarship") || q.includes("promotion") ||
      q.includes("តម្លៃ") || q.includes("ថ្លៃ") || q.includes("ប៉ុន្មាន") ||
      q.includes("បញ្ចុះតម្លៃ") || q.includes("ប្រូម៉ូសិន") || q.includes("អាហារូបករណ៍") ||
      q.includes("បង់ប្រាក់") || q.includes("បង់រំលស់")
    ) {
      return knowledgeBase.pricing[isKhmer ? "km" : "en"];
    }

    // 6. Schedule / Time / Shifts
    if (
      q.includes("schedule") || q.includes("time") || q.includes("shift") || q.includes("when") ||
      q.includes("weekend") || q.includes("weekday") || q.includes("morning") || q.includes("evening") ||
      q.includes("ម៉ោង") || q.includes("ពេល") || q.includes("វេន") || q.includes("កាលវិភាគ") ||
      q.includes("ចុងសប្តាហ៍") || q.includes("យប់") || q.includes("ព្រឹក") || q.includes("រសៀល")
    ) {
      return knowledgeBase.schedules[isKhmer ? "km" : "en"];
    }

    // 7. Certificates
    if (
      q.includes("certificate") || q.includes("diploma") || q.includes("degree") ||
      q.includes("cert") || q.includes("សញ្ញាបត្រ") || q.includes("វិញ្ញាបនបត្រ") ||
      q.includes("កាត") || q.includes("បញ្ចប់ការសិក្សា")
    ) {
      return knowledgeBase.certificates[isKhmer ? "km" : "en"];
    }

    // 8. Job support / Internship
    if (
      q.includes("job") || q.includes("work") || q.includes("career") || q.includes("intern") ||
      q.includes("placement") || q.includes("ការងារ") || q.includes("ហាត់ការ") ||
      q.includes("ធ្វើការ") || q.includes("ស្វែងរកការងារ")
    ) {
      return knowledgeBase.jobSupport[isKhmer ? "km" : "en"];
    }

    // 9. Location / Address / Contact / Map
    if (
      q.includes("location") || q.includes("where") || q.includes("address") || q.includes("campus") ||
      q.includes("map") || q.includes("phone") || q.includes("contact") || q.includes("call") ||
      q.includes("ទីតាំង") || q.includes("នៅឯណា") || q.includes("កន្លែងណា") ||
      q.includes("ផែនទី") || q.includes("ទូរស័ព្ទ") || q.includes("សាខា") || q.includes("ផ្លូវ")
    ) {
      return knowledgeBase.location[isKhmer ? "km" : "en"];
    }

    // 10. Enrollment / Registration / How to join
    if (
      q.includes("enroll") || q.includes("register") || q.includes("join") || q.includes("apply") ||
      q.includes("sign up") || q.includes("ចុះឈ្មោះ") || q.includes("ចូលរៀន") ||
      q.includes("ដាក់ពាក្យ") || q.includes("ទាក់ទងរៀន")
    ) {
      return knowledgeBase.enrollment[isKhmer ? "km" : "en"];
    }

    // 11. Teachers / Instructors
    if (
      q.includes("teacher") || q.includes("instructor") || q.includes("mentor") ||
      q.includes("គ្រូ") || q.includes("សាស្រ្តាចារ្យ") || q.includes("អ្នកបង្រៀន")
    ) {
      return knowledgeBase.teachers[isKhmer ? "km" : "en"];
    }

    // Default Smart Fallback
    return isKhmer
      ? "💡 **SC Academy ផ្តល់ជូនវគ្គបណ្តុះបណ្តាលបច្ចេកវិទ្យា & ឌីជីថលស្ដង់ដារ៖**\n\n" +
        "1. **Full-Stack Web Development** (HTML, CSS, JS, React, Node, DB)\n" +
        "2. **Graphic Design & Branding** (Photoshop, Illustrator, Logo)\n" +
        "3. **Video Editing & Motion** (Premiere Pro, After Effects, CapCut)\n" +
        "4. **Network & IT Support** (MikroTik, Cisco Switch, PC Repair)\n" +
        "5. **Advanced Microsoft Office** (Excel Dashboard, Word, PowerPoint)\n\n" +
        "👉 លោកអ្នកអាចសាកសួរលម្អិតពីវគ្គណាមួយ ឬចុចប៊ូតុងខាងក្រោមដើម្បីឆាតទៅកាន់ Telegram Admin @SC_Academy ផ្ទាល់បានគ្រប់ពេល!"
      : "💡 **SC Academy provides future-ready digital & IT training programs:**\n\n" +
        "1. **Full-Stack Web Development** (HTML, CSS, JS, React, Node, DB)\n" +
        "2. **Graphic Design & Branding** (Photoshop, Illustrator, Logo)\n" +
        "3. **Video Editing & Motion** (Premiere Pro, After Effects, CapCut)\n" +
        "4. **Network & IT Support** (MikroTik, Cisco Switch, PC Hardware)\n" +
        "5. **Advanced Microsoft Office** (Excel Dashboard, Word, PowerPoint)\n\n" +
        "👉 Feel free to ask about any course, or tap below to chat with our Telegram Admin @SC_Academy directly!";
  };

  const handleSendMessage = (textToSend = null) => {
    const text = textToSend || inputValue;
    if (!text || !text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate smart fast typing latency (350ms)
    setTimeout(() => {
      const reply = generateAiAnswer(text);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 380);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openTelegramDirect = () => {
    const msg = isKhmer
      ? "សួស្តី Admin! ខ្ញុំបានសាកសួរព័ត៌មានតាមរយៈ SC AI Assistant ហើយមានបំណងចង់ចុះឈ្មោះចូលរៀន!"
      : "Hello Admin! I inquired through SC AI Assistant and would like to enroll in a course!";
    window.open(`${TELEGRAM_LINK}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const clearChat = () => {
    setMessages([
      {
        id: "cleared-greeting",
        sender: "ai",
        text: initialGreeting,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* =====================================================
          FLOATING LAUNCHER BUTTON
      ===================================================== */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="
              hidden md:flex items-center gap-2
              px-3.5 py-2
              rounded-full
              bg-white/95 dark:bg-[#0F172A]/95
              border border-slate-200 dark:border-slate-800
              text-[#2563EB] dark:text-blue-400
              text-[12px] font-bold
              shadow-lg
              backdrop-blur-md
              cursor-pointer
              hover:scale-105
              transition-all duration-300
            "
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]" />
            </span>
            <span>{isKhmer ? "សួរ SC AI Assistant" : "Ask SC AI Assistant"}</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
          className={`
            relative
            flex items-center justify-center flex-shrink-0
            w-12 h-12 sm:w-14 sm:h-14
            rounded-full
            shadow-[0_8px_25px_rgba(37,99,235,0.4)]
            transition-all duration-300 transform
            hover:scale-105 active:scale-95
            ${
              isOpen
                ? "bg-slate-900 text-white rotate-90"
                : "bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] text-white"
            }
          `}
        >
          {isOpen ? (
            <i className="fa-solid fa-xmark text-lg sm:text-xl" />
          ) : (
            <>
              <i className="fa-solid fa-robot text-lg sm:text-xl" />
              {/* Online indicator dot */}
              <span className="absolute top-0 right-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-900" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* =====================================================
          AI CHAT MODAL / DRAWER
      ===================================================== */}
      {isOpen && (
        <div
          className={`
            fixed z-50
            bottom-20 right-3 sm:right-6
            ${
              isExpanded
                ? "w-[calc(100vw-1.5rem)] sm:w-[540px] h-[82vh] max-h-[700px]"
                : "w-[calc(100vw-1.5rem)] sm:w-[380px] md:w-[410px] max-w-[430px] sm:max-w-none h-[540px] max-h-[80vh]"
            }
            bg-white dark:bg-[#0F172A]
            border border-slate-200 dark:border-slate-800
            rounded-2xl
            shadow-2xl
            backdrop-blur-xl
            flex flex-col
            overflow-hidden
            transition-all duration-300 ease-out
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#2563EB] to-blue-600 text-white border-b border-blue-700 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-inner">
                <i className="fa-solid fa-robot text-sm" />
              </div>
              <div>
                <h3 className="font-bold text-[13.5px] leading-none text-white">SC AI Assistant</h3>
                <p className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  {isKhmer ? "ជំនួយការឆ្លាតវៃ (អនឡាញ)" : "Online Virtual Advisor"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={clearChat}
                title={isKhmer ? "លុបសារ" : "Clear Chat"}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <i className="fa-solid fa-trash-can text-xs" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                title={isExpanded ? "Collapse" : "Expand"}
                className="hidden sm:block p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <i className={`fa-solid ${isExpanded ? "fa-compress" : "fa-expand"} text-xs`} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70 dark:bg-[#080E1E] scroll-smooth">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex-shrink-0 flex items-center justify-center text-[11px] shadow-sm mt-0.5">
                    <i className="fa-solid fa-robot" />
                  </div>
                )}
                <div
                  className={`
                    max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[12.5px] leading-relaxed shadow-sm
                    ${
                      m.sender === "user"
                        ? "bg-[#2563EB] text-white rounded-br-none"
                        : "bg-white dark:bg-[#1E293B] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 rounded-bl-none"
                    }
                  `}
                >
                  <p className="whitespace-pre-line">
                    {m.text.split(/(\*\*.*?\*\*)/g).map((part, i) => 
                      part.startsWith("**") && part.endsWith("**") 
                        ? <strong key={i}>{part.slice(2, -2)}</strong> 
                        : part
                    )}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex-shrink-0 flex items-center justify-center text-[11px]">
                  <i className="fa-solid fa-robot" />
                </div>
                <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/60 px-3.5 py-2.5 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-blue-400 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-blue-400 animate-pulse delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-blue-400 animate-pulse delay-200" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip.query)}
                className="
                  flex-shrink-0
                  px-2.5 py-1
                  rounded-full
                  bg-slate-100 dark:bg-slate-800
                  border border-slate-200 dark:border-slate-700
                  text-[11px] font-semibold
                  text-[#2563EB] dark:text-blue-300
                  hover:bg-[#2563EB] hover:text-white dark:hover:bg-[#2563EB]
                  transition-all duration-200
                "
              >
                {isKhmer ? chip.label_km : chip.label_en}
              </button>
            ))}
          </div>

          {/* Direct Telegram Action & Input Bar */}
          <div className="p-3 bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={openTelegramDirect}
              className="
                w-full mb-2
                flex items-center justify-center gap-2
                py-2 px-3
                rounded-xl
                bg-blue-500/10 hover:bg-[#2563EB] hover:text-white
                border border-blue-500/20
                text-[#2563EB] dark:text-blue-400
                text-[11.5px] font-bold
                transition-all duration-200
                shadow-xs
              "
            >
              <i className="fa-brands fa-telegram text-sm" />
              <span>{isKhmer ? "ចុះឈ្មោះ / ឆាតទៅកាន់ Telegram Admin" : "Chat with Telegram Admin Directly"}</span>
            </button>

            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isKhmer ? "សរសេរសំណួររបស់អ្នកនៅទីនេះ..." : "Ask a question about courses, schedule..."}
                className="
                  flex-1
                  px-3.5 py-2
                  rounded-xl
                  border border-slate-200 dark:border-slate-700
                  bg-slate-50 dark:bg-slate-800
                  text-slate-800 dark:text-slate-100
                  text-[12.5px]
                  focus:outline-none focus:ring-2 focus:ring-[#2563EB]
                  transition-all
                "
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                aria-label="Send message"
                className="
                  flex-shrink-0
                  w-9 h-9
                  rounded-xl
                  bg-[#2563EB] text-white
                  flex items-center justify-center
                  disabled:opacity-40 disabled:cursor-not-allowed
                  hover:bg-[#1D4ED8]
                  transition-all duration-200
                  shadow-xs
                "
              >
                <i className="fa-solid fa-paper-plane text-xs" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant;
