import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import { getImageUrl } from "../../utils/helpers";
import { useLanguage } from "../../context/LanguageContext";
import heroVideo from "./video/sc-academy.mp4";

const TELEGRAM_USERNAME = "SC_Academy";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { t, language } = useLanguage();
  const isKhmer = language === "km";

  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

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
    if (language === "en" && item[englishField]?.trim()) return item[englishField];
    if (language === "km" && item[khmerField]?.trim()) return item[khmerField];

    if (item[field]?.trim()) return item[field];

    // Fallback if current language is not in database yet
    if (item[khmerField]?.trim()) return item[khmerField];
    if (item[englishField]?.trim()) return item[englishField];

    return defaultValue;
  };

  const getItemText = (item, field = "title") => {
    if (!item) return "";
    let str = "";
    if (typeof item === "string") str = item.trim();
    else if (typeof item === "object") {
      const val = localized(item, field);
      str = val || (
        item.title ||
        item.title_en ||
        item.title_km ||
        item.name ||
        item.name_en ||
        item.name_km ||
        item.text ||
        item.description ||
        item.description_en ||
        item.description_km ||
        ""
      );
    }
    return typeof str === "string" ? str.replace(/^[•\-\*\u2022\u2713\u2714\d+\.\)]\s*/, "").trim() : str;
  };

  const toArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === "string" ? item.replace(/^[•\-\*\u2022\u2713\u2714\d+\.\)]\s*/, "").trim() : item))
        .filter(Boolean);
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return [];
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed
            .map((item) => (typeof item === "string" ? item.replace(/^[•\-\*\u2022\u2713\u2714\d+\.\)]\s*/, "").trim() : item))
            .filter(Boolean);
        }
      } catch {
        // Not JSON string - split by newlines or commas
        const separator = trimmed.includes("\n") ? /\r?\n/ : /,/;
        return trimmed
          .split(separator)
          .map((item) => item.replace(/^[•\-\*\u2022\u2713\u2714\d+\.\)]\s*/, "").trim())
          .filter(Boolean);
      }
    }
    return [];
  };

  const getLocalizedArray = (item, field) => {
    if (!item) return [];
    const selected = item[`${field}_${language}`];
    if (selected && toArray(selected).length > 0) return toArray(selected);

    const base = item[field];
    if (base && toArray(base).length > 0) return toArray(base);

    const en = item[`${field}_en`];
    if (en && toArray(en).length > 0) return toArray(en);

    const km = item[`${field}_km`];
    if (km && toArray(km).length > 0) return toArray(km);

    return [];
  };

  const courseImage = course?.image_url || course?.image || course?.thumbnail || "";
  const courseTitle = localized(course, "title", tr("courseDetail.defaultTitle", "SC Academy Program", "វគ្គសិក្សា SC Academy"));
  const courseDescription = localized(course, "description", tr("courseDetail.defaultDescription", "Develop practical knowledge and useful skills with SC Academy.", "អភិវឌ្ឍចំណេះដឹង និងជំនាញអនុវត្តជាមួយ SC Academy។"));
  const courseShortDescription = localized(course, "short_description", "");
  const courseLevel = localized(course, "level", tr("courseDetail.allLevels", "All Levels", "គ្រប់កម្រិត"));
  const courseDuration = localized(course, "duration", tr("courseDetail.flexible", "Flexible", "បត់បែន"));
  const courseLanguage = localized(course, "language", "");
  const courseSchedule = localized(course, "schedule", "");
  const courseCategory = course?.category ? localized(course.category, "name", "") : "";
  const hasCertificate = course?.certificate;

  const features = useMemo(() => {
    const list = getLocalizedArray(course, "what_you_learn");
    if (list.length > 0) return list;
    return getLocalizedArray(course, "features");
  }, [course, language]);

  const requirements = useMemo(() => getLocalizedArray(course, "requirements"), [course, language]);

  const targetAudience = useMemo(() => {
    const list = getLocalizedArray(course, "target_students");
    if (list.length > 0) return list;
    return getLocalizedArray(course, "target_audience");
  }, [course, language]);

  const descriptionLines = useMemo(() => {
    if (!courseDescription) return [];
    if (typeof courseDescription !== "string") return [courseDescription];
    return courseDescription
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }, [courseDescription]);

  const curriculum = useMemo(() => getLocalizedArray(course, "curriculum"), [course, language]);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        setPageError("");
        const [courseResponse, allCoursesResponse] = await Promise.all([
          api.get(`/api/courses/${id}`),
          api.get("/api/courses/").catch(() => ({ data: [] })),
        ]);

        const currentCourse = courseResponse.data;
        setCourse(currentCourse);

        const allCourses = Array.isArray(allCoursesResponse.data) 
          ? allCoursesResponse.data 
          : (Array.isArray(allCoursesResponse.data?.items) ? allCoursesResponse.data.items : []);
          
        setRelatedCourses(
          allCourses
            .filter((item) => String(item?.id) !== String(id) && item?.is_active !== false)
            .slice(0, 4)
        );
      } catch (error) {
        console.error("Error fetching course detail:", error);
        setPageError(tr("courseDetail.loadError", "Unable to load this program. It may not exist or may have been removed.", "មិនអាចទាញយកព័ត៌មានវគ្គសិក្សានេះបានទេ។ វគ្គនេះអាចមិនមាន ឬត្រូវបានលុប។"));
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourseDetail();
  }, [id, language]);

  const openTelegramEnroll = () => {
    const title = courseTitle || "SC Academy Program";
    const message = `សួស្តី Admin ខ្ញុំចង់ចុះឈ្មោះវគ្គសិក្សា ${title}`;
    const url = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <main className={`min-h-[70vh] bg-[#F8FAFC] flex items-center justify-center ${isKhmer ? "font-khmer" : ""}`}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full border-[3px] border-[#143DAA]/20 border-t-[#143DAA] animate-spin" />
          <p className="mt-4 text-sm font-semibold text-[#143DAA]">{tr("courseDetail.loading", "Loading program details...", "កំពុងផ្ទុកព័ត៌មានវគ្គសិក្សា...")}</p>
        </div>
      </main>
    );
  }

  if (pageError || !course) {
    return (
      <main className={`min-h-[70vh] bg-[#F8FAFC] px-4 flex items-center justify-center ${isKhmer ? "font-khmer" : ""}`}>
        <div className="w-full max-w-lg bg-white border border-[#143DAA]/10 rounded-xl p-7 text-center shadow-lg shadow-[#143DAA]/5">
          <div className="w-14 h-14 mx-auto rounded-xl bg-[#EF233C]/10 text-[#EF233C] flex items-center justify-center">
            <i className="fa-solid fa-book-open text-2xl" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-[#143DAA]">{tr("courseDetail.notFound", "Program Not Found", "រកមិនឃើញវគ្គសិក្សា")}</h1>
          <p className="mt-2 text-sm leading-7 text-[#1F2937]/70">{pageError}</p>
          <button type="button" onClick={() => navigate("/courses")} className="mt-5 h-11 px-5 rounded-lg bg-[#143DAA] hover:bg-[#EF233C] text-white text-sm font-bold inline-flex items-center justify-center transition-colors">
            <i className="fa-solid fa-arrow-left mr-2" /> {tr("courseDetail.backPrograms", "Back to Programs", "ត្រឡប់ទៅវគ្គសិក្សា")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${courseTitle} | SC Academy`}</title>
        <meta name="description" content={courseDescription} />
        <meta property="og:title" content={`${courseTitle} | SC Academy`} />
        <meta property="og:description" content={courseDescription} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": courseTitle,
            "description": courseDescription,
            "provider": {
              "@type": "EducationalOrganization",
              "name": "SC Academy",
              "sameAs": "https://scacademy.edu.kh"
            },
            "offers": {
              "@type": "Offer",
              "category": "Paid",
              "price": Number(course?.price) || 0,
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Helmet>

      <main className={isKhmer ? "font-khmer" : ""}>
        {/* =================================================
            HERO WITH VIDEO BACKGROUND
        ================================================= */}
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
              <button
                type="button"
                onClick={() => navigate("/courses")}
                className="mb-4 inline-flex items-center text-xs md:text-sm font-semibold text-slate-300 hover:text-white transition-colors group"
              >
                <i className="fa-solid fa-arrow-left mr-2 transition-transform group-hover:-translate-x-1" /> {tr("courseDetail.backPrograms", "Back to Programs", "ត្រឡប់ទៅវគ្គសិក្សា")}
              </button>

              <div className="mb-4 animate-floating-text" style={{ animationDuration: '4.5s' }}>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
                  {courseLevel || tr("courses.badge", "ACCREDITED IT PROGRAMS", "កម្មវិធីសិក្សាជំនាញបច្ចេកវិទ្យា")}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] animate-floating-text">
                <span className="animated-gradient-text">{courseTitle}</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-100 leading-relaxed max-w-2xl font-medium drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
                {courseShortDescription || (courseDescription ? (courseDescription.length > 180 ? courseDescription.slice(0, 180) + "..." : courseDescription) : tr("courses.heroDescription", "Practical, job-ready programs taught by industry mentors. Master hands-on skills with 100% practical lab experience.", "កម្មវិធីសិក្សាជាក់ស្ដែងដែលបង្រៀនដោយគ្រូជំនាញ ដើម្បីត្រៀមខ្លួនសម្រាប់ទីផ្សារការងារ។"))}
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}
        <section className="bg-dot-matrix-page py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-8 lg:gap-12 items-start">
              
              {/* LEFT COLUMN - Details */}
              <div className="space-y-6 scroll-reveal-left">
                {/* FEATURED COURSE POSTER / IMAGE */}
                {courseImage && (
                  <div className="relative w-11/12 md:w-4/5 mx-auto rounded-xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-lg group bg-white dark:bg-[#0F172A]">
                    <img
                      src={getImageUrl(courseImage)}
                      alt={courseTitle}
                      className="w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-[1.03]"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* UNIFIED CONTENT CONTAINER */}
                <article className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm mt-8">
                  {/* 1. ABOUT THE COURSE */}
                  {descriptionLines.length > 0 && (
                    <section className="mb-12">
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                        {tr("courseDetail.aboutProgram", "About The Course", "គោលបំណងនៃវគ្គសិក្សា")}
                      </h2>
                      <div className="space-y-4 text-slate-700 dark:text-slate-300">
                        {descriptionLines.map((line, index) => {
                          const cleanText = line.replace(/^[•\-\*\u2022\u2713\u2714\d+\.\)]\s*/, "").trim();
                          return (
                            <p key={index} className="text-base leading-relaxed">
                              {cleanText || line}
                            </p>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* 2. WHAT YOU WILL LEARN */}
                  <section className="mb-12">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                      {tr("courseDetail.whatYouLearn", "What You Will Learn", "អ្វីដែលអ្នកនឹងរៀន")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      {(features.length > 0 ? features : [
                          tr("courseDetail.defaultFeature1", "Practical lessons and guided exercises", "មេរៀនអនុវត្ត និងលំហាត់ដែលមានការណែនាំ"),
                          tr("courseDetail.defaultFeature2", "Useful skills for study and work", "ជំនាញមានប្រយោជន៍សម្រាប់ការសិក្សា និងការងារ"),
                          tr("courseDetail.defaultFeature3", "Support from experienced instructors", "ទទួលបានការគាំទ្រពីគ្រូដែលមានបទពិសោធន៍"),
                          tr("courseDetail.defaultFeature4", "Practice with real-world projects", "អនុវត្តជាមួយគម្រោងជាក់ស្ដែង")
                      ]).map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <i className="fa-solid fa-check text-emerald-600 dark:text-emerald-400 mt-1.5 flex-shrink-0" />
                          <span className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">{getItemText(feature, "title")}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* 3. COURSE CURRICULUM */}
                  {curriculum.length > 0 && (
                    <section className="mb-12">
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <span>{tr("courseDetail.curriculum", "Program Curriculum", "កម្មវិធីសិក្សា")}</span>
                        <span className="text-sm font-medium text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">{curriculum.length} {tr("courseDetail.modules", "Modules", "មេរៀន")}</span>
                      </h2>
                      <div className="space-y-4">
                        {curriculum.map((item, index) => {
                          const title = getItemText(item, "title");
                          const description = (typeof item === "object") ? getItemText(item, "description") : null;
                          
                          return (
                            <details key={index} className="group border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50/50 dark:bg-slate-800/30 [&_summary::-webkit-details-marker]:hidden">
                              <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors">
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-slate-400 font-mono w-6">{(index + 1).toString().padStart(2, "0")}</span>
                                  <span className="text-base">{title}</span>
                                </div>
                                <span className="transition-transform duration-300 group-open:-rotate-180">
                                  <i className="fa-solid fa-chevron-down text-slate-400 text-sm" />
                                </span>
                              </summary>
                              {description && (
                                <div className="p-5 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed text-sm border-t border-slate-200 dark:border-slate-700/60 ml-[3.25rem]">
                                  {description}
                                </div>
                              )}
                            </details>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* 4. TARGET AUDIENCE & REQUIREMENTS */}
                  {(targetAudience.length > 0 || requirements.length > 0) && (
                    <section className="mb-12">
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                        {tr("courseDetail.audienceAndReq", "Who Is This For & Requirements", "សិស្សគោលដៅ និង លក្ខខណ្ឌតម្រូវ")}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {targetAudience.length > 0 && (
                          <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">{tr("courseDetail.targetAudience", "Who Is This For?", "វគ្គនេះសម្រាប់អ្នកណា?")}</h3>
                            <ul className="space-y-3">
                              {targetAudience.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
                                  <span className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">{getItemText(item, "title")}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {requirements.length > 0 && (
                          <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">{tr("courseDetail.requirements", "Entry Requirements", "លក្ខខណ្ឌមុនចូលរៀន")}</h3>
                            <ul className="space-y-3">
                              {requirements.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5 flex-shrink-0" />
                                  <span className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">{getItemText(item, "title")}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {/* 5. COURSE BENEFITS (RESTORED AS CARDS) */}
                  <section className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-xl text-center hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all duration-300 group">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                          <i className="fa-solid fa-medal text-lg" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{tr("highlights.quality", "High Quality", "គុណភាពខ្ពស់")}</h3>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-xl text-center hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all duration-300 group">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                          <i className="fa-solid fa-laptop-code text-lg" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{tr("highlights.practical", "100% Practical", "អនុវត្តជាក់ស្តែង")}</h3>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-xl text-center hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all duration-300 group">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform">
                          <i className="fa-solid fa-user-tie text-lg" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{tr("highlights.expert", "Expert Mentors", "គ្រូមានបទពិសោធន៍")}</h3>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-xl text-center hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all duration-300 group">
                        <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-2 group-hover:scale-110 transition-transform">
                          <i className="fa-solid fa-headset text-lg" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{tr("highlights.support", "Support", "គាំទ្រការសិក្សា")}</h3>
                      </div>
                    </div>
                  </section>
                </article>
              </div>

              {/* RIGHT COLUMN - Sticky Enrollment Card (Larger & More Spacious) */}
              <aside className="lg:self-start lg:sticky lg:top-24 scroll-reveal-right">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700/50 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl shadow-2xl shadow-blue-900/5 dark:shadow-blue-900/10">
                  
                  {/* Subtle top gradient bar */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500" />

                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-700/50 text-[#2563EB] dark:text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                        <i className="fa-solid fa-graduation-cap" /> SC ACADEMY
                      </span>
                    </div>
                    
                    <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
                      {courseTitle}
                    </h2>

                    {/* Premium Grid for Specs */}
                    <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-slate-100 dark:border-slate-800 pt-6">
                      
                      {/* Duration */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <div className="w-6 h-6 rounded bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
                            <i className="fa-solid fa-clock text-xs" />
                          </div>
                          <p className="text-[10px] sm:text-[11px] uppercase font-bold tracking-widest">{tr("courseDetail.duration", "Duration", "រយៈពេល")}</p>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white pl-8">
                          {courseDuration}
                        </p>
                      </div>

                      {/* Level */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <div className="w-6 h-6 rounded bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500">
                            <i className="fa-solid fa-layer-group text-xs" />
                          </div>
                          <p className="text-[10px] sm:text-[11px] uppercase font-bold tracking-widest">{tr("courseDetail.level", "Level", "កម្រិត")}</p>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white pl-8">
                          {courseLevel}
                        </p>
                      </div>

                      {/* Category */}
                      {courseCategory && (
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <div className="w-6 h-6 rounded bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                              <i className="fa-solid fa-folder-open text-xs" />
                            </div>
                            <p className="text-[10px] sm:text-[11px] uppercase font-bold tracking-widest">{tr("courseDetail.category", "Category", "ប្រភេទ")}</p>
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white pl-8 line-clamp-1">
                            {courseCategory}
                          </p>
                        </div>
                      )}

                      {/* Language */}
                      {courseLanguage && (
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <div className="w-6 h-6 rounded bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">
                              <i className="fa-solid fa-language text-xs" />
                            </div>
                            <p className="text-[10px] sm:text-[11px] uppercase font-bold tracking-widest">{tr("courseDetail.language", "Language", "ភាសា")}</p>
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white pl-8">
                            {courseLanguage}
                          </p>
                        </div>
                      )}

                      {/* Schedule */}
                      {courseSchedule && (
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <div className="w-6 h-6 rounded bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-500">
                              <i className="fa-solid fa-calendar-alt text-xs" />
                            </div>
                            <p className="text-[10px] sm:text-[11px] uppercase font-bold tracking-widest">{tr("courseDetail.schedule", "Schedule", "កាលវិភាគ")}</p>
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white pl-8 line-clamp-1">
                            {courseSchedule}
                          </p>
                        </div>
                      )}

                      {/* Certificate */}
                      {hasCertificate !== undefined && (
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <div className="w-6 h-6 rounded bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
                              <i className="fa-solid fa-certificate text-xs" />
                            </div>
                            <p className="text-[10px] sm:text-[11px] uppercase font-bold tracking-widest">{tr("courseDetail.certificate", "Certificate", "វិញ្ញាបនបត្រ")}</p>
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white pl-8">
                            {hasCertificate ? tr("courseDetail.certAvailable", "Yes", "មានបញ្ជាក់") : tr("courseDetail.certNone", "None", "មិនមាន")}
                          </p>
                        </div>
                      )}

                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <button 
                        type="button" 
                        onClick={openTelegramEnroll} 
                        className="group relative w-full h-14 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-base font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-[0.98] cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <i className="fa-brands fa-telegram text-xl relative z-10" />
                        <span className="relative z-10">{tr("courseDetail.enrollNow", "Enroll via Telegram", "ចុះឈ្មោះតាមតេឡេក្រាម")}</span>
                      </button>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <a 
                          href="tel:+85586306615" 
                          className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-all gap-2 group"
                        >
                          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                            <i className="fa-solid fa-phone text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-[10px]" /> 
                          </div>
                          <span>086 306 615</span>
                        </a>
                        <a 
                          href="mailto:scacademy9@gmail.com" 
                          className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-all gap-2 group"
                        >
                          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                            <i className="fa-solid fa-envelope text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-[10px]" /> 
                          </div>
                          <span>Email Us</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* =================================================
            RELATED COURSES (GRID STYLE)
        ================================================= */}
        {relatedCourses.length > 0 && (
          <section className="bg-dot-matrix-page py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                   {tr("courseDetail.relatedPrograms", "You May Also Be Interested In", "វគ្គសិក្សាដែលអ្នកអាចចាប់អារម្មណ៍")}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedCourses.map((item) => {
                  const itemTitle = localized(item, "title", tr("courseDetail.defaultTitle", "SC Academy Program", "វគ្គសិក្សា SC Academy"));
                  const itemImage = item?.image_url || item?.image || item?.thumbnail || "";

                  return (
                    <article key={item.id} className="card-lift group bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col">
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {itemImage && (
                          <img 
                            src={getImageUrl(itemImage)} 
                            alt={itemTitle} 
                            loading="lazy" 
                            decoding="async" 
                            className="relative z-[1] w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            onError={(event) => { event.currentTarget.style.display = "none"; }} 
                          />
                        )}
                      </div>
                      <div className="p-4 sm:p-5 flex flex-col flex-grow">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-3">{itemTitle}</h3>
                        <div className="flex-grow" />
                        <button type="button" onClick={() => navigate(`/courses/${item.id}`)} className="w-full mt-3 h-9 sm:h-10 bg-slate-100 dark:bg-slate-800 hover:bg-[#2563EB] hover:text-white text-slate-800 dark:text-slate-200 rounded-md text-xs font-bold flex items-center justify-center transition-colors">
                           {tr("courseDetail.viewDetails", "View Details", "មើលលម្អិត")}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

      </main>
    </>
  );
};

export default CourseDetail;