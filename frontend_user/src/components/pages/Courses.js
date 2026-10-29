import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

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
import TypewriterText from "../common/TypewriterText";
import EmptyState from "../common/EmptyState";
import heroVideo from "./video/sc-academy.mp4";

// =====================================================
// TELEGRAM & CURRICULUM
// =====================================================
const TELEGRAM_USERNAME = "SC_Academy";
const INITIAL_COURSES_COUNT = 6;

const COURSE_CATEGORIES = [
  { id: "All", labelEn: "All Courses", labelKm: "វគ្គសិក្សាទាំងអស់" },
  { id: "Microsoft Office", labelEn: "Microsoft Office", labelKm: "Microsoft Office" },
  { id: "Advanced Excel", labelEn: "Advanced Excel", labelKm: "Advanced Excel" },
  { id: "Graphic Design", labelEn: "Graphic Design", labelKm: "Graphic Design" },
  { id: "Video Editing", labelEn: "Video Editing", labelKm: "Video Editing" },
  { id: "Motion Graphic", labelEn: "Motion Graphic", labelKm: "Motion Graphic" },
  { id: "Digital Marketing", labelEn: "Digital Marketing", labelKm: "Digital Marketing" },
  { id: "IT Support", labelEn: "IT Support", labelKm: "IT Support" },
  { id: "UX/UI Design", labelEn: "UX/UI Design", labelKm: "UX/UI Design" },
];

const Courses = () => {
  const navigate = useNavigate();

  const { t, language } = useLanguage();
  const isKhmer = language === "km";

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [filters, setFilters] = useState({
    category: "All",
    rating: 0,
  });

  const tr = (key, english, khmer) => {
    const value = t(key);
    return value && value !== key ? value : isKhmer ? khmer : english;
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
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.items)
        ? response.data.items
        : [];
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const getCourseImage = (course) =>
    course?.image_url || course?.image || course?.thumbnail || "";

  // Filter Logic
  const filteredCourses = courses.filter((course) => {
    const title = localized(course, "title", "").toLowerCase();
    const desc = localized(course, "description", "").toLowerCase();
    const cat = (course.category || "").toLowerCase();
    const catEn = (course.category_en || "").toLowerCase();
    const catKm = (course.category_km || "").toLowerCase();

    const searchMatch =
      !searchTerm ||
      title.includes(searchTerm.toLowerCase()) ||
      desc.includes(searchTerm.toLowerCase()) ||
      cat.includes(searchTerm.toLowerCase());

    if (!searchMatch) return false;
    if (filters.category === "All") return true;

    const selectedCat = filters.category.toLowerCase();
    return (
      cat.includes(selectedCat) ||
      catEn.includes(selectedCat) ||
      catKm.includes(selectedCat) ||
      title.includes(selectedCat) ||
      (selectedCat.includes("video") && (cat.includes("video") || title.includes("video") || title.includes("premiere") || title.includes("color"))) ||
      (selectedCat.includes("excel") && (cat.includes("excel") || title.includes("excel") || title.includes("office"))) ||
      (selectedCat.includes("office") && (cat.includes("office") || title.includes("office") || title.includes("word"))) ||
      (selectedCat.includes("graphic") && (cat.includes("graphic") || title.includes("graphic") || title.includes("photoshop") || title.includes("illustrator"))) ||
      (selectedCat.includes("motion") && (cat.includes("motion") || title.includes("motion") || title.includes("after effects"))) ||
      (selectedCat.includes("marketing") && (cat.includes("marketing") || title.includes("marketing") || title.includes("digital"))) ||
      (selectedCat.includes("support") && (cat.includes("support") || title.includes("support") || title.includes("it") || title.includes("network"))) ||
      (selectedCat.includes("ux/ui") && (cat.includes("ui") || cat.includes("ux") || title.includes("ui") || title.includes("ux") || title.includes("figma")))
    );
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full animate-text-focus">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md shadow-sm">
              {tr("courses.badge", "ACCREDITED IT PROGRAMS", "កម្មវិធីសិក្សាជំនាញបច្ចេកវិទ្យា")}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              {isKhmer ? (
                <>
                  រៀន អភិវឌ្ឍ និង{" "}
                  <TypewriterText
                    words={[
                      "ជំនាញ Microsoft Office",
                      "ជំនាញ Advanced Excel",
                      "ជំនាញ Graphic Design",
                      "ជំនាញ Video Editing",
                      "ជំនាញ Video Editing Pr. & CC",
                      "ជំនាញ Video Editing & Coloring",
                      "ជំនាញ Motion Graphic",
                      "ជំនាញ Digital Marketing",
                      "ជំនាញ IT Support",
                      "ជំនាញ UX/UI Design",
                    ]}
                    highlightClassName="animated-gradient-text"
                  />
                </>
              ) : (
                <>
                  Learn, Grow &{" "}
                  <TypewriterText
                    words={[
                      "Master Microsoft Office",
                      "Master Advanced Excel",
                      "Master Graphic Design",
                      "Master Video Editing",
                      "Master Video Editing Pr. & CC",
                      "Master Video Editing & Coloring",
                      "Master Motion Graphic",
                      "Master Digital Marketing",
                      "Master IT Support",
                      "Master UX/UI Design",
                    ]}
                    highlightClassName="animated-gradient-text"
                  />
                </>
              )}
            </h1>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed max-w-3xl font-medium drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
              {tr(
                "courses.heroDescription",
                "At SC Academy, we offer practical technology and digital skills training designed to meet the needs of today’s learners and workforce. Our courses focus on hands-on learning, relevant skills, and real-world applications to help learners prepare for their careers.",
                "នៅ SC Academy យើងផ្តល់ជូននូវការបណ្តុះបណ្តាលបច្ចេកវិទ្យា និងជំនាញឌីជីថលជាក់ស្តែង ដែលត្រូវបានរចនាឡើងដើម្បីឆ្លើយតបទៅនឹងតម្រូវការរបស់អ្នកសិក្សា និងទីផ្សារការងារបច្ចុប្បន្ន។ វគ្គសិក្សារបស់យើងផ្តោតលើការរៀនអនុវត្តផ្ទាល់ ជំនាញចាំបាច់ និងការយកទៅប្រើប្រាស់ជាក់ស្តែង ដើម្បីជួយអ្នកសិក្សាត្រៀមខ្លួនសម្រាប់អាជីពការងាររបស់ពួកគេ។"
              )}
            </p>
          </div>
        </div>
      </section>

      {/* MAIN SECTION */}
      <section className={`bg-dot-matrix-page py-12 md:py-16 ${isKhmer ? "font-khmer" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filter Bar & Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white dark:bg-[#0F172A] p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 scroll-reveal">
            <div className="flex flex-1 items-center gap-3 w-full">
              <div className="relative w-full sm:max-w-md">
                <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={17} />
                <input 
                  type="text" 
                  placeholder={tr("courses.search", "Search courses, topics, or skills...", "ស្វែងរកវគ្គសិក្សា ឬជំនាញ...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition"
                />
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {tr("courses.showing", "Showing", "បង្ហាញ")} <b className="text-slate-900 dark:text-white">{filteredCourses.length}</b> {tr("courses.results", "programs", "វគ្គសិក្សា")}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* SIDEBAR FILTERS */}
            <div className="w-full lg:w-[260px] flex-shrink-0 space-y-6 scroll-reveal-left">
              <div className="bg-white dark:bg-[#0F172A] p-5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {isKhmer ? "វគ្គសិក្សារបស់យើង" : "OUR COURSES"}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 border border-blue-200 dark:border-blue-800/80">
                    10 វគ្គ
                  </span>
                </div>

                <div className="space-y-2.5">
                  {COURSE_CATEGORIES.map((cat) => {
                    const isSelected = filters.category === cat.id;
                    const label = isKhmer ? cat.labelKm : cat.labelEn;

                    return (
                      <label
                        key={cat.id}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800/80"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="radio"
                            name="category"
                            value={cat.id}
                            checked={isSelected}
                            onChange={() => setFilters({ ...filters, category: cat.id })}
                            className="w-3.5 h-3.5 text-[#2563EB] focus:ring-[#2563EB] border-slate-300 dark:border-slate-700"
                          />
                          <span className="text-xs truncate">{label}</span>
                        </div>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* COURSE GRID - 3 CARDS IN 1 ROW (DESKTOP) */}
            <div className="flex-1">
              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full border-3 border-slate-200 border-t-[#2563EB] animate-spin" />
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">{tr("courses.loading", "Loading programs...", "កំពុងផ្ទុកវគ្គសិក្សា...")}</p>
                </div>
              ) : filteredCourses.length === 0 ? (
                <EmptyState
                  icon={FiBookOpen}
                  title_km="មិនទាន់មានវគ្គសិក្សានៅឡើយទេ"
                  title_en="No Courses Available"
                  description_km={searchTerm || filters.category !== "All" ? "មិនមានវគ្គសិក្សាដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។" : "ព័ត៌មានវគ្គសិក្សានឹងមានក្នុងពេលឆាប់ៗនេះ។"}
                  description_en={searchTerm || filters.category !== "All" ? "No courses matched your current filter or search criteria." : "Course programs will be available soon."}
                  onReset={searchTerm || filters.category !== "All" ? () => { setSearchTerm(""); setFilters({ category: "All", rating: 0 }); } : null}
                />
              ) : (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleCourses.map((course, index) => {
                      const courseImage = getCourseImage(course);
                      const courseTitle = localized(course, "title", "SC Academy Program");
                      const courseLevel = localized(course, "level", "All Levels");
                      const courseDuration = localized(course, "duration", "Flexible");

                      return (
                        <article key={course.id || index} className={`card-lift group flex h-full flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md scroll-reveal stagger-${(index % 6) + 1}`}>
                          {/* Course Thumbnail */}
                          <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img 
                              src={getImageUrl(courseImage, "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=700&q=80")} 
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
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
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
                              <h3 className="mb-2.5 line-clamp-2 text-base font-bold text-slate-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">{courseTitle}</h3>
                            </button>

                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                              {localized(course, "description") || "Practical step-by-step hands-on training."}
                            </p>

                            <div className="flex-grow" />

                            <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2.5">
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