import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import {
  FiArrowRight,
  FiCheck,
  FiUsers,
  FiBookOpen,
  FiAward,
  FiCalendar,
} from "react-icons/fi";

import api from "../../services/api";
import { getImageUrl } from "../../utils/helpers";
import { useLanguage } from "../../context/LanguageContext";
import heroVideo from "./video/sc-academy.mp4";

const DEFAULT_IMG = "/default-avatar.png";

// =====================================================
// COUNT-UP ANIMATION (SMOOTH 60FPS ON SCROLL)
// =====================================================
const CountUp = ({ end, duration = 1600, suffix = "", prefix = "" }) => {
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

// ============================================================
// SCHOOL PAGE (REFINED & ENLARGED)
// ============================================================
const School = () => {

  // ==========================================================
  // LANGUAGE
  // ==========================================================
  const { t, language } = useLanguage();
  const isKhmer = language === "km";

  // ==========================================================
  // STATE
  // ==========================================================
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // TRANSLATION FALLBACK
  // ==========================================================
  const tr = (key, english, khmer) => {
    const value = t(key);
    return (value && value !== key) ? value : (isKhmer ? khmer : english);
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
  // FETCH SCHOOLS
  // ==========================================================
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/schools/");
        const data = response.data;
        setSchools(
          Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : [])
        );
      } catch (error) {
        console.error("Error fetching schools:", error);
        setSchools([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSchools();
  }, []);

  // ==========================================================
  // GET FEATURES
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
      return features.map((item) => {
        if (typeof item === "string") return item.trim();
        if (typeof item === "object" && item !== null) {
          return localized(item, "name") || localized(item, "title") || localized(item, "text") || "";
        }
        return "";
      }).filter(Boolean);
    }

    if (typeof features === "string") {
      const trimmed = features.trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            return parsed.map((item) => {
              if (typeof item === "string") return item.trim();
              if (typeof item === "object" && item !== null) {
                return localized(item, "name") || localized(item, "title") || localized(item, "text") || "";
              }
              return "";
            }).filter(Boolean);
          }
        } catch (error) {
          console.warn("Invalid features JSON:", error);
        }
      }
      return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
    }
    return [];
  };

  // ==========================================================
  // RETURN
  // ==========================================================
  return (
    <>
      <Helmet>
        <title>
          {tr("school.title", "Our School", "សាលារបស់យើង")} | SC Academy
        </title>
        <meta
          name="description"
          content={tr(
            "school.seoDescription",
            "Discover SC Academy schools, educational programmes, learning environments and opportunities.",
            "ស្វែងយល់អំពីសាលារបស់ SC Academy កម្មវិធីអប់រំ បរិយាកាសសិក្សា និងឱកាសសម្រាប់សិស្សានុសិស្ស។"
          )}
        />
      </Helmet>

      {/* ======================================================
          HERO WITH VIDEO BACKGROUND
      ======================================================= */}
      <section className={`relative min-h-[360px] sm:min-h-[420px] flex items-center overflow-hidden bg-slate-950 text-white border-b border-slate-800 ${isKhmer ? "font-khmer" : ""}`}>
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md shadow-sm">
              🏫 {tr("school.heroLabel", "OUR CAMPUSES", "សាលារបស់យើង")}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              {tr("school.heroTitle", "Discover Our Schools & Campuses", "ស្វែងយល់ពីសាលារបស់យើង")}
            </h1>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed max-w-2xl font-medium drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
              {tr(
                "school.heroDescription",
                "Since the establishment of our first school, we have been committed to providing quality education, developing skills and preparing students to become future leaders.",
                "ចាប់តាំងពីការបង្កើតសាលាដំបូងរបស់យើង យើងបានប្តេជ្ញាផ្តល់ការអប់រំប្រកបដោយគុណភាព អភិវឌ្ឍជំនាញ និងរៀបចំសិស្សឱ្យក្លាយជាអ្នកដឹកនាំនាពេលអនាគត។"
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          INTRODUCTION
      ======================================================= */}
      <section className={`bg-white py-12 md:py-16 ${isKhmer ? "font-khmer" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[#2563EB] text-xs font-bold uppercase tracking-widest">SC ACADEMY NETWORK</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
              {tr("school.buildingFuture", "Building a Better Future Through Education", "កសាងអនាគតដ៏ប្រសើរតាមរយៈការអប់រំ")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3">
              {tr(
                "school.introDescription",
                "Our schools provide supportive and modern learning environments where students can build academic knowledge, practical skills and strong character.",
                "សាលារបស់យើងផ្តល់បរិយាកាសសិក្សាទំនើប និងមានការគាំទ្រ ដែលសិស្សអាចអភិវឌ្ឍចំណេះដឹង ជំនាញអនុវត្ត និងអត្តចរិតរឹងមាំ។"
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          OUR SCHOOLS GRID (2 Columns)
      ======================================================= */}
      <section className={`bg-[#F8FAFC] py-12 md:py-16 border-t border-slate-200 ${isKhmer ? "font-khmer" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-lg font-bold text-slate-900 whitespace-nowrap">
              {tr("school.ourSchools", "Our Schools", "សាលារបស់យើង")}
            </h2>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full border-3 border-slate-200 border-t-[#2563EB] animate-spin" />
              <p className="mt-3 text-xs text-slate-500 font-medium">
                {tr("school.loading", "Loading schools...", "កំពុងផ្ទុកព័ត៌មានសាលា...")}
              </p>
            </div>
          ) : schools.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center shadow-sm">
              <div className="text-4xl mb-3">🏫</div>
              <h3 className="text-base font-bold text-slate-900">
                {tr("school.noSchools", "No Schools Available", "មិនមានព័ត៌មានសាលារៀន")}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {tr("school.noSchoolsDescription", "School information will be available soon.", "ព័ត៌មានសាលារៀននឹងមានក្នុងពេលឆាប់ៗនេះ។")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {schools.map((school, index) => {
                const schoolName = localized(school, "name", tr("school.defaultName", "SC Academy School", "សាលា SC Academy"));
                const schoolDescription = localized(school, "description", tr("school.defaultDescription", "Learn more about this SC Academy school.", "ស្វែងយល់បន្ថែមអំពីសាលា SC Academy នេះ។"));
                const schoolTag = localized(school, "tag", "");
                const features = getFeatures(school).slice(0, 4);

                return (
                  <article key={school.id || index} className="card-lift group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-slate-300 transition-all duration-300 flex flex-col">
                    
                    {/* IMAGE */}
                    <div className="relative w-full h-[240px] md:h-[260px] overflow-hidden bg-slate-100">
                      <img
                        src={getImageUrl(school.image || school.image_url, DEFAULT_IMG)}
                        alt={schoolName}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DEFAULT_IMG;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center flex-wrap gap-2">
                        {school.acronym && (
                          <span className="px-3 py-1 bg-[#2563EB] text-white text-[10px] font-bold uppercase rounded-md shadow-sm">
                            {school.acronym}
                          </span>
                        )}
                        {schoolTag && (
                          <span className="px-3 py-1 bg-white/95 text-slate-900 text-[10px] font-bold rounded-md shadow-sm">
                            {schoolTag}
                          </span>
                        )}
                      </div>

                      {/* School Name Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <span className="block text-slate-300 text-[10px] font-semibold uppercase tracking-wider">
                          {tr("school.schoolLabel", "SC Academy Campus", "សាខា SC Academy")} #{String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-xl font-bold text-white leading-tight truncate mt-0.5">
                          {schoolName}
                        </h3>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-6 flex flex-col flex-grow">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-5">
                        {schoolDescription}
                      </p>

                      {/* Features */}
                      {features.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 mb-6">
                          {features.map((feature, featureIndex) => (
                            <div key={`${school.id || index}-${featureIndex}`} className="flex items-center min-w-0">
                              <FiCheck className="text-[#2563EB] mr-2 shrink-0" size={15} />
                              <span className="text-xs font-medium text-slate-700 truncate">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex-grow" />
                      <div className="h-px bg-slate-100 mb-4" />

                      {/* Footer Action */}
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-400 font-medium">
                          SC Academy Official Campus
                        </span>
                        <Link
                          to="/contact"
                          className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-sm"
                        >
                          <span>{tr("common.contactUs", "Contact Us", "ទាក់ទងមកយើង")}</span>
                          <FiArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ======================================================
          ACHIEVEMENTS
      ======================================================= */}
      <section className={`bg-white py-12 md:py-16 ${isKhmer ? "font-khmer" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <span className="text-[#2563EB] text-xs font-bold uppercase tracking-widest">
              {tr("school.achievement", "Our Milestones", "សមិទ្ធផលរបស់យើង")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
              {tr("school.growingTogether", "Growing Together for Quality Education", "រីកចម្រើនជាមួយគ្នាដើម្បីការអប់រំ")}
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* STUDENTS */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center card-lift">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 text-[#2563EB] rounded-xl flex items-center justify-center">
                <FiUsers size={20} />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-slate-900">
                <CountUp end={15000} duration={1800} suffix="+" />
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                {tr("home.students", "Graduated Students", "សិស្សបញ្ចប់ការសិក្សា")}
              </p>
            </div>

            {/* SCHOOLS */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center card-lift">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 text-[#2563EB] rounded-xl flex items-center justify-center">
                <FiBookOpen size={20} />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-slate-900">
                <CountUp end={20} duration={1400} suffix="+" />
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                {tr("school.schools", "Learning Programs", "វគ្គសិក្សាស្ដង់ដារ")}
              </p>
            </div>

            {/* TEACHERS */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center card-lift">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 text-[#2563EB] rounded-xl flex items-center justify-center">
                <FiAward size={20} />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-slate-900">
                <CountUp end={100} duration={1600} suffix="%" />
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                {tr("school.teachers", "Expert Mentors", "គ្រូជំនាញបច្ចេកវិទ្យា")}
              </p>
            </div>

            {/* ESTABLISHED */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center card-lift">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 text-[#2563EB] rounded-xl flex items-center justify-center">
                <FiCalendar size={20} />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-slate-900">
                <CountUp end={2020} duration={1600} suffix="" />
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                {tr("school.established", "Established", "បង្កើតឡើង")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          FINAL CTA
      ======================================================= */}
      <section className={`bg-[#F8FAFC] py-14 md:py-20 border-t border-slate-200 ${isKhmer ? "font-khmer" : ""}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 p-8 md:p-14 text-center text-white shadow-xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
              {tr("school.joinAcademy", "Join SC Academy", "ចូលរួមជាមួយ SC Academy")}
            </span>
            <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {tr("school.findRightSchool", "Find the Right Campus & Program for Your Future", "ស្វែងរកសាខា និងវគ្គសិក្សាដែលសក្តិសមសម្រាប់អ្នក")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl mx-auto mt-3">
              {tr(
                "school.ctaDescription",
                "Discover a supportive learning environment where students build practical knowledge, job skills and long-term career readiness.",
                "ស្វែងរកបរិយាកាសសិក្សាដែលមានការគាំទ្រ ដែលសិស្សអាចកសាងចំណេះដឹង អភិវឌ្ឍជំនាញ និងត្រៀមខ្លួនសម្រាប់អនាគតដ៏ជោគជ័យ។"
              )}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link
                to="/contact"
                className="w-full sm:w-auto h-12 px-8 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
              >
                <span>{tr("common.contactUs", "Contact Us", "ទាក់ទងមកយើង")}</span>
                <FiArrowRight size={14} />
              </Link>
              <Link
                to="/courses"
                className="w-full sm:w-auto h-12 px-8 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center transition-all"
              >
                {tr("school.ourPrograms", "Explore Programs", "ស្វែងយល់វគ្គសិក្សា")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default School;
