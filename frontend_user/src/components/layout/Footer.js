// Footer.jsx - Responsive SC Academy footer
import React from "react";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiChevronRight,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTelegramPlane,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

import telegramQr1 from "./telegram_qr.png";
import telegramQr2 from "./telegram_qr_02.png";

import { useLanguage } from "../../context/LanguageContext";
import { useSettings } from "../../context/SettingsContext";

const Footer = () => {
  const { language, t } = useLanguage();
  const { settings, logo: siteLogo } = useSettings();
  const isKhmer = language === "km";
  const currentYear = new Date().getFullYear();

  const tr = (key, english, khmer) => {
    const value = t(key);
    return value && value !== key ? value : isKhmer ? khmer : english;
  };

  const navigationLinks = [
    { to: "/", label: tr("nav.home", "Home", "ទំព័រដើម") },
    { to: "/courses", label: tr("nav.courses", "Programs", "កម្មវិធីសិក្សា") },
    { to: "/school", label: tr("nav.school", "School", "សាលារៀន") },
    { to: "/charity", label: tr("nav.charity", "Charity", "សប្បុរសធម៌") },
  ];

  const programLinks = [
    {
      to: "/courses",
      label: tr("footer.programs.fullStack", "Full-Stack Web Dev", "Full-Stack Web Dev"),
    },
    {
      to: "/courses",
      label: tr("footer.programs.graphicDesign", "Graphic Design & UI", "រចនាក្រាហ្វិក"),
    },
    {
      to: "/courses",
      label: tr("footer.programs.videoGraphic", "Video Editing & VFX", "វីដេអូ និងកាត់ត"),
    },
    {
      to: "/courses",
      label: tr("footer.programs.itSupport", "IT Support & Network", "បណ្ដាញ និង IT Support"),
    },
  ];

  // Social Links
  const socialLinks = [
    { href: settings.facebook_url || "https://www.facebook.com/sc.academy.117", label: "Facebook", icon: faFacebookF },
    { href: settings.telegram_url || "https://t.me/SC_Academy", label: "Telegram", icon: faTelegramPlane },
    { href: settings.youtube_url || "https://www.youtube.com/@SCAcademy-Cambodia", label: "YouTube", icon: faYoutube },
    { href: "https://www.tiktok.com/@sc_academy_official?_r=1&_t=ZS-99AivFTtumT", label: "TikTok", icon: faTiktok },
    { href: "https://www.instagram.com/sc.academy.117/", label: "Instagram", icon: faInstagram },
  ];

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sectionTitle = (eyebrow, title) => (
    <div className="mb-5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
        {eyebrow}
      </span>
      <h3 className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <div
        className="mt-2.5 h-[2px] w-12 rounded-full bg-[#2563EB]"
        aria-hidden="true"
      />
    </div>
  );

  return (
    <footer
      className={`relative overflow-hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 ${isKhmer ? "font-khmer" : "font-english"}`}
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-8 sm:gap-10">
          
          {/* BRAND SECTION */}
          <div>
            <Link
              to="/"
              onClick={scrollTop}
              className="group inline-flex items-center gap-3"
              aria-label="SC Academy Home"
            >
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-1.5 shadow-sm transition duration-300 group-hover:border-[#2563EB]">
                <img src={siteLogo || "/logo.png"} alt="SC Academy Logo" className="h-full w-full object-contain" />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  <span className="text-[#2563EB]">SC</span> Academy
                </h2>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {tr("nav.buildingFuture", "Building Future Leaders", "កសាងអ្នកដឹកនាំនាពេលអនាគត")}
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {(isKhmer ? settings.site_description_km : settings.site_description_en) ||
                tr(
                  "footer.description",
                  "Building knowledge, practical skills and future leaders through quality education and meaningful learning experiences.",
                  "កសាងចំណេះដឹង ជំនាញអនុវត្ត និងអ្នកដឹកនាំនាពេលអនាគត តាមរយៈការអប់រំប្រកបដោយគុណភាព និងបទពិសោធន៍សិក្សាដ៏មានន័យ។"
                )}
            </p>

            {/* Social Icons */}
            <div className="mt-4 sm:mt-5 flex items-center gap-2 sm:gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                >
                  <FontAwesomeIcon icon={social.icon} className="text-xs" />
                </a>
              ))}
            </div>

            {/* Telegram QR codes */}
            <div className="mt-5 sm:mt-6 flex flex-row items-center gap-3">
              {/* QR Code 1 */}
              <div className="flex flex-col items-center">
                <a 
                  href="https://t.me/SC_Academy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-[110px] sm:w-[125px] group/qr flex flex-col items-center overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2 shadow-sm transition-all duration-300 hover:border-[#2563EB]"
                >
                  <div className="h-16 w-16 sm:h-20 sm:w-20">
                    <img 
                      src={telegramQr1} 
                      alt="SC Academy Telegram QR" 
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="mt-1 inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] font-bold text-[#2563EB]">
                    <FontAwesomeIcon icon={faTelegramPlane} className="text-[9px]" />
                    Telegram
                  </span>
                </a>
                <p className="mt-1 text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 text-center">
                  {tr("footer.qrContact", "Official Contact", "ព័ត៌មានទំនាក់ទំនង")}
                </p>
              </div>

              {/* QR Code 2 */}
              <div className="flex flex-col items-center">
                <a 
                  href="https://t.me/SCACADEMY01" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-[110px] sm:w-[125px] group/qr flex flex-col items-center overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2 shadow-sm transition-all duration-300 hover:border-[#2563EB]"
                >
                  <div className="h-16 w-16 sm:h-20 sm:w-20">
                    <img 
                      src={telegramQr2} 
                      alt="SCACADEMY01 Telegram QR" 
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="mt-1 inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] font-bold text-[#2563EB]">
                    <FontAwesomeIcon icon={faTelegramPlane} className="text-[9px]" />
                    Channel
                  </span>
                </a>
                <p className="mt-1 text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 text-center">
                  {tr("footer.qrChannel", "Channel Info", "ឆានែលព័ត៌មាន")}
                </p>
              </div>
            </div>
          </div>

          {/* PROGRAMS */}
          <div>
            {sectionTitle(
              tr("footer.education", "Education", "ការអប់រំ"),
              tr("footer.ourCourses", "Programs", "កម្មវិធីសិក្សា")
            )}

            <ul className="space-y-2.5">
              {programLinks.map((program) => (
                <li key={program.label}>
                  <Link
                    to={program.to}
                    onClick={scrollTop}
                    className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:text-[#2563EB] dark:hover:text-[#2563EB]"
                  >
                    <FiChevronRight size={14} className="flex-none text-slate-400 group-hover:text-[#2563EB] transition-transform group-hover:translate-x-0.5" />
                    {program.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* QUICK LINKS */}
          <div>
            {sectionTitle(
              tr("footer.navigation", "Navigation", "រុករក"),
              tr("footer.quickLinks", "Quick Links", "តំណភ្ជាប់រហ័ស")
            )}

            <ul className="space-y-2.5">
              {navigationLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={scrollTop}
                    className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:text-[#2563EB] dark:hover:text-[#2563EB]"
                  >
                    <FiChevronRight size={14} className="flex-none text-slate-400 group-hover:text-[#2563EB] transition-transform group-hover:translate-x-0.5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div>
            {sectionTitle(
              tr("footer.getInTouch", "Connect", "ទាក់ទងមកយើង"),
              tr("footer.contactInfo", "Campus Info", "ព័ត៌មានទំនាក់ទំនង")
            )}

            <div className="space-y-2.5 sm:space-y-3.5">
              {/* Address */}
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 flex-none items-center justify-center rounded-xl bg-blue-50 dark:bg-slate-900 text-[#2563EB]">
                  <FiMapPin size={14} />
                </div>
                <div className="pt-0.5">
                  <p className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {tr("footer.address", "Address", "អាសយដ្ឋាន")}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {(isKhmer ? settings.address_km : settings.address_en) ||
                      tr("footer.addressLine1", "14 Street 349, Phnom Penh", "14 Street 349, Phnom Penh")}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 flex-none items-center justify-center rounded-xl bg-blue-50 dark:bg-slate-900 text-[#2563EB]">
                  <FiPhone size={14} />
                </div>
                <div className="pt-0.5">
                  <p className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {tr("footer.phone", "Phone", "ទូរស័ព្ទ")}
                  </p>
                  <a href={`tel:${settings.phone || "+85586306615"}`} className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-[#2563EB] transition mt-0.5 block">
                    {settings.phone || "086 306 615"}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 flex-none items-center justify-center rounded-xl bg-blue-50 dark:bg-slate-900 text-[#2563EB]">
                  <FiMail size={14} />
                </div>
                <div className="pt-0.5">
                  <p className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {tr("footer.email", "Email", "អ៊ីមែល")}
                  </p>
                  <a href={`mailto:${settings.email || "scacademy9@gmail.com"}`} className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-[#2563EB] transition mt-0.5 block">
                    {settings.email || "scacademy9@gmail.com"}
                  </a>
                </div>
              </div>
            </div>

            <Link
              to="/contact"
              onClick={scrollTop}
              className="mt-4 inline-flex h-9 sm:h-10 items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-4 sm:px-5 text-xs font-bold text-white shadow-sm transition active:scale-95"
            >
              <span>{tr("common.contactUs", "Contact Us", "ទាក់ទងមកយើង")}</span>
              <FiArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-4">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:px-6 md:flex-row lg:px-8 text-xs text-slate-500 dark:text-slate-400">
          <p>
            © {currentYear} <span className="font-bold text-slate-800 dark:text-slate-200">{isKhmer ? (settings.site_name_km || "SC Academy") : (settings.site_name_en || "SC Academy")}</span>.{" "}
            {tr("footer.allRightsReserved", "All Rights Reserved.", "រក្សាសិទ្ធិគ្រប់យ៉ាង។")}
          </p>

          <div className="flex items-center gap-4">
            <Link to="/" onClick={scrollTop} className="hover:text-[#2563EB] transition">
              {tr("footer.privacyPolicy", "Privacy Policy", "គោលការណ៍ឯកជនភាព")}
            </Link>
            <span>•</span>
            <Link to="/" onClick={scrollTop} className="hover:text-[#2563EB] transition">
              {tr("footer.termsOfService", "Terms of Service", "លក្ខខណ្ឌប្រើប្រាស់")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;