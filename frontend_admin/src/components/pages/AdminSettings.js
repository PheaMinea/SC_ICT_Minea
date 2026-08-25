import React, {
  useEffect,
  useState,
} from 'react';

import {
  toast,
} from 'react-toastify';

import {
  FiSettings,
  FiGlobe,
  FiPhone,
  FiMail,
  FiMapPin,
  FiFacebook,
  FiYoutube,
  FiImage,
  FiSave,
  FiMessageCircle,
  FiMap,
} from 'react-icons/fi';

import api from '../../services/api';
import AdminCard from '../common/AdminCard';

import {
  useLanguage,
} from '../../contexts/LanguageContext';


// =====================================================
// INITIAL SETTINGS
// =====================================================

const initialSettings = {
  site_name_en: 'SC Academy',
  site_name_km: 'SC Academy',
  site_description_en: '',
  site_description_km: '',
  logo_url: '',
  favicon_url: '',
  address_en: '',
  address_km: '',
  phone: '',
  email: '',
  facebook_url: '',
  telegram_url: '',
  youtube_url: '',
  google_map_url: '',
};


// =====================================================
// ADMIN SETTINGS
// =====================================================

const AdminSettings = () => {

  // ===================================================
  // LANGUAGE
  // ===================================================

  const {
    t,
    language,
  } = useLanguage();


  const isKhmer =
    language === 'km' ||
    language === 'kh';

  const siteNameField = isKhmer ? 'site_name_km' : 'site_name_en';
  const siteDescriptionField = isKhmer
    ? 'site_description_km'
    : 'site_description_en';
  const addressField = isKhmer ? 'address_km' : 'address_en';


  // ===================================================
  // TRANSLATION FALLBACK
  // ===================================================

  const tr = (
    key,
    english,
    khmer
  ) => {

    const value =
      t(key);


    if (
      value &&
      value !== key
    ) {

      return value;

    }


    return isKhmer
      ? khmer
      : english;

  };


  // ===================================================
  // STATE
  // ===================================================

  const [
    settings,
    setSettings,
  ] = useState({
    ...initialSettings,
  });


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    saving,
    setSaving,
  ] = useState(false);


  // ===================================================
  // FETCH SETTINGS
  // ===================================================

  const fetchSettings =
    async () => {

      try {

        setLoading(true);


        const response =
          await api.get(
            '/api/settings/'
          );


        const data =
          response.data;


        if (data) {

          setSettings({
            ...initialSettings,
            ...data,
          });

        } else {

          setSettings({
            ...initialSettings,
          });

        }

      } catch (error) {

        console.error(
          'Fetch settings error:',
          error
        );


        toast.error(
          error.response?.data?.detail ||
          tr(
            'settings.loadFailed',
            'Failed to load settings.',
            'មិនអាចផ្ទុកការកំណត់បានទេ។'
          ),
          { toastId: 'settings-load-error' }
        );

      } finally {

        setLoading(false);

      }

    };


  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {

    fetchSettings();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // ===================================================
  // HANDLE CHANGE
  // ===================================================

  const handleChange = (
    field,
    value
  ) => {

    setSettings(
      (previous) => ({

        ...previous,

        [field]: value,

      })
    );

  };


  // ===================================================
  // SAVE SETTINGS
  // ===================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();


      try {

        setSaving(true);


        const payload = {

          site_name_en: settings.site_name_en || '',
          site_name_km: settings.site_name_km || '',
          site_description_en: settings.site_description_en || '',
          site_description_km: settings.site_description_km || '',

          logo_url:
            settings.logo_url ||
            '',

          favicon_url:
            settings.favicon_url ||
            '',

          address_en: settings.address_en || '',
          address_km: settings.address_km || '',

          phone:
            settings.phone ||
            '',

          email:
            settings.email ||
            '',

          facebook_url:
            settings.facebook_url ||
            '',

          telegram_url:
            settings.telegram_url ||
            '',

          youtube_url:
            settings.youtube_url ||
            '',

          google_map_url:
            settings.google_map_url ||
            '',

        };


        const response =
          await api.put(
            '/api/settings/',
            payload
          );


        if (
          response.data
        ) {

          setSettings(
            (previous) => ({

              ...previous,

              ...response.data,

            })
          );

        }


        toast.success(
          tr(
            'settings.updatedSuccess',
            'Settings updated successfully.',
            'បានកែប្រែការកំណត់ដោយជោគជ័យ។'
          )
        );

      } catch (error) {

        console.error(
          'Update settings error:',
          error
        );


        const detail =
          error.response?.data
            ?.detail;


        if (
          Array.isArray(detail)
        ) {

          toast.error(
            detail
              .map(
                (item) =>
                  item?.msg ||
                  tr(
                    'settings.updateFailed',
                    'Failed to update settings.',
                    'មិនអាចកែប្រែការកំណត់បានទេ។'
                  )
              )
              .join(', ')
          );

        } else {

          toast.error(
            detail ||
            tr(
              'settings.updateFailed',
              'Failed to update settings.',
              'មិនអាចកែប្រែការកំណត់បានទេ។'
            )
          );

        }

      } finally {

        setSaving(false);

      }

    };


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (

      <div
        className={`
          min-h-[400px]

          flex
          flex-col
          items-center
          justify-center

          gap-4

          ${
            isKhmer
              ? 'font-khmer'
              : 'font-english'
          }
        `}
      >

        <div
          className="
            w-11
            h-11

            rounded-full

            border-4
            border-[#F0F7FF]
            border-t-[#0D1B3E]

            animate-spin
          "
        />


        <p
          className="
            text-sm
            font-medium
            text-[#6B8AFF]
          "
        >

          {tr(
            'settings.loading',
            'Loading settings...',
            'កំពុងផ្ទុកការកំណត់...'
          )}

        </p>

      </div>

    );

  }


  // ===================================================
  // RETURN
  // ===================================================

  return (

    <div
      className={`
        w-full
        min-h-screen
        p-6
        bg-[#F0F7FF]

        ${
          isKhmer
            ? 'font-khmer'
            : 'font-english'
        }
      `}
    >


      {/* =================================================
          PAGE HEADER
      ================================================== */}

      <div
        className="
          flex
          flex-col

          lg:flex-row
          lg:items-center
          lg:justify-between

          gap-4

          mb-8
        "
      >

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          <div
            className="
              w-12
              h-12

              flex
              items-center
              justify-center

              rounded-xl

              bg-[#0D1B3E]
              text-white

              shadow-md

              flex-shrink-0
            "
          >

            <FiSettings
              size={22}
            />

          </div>


          <div>

            <h1
              className="
                text-2xl
                md:text-3xl

                font-bold

                text-[#0D1B3E]

                leading-tight
              "
            >

              {tr(
                'settings.title',
                'Settings',
                'ការកំណត់'
              )}

            </h1>


            <p
              className="
                text-sm
                text-[#6B8AFF]

                mt-0.5
              "
            >

              {tr(
                'settings.subtitle',
                'Manage website settings and contact information',
                'គ្រប់គ្រងការកំណត់គេហទំព័រ និងព័ត៌មានទំនាក់ទំនង'
              )}

            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          FORM
      ================================================== */}

      <form
        onSubmit={
          handleSubmit
        }
      >

        <div
          className="
            space-y-6
          "
        >


          {/* =============================================
              SITE INFORMATION
          ============================================== */}

          <AdminCard
            className="
              overflow-hidden

              bg-white

              border
              border-[#F0F4FB]

              rounded-xl

              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                gap-3

                px-6
                py-4

                border-b
                border-[#E8EEF9]
              "
            >

              <div
                className="
                  w-10
                  h-10

                  flex
                  items-center
                  justify-center

                  rounded-xl

                  bg-[#F0F7FF]
                  text-[#0D1B3E]
                "
              >

                <FiGlobe
                  size={19}
                />

              </div>


              <div>

                <h2
                  className="
                    text-lg
                    font-bold
                    text-[#0D1B3E]
                  "
                >

                  {tr(
                    'settings.siteInformation',
                    'Site Information',
                    'ព័ត៌មានគេហទំព័រ'
                  )}

                </h2>


                <p
                  className="
                    text-xs
                    text-[#6B8AFF]
                    mt-0.5
                  "
                >

                  {tr(
                    'settings.siteInformationSubtitle',
                    'Manage your website name and description',
                    'គ្រប់គ្រងឈ្មោះ និងការពិពណ៌នាគេហទំព័រ'
                  )}

                </p>

              </div>

            </div>


            <div
              className="
                p-6
              "
            >

              <div
                className="
                  grid
                  grid-cols-1

                  md:grid-cols-2

                  gap-5
                "
              >


                {/* =======================================
                    SITE NAME
                ======================================== */}

                <div>

                  <label
                    className="
                      block

                      text-sm
                      font-semibold
                      text-[#0D1B3E]

                      mb-1.5
                    "
                  >

                    {tr(
                      'settings.siteName',
                      'Site Name',
                      'ឈ្មោះគេហទំព័រ'
                    )}

                  </label>


                  <input
                    type="text"

                    value={
                      settings[siteNameField] ||
                      ''
                    }

                    onChange={(e) =>
                      handleChange(
                        siteNameField,
                        e.target.value
                      )
                    }

                    className="
                      w-full
                      h-11

                      px-3.5

                      border
                      border-[#E8EEF9]

                      rounded-lg

                      bg-[#F0F7FF]

                      text-sm
                      text-[#0D1B3E]

                      placeholder:text-[#6B8AFF]

                      outline-none

                      focus:border-[#0D1B3E]
                      focus:bg-white
                      focus:ring-1
                      focus:ring-[#0D1B3E]

                      transition-all
                      duration-200
                    "

                    placeholder="SC Academy"
                  />

                </div>


                {/* =======================================
                    SITE DESCRIPTION
                ======================================== */}

                <div>

                  <label
                    className="
                      block

                      text-sm
                      font-semibold
                      text-[#0D1B3E]

                      mb-1.5
                    "
                  >

                    {tr(
                      'settings.siteDescription',
                      'Site Description',
                      'ការពិពណ៌នាគេហទំព័រ'
                    )}

                  </label>


                  <input
                    type="text"

                    value={
                      settings[siteDescriptionField] ||
                      ''
                    }

                    onChange={(e) =>
                      handleChange(
                        siteDescriptionField,
                        e.target.value
                      )
                    }

                    className="
                      w-full
                      h-11

                      px-3.5

                      border
                      border-[#E8EEF9]

                      rounded-lg

                      bg-[#F0F7FF]

                      text-sm
                      text-[#0D1B3E]

                      placeholder:text-[#6B8AFF]

                      outline-none

                      focus:border-[#0D1B3E]
                      focus:bg-white
                      focus:ring-1
                      focus:ring-[#0D1B3E]

                      transition-all
                      duration-200
                    "

                    placeholder={
                      tr(
                        'settings.siteDescriptionPlaceholder',
                        'Enter a short description about your website',
                        'បញ្ចូលការពិពណ៌នាខ្លីអំពីគេហទំព័ររបស់អ្នក'
                      )
                    }
                  />

                </div>

              </div>

            </div>

          </AdminCard>


          {/* =============================================
              CONTACT INFORMATION
          ============================================== */}

          <AdminCard
            className="
              overflow-hidden

              bg-white

              border
              border-[#F0F4FB]

              rounded-xl

              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                gap-3

                px-6
                py-4

                border-b
                border-[#E8EEF9]
              "
            >

              <div
                className="
                  w-10
                  h-10

                  flex
                  items-center
                  justify-center

                  rounded-xl

                  bg-[#F0F7FF]
                  text-[#0D1B3E]
                "
              >

                <FiPhone
                  size={19}
                />

              </div>


              <div>

                <h2
                  className="
                    text-lg
                    font-bold
                    text-[#0D1B3E]
                  "
                >

                  {tr(
                    'settings.contactInformation',
                    'Contact Information',
                    'ព័ត៌មានទំនាក់ទំនង'
                  )}

                </h2>


                <p
                  className="
                    text-xs
                    text-[#6B8AFF]
                    mt-0.5
                  "
                >

                  {tr(
                    'settings.contactInformationSubtitle',
                    'Manage phone, email and address information',
                    'គ្រប់គ្រងលេខទូរស័ព្ទ អ៊ីមែល និងអាសយដ្ឋាន'
                  )}

                </p>

              </div>

            </div>


            <div
              className="
                p-6
              "
            >

              <div
                className="
                  grid
                  grid-cols-1

                  md:grid-cols-2

                  gap-5
                "
              >


                {/* =======================================
                    PHONE
                ======================================== */}

                <div>

                  <label
                    className="
                      block

                      text-sm
                      font-semibold
                      text-[#0D1B3E]

                      mb-1.5
                    "
                  >

                    {tr(
                      'settings.phone',
                      'Phone',
                      'លេខទូរស័ព្ទ'
                    )}

                  </label>


                  <div
                    className="
                      relative
                    "
                  >

                    <FiPhone
                      className="
                        absolute

                        left-3.5
                        top-1/2
                        -translate-y-1/2

                        text-[#6B8AFF]
                      "

                      size={17}
                    />


                    <input
                      type="text"

                      value={
                        settings.phone ||
                        ''
                      }

                      onChange={(e) =>
                        handleChange(
                          'phone',
                          e.target.value
                        )
                      }

                      className="
                        w-full
                        h-11

                        pl-10
                        pr-3.5

                        border
                        border-[#E8EEF9]

                        rounded-lg

                        bg-[#F0F7FF]

                        text-sm
                        text-[#0D1B3E]

                        placeholder:text-[#6B8AFF]

                        outline-none

                        focus:border-[#0D1B3E]
                        focus:bg-white
                        focus:ring-1
                        focus:ring-[#0D1B3E]

                        transition-all
                        duration-200
                      "

                      placeholder="+855 ..."
                    />

                  </div>

                </div>


                {/* =======================================
                    EMAIL
                ======================================== */}

                <div>

                  <label
                    className="
                      block

                      text-sm
                      font-semibold
                      text-[#0D1B3E]

                      mb-1.5
                    "
                  >

                    {tr(
                      'settings.email',
                      'Email',
                      'អ៊ីមែល'
                    )}

                  </label>


                  <div
                    className="
                      relative
                    "
                  >

                    <FiMail
                      className="
                        absolute

                        left-3.5
                        top-1/2
                        -translate-y-1/2

                        text-[#6B8AFF]
                      "

                      size={17}
                    />


                    <input
                      type="email"

                      value={
                        settings.email ||
                        ''
                      }

                      onChange={(e) =>
                        handleChange(
                          'email',
                          e.target.value
                        )
                      }

                      className="
                        w-full
                        h-11

                        pl-10
                        pr-3.5

                        border
                        border-[#E8EEF9]

                        rounded-lg

                        bg-[#F0F7FF]

                        text-sm
                        text-[#0D1B3E]

                        placeholder:text-[#6B8AFF]

                        outline-none

                        focus:border-[#0D1B3E]
                        focus:bg-white
                        focus:ring-1
                        focus:ring-[#0D1B3E]

                        transition-all
                        duration-200
                      "

                      placeholder="info@scacademy.com"
                    />

                  </div>

                </div>


                {/* =======================================
                    ADDRESS
                ======================================== */}

                <div
                  className="
                    md:col-span-2
                  "
                >

                  <label
                    className="
                      block

                      text-sm
                      font-semibold
                      text-[#0D1B3E]

                      mb-1.5
                    "
                  >

                    {tr(
                      'settings.address',
                      'Address',
                      'អាសយដ្ឋាន'
                    )}

                  </label>


                  <div
                    className="
                      relative
                    "
                  >

                    <FiMapPin
                      className="
                        absolute

                        left-3.5
                        top-3.5

                        text-[#6B8AFF]
                      "

                      size={17}
                    />


                    <textarea
                      value={
                        settings[addressField] ||
                        ''
                      }

                      onChange={(e) =>
                        handleChange(
                          addressField,
                          e.target.value
                        )
                      }

                      className="
                        w-full

                        pl-10
                        pr-3.5
                        py-3

                        border
                        border-[#E8EEF9]

                        rounded-lg

                        bg-[#F0F7FF]

                        text-sm
                        text-[#0D1B3E]

                        placeholder:text-[#6B8AFF]

                        outline-none
                        resize-none

                        focus:border-[#0D1B3E]
                        focus:bg-white
                        focus:ring-1
                        focus:ring-[#0D1B3E]

                        transition-all
                        duration-200
                      "

                      rows={3}

                      placeholder={
                        tr(
                          'settings.addressPlaceholder',
                          'Enter your school or academy address',
                          'បញ្ចូលអាសយដ្ឋានសាលា ឬស្ថាប័នរបស់អ្នក'
                        )
                      }
                    />

                  </div>

                </div>

              </div>

            </div>

          </AdminCard>


          {/* =============================================
              SOCIAL MEDIA
          ============================================== */}

          <AdminCard
            className="
              overflow-hidden

              bg-white

              border
              border-[#F0F4FB]

              rounded-xl

              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                gap-3

                px-6
                py-4

                border-b
                border-[#E8EEF9]
              "
            >

              <div
                className="
                  w-10
                  h-10

                  flex
                  items-center
                  justify-center

                  rounded-xl

                  bg-[#F0F7FF]
                  text-[#0D1B3E]
                "
              >

                <FiMessageCircle
                  size={19}
                />

              </div>


              <div>

                <h2
                  className="
                    text-lg
                    font-bold
                    text-[#0D1B3E]
                  "
                >

                  {tr(
                    'settings.socialMedia',
                    'Social Media',
                    'បណ្ដាញសង្គម'
                  )}

                </h2>


                <p
                  className="
                    text-xs
                    text-[#6B8AFF]
                    mt-0.5
                  "
                >

                  {tr(
                    'settings.socialMediaSubtitle',
                    'Manage your social media links',
                    'គ្រប់គ្រងតំណភ្ជាប់បណ្ដាញសង្គមរបស់អ្នក'
                  )}

                </p>

              </div>

            </div>


            <div
              className="
                p-6
              "
            >

              <div
                className="
                  grid
                  grid-cols-1

                  md:grid-cols-2

                  gap-5
                "
              >


                {/* =======================================
                    FACEBOOK
                ======================================== */}

                <div>

                  <label
                    className="
                      block

                      text-sm
                      font-semibold
                      text-[#0D1B3E]

                      mb-1.5
                    "
                  >

                    {tr(
                      'settings.facebookUrl',
                      'Facebook URL',
                      'តំណ Facebook'
                    )}

                  </label>


                  <div
                    className="
                      relative
                    "
                  >

                    <FiFacebook
                      className="
                        absolute

                        left-3.5
                        top-1/2
                        -translate-y-1/2

                        text-[#6B8AFF]
                      "

                      size={17}
                    />


                    <input
                      type="url"

                      value={
                        settings.facebook_url ||
                        ''
                      }

                      onChange={(e) =>
                        handleChange(
                          'facebook_url',
                          e.target.value
                        )
                      }

                      className="
                        w-full
                        h-11

                        pl-10
                        pr-3.5

                        border
                        border-[#E8EEF9]

                        rounded-lg

                        bg-[#F0F7FF]

                        text-sm
                        text-[#0D1B3E]

                        placeholder:text-[#6B8AFF]

                        outline-none

                        focus:border-[#0D1B3E]
                        focus:bg-white
                        focus:ring-1
                        focus:ring-[#0D1B3E]

                        transition-all
                        duration-200
                      "

                      placeholder="https://facebook.com/..."
                    />

                  </div>

                </div>


                {/* =======================================
                    TELEGRAM
                ======================================== */}

                <div>

                  <label
                    className="
                      block

                      text-sm
                      font-semibold
                      text-[#0D1B3E]

                      mb-1.5
                    "
                  >

                    {tr(
                      'settings.telegramUrl',
                      'Telegram URL',
                      'តំណ Telegram'
                    )}

                  </label>


                  <div
                    className="
                      relative
                    "
                  >

                    <FiMessageCircle
                      className="
                        absolute

                        left-3.5
                        top-1/2
                        -translate-y-1/2

                        text-[#6B8AFF]
                      "

                      size={17}
                    />


                    <input
                      type="url"

                      value={
                        settings.telegram_url ||
                        ''
                      }

                      onChange={(e) =>
                        handleChange(
                          'telegram_url',
                          e.target.value
                        )
                      }

                      className="
                        w-full
                        h-11

                        pl-10
                        pr-3.5

                        border
                        border-[#E8EEF9]

                        rounded-lg

                        bg-[#F0F7FF]

                        text-sm
                        text-[#0D1B3E]

                        placeholder:text-[#6B8AFF]

                        outline-none

                        focus:border-[#0D1B3E]
                        focus:bg-white
                        focus:ring-1
                        focus:ring-[#0D1B3E]

                        transition-all
                        duration-200
                      "

                      placeholder="https://t.me/..."
                    />

                  </div>

                </div>


                {/* =======================================
                    YOUTUBE
                ======================================== */}

                <div>

                  <label
                    className="
                      block

                      text-sm
                      font-semibold
                      text-[#0D1B3E]

                      mb-1.5
                    "
                  >

                    {tr(
                      'settings.youtubeUrl',
                      'YouTube URL',
                      'តំណ YouTube'
                    )}

                  </label>


                  <div
                    className="
                      relative
                    "
                  >

                    <FiYoutube
                      className="
                        absolute

                        left-3.5
                        top-1/2
                        -translate-y-1/2

                        text-[#6B8AFF]
                      "

                      size={17}
                    />


                    <input
                      type="url"

                      value={
                        settings.youtube_url ||
                        ''
                      }

                      onChange={(e) =>
                        handleChange(
                          'youtube_url',
                          e.target.value
                        )
                      }

                      className="
                        w-full
                        h-11

                        pl-10
                        pr-3.5

                        border
                        border-[#E8EEF9]

                        rounded-lg

                        bg-[#F0F7FF]

                        text-sm
                        text-[#0D1B3E]

                        placeholder:text-[#6B8AFF]

                        outline-none

                        focus:border-[#0D1B3E]
                        focus:bg-white
                        focus:ring-1
                        focus:ring-[#0D1B3E]

                        transition-all
                        duration-200
                      "

                      placeholder="https://youtube.com/..."
                    />

                  </div>

                </div>


                {/* =======================================
                    GOOGLE MAP
                ======================================== */}

                <div>

                  <label
                    className="
                      block

                      text-sm
                      font-semibold
                      text-[#0D1B3E]

                      mb-1.5
                    "
                  >

                    {tr(
                      'settings.googleMapUrl',
                      'Google Maps URL',
                      'តំណ Google Maps'
                    )}

                  </label>


                  <div
                    className="
                      relative
                    "
                  >

                    <FiMap
                      className="
                        absolute

                        left-3.5
                        top-1/2
                        -translate-y-1/2

                        text-[#6B8AFF]
                      "

                      size={17}
                    />


                    <input
                      type="url"

                      value={
                        settings.google_map_url ||
                        ''
                      }

                      onChange={(e) =>
                        handleChange(
                          'google_map_url',
                          e.target.value
                        )
                      }

                      className="
                        w-full
                        h-11

                        pl-10
                        pr-3.5

                        border
                        border-[#E8EEF9]

                        rounded-lg

                        bg-[#F0F7FF]

                        text-sm
                        text-[#0D1B3E]

                        placeholder:text-[#6B8AFF]

                        outline-none

                        focus:border-[#0D1B3E]
                        focus:bg-white
                        focus:ring-1
                        focus:ring-[#0D1B3E]

                        transition-all
                        duration-200
                      "

                      placeholder="https://maps.google.com/..."
                    />

                  </div>

                </div>

              </div>

            </div>

          </AdminCard>


          {/* =============================================
              MEDIA URLS
          ============================================== */}

          <AdminCard
            className="
              overflow-hidden

              bg-white

              border
              border-[#F0F4FB]

              rounded-xl

              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                gap-3

                px-6
                py-4

                border-b
                border-[#E8EEF9]
              "
            >

              <div
                className="
                  w-10
                  h-10

                  flex
                  items-center
                  justify-center

                  rounded-xl

                  bg-[#F0F7FF]
                  text-[#0D1B3E]
                "
              >

                <FiImage
                  size={19}
                />

              </div>


              <div>

                <h2
                  className="
                    text-lg
                    font-bold
                    text-[#0D1B3E]
                  "
                >

                  {tr(
                    'settings.mediaUrls',
                    'Media URLs',
                    'តំណរូបភាព'
                  )}

                </h2>


                <p
                  className="
                    text-xs
                    text-[#6B8AFF]
                    mt-0.5
                  "
                >

                  {tr(
                    'settings.mediaUrlsSubtitle',
                    'Manage website logo and favicon',
                    'គ្រប់គ្រង Logo និង Favicon របស់គេហទំព័រ'
                  )}

                </p>

              </div>

            </div>


            <div
              className="
                p-6
              "
            >

              <div
                className="
                  grid
                  grid-cols-1

                  md:grid-cols-2

                  gap-5
                "
              >


                {/* =======================================
                    LOGO
                ======================================== */}

                <div>

                  <label
                    className="
                      block

                      text-sm
                      font-semibold
                      text-[#0D1B3E]

                      mb-1.5
                    "
                  >

                    {tr(
                      'settings.logoUrl',
                      'Logo URL',
                      'តំណ Logo'
                    )}

                  </label>


                  <input
                    type="url"

                    value={
                      settings.logo_url ||
                      ''
                    }

                    onChange={(e) =>
                      handleChange(
                        'logo_url',
                        e.target.value
                      )
                    }

                    className="
                      w-full
                      h-11

                      px-3.5

                      border
                      border-[#E8EEF9]

                      rounded-lg

                      bg-[#F0F7FF]

                      text-sm
                      text-[#0D1B3E]

                      placeholder:text-[#6B8AFF]

                      outline-none

                      focus:border-[#0D1B3E]
                      focus:bg-white
                      focus:ring-1
                      focus:ring-[#0D1B3E]

                      transition-all
                      duration-200
                    "

                    placeholder="https://example.com/logo.png"
                  />

                </div>


                {/* =======================================
                    FAVICON
                ======================================== */}

                <div>

                  <label
                    className="
                      block

                      text-sm
                      font-semibold
                      text-[#0D1B3E]

                      mb-1.5
                    "
                  >

                    {tr(
                      'settings.faviconUrl',
                      'Favicon URL',
                      'តំណ Favicon'
                    )}

                  </label>


                  <input
                    type="url"

                    value={
                      settings.favicon_url ||
                      ''
                    }

                    onChange={(e) =>
                      handleChange(
                        'favicon_url',
                        e.target.value
                      )
                    }

                    className="
                      w-full
                      h-11

                      px-3.5

                      border
                      border-[#E8EEF9]

                      rounded-lg

                      bg-[#F0F7FF]

                      text-sm
                      text-[#0D1B3E]

                      placeholder:text-[#6B8AFF]

                      outline-none

                      focus:border-[#0D1B3E]
                      focus:bg-white
                      focus:ring-1
                      focus:ring-[#0D1B3E]

                      transition-all
                      duration-200
                    "

                    placeholder="https://example.com/favicon.ico"
                  />

                </div>

              </div>

            </div>

          </AdminCard>


          {/* =============================================
              SAVE AREA
          ============================================== */}

          <div
            className="
              flex
              items-center
              justify-end

              pt-2
            "
          >

            <button
              type="submit"

              disabled={
                saving
              }

              className={`
                h-11

                inline-flex
                items-center
                justify-center
                gap-2

                px-6

                rounded-lg

                bg-[#C23636]
                hover:bg-[#A92E2E]

                text-white

                text-sm
                font-semibold

                shadow-sm

                transition-all
                duration-200

                ${
                  saving
                    ? `
                      opacity-60
                      cursor-not-allowed
                    `
                    : ''
                }
              `}
            >

              {
                saving ? (

                  <>

                    <span
                      className="
                        w-4
                        h-4

                        rounded-full

                        border-2
                        border-white/40
                        border-t-white

                        animate-spin
                      "
                    />


                    {tr(
                      'settings.saving',
                      'Saving...',
                      'កំពុងរក្សាទុក...'
                    )}

                  </>

                ) : (

                  <>

                    <FiSave
                      size={17}
                    />


                    {tr(
                      'settings.saveSettings',
                      'Save Settings',
                      'រក្សាទុកការកំណត់'
                    )}

                  </>

                )
              }

            </button>

          </div>

        </div>

      </form>

    </div>

  );

};


export default AdminSettings;
