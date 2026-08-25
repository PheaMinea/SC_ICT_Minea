import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMail,
  FiPhone,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { FaTelegramPlane } from "react-icons/fa";

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
    if (!isKhmer && item[englishField]?.trim()) return item[englishField];
    if (isKhmer && item[khmerField]?.trim()) return item[khmerField];
    if (item[field]?.trim()) return item[field];
    return defaultValue;
  };

  const toArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((item) => typeof item === "string" ? item.trim() : item).filter(Boolean);
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return [];
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {
        return trimmed.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
      }
    }
    return [];
  };

  const getLocalizedArray = (item, field) => {
    if (!item) return [];
    return toArray(item[`${field}_${language}`] || item[field] || item[`${field}_en`] || item[`${field}_km`]);
  };

  const courseImage = course?.image_url || course?.image || course?.thumbnail || "";
  const courseTitle = localized(course, "title", tr("courseDetail.defaultTitle", "SC Academy Program", "វគ្គសិក្សា SC Academy"));
  const courseDescription = localized(course, "description", tr("courseDetail.defaultDescription", "Develop practical knowledge and useful skills with SC Academy.", "អភិវឌ្ឍចំណេះដឹង និងជំនាញអនុវត្តជាមួយ SC Academy។"));
  const courseLevel = localized(course, "level", tr("courseDetail.allLevels", "All Levels", "គ្រប់កម្រិត"));
  const courseDuration = localized(course, "duration", tr("courseDetail.flexible", "Flexible", "បត់បែន"));
  const courseSchedule = localized(course, "schedule", tr("courseDetail.contactSchedule", "Contact the academy", "ទាក់ទងសាលាដើម្បីសួរកាលវិភាគ"));
  const courseStudyMode = localized(course, "study_mode", tr("courseDetail.onsite", "On-site learning", "សិក្សាផ្ទាល់នៅសាលា"));

  const features = useMemo(() => getLocalizedArray(course, "features"), [course, language]);
  const requirements = useMemo(() => getLocalizedArray(course, "requirements"), [course, language]);
  const targetAudience = useMemo(() => getLocalizedArray(course, "target_audience"), [course, language]);
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
            .slice(0, 3)
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
          <div className="w-14 h-14 mx-auto rounded-xl bg-[#EF233C]/10 text-[#EF233C] flex items-center justify-center"><FiBookOpen size={24} /></div>
          <h1 className="mt-4 text-xl font-bold text-[#143DAA]">{tr("courseDetail.notFound", "Program Not Found", "រកមិនឃើញវគ្គសិក្សា")}</h1>
          <p className="mt-2 text-sm leading-7 text-[#1F2937]/70">{pageError}</p>
          <button type="button" onClick={() => navigate("/courses")} className="mt-5 h-11 px-5 rounded-lg bg-[#143DAA] hover:bg-[#EF233C] text-white text-sm font-bold inline-flex items-center justify-center transition-colors">
            <FiArrowLeft className="mr-2" /> {tr("courseDetail.backPrograms", "Back to Programs", "ត្រឡប់ទៅវគ្គសិក្សា")}
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
        <section className="relative overflow-hidden bg-slate-950 text-white border-b border-slate-800">
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

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
            <button type="button" onClick={() => navigate("/courses")} className="mb-6 inline-flex items-center text-xs md:text-sm font-semibold text-slate-400 hover:text-white transition-colors">
              <FiArrowLeft className="mr-2" /> {tr("courseDetail.backPrograms", "Back to Programs", "ត្រឡប់ទៅវគ្គសិក្សា")}
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-center">
              <div>
                <span className="inline-flex items-center h-7 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2563EB] text-[10px] md:text-xs font-bold uppercase tracking-wider">{courseLevel}</span>
                <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">{courseTitle}</h1>

                <p className="mt-5 max-w-[650px] text-sm md:text-base leading-relaxed text-slate-300">{courseDescription}</p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <FiClock className="text-[#2563EB] text-lg" />
                    <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold">{tr("courseDetail.duration", "Duration", "រយៈពេល")}</p>
                    <p className="mt-1 text-sm font-bold text-white">{courseDuration}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <FiUsers className="text-[#2563EB] text-lg" />
                    <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold">{tr("courseDetail.level", "Level", "កម្រិត")}</p>
                    <p className="mt-1 text-sm font-bold text-white">{courseLevel}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <FiCalendar className="text-[#2563EB] text-lg" />
                    <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold">{tr("courseDetail.schedule", "Schedule", "កាលវិភាគ")}</p>
                    <p className="mt-1 text-sm font-bold text-white line-clamp-1">{courseSchedule}</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative h-[270px] sm:h-[330px] lg:h-[360px] overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-900">
                  {/* Fallback BG */}
                  <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center">
                    <FiBookOpen size={44} className="text-slate-700" />
                    <span className="mt-3 text-xs font-bold text-slate-600">SC Academy</span>
                  </div>
                  {courseImage && (
                    <img src={getImageUrl(courseImage)} alt={courseTitle} className="relative z-[1] w-full h-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}
        <section className="bg-[#F8FAFC] py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-10">
              
              {/* LEFT COLUMN - Details */}
              <div className="space-y-6">
                <article className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                  <span className="text-xs uppercase tracking-widest font-bold text-[#2563EB]">{tr("courseDetail.programOverview", "Program Overview", "ព័ត៌មានទូទៅអំពីវគ្គសិក្សា")}</span>
                  <h2 className="mt-1.5 text-xl md:text-2xl font-bold text-slate-900">{tr("courseDetail.aboutProgram", "About This Program", "អំពីវគ្គសិក្សានេះ")}</h2>
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">{courseDescription}</p>
                </article>

                <article className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                  <span className="text-xs uppercase tracking-widest font-bold text-[#2563EB]">{tr("courseDetail.learningOutcomes", "Skills & Outcomes", "ជំនាញទទួលបាន")}</span>
                  <h2 className="mt-1.5 text-xl md:text-2xl font-bold text-slate-900">{tr("courseDetail.whatYouLearn", "What You Will Learn", "អ្វីដែលអ្នកនឹងរៀន")}</h2>
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(features.length > 0 ? features : [
                        tr("courseDetail.defaultFeature1", "Practical lessons and guided exercises", "មេរៀនអនុវត្ត និងលំហាត់ដែលមានការណែនាំ"),
                        tr("courseDetail.defaultFeature2", "Useful skills for study and work", "ជំនាញមានប្រយោជន៍សម្រាប់ការសិក្សា និងការងារ"),
                        tr("courseDetail.defaultFeature3", "Support from experienced instructors", "ទទួលបានការគាំទ្រពីគ្រូដែលមានបទពិសោធន៍"),
                        tr("courseDetail.defaultFeature4", "Practice with real-world projects", "អនុវត្តជាមួយគម្រោងជាក់ស្ដែង")
                    ]).map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <FiCheckCircle size={18} className="mt-0.5 flex-shrink-0 text-[#2563EB]" />
                        <span className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">{typeof feature === "string" ? feature : localized(feature, "title", "")}</span>
                      </div>
                    ))}
                  </div>
                </article>

                {/* CURRICULUM */}
                {curriculum.length > 0 && (
                  <article className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                    <span className="text-xs uppercase tracking-widest font-bold text-[#2563EB]">{tr("courseDetail.modules", "Modules", "មេរៀន")}</span>
                    <h2 className="mt-1.5 text-xl md:text-2xl font-bold text-slate-900">{tr("courseDetail.curriculum", "Program Curriculum", "កម្មវិធីសិក្សា")}</h2>
                    <div className="mt-5 space-y-3">
                      {curriculum.map((item, index) => (
                        <div key={index} className="flex items-start gap-3.5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <span className="w-8 h-8 flex-shrink-0 rounded-lg bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center">{String(index + 1).padStart(2, "0")}</span>
                          <div className="pt-0.5">
                            <p className="text-sm font-bold text-slate-900">{typeof item === "string" ? item : localized(item, "title", "")}</p>
                            {typeof item === "object" && item?.description && (
                              <p className="mt-1 text-xs leading-relaxed text-slate-600">{localized(item, "description", "")}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                )}

                {/* TARGET AUDIENCE + REQUIREMENTS */}
                {(targetAudience.length > 0 || requirements.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {targetAudience.length > 0 && (
                      <article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-base font-bold text-slate-900 mb-4">{tr("courseDetail.targetAudience", "Who Is This For?", "វគ្គនេះសម្រាប់អ្នកណា?")}</h2>
                        <div className="space-y-3">
                          {targetAudience.map((item, index) => (
                            <div key={index} className="flex items-start gap-2.5">
                              <FiCheckCircle className="mt-0.5 flex-shrink-0 text-[#2563EB]" size={16} />
                              <span className="text-xs sm:text-sm text-slate-600 leading-relaxed">{typeof item === "string" ? item : localized(item, "title", "")}</span>
                            </div>
                          ))}
                        </div>
                      </article>
                    )}
                    {requirements.length > 0 && (
                      <article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-base font-bold text-slate-900 mb-4">{tr("courseDetail.requirements", "Entry Requirements", "លក្ខខណ្ឌមុនចូលរៀន")}</h2>
                        <div className="space-y-3">
                          {requirements.map((item, index) => (
                            <div key={index} className="flex items-start gap-2.5">
                              <FiCheckCircle className="mt-0.5 flex-shrink-0 text-[#2563EB]" size={16} />
                              <span className="text-xs sm:text-sm text-slate-600 leading-relaxed">{typeof item === "string" ? item : localized(item, "title", "")}</span>
                            </div>
                          ))}
                        </div>
                      </article>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN - Sticky Enrollment Card */}
              <aside className="lg:self-start lg:sticky lg:top-24">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="p-6">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#2563EB]">SC ACADEMY</span>
                    <h2 className="mt-2 text-lg font-bold leading-snug text-slate-900">{courseTitle}</h2>

                    <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                      <div className="flex items-start gap-3">
                        <FiClock className="mt-0.5 text-[#2563EB]" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">{tr("courseDetail.duration", "Duration", "រយៈពេល")}</p>
                          <p className="text-xs font-semibold text-slate-800">{courseDuration}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FiUsers className="mt-0.5 text-[#2563EB]" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">{tr("courseDetail.level", "Level", "កម្រិត")}</p>
                          <p className="text-xs font-semibold text-slate-800">{courseLevel}</p>
                        </div>
                      </div>
                    </div>

                    <button type="button" onClick={openTelegramEnroll} className="mt-6 w-full h-12 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm active:scale-95">
                      <FaTelegramPlane size={15} />
                      <span>{tr("courseDetail.enrollNow", "Enroll via Telegram", "ចុះឈ្មោះតាមតេឡេក្រាម")}</span>
                    </button>

                    <div className="mt-3 grid grid-cols-1 gap-2">
                      <a href="tel:+85586306615" className="h-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center justify-center hover:bg-slate-100 transition-colors">
                        <FiPhone className="mr-2 text-[#2563EB]" /> 086 306 615
                      </a>
                      <a href="mailto:info@scacademy.edu.kh" className="h-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center justify-center hover:bg-slate-100 transition-colors">
                        <FiMail className="mr-2 text-[#2563EB]" /> {tr("courseDetail.contactAcademy", "Contact SC Academy", "ទាក់ទង SC Academy")}
                      </a>
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
          <section className="bg-slate-100/70 border-t border-slate-200 py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-lg font-bold text-slate-900 whitespace-nowrap">
                   {tr("courseDetail.relatedPrograms", "You May Also Be Interested In", "វគ្គសិក្សាដែលអ្នកអាចចាប់អារម្មណ៍")}
                </h2>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedCourses.map((item) => {
                  const itemTitle = localized(item, "title", tr("courseDetail.defaultTitle", "SC Academy Program", "វគ្គសិក្សា SC Academy"));
                  const itemImage = item?.image_url || item?.image || item?.thumbnail || "";

                  return (
                    <article key={item.id} className="card-lift group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-slate-300 transition-all duration-300 flex flex-col">
                      <div className="relative h-[170px] overflow-hidden bg-slate-100">
                        {itemImage && <img src={getImageUrl(itemImage)} alt={itemTitle} loading="lazy" decoding="async" className="relative z-[1] w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug mb-3">{itemTitle}</h3>
                        <div className="flex-grow" />
                        <button type="button" onClick={() => navigate(`/courses/${item.id}`)} className="w-full mt-3 h-10 bg-slate-100 hover:bg-[#2563EB] hover:text-white text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center transition-colors">
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

        {/* =================================================
            FINAL CTA
        ================================================= */}
        <section className="bg-[#F8FAFC] py-14 md:py-20 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-8 md:p-14 text-center text-white shadow-xl">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
                {tr("courseDetail.startToday", "Start Learning Today", "ចាប់ផ្ដើមសិក្សាថ្ងៃនេះ")}
              </span>
              <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">{tr("courseDetail.readyTitle", "Ready to Build Your Future?", "ត្រៀមខ្លួនកសាងអនាគតរបស់អ្នកហើយឬនៅ?")}</h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                {tr("courseDetail.readyDesc", "Enroll today and take the first step towards an exciting tech career with SC Academy.", "ចុះឈ្មោះថ្ងៃនេះដើម្បីចាប់ផ្តើមដំណើរឆ្ពោះទៅកាន់អាជីពបច្ចេកវិទ្យាដ៏ជោគជ័យជាមួយ SC Academy។")}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button type="button" onClick={openTelegramEnroll} className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold shadow-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-95">
                  <FaTelegramPlane size={16} />
                  <span>{tr("courseDetail.enrollNow", "Enroll via Telegram", "ចុះឈ្មោះតាមតេឡេក្រាម")}</span>
                </button>
                <button type="button" onClick={() => navigate("/contact")} className="w-full sm:w-auto h-12 px-8 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all duration-300">
                  {tr("courseDetail.contact", "Contact Us", "ទាក់ទងយើង")}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default CourseDetail;