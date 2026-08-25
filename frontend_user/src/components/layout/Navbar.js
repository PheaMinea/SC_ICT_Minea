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

import logo from "./logo.webp";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

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
    href: "https://facebook.com",
    label: "Facebook",
    icon: faFacebookF,
  },
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: faInstagram,
  },
  {
    href: "https://t.me/SC_Academy",
    label: "Telegram",
    icon: faTelegramPlane,
  },
  {
    href: "https://youtube.com",
    label: "YouTube",
    icon: faYoutube,
  },
  {
    href: "https://tiktok.com",
    label: "TikTok",
    icon: faTiktok,
  },
];

const CONTACT = {
  phone: "+855 86 306 615",
  email: "info@scacademy.edu.kh",
  location: "Phnom Penh, Cambodia",
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
    <Icon className="flex-shrink-0 text-[14px]" />

    <span className="whitespace-nowrap text-[13px] font-medium">
      {children}
    </span>
  </a>
);

/* =========================================================
   TOP BAR LOCATION
========================================================= */

const TopBarLocation = ({ Icon, children, scrolled }) => (
  <div
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
      xl:px-4

      ${scrolled ? "text-[#171717]" : "text-white"}

      ${
        scrolled
          ? `
              border-white/70
              bg-white/35
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
    <Icon className="flex-shrink-0 text-[14px]" />

    <span className="whitespace-nowrap text-[13px] font-medium">
      {children}
    </span>
  </div>
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
              shadow-sm
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
      min-w-[100px]
      items-center
      justify-center
      whitespace-nowrap
      rounded-full
      border
      px-6
      text-[15px]
      font-medium
      transition-all
      duration-300
      xl:px-7

      ${isKhmer ? "font-khmer" : ""}

      ${
        !scrolled
          ? `
              border-transparent
              bg-transparent
              shadow-none
              ring-0
              backdrop-blur-none
              ${active ? "font-semibold" : ""} text-white
            `
          : active
            ? `
                border-[#143DAA]/55
                bg-white/70
                font-semibold
                text-[#143DAA]
                shadow-[0_8px_22px_rgba(20,61,170,0.14),inset_0_1px_0_rgba(255,255,255,0.95)]
                ring-1
                ring-[#143DAA]/15
                backdrop-blur-xl
              `
            : `
                border-[#143DAA]/25
                bg-white/30
                text-[#171717]
                shadow-[0_6px_18px_rgba(20,61,170,0.08),inset_0_1px_0_rgba(255,255,255,0.80)]
                backdrop-blur-xl
                hover:-translate-y-[2px]
                hover:border-[#143DAA]/55
                hover:bg-white/60
                hover:text-[#143DAA]
                hover:shadow-[0_10px_26px_rgba(20,61,170,0.15)]
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
      min-h-[38px]
      w-full
      items-center
      rounded-[10px]
      px-4
      text-[13px]
      font-medium
      transition-all
      duration-300

      ${isKhmer ? "font-khmer" : ""}

      ${
        active
          ? "bg-[#143DAA] text-white"
          : `
            bg-[#F5F7FB]
            text-[#1F2937]
            hover:bg-[#143DAA]/10
            hover:text-[#143DAA]
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
          h-[50px]
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
            h-[40px]
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
              href={`tel:${CONTACT.phone}`}
              scrolled={scrolled}
            >
              {CONTACT.phone}
            </TopBarContact>

            <TopBarContact
              Icon={FiMail}
              href={`mailto:${CONTACT.email}`}
              scrolled={scrolled}
            >
              {CONTACT.email}
            </TopBarContact>

            <TopBarLocation Icon={FiMapPin} scrolled={scrolled}>
              {CONTACT.location}
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
            w-[300px]
            min-w-[300px]
            items-center
            overflow-hidden
            pl-[52px]
          "
        >
          {/* BLUE SHAPE */}

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
                H220
                C275 0 302 7 314 22
                C328 40 326 54 346 65
                C362 74 383 77 400 78
                H0
                V0
                Z
              "
              fill="#143DAA"
            />
          </svg>

          {/* DESKTOP LOGO WITH WHITE STROKE */}

          <img
            src={logo}
            alt="SC Academy"
            className="
              relative
              z-10

              max-h-[54px]
              w-[88px]

              object-contain

              transition-transform
              duration-300

              [filter:drop-shadow(1px_0_0_white)_drop-shadow(-1px_0_0_white)_drop-shadow(0_1px_0_white)_drop-shadow(0_-1px_0_white)]

              group-hover:scale-105
            "
          />
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

          {/* ENROLL */}

          <Link
            to="/courses"
            className={`
              group
              ml-2
              flex
              h-[48px]
              min-w-[142px]
              flex-shrink-0
              items-center
              justify-between
              gap-2
              rounded-full
              pl-5
              pr-[5px]
              transition-all
              duration-500
              hover:-translate-y-[1px]
              xl:min-w-[150px]

              ${
                scrolled
                  ? `
                      bg-[#EF233C]
                      text-white
                      shadow-[0_6px_18px_rgba(239,35,60,0.22)]
                      hover:bg-[#D91A2A]
                    `
                  : `
                      bg-transparent
                      text-white
                      shadow-none
                    `
              }
            `}
          >
            <span
              className={`
                whitespace-nowrap
                text-[13px]
                font-bold
                xl:text-[14px]
                ${isKhmer ? "font-khmer" : ""}
              `}
            >
              {getLabel(
                "nav.enroll",
                "Enroll Now",
                "ចុះឈ្មោះ"
              )}
            </span>

            <span
              className="
                flex
                h-[38px]
                w-[38px]
                flex-shrink-0
                items-center
                justify-center
                rounded-full
                bg-white/15
                transition-all
                duration-300
                group-hover:rotate-[8deg]
                group-hover:scale-110
              "
            >
              <FiArrowUpRight size={17} />
            </span>
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
            w-[118px]
            items-center

            overflow-hidden

            rounded-br-[25px]

            transition-all
            duration-500

            ${scrolled ? "bg-[#143DAA]" : "bg-transparent"}

            pl-3

            sm:w-[140px]
            sm:pl-4
          `}
        >
          {/* MOBILE LOGO WITH WHITE STROKE */}

          <img
            src={logo}
            alt="SC Academy"
            className="
              mobile-logo

              relative
              z-10

              w-[50px]
              max-h-[32px]

              object-contain

              sm:w-[58px]
              sm:max-h-[36px]

              [filter:drop-shadow(1px_0_0_white)_drop-shadow(-1px_0_0_white)_drop-shadow(0_1px_0_white)_drop-shadow(0_-1px_0_white)]
            "
          />
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
              h-[42px]
              items-center
              justify-between
              rounded-full
              bg-[#EF233C]
              pl-5
              pr-1
              text-white
              transition-colors
              hover:bg-[#D91A2A]
            "
          >
            <span
              className={`
                text-[13px]
                font-bold
                ${isKhmer ? "font-khmer" : ""}
              `}
            >
              {getLabel(
                "nav.enroll",
                "Enroll Now",
                "ចុះឈ្មោះឥឡូវនេះ"
              )}
            </span>

            <span
              className="
                flex
                h-[34px]
                w-[34px]
                items-center
                justify-center
                rounded-full
                bg-white/15
              "
            >
              <FiArrowUpRight size={15} />
            </span>
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
                href={`tel:${CONTACT.phone}`}
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

                <span>{CONTACT.phone}</span>
              </a>

              <a
                href={`mailto:${CONTACT.email}`}
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

                <span>{CONTACT.email}</span>
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