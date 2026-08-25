import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";

import {
  FiBookOpen,
  FiClock,
  FiUsers,
  FiArrowRight,
  FiSearch,
} from "react-icons/fi";

import api from "../../services/api";
import { getImageUrl } from "../../utils/helpers";
import { useLanguage } from "../../context/LanguageContext";
import heroVideo from "./video/sc-academy.mp4";

// =====================================================
// TELEGRAM
// =====================================================
const TELEGRAM_USERNAME = "SC_Academy";
const INITIAL_COURSES_COUNT = 6;

const Courses = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { t, language } = useLanguage();
  const isKhmer = language === "km";

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [filters, setFilters] = useState({
    category: "All",
    rating: 0
  });

  const tr = (key, english, khmer) => {
    const value = t(key);
    return (value && value !== key) ? value : (isKhmer ? khmer : english);
  };

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

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/courses/");
      const data = Array.isArray(response.data) ? response.data : (Array.isArray(response.data?.items) ? response.data.items : []);
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const getCourseImage = (course) => course?.image_url || course?.image || course?.thumbnail || "";

  // Filter Logic
  const filteredCourses = courses.filter(course => {
    const title = localized(course, "title", "").toLowerCase();
    const desc = localized(course, "description", "").toLowerCase();
    const searchMatch = !searchTerm || title.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
    
    const categoryMatch = filters.category === "All" || course.category === filters.category;
    
    return searchMatch && categoryMatch;
  });

  const visibleCourses = showAllCourses
    ? filteredCourses
    : filteredCourses.slice(0, INITIAL_COURSES_COUNT);

  useEffect(() => {
    setShowAllCourses(false);
  }, [searchTerm, filters.category]);

  const navigateToCourseDetail = (courseId) => navigate(`/courses/${courseId}`);

  const openTelegramEnroll = (course) => {
    const courseTitle = localized(course, "title", "SC Academy Program");
    const message = `សួស្តី Admin ខ្ញុំចង់ចុះឈ្មោះវគ្គសិក្សា ${courseTitle}`;
    const telegramUrl = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Helmet>
        <title>{tr("courses.pageTitle", "SC Academy Programs | Learn and Grow", "វគ្គសិក្សា SC Academy | រៀន និងអភិវឌ្ឍ")}</title>
        <meta name="description" content={tr("courses.seoDescription", "Explore available programs at SC Academy.", "ស្វែងយល់ពីវគ្គសិក្សា និងកម្មវិធីសិក្សាដែលមាននៅ SC Academy។")} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "SC Academy",
            "url": "https://scacademy.edu.kh",
            "description": "Leading technology training academy in Cambodia offering Full-Stack Web Dev, Graphic Design, Video Editing, and IT Network Administration."
          })}
        </script>
      </Helmet>

      {/* HERO SECTION WITH VIDEO BACKGROUND */}
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
              {tr("courses.badge", "ACCREDITED IT PROGRAMS", "កម្មវិធីសិក្សាជំនាញបច្ចេកវិទ្យា")}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              {tr("courses.heroTitle", "Learn, Grow & Build Your Future", "រៀន អភិវឌ្ឍ និងកសាងអនាគតរបស់អ្នក")}
            </h1>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed max-w-2xl font-medium drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
              {tr("courses.heroDescription", "Practical, job-ready programs taught by industry mentors. Master hands-on skills with 100% practical lab experience.", "កម្មវិធីសិក្សាជាក់ស្ដែងដែលបង្រៀនដោយគ្រូជំនាញ ដើម្បីត្រៀមខ្លួនសម្រាប់ទីផ្សារការងារ។")}
            </p>
          </div>
        </div>
      </section>

      {/* MAIN SECTION */}
      <section className={`bg-[#F8FAFC] py-12 md:py-16 ${isKhmer ? "font-khmer" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filter Bar & Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-1 items-center gap-3 w-full">
              <div className="relative w-full sm:max-w-md">
                <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={17} />
                <input 
                  type="text" 
                  placeholder={tr("courses.search", "Search courses, topics, or skills...", "ស្វែងរកវគ្គសិក្សា ឬជំនាញ...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition"
                />
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
              <span className="text-xs font-semibold text-slate-500">
                {tr("courses.showing", "Showing", "បង្ហាញ")} <b className="text-slate-900">{filteredCourses.length}</b> {tr("courses.results", "programs", "វគ្គសិក្សា")}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* SIDEBAR FILTERS */}
            <div className="w-full lg:w-[260px] flex-shrink-0 space-y-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-4">{tr("courses.categories", "Categories", "ប្រភេទ")}</h3>
                <div className="space-y-3">
                  {["All", "Web Development", "Graphic Design", "Video Editing", "Network & IT", "Administration"].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category" 
                        value={cat}
                        checked={filters.category === cat}
                        onChange={() => setFilters({...filters, category: cat})}
                        className="w-4 h-4 text-[#2563EB] focus:ring-[#2563EB] border-slate-300"
                      />
                      <span className="text-xs font-medium text-slate-700 group-hover:text-[#2563EB] transition">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* COURSE GRID - 3 CARDS IN 1 ROW (DESKTOP) */}
            <div className="flex-1">
              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full border-3 border-slate-200 border-t-[#2563EB] animate-spin" />
                  <p className="mt-3 text-xs text-slate-500 font-medium">{tr("courses.loading", "Loading programs...", "កំពុងផ្ទុកវគ្គសិក្សា...")}</p>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl py-16 px-5 text-center shadow-sm">
                  <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-xl flex items-center justify-center">
                    <FiBookOpen size={22} className="text-[#2563EB]" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{tr("courses.noCourses", "No Programs Found", "មិនមានវគ្គសិក្សា")}</h3>
                  <p className="text-xs text-slate-500 mt-1.5">{tr("courses.noCoursesDescription", "Try adjusting your search or filters.", "សូមព្យាយាមកែតម្រូវតម្រងរបស់អ្នក។")}</p>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleCourses.map((course, index) => {
                      const courseImage = getCourseImage(course);
                      const courseTitle = localized(course, "title", "SC Academy Program");
                      const courseLevel = localized(course, "level", "All Levels");
                      const courseDuration = localized(course, "duration", "Flexible");

                      return (
                        <article key={course.id || index} className="card-lift group flex h-full flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md">
                          {/* Course Thumbnail */}
                          <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                            <img 
                              src={getImageUrl(courseImage) || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=700&q=80"} 
                              alt={courseTitle}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=700&q=80"; }}
                            />
                            <span className="absolute top-3 left-3 bg-[#2563EB] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                              {courseLevel}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex flex-grow flex-col p-5">
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2.5">
                              <span className="flex items-center gap-1">
                                <FiClock className="w-3 h-3 text-slate-400" />
                                {courseDuration}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiUsers className="w-3 h-3 text-slate-400" />
                                {courseLevel}
                              </span>
                            </div>

                            <button type="button" onClick={() => navigateToCourseDetail(course.id)} className="text-left focus:outline-none">
                              <h3 className="mb-2.5 line-clamp-2 text-base font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">{courseTitle}</h3>
                            </button>

                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                              {localized(course, "description") || "Practical step-by-step hands-on training."}
                            </p>

                            <div className="flex-grow" />

                            <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2.5">
                              <button 
                                type="button" 
                                onClick={() => openTelegramEnroll(course)} 
                                className="flex-1 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                              >
                                {tr("courses.enroll", "Enroll Now", "ចុះឈ្មោះ")}
                              </button>
                              <button
                                type="button"
                                onClick={() => navigateToCourseDetail(course.id)}
                                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                              >
                                {tr("common.details", "Details", "លម្អិត")}
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {filteredCourses.length > INITIAL_COURSES_COUNT && (
                    <div className="mt-10 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setShowAllCourses((current) => !current)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
                        aria-expanded={showAllCourses}
                      >
                        {showAllCourses
                          ? tr("courses.showLess", "Show Less", "បង្ហាញតិច")
                          : tr("courses.viewMore", "View More", "មើលទាំងអស់")}
                        <FiArrowRight className={`transition-transform duration-300 ${showAllCourses ? "-rotate-90" : "rotate-90"}`} size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Courses;