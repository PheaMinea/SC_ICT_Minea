import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaChalkboardTeacher,
  FaBookOpen,
  FaAward,
  FaBriefcase,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCompass,
  
  FaLaptopCode,
  FaChevronDown,
  FaChevronUp,
  FaUniversity } from "react-icons/fa";
import api from "../../services/api";
import { getImageUrl } from "../../utils/helpers";
import { useLanguage } from "../../context/LanguageContext";
import TypewriterText from "../common/TypewriterText";
import EmptyState from "../common/EmptyState";
import heroVideo from "./video/sc-academy.mp4";

const DEFAULT_IMG = "/default-avatar.png";

// ============================================================
// SCHOOL & ABOUT PAGE
// ============================================================
const School = () => {
  // ==========================================================
  // LANGUAGE
  // ==========================================================
  const { t, language } = useLanguage();
  const isKhmer = language === "km";

  // ==========================================================
  // STATES
  // ==========================================================
  const [schools, setSchools] = useState([]);
  const [showAllSchools, setShowAllSchools] = useState(false);
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  const INITIAL_SCHOOL_COUNT = 4;
  const visibleSchools = showAllSchools
    ? schools
    : schools.slice(0, INITIAL_SCHOOL_COUNT);

  // ==========================================================
  // TRANSLATION FALLBACK
  // ==========================================================
  const tr = (key, english, khmer) => {
    const value = t(key);
    return value && value !== key ? value : isKhmer ? khmer : english;
  };

  // ==========================================================
  // LOCALIZED API FIELD
  // ==========================================================
  const localized = (item, field, defaultValue = "") => {
    if (!item) return defaultValue;

    const selectedField = `${field}_${language}`;
    const englishField = `${field}_en`;
    const khmerField = `${field}_km`;

    if (item[selectedField]?.trim()) return item[selectedField];
    if (isKhmer && item[englishField]?.trim()) return item[englishField];
    if (!isKhmer && item[khmerField]?.trim()) return item[khmerField];
    if (item[field]?.trim()) return item[field];
    return defaultValue;
  };

  // ==========================================================
  // FETCH DATA
  // ==========================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const results = await Promise.allSettled([
          api.get("/api/schools/"),
          api.get("/api/about/"),
        ]);

        // 1. Schools
        if (results[0].status === "fulfilled") {
          const data = results[0].value.data;
          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.items)
            ? data.items
            : [];
          setSchools(list);
        } else {
          setSchools([]);
        }

        // 2. About Info
        if (results[1].status === "fulfilled") {
          const data = results[1].value.data;
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
      } catch (error) {
        console.error("Error fetching school & about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ==========================================================
  // ABOUT CONTENT
  // ==========================================================
  const getAboutContent = (field, translationKey, englishFallback, khmerFallback) => {
    const databaseValue = localized(about, field);
    if (databaseValue && String(databaseValue).trim() !== "") return databaseValue;
    return tr(translationKey, englishFallback, khmerFallback);
  };

  const storyParagraph1 = tr(
    "about.storyP1",
    "SC Academy is a technology training center that provides practical, industry-relevant education.",
    "SC Academy គឺជាមជ្ឈមណ្ឌលបណ្តុះបណ្តាលបច្ចេកវិទ្យា ដែលផ្តល់នូវការអប់រំអនុវត្តជាក់ស្តែង និងស្របតាមតម្រូវការទីផ្សារការងារ។"
  );

  const storyParagraph2 = tr(
    "about.storyP2",
    "We equip learners with digital skills and hands-on experience to succeed in today's workforce.",
    "យើងបំពាក់បំប៉នសិស្សានុសិស្សនូវជំនាញឌីជីថល និងបទពិសោធន៍អនុវត្តផ្ទាល់ ដើម្បីទទួលបានជោគជ័យក្នុងការងារបច្ចុប្បន្ន។"
  );

  const aboutFeatures = [
    {
      icon: FaBookOpen,
      en: "PRACTICAL TRAINING",
      km: "ការបណ្តុះបណ្តាលអនុវត្តផ្ទាល់",
      desc_en: "Hands-on projects & real-world digital skills",
      desc_km: "អនុវត្តផ្ទាល់លើគម្រោង និងជំនាញជាក់ស្ដែង" },
    {
      icon: FaChalkboardTeacher,
      en: "EXPERT INSTRUCTORS",
      km: "គ្រូបង្រៀនមានជំនាញច្បាស់លាស់",
      desc_en: "Learn from industry professionals",
      desc_km: "បង្ហាត់បង្រៀនដោយអ្នកជំនាញបច្ចេកវិទ្យា" },
    {
      icon: FaAward,
      en: "CERTIFICATE PROGRAMS",
      km: "កម្មវិធីទទួលស្គាល់ដោយវិញ្ញាបនបត្រ",
      desc_en: "Recognized official certifications",
      desc_km: "ទទួលបានវិញ្ញាបនបត្របញ្ជាក់សមត្ថភាពផ្លូវការ" },
    {
      icon: FaBriefcase,
      en: "CAREER SUPPORT",
      km: "ការគាំទ្រឱកាសការងារ",
      desc_en: "Internship & job placement pathways",
      desc_km: "ការតម្រង់ទិស និងឱកាសការងារ" },
  ];

  // ==========================================================
  // GET CAMPUS FEATURES
  // ==========================================================
  const getFeatures = (school) => {
    if (!school) return [];
    let features;
    if (language === "km") {
      features = school.features_km || school.features_en || school.features;
    } else {
      features = school.features_en || school.features_km || school.features;
    }
    if (!features) return [];

    if (Array.isArray(features)) {
      return features
        .map((item) => {
          if (typeof item === "string") return item.trim();
          if (typeof item === "object" && item !== null) {
            return (
              localized(item, "name") ||
              localized(item, "title") ||
              localized(item, "text") ||
              ""
            );
          }
          return "";
        })
        .filter(Boolean);
    }

    if (typeof features === "string") {
      const trimmed = features.trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            return parsed
              .map((item) => {
                if (typeof item === "string") return item.trim();
                if (typeof item === "object" && item !== null) {
                  return (
                    localized(item, "name") ||
                    localized(item, "title") ||
                    localized(item, "text") ||
                    ""
                  );
                }
                return "";
              })
              .filter(Boolean);
          }
        } catch (error) {
          console.warn("Invalid features JSON:", error);
        }
      }
      return trimmed
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-[#070D1F]">
        <div className="w-10 h-10 rounded-full border-[3px] border-blue-500/20 border-t-[#2563EB] animate-spin" />
      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================
  return (
    <main className={isKhmer ? "font-khmer" : ""}>
      <Helmet>
        <title>
          {tr("school.title", "Our School", "សាលារបស់យើង")} | SC Academy
        </title>
        <meta
          name="description"
          content={tr(
            "school.seoDescription",
            "Discover SC Academy schools, mission, vision, values, leadership and modern learning environments.",
            "ស្វែងយល់អំពីសាលារបស់ SC Academy បេសកកម្ម ចក្ខុវិស័យ គុណតម្លៃ ក្រុមដឹកនាំ និងបរិយាកាសសិក្សាទំនើប។"
          )}
        />
      </Helmet>

      {/* ======================================================
          1. HERO BANNER WITH VIDEO BACKGROUND
      ======================================================= */}
      <section className="relative min-h-[360px] sm:min-h-[420px] flex items-center overflow-hidden bg-slate-950 text-white border-b border-slate-800">
        {/* Background Looping Video */}
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
          {/* Soft Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full animate-text-focus">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md shadow-sm">
              {tr("school.heroLabel", "OUR SCHOOL", "សាលារបស់យើង")}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              {isKhmer ? (
                <>
                  ស្វែងយល់ពី{" "}
                  <TypewriterText
                    words={[
                      "សាលារបស់យើង (SC Academy)",
                      "ការអប់រំ និងបេសកកម្ម",
                      "បរិយាកាសសិក្សា និង Lab ទំនើប",
                      "ការកសាងអ្នកដឹកនាំជំនាន់ថ្មី",
                    ]}
                    highlightClassName="animated-gradient-text"
                  />
                </>
              ) : (
                <>
                  Discover Our{" "}
                  <TypewriterText
                    words={[
                      "Schools & Campuses",
                      "Mission & Vision",
                      "Modern Learning Spaces",
                      "Leadership Pathways",
                    ]}
                    highlightClassName="animated-gradient-text"
                  />
                </>
              )}
            </h1>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed max-w-2xl font-medium drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
              {tr(
                "school.heroDescription",
                "Since our establishment, SC Academy has been committed to providing quality education, practical digital skills, and empowering students to become future leaders.",
                "ចាប់តាំងពីការបង្កើតដំបូង SC Academy បានប្តេជ្ញាផ្តល់ការអប់រំប្រកបដោយគុណភាព អភិវឌ្ឍជំនាញអនុវត្តជាក់ស្តែង និងរៀបចំសិស្សឱ្យក្លាយជាអ្នកដឹកនាំនាពេលអនាគត។"
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          PAGE BODY WITH CONTINUOUS DOT MATRIX PATTERN
      ======================================================= */}
      <div className="relative w-full bg-dot-matrix-page overflow-hidden">
        {/* ====================================================
            2. ABOUT / WHO WE ARE & OUR STORY
        ===================================================== */}
        <section className="py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* IMAGE COLUMN (6 cols on lg - Wide view) */}
              <div className="lg:col-span-6 relative w-full">
                <div className="relative group rounded-xl overflow-hidden shadow-2xl shadow-slate-900/10 dark:shadow-black/50 border border-slate-200/90 dark:border-slate-800 bg-slate-950 w-full h-[380px] sm:h-[460px] lg:h-[540px]">
                  <img
                    src={getImageUrl(
                      about?.story_image || about?.image,
                      "/sc-academy-building.png"
                    )}
                    alt="SC Academy Campus"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/sc-academy-building.png";
                    }}
                  />
                </div>

                {/* EXPERIENCE FLOATING CARD */}
                <div className="absolute -bottom-5 left-4 sm:left-8 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-xl shadow-xl shadow-blue-600/30 p-4 sm:p-5 flex items-center gap-3.5 border border-blue-400/30 backdrop-blur-md z-10">
                  <div className="w-11 h-11 rounded-lg bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
                    <FaAward size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold leading-none tracking-tight">
                      {about?.years_experience || "10+"}
                    </div>
                    <p className="text-xs text-blue-100 font-semibold mt-1">
                      {tr("about.yearsOfExcellence", "Years of Excellence", "ឆ្នាំនៃឧត្តមភាព")}
                    </p>
                  </div>
                </div>
              </div>

              {/* CONTENT COLUMN (6 cols on lg) */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-[#2563EB] dark:text-blue-400 text-xs font-bold uppercase tracking-wider w-fit mb-3.5">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                  <span>{tr("about.badge", "ABOUT US", "អំពីយើង")}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                  SC ACADEMY
                </h2>

                <p className="text-base sm:text-lg text-slate-800 dark:text-slate-100 font-semibold leading-relaxed mb-3">
                  {storyParagraph1}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                  {storyParagraph2}
                </p>

                {/* 4 FEATURE CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                  {aboutFeatures.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={index}
                        className="group flex items-start gap-3.5 p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 shadow-xs"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-wide uppercase group-hover:text-[#2563EB] transition-colors line-clamp-1">
                            {isKhmer ? item.km : item.en}
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">
                            {isKhmer ? item.desc_km : item.desc_en}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Link
                    to="/courses"
                    className="h-11 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shadow-sm hover:shadow-md hover:shadow-blue-500/20 active:scale-95"
                  >
                    <span>{tr("common.ourCourses", "Explore Courses", "មើលវគ្គសិក្សាទាំងអស់")}</span>
                    <FaArrowRight size={13} />
                  </Link>
                  <Link
                    to="/contact"
                    className="h-11 px-6 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all hover:text-[#2563EB]"
                  >
                    <FaPhoneAlt size={13} className="text-[#2563EB]" />
                    <span>{tr("common.contactUs", "Contact Us", "ទាក់ទងមកយើង")}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            3. OUR SCHOOLS & CAMPUSES GRID (សាលារបស់យើង)
        ======================================================= */}
        <section className="bg-transparent py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
              <span className="text-[#2563EB] text-xs font-bold uppercase tracking-widest">
                {tr("school.campusesLabel", "LEARNING NETWORK", "បណ្តាញអប់រំ")}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1.5">
                {tr("school.ourSchools", "Our Schools & Campuses", "សាលារបស់យើង")}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                {tr(
                  "school.introDescription",
                  "Our schools provide supportive and modern learning environments with state-of-the-art facilities.",
                  "សាលារបស់យើងផ្តល់បរិយាកាសសិក្សាទំនើប និងមានការគាំទ្រ ជាមួយឧបករណ៍ និងបន្ទប់ Lab ស្ដង់ដារ។"
                )}
              </p>
            </div>

            {schools.length === 0 ? (
              <EmptyState
                icon={FaUniversity}
                title_km="មិនទាន់មានព័ត៌មានសាខាសាលានៅឡើយទេ"
                title_en="No Schools Available Yet"
                description_km="ព័ត៌មានសាខាសាលារៀន និងបន្ទប់អនុវត្តន៍បច្ចេកវិទ្យានឹងមានក្នុងពេលឆាប់ៗនេះ។"
                description_en="Campus and laboratory information will be available soon."
              />
            ) : (
              <>
                <div className="space-y-24 max-w-7xl mx-auto">
                  {visibleSchools.map((school, index) => {
                    const schoolName = localized(
                      school,
                      "name",
                      tr("school.defaultName", "SC Academy School", "សាលា SC Academy")
                    );
                    const schoolDescription = localized(
                      school,
                      "description",
                      ""
                    );
                    const rawTag = localized(school, "tag", "");
                    const schoolTag = rawTag ? rawTag.replace(/-/g, " ") : "";
                    const schoolAddress = localized(
                      school,
                      "address",
                      tr("school.defaultAddress", "14 Street 349, Toul Kork, Phnom Penh", "ផ្ទះលេខ ១៤ ផ្លូវ ៣៤៩ ខណ្ឌទួលគោក រាជធានីភ្នំពេញ")
                    );
                    const isEven = index % 2 === 0;
                    const features = Array.isArray(getFeatures(school)) ? getFeatures(school) : [];

                    return (
                      <div
                        key={school.id || index}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
                      >
                        {/* IMAGE COLUMN (Alternates order on desktop) */}
                        <div className={`lg:col-span-6 relative w-full ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                          <div className="relative group rounded-xl overflow-hidden shadow-2xl shadow-slate-900/10 dark:shadow-black/50 border border-slate-200/90 dark:border-slate-800 bg-slate-950 w-full h-[360px] sm:h-[440px] lg:h-[480px]">
                            <img
                              src={getImageUrl(school.image || school.image_url, DEFAULT_IMG)}
                              alt={schoolName}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = DEFAULT_IMG;
                              }}
                            />
                            {school.acronym && (
                              <div className="absolute top-4 right-4 z-10">
                                <span className="px-3 py-1.5 rounded-md bg-[#2563EB] text-white text-xs font-extrabold uppercase tracking-wider shadow-md shadow-blue-500/30">
                                  {school.acronym}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* CONTENT COLUMN (Alternates order on desktop) */}
                        <div className={`lg:col-span-6 flex flex-col justify-center ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                          {schoolAddress && (
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-[#2563EB] dark:text-blue-400 text-xs font-bold uppercase tracking-wider w-fit mb-3.5">
                              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                              <span className="flex items-center gap-1.5">
                                <FaMapMarkerAlt size={11} />
                                {schoolAddress}
                              </span>
                            </div>
                          )}

                          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                            {schoolName}
                          </h2>

                          {schoolDescription && (
                            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 font-normal leading-relaxed mb-6">
                              {schoolDescription}
                            </p>
                          )}

                          {/* CAMPUS FEATURES / HIGHLIGHTS CARDS FROM DATABASE */}
                          {features.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                              {features.map((featureText, fIndex) => (
                                <div
                                  key={fIndex}
                                  className="group flex items-start gap-3.5 p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 shadow-xs"
                                >
                                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
                                    <FaCheckCircle size={16} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-[#2563EB] transition-colors leading-snug">
                                      {featureText}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* ACTION BUTTONS */}
                          <div className="flex flex-wrap items-center gap-3 pt-1">
                            <Link
                              to="/contact"
                              className="h-11 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shadow-sm hover:shadow-md hover:shadow-blue-500/20 active:scale-95"
                            >
                              <span>{tr("common.contactUs", "Contact Us", "ទាក់ទងមកយើង")}</span>
                              <FaArrowRight size={13} />
                            </Link>
                            {school.phone && (
                              <a
                                href={`tel:${school.phone}`}
                                className="h-11 px-6 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all hover:text-[#2563EB]"
                              >
                                <FaPhoneAlt size={13} className="text-[#2563EB]" />
                                <span>{school.phone}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* VIEW ALL / COLLAPSE TOGGLE BUTTON */}
                {schools.length > INITIAL_SCHOOL_COUNT && (
                  <div className="mt-10 flex flex-col items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAllSchools(!showAllSchools)}
                      className="h-11 px-7 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 text-[#2563EB] dark:text-blue-400 text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-95 cursor-pointer"
                    >
                      <span>
                        {showAllSchools
                          ? tr("school.showLess", "Show Less Campuses", "បង្រួមសាខា")
                          : tr(
                              "school.viewAllCampuses",
                              `View All Campuses (${schools.length})`,
                              `មើលសាខាទាំងអស់ (${schools.length})`
                            )}
                      </span>
                      {showAllSchools ? (
                        <FaChevronUp size={13} />
                      ) : (
                        <FaChevronDown size={13} />
                      )}
                    </button>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {showAllSchools
                        ? tr("school.showingAll", `Showing all ${schools.length} campuses`, `បង្ហាញទាំងអស់ ${schools.length} សាខា`)
                        : tr("school.showingCount", `Showing ${INITIAL_SCHOOL_COUNT} of ${schools.length} campuses`, `បង្ហាញ ${INITIAL_SCHOOL_COUNT} ក្នុងចំណោម ${schools.length} សាខា`)}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ====================================================
            4. OUR VISION & MISSION STATEMENTS
        ===================================================== */}
        <section className="py-12 md:py-16 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* 1. OUR MISSION CARD (Top) */}
            <div className="relative overflow-hidden rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 lg:p-12 shadow-lg shadow-slate-900/5">
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-b-sm" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* LEFT: TEXT & 3 MISSION PILLARS */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                  {/* Eyebrow */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-[#2563EB] dark:text-blue-400 text-xs font-bold uppercase tracking-wider w-fit mb-3.5">
                    <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                    <span>{tr("about.missionBadge", "OUR MISSION", "បេសកកម្មរបស់យើង")}</span>
                  </div>

                  {/* Main Heading */}
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3 leading-snug">
                    {isKhmer ? "បេសកកម្មនៃការបណ្តុះបណ្តាល" : "Our Mission"}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    {isKhmer
                      ? "ការប្តេជ្ញាចិត្តរបស់យើងក្នុងការផ្តល់នូវការអប់រំបច្ចេកវិទ្យាប្រកបដោយគុណភាពខ្ពស់ និងប្រសិទ្ធភាព"
                      : "Our commitment to delivering high-quality, practical, and workforce-aligned technology education."}
                  </p>

                  {/* 3 MISSION PILLARS LIST */}
                  <div className="space-y-3.5">
                    <div className="group flex items-start gap-4 p-4 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                      <div className="w-11 h-11 rounded-md bg-blue-100 dark:bg-blue-900/40 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
                        <FaBookOpen size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mb-1 group-hover:text-[#2563EB] transition-colors">
                          {isKhmer ? "ការបណ្តុះបណ្តាលមានរចនាសម្ព័ន្ធ" : "Structured & Effective Training"}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {isKhmer
                            ? "ផ្តល់នូវការបណ្តុះបណ្តាលបច្ចេកវិទ្យាប្រកបដោយរចនាសម្ព័ន្ធច្បាស់លាស់ និងមានប្រសិទ្ធភាពខ្ពស់។"
                            : "Providing structured and effective technology training."}
                        </p>
                      </div>
                    </div>

                    <div className="group flex items-start gap-4 p-4 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                      <div className="w-11 h-11 rounded-md bg-blue-100 dark:bg-blue-900/40 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
                        <FaLaptopCode size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mb-1 group-hover:text-[#2563EB] transition-colors">
                          {isKhmer ? "ជំនាញអនុវត្តជាក់ស្តែង" : "Hands-on Practical Skills"}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {isKhmer
                            ? "ផ្តោតលើជំនាញអនុវត្តផ្ទាល់ ដែលអ្នកសិក្សាអាចយកទៅប្រើប្រាស់ក្នុងស្ថានភាពជាក់ស្តែងបានភ្លាមៗ។"
                            : "Focusing on hands-on skills that learners can apply in real situations."}
                        </p>
                      </div>
                    </div>

                    <div className="group flex items-start gap-4 p-4 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                      <div className="w-11 h-11 rounded-md bg-blue-100 dark:bg-blue-900/40 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
                        <FaBriefcase size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mb-1 group-hover:text-[#2563EB] transition-colors">
                          {isKhmer ? "ការត្រៀមខ្លួនសម្រាប់ទីផ្សារការងារ" : "Workplace-Ready Skills"}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {isKhmer
                            ? "បំពាក់បំប៉នអ្នកសិក្សានូវជំនាញដែលឆ្លើយតបទៅនឹងតម្រូវការជាក់ស្តែងនៃទីផ្សារការងារបច្ចុប្បន្ន។"
                            : "Preparing learners with relevant skills aligned with today's workplace."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: 4 PHOTO CARDS (2x2 Grid) */}
                <div className="lg:col-span-5 relative">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {/* PHOTO 1 - SC Academy Entrance */}
                    <div className="relative group rounded-md overflow-hidden shadow-md border border-slate-200/90 dark:border-slate-800 bg-slate-900 aspect-square">
                      <img
                        src="/sc-mission-1.png"
                        alt="SC Academy Campus Entrance"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DEFAULT_IMG;
                        }}
                      />
                    </div>

                    {/* PHOTO 2 - Modern Computer Lab */}
                    <div className="relative group rounded-md overflow-hidden shadow-md border border-slate-200/90 dark:border-slate-800 bg-slate-900 aspect-square">
                      <img
                        src="/sc-mission-2.png"
                        alt="Modern Computer Lab"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DEFAULT_IMG;
                        }}
                      />
                    </div>

                    {/* PHOTO 3 - Workshop & Meeting Session */}
                    <div className="relative group rounded-md overflow-hidden shadow-md border border-slate-200/90 dark:border-slate-800 bg-slate-900 aspect-square">
                      <img
                        src="/sc-mission-3.png"
                        alt="Workshop & Training Session"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DEFAULT_IMG;
                        }}
                      />
                    </div>

                    {/* PHOTO 4 - Students & Learners Classroom */}
                    <div className="relative group rounded-md overflow-hidden shadow-md border border-slate-200/90 dark:border-slate-800 bg-slate-900 aspect-square">
                      <img
                        src="/sc-mission-4.png"
                        alt="Student Learning Environment"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DEFAULT_IMG;
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. OUR VISION CARD (Bottom) */}
            <div className="relative overflow-hidden rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-8 sm:p-12 lg:p-16 shadow-lg shadow-slate-900/5 text-center">
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-b-sm" />

              <div className="flex flex-col items-center">
                {/* Vision Icon Badge */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 flex items-center justify-center mb-5 border border-blue-100 dark:border-blue-800/40 shadow-xs">
                  <FaCompass size={26} />
                </div>

                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-[#2563EB] dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3.5">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                  <span>{tr("about.visionBadge", "OUR VISION", "ចក្ខុវិស័យរបស់យើង")}</span>
                </div>

                {/* Main Heading */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5 leading-snug">
                  {isKhmer ? "ចក្ខុវិស័យឆ្ពោះទៅអនាគត" : "Our Vision"}
                </h2>

                {/* Vision Statement Copy */}
                <p className="text-base sm:text-lg lg:text-xl text-slate-700 dark:text-slate-200 leading-relaxed font-normal max-w-4xl lg:max-w-5xl mx-auto mb-8">
                  {isKhmer
                    ? "«ចក្ខុវិស័យរបស់យើងគឺក្លាយជាបណ្ឌិត្យសភាបច្ចេកវិទ្យាឈានមុខគេនៅកម្ពុជា តាមរយៈការផ្តល់ជូនអ្នកសិក្សានូវជំនាញឌីជីថលស្របតាមតម្រូវការទីផ្សារ ចំណេះដឹងអនុវត្តជាក់ស្តែង និងទំនុកចិត្តក្នុងការរីកចម្រើន និងទទួលបានជោគជ័យក្នុងពិភពឌីជីថលដែលកំពុងវិវឌ្ឍយ៉ាងឆាប់រហ័ស។»"
                    : '“Our vision is to become Cambodia’s leading technology academy by providing learners with industry-relevant digital skills, practical knowledge, and the confidence to grow and succeed in a rapidly evolving digital world.”'}
                </p>

                {/* 2 PHOTO CARDS (BELOW VISION TEXT) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 w-full max-w-5xl mx-auto">
                  <div className="relative group rounded-lg overflow-hidden shadow-md border border-slate-200/90 dark:border-slate-800 bg-slate-900 aspect-[16/10] sm:aspect-[16/9]">
                    <img
                      src="/sc-vision-1.png"
                      alt="SC Academy Tech Training Classroom"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_IMG;
                      }}
                    />
                  </div>

                  <div className="relative group rounded-lg overflow-hidden shadow-md border border-slate-200/90 dark:border-slate-800 bg-slate-900 aspect-[16/10] sm:aspect-[16/9]">
                    <img
                      src="/sc-vision-2.png"
                      alt="SC Academy Students Success"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_IMG;
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default School;
