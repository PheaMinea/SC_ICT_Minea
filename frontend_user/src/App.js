import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Navbar from "./components/layout/Navbar";
import PageLoader from "./components/layout/PageLoader";
import Footer from "./components/layout/Footer";

import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Charity from "./components/pages/Charity";
import Gallery from "./components/pages/Gallery";
import Videos from "./components/pages/Videos";
import Contact from "./components/pages/Contact";
import Courses from "./components/pages/Courses";
import School from "./components/pages/School";
import CourseDetail from "./components/pages/CourseDetail";

import AiAssistant from "./components/common/AiAssistant";
import SmoothScroll from "./components/common/SmoothScroll";
import { useLanguage } from "./context/LanguageContext";
import { useSettings } from "./context/SettingsContext";

import "./styles/responsive.css";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { language } = useLanguage();
  const { settings, favicon } = useSettings();
  const isKhmer = language === "km";

  const siteName = isKhmer ? (settings.site_name_km || "SC Academy") : (settings.site_name_en || "SC Academy");
  const siteDescription = isKhmer
    ? (settings.site_description_km || "SC Academy - កសាងចំណេះដឹង ជំនាញ និងអ្នកដឹកនាំអនាគត")
    : (settings.site_description_en || "SC Academy - Building Knowledge, Skills & Future Leaders");

  return (
    <>
      <SmoothScroll />
      <Helmet>
        <title>{`${siteName} - ${isKhmer ? "កសាងចំណេះដឹង និងអ្នកដឹកនាំអនាគត" : "Building Knowledge, Skills & Future Leaders"}`}</title>
        <meta name="description" content={siteDescription} />
        {favicon && <link rel="shortcut icon" href={favicon} />}
      </Helmet>

      <div className="min-h-screen flex flex-col bg-[#F1F5F9] dark:bg-[#070D1F] text-slate-800 dark:text-slate-100 transition-colors duration-300">
        {/* =========================================
            FIXED NAVBAR
        ========================================== */}
        <Navbar />

        {/* =========================================
            CLEAN PAGE NAVIGATION LOADER
        ========================================== */}
        <PageLoader />

        {/* =========================================
            PAGE CONTENT

            HOME:
            - pt-0 so Hero video can sit BEHIND transparent Navbar.

            OTHER PAGES:
            - Mobile = 48px
            - Tablet = 54px
            - Desktop = 128px
        ========================================== */}
        <main
          className={`
            flex-grow

            ${
              isHomePage
                ? "pt-0"
                : "pt-[48px] sm:pt-[54px] lg:pt-[128px]"
            }
          `}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/school" element={<School />} />
            <Route path="/charity" element={<Charity />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* =========================================
            FOOTER
        ========================================== */}
        <Footer />

        {/* =========================================
            VIRTUAL ASSISTANT
        ========================================== */}
        <AiAssistant />
      </div>
    </>
  );
}

export default App;