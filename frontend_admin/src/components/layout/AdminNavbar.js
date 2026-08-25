import React, { useState } from 'react';

import {
  FiLogOut,
  FiBell,
  FiMenu,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiGlobe,
} from 'react-icons/fi';

import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';


// =====================================================
// ADMIN NAVBAR
// =====================================================

const AdminNavbar = ({ onMenuClick }) => {

  // ===================================================
  // AUTH
  // ===================================================

  const {
    user,
    logout,
  } = useAuth();


  // ===================================================
  // LANGUAGE
  // ===================================================

  const {
    language,
    changeLanguage,
    t,
  } = useLanguage();


  const {
    unreadCount,
  } = useNotification();


  const isKhmer =
    language === 'km';


  // ===================================================
  // STATES
  // ===================================================

  const [
    showProfile,
    setShowProfile,
  ] = useState(false);


  const [
    showLanguage,
    setShowLanguage,
  ] = useState(false);


  // ===================================================
  // USER INFO
  // ===================================================

  const username =
    user?.username ||
    user?.name ||
    'Admin';


  const userEmail =
    user?.email ||
    t('navbar.administrator');


  const firstLetter =
    username
      ?.charAt(0)
      ?.toUpperCase() ||
    'A';


  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {

    setShowProfile(false);

    setShowLanguage(false);

    logout();

  };


  // ===================================================
  // CHANGE LANGUAGE
  // ===================================================

  const handleLanguageChange = (
    selectedLanguage
  ) => {

    changeLanguage(
      selectedLanguage
    );

    setShowLanguage(false);

  };


  // ===================================================
  // TOGGLE LANGUAGE
  // ===================================================

  const handleToggleLanguage = () => {

    setShowLanguage(
      (prev) => !prev
    );

    setShowProfile(false);

  };


  // ===================================================
  // TOGGLE PROFILE
  // ===================================================

  const handleToggleProfile = () => {

    setShowProfile(
      (prev) => !prev
    );

    setShowLanguage(false);

  };


  // ===================================================
  // RETURN
  // ===================================================

  return (

    <header
      className={`
        fixed
        top-0
        left-0
        lg:left-[270px]
        right-0
        z-40

        h-[72px]

        bg-white/90
        backdrop-blur-xl

        border-b
        border-slate-200/80

        shadow-[0_1px_12px_rgba(15,23,42,0.04)]

        ${
          isKhmer
            ? 'font-khmer'
            : 'font-english'
        }
      `}
    >

      <div
        className="
          h-full

          px-4
          md:px-5
          lg:px-6

          flex
          items-center
          justify-between
        "
      >


        {/* =================================================
            LEFT SIDE
        ================================================== */}

        <div
          className="
            flex
            items-center
            gap-3

            min-w-0
          "
        >


          {/* ===============================================
              MOBILE MENU
          ================================================ */}

          <button
            type="button"

            onClick={
              onMenuClick
            }

            className="
              lg:hidden

              w-10
              h-10

              flex
              items-center
              justify-center

              flex-shrink-0

              rounded-lg

              bg-blue-50
              text-blue-900

              border
              border-blue-200

              hover:bg-blue-900
              hover:text-white
              hover:border-blue-900

              transition-all
              duration-200
            "

            aria-label={
              t(
                'navbar.openSidebar'
              )
            }

            title={
              t(
                'navbar.openSidebar'
              )
            }
          >

            <FiMenu
              size={20}
            />

          </button>


          {/* ===============================================
              PAGE INFO
          ================================================ */}

          <div
            className="
              min-w-0
            "
          >

            <h2
              className="
                text-[16px]
                md:text-lg

                font-bold
                text-blue-900

                leading-tight

                truncate
              "
            >

              <span
                className="
                  text-red-600
                "
              >

                SC

              </span>


              {' '}


              {t(
                'admin.administration'
              )}

            </h2>


            <p
              className="
                hidden
                sm:block

                text-[11px]
                text-blue-400

                mt-1

                truncate
              "
            >

              {t(
                'admin.system'
              )}

            </p>

          </div>

        </div>


        {/* =================================================
            RIGHT SIDE
        ================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
            md:gap-3

            flex-shrink-0
          "
        >


          {/* =================================================
              NOTIFICATION
          ================================================== */}

          <button
            type="button"

            className="
              relative

              w-10
              h-10

              rounded-lg

              flex
              items-center
              justify-center

              bg-blue-50
              text-blue-400

              border
              border-blue-200

              hover:bg-blue-900
              hover:text-white
              hover:border-blue-900

              transition-all
              duration-200
            "

            aria-label={
              t(
                'navbar.notifications'
              )
            }

            title={
              t(
                'navbar.notifications'
              )
            }
          >

            <FiBell
              size={18}
            />


            {/* =============================================
                NOTIFICATION BADGE
            ============================================== */}

            {
              unreadCount > 0 && (

                <span
                  className="
                    absolute
                    -top-1
                    -right-1

                    min-w-[17px]
                    h-[17px]

                    px-1

                    bg-red-600
                    text-white

                    border-2
                    border-white

                    rounded-full

                    flex
                    items-center
                    justify-center

                    text-[8px]
                    font-bold
                  "
                >

                  {
                    unreadCount > 99
                      ? '99+'
                      : unreadCount
                  }

                </span>

              )
            }

          </button>


          {/* =================================================
              LANGUAGE SWITCHER
          ================================================== */}

          <div
            className="
              relative
            "
          >

            <button
              type="button"

              onClick={
                handleToggleLanguage
              }

              className="
                w-10
                h-10

                rounded-lg

                flex
                items-center
                justify-center

                bg-blue-50
                text-blue-400

                border
                border-blue-200

                hover:bg-blue-900
                hover:text-white
                hover:border-blue-900

                transition-all
                duration-200
              "

              aria-label={
                t(
                  'common.language'
                )
              }

              title={
                t(
                  'common.language'
                )
              }
            >

              <FiGlobe
                size={18}
              />

            </button>


            {/* =============================================
                LANGUAGE DROPDOWN
            ============================================== */}

            {
              showLanguage && (

                <>


                  {/* =========================================
                      CLICK OUTSIDE
                  ========================================== */}

                  <div
                    className="
                      fixed
                      inset-0
                      z-40
                    "

                    onClick={() =>
                      setShowLanguage(
                        false
                      )
                    }
                  />


                  {/* =========================================
                      DROPDOWN
                  ========================================== */}

                  <div
                    className="
                      absolute
                      right-0
                      top-[52px]

                      z-50

                      w-[170px]

                      bg-white

                      border
                      border-blue-200

                      rounded-xl

                      shadow-xl

                      overflow-hidden
                    "
                  >

                    <div
                      className="
                        p-1.5
                        space-y-0.5
                      "
                    >


                      {/* =====================================
                          ENGLISH
                      ====================================== */}

                      <button
                        type="button"

                        onClick={() =>
                          handleLanguageChange(
                            'en'
                          )
                        }

                        className={`
                          w-full

                          flex
                          items-center
                          gap-2.5

                          px-3
                          py-2.5

                          rounded-lg

                          text-sm
                          font-medium

                          font-english

                          transition-all
                          duration-200

                          ${
                            language === 'en'
                              ? `
                                bg-blue-900
                                text-white
                              `
                              : `
                                text-blue-500

                                hover:bg-blue-50
                                hover:text-blue-900
                              `
                          }
                        `}
                      >

                        <span
                          className="
                            text-base
                            flex-shrink-0
                          "
                        >

                          🇬🇧

                        </span>


                        <span>

                          English

                        </span>

                      </button>


                      {/* =====================================
                          KHMER
                      ====================================== */}

                      <button
                        type="button"

                        onClick={() =>
                          handleLanguageChange(
                            'km'
                          )
                        }

                        className={`
                          w-full

                          flex
                          items-center
                          gap-2.5

                          px-3
                          py-2.5

                          rounded-lg

                          text-sm
                          font-medium

                          font-khmer

                          transition-all
                          duration-200

                          ${
                            language === 'km'
                              ? `
                                bg-blue-900
                                text-white
                              `
                              : `
                                text-blue-500

                                hover:bg-blue-50
                                hover:text-blue-900
                              `
                          }
                        `}
                      >

                        <span
                          className="
                            text-base
                            flex-shrink-0
                          "
                        >

                          🇰🇭

                        </span>


                        <span>

                          ភាសាខ្មែរ

                        </span>

                      </button>

                    </div>

                  </div>

                </>

              )
            }

          </div>


          {/* =================================================
              DIVIDER
          ================================================== */}

          <div
            className="
              hidden
              sm:block

              w-px
              h-8

              bg-blue-200
            "
          />


          {/* =================================================
              PROFILE
          ================================================== */}

          <div
            className="
              relative
            "
          >

            <button
              type="button"

              onClick={
                handleToggleProfile
              }

              className="
                flex
                items-center
                gap-2
                md:gap-3

                h-11

                pl-1.5
                pr-2
                md:pr-3

                rounded-xl

                hover:bg-blue-50

                transition-all
                duration-200
              "
            >


              {/* ===========================================
                  AVATAR
              ============================================ */}

              <div
                className="
                  w-9
                  h-9

                  bg-blue-900
                  text-white

                  rounded-lg

                  flex
                  items-center
                  justify-center

                  font-bold
                  text-sm

                  shadow-sm

                  flex-shrink-0
                "
              >

                {firstLetter}

              </div>


              {/* ===========================================
                  USER DETAILS
              ============================================ */}

              <div
                className="
                  hidden
                  md:block

                  text-left

                  min-w-[90px]
                "
              >

                <p
                  className="
                    text-[13px]

                    font-bold
                    text-blue-900

                    leading-tight

                    max-w-[130px]

                    truncate
                  "
                >

                  {username}

                </p>


                <p
                  className="
                    text-[10px]

                    text-blue-400

                    mt-1

                    max-w-[130px]

                    truncate
                  "
                >

                  {t(
                    'navbar.administrator'
                  )}

                </p>

              </div>


              {/* ===========================================
                  ARROW
              ============================================ */}

              <FiChevronDown
                size={14}

                className={`
                  hidden
                  md:block

                  text-blue-300

                  transition-transform
                  duration-200

                  ${
                    showProfile
                      ? 'rotate-180'
                      : ''
                  }
                `}
              />

            </button>


            {/* =================================================
                PROFILE DROPDOWN
            ================================================== */}

            {
              showProfile && (

                <>


                  {/* =========================================
                      CLICK OUTSIDE
                  ========================================== */}

                  <div
                    className="
                      fixed
                      inset-0
                      z-40
                    "

                    onClick={() =>
                      setShowProfile(
                        false
                      )
                    }
                  />


                  {/* =========================================
                      DROPDOWN
                  ========================================== */}

                  <div
                    className="
                      absolute
                      right-0
                      top-[52px]

                      z-50

                      w-[230px]

                      bg-white

                      border
                      border-blue-200

                      rounded-xl

                      shadow-xl

                      overflow-hidden
                    "
                  >


                    {/* =========================================
                        PROFILE HEADER
                    ========================================== */}

                    <div
                      className="
                        p-4

                        border-b
                        border-blue-200
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            w-10
                            h-10

                            bg-blue-900
                            text-white

                            rounded-lg

                            flex
                            items-center
                            justify-center

                            font-bold

                            flex-shrink-0
                          "
                        >

                          {firstLetter}

                        </div>


                        <div
                          className="
                            min-w-0
                          "
                        >

                          <p
                            className="
                              text-sm

                              font-bold
                              text-blue-900

                              truncate
                            "
                          >

                            {username}

                          </p>


                          <p
                            className="
                              text-[11px]

                              text-blue-400

                              mt-0.5

                              truncate
                            "
                          >

                            {userEmail}

                          </p>

                        </div>

                      </div>

                    </div>


                    {/* =========================================
                        PROFILE MENU
                    ========================================== */}

                    <div
                      className="
                        p-2
                      "
                    >


                      {/* =======================================
                          MY PROFILE
                      ======================================== */}

                      <button
                        type="button"

                        className="
                          w-full

                          flex
                          items-center
                          gap-3

                          px-3
                          py-2.5

                          rounded-lg

                          text-sm
                          text-blue-500

                          hover:bg-blue-50
                          hover:text-blue-900

                          transition-all
                          duration-200
                        "
                      >

                        <FiUser
                          size={16}
                        />


                        <span>

                          {t(
                            'navbar.myProfile'
                          )}

                        </span>

                      </button>


                      {/* =======================================
                          SETTINGS
                      ======================================== */}

                      <button
                        type="button"

                        className="
                          w-full

                          flex
                          items-center
                          gap-3

                          px-3
                          py-2.5

                          rounded-lg

                          text-sm
                          text-blue-500

                          hover:bg-blue-50
                          hover:text-blue-900

                          transition-all
                          duration-200
                        "
                      >

                        <FiSettings
                          size={16}
                        />


                        <span>

                          {t(
                            'admin.settings'
                          )}

                        </span>

                      </button>

                    </div>


                    {/* =========================================
                        LOGOUT
                    ========================================== */}

                    <div
                      className="
                        p-2

                        border-t
                        border-blue-200
                      "
                    >

                      <button
                        type="button"

                        onClick={
                          handleLogout
                        }

                        className="
                          w-full

                          flex
                          items-center
                          gap-3

                          px-3
                          py-2.5

                          bg-red-50
                          text-red-600

                          rounded-lg

                          text-sm
                          font-semibold

                          hover:bg-red-600
                          hover:text-white

                          transition-all
                          duration-200
                        "
                      >

                        <FiLogOut
                          size={16}
                        />


                        <span>

                          {t(
                            'common.logout'
                          )}

                        </span>

                      </button>

                    </div>

                  </div>

                </>

              )
            }

          </div>

        </div>

      </div>

    </header>

  );

};


export default AdminNavbar;
