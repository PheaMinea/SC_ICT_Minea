import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiHeart,
  FiUsers,
} from "react-icons/fi";

import { useLanguage } from "../../context/LanguageContext";
import api from "../../services/api";
import { getImageUrl } from "../../utils/helpers";
import TypewriterText from "../common/TypewriterText";
import EmptyState from "../common/EmptyState";
import heroVideo from "./video/sc-academy.mp4";

const Charity = () => {

  const { t, language } = useLanguage();
  const isKhmer = language === "km";

  const [content, setContent] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const tr = (key, english, khmer) => {
    const value = t(key);
    if (value && value !== key) return value;
    return isKhmer ? khmer : english;
  };

  useEffect(() => {
    const fetchCharityPage = async () => {
      try {
        setLoading(true);

        const [contentResult, imagesResult] = await Promise.allSettled([
          api.get("/api/charity/"),
          api.get("/api/charity/images", {
            params: { skip: 0, limit: 100 },
          }),
        ]);

        if (contentResult.status === "fulfilled") {
          setContent(contentResult.value.data || null);
        } else {
          setContent(null);
        }

        const imageData =
          imagesResult.status === "fulfilled"
            ? Array.isArray(imagesResult.value.data)
              ? imagesResult.value.data
              : Array.isArray(imagesResult.value.data?.items)
              ? imagesResult.value.data.items
              : []
            : [];

        setImages(imageData);
      } catch (error) {
        console.error("Error fetching charity page:", error);
        setContent(null);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCharityPage();
  }, []);

  const localized = (field, fallback = "") => {
    if (!content) return fallback;
    const selectedField = `${field}_${language}`;
    const selectedValue = content[selectedField];
    if (selectedValue?.trim()) return selectedValue;
    return fallback;
  };

  const localizedImage = (item, field, fallback = "") => {
    if (!item) return fallback;
    const selectedField = `${field}_${language}`;
    const selectedValue = item[selectedField];
    if (selectedValue?.trim()) return selectedValue;
    return fallback;
  };

  const heroTitle = localized(
    "hero_title",
    tr("charity.heroTitle", "Empowering Students Through Education", "ផ្តល់ឱកាសឱ្យសិស្សកាន់តែច្រើនបានសិក្សា")
  );

  const heroDescription = localized(
    "hero_description",
    tr(
      "charity.heroDescription",
      "Your support helps SC Academy provide learning opportunities, guidance and resources for students and families in our community.",
      "ការគាំទ្ររបស់អ្នកជួយឱ្យ SC Academy ផ្តល់ឱកាសសិក្សា ការណែនាំ និងធនធានដល់សិស្ស និងគ្រួសារក្នុងសហគមន៍របស់យើង។"
    )
  );

  const impactTitle = localized(
    "impact_title",
    tr("charity.impactTitle", "Support Education With Purpose", "គាំទ្រការអប់រំប្រកបដោយគោលបំណង")
  );

  const impactDescription = localized(
    "impact_description",
    tr(
      "charity.impactDescription",
      "Together, we can help students access learning materials, mentorship and a caring school community.",
      "រួមគ្នា យើងអាចជួយសិស្សទទួលបានសម្ភារៈសិក្សា ការណែនាំ និងសហគមន៍សាលាដែលពោរពេញដោយការយកចិត្តទុកដាក់។"
    )
  );

  const supportTitle = localized(
    "support_title",
    tr("charity.joinTitle", "Every Contribution Can Open a Door", "ការចូលរួមគ្រប់បែបយ៉ាងអាចបើកទ្វារឱកាស")
  );

  const supportDescription = localized(
    "support_description",
    tr(
      "charity.joinDescription",
      "Whether through donations, resources or partnership, your support helps students continue learning and growing in a caring environment.",
      "មិនថាតាមរយៈការបរិច្ចាគ ធនធាន ឬភាពជាដៃគូទេ ការគាំទ្ររបស់អ្នកជួយឱ្យសិស្សបន្តសិក្សា និងរីកចម្រើនក្នុងបរិយាកាសដែលមានការយកចិត្តទុកដាក់។"
    )
  );

  const impactItems = [
    {
      icon: FiBookOpen,
      title: tr("charity.scholarshipsTitle", "Student Scholarships", "អាហារូបករណ៍សម្រាប់សិស្ស"),
      description: tr(
        "charity.scholarshipsDescription",
        "Support students who need help accessing quality tech and leadership learning opportunities.",
        "គាំទ្រសិស្សដែលត្រូវការជំនួយ ដើម្បីទទួលបានឱកាសសិក្សាប្រកបដោយគុណភាព។"
      ),
    },
    {
      icon: FiUsers,
      title: tr("charity.communityTitle", "Community Outreach", "ការគាំទ្រសហគមន៍"),
      description: tr(
        "charity.communityDescription",
        "Help families and young learners stay connected to modern digital education and guidance.",
        "ជួយគ្រួសារ និងយុវសិស្សឱ្យបន្តភ្ជាប់ជាមួយការអប់រំ និងការណែនាំ។"
      ),
    },
    {
      icon: FiHeart,
      title: tr("charity.careTitle", "Learning With Care", "ការសិក្សាដោយការយកចិត្តទុកដាក់"),
      description: tr(
        "charity.careDescription",
        "Contribute to an inspiring environment where every student can learn with dignity and confidence.",
        "ចូលរួមបង្កើតបរិយាកាសគាំទ្រ ដែលសិស្សអាចសិក្សាដោយទំនុកចិត្ត។"
      ),
    },
  ];

  const defaultGivingOptions = [
    tr("charity.option1", "Sponsor a student's learning materials & tools", "ឧបត្ថម្ភសម្ភារៈសិក្សាសម្រាប់សិស្ស"),
    tr("charity.option2", "Support classroom tech resources and lab activities", "គាំទ្រធនធាន និងសកម្មភាពក្នុងថ្នាក់រៀន"),
    tr("charity.option3", "Partner with SC Academy on digital education outreach", "ចូលរួមជាដៃគូជាមួយ SC Academy ក្នុងសកម្មភាពអប់រំសហគមន៍"),
    tr("charity.option4", "Volunteer your time, tech skills or career mentorship", "ស្ម័គ្រចិត្តផ្តល់ពេលវេលា ចំណេះដឹង ឬការណែនាំ"),
  ];

  const supportOptionsText = localized("support_options", "");
  const givingOptions = supportOptionsText
    ? supportOptionsText.split("\n").map((item) => item.trim()).filter(Boolean)
    : defaultGivingOptions;

  return (
    <main className={isKhmer ? "font-khmer" : ""}>
      <Helmet>
        <title>{tr("charity.title", "Charity & Outreach", "សប្បុរសធម៌")} | SC Academy</title>
        <meta
          name="description"
          content={tr(
            "charity.seoDescription",
            "Support SC Academy charity and community education initiatives.",
            "គាំទ្រសកម្មភាពសប្បុរសធម៌ និងគម្រោងអប់រំសហគមន៍របស់ SC Academy។"
          )}
        />
      </Helmet>

      {/* ======================================================
          HERO WITH VIDEO BACKGROUND
      ======================================================= */}
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
              {tr("charity.heroLabel", "COMMUNITY & OUTREACH", "សប្បុរសធម៌ SC Academy")}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              {isKhmer ? (
                <>
                  សកម្មភាពសប្បុរសធម៌ &{" "}
                  <TypewriterText
                    words={[
                      heroTitle,
                      "ការអប់រំសម្រាប់ទាំងអស់គ្នា",
                      "អាហារូបករណ៍សម្រាប់សិស្ស",
                      "ការគាំទ្រសហគមន៍កម្ពុជា",
                      "កសាងអនាគតយុវជន",
                    ]}
                    highlightClassName="animated-gradient-text"
                  />
                </>
              ) : (
                <>
                  Community Outreach &{" "}
                  <TypewriterText
                    words={[
                      heroTitle,
                      "Education For All",
                      "Student Scholarships",
                      "Empowering Communities",
                      "Building Hope & Skills",
                    ]}
                    highlightClassName="animated-gradient-text"
                  />
                </>
              )}
            </h1>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed max-w-2xl font-medium drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
              {heroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          PAGE BODY WITH DOT MATRIX PATTERN
      ======================================================= */}
      <div className="relative w-full bg-dot-matrix-page overflow-hidden">
        {/* ======================================================
            IMPACT
        ======================================================= */}
        <section className="bg-transparent py-12 md:py-16 scroll-reveal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
              <span className="text-[#2563EB] text-xs font-bold uppercase tracking-widest">
                {tr("charity.impactLabel", "Our Impact", "ឥទ្ធិពលរបស់យើង")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
                {impactTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 max-w-lg mx-auto">
                {impactDescription}
              </p>
            </div>

            {loading ? (
              <div className="flex min-h-[180px] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-200 border-t-[#2563EB]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {impactItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <article
                      key={item.title}
                      className={`card-lift bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm scroll-reveal stagger-${idx + 1}`}
                    >
                      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-[#2563EB]">
                        <Icon size={24} />
                      </div>
                      <h3 className="mb-2 text-base font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ======================================================
            HOW TO HELP
        ======================================================= */}
        <section className="bg-transparent py-12 md:py-16 scroll-reveal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="scroll-reveal-left">
                <span className="text-xs uppercase tracking-widest font-bold text-[#2563EB]">
                  {tr("charity.joinLabel", "HOW YOU CAN HELP", "របៀបដែលអ្នកអាចជួយ")}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5 mb-4">
                  {supportTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mb-6">
                  {supportDescription}
                </p>

                <Link
                  to="/contact"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-7 text-xs font-bold text-white shadow-sm transition active:scale-95"
                >
                  <span>{tr("charity.contactButton", "Partner With Us", "ទាក់ទងមកយើង")}</span>
                  <FiArrowRight size={14} />
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                  {tr("charity.optionsLabel", "Giving Opportunities", "វិធីចូលរួមគាំទ្រ")}
                </span>
                <h3 className="mb-5 text-lg font-bold text-slate-900 mt-1">
                  {tr("charity.optionsTitle", "Ways You Can Support", "វិធីដែលអ្នកអាចគាំទ្រ")}
                </h3>

                <div className="space-y-3">
                  {givingOptions.map((option, index) => (
                    <div
                      key={`${option}-${index}`}
                      className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <FiCheckCircle size={17} className="text-[#2563EB] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium leading-relaxed text-slate-800">
                        {option}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            CHARITY GALLERY
        ======================================================= */}
        <section className="bg-transparent py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
              <span className="text-[#2563EB] text-xs font-bold uppercase tracking-widest">
                {tr("charity.galleryLabel", "Charity Activities", "សកម្មភាពសប្បុរសធម៌")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
                {tr("charity.galleryTitle", "Our Outreach & Charity Gallery", "វិចិត្រសាលសកម្មភាពសប្បុរសធម៌")}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                {tr("charity.galleryDescription", "Explore our charity and community education activities.", "ស្វែងយល់ពីសកម្មភាពសប្បុរសធម៌ និងការអប់រំសហគមន៍របស់យើង។")}
              </p>
            </div>

            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-200 border-t-[#2563EB]" />
              </div>
            ) : images.length === 0 ? (
              <EmptyState
                icon={FiHeart}
                title_km="មិនទាន់មានរូបភាពសប្បុរសធម៌នៅឡើយទេ"
                title_en="No Charity Images Available"
                description_km="រូបភាពសកម្មភាពសប្បុរសធម៌ និងការចែករំលែកសហគមន៍នឹងបង្ហាញនៅទីនេះពេលមានការបញ្ចូល។"
                description_en="Charity and community outreach activity photos will appear here once added."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((item) => {
                  const imageTitle = localizedImage(item, "title") || tr("charity.activity", "Charity Activity", "សកម្មភាពសប្បុរសធម៌");
                  const imageDescription = localizedImage(item, "description") || "";

                  return (
                    <article key={item.id} className="card-lift group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-all duration-300 flex flex-col">
                      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                        <img
                          src={getImageUrl(item.image_url || item.image)}
                          alt={imageTitle}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(event) => { event.currentTarget.style.display = "none"; }}
                        />
                      </div>
                      <div className="p-5 flex-grow">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors line-clamp-1">
                          {imageTitle}
                        </h3>
                        {imageDescription && (
                          <p className="line-clamp-2 text-xs text-slate-600 leading-relaxed mt-1.5">
                            {imageDescription}
                          </p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Charity;
