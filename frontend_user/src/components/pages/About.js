import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import {
  
  FiTarget,
  FiEye,
  FiAward,
  FiUsers,
  FiHeart,
  FiStar,
  FiCheckCircle,
  FiMail,
  FiPhone,
  FiArrowRight } from "react-icons/fi";

import api from "../../services/api";
import TypewriterText from "../common/TypewriterText";
import { useLanguage } from "../../context/LanguageContext";
import heroVideo from "./video/sc-academy.mp4";

// ============================================================
// API BASE URL
// ============================================================
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

// ============================================================
// IMAGE URL HELPER
// ============================================================
const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/${path}`;
};

// ============================================================
// ABOUT PAGE
// ============================================================
const About = () => {

  // ==========================================================
  // LANGUAGE
  // ==========================================================
  const { t, language } = useLanguage();
  const isKhmer = language === "km";

  // ==========================================================
  // TRANSLATION FALLBACK
  // ==========================================================
  const tr = (key, english, khmer) => {
    const value = t(key);
    if (value && value !== key) return value;
    return isKhmer ? khmer : english;
  };

  // ==========================================================
  // STATES
  // ==========================================================
  const [about, setAbout] = useState(null);
  const [leadership, setLeadership] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // FETCH DATA
  // ==========================================================
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const results = await Promise.allSettled([
          api.get("/api/about/"),
          api.get("/api/leadership/active"),
        ]);

        if (results[0].status === "fulfilled") {
          const data = results[0].value.data;
          if (Array.isArray(data)) {
            setAbout(data[0] || null);
          } else if (data?.items && Array.isArray(data.items)) {
            setAbout(data.items[0] || null);
          } else {
            setAbout(data || null);
          }
        } else {
          setAbout(null);
        }

        if (results[1].status === "fulfilled") {
          const data = results[1].value.data;
          setLeadership(
            Array.isArray(data)
              ? data
              : Array.isArray(data?.items)
              ? data.items
              : []
          );
        } else {
          setLeadership([]);
        }
      } catch (error) {
        console.error("About page error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // ==========================================================
  // LOCALIZED API DATA HELPER
  // ==========================================================
  const localized = (item, field, defaultValue = "") => {
    if (!item) return defaultValue;
    const selectedField = `${field}_${language}`;
    const englishField = `${field}_en`;
    const khmerField = `${field}_km`;

    if (item[selectedField] !== undefined && item[selectedField] !== null && String(item[selectedField]).trim() !== "") {
      return item[selectedField];
    }
    if (isKhmer && item[englishField] !== undefined && item[englishField] !== null && String(item[englishField]).trim() !== "") {
      return item[englishField];
    }
    if (!isKhmer && item[khmerField] !== undefined && item[khmerField] !== null && String(item[khmerField]).trim() !== "") {
      return item[khmerField];
    }
    if (item[field] !== undefined && item[field] !== null && String(item[field]).trim() !== "") {
      return item[field];
    }
    return defaultValue;
  };

  const getAboutContent = (field, translationKey, englishFallback, khmerFallback) => {
    const databaseValue = localized(about, field);
    if (databaseValue && String(databaseValue).trim() !== "") return databaseValue;
    return tr(translationKey, englishFallback, khmerFallback);
  };

  const storyText = getAboutContent(
    "story",
    "about.defaultStory",
    "SC Academy was established with a clear commitment to provide quality education, practical skills, and meaningful learning opportunities for students. We believe education should prepare learners not only for academic success, but also for their future careers and responsibilities in society.",
    "SC Academy ត្រូវបានបង្កើតឡើងដោយមានការប្តេជ្ញាចិត្តច្បាស់លាស់ក្នុងការផ្តល់ការអប់រំប្រកបដោយគុណភាព ជំនាញអនុវត្ត និងឱកាសសិក្សាដ៏មានអត្ថន័យសម្រាប់សិស្សានុសិស្ស។ យើងជឿជាក់ថា ការអប់រំគួរតែរៀបចំអ្នកសិក្សាមិនត្រឹមតែសម្រាប់ភាពជោគជ័យក្នុងការសិក្សាប៉ុណ្ណោះទេ ប៉ុន្តែថែមទាំងសម្រាប់អាជីព និងការទទួលខុសត្រូវក្នុងសង្គមនាពេលអនាគតផងដែរ។"
  );

  const missionText = getAboutContent(
    "mission",
    "about.missionDefault",
    "Our mission is to provide quality education and practical learning experiences that help students develop knowledge, skills, confidence, character, and the ability to succeed in a changing world.",
    "បេសកកម្មរបស់យើងគឺផ្តល់ការអប់រំប្រកបដោយគុណភាព និងបទពិសោធន៍សិក្សាអនុវត្តជាក់ស្តែង ដើម្បីជួយសិស្សអភិវឌ្ឍចំណេះដឹង ជំនាញ ទំនុកចិត្ត អត្តចរិត និងសមត្ថភាពក្នុងការទទួលបានជោគជ័យក្នុងពិភពលោកដែលកំពុងផ្លាស់ប្តូរ។"
  );

  const visionText = getAboutContent(
    "vision",
    "about.visionDefault",
    "Our vision is to become a trusted educational institution that empowers learners to reach their potential, become responsible citizens, and contribute positively to their communities and society.",
    "ចក្ខុវិស័យរបស់យើងគឺក្លាយជាស្ថាប័នអប់រំដែលទទួលបានការជឿទុកចិត្ត ដែលជួយឱ្យអ្នកសិក្សាអាចអភិវឌ្ឍសក្តានុពលរបស់ខ្លួន ក្លាយជាពលរដ្ឋដែលមានទំនួលខុសត្រូវ និងចូលរួមចំណែកជាវិជ្ជមានដល់សហគមន៍ និងសង្គម។"
  );

  const principalMessage = getAboutContent(
    "principal_message",
    "about.principalMessageDefault",
    "Welcome to SC Academy. We are committed to creating a supportive learning environment where every student has the opportunity to learn, grow, develop practical skills, and prepare for a successful future.",
    "សូមស្វាគមន៍មកកាន់ SC Academy។ យើងប្តេជ្ញាបង្កើតបរិយាកាសសិក្សាដែលគាំទ្រដល់សិស្សគ្រប់រូប ដើម្បីឱ្យពួកគេមានឱកាសរៀនសូត្រ រីកចម្រើន អភិវឌ្ឍជំនាញអនុវត្ត និងត្រៀមខ្លួនសម្រាប់អនាគតដ៏ជោគជ័យ។"
  );

  const principalName =
    localized(about, "principal_name") ||
    tr("about.principalName", "Principal", "នាយកសាលា");

  const coreValues = [
    {
      icon: FiAward,
      title: tr("about.excellence", "Excellence", "ឧត្តមភាព"),
      description: tr(
        "about.excellenceDescription",
        "We strive for excellence in teaching, learning, leadership, and everything we do.",
        "យើងខិតខំសម្រេចបាននូវឧត្តមភាពក្នុងការបង្រៀន ការសិក្សា ភាពជាអ្នកដឹកនាំ និងគ្រប់សកម្មភាពរបស់យើង។"
      ) },
    {
      icon: FiHeart,
      title: tr("about.integrity", "Integrity", "សុចរិតភាព"),
      description: tr(
        "about.integrityDescription",
        "We promote honesty, responsibility, respect, and strong moral values.",
        "យើងលើកកម្ពស់ភាពស្មោះត្រង់ ការទទួលខុសត្រូវ ការគោរព និងគុណតម្លៃសីលធម៌ល្អ។"
      ) },
    {
      icon: FiUsers,
      title: tr("about.community", "Community", "សហគមន៍"),
      description: tr(
        "about.communityDescription",
        "We build a supportive learning community where students, teachers, and families grow together.",
        "យើងកសាងសហគមន៍សិក្សាដែលគាំទ្រគ្នា ដែលសិស្ស គ្រូបង្រៀន និងគ្រួសារ អាចរីកចម្រើនជាមួយគ្នា។"
      ) },
    {
      icon: FiStar,
      title: tr("about.innovation", "Innovation", "នវានុវត្តន៍"),
      description: tr(
        "about.innovationDescription",
        "We embrace new ideas, technology, and modern learning methods to improve education.",
        "យើងទទួលយកគំនិតថ្មី បច្ចេកវិទ្យា និងវិធីសាស្ត្រសិក្សាទំនើប ដើម្បីធ្វើឱ្យការអប់រំកាន់តែប្រសើរ។"
      ) },
  ];

  const features = [
    tr("about.qualityEducation", "Quality Education", "ការអប់រំប្រកបដោយគុណភាព"),
    tr("about.experiencedTeachers", "Experienced Teachers", "គ្រូបង្រៀនមានបទពិសោធន៍"),
    tr("about.modernLearning", "Modern Learning", "ការសិក្សាបែបទំនើប"),
    tr("about.studentDevelopment", "Student Development", "ការអភិវឌ្ឍសិស្ស"),
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white dark:bg-[#0F172A]">
        <div className="w-10 h-10 rounded-full border-[3px] border-blue-500/20 border-t-[#2563EB] animate-spin" />
      </div>
    );
  }

  return (
    <main className={isKhmer ? "font-khmer" : ""}>
      <Helmet>
        <title>{tr("about.title", "About Us", "អំពីយើង")} | SC Academy</title>
        <meta
          name="description"
          content={tr(
            "about.heroDescription",
            "Learn more about SC Academy, our mission, vision, values, leadership, and commitment to quality education.",
            "ស្វែងយល់បន្ថែមអំពី SC Academy បេសកកម្ម ចក្ខុវិស័យ គុណតម្លៃ ក្រុមដឹកនាំ និងការប្តេជ្ញាចិត្តរបស់យើងក្នុងការផ្តល់ការអប់រំប្រកបដោយគុណភាព។"
          )}
        />
      </Helmet>

      {/* ====================================================
          HERO WITH VIDEO BACKGROUND
      ===================================================== */}
      <section className="relative min-h-[360px] sm:min-h-[420px] flex items-center overflow-hidden bg-slate-950 text-white border-b border-slate-800">
        {/* Background Looping Video - Bright & Vibrant */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover opacity-70 filter brightness-100 contrast-105 scale-105"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          {/* Subtle Gradient Mask for natural clarity */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full animate-text-focus">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md shadow-sm">
              {tr("about.welcome", "About SC Academy", "អំពីយើង")}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              {isKhmer ? (
                <>
                  អំពីយើង &{" "}
                  <TypewriterText
                    words={[
                      "បេសកកម្មអប់រំ SC Academy",
                      "ចក្ខុវិស័យបណ្តុះបណ្តាល",
                      "គុណតម្លៃ និងក្រមសីលធម៌",
                      "ការកសាងអ្នកដឹកនាំជំនាន់ថ្មី",
                    ]}
                    highlightClassName="animated-gradient-text"
                  />
                </>
              ) : (
                <>
                  About SC Academy &{" "}
                  <TypewriterText
                    words={[
                      "Our Educational Mission",
                      "Future-Ready Vision",
                      "Core Values & Integrity",
                      "Empowering New Leaders",
                    ]}
                    highlightClassName="animated-gradient-text"
                  />
                </>
              )}
            </h1>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed max-w-2xl font-medium drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
              {tr(
                "about.heroDescription",
                "Learn more about SC Academy, our mission, vision, values, leadership, and commitment to quality education.",
                "ស្វែងយល់បន្ថែមអំពី SC Academy បេសកកម្ម ចក្ខុវិស័យ គុណតម្លៃ ក្រុមដឹកនាំ និងការប្តេជ្ញាចិត្តរបស់យើងក្នុងការផ្តល់ការអប់រំប្រកបដោយគុណភាព។"
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================
          PAGE BODY WITH DOT MATRIX PATTERN
      ===================================================== */}
      <div className="relative w-full bg-dot-matrix-page overflow-hidden">
        {/* ====================================================
            OUR STORY
        ===================================================== */}
        <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* IMAGE */}
            <div className="relative">
              <div className="relative h-[320px] sm:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden shadow-md border border-slate-200">
                <img
                  src={getImageUrl(
                    about?.story_image || about?.image,
                    "/sc-academy-building.png"
                  )}
                  alt="SC Academy"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/sc-academy-building.png";
                  }}
                />
              </div>

              {/* EXPERIENCE PILL */}
              <div className="absolute -bottom-5 left-5 sm:left-7 bg-[#2563EB] text-white rounded-2xl shadow-lg px-6 py-4">
                <h3 className="text-2xl sm:text-3xl font-extrabold leading-none">
                  {about?.years_experience || "10+"}
                </h3>
                <p className="text-xs mt-1 text-white/90 font-medium">
                  {tr("about.yearsOfExcellence", "Years of Excellence", "ឆ្នាំនៃឧត្តមភាព")}
                </p>
              </div>
            </div>

            {/* CONTENT */}
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#2563EB]">
                {tr("about.whoWeAre", "WHO WE ARE", "SC ACADEMY")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5 mb-4">
                {tr("about.ourStory", "Our Story & Vision", "អំពីយើង")}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-6">
                {storyText}
              </p>

              {/* FEATURES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((item, index) => (
                  <div key={index} className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <FiCheckCircle className="text-[#2563EB] shrink-0" size={16} />
                    <span className="text-xs font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          MISSION & VISION
      ===================================================== */}
      <section className="bg-transparent py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <span className="text-[#2563EB] text-xs font-bold uppercase tracking-widest">
              {tr("about.ourPurpose", "Our Purpose", "គោលបំណងរបស់យើង")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
              {tr("about.missionVision", "Mission & Vision", "បេសកកម្ម និងចក្ខុវិស័យ")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MISSION */}
            <article className="card-lift bg-slate-950 text-white rounded-2xl border border-slate-800 p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#2563EB] flex items-center justify-center mb-5">
                <FiTarget size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {tr("about.mission", "Our Mission", "បេសកកម្មរបស់យើង")}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                {missionText}
              </p>
            </article>

            {/* VISION */}
            <article className="card-lift bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-5">
                <FiEye size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {tr("about.vision", "Our Vision", "ចក្ខុវិស័យរបស់យើង")}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                {visionText}
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ====================================================
          CORE VALUES
      ===================================================== */}
      <section className="bg-transparent py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <span className="text-[#2563EB] text-xs font-bold uppercase tracking-widest">
              {tr("about.whatWeBelieve", "What We Believe", "អ្វីដែលយើងជឿជាក់")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
              {tr("about.coreValues", "Core Values", "គុណតម្លៃស្នូល")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <article key={index} className="card-lift bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#2563EB] mx-auto mb-4 flex items-center justify-center">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{value.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================
          PRINCIPAL MESSAGE
      ===================================================== */}
      <section className="bg-transparent py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 p-8 sm:p-12 lg:p-14 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 lg:gap-12 items-center">
              {/* IMAGE */}
              <div className="relative max-w-[280px] mx-auto lg:mx-0 w-full">
                <div className="relative h-[320px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                  {about?.principal_image ? (
                    <img
                      src={getImageUrl(about.principal_image)}
                      alt={principalName}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                      <FiUsers size={56} className="mb-2" />
                      <span className="text-xs">{tr("about.principalPhoto", "Principal Photo", "រូបភាពនាយកសាលា")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* MESSAGE */}
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
                  {tr("about.principalMessage", "Principal's Message", "សារពីនាយកសាលា")}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
                  {tr("about.welcomeAcademy", "Welcome to SC Academy", "សូមស្វាគមន៍មកកាន់ SC Academy")}
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300 whitespace-pre-line mb-6">
                  "{principalMessage}"
                </p>
                <div className="border-t border-slate-800 pt-4">
                  <h3 className="text-sm font-bold text-white">{principalName}</h3>
                  <p className="text-xs text-[#2563EB] mt-0.5 font-medium">
                    {tr("about.principalOfAcademy", "Principal of SC Academy", "នាយកនៃ SC Academy")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          LEADERSHIP TEAM
      ===================================================== */}
      <section className="bg-transparent py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <span className="text-[#2563EB] text-xs font-bold uppercase tracking-widest">
              {tr("about.meetOurTeam", "Meet Our Team", "ស្គាល់ក្រុមការងាររបស់យើង")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
              {tr("about.leadershipTeam", "Our Leadership Team", "ក្រុមដឹកនាំរបស់យើង")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3">
              {tr(
                "about.leadershipDescription",
                "Meet the dedicated leaders who guide SC Academy and support our students, teachers, and community.",
                "ស្គាល់ក្រុមដឹកនាំដែលប្តេជ្ញាចិត្តក្នុងការដឹកនាំ SC Academy និងគាំទ្រសិស្ស គ្រូបង្រៀន និងសហគមន៍របស់យើង។"
              )}
            </p>
          </div>

          {leadership.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl py-12 px-5 text-center max-w-md mx-auto">
              <FiUsers size={36} className="mx-auto text-slate-400 mb-2" />
              <p className="text-xs text-slate-500">
                {tr("about.leadershipUnavailable", "Leadership information is not available at the moment.", "ព័ត៌មានក្រុមដឹកនាំមិនទាន់មាននៅពេលនេះទេ។")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {leadership.map((member) => {
                const memberName = localized(member, "name") || tr("about.leadershipMember", "Leadership Member", "សមាជិកក្រុមដឹកនាំ");
                const memberPosition = localized(member, "position") || localized(member, "role") || tr("about.leadershipMember", "Leadership Member", "សមាជិកក្រុមដឹកនាំ");
                const memberDescription = localized(member, "description");

                return (
                  <article key={member.id} className="card-lift bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-slate-300 transition-all duration-300">
                    <div className="relative h-[220px] bg-slate-100 overflow-hidden">
                      {member.image || member.image_url || member.photo ? (
                        <img
                          src={getImageUrl(member.image || member.image_url || member.photo)}
                          alt={memberName}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600">
                          <FiUsers size={40} />
                        </div>
                      )}
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{memberName}</h3>
                      <p className="text-[11px] text-[#2563EB] font-semibold mt-0.5 line-clamp-1">{memberPosition}</p>
                      {memberDescription && (
                        <p className="text-[11px] text-slate-500 leading-relaxed mt-2 line-clamp-2">{memberDescription}</p>
                      )}
                      {(member.email || member.phone) && (
                        <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-slate-100">
                          {member.email && (
                            <a href={`mailto:${member.email}`} className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-[#2563EB] hover:text-white transition" aria-label={`Email ${memberName}`}>
                              <FiMail size={12} />
                            </a>
                          )}
                          {member.phone && (
                            <a href={`tel:${member.phone}`} className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-[#2563EB] hover:text-white transition" aria-label={`Call ${memberName}`}>
                              <FiPhone size={12} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ====================================================
          BOTTOM CTA
      ===================================================== */}
      <section className="bg-transparent py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 p-8 md:p-14 text-center text-white shadow-xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
              {tr("about.buildingFuture", "Building Future Leaders", "កសាងអ្នកដឹកនាំនាពេលអនាគត")}
            </span>
            <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {tr("about.readyTitle", "Ready to Build Your Skills with Us?", "ត្រៀមខ្លួនពង្រឹងជំនាញរបស់អ្នកជាមួយយើង?")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl mx-auto mt-3">
              {tr(
                "about.buildingFutureDescription",
                "At SC Academy, we are committed to helping students build the knowledge, skills, confidence, and character they need to create a better future.",
                "នៅ SC Academy យើងប្តេជ្ញាជួយសិស្សកសាងចំណេះដឹង ជំនាញ ទំនុកចិត្ត និងអត្តចរិតដែលពួកគេត្រូវការ ដើម្បីបង្កើតអនាគតដ៏ប្រសើរ។"
              )}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link
                to="/courses"
                className="w-full sm:w-auto h-12 px-8 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
              >
                <span>{tr("common.ourCourses", "Explore Courses", "មើលវគ្គសិក្សាទាំងអស់")}</span>
                <FiArrowRight size={14} />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto h-12 px-8 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center transition-all"
              >
                {tr("common.contactUs", "Contact Us", "ទាក់ទងមកយើង")}
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>
    </main>
  );
};

export default About;