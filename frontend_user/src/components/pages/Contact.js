import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiSend,
  FiCheckCircle,
  FiUser,
  FiMessageSquare,
  FiArrowRight,
  FiExternalLink,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaYoutube,
  FaTelegramPlane,
  FaInstagram,
} from "react-icons/fa";

import api from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import heroVideo from "./video/sc-academy.mp4";

const Contact = () => {

  // =====================================================
  // LANGUAGE
  // =====================================================
  const { t, language } = useLanguage();
  const isKhmer = language === "km";

  // =====================================================
  // SC ACADEMY LOCATION
  // =====================================================
  const GOOGLE_MAP_LINK =
    "https://maps.app.goo.gl/y19U8vRnrNh8tSvo8";

  const GOOGLE_MAP_EMBED =
    "https://www.google.com/maps?q=SC+Academy,+AP+Plaza,+Preah+Monivong+Blvd,+Phnom+Penh,+Cambodia&output=embed";

  // =====================================================
  // STATE
  // =====================================================
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    hp_trap: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // TRANSLATION FALLBACK
  // =====================================================
  const tr = (key, english, khmer) => {
    const value = t(key);
    return (value && value !== key) ? value : (isKhmer ? khmer : english);
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // =====================================================
  // GET API ERROR MESSAGE
  // =====================================================
  const getApiErrorMessage = (apiError) => {
    const detail = apiError?.response?.data?.detail;
    if (Array.isArray(detail)) {
      return detail.map((item) => item?.msg || item).filter(Boolean).join(", ");
    }
    if (typeof detail === "string") return detail;
    return (
      apiError?.response?.data?.message ||
      tr(
        "contact.sendError",
        "Failed to send message. Please try again.",
        "ការផ្ញើសារមិនបានជោគជ័យ។ សូមព្យាយាមម្តងទៀត។"
      )
    );
  };

  // =====================================================
  // SUBMIT FORM
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(false);

    try {
      await api.post("/api/contact/", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (apiError) {
      console.error("Contact form error:", apiError);
      setError(getApiErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CONTACT INFORMATION
  // =====================================================
  const contactInfo = [
    {
      icon: FiMapPin,
      label: tr("contact.address", "Address", "អាសយដ្ឋាន"),
      value: tr(
        "contact.addressValue",
        "SC Academy, AP Plaza, Preah Monivong Blvd, Phnom Penh, Cambodia",
        "SC Academy, អគារ AP Plaza, មហាវិថីព្រះមុនីវង្ស, រាជធានីភ្នំពេញ, កម្ពុជា"
      ),
      href: GOOGLE_MAP_LINK,
    },
    {
      icon: FiPhone,
      label: tr("contact.phone", "Phone", "លេខទូរស័ព្ទ"),
      value: "+855 86 306 615",
      href: "tel:+85586306615",
    },
    {
      icon: FiMail,
      label: tr("contact.email", "Email", "អ៊ីមែល"),
      value: "info@scacademy.edu.kh",
      href: "mailto:info@scacademy.edu.kh",
    },
    {
      icon: FiSend,
      label: tr("contact.telegram", "Telegram", "តេឡេក្រាម"),
      value: "@SC_Academy",
      href: "https://t.me/SC_Academy",
    },
  ];

  // =====================================================
  // SOCIAL MEDIA
  // =====================================================
  const socialLinks = [
    { icon: FaFacebookF, label: "Facebook", href: "https://facebook.com" },
    { icon: FaTelegramPlane, label: "Telegram", href: "https://t.me/SC_Academy" },
    { icon: FaYoutube, label: "YouTube", href: "https://youtube.com" },
    { icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
  ];

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
            "contact.pageTitle",
            "Contact SC Academy | Get In Touch",
            "ទំនាក់ទំនង SC Academy | ទាក់ទងមកយើង"
          )}
        </title>
        <meta
          name="description"
          content={tr(
            "contact.seoDescription",
            "Contact SC Academy for enrollment, programmes, school activities and general inquiries.",
            "ទាក់ទង SC Academy សម្រាប់ការចុះឈ្មោះ កម្មវិធីសិក្សា សកម្មភាពសាលា និងព័ត៌មានទូទៅ។"
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
              💬 {tr("contact.heroLabel", "Contact Us", "ទំនាក់ទំនងមកយើង")}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              {tr("contact.heroTitle", "Get In Touch With SC Academy", "ទាក់ទងមកកាន់ SC Academy")}
            </h1>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed max-w-2xl font-medium drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
              {tr(
                "contact.heroDescription",
                "Have questions about our programmes, enrollment or school activities? Our SC Academy team is ready to help you.",
                "មានសំណួរអំពីកម្មវិធីសិក្សា ការចុះឈ្មោះ ឬសកម្មភាពសាលារបស់យើងមែនទេ? ក្រុមការងារ SC Academy របស់យើងត្រៀមខ្លួនជួយអ្នកជានិច្ច។"
              )}
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          CONTACT SECTION
      ================================================= */}
      <section className="bg-[#F8FAFC] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10 items-start">
            
            {/* =================================================
                CONTACT FORM
            ================================================= */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="border-b border-slate-100 px-6 sm:px-8 py-5">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#2563EB]">
                  {tr("contact.sendUsMessage", "Send Us A Message", "ផ្ញើសារមកយើង")}
                </span>
                <h3 className="text-lg sm:text-xl text-slate-900 font-bold mt-1">
                  {tr("contact.howCanHelp", "How Can We Help You?", "តើយើងអាចជួយអ្នកបានយ៉ាងដូចម្តេច?")}
                </h3>
              </div>

              {submitted ? (
                <div className="p-8 sm:p-12 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 bg-blue-50 text-[#2563EB] rounded-2xl flex items-center justify-center">
                    <FiCheckCircle size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {tr("contact.messageSent", "Message Sent Successfully!", "សារត្រូវបានផ្ញើ!")}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 max-w-sm mx-auto">
                    {tr(
                      "contact.messageSentDescription",
                      "Thank you for contacting SC Academy. Our team will get back to you as soon as possible.",
                      "សូមអរគុណដែលបានទាក់ទងមក SC Academy។ ក្រុមការងាររបស់យើងនឹងទាក់ទងទៅអ្នកវិញឱ្យបានឆាប់បំផុត។"
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSubmitted(false); setError(""); }}
                    className="mt-6 h-11 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl inline-flex items-center justify-center text-xs font-bold transition shadow-sm active:scale-95"
                  >
                    {tr("contact.sendAnother", "Send Another Message", "ផ្ញើសារមួយទៀត")}
                    <FiArrowRight size={14} className="ml-2" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                  {error && (
                    <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs">
                      {error}
                    </div>
                  )}

                  {/* Honeypot field */}
                  <div style={{ display: "none", position: "absolute", left: "-9999px" }} aria-hidden="true">
                    <label htmlFor="hp_trap">Do not fill this</label>
                    <input
                      type="text"
                      id="hp_trap"
                      name="hp_trap"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.hp_trap || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* NAME */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-slate-700 mb-1.5">
                        {tr("contact.fullName", "Full Name", "ឈ្មោះពេញ")} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          id="name" type="text" name="name" value={formData.name} onChange={handleChange}
                          placeholder={tr("contact.namePlaceholder", "Your full name", "បញ្ចូលឈ្មោះពេញរបស់អ្នក")}
                          required disabled={loading}
                          className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition"
                        />
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1.5">
                        {tr("contact.emailAddress", "Email Address", "អាសយដ្ឋានអ៊ីមែល")} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          id="email" type="email" name="email" value={formData.email} onChange={handleChange}
                          placeholder="example@email.com" required disabled={loading}
                          className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition"
                        />
                      </div>
                    </div>

                    {/* PHONE */}
                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                        {tr("contact.phoneNumber", "Phone Number", "លេខទូរស័ព្ទ")}
                      </label>
                      <div className="relative">
                        <FiPhone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange}
                          placeholder="+855 XX XXX XXX" disabled={loading}
                          className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition"
                        />
                      </div>
                    </div>

                    {/* SUBJECT */}
                    <div>
                      <label htmlFor="subject" className="block text-xs font-bold text-slate-700 mb-1.5">
                        {tr("contact.subject", "Subject", "ប្រធានបទ")}
                      </label>
                      <div className="relative">
                        <FiMessageSquare size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          id="subject" type="text" name="subject" value={formData.subject} onChange={handleChange}
                          placeholder={tr("contact.subjectPlaceholder", "How can we help?", "តើយើងអាចជួយអ្នកអ្វីបានខ្លះ?")}
                          disabled={loading}
                          className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* MESSAGE */}
                  <div className="mt-5">
                    <label htmlFor="message" className="block text-xs font-bold text-slate-700 mb-1.5">
                      {tr("contact.message", "Message", "សារ")} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message" name="message" value={formData.message} onChange={handleChange}
                      rows={5}
                      placeholder={tr("contact.messagePlaceholder", "Write your message here...", "សរសេរសាររបស់អ្នកនៅទីនេះ...")}
                      required disabled={loading}
                      className="w-full min-h-[120px] p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none resize-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition"
                    />
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full h-12 bg-[#2563EB] text-white rounded-xl text-xs font-bold flex items-center justify-center transition-all duration-200 hover:bg-[#1D4ED8] shadow-sm disabled:opacity-60 disabled:cursor-not-allowed active:scale-98"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        {tr("contact.sending", "Sending...", "កំពុងផ្ញើ...")}
                      </>
                    ) : (
                      <>
                        {tr("contact.sendMessage", "Send Message", "ផ្ញើសារ")}
                        <FiSend size={13} className="ml-2" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* =================================================
                CONTACT INFORMATION & CARDS
            ================================================= */}
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-[#2563EB]">
                  {tr("contact.contactInformation", "DIRECT CHANNELS", "ព័ត៌មានទំនាក់ទំនង")}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                  {tr("contact.getInTouch", "Connect with Us", "ទាក់ទងមកយើង")}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                  {tr(
                    "contact.contactInformationDescription",
                    "Contact us directly through any of the channels below. We are here to support your learning journey.",
                    "អ្នកអាចទាក់ទងមកយើងតាមរយៈជម្រើសណាមួយខាងក្រោម។ ក្រុមការងាររបស់យើងត្រៀមខ្លួនជួយអ្នកជានិច្ច។"
                  )}
                </p>
              </div>

              {/* CONTACT CARDS */}
              <div className="space-y-3">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <a
                      key={index}
                      href={info.href}
                      target={info.href.startsWith("http") ? "_blank" : undefined}
                      rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="card-lift group flex items-start gap-3.5 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-slate-300 transition-all duration-200"
                    >
                      <div className="w-10 h-10 min-w-[40px] bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-200">
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{info.label}</p>
                        <p className="text-xs sm:text-sm text-slate-900 font-semibold mt-0.5 break-words group-hover:text-[#2563EB] transition-colors">{info.value}</p>
                      </div>
                      <FiExternalLink size={13} className="text-slate-400 group-hover:text-[#2563EB] mt-1 shrink-0 transition" />
                    </a>
                  );
                })}
              </div>

              {/* SOCIAL MEDIA */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {tr("contact.socialMedia", "Social Channels", "បណ្ដាញសង្គម")}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                      {tr("contact.followAcademy", "Follow SC Academy", "តាមដាន SC Academy")}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={index}
                          href={social.href}
                          aria-label={social.label}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition"
                        >
                          <Icon size={14} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          LOCATION
      ================================================= */}
      <section className="bg-white py-12 md:py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <span className="text-[#2563EB] text-xs font-bold uppercase tracking-widest">
              {tr("contact.visitCampus", "Visit Our Campus", "មកទស្សនាសាលារបស់យើង")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
              {tr("contact.findAcademy", "Find SC Academy in Phnom Penh", "ស្វែងរកទីតាំង SC Academy")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
              {tr(
                "contact.locationDescription",
                "Visit SC Academy at AP Plaza on Preah Monivong Blvd in Phnom Penh.",
                "មកទស្សនា SC Academy នៅអគារ AP Plaza លើមហាវិថីព្រះមុនីវង្ស រាជធានីភ្នំពេញ។"
              )}
            </p>
          </div>

          {/* MAP CONTAINER */}
          <div className="relative h-[380px] md:h-[450px] bg-slate-100 border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <iframe
              title="SC Academy Location"
              src={GOOGLE_MAP_EMBED}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
              <a
                href={GOOGLE_MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl shadow-md inline-flex items-center justify-center text-xs font-bold whitespace-nowrap transition-all duration-300 active:scale-95"
              >
                <FiMapPin size={14} className="mr-2" />
                {tr("contact.openGoogleMaps", "Open in Google Maps", "បើកក្នុង Google Maps")}
                <FiExternalLink size={13} className="ml-2" />
              </a>
            </div>
          </div>

          {/* LOCATION INFO CARD */}
          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 min-w-[40px] bg-blue-100 text-[#2563EB] rounded-xl flex items-center justify-center">
                <FiMapPin size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {tr("contact.ourCampus", "Head Office", "សាលារបស់យើង")}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">SC Academy Official Campus</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                  {tr(
                    "contact.addressValue",
                    "SC Academy, AP Plaza, Preah Monivong Blvd, Phnom Penh, Cambodia",
                    "SC Academy, អគារ AP Plaza, មហាវិថីព្រះមុនីវង្ស, រាជធានីភ្នំពេញ, កម្ពុជា"
                  )}
                </p>
              </div>
            </div>
            <a
              href={GOOGLE_MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-xl inline-flex items-center justify-center text-xs font-bold whitespace-nowrap transition-all duration-200 shadow-sm shrink-0"
            >
              {tr("contact.getDirections", "Get Directions", "មើលផ្លូវទៅកាន់ទីតាំង")}
              <FiArrowRight size={13} className="ml-2 text-[#2563EB]" />
            </a>
          </div>
        </div>
      </section>

      {/* =================================================
          BOTTOM CTA
      ================================================= */}
      <section className="bg-[#F8FAFC] py-14 md:py-20 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 p-8 md:p-14 text-center text-white shadow-xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
              {tr("contact.startJourney", "Start Your Tech Journey", "ចាប់ផ្តើមដំណើររបស់អ្នក")}
            </span>
            <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {tr("contact.readyToJoin", "Ready to Join SC Academy?", "ត្រៀមខ្លួនចូលរួមជាមួយ SC Academy?")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl mx-auto mt-3">
              {tr(
                "contact.ctaDescription",
                "Contact our team today to learn more about enrollment, programs and educational opportunities available at SC Academy.",
                "ទាក់ទងក្រុមការងាររបស់យើងថ្ងៃនេះ ដើម្បីស្វែងយល់បន្ថែមអំពីការចុះឈ្មោះ កម្មវិធី និងឱកាសអប់រំដែលមាននៅ SC Academy។"
              )}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <a
                href="https://t.me/SC_Academy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto h-12 px-8 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
              >
                <FaTelegramPlane size={15} />
                <span>{tr("contact.chatTelegram", "Chat on Telegram", "ជជែកតាមតេឡេក្រាម")}</span>
              </a>
              <Link
                to="/courses"
                className="w-full sm:w-auto h-12 px-8 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center transition-all"
              >
                {tr("courses.viewAll", "Explore All Programs", "មើលវគ្គសិក្សាទាំងអស់")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
