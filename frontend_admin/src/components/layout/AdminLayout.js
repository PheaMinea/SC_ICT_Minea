import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import AdminFooter from './AdminFooter';
import AdminLoading from '../common/AdminLoading';

import { useLanguage } from '../../contexts/LanguageContext';


// ==========================================
// ADMIN LAYOUT
// ==========================================

const AdminLayout = () => {

  const location = useLocation();

  // ========================================
  // LANGUAGE
  // ========================================

  const {
    language,
  } = useLanguage();


  // ========================================
  // SIDEBAR STATE
  // ========================================

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const [pageChanging, setPageChanging] = useState(false);

  useEffect(() => {
    setPageChanging(true);
    const timer = window.setTimeout(() => setPageChanging(false), 280);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);


  // ========================================
  // OPEN SIDEBAR
  // ========================================

  const handleOpenSidebar = () => {

    setSidebarOpen(true);

  };


  // ========================================
  // CLOSE SIDEBAR
  // ========================================

  const handleCloseSidebar = () => {

    setSidebarOpen(false);

  };


  return (

    <div
      className={`
        min-h-screen

        bg-[#f4f7fb]

        ${
          language === 'km'
            ? 'font-khmer'
            : 'font-english'
        }
      `}
    >


      {/* ====================================
          NAVBAR
      ===================================== */}

      <AdminNavbar
        onMenuClick={
          handleOpenSidebar
        }
      />


      {/* ====================================
          SIDEBAR
      ===================================== */}

      <AdminSidebar
        isOpen={
          sidebarOpen
        }
        onClose={
          handleCloseSidebar
        }
      />


      {/* ====================================
          MAIN CONTENT
      ===================================== */}

      <main
        className="
          min-h-screen

          pt-[72px]

          lg:ml-[270px]

          flex
          flex-col

          relative

          transition-all
          duration-300
        "
      >

        {pageChanging && (
          <AdminLoading label="Preparing your workspace..." />
        )}


        {/* ==================================
            PAGE CONTENT
        =================================== */}

        <div
          className="
            flex-1

            p-4
            sm:p-6
            lg:p-8
          "
        >

          <div
            className="
              w-full

              max-w-[1600px]

              mx-auto
            "
          >


            {/* ==============================
                CURRENT PAGE
            =============================== */}

            <Outlet />


          </div>

        </div>


        {/* ==================================
            FOOTER
        =================================== */}

        <AdminFooter />


      </main>

    </div>

  );

};


export default AdminLayout;
