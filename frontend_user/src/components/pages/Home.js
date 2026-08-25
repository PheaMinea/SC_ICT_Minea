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
  FiShield,
  FiStar,
  FiBriefcase,
  FiCamera,
  FiArrowUp,
  FiUsers,
  FiClock,
  FiChevronDown,
  FiHelpCircle,
  FiCheckCircle,
  FiCode,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";

import {
  FaBriefcase,
  FaPaintBrush,
  FaVideo,
  FaCode,
  FaGlobe,
  FaNetworkWired,
} from "react-icons/fa";

import api from "../../services/api";
import Loader from "../common/Loader";
import heroVideo from "../pages/video/sc-academy.mp4";
import { useLanguage } from "../../context/LanguageContext";
import scacademy from "../pages/Scacademy.jpg";
import { getImageUrl } from "../../utils/helpers";

// =====================================================
// SC ACADEMY TOP 4 MOST POPULAR COURSES
// =====================================================
const DEFAULT_COURSES = [
  {
    id: 1,
    title_en: "Full-Stack Web Development",
    title_km: "បង្កើតវេបសាយអាជីព (Web Development)",
    description_en: "Build modern web applications using HTML5, CSS3, JavaScript, React.js, Tailwind CSS & REST APIs.",
    description_km: "បង្កើត Website & Web App ជាក់ស្ដែងជាមួយ HTML5, CSS3, JavaScript, React.js, Tailwind CSS និង APIs។",
    category: "web",
    level_en: "Web Development",
    level_km: "បង្កើតវេបសាយ",
    duration_en: "12 Weeks",
    duration_km: "១២ សប្តាហ៍",
    price: 150.0,
    rating: 4.9,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=85",
  },
  {
    id: 2,
    title_en: "Graphic Design & Brand Identity",
    title_km: "រចនាក្រាហ្វិក & ស្លាកសញ្ញា (Graphic Design)",
    description_en: "Professional branding, logo creation, photo retouching, and commercial visuals using Photoshop & Illustrator.",
    description_km: "ការរចនា Logo, Brand Identity, កាត់តរូបភាព និងផ្ទាំងពាណិជ្ជកម្មដោយប្រើ Photoshop & Illustrator។",
    category: "design",
    level_en: "Graphic Design",
    level_km: "រចនាក្រាហ្វិក",
    duration_en: "8 Weeks",
    duration_km: "៨ សប្តាហ៍",
    price: 120.0,
    rating: 4.9,
    reviews: 168,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=85",
  },
  {
    id: 3,
    title_en: "Video Editing & Content Creation",
    title_km: "កាត់តវីដេអូពាណិជ្ជកម្ម (Video Editing)",
    description_en: "Master Premiere Pro, CapCut PC, motion graphics, audio sync, color grading, and commercial video storytelling.",
    description_km: "កាត់តវីដេអូសម្រាប់ TikTok, YouTube, ស្ពតពាណិជ្ជកម្ម និង Color Grading ជាមួយ Premiere Pro & CapCut។",
    category: "video",
    level_en: "Video Editing",
    level_km: "កាត់តវីដេអូ",
    duration_en: "8 Weeks",
    duration_km: "៨ សប្តាហ៍",
    price: 130.0,
    rating: 4.8,
    reviews: 115,
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=85",
  },
  {
    id: 4,
    title_en: "Network Administration & IT Support",
    title_km: "គ្រប់គ្រងប្រព័ន្ធបណ្តាញ (Network & IT Support)",
    description_en: "Practical LAN/WAN cabling, IP routing, MikroTik configuration, Cisco switch setup, PC hardware & IT troubleshooting.",
    description_km: "តម្លើងនិងគ្រប់គ្រងប្រព័ន្ធ Network, MikroTik, Cisco Router/Switch, ជួសជុល Hardware និងប្រព័ន្ធសុវត្ថិភាព IT។",
    category: "network",
    level_en: "IT & Network",
    level_km: "បណ្តាញ & IT",
    duration_en: "10 Weeks",
    duration_km: "១០ សប្តាហ៍",
    price: 140.0,
    rating: 4.9,
    reviews: 130,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=85",
  },
];

// =====================================================
// SC ACADEMY DEFAULT CAMPUS GALLERY DATA
// =====================================================
const DEFAULT_GALLERY = [
  {
    id: 1,
    title_km: "សកម្មភាពសិក្សា និងអនុវត្តជាក់ស្តែងក្នុងបន្ទប់ Lab",
    title_en: "Hands-on Practical Lab Sessions",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=85",
  },
  {
    id: 2,
    title_km: "សិក្ខាសាលាចែករំលែកបទពិសោធន៍បច្ចេកវិទ្យាទំនើប",
    title_en: "Modern Tech Workshop & Sharing",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=85",
  },
  {
    id: 3,
    title_km: "ការធ្វើបទបង្ហាញគម្រោងចុងក្រោយរបស់សិស្សានុសិស្ស",
    title_en: "Final Project Presentations",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=85",
  },
  {
    id: 4,
    title_km: "ទិដ្ឋភាពបរិវេណសាលា និងបន្ទប់រៀនស្ដង់ដារ",
    title_en: "Campus Environment & Modern Facilities",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=85",
  },
  {
    id: 5,
    title_km: "ការទទួលវិញ្ញាបនបត្របញ្ចប់ការសិក្សាផ្លូវការ",
    title_en: "Official Graduation & Certification",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=85",
  },
  {
    id: 6,
    title_km: "បរិយាកាសសហការ និងធ្វើការជាក្រុមរបស់សិស្សានុសិស្ស",
    title_en: "Student Teamwork & Collaborative Space",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=85",
  },
];

// =====================================================
// LIGHTWEIGHT SCROLL REVEAL HOOK (60FPS PERFORMANCE)
// =====================================================
const useScrollReveal = () => {
  const observerRef = useRef(null);
  const elementsRef = useRef(new Set());

  useEffect(() => {
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observerRef.current?.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -30px 0px",
        }
      );

      elementsRef.current.forEach((element) => {
        if (element) observerRef.current?.observe(element);
      });
    }

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  const addRef = (element) => {
    if (!element) return;
    elementsRef.current.add(element);
    if (observerRef.current) {
      observerRef.current.observe(element);
    }
  };

  return addRef;
};

// =====================================================
// COUNT-UP ANIMATION (SMOOTH 60FPS ON SCROLL)
// =====================================================
const CountUp = ({ end, duration = 1600, suffix = "+", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const animationRef = useRef(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return undefined;

    const startCounting = () => {
      if (isRunningRef.current) return;
      isRunningRef.current = true;
      let startTime = null;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth cubic-out easing
        const easeOut = 1 - Math.pow(1 - progress, 3.5);
        const currentValue = Math.floor(end * easeOut);

        setCount(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setCount(end);
          isRunningRef.current = false;
        }
      };

      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };

    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startCounting();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -20px 0px" }
      );

      observer.observe(element);

      return () => {
        observer.disconnect();
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    } else {
      startCounting();
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

// =====================================================
// MAIN COMPONENT
// =====================================================
const Home = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [schools, setSchools] = useState([]);
  const [courses, setCourses] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [activeCategory, setActiveCategory] = useState("web");
  const [activeFaq, setActiveFaq] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const schoolScrollRef = useRef(null);
  const galleryScrollRef = useRef(null);
  const { language, t } = useLanguage();
  const isKhmer = language === "km";
  const addRevealRef = useScrollReveal();

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
          setCourses(apiCourses.length > 0 ? apiCourses : DEFAULT_COURSES);
        } else {
          setCourses(DEFAULT_COURSES);
        }
        if (galleryRes.status === "fulfilled") {
          setGalleryImages(getListData(galleryRes.value.data));
        }
      } catch (err) {
        console.error("Error fetching homepage data:", err);
        setCourses(DEFAULT_COURSES);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Filtered courses
  const displayCourses = courses.length > 0 ? courses : DEFAULT_COURSES;
  const filteredCourses = useMemo(() => {
    if (activeCategory === "all") return displayCourses;
    return displayCourses.filter((course) => {
      const cat = (course.category || course.level || course.title || "").toLowerCase();
      return cat.includes(activeCategory);
    });
  }, [displayCourses, activeCategory]);

  const scrollSchools = (direction) => {
    const container = schoolScrollRef.current;
    if (!container) return;
    const cardWidth = 300;
    container.scrollBy({
      left: direction === "next" ? cardWidth + 20 : -(cardWidth + 20),
      behavior: "smooth",
    });
  };

  const scrollGallery = (direction) => {
    const container = galleryScrollRef.current;
    if (!container) return;
    const cardWidth = 300;
    container.scrollBy({
      left: direction === "next" ? cardWidth + 24 : -(cardWidth + 24),
      behavior: "smooth",
    });
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
      badge: tr("home.badgeInDemand", "High Demand", "តម្រូវការទីផ្សារខ្ពស់"),
    },
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
      badge: tr("home.badgeCreative", "Creative Career", "អាជីពច្នៃប្រឌិត"),
    },
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
      badge: tr("home.badgeEssential", "Essential IT", "ជំនាញស្នូល IT"),
    },
  ];

  // Why Choose Us Pillars
  const features = [
    {
      icon: FiCode,
      title: tr("home.f1Title", "Hands-On Practical Labs", "ការអនុវត្តក្នុងបន្ទប់ Lab ជាក់ស្ដែង 80%"),
      desc: tr(
        "home.f1Desc",
        "Spend 80% of class time coding, designing, and troubleshooting real hardware setups with dedicated instructor guidance.",
        "ចំណាយពេល 80% នៃការសិក្សាអនុវត្តគម្រោងផ្ទាល់លើកុំព្យូទ័រ និងឧបករណ៍ Network ពិតប្រាកដជាមួយលោកគ្រូអ្នកគ្រូជំនាញ។"
      ),
    },
    {
      icon: FiAward,
      title: tr("home.f2Title", "Recognized Certification", "វិញ្ញាបនបត្របញ្ជាក់សមត្ថភាពផ្លូវការ"),
      desc: tr(
        "home.f2Desc",
        "Graduate with an accredited certificate and a verified digital portfolio to demonstrate your skills to top employers.",
        "ទទួលបានវិញ្ញាបនបត្រផ្លូវការដែលទទួលស្គាល់ដោយដៃគូឧស្សាហកម្ម និងមាន Portfolio ផ្ទាល់ខ្លួនសម្រាប់ដាក់ពាក្យធ្វើការ។"
      ),
    },
    {
      icon: FiBriefcase,
      title: tr("home.f3Title", "Career Mentorship & Placement", "ការប្រឹក្សាអាជីព និងឱកាសការងារ"),
      desc: tr(
        "home.f3Desc",
        "Direct resume reviews, mock interviews, and priority recommendations to hiring partner companies across Cambodia.",
        "ជួយរៀបចំប្រវត្តិរូប (CV/Portfolio), សម្ភាសន៍សាកល្បង និងណែនាំឱកាសការងារជាមួយបណ្តាញក្រុមហ៊ុនដៃគូ។"
      ),
    },
  ];

  // FAQ Data
  const faqs = [
    {
      q: tr("faq.q1", "Do I receive an official certificate after completing a course?", "តើបញ្ចប់ការសិក្សាទទួលបានវិញ្ញាបនបត្រផ្លូវការដែរឬទេ?"),
      a: tr("faq.a1", "Yes, upon successfully completing the course requirements, project assignments, and final assessment, SC Academy awards an accredited Certificate of Completion recognized across industry partners.", "បាទ/ចាស! ក្រោយពីបញ្ចប់ការសិក្សា ការអនុវត្ត Project ជាក់ស្ដែង និងការប្រឡងបញ្ចប់វគ្គ សិស្សនឹងទទួលបានវិញ្ញាបនបត្របញ្ជាក់ការសិក្សាផ្លូវការពី SC Academy ដែលត្រូវបានទទួលស្គាល់ដោយស្ថាប័ន និងក្រុមហ៊ុនដៃគូ។"),
    },
    {
      q: tr("faq.q2", "Are there flexible evening and weekend class schedules for working professionals?", "តើមានថ្នាក់សិក្សាវេនយប់ ឬចុងសប្តាហ៍សម្រាប់អ្នកធ្វើការដែរឬទេ?"),
      a: tr("faq.a2", "Yes, we offer morning, afternoon, evening (5:30 PM - 8:30 PM), and weekend (Saturday-Sunday) classes tailored specifically for university students and working professionals.", "បាទ/ចាស! SC Academy មានថ្នាក់សិក្សាពេលព្រឹក ពេលរសៀល ពេលល្ងាច (៥:៣០ ដល់ ៨:៣០ យប់) និងថ្នាក់ចុងសប្តាហ៍ (សៅរ៍-អាទិត្យ) ដែលសមស្របបំផុតសម្រាប់និស្សិត និងអ្នកកំពុងបំពេញការងារ។"),
    },
    {
      q: tr("faq.q3", "Does SC Academy provide job placement or internship support?", "តើមានការជួយសម្របសម្រួលស្វែងរកការងារ ឬចុះកម្មសិក្សាដែរឬទេ?"),
      a: tr("faq.a3", "Yes, our Career & Alumni Support team assists outstanding students with portfolio reviews, resume building, mock interviews, and connects graduates with our network of hiring partners for internship and job opportunities.", "បាទ/ចាស! ក្រុមការងារ Career Support របស់សាលានឹងជួយណែនាំការរៀបចំ CV/Portfolio, សម្ភាសន៍សាកល្បង និងបញ្ជូនបេក្ខជនឆ្នើមទៅកាន់បណ្តាញក្រុមហ៊ុនដៃគូដើម្បីចុះកម្មសិក្សា ឬទទួលបានឱកាសការងារភ្លាមៗ។"),
    },
    {
      q: tr("faq.q4", "What payment methods are supported for course registration?", "តើអាចបង់ថ្លៃសិក្សាតាមមធ្យោបាយណាខ្លះ?"),
      a: tr("faq.a4", "We accept payments via Bakong KHQR (ABA Bank, Acleda, Wing, Canadia, etc.), bank transfers, and direct cash payments at our campus admission office. Installment payment options are also available for selected long-term programs.", "លោកអ្នកអាចបង់ថ្លៃសិក្សាតាមរយៈ Bakong KHQR (ABA Bank, ACLEDA, Wing, Canadia), ផ្ទេរប្រាក់តាមគណនីធនាគារ ឬបង់ផ្ទាល់នៅការិយាល័យចុះឈ្មោះ។ សម្រាប់វគ្គវែង សិស្សក៏អាចជ្រើសរើសការបង់រំលស់ជាដំណាក់កាលបានផងដែរ។"),
    },
    {
      q: tr("faq.q5", "Can beginners with no computer background join the programs?", "តើអ្នកដែលមិនធ្លាប់មានមូលដ្ឋានគ្រឹះពីមុនមក អាចរៀនបានដែរឬទេ?"),
      a: tr("faq.a5", "Absolutely! All our foundational courses are structured step-by-step from zero basics, supported by dedicated instructors and hands-on lab exercises to ensure every student can follow and build real practical skills.", "ពិតជាបាន! គ្រប់វគ្គសិក្សាត្រូវបានរៀបចំឡើងជាជំហានៗចាប់ពីកម្រិតសូន្យឡើងទៅ ដោយមានលោកគ្រូអ្នកគ្រូណែនាំផ្ទាល់ និងការអនុវត្តជាក់ស្តែងក្នុងបន្ទប់ Lab ដើម្បីធានាថាសិស្សគ្រប់រូបអាចចាប់បានយ៉ាងឆាប់រហ័ស។"),
    },
  ];

  return (
    <>
      {!preloaderDone && (
        <Loader onComplete={() => setPreloaderDone(true)} />
      )}

      <Helmet>
        <title>
          {tr("home.seoTitle", "SC Academy | Modern IT & Digital Skills Training", "SC Academy | បណ្តុះបណ្តាលជំនាញបច្ចេកវិទ្យា និងឌីជីថល")}
        </title>
        <meta name="description" content="SC Academy - Future-ready IT and digital skills education in Cambodia." />
      </Helmet>

      <section className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-slate-950">
        {/* HTML5 Background Video (Balanced Moderate Clarity) */}
        <video
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          poster={scacademy}
          className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none transition-opacity duration-700"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Balanced Moderate Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/35 backdrop-blur-[0.5px]" />

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 text-center text-white">
          {/* Glassmorphism Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200 mb-6 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]" />
            </span>
            <span>{tr("home.badge2026", "Admissions Open for 2026 Cohort", "ជំនាញឌីជីថលជំនាន់ថ្មី ២០២៦")}</span>
          </div>

          {/* Bold Impactful Headline */}
          <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.18] max-w-4xl mx-auto ${isKhmer ? "font-khmer" : ""}`}>
            {isKhmer ? (
              <>
                លើកកម្ពស់សមត្ថភាពយុវជនកម្ពុជា ជាមួយ{" "}
                <span className="bg-gradient-to-r from-blue-400 via-blue-200 to-white bg-clip-text text-transparent">
                  ជំនាញឌីជីថលពិតប្រាកដ។
                </span>
              </>
            ) : (
              <>
                Empowering Future Leaders With{" "}
                <span className="bg-gradient-to-r from-blue-400 via-blue-200 to-white bg-clip-text text-transparent">
                  Practical Digital Skills.
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className={`mt-6 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed ${isKhmer ? "font-khmer" : ""}`}>
            {tr(
              "home.heroSubheadline",
              "Master in-demand tech skills in Web Development, Graphic & Video Media, and Network Administration through 80% hands-on laboratory training.",
              "កម្មវិធីសិក្សាបច្ចេកវិទ្យាទំនើប រួមមាន ការបង្កើតវេបសាយ រចនាក្រាហ្វិក & វីដេអូ និងប្រព័ន្ធគ្រប់គ្រងបណ្តាញ IT ជាមួយការអនុវត្តជាក់ស្ដែង 80% ក្នុងបន្ទប់ Lab។"
            )}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#courses"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group"
            >
              <span>{tr("home.exploreCourses", "Explore Courses", "ស្វែងរកវគ្គសិក្សា")}</span>
              <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="https://t.me/SC_Academy"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md text-sm font-semibold transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {tr("home.applyNow", "Apply via Telegram", "ចុះឈ្មោះតាម Telegram")}
            </a>
          </div>
        </div>

        {/* Sound Toggle */}
        <button
          type="button"
          onClick={() => setIsMuted((prev) => !prev)}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          className="absolute right-4 bottom-4 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/20 bg-slate-900/60 text-white backdrop-blur-md transition-all duration-300 hover:bg-[#2563EB] hover:scale-105 active:scale-95 shadow-lg"
        >
          {isMuted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
        </button>
      </section>

      {/* ====================================================================
          2. FLOATING STATS SECTION (4 KEY METRICS)
      ===================================================================== */}
      <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-white dark:bg-[#0F172A] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          {/* STAT 1: GRADUATED STUDENTS */}
          <div className="text-center p-3 flex flex-col items-center">
            <div className="w-11 h-11 mb-3 rounded-xl bg-blue-500/10 border border-blue-500/15 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shadow-xs">
              <FiUsers size={20} />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              <CountUp end={15000} duration={1800} />
            </div>
            <p className={`text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 ${isKhmer ? "font-khmer" : ""}`}>
              {tr("home.graduatesStat", "Graduated Students", "សិស្សានុសិស្សបញ្ចប់ការសិក្សា")}
            </p>
          </div>

          {/* STAT 2: PRACTICAL LAB FOCUS */}
          <div className="text-center p-3 border-l border-slate-100 dark:border-slate-800 flex flex-col items-center">
            <div className="w-11 h-11 mb-3 rounded-xl bg-blue-500/10 border border-blue-500/15 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shadow-xs">
              <FiCode size={20} />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-[#2563EB] tracking-tight">
              <CountUp end={95} suffix="%" duration={1600} />
            </div>
            <p className={`text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 ${isKhmer ? "font-khmer" : ""}`}>
              {tr("home.labFocusStat", "Practical Lab Focus", "ការអនុវត្ត Lab ជាក់ស្ដែង")}
            </p>
          </div>

          {/* STAT 3: ACCREDITED PROGRAMS */}
          <div className="text-center p-3 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 flex flex-col items-center">
            <div className="w-11 h-11 mb-3 rounded-xl bg-blue-500/10 border border-blue-500/15 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shadow-xs">
              <FiBookOpen size={20} />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              <CountUp end={24} duration={1400} />
            </div>
            <p className={`text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 ${isKhmer ? "font-khmer" : ""}`}>
              {tr("home.coursesStat", "Accredited Programs", "កម្មវិធីសិក្សាមានការទទួលស្គាល់")}
            </p>
          </div>

          {/* STAT 4: JOB PLACEMENT */}
          <div className="text-center p-3 border-t sm:border-t-0 border-l border-slate-100 dark:border-slate-800 flex flex-col items-center">
            <div className="w-11 h-11 mb-3 rounded-xl bg-blue-500/10 border border-blue-500/15 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shadow-xs">
              <FiBriefcase size={20} />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-[#2563EB] tracking-tight">
              <CountUp end={92} suffix="%" duration={1600} />
            </div>
            <p className={`text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 ${isKhmer ? "font-khmer" : ""}`}>
              {tr("home.placementStat", "Job Placement Support", "ការគាំទ្រឱកាសការងារ")}
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. SKILLS TICKER / MARQUEE BAR (INFINITE SEAMLESS LOOP)
      ===================================================================== */}
      <section className="relative z-10 overflow-hidden border-y border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-[#070D1F] mt-12 py-3.5 select-none">
        <div className="course-marquee">
          <div className="course-marquee-track">
            {[
              { icon: FaBriefcase, label: "Advanced Microsoft Office" },
              { icon: FaPaintBrush, label: "Graphic Design & Branding" },
              { icon: FaVideo, label: "Video Editing & Motion Graphics" },
              { icon: FaCode, label: "React.js & TailwindCSS" },
              { icon: FaGlobe, label: "Full-Stack Web Development" },
              { icon: FaNetworkWired, label: "Network & IT Support" },
              { icon: FaCode, label: "Python & Databases" },
              { icon: FaPaintBrush, label: "UI/UX Design Masterclass" },
              { icon: FaBriefcase, label: "Advanced Microsoft Office" },
              { icon: FaPaintBrush, label: "Graphic Design & Branding" },
              { icon: FaVideo, label: "Video Editing & Motion Graphics" },
              { icon: FaCode, label: "React.js & TailwindCSS" },
              { icon: FaGlobe, label: "Full-Stack Web Development" },
              { icon: FaNetworkWired, label: "Network & IT Support" },
              { icon: FaCode, label: "Python & Databases" },
              { icon: FaPaintBrush, label: "UI/UX Design Masterclass" },
              { icon: FaBriefcase, label: "Advanced Microsoft Office" },
              { icon: FaPaintBrush, label: "Graphic Design & Branding" },
              { icon: FaVideo, label: "Video Editing & Motion Graphics" },
              { icon: FaCode, label: "React.js & TailwindCSS" },
              { icon: FaGlobe, label: "Full-Stack Web Development" },
              { icon: FaNetworkWired, label: "Network & IT Support" },
              { icon: FaCode, label: "Python & Databases" },
              { icon: FaPaintBrush, label: "UI/UX Design Masterclass" },
              { icon: FaBriefcase, label: "Advanced Microsoft Office" },
              { icon: FaPaintBrush, label: "Graphic Design & Branding" },
              { icon: FaVideo, label: "Video Editing & Motion Graphics" },
              { icon: FaCode, label: "React.js & TailwindCSS" },
              { icon: FaGlobe, label: "Full-Stack Web Development" },
              { icon: FaNetworkWired, label: "Network & IT Support" },
              { icon: FaCode, label: "Python & Databases" },
              { icon: FaPaintBrush, label: "UI/UX Design Masterclass" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-2.5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  <Icon className="text-[#2563EB] text-sm shrink-0" />
                  <span>{item.label}</span>
                  <span className="ml-3 text-slate-300 dark:text-slate-700 font-normal">•</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. FEATURED TOP 4 POPULAR COURSES
      ===================================================================== */}
      <section id="courses" ref={addRevealRef} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-block">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[#2563EB] text-xs font-bold uppercase tracking-widest">
              {tr("home.coursesBadge", "🔥 TOP POPULAR COURSES", "🔥 វគ្គសិក្សាពេញនិយមបំផុត")}
            </span>
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mt-1.5 ${isKhmer ? "font-khmer" : ""}`}>
              {tr("home.coursesTitle", "Top 4 In-Demand Career Programs", "៤ វគ្គសិក្សាស្នូលពេញនិយមបំផុត")}
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

        {/* 4 Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {(courses.length > 0 ? courses.slice(0, 4) : DEFAULT_COURSES.slice(0, 4)).map((course) => {
            const courseTitle = localized(course, "title") || "Course Title";
            const courseDesc = localized(course, "description") || "Practical step-by-step training.";
            const courseImage = course.image || course.image_url;

            return (
              <article
                key={course.id}
                className="card-lift bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col group shadow-sm hover:border-slate-300"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={getImageUrl(courseImage) || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&q=80"}
                    alt={courseTitle}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=700&q=80";
                    }}
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

      {/* ====================================================================
          5. WHY CHOOSE US / FEATURES (CLEAN 3-COLUMN)
      ===================================================================== */}
      <section id="why-us" ref={addRevealRef} className="py-20 bg-slate-200/40 dark:bg-[#0A1024] border-y border-slate-200/80 dark:border-slate-800 reveal-block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#2563EB] text-xs font-bold uppercase tracking-widest">
              {tr("home.whyChooseLabel", "Why Choose SC Academy", "ហេតុអ្វីជ្រើសរើស SC Academy")}
            </span>
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mt-1.5 ${isKhmer ? "font-khmer" : ""}`}>
              {tr("home.whyChooseTitle", "Built For Real-World Success", "ការអប់រំដែលបង្កើតឡើងសម្រាប់ភាពជោគជ័យជាក់ស្ដែង")}
            </h2>
            <p className={`text-sm text-slate-600 mt-3 leading-relaxed ${isKhmer ? "font-khmer" : ""}`}>
              {tr(
                "home.whyChooseDesc",
                "We focus on what companies look for: real skills, verified portfolio projects, and direct mentor feedback.",
                "យើងផ្តោតលើជំនាញដែលទីផ្សារការងារត្រូវការ៖ ការអនុវត្តផ្ទាល់ គម្រោងជាក់ស្តែង និងការណែនាំពីគ្រូជំនាញ។"
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 card-lift">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className={`text-lg font-bold text-slate-900 mb-2 ${isKhmer ? "font-khmer" : ""}`}>
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
      <section ref={addRevealRef} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-block">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#2563EB] text-xs font-bold uppercase tracking-widest">
            {tr("home.careerPathsBadge", "Structured Roadmaps", "ផែនទីបង្ហាញផ្លូវសិក្សា")}
          </span>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mt-1.5 ${isKhmer ? "font-khmer" : ""}`}>
            {tr("home.careerPathsTitle", "Choose Your Career Learning Path", "ជ្រើសរើសផ្លូវអាជីពឆ្ពោះទៅកាន់ភាពជោគជ័យ")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {careerPathways.map((path, idx) => {
            const Icon = path.icon;
            return (
              <div
                key={idx}
                className="card-lift bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      {path.badge}
                    </span>
                  </div>

                  <h3 className={`text-lg font-bold text-slate-900 mb-1 ${isKhmer ? "font-khmer" : ""}`}>
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
        <section ref={addRevealRef} className="py-20 bg-slate-200/40 dark:bg-[#0A1024] border-y border-slate-200/80 dark:border-slate-800 reveal-block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-[#2563EB] text-xs font-bold uppercase tracking-widest">
                  {tr("home.discoverSchools", "Learning Network", "សហគមន៍សិក្សា")}
                </span>
                <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mt-1.5 ${isKhmer ? "font-khmer" : ""}`}>
                  {tr("home.ourSchool", "Our Schools & Campuses", "សាលារបស់យើង")}
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
              {schools.map((school) => (
                <article
                  key={school.id}
                  className="card-lift flex-none w-[280px] sm:w-[320px] bg-white rounded-2xl overflow-hidden border border-slate-200"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={getImageUrl(school.image || school.image_url) || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"}
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
          8. CAMPUS LIFE / GALLERY (2x2 ASYMMETRIC BENTO PHOTO GRID - NO TEXT)
      ===================================================================== */}
      <section ref={addRevealRef} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-block">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[#2563EB] text-xs font-bold uppercase tracking-widest">
              {tr("home.campusMoments", "Campus Moments", "ទិដ្ឋភាពក្នុងសាលា")}
            </span>
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1.5 ${isKhmer ? "font-khmer" : ""}`}>
              {tr("home.gallery", "Life at SC Academy", "ជីវិតនៅ SC Academy")}
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

        {/* Asymmetric 2x2 Bento Photo Grid (No Text Overlays) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Photo 1: Wide Top-Left */}
          <div className="lg:col-span-2 h-[260px] sm:h-[320px] lg:h-[360px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group">
            <img
              src={
                (galleryImages[0] && getImageUrl(galleryImages[0].image_url || galleryImages[0].image)) ||
                DEFAULT_GALLERY[0].image
              }
              alt="Campus Moment 1"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_GALLERY[0].image;
              }}
            />
          </div>

          {/* Photo 2: Compact Top-Right */}
          <div className="lg:col-span-1 h-[260px] sm:h-[320px] lg:h-[360px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group">
            <img
              src={
                (galleryImages[1] && getImageUrl(galleryImages[1].image_url || galleryImages[1].image)) ||
                DEFAULT_GALLERY[1].image
              }
              alt="Campus Moment 2"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_GALLERY[1].image;
              }}
            />
          </div>

          {/* Photo 3: Compact Bottom-Left */}
          <div className="lg:col-span-1 h-[260px] sm:h-[320px] lg:h-[360px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group">
            <img
              src={
                (galleryImages[2] && getImageUrl(galleryImages[2].image_url || galleryImages[2].image)) ||
                DEFAULT_GALLERY[2].image
              }
              alt="Campus Moment 3"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_GALLERY[2].image;
              }}
            />
          </div>

          {/* Photo 4: Wide Bottom-Right */}
          <div className="lg:col-span-2 h-[260px] sm:h-[320px] lg:h-[360px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group">
            <img
              src={
                (galleryImages[3] && getImageUrl(galleryImages[3].image_url || galleryImages[3].image)) ||
                DEFAULT_GALLERY[3].image
              }
              alt="Campus Moment 4"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_GALLERY[3].image;
              }}
            />
          </div>
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

      {/* ====================================================================
          9. FAQ ACCORDION SECTION
      ===================================================================== */}
      <section ref={addRevealRef} className="py-20 bg-slate-100/70 border-t border-slate-200 reveal-block">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[#2563EB] text-xs font-bold uppercase tracking-widest">
              {tr("faq.badge", "FAQ", "សំណួរចម្លើយ")}
            </span>
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mt-1.5 ${isKhmer ? "font-khmer" : ""}`}>
              {tr("faq.title", "Frequently Asked Questions", "សំណួរដែលសួរញឹកញាប់")}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200"
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

      {/* ====================================================================
          10. FINAL CTA FLOATING BANNER
      ===================================================================== */}
      <section ref={addRevealRef} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-block">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 px-6 py-14 sm:px-12 sm:py-16 text-center text-white border border-slate-800 shadow-xl">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className={`text-2xl sm:text-4xl font-black tracking-tight text-white mb-4 ${isKhmer ? "font-khmer" : ""}`}>
              {tr("home.ctaTitle", "Start Your Digital Career With SC Academy Today", "ចាប់ផ្តើមអាជីពឌីជីថលរបស់អ្នកជាមួយ SC Academy ថ្ងៃនេះ")}
            </h2>
            <p className={`text-sm sm:text-base text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed ${isKhmer ? "font-khmer" : ""}`}>
              {tr("home.ctaDesc", "Join over 15,000 students learning high-demand tech and creative skills.", "ចូលរួមជាមួយសិស្សជាង 15,000 នាក់ក្នុងការកសាងជំនាញបច្ចេកវិទ្យា និងអាជីពនាពេលអនាគត។")}
            </p>
            <a
              href="https://t.me/SC_Academy"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-all shadow-lg shadow-[#2563EB]/25 active:scale-95"
            >
              <span>{tr("home.ctaButton", "Contact Admission on Telegram", "ទាក់ទងចុះឈ្មោះតាម Telegram")}</span>
              <FiArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#2563EB] text-white shadow-lg transition-all duration-300 hover:bg-[#1D4ED8] hover:scale-105 ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
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