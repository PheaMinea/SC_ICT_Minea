// Home.jsx - MODERN, MINIMAL & HIGH-PERFORMANCE HOMEPAGE FOR SC ACADEMY
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiBookOpen,
  FiAward,
  
  
  FiBriefcase,
  
  FiArrowUp,
  FiUsers,
  FiClock,
  FiChevronDown,
  FiHelpCircle,
  
  FiCode } from "react-icons/fi";

import {
  FaLaptop,
  FaCode,
  FaWifi,
  FaDesktop,
  FaShieldAlt,
  FaMousePointer,
  FaCloud,
  FaMicrochip,
  FaKeyboard,
  FaChartBar,
  FaCog,
  FaNetworkWired,
  FaCamera,
  FaServer,
  FaPalette,
  FaPlayCircle,
  FaMouse,
  FaLock,
  FaMobileAlt,
  FaChartPie,
  FaUserGraduate,
  FaLaptopCode,
  FaGlobe,
  FaBriefcase,
  FaPaintBrush,
  FaVideo,
  FaGraduationCap,
  FaAward,
  FaChalkboardTeacher,
  FaCertificate,
  FaUniversity,
  FaBrain,
  FaLightbulb,
  FaBookReader,
  FaAtom,
  FaTerminal,
  FaSchool,
  FaBook,
  FaMedal,
  FaTrophy,
  FaFlask,
  FaPencilAlt,
  FaCalculator,
  FaRobot,
  FaDatabase,
  FaProjectDiagram,
  FaUsb,
  FaHdd,
  FaSearch,
  FaTools,
  FaPenNib
} from "react-icons/fa";

import api from "../../services/api";
import Loader from "../common/Loader";
import heroVideo from "../pages/video/sc-academy.mp4";
import { useLanguage } from "../../context/LanguageContext";
import scacademy from "../pages/Scacademy.jpg";
import { getImageUrl } from "../../utils/helpers";

// =====================================================
// COUNT-UP ANIMATION (RELIABLE & SMOOTH)
// =====================================================
const CountUp = ({ end, duration = 1400, suffix = "+", prefix = "" }) => {
  const [count, setCount] = useState(end);
  const counterRef = useRef(null);
  const animationRef = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (animatedRef.current) return;

    const element = counterRef.current;
    if (!element) return;

    const startAnimate = () => {
      if (animatedRef.current) return;
      animatedRef.current = true;
      let startTime = null;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth cubic-out easing
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(end * easeOut));

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };

      setCount(0);
      animationRef.current = requestAnimationFrame(step);
    };

    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startAnimate();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(element);

      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        startAnimate();
      }

      return () => {
        observer.disconnect();
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    } else {
      startAnimate();
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [end, duration]);

  return (
    <span ref={counterRef} className="inline-block tabular-nums font-extrabold tracking-tight">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// In-memory flag: resets on browser Page Refresh (F5), persists during client-side route clicks
let hasInitiallyLoadedHome = false;

// =====================================================
// MAIN COMPONENT
// =====================================================
const Home = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [schools, setSchools] = useState([]);
  const [courses, setCourses] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preloaderDone, setPreloaderDone] = useState(() => hasInitiallyLoadedHome);
  const [activeCategory, setActiveCategory] = useState("web");
  const [activeFaq, setActiveFaq] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handlePreloaderDone = React.useCallback(() => {
    setPreloaderDone(true);
    hasInitiallyLoadedHome = true;
  }, []);

  const schoolScrollRef = useRef(null);
  const galleryScrollRef = useRef(null);
  const { language, t } = useLanguage();
  const isKhmer = language === "km";

  const tr = (key, english, khmer) => {
    const value = t(key);
    if (value && value !== key) return value;
    return isKhmer ? khmer : english;
  };

  const localized = (item, field, defaultValue = "") => {
    if (!item) return defaultValue;
    const currentKey = `${field}_${language}`;
    const englishKey = `${field}_en`;
    const khmerKey = `${field}_km`;

    if (item[currentKey] && String(item[currentKey]).trim() !== "") {
      return item[currentKey];
    }
    if (isKhmer && item[khmerKey] && String(item[khmerKey]).trim() !== "") {
      return item[khmerKey];
    }
    if (!isKhmer && item[englishKey] && String(item[englishKey]).trim() !== "") {
      return item[englishKey];
    }
    if (item[field] && String(item[field]).trim() !== "") {
      return item[field];
    }
    return defaultValue;
  };

  const getListData = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  // Direct Telegram Registration
  const openTelegramEnroll = (course) => {
    const courseTitle = localized(course, "title") || "វគ្គសិក្សា";
    const telegramUser = "SC_Academy";
    const message = encodeURIComponent(
      `សួស្តី Admin ខ្ញុំចង់ចុះឈ្មោះចូលរៀនវគ្គ៖ "${courseTitle}" នៅ SC Academy`
    );
    window.open(`https://t.me/${telegramUser}?text=${message}`, "_blank");
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [schoolsRes, coursesRes, galleryRes] = await Promise.allSettled([
          api.get("/api/schools/").catch(() => api.get("/schools/")),
          api.get("/api/courses/").catch(() => api.get("/courses/")),
          api.get("/api/gallery/").catch(() => api.get("/galleries/")),
        ]);

        if (schoolsRes.status === "fulfilled") {
          setSchools(getListData(schoolsRes.value.data));
        }
        if (coursesRes.status === "fulfilled") {
          const apiCourses = getListData(coursesRes.value.data);
          setCourses(apiCourses);
        } else {
          setCourses([]);
        }
        if (galleryRes.status === "fulfilled") {
          setGalleryImages(getListData(galleryRes.value.data));
        } else {
          setGalleryImages([]);
        }
      } catch (err) {
        console.error("Error fetching homepage data:", err);
        setCourses([]);
        setGalleryImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    if (activeCategory === "all") return courses;
    return courses.filter((course) => {
      const cat = (course.category || course.level || course.title || "").toLowerCase();
      return cat.includes(activeCategory);
    });
  }, [courses, activeCategory]);

  const scrollSchools = (direction) => {
    const container = schoolScrollRef.current;
    if (!container) return;
    const cardWidth = 300;
    container.scrollBy({
      left: direction === "next" ? cardWidth + 20 : -(cardWidth + 20),
      behavior: "smooth" });
  };

  const scrollGallery = (direction) => {
    const container = galleryScrollRef.current;
    if (!container) return;
    const cardWidth = 300;
    container.scrollBy({
      left: direction === "next" ? cardWidth + 24 : -(cardWidth + 24),
      behavior: "smooth" });
  };

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Structured Roadmaps
  const careerPathways = [
    {
      title: tr("home.pathWeb", "Web & Software Developer", "អ្នកអភិវឌ្ឍន៍វេបសាយ និងសូហ្វវែរ"),
      subtitle: tr("home.pathWebSub", "From Basics to Full-Stack Development", "ពីកម្រិតដំបូងដល់អ្នកបង្កើតវេបសាយអាជីព"),
      icon: FaCode,
      steps: [
        tr("home.p1Step1", "HTML5, CSS3 & Responsive Design", "HTML5, CSS3 និងការរចនា Responsive"),
        tr("home.p1Step2", "Modern JavaScript & ES6+", "JavaScript ទំនើប និង Programming Logic"),
        tr("home.p1Step3", "React.js & Frontend Architecture", "React.js & Frontend Development"),
        tr("home.p1Step4", "REST API & Database Integration", "ការភ្ជាប់ API និង Database"),
      ],
      badge: tr("home.badgeInDemand", "High Demand", "តម្រូវការទីផ្សារខ្ពស់") },
    {
      title: tr("home.pathDesign", "Graphic & Media Creative", "អ្នករចនាក្រាហ្វិក និងមេឌា"),
      subtitle: tr("home.pathDesignSub", "Branding, Visuals & Video Production", "ការបង្កើតស្លាកសញ្ញា និងផលិតវីដេអូ"),
      icon: FaPaintBrush,
      steps: [
        tr("home.p2Step1", "Graphic Design & Typography Principles", "ទ្រឹស្តីពណ៌ និងគោលការណ៍រចនា"),
        tr("home.p2Step2", "Adobe Photoshop for Photo Retouching", "Adobe Photoshop កាត់តរូបភាពកម្រិតខ្ពស់"),
        tr("home.p2Step3", "Adobe Illustrator for Branding & Logos", "Adobe Illustrator គូរ Logo & Vector"),
        tr("home.p2Step4", "Premiere Pro & Video Storytelling", "Premiere Pro កាត់តវីដេអូពាណិជ្ជកម្ម"),
      ],
      badge: tr("home.badgeCreative", "Creative Career", "អាជីពច្នៃប្រឌិត") },
    {
      title: tr("home.pathNetwork", "Network & IT Support Specialist", "អ្នកគ្រប់គ្រងបណ្តាញ និងជំនួយ IT"),
      subtitle: tr("home.pathNetworkSub", "Infrastructure, Systems & Security", "ប្រព័ន្ធកុំព្យូទ័រ និងបណ្តាញសុវត្ថិភាព"),
      icon: FaNetworkWired,
      steps: [
        tr("home.p3Step1", "Computer Hardware & OS Troubleshooting", "ជួសជុល Hardware & Windows/Linux"),
        tr("home.p3Step2", "LAN/WAN, IP Routing & Subnetting", "ការរៀបចំបណ្តាញ និង IP Routing"),
        tr("home.p3Step3", "MikroTik & Cisco Switch Configuration", "កំណត់រចនាសម្ព័ន្ធ Router & Switch"),
        tr("home.p3Step4", "Network Security & Server Admin", "សុវត្ថិភាពបណ្តាញ និងគ្រប់គ្រង Server"),
      ],
      badge: tr("home.badgeEssential", "Essential IT", "ជំនាញស្នូល IT") },
  ];

  // Why Choose Us Pillars
  const features = [
    {
      icon: FiCode,
      title: tr("home.f1Title", "Hands-On Practical Labs", "ការអនុវត្តជាក់ស្ដែង 80%"),
      desc: tr(
        "home.f1Desc",
        "Spend 80% of class time coding, designing, and troubleshooting real hardware setups with dedicated instructor guidance.",
        "ចំណាយពេល 80% នៃការសិក្សាអនុវត្តគម្រោងផ្ទាល់លើកុំព្យូទ័រ និងឧបករណ៍ Network ពិតប្រាកដជាមួយលោកគ្រូអ្នកគ្រូជំនាញ។"
      ) },
    {
      icon: FiAward,
      title: tr("home.f2Title", "Recognized Certification", "វិញ្ញាបនបត្របញ្ជាក់ការសិក្សា"),
      desc: tr(
        "home.f2Desc",
        "Graduate with an accredited certificate and a verified digital portfolio to demonstrate your skills to top employers.",
        "ទទួលបានវិញ្ញាបនបត្រផ្លូវការដែលទទួលស្គាល់ដោយដៃគូឧស្សាហកម្ម និងមាន Portfolio ផ្ទាល់ខ្លួនសម្រាប់ដាក់ពាក្យធ្វើការ។"
      ) },
    {
      icon: FiBriefcase,
      title: tr("home.f3Title", "Career Mentorship & Placement", "ឱកាសការងារ"),
      desc: tr(
        "home.f3Desc",
        "Direct resume reviews, mock interviews, and priority recommendations to hiring partner companies across Cambodia.",
        "ជួយរៀបចំប្រវត្តិរូប (CV/Portfolio), សម្ភាសន៍សាកល្បង និងណែនាំឱកាសការងារជាមួយបណ្តាញក្រុមហ៊ុនដៃគូ។"
      ) },
  ];

  // FAQ Data
  const faqs = [
    {
      q: tr("faq.q1", "Do I receive an official certificate after completing a course?", "តើបញ្ចប់ការសិក្សាទទួលបានវិញ្ញាបនបត្រផ្លូវការដែរឬទេ?"),
      a: tr("faq.a1", "Yes, upon successfully completing the course requirements, project assignments, and final assessment, SC Academy awards an accredited Certificate of Completion recognized across industry partners.", "បាទ/ចាស! ក្រោយពីបញ្ចប់ការសិក្សា ការអនុវត្ត Project ជាក់ស្ដែង និងការប្រឡងបញ្ចប់វគ្គ សិស្សនឹងទទួលបានវិញ្ញាបនបត្របញ្ជាក់ការសិក្សាផ្លូវការពី SC Academy ដែលត្រូវបានទទួលស្គាល់ដោយស្ថាប័ន និងក្រុមហ៊ុនដៃគូ។") },
    {
      q: tr("faq.q2", "Are there flexible evening and weekend class schedules for working professionals?", "តើមានថ្នាក់សិក្សាវេនយប់ ឬចុងសប្តាហ៍សម្រាប់អ្នកធ្វើការដែរឬទេ?"),
      a: tr("faq.a2", "Yes, we offer morning, afternoon, evening (5:30 PM - 8:30 PM), and weekend (Saturday-Sunday) classes tailored specifically for university students and working professionals.", "បាទ/ចាស! SC Academy មានថ្នាក់សិក្សាពេលព្រឹក ពេលរសៀល ពេលល្ងាច (៥:៣០ ដល់ ៨:៣០ យប់) និងថ្នាក់ចុងសប្តាហ៍ (សៅរ៍-អាទិត្យ) ដែលសមស្របបំផុតសម្រាប់និស្សិត និងអ្នកកំពុងបំពេញការងារ។") },
    {
      q: tr("faq.q3", "Does SC Academy provide job placement or internship support?", "តើមានការជួយសម្របសម្រួលស្វែងរកការងារ ឬចុះកម្មសិក្សាដែរឬទេ?"),
      a: tr("faq.a3", "Yes, our Career & Alumni Support team assists outstanding students with portfolio reviews, resume building, mock interviews, and connects graduates with our network of hiring partners for internship and job opportunities.", "បាទ/ចាស! ក្រុមការងារ Career Support របស់សាលានឹងជួយណែនាំការរៀបចំ CV/Portfolio, សម្ភាសន៍សាកល្បង និងបញ្ជូនបេក្ខជនឆ្នើមទៅកាន់បណ្តាញក្រុមហ៊ុនដៃគូដើម្បីចុះកម្មសិក្សា ឬទទួលបានឱកាសការងារភ្លាមៗ។") },
    {
      q: tr("faq.q4", "What payment methods are supported for course registration?", "តើអាចបង់ថ្លៃសិក្សាតាមមធ្យោបាយណាខ្លះ?"),
      a: tr("faq.a4", "We accept payments via Bakong KHQR (ABA Bank, Acleda, Wing, Canadia, etc.), bank transfers, and direct cash payments at our campus admission office. Installment payment options are also available for selected long-term programs.", "លោកអ្នកអាចបង់ថ្លៃសិក្សាតាមរយៈ Bakong KHQR (ABA Bank, ACLEDA, Wing, Canadia), ផ្ទេរប្រាក់តាមគណនីធនាគារ ឬបង់ផ្ទាល់នៅការិយាល័យចុះឈ្មោះ។ សម្រាប់វគ្គវែង សិស្សក៏អាចជ្រើសរើសការបង់រំលស់ជាដំណាក់កាលបានផងដែរ។") },
    {
      q: tr("faq.q5", "Can beginners with no computer background join the programs?", "តើអ្នកដែលមិនធ្លាប់មានមូលដ្ឋានគ្រឹះពីមុនមក អាចរៀនបានដែរឬទេ?"),
      a: tr("faq.a5", "Absolutely! All our foundational courses are structured step-by-step from zero basics, supported by dedicated instructors and hands-on lab exercises to ensure every student can follow and build real practical skills.", "ពិតជាបាន! គ្រប់វគ្គសិក្សាត្រូវបានរៀបចំឡើងជាជំហានៗចាប់ពីកម្រិតសូន្យឡើងទៅ ដោយមានលោកគ្រូអ្នកគ្រូណែនាំផ្ទាល់ និងការអនុវត្តជាក់ស្តែងក្នុងបន្ទប់ Lab ដើម្បីធានាថាសិស្សគ្រប់រូបអាចចាប់បានយ៉ាងឆាប់រហ័ស។") },
  ];

  return (
    <>
      {!preloaderDone && (
        <Loader onComplete={handlePreloaderDone} />
      )}

      <Helmet>
        <title>
          {tr("home.seoTitle", "SC Academy | Modern IT & Digital Skills Training", "SC Academy | បណ្តុះបណ្តាលជំនាញបច្ចេកវិទ្យា និងឌីជីថល")}
        </title>
        <meta name="description" content="SC Academy - Future-ready IT and digital skills education in Cambodia." />
      </Helmet>

      <section className="relative w-full min-h-[480px] sm:min-h-[580px] md:min-h-[650px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-slate-950">
        {/* HTML5 Background Video (Bright, Clear & Vibrant) */}
        <video
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          poster={scacademy}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Subtle Bottom Fade Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/15 z-[1]" />

        {/* Sound Toggle */}
        <button
          type="button"
          onClick={() => setIsMuted((prev) => !prev)}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          className="absolute right-4 bottom-4 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/20 bg-slate-900/60 text-white backdrop-blur-md transition-all duration-300 hover:bg-[#2563EB] hover:scale-105 active:scale-95 shadow-lg"
        >
          {isMuted ? <i className="fa-solid fa-volume-xmark" /> : <i className="fa-solid fa-volume-high" />}
        </button>
      </section>

      {/* ====================================================================
          FULL-PAGE CONTINUOUS DOT GRID MATRIX PATTERN (ENTIRE HOMEPAGE)
      ===================================================================== */}
      <div className="relative w-full bg-dot-matrix-page overflow-hidden">
        {/* Floating Technology Ambient Decorative Background Icons */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none opacity-30 dark:opacity-25">
          {/* Section 1: Top Area */}
          <div className="absolute top-[5%] left-[5%] text-[#2563EB]/14 dark:text-blue-400/18 animate-float-slow">
            <FaLaptop className="w-8 h-8 sm:w-10 sm:h-10 transform -rotate-12" />
          </div>
          <div className="absolute top-[8%] right-[10%] text-[#6366F1]/12 dark:text-indigo-400/16 animate-float-delayed">
            <FaCode className="w-6 h-6 sm:w-8 sm:h-8 transform rotate-6" />
          </div>
          <div className="absolute top-[12%] left-[30%] text-[#10B981]/12 dark:text-emerald-400/16 animate-float-fast">
            <FaWifi className="w-5 h-5 sm:w-7 sm:h-7 transform -rotate-6" />
          </div>
          <div className="absolute top-[18%] right-[25%] text-[#38BDF8]/14 dark:text-cyan-400/18 animate-float-reverse">
            <FaDesktop className="w-8 h-8 sm:w-10 sm:h-10 transform rotate-12" />
          </div>
          <div className="absolute top-[15%] left-[45%] text-[#F59E0B]/12 dark:text-amber-400/16 animate-float-slow">
            <FaUsb className="w-6 h-6 sm:w-8 sm:h-8 transform rotate-45" />
          </div>
          <div className="absolute top-[6%] right-[35%] text-[#8B5CF6]/12 dark:text-purple-400/16 animate-float-delayed">
            <FaHdd className="w-5 h-5 sm:w-7 sm:h-7 transform -rotate-15" />
          </div>

          {/* Section 2: Upper Mid */}
          <div className="absolute top-[25%] left-[10%] text-[#8B5CF6]/12 dark:text-purple-400/16 animate-float-slow">
            <FaShieldAlt className="w-6 h-6 sm:w-8 sm:h-8 transform -rotate-15" />
          </div>
          <div className="absolute top-[32%] right-[5%] text-[#F59E0B]/12 dark:text-amber-400/16 animate-float-delayed">
            <FaMousePointer className="w-5 h-5 sm:w-7 sm:h-7 transform rotate-12" />
          </div>
          <div className="absolute top-[38%] left-[40%] text-[#2563EB]/14 dark:text-blue-400/18 animate-float-fast">
            <FaCloud className="w-7 h-7 sm:w-9 sm:h-9 transform rotate-6" />
          </div>
          <div className="absolute top-[45%] right-[18%] text-[#EC4899]/12 dark:text-pink-400/16 animate-float-reverse">
            <FaMicrochip className="w-5 h-5 sm:w-6 sm:h-6 transform -rotate-45" />
          </div>
          <div className="absolute top-[28%] left-[25%] text-[#38BDF8]/12 dark:text-cyan-400/16 animate-float-slow">
            <FaSearch className="w-6 h-6 sm:w-8 sm:h-8 transform rotate-12" />
          </div>
          <div className="absolute top-[22%] right-[18%] text-[#10B981]/12 dark:text-emerald-400/16 animate-float-fast">
            <FaDatabase className="w-5 h-5 sm:w-7 sm:h-7 transform -rotate-6" />
          </div>

          {/* Section 3: Center Mid */}
          <div className="absolute top-[50%] left-[8%] text-[#10B981]/12 dark:text-emerald-400/16 animate-float-slow">
            <FaKeyboard className="w-6 h-6 sm:w-8 sm:h-8 transform -rotate-6" />
          </div>
          <div className="absolute top-[55%] right-[30%] text-[#F59E0B]/14 dark:text-amber-400/18 animate-float-delayed">
            <FaChartBar className="w-7 h-7 sm:w-9 sm:h-9 transform rotate-12" />
          </div>
          <div className="absolute top-[62%] left-[25%] text-[#8B5CF6]/12 dark:text-purple-400/16 animate-float-fast">
            <FaCog className="w-6 h-6 sm:w-8 sm:h-8 transform rotate-45" />
          </div>
          <div className="absolute top-[68%] right-[8%] text-[#38BDF8]/12 dark:text-cyan-400/16 animate-float-reverse">
            <FaNetworkWired className="w-5 h-5 sm:w-7 sm:h-7 transform -rotate-12" />
          </div>
          <div className="absolute top-[48%] left-[35%] text-[#6366F1]/12 dark:text-indigo-400/16 animate-float-delayed">
            <FaRobot className="w-6 h-6 sm:w-8 sm:h-8 transform rotate-6" />
          </div>
          <div className="absolute top-[60%] right-[15%] text-[#2563EB]/14 dark:text-blue-400/18 animate-float-slow">
            <FaGlobe className="w-7 h-7 sm:w-9 sm:h-9 transform -rotate-15" />
          </div>

          {/* Section 4: Lower Mid */}
          <div className="absolute top-[72%] left-[15%] text-[#EC4899]/12 dark:text-pink-400/16 animate-float-slow">
            <FaCamera className="w-6 h-6 sm:w-8 sm:h-8 transform rotate-6" />
          </div>
          <div className="absolute top-[78%] right-[22%] text-[#10B981]/12 dark:text-emerald-400/16 animate-float-delayed">
            <FaServer className="w-5 h-5 sm:w-7 sm:h-7 transform rotate-6" />
          </div>
          <div className="absolute top-[82%] left-[35%] text-[#38BDF8]/14 dark:text-cyan-400/18 animate-float-fast">
            <FaPalette className="w-7 h-7 sm:w-9 sm:h-9 transform rotate-12" />
          </div>
          <div className="absolute top-[85%] right-[5%] text-[#F59E0B]/12 dark:text-amber-400/16 animate-float-reverse">
            <FaPlayCircle className="w-5 h-5 sm:w-7 sm:h-7 transform -rotate-6" />
          </div>
          <div className="absolute top-[70%] right-[40%] text-[#8B5CF6]/12 dark:text-purple-400/16 animate-float-fast">
            <FaTerminal className="w-6 h-6 sm:w-8 sm:h-8 transform rotate-45" />
          </div>
          <div className="absolute top-[76%] left-[50%] text-[#38BDF8]/12 dark:text-cyan-400/16 animate-float-reverse">
            <FaProjectDiagram className="w-5 h-5 sm:w-7 sm:h-7 transform -rotate-12" />
          </div>

          {/* Section 5: Bottom Area */}
          <div className="absolute top-[92%] left-[5%] text-[#6366F1]/12 dark:text-indigo-400/16 animate-float-slow">
            <FaMouse className="w-5 h-5 sm:w-7 sm:h-7 transform rotate-12" />
          </div>
          <div className="absolute top-[95%] right-[35%] text-[#2563EB]/14 dark:text-blue-400/18 animate-float-delayed">
            <FaLock className="w-6 h-6 sm:w-8 sm:h-8 transform -rotate-12" />
          </div>
          <div className="absolute top-[97%] left-[18%] text-[#3B82F6]/14 dark:text-blue-400/18 animate-float-fast">
            <FaMobileAlt className="w-7 h-7 sm:w-9 sm:h-9 transform rotate-8" />
          </div>
          <div className="absolute top-[98%] right-[12%] text-[#10B981]/12 dark:text-emerald-400/16 animate-float-reverse">
            <FaChartPie className="w-5 h-5 sm:w-7 sm:h-7 transform -rotate-6" />
          </div>
          <div className="absolute top-[88%] left-[28%] text-[#EC4899]/12 dark:text-pink-400/16 animate-float-slow">
            <FaTools className="w-6 h-6 sm:w-8 sm:h-8 transform rotate-15" />
          </div>
          <div className="absolute top-[93%] right-[22%] text-[#F59E0B]/12 dark:text-amber-400/16 animate-float-delayed">
            <FaPenNib className="w-5 h-5 sm:w-7 sm:h-7 transform -rotate-45" />
          </div>
        </div>
        {/* ====================================================================
            2. FLOATING STATS SECTION (4 KEY METRICS - FROSTED GLASS OVERLAP)
        ===================================================================== */}
        <section className="relative mt-8 sm:mt-12 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-reveal">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-white/50 dark:bg-[#0F172A]/50 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/80 dark:border-white/10 shadow-[0_15px_35px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]">
          {/* STAT 1: GRADUATED STUDENTS */}
          <div className="text-center p-3 flex flex-col items-center group">
            <div className="w-11 h-11 mb-3 rounded-xl bg-blue-500/10 border border-blue-500/15 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110">
              <i className="fa-solid fa-user-graduate text-lg text-[#2563EB] dark:text-blue-400" />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#2563EB] dark:text-blue-400 tabular-nums">
              500+
            </div>
            <p className={`text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1 transition-colors group-hover:text-[#2563EB] ${isKhmer ? "font-khmer" : ""}`}>
              {tr("home.graduatesStat", "Graduated Students", "សិស្សានុសិស្សបញ្ចប់ការសិក្សា")}
            </p>
          </div>

          {/* STAT 2: PRACTICAL LAB FOCUS */}
          <div className="text-center p-3 border-l border-slate-100 dark:border-slate-800 flex flex-col items-center group">
            <div className="w-11 h-11 mb-3 rounded-xl bg-blue-500/10 border border-blue-500/15 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110">
              <i className="fa-solid fa-laptop-code text-lg text-[#2563EB] dark:text-blue-400" />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#2563EB] dark:text-blue-400 tabular-nums">
              80%
            </div>
            <p className={`text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1 transition-colors group-hover:text-[#2563EB] ${isKhmer ? "font-khmer" : ""}`}>
              {tr("home.labFocusStat", "Practical Lab Focus", "ការអនុវត្ត Lab ជាក់ស្ដែង")}
            </p>
          </div>

          {/* STAT 3: ACCREDITED PROGRAMS */}
          <div className="text-center p-3 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 flex flex-col items-center group">
            <div className="w-11 h-11 mb-3 rounded-xl bg-blue-500/10 border border-blue-500/15 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110">
              <i className="fa-solid fa-book-open text-lg text-amber-500" />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold tracking-tight text-amber-500 dark:text-amber-400 tabular-nums">
              10+
            </div>
            <p className={`text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1 transition-colors group-hover:text-[#2563EB] ${isKhmer ? "font-khmer" : ""}`}>
              {tr("home.coursesStat", "Accredited Programs", "កម្មវិធីសិក្សាមានការទទួលស្គាល់")}
            </p>
          </div>

          {/* STAT 4: JOB PLACEMENT */}
          <div className="text-center p-3 border-t sm:border-t-0 border-l border-slate-100 dark:border-slate-800 flex flex-col items-center group">
            <div className="w-11 h-11 mb-3 rounded-xl bg-blue-500/10 border border-blue-500/15 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110">
              <i className="fa-solid fa-briefcase text-lg text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold tracking-tight text-emerald-500 dark:text-emerald-400 tabular-nums">
              100%
            </div>
            <p className={`text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1 transition-colors group-hover:text-[#2563EB] ${isKhmer ? "font-khmer" : ""}`}>
              {tr("home.placementStat", "Job Placement Support", "ការគាំទ្រឱកាសការងារ")}
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. SKILLS TICKER / MARQUEE BAR (INFINITE SEAMLESS LOOP - CLEAR & VIVID)
      ===================================================================== */}
      <section className="relative z-10 overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-y border-slate-200/80 dark:border-slate-800/80 mt-12 py-4 select-none shadow-xs">
        <div className="course-marquee">
          <div className="course-marquee-track py-1">
            {[
              { icon: FaBriefcase, label_en: "Advanced Microsoft Office", label_km: "កុំព្យូទ័ររដ្ឋបាលកម្រិតខ្ពស់" },
              { icon: FaPaintBrush, label_en: "Graphic Design & Branding", label_km: "រចនាក្រាហ្វិក & Branding" },
              { icon: FaVideo, label_en: "Video Editing & Motion Graphics", label_km: "កាត់តវីដេអូ & Motion Graphics" },
              { icon: FaCode, label_en: "React.js & Web Frontend", label_km: "បង្កើត Website & Web App" },
              { icon: FaGlobe, label_en: "Full-Stack Web Development", label_km: "Full-Stack Web Development" },
              { icon: FaNetworkWired, label_en: "Network & IT Support", label_km: "គ្រប់គ្រងបណ្តាញ Network & IT" },
              { icon: FaCode, label_en: "Python & Databases", label_km: "Python & ប្រព័ន្ធទិន្នន័យ Database" },
              { icon: FaPaintBrush, label_en: "UI/UX Design Masterclass", label_km: "រចនា UI/UX App & Web" },
              { icon: FaBriefcase, label_en: "Advanced Microsoft Office", label_km: "កុំព្យូទ័ររដ្ឋបាលកម្រិតខ្ពស់" },
              { icon: FaPaintBrush, label_en: "Graphic Design & Branding", label_km: "រចនាក្រាហ្វិក & Branding" },
              { icon: FaVideo, label_en: "Video Editing & Motion Graphics", label_km: "កាត់តវីដេអូ & Motion Graphics" },
              { icon: FaCode, label_en: "React.js & Web Frontend", label_km: "បង្កើត Website & Web App" },
              { icon: FaGlobe, label_en: "Full-Stack Web Development", label_km: "Full-Stack Web Development" },
              { icon: FaNetworkWired, label_en: "Network & IT Support", label_km: "គ្រប់គ្រងបណ្តាញ Network & IT" },
              { icon: FaCode, label_en: "Python & Databases", label_km: "Python & ប្រព័ន្ធទិន្នន័យ Database" },
              { icon: FaPaintBrush, label_en: "UI/UX Design Masterclass", label_km: "រចនា UI/UX App & Web" },
            ].map((item, idx) => {
              const Icon = item.icon;
              const title = isKhmer ? item.label_km : item.label_en;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3.5 mx-2.5 px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-800/95 border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-[#2563EB]/40 text-sm sm:text-base font-extrabold text-slate-900 dark:text-white whitespace-nowrap group cursor-default tracking-wide transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-2xs border border-blue-500/20">
                    <Icon className="text-base sm:text-lg" />
                  </div>
                  <span className={`transition-colors duration-200 group-hover:text-[#2563EB] ${isKhmer ? "font-khmer font-bold" : ""}`}>{title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. FEATURED TOP 4 POPULAR COURSES (ONLY IF COURSES EXIST IN DB)
      ===================================================================== */}
      {courses.length > 0 && (
        <section id="courses" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 scroll-reveal-text">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[#2563EB] text-xs font-bold uppercase tracking-widest mb-1.5">
                {tr("home.coursesBadge", "TOP POPULAR COURSES", "វគ្គសិក្សាពេញនិយមបំផុត")}
              </span>
              <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 ${isKhmer ? "font-khmer" : ""}`}>
                {isKhmer ? (
                  <>
                    វគ្គសិក្សា <span className="animated-gradient-text">ពេញនិយមបំផុត</span>
                  </>
                ) : (
                  <>
                    Top In-Demand <span className="animated-gradient-text">Career Programs</span>
                  </>
                )}
              </h2>
              <p className={`text-xs sm:text-sm text-slate-500 mt-2 ${isKhmer ? "font-khmer" : ""}`}>
                {tr(
                  "home.coursesSubtitle",
                  "Curated practical training programs with the highest job placement rate.",
                  "កម្មវិធីបណ្តុះបណ្តាលជំនាញជាក់ស្ដែងដែលមានអត្រាឱកាសការងារខ្ពស់បំផុត។"
                )}
              </p>
            </div>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] whitespace-nowrap"
            >
              <span>{tr("home.viewAllCourses", "View All Courses", "មើលវគ្គសិក្សាទាំងអស់")}</span>
              <FiArrowRight size={14} />
            </Link>
          </div>

          {/* Course Cards Grid with Staggered Scroll Animation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {courses.slice(0, 4).map((course, idx) => {
              const courseTitle = localized(course, "title") || "Course Title";
              const courseDesc = localized(course, "description") || "Practical step-by-step training.";
              const courseImage = course.image || course.image_url;

              return (
                <article
                  key={course.id}
                  className={`card-lift bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col group shadow-sm hover:border-slate-300 scroll-reveal stagger-${idx + 1}`}
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={getImageUrl(courseImage)}
                      alt={courseTitle}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-[#2563EB] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {localized(course, "level") || "Course"}
                    </span>
                  </div>

                  <div className={`p-5 flex-1 flex flex-col ${isKhmer ? "font-khmer" : ""}`}>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2.5">
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3 h-3 text-slate-400" />
                        {localized(course, "duration") || "8 Weeks"}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiUsers className="w-3 h-3 text-slate-400" />
                        {localized(course, "level") || "All Levels"}
                      </span>
                    </div>

                    <Link to={`/courses/${course.id}`}>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors line-clamp-1">
                        {courseTitle}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {courseDesc}
                    </p>

                    <div className="flex-grow" />

                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2.5">
                      <button
                        type="button"
                        onClick={() => openTelegramEnroll(course)}
                        className="flex-1 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                      >
                        {tr("courses.enroll", "Enroll Now", "ចុះឈ្មោះ")}
                      </button>
                      <Link
                        to={`/courses/${course.id}`}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-all"
                      >
                        {tr("common.details", "Details", "លម្អិត")}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* View All Courses in Catalog Button */}
          <div className="mt-10 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-100 hover:bg-[#2563EB] hover:text-white text-slate-700 text-xs font-bold transition-all duration-200 shadow-sm"
            >
              <span>{tr("home.viewAllCourses", "View Full Course Catalog", "មើលតារាងវគ្គសិក្សាទាំងអស់")}</span>
              <FiArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* ====================================================================
          5. WHY CHOOSE US / FEATURES (CLEAN 3-COLUMN)
      ===================================================================== */}
      <section id="why-us" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 scroll-reveal-text">
            <span className="inline-flex items-center gap-1.5 text-[#2563EB] text-xs font-bold uppercase tracking-widest mb-1.5">
              {tr("home.whyChooseLabel", "Why Choose SC Academy", "ហេតុអ្វីជ្រើសរើស SC Academy")}
            </span>
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 ${isKhmer ? "font-khmer" : ""}`}>
              {isKhmer ? (
                <>
                  បណ្តុះបណ្តាលជំនាញពិត សម្រាប់ <span className="animated-gradient-text">ភាពជោគជ័យជាក់ស្ដែង</span>
                </>
              ) : (
                <>
                  Built For <span className="animated-gradient-text">Real-World Success</span>
                </>
              )}
            </h2>
            <p className={`text-sm text-slate-600 mt-3 leading-relaxed ${isKhmer ? "font-khmer" : ""}`}>
              {tr(
                "home.whyChooseDesc",
                "We focus on what companies look for: real skills, verified portfolio projects, and direct mentor feedback.",
                "យើងផ្តល់ជូននូវជំនាញដែលទីផ្សារការងារកំពុងត្រូវការ តាមរយៈការអនុវត្តផ្ទាល់ ការធ្វើគម្រោងជាក់ស្តែង និងការណែនាំពីសាស្ត្រាចារ្យមានបទពិសោធន៍។"
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className={`bg-white dark:bg-[#0F172A] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 card-lift scroll-reveal stagger-${idx + 1} group hover:border-[#2563EB]/40 shadow-sm`}>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-white">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className={`text-lg font-bold text-slate-900 mb-2 transition-colors duration-200 group-hover:text-[#2563EB] ${isKhmer ? "font-khmer" : ""}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm text-slate-600 leading-relaxed ${isKhmer ? "font-khmer" : ""}`}>
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. STRUCTURED CAREER ROADMAPS
      ===================================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 scroll-reveal-text">
          <span className="inline-flex items-center gap-1.5 text-[#2563EB] text-xs font-bold uppercase tracking-widest mb-1.5">
            {tr("home.careerPathsBadge", "Structured Roadmaps", "ជម្រើសជំនាញសិក្សា")}
          </span>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 ${isKhmer ? "font-khmer" : ""}`}>
            {isKhmer ? (
              <>
                ជ្រើសរើសជំនាញដែលស័ក្តិសម <span className="animated-gradient-text">ឆ្ពោះទៅកាន់ភាពជោគជ័យ</span>
              </>
            ) : (
              <>
                Choose Your <span className="animated-gradient-text">Career Learning Path</span>
              </>
            )}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {careerPathways.map((path, idx) => {
            const Icon = path.icon;
            return (
              <div
                key={idx}
                className={`card-lift bg-white dark:bg-[#0F172A] rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between scroll-reveal stagger-${idx + 1} group hover:border-[#2563EB]/40`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Icon size={20} />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 transition-colors group-hover:bg-blue-50 group-hover:text-[#2563EB]">
                      {path.badge}
                    </span>
                  </div>

                  <h3 className={`text-lg font-bold text-slate-900 mb-1 transition-colors group-hover:text-[#2563EB] ${isKhmer ? "font-khmer" : ""}`}>
                    {path.title}
                  </h3>
                  <p className={`text-xs text-slate-500 mb-5 ${isKhmer ? "font-khmer" : ""}`}>
                    {path.subtitle}
                  </p>

                  <div className="space-y-2.5 mb-6">
                    {path.steps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span className={`leading-relaxed ${isKhmer ? "font-khmer" : ""}`}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/courses"
                  className="w-full flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-[#2563EB] hover:text-white text-slate-800 text-xs font-bold transition-all duration-200"
                >
                  <span>{tr("home.viewPathCourses", "Explore This Pathway", "ស្វែងយល់ពីវគ្គនេះ")}</span>
                  <FiArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ====================================================================
          7. OUR SCHOOLS / CAMPUSES
      ===================================================================== */}
      {schools.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12 scroll-reveal-text">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[#2563EB] text-xs font-bold uppercase tracking-widest mb-1.5">
                  {tr("home.discoverSchools", "Learning Network", "សហគមន៍សិក្សា")}
                </span>
                <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 ${isKhmer ? "font-khmer" : ""}`}>
                  {isKhmer ? (
                    <>
                      សាលារបស់យើង & <span className="animated-gradient-text">បរិវេណសិក្សាទំនើប</span>
                    </>
                  ) : (
                    <>
                      Our Campuses & <span className="animated-gradient-text">Modern Learning Spaces</span>
                    </>
                  )}
                </h2>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollSchools("prev")}
                  aria-label="Previous"
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-slate-300 flex items-center justify-center text-slate-700 transition-colors shadow-sm"
                >
                  <FiChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollSchools("next")}
                  aria-label="Next"
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-slate-300 flex items-center justify-center text-slate-700 transition-colors shadow-sm"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>

            <div ref={schoolScrollRef} className="flex gap-6 overflow-x-auto py-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {schools.map((school, sIdx) => (
                <article
                  key={school.id}
                  className={`card-lift flex-none w-[280px] sm:w-[320px] bg-white rounded-2xl overflow-hidden border border-slate-200 scroll-reveal stagger-${(sIdx % 4) + 1}`}
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={getImageUrl(school.image || school.image_url, "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80")}
                      alt={localized(school, "name", "SC Academy")}
                      className="w-full h-full object-cover"
                    />
                    {school.acronym && (
                      <span className="absolute top-3 right-3 bg-white/95 text-[#2563EB] text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                        {school.acronym}
                      </span>
                    )}
                  </div>
                  <div className={`p-5 ${isKhmer ? "font-khmer" : ""}`}>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5 line-clamp-1">
                      {localized(school, "name", "SC Academy")}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {localized(school, "description") || "Quality education campus"}
                    </p>
                    <Link
                      to="/school"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8]"
                    >
                      <span>{tr("common.exploreMore", "Explore More", "ស្វែងយល់បន្ថែម")}</span>
                      <FiArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          8. CAMPUS LIFE / GALLERY (ONLY IF IMAGES EXIST IN DB)
      ===================================================================== */}
      {galleryImages.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 scroll-reveal-text">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[#2563EB] text-xs font-bold uppercase tracking-widest mb-1.5">
                {tr("home.campusMoments", "Campus Moments", "ទិដ្ឋភាពក្នុងសាលា")}
              </span>
              <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 ${isKhmer ? "font-khmer" : ""}`}>
                {isKhmer ? (
                  <>
                    ជីវិតនៅ SC Academy & <span className="animated-gradient-text">ស្នាដៃសិស្សានុសិស្ស</span>
                  </>
                ) : (
                  <>
                    Campus Life & <span className="animated-gradient-text">Student Activities</span>
                  </>
                )}
              </h2>
            </div>

            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] whitespace-nowrap"
            >
              <span>{tr("home.viewAllGallery", "View All Photos", "មើលរូបភាពទាំងអស់")}</span>
              <FiArrowRight size={14} />
            </Link>
          </div>

          {/* Asymmetric 2x2 Bento Photo Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
            {galleryImages.slice(0, 4).map((imgItem, gIdx) => {
              const isWide = gIdx === 0 || gIdx === 3;
              return (
                <div
                  key={imgItem.id || gIdx}
                  className={`${isWide ? "lg:col-span-2" : "lg:col-span-1"} h-[260px] sm:h-[320px] lg:h-[360px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group scroll-reveal stagger-${gIdx + 1}`}
                >
                  <img
                    src={getImageUrl(imgItem.image_url || imgItem.image)}
                    alt={localized(imgItem, "title", "Campus Moment")}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              );
            })}
          </div>

          {/* View All Button */}
          <div className="mt-10 text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-100 hover:bg-[#2563EB] hover:text-white text-slate-700 text-xs font-bold transition-all duration-200 shadow-sm"
            >
              <span>{tr("home.viewAllGallery", "View All Gallery", "មើលរូបភាពទាំងអស់")}</span>
              <FiArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* ====================================================================
          9. FAQ ACCORDION SECTION
      ===================================================================== */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 scroll-reveal-text">
            <span className="inline-flex items-center gap-1.5 text-[#2563EB] text-xs font-bold uppercase tracking-widest mb-1.5">
              {tr("faq.badge", "FAQ", "សំណួរចម្លើយ")}
            </span>
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 ${isKhmer ? "font-khmer" : ""}`}>
              {isKhmer ? (
                <>
                  សំណួរដែល <span className="animated-gradient-text">សួរញឹកញាប់បំផុត</span>
                </>
              ) : (
                <>
                  Frequently Asked <span className="animated-gradient-text">Questions</span>
                </>
              )}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className={`bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 card-lift scroll-reveal stagger-${idx + 1}`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm ${isOpen ? "bg-[#2563EB] text-white" : "bg-slate-100 text-slate-600"}`}>
                        <FiHelpCircle size={16} />
                      </div>
                      <span className={`text-sm sm:text-base font-bold text-slate-900 ${isKhmer ? "font-khmer" : ""}`}>
                        {faq.q}
                      </span>
                    </div>
                    <FiChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#2563EB]" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      </div>

      {/* Back to Top Button (Stacked cleanly above AI Assistant) */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-24 right-5 sm:bottom-26 sm:right-6 z-40 p-3 rounded-full bg-slate-900/90 hover:bg-[#2563EB] text-white shadow-xl backdrop-blur-md border border-slate-700/50 transition-all duration-300 hover:scale-110 active:scale-95 ${
          showBackToTop ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <FiArrowUp size={18} />
      </button>

      <style jsx="true">{`
        .card-lift {
          transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 250ms ease-out, border-color 250ms ease-out;
          will-change: transform;
        }
        .card-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
          border-color: #cbd5e1;
        }

        .reveal-block {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .reveal-block.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </>
  );
};

export default Home;