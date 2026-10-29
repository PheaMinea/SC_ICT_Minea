import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  FiMenu,
  FiX,
  FiPhone,
  FiMail,
  FiMapPin,
  FiSearch,
  FiArrowUpRight,
  FiSun,
  FiMoon,
} from "react-icons/fi";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faFacebookF,
  faInstagram,
  faTelegramPlane,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { useSettings } from "../../context/SettingsContext";

/* =========================================================
   DATA
========================================================= */

const NAV_LINKS = [
  {
    to: "/",
    key: "nav.home",
    en: "Home",
    km: "ទំព័រដើម",
  },
  {
    to: "/courses",
    key: "nav.courses",
    en: "Courses",
    km: "វគ្គសិក្សា",
  },
  {
    to: "/school",
    key: "nav.school",
    en: "School",
    km: "សាលារៀន",
  },
  {
    to: "/charity",
    key: "nav.charity",
    en: "Charity",
    km: "សប្បុរសធម៌",
  },
  {
    to: "/gallery",
    key: "nav.gallery",
    en: "Gallery",
    km: "រូបភាព",
  },
  {
    to: "/videos",
    key: "nav.videos",
    en: "Videos",
    km: "វីដេអូ",
  },
  {
    to: "/contact",
    key: "nav.contact",
    en: "Contact",
    km: "ទំនាក់ទំនង",
  },
];

const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/sc.academy.117",
    label: "Facebook",
    icon: faFacebookF,
  },
  {
    href: "https://www.instagram.com/sc.academy.117/",
    label: "Instagram",
    icon: faInstagram,
  },
  {
    href: "https://t.me/SC_Academy",
    label: "Telegram",
    icon: faTelegramPlane,
  },
  {
    href: "https://www.youtube.com/@SCAcademy-Cambodia",
    label: "YouTube",
    icon: faYoutube,
  },
  {
    href: "https://www.tiktok.com/@sc_academy_official?_r=1&_t=ZS-99AivFTtumT",
    label: "TikTok",
    icon: faTiktok,
  },
];

const CONTACT = {
  phone: "086 306 615",
  email: "scacademy9@gmail.com",
  location: "14 Street 349, Phnom Penh",
  mapLink: "https://maps.app.goo.gl/y19U8vRnrNh8tSvo8",
};

const LANGUAGE_OPTIONS = [
  {
    code: "km",
    label: "ភាសាខ្មែរ",
    flag:
      "https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_Cambodia.svg",
  },
  {
    code: "en",
    label: "English",
    flag:
      "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg",
  },
];

/* =========================================================
   TOP BAR CONTACT
========================================================= */

const TopBarContact = ({ Icon, href, children, scrolled }) => (
  <a
    href={href}
    className={`
      flex
      h-[32px]
      items-center
      gap-2
      rounded-full
      border
      px-3
      transition-all
      duration-500
      hover:-translate-y-[1px]

      ${scrolled ? "text-[#171717] hover:text-[#143DAA]" : "text-white hover:text-white/90"}
      xl:px-4

      ${
        scrolled
          ? `
              border-white/70
              bg-white/35
              shadow-[0_4px_12px_rgba(0,0,0,0.15)]
              backdrop-blur-md
            `
          : `
              border-transparent
              bg-transparent
              shadow-none
              backdrop-blur-none
            `
      }
    `}
  >
    <Icon className="flex-shrink-0 text-[13px]" />

    <span className="whitespace-nowrap text-[12px] font-medium">
      {children}
    </span>
  </a>
);

/* =========================================================
   TOP BAR LOCATION
========================================================= */

const TopBarLocation = ({ Icon, href, children, scrolled }) => (
  <a
    href={href || "https://maps.app.goo.gl/y19U8vRnrNh8tSvo8"}
    target="_blank"
    rel="noopener noreferrer"
    className={`
      flex
      h-[32px]
      items-center
      gap-2
      rounded-full
      border
      px-3
      transition-all
      duration-500
      hover:-translate-y-[1px]
      ${scrolled ? "text-[#171717] hover:text-[#143DAA]" : "text-white hover:text-white/90"}
      xl:px-4

      ${
        scrolled
          ? `
              border-white/70
              bg-white/35
              shadow-[0_4px_12px_rgba(0,0,0,0.15)]
              backdrop-blur-md
            `
          : `
              border-transparent
              bg-transparent
              shadow-none
              backdrop-blur-none
            `
      }
    `}
  >
    <Icon className="flex-shrink-0 text-[13px]" />

    <span className="whitespace-nowrap text-[12px] font-medium">
      {children}
    </span>
  </a>
);

/* =========================================================
   SOCIAL ICON
========================================================= */

const SocialIcon = ({ href, label, icon, scrolled }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={`
      flex
      h-[30px]
      w-[30px]
      items-center
      justify-center
      rounded-full
      border
      transition-all
      duration-500
      hover:-translate-y-[1px]
      hover:bg-[#143DAA]

      ${scrolled ? "text-[#171717]" : "text-white"}
      hover:text-white

      ${
        scrolled
          ? `
              border-white/70
              bg-white/30
              shadow-[0_4px_12px_rgba(0,0,0,0.15)]
              backdrop-blur-md
            `
          : `
              border-transparent
              bg-transparent
              shadow-none
              backdrop-blur-none
            `
      }
    `}
  >
    <FontAwesomeIcon icon={icon} className="text-[11px]" />
  </a>
);

/* =========================================================
   LANGUAGE DROPDOWN
========================================================= */

const LanguageDropdown = ({
  isOpen,
  language,
  scrolled,
  onToggle,
  onChange,
}) => {
  const current =
    LANGUAGE_OPTIONS.find((item) => item.code === language) ||
    LANGUAGE_OPTIONS[0];

  return (
    <div className="relative z-[500] ml-1 overflow-visible">
      <button
        type="button"
        onClick={onToggle}
        aria-label="Change language"
        className={`
          flex
          h-[32px]
          w-[32px]
          items-center
          justify-center
          rounded-full
          transition-all
          duration-300

          ${
            scrolled
              ? `
                  border-2
                  border-[#143DAA]/10
                  bg-[#F8FAFC]
                  hover:border-[#5d23ef]
                `
              : `
                  border-2
                  border-transparent
                  bg-transparent
                `
          }
        `}
      >
        <img
          src={current.flag}
          alt={current.label}
          className="h-[13px] w-[18px] rounded-sm object-cover"
        />
      </button>

      {isOpen && (
        <div
          className="
            absolute
            right-0
            top-[40px]
            z-[9999]
            w-[160px]
            overflow-hidden
            rounded-[16px]
            border
            border-[#143DAA]/10
            bg-white/95
            shadow-xl
            backdrop-blur-2xl
          "
        >
          {LANGUAGE_OPTIONS.map(({ code, label, flag }) => (
            <button
              key={code}
              type="button"
              onClick={() => onChange(code)}
              className={`
                flex
                w-full
                items-center
                gap-3
                px-4
                py-3
                text-left
                transition-colors
                hover:bg-[#EF233C]/10

                ${
                  language === code
                    ? "bg-[#143DAA]/10 text-[#143DAA]"
                    : "text-[#1F2937]"
                }
              `}
            >
              <img
                src={flag}
                alt={label}
                className="
                  h-[16px]
                  w-[24px]
                  rounded-sm
                  object-cover
                "
              />

              <span
                className={`
                  text-[13px]
                  font-semibold
                  ${code === "km" ? "font-khmer" : ""}
                `}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* =========================================================
   DESKTOP NAV LINK
========================================================= */

const NavLink = ({
  to,
  label,
  active,
  isKhmer,
  scrolled,
}) => (
  <Link
    to={to}
    className={`
      relative
      flex
      h-[38px]
      items-center
      justify-center
      whitespace-nowrap
      rounded-full
      px-5
      text-[14px]
      xl:text-[15px]
      font-semibold
      transition-all
      duration-300
      ${isKhmer ? "font-khmer" : ""}

      ${
        !scrolled
          ? active
            ? `
                bg-white/20
                text-white
                backdrop-blur-md
                border border-white/35
                shadow-[0_2px_12px_rgba(255,255,255,0.15)]
              `
            : `
                text-white/90
                hover:text-white
                hover:bg-white/12
                border border-transparent
                hover:-translate-y-[1px]
              `
          : active
            ? `
                bg-[#2563EB]
                text-white
                shadow-[0_4px_16px_rgba(37,99,235,0.32)]
                border border-blue-400/30
              `
            : `
                text-slate-700
                dark:text-slate-200
                hover:text-[#2563EB]
                dark:hover:text-blue-400
                hover:bg-blue-500/10
                dark:hover:bg-blue-400/10
                border border-transparent
                hover:-translate-y-[1px]
              `
      }
    `}
  >
    {label}
  </Link>
);

/* =========================================================
   MOBILE NAV LINK
========================================================= */

const MobileNavLink = ({
  to,
  label,
  active,
  isKhmer,
  onClick,
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={`
      flex
      min-h-[42px]
      w-full
      items-center
      rounded-xl
      px-4
      text-[13.5px]
      font-semibold
      transition-all
      duration-200

      ${isKhmer ? "font-khmer" : ""}

      ${
        active
          ? "bg-[#2563EB] text-white shadow-sm font-bold"
          : `
            bg-slate-50 dark:bg-slate-800/60
            text-slate-800 dark:text-slate-200
            hover:bg-[#2563EB]/10
            hover:text-[#2563EB] dark:hover:text-blue-400
          `
      }
    `}
  >
    {label}
  </Link>
);

/* =========================================================
   NAVBAR
========================================================= */

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();

  // When the page changes, jump back to the top and reset the
  // navbar so the homepage (with a Hero) goes back to the transparent
  // white-text state instead of staying solid with dark text.
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsScrolled(false);
  }, [location.pathname]);

  // Homepage: navbar stays transparent (white text) until the page is scrolled,
  // so the text is readable over the Hero image.
  // Other pages (no hero image): navbar ALWAYS uses a solid background + dark
  // text, so it is never hidden behind the page content.
  const isHomePage = location.pathname === "/";
  const scrolled = isScrolled || !isHomePage;

  const {
    language,
    changeLanguage,
    t,
  } = useLanguage();

  const { isDark, toggleTheme } = useTheme();
  const { settings, logo: siteLogo } = useSettings();

  const isKhmer = language === "km";

  /* =======================================================
     TRANSLATION
  ======================================================= */

  const getLabel = (key, en, km) => {
    const value = t(key);

    if (value && value !== key) {
      return value;
    }

    return isKhmer ? km : en;
  };

  /* =======================================================
     SCROLL
  ======================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =======================================================
     ROUTE CHANGE
  ======================================================= */

  useEffect(() => {
    setIsOpen(false);
    setShowLanguage(false);
  }, [location.pathname]);

  /* =======================================================
     LOGO CLICK (AUTO SCROLL TO TOP ON HOMEPAGE)
  ======================================================= */

  const handleLogoClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  /* =======================================================
     BODY SCROLL
  ======================================================= */

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* =======================================================
     ACTIVE
  ======================================================= */

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  /* =======================================================
     LANGUAGE
  ======================================================= */

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setShowLanguage(false);
  };

  return (
    <header
      className={`
        site-navbar
        fixed
        left-0
        right-0
        top-0
        z-[1000]
        w-full
        overflow-visible
        transition-all
        duration-300

        ${
          isKhmer
            ? "navbar-font-khmer"
            : "navbar-font-english"
        }

        ${
          scrolled
            ? `
              opacity-100
              translate-y-0
              pointer-events-auto
              border-b
              border-white/40
              bg-white/80
              dark:bg-[#070D1F]/90
              dark:border-white/10
              shadow-[0_8px_32px_rgba(15,23,42,0.10)]
              dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]
              backdrop-blur-2xl
            `
            : `
              opacity-100
              translate-y-0
              pointer-events-auto
              border-b-0
              border-transparent
              bg-transparent
              shadow-none
              backdrop-blur-none
            `
        }
      `}
    >

      {/* ===================================================
          DESKTOP TOP BAR
          HEIGHT = 50PX
      ==================================================== */}

      <div
        className="
          relative
          z-[200]
          hidden
          h-[60px]
          items-center
          overflow-visible
          px-8
          lg:flex
          xl:px-12
          2xl:px-[70px]
        "
      >
        <div
          className={`
            relative
            z-[200]
            flex
            h-[50px]
            w-full
            items-center
            justify-between
            overflow-visible
            rounded-[18px]
            px-3
            transition-all
            duration-500
            ease-out

            ${
              scrolled
                ? `
                    border
                    border-white/60
                    bg-white/20
                    shadow-[0_10px_30px_rgba(15,23,42,0.06)]
                    backdrop-blur-2xl
                  `
                : `
                    border-0
                    border-transparent
                    bg-transparent
                    shadow-none
                    backdrop-blur-none
                  `
            }
          `}
        >
          {/* CONTACT */}

          <div className="flex h-full items-center gap-2 xl:gap-2.5">
            <TopBarContact
              Icon={FiPhone}
              href={`tel:${settings.phone || CONTACT.phone}`}
              scrolled={scrolled}
            >
              {settings.phone || CONTACT.phone}
            </TopBarContact>

            <TopBarContact
              Icon={FiMail}
              href={`mailto:${settings.email || CONTACT.email}`}
              scrolled={scrolled}
            >
              {settings.email || CONTACT.email}
            </TopBarContact>

            <TopBarLocation Icon={FiMapPin} href={settings.google_map_url || CONTACT.mapLink} scrolled={scrolled}>
              {(isKhmer ? settings.address_km : settings.address_en) || CONTACT.location}
            </TopBarLocation>
          </div>

          {/* SOCIAL + LANGUAGE */}

          <div
            className="
              relative
              z-[300]
              flex
              items-center
              gap-2
              overflow-visible
            "
          >
            <div className="flex items-center gap-1.5">
              {SOCIAL_LINKS.slice(0, 3).map((social) => (
                <SocialIcon
                  key={social.label}
                  {...social}
                  scrolled={scrolled}
                />
              ))}
            </div>

            <LanguageDropdown
              isOpen={showLanguage}
              language={language}
              scrolled={scrolled}
              onToggle={() =>
                setShowLanguage((prev) => !prev)
              }
              onChange={handleLanguageChange}
            />
          </div>
        </div>
      </div>

      {/* ===================================================
          DESKTOP NAVBAR
          HEIGHT = 78PX
      ==================================================== */}

      <div
        className="
          hidden
          h-[78px]
          w-full
          items-stretch
          lg:flex
        "
      >
        {/* DESKTOP LOGO */}

        <Link
          to="/"
          onClick={handleLogoClick}
          className="
            group
            relative
            flex
            h-[78px]
            w-[330px]
            min-w-[330px]
            items-center
            overflow-hidden
            pl-[90px]
          "
        >
          {/* GLASS COLOR SHAPE - FULL NAVBAR HEIGHT */}
          <svg
            className={`
              pointer-events-none
              absolute
              inset-0
              h-full
              w-full
              transition-opacity
              duration-500

              ${scrolled ? "opacity-100" : "opacity-0"}
            `}
            viewBox="0 0 400 78"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="
                M0 0
                H230
                C285 0 310 7 322 22
                C336 40 334 54 354 65
                C370 74 388 77 400 78
                H0
                V0
                Z
              "
              fill="rgba(20, 61, 170, 0.85)"
              stroke="rgba(255, 255, 255, 0.5)"
              strokeWidth="1"
              style={{ filter: "drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.15))" }}
            />
          </svg>

          {/* DESKTOP LOGO */}

          <div className={`relative z-10 rounded-full h-[64px] w-[64px] flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${scrolled ? "bg-white/95 shadow-[0_2px_12px_rgba(0,0,0,0.15)]" : "bg-transparent shadow-none"}`}>
            <img
              src={siteLogo || "/logo.png"}
              alt={isKhmer ? (settings.site_name_km || "SC Academy") : (settings.site_name_en || "SC Academy")}
              className="
                h-full
                w-full
                p-1.5
                object-contain
              "
            />
          </div>
        </Link>

        {/* NAVIGATION AREA */}

        <div
          className="
            flex
            min-w-0
            flex-1
            items-center
            px-3
            xl:px-4
            2xl:px-6
          "
        >
          <nav
            className="
              flex
              min-w-0
              flex-1
              items-center
              justify-center
            "
          >
            <div className="flex items-center justify-center gap-1 xl:gap-1.5">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  label={getLabel(
                    link.key,
                    link.en,
                    link.km
                  )}
                  active={isActive(link.to)}
                  isKhmer={isKhmer}
                  scrolled={scrolled}
                />
              ))}
            </div>
          </nav>

          {/* SEARCH */}

          <button
            type="button"
            aria-label="Search"
            className={`
              ml-2
              flex
              h-[42px]
              w-[42px]
              flex-shrink-0
              items-center
              justify-center
              rounded-full
              border
              transition-all
              duration-500
              hover:-translate-y-[1px]
              hover:bg-[#143DAA]
              hover:text-white

              ${scrolled ? "text-[#111827]" : "text-white"}

              ${
                scrolled
                  ? `
                      border-white/70
                      bg-white/30
                      shadow-[0_3px_12px_rgba(15,23,42,0.06)]
                      backdrop-blur-md
                    `
                  : `
                      border-transparent
                      bg-transparent
                      shadow-none
                      backdrop-blur-none
                    `
              }
            `}
          >
            <FiSearch size={18} />
          </button>

          {/* THEME TOGGLE (DARK / LIGHT MODE) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={isDark ? (isKhmer ? "ប្តូរទៅ Light Mode" : "Switch to Light Mode") : (isKhmer ? "ប្តូរទៅ Dark Mode" : "Switch to Dark Mode")}
            className={`
              ml-2
              flex
              h-[42px]
              w-[42px]
              flex-shrink-0
              items-center
              justify-center
              rounded-full
              border
              transition-all
              duration-500
              hover:-translate-y-[1px]

              ${
                isDark
                  ? `
                      border-amber-400/40
                      bg-amber-400/15
                      text-amber-300
                      shadow-[0_0_15px_rgba(251,191,36,0.25)]
                      hover:bg-amber-400
                      hover:text-slate-950
                    `
                  : scrolled
                    ? `
                        border-white/70
                        bg-white/30
                        text-[#111827]
                        shadow-[0_3px_12px_rgba(15,23,42,0.06)]
                        backdrop-blur-md
                        hover:bg-[#143DAA]
                        hover:text-white
                      `
                    : `
                        border-transparent
                        bg-transparent
                        text-white
                        shadow-none
                        hover:bg-white/20
                      `
              }
            `}
          >
            {isDark ? (
              <FiSun size={18} className="transition-transform duration-500 hover:rotate-90" />
            ) : (
              <FiMoon size={18} className="transition-transform duration-500 hover:-rotate-12" />
            )}
          </button>

          {/* ENROLL BUTTON (SHIMMERING BRAND GRADIENT) */}
          <Link
            to="/courses"
            className="
              ml-3
              inline-flex
              items-center
              justify-center
              gap-2
              px-6
              h-[42px]
              rounded-full
              bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#38BDF8]
              text-white
              text-[14px]
              font-bold
              shadow-[0_4px_16px_rgba(37,99,235,0.35)]
              hover:shadow-[0_6px_22px_rgba(37,99,235,0.5)]
              transition-all
              duration-300
              hover:scale-[1.02]
              active:scale-95
              btn-shimmer-sweep
              whitespace-nowrap
            "
          >
            <span className={isKhmer ? "font-khmer" : ""}>
              {getLabel(
                "nav.enroll",
                "Enroll Now",
                "ចុះឈ្មោះ"
              )}
            </span>
            <FiArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* ===================================================
          MOBILE / TABLET NAVBAR

          Mobile = 48px
          Tablet = 54px
      ==================================================== */}

      <div
        className="
          mobile-navbar

          flex
          h-[48px]
          w-full
          items-center
          justify-between

          pr-3

          sm:h-[54px]
          sm:pr-4

          lg:hidden
        "
      >
        {/* MOBILE LOGO AREA */}

        <Link
          to="/"
          onClick={handleLogoClick}
          className={`
            mobile-logo-area
            relative
            flex
            h-full
            w-[145px]
            items-center
            overflow-hidden
            rounded-br-[25px]
            transition-all
            duration-500
            ${scrolled ? "bg-[#143DAA]" : "bg-transparent"}
            pl-3
            sm:w-[170px]
            sm:pl-4
            shrink-0
          `}
        >
          {/* MOBILE LOGO */}

          <div className={`relative z-10 rounded-full h-[44px] w-[44px] sm:h-[50px] sm:w-[50px] flex items-center justify-center shrink-0 transition-all duration-300 ${scrolled ? "bg-white/95 shadow-[0_2px_8px_rgba(0,0,0,0.15)]" : "bg-transparent shadow-none"}`}>
            <img
              src={siteLogo || "/logo.png"}
              alt={isKhmer ? (settings.site_name_km || "SC Academy") : (settings.site_name_en || "SC Academy")}
              className="
                h-full
                w-full
                p-1
                object-contain
              "
            />
          </div>
        </Link>

        {/* MOBILE ACTIONS */}

        <div className="flex items-center gap-1.5">

          {/* SEARCH — TABLET */}

          <button
            type="button"
            aria-label="Search"
            className={`
              navbar-mobile-button

              hidden

              h-[30px]
              w-[30px]
              min-h-0
              min-w-0

              items-center
              justify-center

              rounded-full

              border

              ${scrolled ? "border-[#143DAA]/10 bg-white/70" : "border-transparent bg-transparent"}

              p-0

              shadow-sm

              transition-all
              duration-300

              hover:bg-[#143DAA]
              hover:text-white

              ${scrolled ? "text-[#111827]" : "text-white"}

              sm:flex
              sm:h-[32px]
              sm:w-[32px]
            `}
          >
            <FiSearch size={13} />
          </button>

          {/* THEME TOGGLE — MOBILE */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={isDark ? "Light Mode" : "Dark Mode"}
            className={`
              navbar-mobile-button
              flex
              h-[30px]
              w-[30px]
              min-h-0
              min-w-0
              items-center
              justify-center
              rounded-full
              border
              p-0
              shadow-sm
              transition-all
              duration-300
              sm:h-[32px]
              sm:w-[32px]

              ${
                isDark
                  ? `
                      border-amber-400/40
                      bg-amber-400/20
                      text-amber-300
                    `
                  : scrolled
                    ? `
                        border-[#143DAA]/15
                        bg-white/80
                        text-[#111827]
                        hover:bg-[#143DAA]
                        hover:text-white
                      `
                    : `
                        border-transparent
                        bg-transparent
                        text-white
                      `
              }
            `}
          >
            {isDark ? (
              <FiSun size={14} className="text-amber-300" />
            ) : (
              <FiMoon size={14} />
            )}
          </button>

          {/* MENU */}

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Menu"
            aria-expanded={isOpen}
            className={`  
              navbar-mobile-button

              flex

              h-[30px]
              w-[30px]

              min-h-0
              min-w-0

              items-center
              justify-center

              rounded-full

              ${scrolled ? "bg-[#0F2F7A] text-white" : "bg-transparent text-white"}

              p-0

              shadow-sm

              transition-all
              duration-300

              hover:bg-[#5b079f]

              sm:h-[32px]
              sm:w-[32px]
            `}
          >
            {isOpen ? (
              <FiX size={14} />
            ) : (
              <FiMenu size={14} />
            )}
          </button>
        </div>
      </div>

      {/* ===================================================
          MOBILE MENU
      ==================================================== */}

      <div
        className={`
          absolute
          left-0
          right-0
          top-full
          z-[500]

          overflow-y-auto

          border-t
          border-[#143DAA]/10

          bg-white/95

          shadow-xl

          backdrop-blur-2xl

          transition-all
          duration-300

          lg:hidden

          ${
            isOpen
              ? `
                visible
                max-h-[calc(100vh-48px)]
                opacity-100

                sm:max-h-[calc(100vh-54px)]
              `
              : `
                invisible
                max-h-0
                opacity-0
              `
          }
        `}
      >
        <div className="px-4 py-4">

          {/* NAVIGATION */}

          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <MobileNavLink
                key={link.to}
                to={link.to}
                label={getLabel(
                  link.key,
                  link.en,
                  link.km
                )}
                active={isActive(link.to)}
                isKhmer={isKhmer}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </nav>

          {/* ENROLL */}

          <Link
            to="/courses"
            onClick={() => setIsOpen(false)}
            className="
              mt-4
              flex
              h-[44px]
              items-center
              justify-between
              rounded-xl
              bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#38BDF8]
              px-5
              text-white
              font-bold
              shadow-md
              btn-shimmer-sweep
            "
          >
            <span
              className={`
                text-[14px]
                ${isKhmer ? "font-khmer" : ""}
              `}
            >
              {getLabel(
                "nav.enroll",
                "Enroll Now",
                "ចុះឈ្មោះឥឡូវនេះ"
              )}
            </span>

            <FiArrowUpRight size={17} />
          </Link>

          {/* LANGUAGE */}

          <div
            className="
              mt-4
              border-t
              border-[#E5E7EB]
              pt-4
            "
          >
            <p
              className={`
                mb-3
                text-[12px]
                font-bold
                text-[#111827]
                ${isKhmer ? "font-khmer" : ""}
              `}
            >
              {getLabel(
                "common.language",
                "Language",
                "ភាសា"
              )}
            </p>

            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map(
                ({ code, label, flag }) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() =>
                      handleLanguageChange(code)
                    }
                    className={`
                      flex
                      h-[36px]
                      min-h-0
                      items-center
                      gap-2
                      rounded-full
                      border
                      px-4
                      transition-all

                      ${
                        language === code
                          ? `
                            border-[#143DAA]
                            bg-[#143DAA]/10
                            text-[#143DAA]
                          `
                          : `
                            border-[#E4E8EF]
                            bg-[#F3F5FA]
                            text-[#374151]
                          `
                      }
                    `}
                  >
                    <img
                      src={flag}
                      alt={label}
                      className="
                        h-[14px]
                        w-[22px]
                        rounded-sm
                        object-cover
                      "
                    />

                    <span
                      className={`
                        text-[12px]
                        font-semibold
                        ${code === "km" ? "font-khmer" : ""}
                      `}
                    >
                      {label}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* CONTACT */}

          <div
            className="
              mt-4
              border-t
              border-[#E5E7EB]
              pt-4
            "
          >
            <div className="flex flex-col gap-2">

              <a
                href={`tel:${settings.phone || CONTACT.phone}`}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-[#F5F7FB]
                  px-4
                  py-2
                  text-[12px]
                  text-[#1F2937]
                "
              >
                <FiPhone size={14} />

                <span>{settings.phone || CONTACT.phone}</span>
              </a>

              <a
                href={`mailto:${settings.email || CONTACT.email}`}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-[#F5F7FB]
                  px-4
                  py-2
                  text-[12px]
                  text-[#1F2937]
                "
              >
                <FiMail size={14} />

                <span>{settings.email || CONTACT.email}</span>
              </a>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-[#F5F7FB]
                  px-4
                  py-2
                  text-[12px]
                  text-[#1F2937]
                "
              >
                <FiMapPin size={14} />

                <span>{CONTACT.location}</span>
              </div>
            </div>
          </div>

          {/* SOCIAL */}

          <div
            className="
              mt-4
              flex
              items-center
              gap-2
              border-t
              border-[#E5E7EB]
              pt-4
            "
          >
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="
                  flex
                  h-[30px]
                  w-[30px]
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F3F5FA]
                  text-[#143DAA]
                  transition-all
                  duration-300
                  hover:bg-[#143DAA]
                  hover:text-white
                "
              >
                <FontAwesomeIcon
                  icon={social.icon}
                  className="text-[10px]"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;