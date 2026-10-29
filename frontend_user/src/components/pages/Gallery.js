import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiImage,
} from "react-icons/fi";

import api from "../../services/api";
import TypewriterText from "../common/TypewriterText";
import EmptyState from "../common/EmptyState";
import { useLanguage } from "../../context/LanguageContext";
import heroVideo from "./video/sc-academy.mp4";

const Gallery = () => { 

  // =====================================================
  // LANGUAGE
  // =====================================================
  const { t, language } = useLanguage();
  const isKhmer = language === "km";

  // =====================================================
  // STATES
  // =====================================================
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  // =====================================================
  // API BASE URL
  // =====================================================
  const API_BASE_URL =
    process.env.REACT_APP_API_URL ||
    "http://127.0.0.1:8000";

  // =====================================================
  // TRANSLATION FALLBACK
  // =====================================================
  const tr = (key, english, khmer) => {
    const value = t(key);
    return (value && value !== key) ? value : (isKhmer ? khmer : english);
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
  const getCategoryKey = (image) => {
    if (!image) return "";
    return image.category_en || image.category || image.category_km || "";
  };

  // =====================================================
  // GET CATEGORY LABEL
  // =====================================================
  const getCategoryLabel = (categoryKey) => {
    if (categoryKey === "All") {
      return tr("gallery.allCategories", "All", "ទាំងអស់");
    }
    const matchedImage = images.find((image) => getCategoryKey(image) === categoryKey);
    if (!matchedImage) {
      return tr("gallery.otherCategory", "Other", "ផ្សេងៗ");
    }
    return localized(matchedImage, "category", tr("gallery.otherCategory", "Other", "ផ្សេងៗ"));
  };

  // =====================================================
  // FETCH GALLERY
  // =====================================================
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/gallery/");
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.items)
        ? response.data.items
        : [];

      setImages(data);

      const uniqueCategories = [
        "All",
        ...new Set(data.map((image) => getCategoryKey(image)).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      setImages([]);
      setCategories(["All"]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // IMAGE URL
  // =====================================================
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
    if (imageUrl.startsWith("/")) return `${API_BASE_URL}${imageUrl}`;
    return `${API_BASE_URL}/${imageUrl}`;
  };

  // =====================================================
  // FILTER
  // =====================================================
  const getFilteredImages = () => {
    if (activeCategory === "All") return images;
    return images.filter((image) => getCategoryKey(image) === activeCategory);
  };

  const filteredImages = getFilteredImages();

  // =====================================================
  // OPEN LIGHTBOX
  // =====================================================
  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    document.body.style.overflow = "hidden";
  };

  // =====================================================
  // CLOSE LIGHTBOX
  // =====================================================
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  // =====================================================
  // NEXT / PREVIOUS
  // =====================================================
  const navigateImage = (direction) => {
    const filtered = getFilteredImages();
    if (filtered.length === 0) return;
    const newIndex = (currentIndex + direction + filtered.length) % filtered.length;
    setCurrentIndex(newIndex);
    setSelectedImage(filtered[newIndex]);
  };

  // =====================================================
  // CATEGORY CHANGE
  // =====================================================
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentIndex(0);
    setSelectedImage(null);
  };

  // =====================================================
  // KEYBOARD LIGHTBOX
  // =====================================================
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedImage) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") navigateImage(-1);
      if (event.key === "ArrowRight") navigateImage(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage, currentIndex, activeCategory]);

  // =====================================================
  // CLEAN BODY OVERFLOW
  // =====================================================
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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
            "gallery.pageTitle",
            "SC Academy Gallery | Photos & Activities",
            "វិចិត្រសាល SC Academy | រូបភាព និងសកម្មភាព"
          )}
        </title>
        <meta
          name="description"
          content={tr(
            "gallery.seoDescription",
            "Explore our photo gallery showcasing life, activities and events at SC Academy.",
            "ស្វែងយល់ពីវិចិត្រសាលរូបភាពរបស់យើង ដែលបង្ហាញពីជីវិត សកម្មភាព និងព្រឹត្តិការណ៍នានានៅ SC Academy។"
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full animate-text-focus">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-[#2563EB] dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
              {tr("gallery.heroLabel", "Photo Gallery", "វិចិត្រសាលរូបភាព")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              {isKhmer ? (
                <>
                  ទិដ្ឋភាព & អនុស្សាវរីយ៍{" "}
                  <TypewriterText
                    words={[
                      "នៅ SC Academy",
                      "សកម្មភាពសិក្សាក្នុង Lab",
                      "សិក្ខាសាលាបច្ចេកវិទ្យា",
                      "ពិធីទទួលវិញ្ញាបនបត្រ",
                    ]}
                    highlightClassName="animated-gradient-text"
                  />
                </>
              ) : (
                <>
                  Life & Moments at{" "}
                  <TypewriterText
                    words={[
                      "SC Academy",
                      "Hands-on Lab Days",
                      "Tech Workshops",
                      "Graduation Celebrations",
                    ]}
                    highlightClassName="animated-gradient-text"
                  />
                </>
              )}
            </h1>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed max-w-2xl font-medium drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
              {tr(
                "gallery.heroDescription",
                "Discover memorable moments, student activities, learning experiences and special events from our vibrant SC Academy community.",
                "ស្វែងយល់ពីអនុស្សាវរីយ៍ដ៏មានតម្លៃ សកម្មភាពសិស្ស បទពិសោធន៍សិក្សា និងព្រឹត្តិការណ៍ពិសេសៗពីសហគមន៍ SC Academy របស់យើង។"
              )}
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          GALLERY SECTION
      ================================================= */}
      <section className="bg-dot-matrix-page py-12 md:py-16">
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

          {filteredImages.length === 0 ? (
            <EmptyState
              icon={FiImage}
              title_km="មិនទាន់មានរូបភាពក្នុងវិចិត្រសាលនៅឡើយទេ"
              title_en="No Gallery Images Found"
              description_km={activeCategory !== "All" ? "មិនមានរូបភាពសម្រាប់ប្រភេទដែលអ្នកបានជ្រើសរើសឡើយ។" : "រូបភាពសកម្មភាពសាលានឹងបង្ហាញនៅទីនេះបន្ទាប់ពីត្រូវបានបញ្ចូល។"}
              description_en={activeCategory !== "All" ? "No gallery images available for this selected category." : "Campus activity images will appear here once added."}
              onReset={activeCategory !== "All" ? () => handleCategoryChange("All") : null}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image, index) => {
                const imageTitle = localized(
                  image,
                  "title",
                  tr("gallery.defaultTitle", "SC Academy Gallery", "វិចិត្រសាល SC Academy")
                );
                const imageCategory = localized(image, "category", "");

                return (
                  <div
                    key={image.id || index}
                    onClick={() => openLightbox(image, index)}
                    className={`card-lift group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 cursor-pointer transition-all duration-300 flex flex-col scroll-reveal stagger-${(index % 6) + 1}`}
                  >
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                      {/* Fallback */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100">
                        <FiImage size={30} className="text-slate-300 mb-1" />
                        <span className="text-[10px] text-slate-400 font-medium">SC Academy</span>
                      </div>

                      <img
                        src={getImageUrl(image.image_url || image.image)}
                        alt={imageTitle}
                        loading="lazy"
                        decoding="async"
                        className="relative z-[1] w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(event) => { event.currentTarget.style.display = "none"; }}
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 z-[2] bg-slate-950/0 group-hover:bg-slate-950/20 transition-all duration-300" />

                      {/* Category Badge */}
                      {imageCategory && (
                        <div className="absolute top-3 left-3 z-[3]">
                          <span className="inline-flex items-center px-2.5 py-1 bg-[#2563EB] text-white rounded-md text-[10px] font-bold shadow-sm">
                            {imageCategory}
                          </span>
                        </div>
                      )}

                      {/* View Icon */}
                      <div className="absolute inset-0 z-[4] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 bg-white/95 text-slate-900 rounded-full flex items-center justify-center shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-300">
                          <FiImage size={16} />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-grow">
                      <span className="block text-[10px] text-[#2563EB] font-bold uppercase tracking-wider">
                        SC ACADEMY MOMENTS
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors mt-1 line-clamp-2" title={imageTitle}>
                        {imageTitle}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>



      {/* =================================================
          LIGHTBOX (CLEAN MODERN OVERLAY)
      ================================================= */}
      {selectedImage && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center" onClick={closeLightbox}>
          <button type="button" onClick={(event) => { event.stopPropagation(); closeLightbox(); }} className="absolute top-5 right-5 z-30 w-11 h-11 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center text-white transition-all">
            <FiX size={20} />
          </button>

          {filteredImages.length > 1 && (
            <button type="button" onClick={(event) => { event.stopPropagation(); navigateImage(-1); }} className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center text-white transition-all">
              <FiChevronLeft size={24} />
            </button>
          )}

          {filteredImages.length > 1 && (
            <button type="button" onClick={(event) => { event.stopPropagation(); navigateImage(1); }} className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center text-white transition-all">
              <FiChevronRight size={24} />
            </button>
          )}

          <div className="relative w-full max-w-4xl px-6 md:px-14 py-8" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-center">
              <img src={getImageUrl(selectedImage.image_url || selectedImage.image)} alt={localized(selectedImage, "title", tr("gallery.defaultTitle", "SC Academy Gallery", "វិចិត្រសាល SC Academy"))} className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl" />
            </div>
            <div className="text-center mt-5">
              {localized(selectedImage, "category", "") && (
                <span className="inline-flex items-center px-3 py-1 bg-[#2563EB] text-white text-[10px] font-bold rounded-md mb-2">
                  {localized(selectedImage, "category", "")}
                </span>
              )}
              <h3 className="text-white text-base md:text-lg font-bold">
                {localized(selectedImage, "title", tr("gallery.defaultTitle", "SC Academy Gallery", "វិចិត្រសាល SC Academy"))}
              </h3>
              <p className="text-slate-400 text-xs font-medium mt-2">{currentIndex + 1} / {filteredImages.length}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Gallery;
