import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FiVideo, FiArrowRight } from "react-icons/fi";

import api from "../../services/api";
import Loader from "../common/Loader";
import { useLanguage } from "../../context/LanguageContext";
import heroVideo from "./video/sc-academy.mp4";

const Videos = () => {

  // =====================================================
  // LANGUAGE
  // =====================================================
  const { t, language } = useLanguage();
  const isKhmer = language === "km";

  // =====================================================
  // STATES
  // =====================================================
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  // =====================================================
  // TRANSLATION FALLBACK
  // =====================================================
  const tr = (key, english, khmer) => {
    const value = t(key);
    if (value && value !== key) return value;
    return isKhmer ? khmer : english;
  };

  // =====================================================
  // LOCALIZED API FIELD
  // =====================================================
  const localized = (item, field, defaultValue = "") => {
    if (!item) return defaultValue;
    const selectedField = `${field}_${language}`;
    const selectedValue = item[selectedField];
    if (selectedValue?.trim()) return selectedValue;
    return defaultValue;
  };

  // =====================================================
  // GET CATEGORY KEY
  // =====================================================
  const getCategoryKey = (video) => {
    if (!video) return "";
    return video.category_en || video.category || video.category_km || "";
  };

  // =====================================================
  // GET CATEGORY LABEL
  // =====================================================
  const getCategoryLabel = (categoryKey) => {
    if (categoryKey === "All") {
      return tr("videos.allCategories", "All", "ទាំងអស់");
    }
    const matchedVideo = videos.find((video) => getCategoryKey(video) === categoryKey);
    if (!matchedVideo) {
      return tr("videos.otherCategory", "Other", "ផ្សេងៗ");
    }
    return localized(matchedVideo, "category", tr("videos.otherCategory", "Other", "ផ្សេងៗ"));
  };

  // =====================================================
  // FETCH VIDEOS
  // =====================================================
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/videos/");
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.items)
        ? response.data.items
        : [];
      setVideos(data);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET YOUTUBE ID
  // =====================================================
  const getYouTubeId = (url) => {
    if (!url) return null;
    try {
      const cleanUrl = String(url).trim();
      if (cleanUrl.includes("youtube.com/watch")) {
        const parsedUrl = new URL(cleanUrl);
        return parsedUrl.searchParams.get("v");
      }
      if (cleanUrl.includes("youtu.be/")) {
        return cleanUrl.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0];
      }
      if (cleanUrl.includes("youtube.com/shorts/")) {
        return cleanUrl.split("youtube.com/shorts/")[1]?.split("?")[0]?.split("&")[0];
      }
      if (cleanUrl.includes("youtube.com/embed/")) {
        return cleanUrl.split("youtube.com/embed/")[1]?.split("?")[0]?.split("&")[0];
      }
      return null;
    } catch (error) {
      console.error("YouTube ID error:", error);
      return null;
    }
  };

  // =====================================================
  // GET EMBED URL
  // =====================================================
  const getEmbedUrl = (url) => {
    const videoId = getYouTubeId(url);
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  };

  // =====================================================
  // CATEGORIES
  // =====================================================
  const categories = [
    "All",
    ...new Set(videos.map((video) => getCategoryKey(video)).filter(Boolean)),
  ];

  // =====================================================
  // FILTER VIDEOS
  // =====================================================
  const filteredVideos =
    activeCategory === "All"
      ? videos
      : videos.filter((video) => getCategoryKey(video) === activeCategory);

  // =====================================================
  // HANDLE CATEGORY
  // =====================================================
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white dark:bg-[#0F172A]">
        <div className="w-10 h-10 rounded-full border-[3px] border-blue-500/20 border-t-[#2563EB] animate-spin" />
      </div>
    );
  }

  // =====================================================
  // RETURN
  // =====================================================
  return (
    <main className={isKhmer ? "font-khmer" : ""}>
      {/* =================================================
          SEO
      ================================================= */}
      <Helmet>
        <title>
          {tr(
            "videos.pageTitle",
            "Video Showcase | SC Academy",
            "បញ្ជីវីដេអូ | SC Academy"
          )}
        </title>
        <meta
          name="description"
          content={tr(
            "videos.seoDescription",
            "Watch school activities, educational programmes, student achievements and events from SC Academy.",
            "ទស្សនាសកម្មភាពសាលា កម្មវិធីអប់រំ សមិទ្ធផលរបស់សិស្ស និងព្រឹត្តិការណ៍នានារបស់ SC Academy។"
          )}
        />
      </Helmet>

      {/* =================================================
          HERO WITH VIDEO BACKGROUND
      ================================================= */}
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md shadow-sm">
              🎬 {tr("videos.heroLabel", "VIDEO PLAYLIST", "បញ្ជីវីដេអូ")}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              {tr("videos.heroTitle", "Discover Life & Learning at SC Academy", "ស្វែងយល់ពីជីវិតនៅ SC Academy")}
            </h1>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed max-w-2xl font-medium drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
              {tr(
                "videos.heroDescription",
                "Watch our school activities, educational programmes, student achievements and special events at SC Academy.",
                "ទស្សនាសកម្មភាពសាលា កម្មវិធីអប់រំ សមិទ្ធផលរបស់សិស្ស និងព្រឹត្តិការណ៍ពិសេសៗនៅ SC Academy។"
              )}
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          VIDEO PLAYLIST
      ================================================= */}
      <section className="bg-[#F8FAFC] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* CATEGORY FILTER */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`
                    h-10 px-5 rounded-xl text-xs font-bold transition-all duration-200
                    ${
                      activeCategory === category
                        ? `bg-[#2563EB] text-white shadow-sm`
                        : `bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900`
                    }
                  `}
                >
                  {getCategoryLabel(category)}
                </button>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {filteredVideos.length === 0 ? (
            <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl py-12 px-6 text-center shadow-sm">
              <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                <FiVideo size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {tr("videos.noVideosFound", "No Videos Found", "រកមិនឃើញវីដេអូ")}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {tr("videos.noVideosDescription", "No videos are available in this category.", "មិនមានវីដេអូសម្រាប់ប្រភេទនេះទេ។")}
              </p>
            </div>
          ) : (
            /* VIDEO GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredVideos.map((video, index) => {
                const embedUrl = getEmbedUrl(video.video_url);
                const videoTitle = localized(
                  video,
                  "title",
                  tr("videos.defaultTitle", "SC Academy Video", "វីដេអូ SC Academy")
                );
                const videoCategory = localized(video, "category", "");

                return (
                  <article
                    key={video.id || index}
                    className="card-lift group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-slate-300 transition-all duration-300 flex flex-col"
                  >
                    {/* VIDEO CONTAINER */}
                    <div className="relative w-full aspect-video bg-slate-950 overflow-hidden">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={videoTitle}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white">
                          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-2 text-slate-400">
                            <FiVideo size={18} />
                          </div>
                          <span className="text-xs text-slate-500 font-medium">
                            {tr("videos.videoUnavailable", "Video unavailable", "វីដេអូមិនអាចមើលបាន")}
                          </span>
                        </div>
                      )}

                      {videoCategory && (
                        <div className="absolute top-3 left-3 z-10 pointer-events-none">
                          <span className="inline-flex items-center px-2.5 py-1 bg-[#2563EB] text-white rounded-md text-[10px] font-bold shadow-sm">
                            {videoCategory}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-5 flex flex-col flex-grow">
                      <span className="block text-[10px] text-[#2563EB] font-bold uppercase tracking-wider mb-1">
                        SC ACADEMY VIDEO
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2" title={videoTitle}>
                        {videoTitle}
                      </h3>
                      <div className="flex-grow" />
                      <div className="flex items-center justify-between gap-3 border-t border-slate-100 mt-4 pt-3 text-[11px] text-slate-400 font-medium">
                        <span>SC Academy Channel</span>
                        <span className="text-[#2563EB] font-semibold">Watch Now</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =================================================
          CTA
      ================================================= */}
      <section className="bg-white py-14 md:py-20 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 p-8 md:p-14 text-center text-white shadow-xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
              ✨ {tr("videos.community", "SC Academy Community", "សហគមន៍ SC Academy")}
            </span>
            <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {tr("videos.learnGrow", "Learn, Grow & Achieve Together", "រៀន រីកចម្រើន និងសម្រេចជោគជ័យជាមួយគ្នា")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl mx-auto mt-3">
              {tr(
                "videos.ctaDescription",
                "Watch our students learn, grow and create memorable experiences through education, activities and community events at SC Academy.",
                "ទស្សនាសិស្សរបស់យើងរៀនសូត្រ រីកចម្រើន និងបង្កើតបទពិសោធន៍គួរឱ្យចងចាំតាមរយៈការអប់រំ សកម្មភាព និងព្រឹត្តិការណ៍សហគមន៍នៅ SC Academy។"
              )}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link
                to="/courses"
                className="w-full sm:w-auto h-12 px-8 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
              >
                <span>{tr("common.ourCourses", "Explore Programs", "ស្វែងយល់វគ្គសិក្សា")}</span>
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
    </main>
  );
};

export default Videos;
