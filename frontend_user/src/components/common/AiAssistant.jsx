import React, { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiX,
  FiMinimize2,
  FiMaximize2,
  FiTrash2,
} from "react-icons/fi";
import { FaRobot, FaTelegramPlane, FaMagic } from "react-icons/fa";
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

  const TELEGRAM_USERNAME = "SC_Academy";

  // Predefined Knowledge Base for SC Academy
  const knowledgeBase = {
    courses: [
      {
        keywords: ["design", "graphic", "photoshop", "illustrator", "ឌីហ្សាញ", "រចនា", "រូបភាព"],
        title_en: "Graphic Design Masterclass",
        title_km: "វគ្គសិក្សា Graphic Design ជំនាញ",
        response_en:
          "🎨 Our Graphic Design course covers Adobe Photoshop, Illustrator, Brand Identity, and Typography. It takes 3 months with real client projects and a recognized certification upon graduation.",
        response_km:
          "🎨 វគ្គសិក្សា Graphic Design នឹងបង្រៀនលោកអ្នកពី Adobe Photoshop, Illustrator, ការបង្កើត Brand Identity និង Logo។ រយៈពេលសិក្សា ៣ ខែ ជាមួយការអនុវត្តជាក់ស្តែង និងទទួលបានវិញ្ញាបនបត្របញ្ជាក់ការសិក្សា។",
      },
      {
        keywords: ["video", "edit", "premiere", "after effects", "វីដេអូ", "កាត់ត", "tiktok", "reels"],
        title_en: "Video Editing & Motion Graphics",
        title_km: "វគ្គសិក្សា Video Editing & Motion",
        response_en:
          "🎬 Master Premiere Pro, After Effects, and CapCut Pro for cinematic videos, TikTok/Reels, and corporate advertising in 2.5 months.",
        response_km:
          "🎬 វគ្គសិក្សា Video Editing បង្រៀន Premiere Pro, After Effects និង CapCut Pro សម្រាប់ការផលិតវីដេអូពាណិជ្ជកម្ម និង Media ខ្លឹមសារលំដាប់ខ្ពស់ រយៈពេល ២.៥ ខែ។",
      },
      {
        keywords: ["office", "excel", "word", "powerpoint", "ការិយាល័យ", "អុិចសែល", "កុំព្យូទ័រ"],
        title_en: "Advanced Microsoft Office & Admin IT",
        title_km: "វគ្គសិក្សា Microsoft Office កម្រិតខ្ពស់",
        response_en:
          "📊 Master Advanced Excel (Formulas, Pivot tables, Dashboards), Word Formatting, PowerPoint and digital administration skills in 2 months.",
        response_km:
          "📊 វគ្គសិក្សា Microsoft Office កម្រិតខ្ពស់ បង្រៀន Advanced Excel (រូបមន្ត, Pivot Table, Dashboard), Word និង PowerPoint សម្រាប់កិច្ចការរដ្ឋបាល និងគណនេយ្យ រយៈពេល ២ ខែ។",
      },
      {
        keywords: ["web", "code", "programming", "developer", "react", "html", "css", "វេបសាយ", "កូដ", "បង្កើតវេបសាយ"],
        title_en: "Full-Stack Web Development",
        title_km: "វគ្គសិក្សា បង្កើត Web Application",
        response_en:
          "💻 Learn HTML5, CSS3, TailwindCSS, JavaScript, React.js, and Backend API integrations. Build 4+ real-world portfolio projects.",
        response_km:
          "💻 វគ្គសិក្សា Web Development បង្រៀនចាប់ពីកម្រិតមូលដ្ឋានដល់កម្រិតខ្ពស់ (HTML, CSS, JavaScript, React, Backend API) ជាមួយ Project ជាក់ស្តែងសម្រាប់ដាក់ Portfolio។",
      },
      {
        keywords: ["it", "network", "support", "computer repair", "ជួសជុល", "បណ្តាញ", "it support"],
        title_en: "IT Support & Network Fundamentals",
        title_km: "វគ្គសិក្សា IT Support & Network",
        response_en:
          "🛠️ Learn Computer Hardware, Windows/Linux OS troubleshooting, Network routing, Cabling, and Office IT Infrastructure setup.",
        response_km:
          "🛠️ វគ្គសិក្សា IT Support & Network បង្រៀនការដំឡើង-ជួសជុលកុំព្យូទ័រ ប្រព័ន្ធ Network ការចែករំលែកទិន្នន័យ និងការគ្រប់គ្រងប្រព័ន្ធ IT ក្នុងស្ថាប័ន។",
      },
    ],
    pricing: {
      response_en:
        "💬 For course tuition details, scholarship promotions, and flexible payment options, please connect directly with our official Telegram Admin @SC_Academy for personalized assistance!",
      response_km:
        "💬 សម្រាប់ព័ត៌មានលម្អិតអំពីតម្លៃវគ្គសិក្សា ការបញ្ចុះតម្លៃពិសេស និងជម្រើសបង់ប្រាក់ សូមទាក់ទងមកកាន់ Telegram Admin ផ្លូវការ @SC_Academy ដោយផ្ទាល់ដើម្បីទទួលបានការប្រឹក្សា!",
    },
    locations: {
      response_en:
        "📍 SC Academy has 2 modern campuses in Phnom Penh:\n• Campus 1: AP Plaza, Russian Federation Blvd, Phnom Penh\n• Campus 2: Main Campus 2, Phnom Penh\n📞 Contact: 086 306 615 | ✉️ info@scacademy.edu.kh",
      response_km:
        "📍 សាលា SC Academy មាន ២ សាខាទំនើបក្នុងរាជធានីភ្នំពេញ៖\n• សាខាទី ១៖ អគារ AP Plaza មហាវិថីសហព័ន្ធរុស្ស៊ី រាជធានីភ្នំពេញ\n• សាខាទី ២៖ សាខាធំទី ២ រាជធានីភ្នំពេញ\n📞 ទូរស័ព្ទ៖ 086 306 615 | ✉️ info@scacademy.edu.kh",
    },
    admission: {
      response_en:
        "📝 Enrolling is simple! You can click the Telegram button below or message our official Telegram Admin @SC_Academy directly. Our team is available every day from 8:00 AM to 7:00 PM.",
      response_km:
        "📝 ការចុះឈ្មោះងាយស្រួលបំផុត! លោកអ្នកអាចចុចប៊ូតុង Telegram ខាងក្រោម ឬឆាតផ្ទាល់ទៅកាន់ Telegram Admin @SC_Academy។ ក្រុមការងារយើងខ្ញុំបំពេញការងារជារៀងរាល់ថ្ងៃ ចាប់ពីម៉ោង ៨:០០ ព្រឹក ដល់ ៧:០០ យប់។",
    },
    certificate: {
      response_en:
        "📜 Yes! All graduating students who successfully complete course projects receive an official SC Academy Certificate of Completion, recognized by top employers in Cambodia.",
      response_km:
        "📜 បាទ/ចាស! សិស្សានុសិស្សដែលបានបញ្ចប់គម្រោងជាក់ស្តែង និងការសិក្សាដោយជោគជ័យ នឹងទទួលបានវិញ្ញាបនបត្របញ្ជាក់ការសិក្សាផ្លូវការពី SC Academy ដែលមានការទទួលស្គាល់ពីស្ថាប័ន និងក្រុមហ៊ុនជាច្រើន។",
    },
    schedule: {
      response_en:
        "📅 We offer flexible schedules: Weekday Shifts (Morning, Afternoon, Evening) and Weekend Shifts (Saturday & Sunday) with 100% hands-on computer lab training.",
      response_km:
        "📅 សាលាមានវេនសិក្សាយ៉ាងបត់បែន៖ វេនចន្ទ-សុក្រ (ព្រឹក រសៀល យប់) និងវេនចុងសប្តាហ៍ (សៅរ៍-អាទិត្យ) ជាមួយការអនុវត្តផ្ទាល់លើកុំព្យូទ័រ ១០០%។",
    },
  };

  const initialGreeting = isKhmer
    ? "សួស្តី! ខ្ញុំគឺ SC AI Assistant 🤖 ជំនួយការឆ្លាតវៃរបស់សាលា SC Academy។ តើខ្ញុំអាចជួយណែនាំវគ្គសិក្សា ឬផ្តល់ព័ត៌មានអ្វីខ្លះជូនលោកអ្នកថ្ងៃនេះ?"
    : "Hello! I am SC AI Assistant 🤖, your smart virtual advisor for SC Academy. How can I help you with course recommendations, fees, or enrollment today?";

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

  const quickPrompts = [
    {
      label_en: "🎓 Popular Courses",
      label_km: "🎓 វគ្គសិក្សាពេញនិយម",
      query: isKhmer ? "តើមានវគ្គសិក្សាអ្វីខ្លះដែលពេញនិយម?" : "What are the popular courses available?",
    },
    {
      label_en: "📍 Campus Locations",
      label_km: "📍 ទីតាំងសាខាសាលា",
      query: isKhmer ? "តើសាលា SC Academy មានទីតាំងនៅឯណាខ្លះ?" : "Where are SC Academy campuses located?",
    },
    {
      label_en: "📅 Class Schedule",
      label_km: "📅 ម៉ោង និងវេនសិក្សា",
      query: isKhmer ? "តើមានវេនសិក្សាពេលណាខ្លះ?" : "What are the class schedules?",
    },
    {
      label_en: "📝 How to Enroll",
      label_km: "📝 របៀបចុះឈ្មោះចូលរៀន",
      query: isKhmer ? "តើខ្ញុំអាចចុះឈ្មោះចូលរៀនដោយរបៀបណា?" : "How can I register for a class?",
    },
    {
      label_en: "📜 Certificates",
      label_km: "📜 វិញ្ញាបនបត្រ",
      query: isKhmer ? "តើបញ្ចប់ការសិក្សាទទួលបានវិញ្ញាបនបត្រដែរឬទេ?" : "Will I receive a certificate upon completion?",
    },
  ];

  const generateAiAnswer = (userQuery) => {
    const q = userQuery.toLowerCase().trim();

    // Check for specific courses
    for (const c of knowledgeBase.courses) {
      if (c.keywords.some((k) => q.includes(k))) {
        return isKhmer
          ? `${c.response_km}\n\n👉 លោកអ្នកអាចចុះឈ្មោះ ឬសាកសួរកាលវិភាគលម្អិតតាមរយៈ Telegram Admin របស់យើងបានភ្លាមៗ!`
          : `${c.response_en}\n\n👉 You can enroll or check class start dates directly with our Telegram Admin!`;
      }
    }

    // Check location
    if (
      q.includes("location") ||
      q.includes("campus") ||
      q.includes("address") ||
      q.includes("where") ||
      q.includes("phone") ||
      q.includes("contact") ||
      q.includes("ទីតាំង") ||
      q.includes("សាខា") ||
      q.includes("កន្លែង") ||
      q.includes("នៅឯណា") ||
      q.includes("ផ្លូវ") ||
      q.includes("ទូរស័ព្ទ")
    ) {
      return knowledgeBase.locations[isKhmer ? "response_km" : "response_en"];
    }

    // Check pricing
    if (
      q.includes("price") ||
      q.includes("fee") ||
      q.includes("cost") ||
      q.includes("discount") ||
      q.includes("scholarship") ||
      q.includes("តម្លៃ") ||
      q.includes("ថ្លៃ") ||
      q.includes("បញ្ចុះតម្លៃ") ||
      q.includes("ប្រូម៉ូសិន") ||
      q.includes("អាហារូបករណ៍")
    ) {
      return knowledgeBase.pricing[isKhmer ? "response_km" : "response_en"];
    }

    // Check admission
    if (
      q.includes("enroll") ||
      q.includes("register") ||
      q.includes("join") ||
      q.includes("apply") ||
      q.includes("ចុះឈ្មោះ") ||
      q.includes("ចូលរៀន") ||
      q.includes("ដាក់ពាក្យ")
    ) {
      return knowledgeBase.admission[isKhmer ? "response_km" : "response_en"];
    }

    // Check certificate
    if (
      q.includes("certificate") ||
      q.includes("diploma") ||
      q.includes("degree") ||
      q.includes("សញ្ញាបត្រ") ||
      q.includes("វិញ្ញាបនបត្រ")
    ) {
      return knowledgeBase.certificate[isKhmer ? "response_km" : "response_en"];
    }

    // Check schedule
    if (
      q.includes("schedule") ||
      q.includes("time") ||
      q.includes("shift") ||
      q.includes("weekend") ||
      q.includes("weekday") ||
      q.includes("morning") ||
      q.includes("evening") ||
      q.includes("ម៉ោង") ||
      q.includes("ពេល") ||
      q.includes("វេន") ||
      q.includes("ចុងសប្តាហ៍") ||
      q.includes("យប់") ||
      q.includes("ព្រឹក")
    ) {
      return knowledgeBase.schedule[isKhmer ? "response_km" : "response_en"];
    }

    // Default intelligent guidance
    return isKhmer
      ? "អរគុណសម្រាប់ការសាកសួរ! សាលា SC Academy មានបណ្តុះបណ្តាលជំនាញបច្ចេកវិទ្យាជាច្រើនដូចជា៖\n• Graphic Design & Branding\n• Video Editing & Motion\n• Advanced Microsoft Office & IT\n• Full-Stack Web Development\n• IT Support & Networking\n\nលោកអ្នកអាចជ្រើសរើសមុខវិជ្ជាណាមួយ ឬចុចប៊ូតុងខាងក្រោមដើម្បីឆាតទៅកាន់ Telegram Admin @SC_Academy ដោយផ្ទាល់បានគ្រប់ពេល!"
      : "Thank you for your question! SC Academy provides high-demand digital skills training:\n• Graphic Design & Branding\n• Video Editing & Motion Graphics\n• Advanced Microsoft Office & IT Admin\n• Full-Stack Web Development\n• IT Support & Networking\n\nFeel free to ask about any specific course, or tap the button below to connect with our Telegram Admin @SC_Academy!";
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
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openTelegramDirect = () => {
    const msg = isKhmer
      ? "សួស្តី Admin ខ្ញុំបានសាកសួរព័ត៌មានតាមរយៈ SC AI Assistant ហើយចង់ចុះឈ្មោះចូលរៀន!"
      : "Hello Admin, I inquired through SC AI Assistant and would like to enroll in a course!";
    window.open(`https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
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
            flex items-center justify-center
            w-13 h-13 sm:w-14 sm:h-14
            rounded-full
            shadow-[0_10px_30px_rgba(37,99,235,0.4)]
            transition-all duration-300 transform
            hover:scale-110 active:scale-95
            ${
              isOpen
                ? "bg-slate-900 text-white rotate-90"
                : "bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] text-white"
            }
          `}
        >
          {isOpen ? (
            <FiX size={24} />
          ) : (
            <>
              <FaRobot size={24} className="animate-bounce" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
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
            bottom-20 right-4 sm:right-6
            ${
              isExpanded
                ? "w-[94vw] sm:w-[540px] h-[82vh] max-h-[700px]"
                : "w-[92vw] sm:w-[380px] md:w-[400px] h-[520px] max-h-[78vh]"
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
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-b border-slate-800 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[#2563EB] shadow-inner">
                <FaRobot size={18} className="text-[#3B82F6]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-[13.5px] leading-none text-white">SC AI Assistant</h3>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#2563EB] text-white uppercase tracking-wider">
                    2026 AI
                  </span>
                </div>
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
                <FiTrash2 size={15} />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                title={isExpanded ? "Collapse" : "Expand"}
                className="hidden sm:block p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                {isExpanded ? <FiMinimize2 size={15} /> : <FiMaximize2 size={15} />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <FiX size={18} />
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
                  <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex-shrink-0 flex items-center justify-center text-[12px] shadow-sm mt-0.5">
                    🤖
                  </div>
                )}
                <div
                  className={`
                    max-w-[82%] px-3.5 py-2.5 rounded-2xl text-[12.5px] leading-relaxed shadow-sm
                    ${
                      m.sender === "user"
                        ? "bg-[#2563EB] text-white rounded-br-none"
                        : "bg-white dark:bg-[#1E293B] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 rounded-bl-none"
                    }
                  `}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex-shrink-0 flex items-center justify-center text-[12px]">
                  🤖
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
              <FaTelegramPlane size={13} />
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
                <FiSend size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant;
