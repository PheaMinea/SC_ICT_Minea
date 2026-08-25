import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiImage,
  FiUploadCloud,
  FiX,
  FiStar,
  FiGrid,
} from 'react-icons/fi';

import api, {
  getApiErrorMessage,
} from '../../services/api';

import AdminModal from '../common/AdminModal';
import AdminCard from '../common/AdminCard';

import { useLanguage } from '../../contexts/LanguageContext';
import { getImageUrl } from '../../utils/helpers';


const AdminGallery = () => {

  // =====================================================
  // LANGUAGE
  // =====================================================

  const {
    t,
    language,
  } = useLanguage();


  const isKhmer =
    language === 'km' ||
    language === 'kh';


  // =====================================================
  // STATE
  // =====================================================

  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingImage, setEditingImage] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  const [imageFile, setImageFile] = useState(null);

  const [imagePreview, setImagePreview] = useState('');


  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({

    // English
    title_en: '',
    category_en: '',
    description_en: '',

    // Khmer
    title_km: '',
    category_km: '',
    description_km: '',

    // Common
    is_featured: false,
    order: 0,

  });


  // =====================================================
  // CATEGORY OPTIONS
  // =====================================================

  const categoryOptions = [
    {
      en: 'School Activities',
      km: 'សកម្មភាពសាលា',
    },
    {
      en: 'Classroom',
      km: 'ថ្នាក់រៀន',
    },
    {
      en: 'Graduation',
      km: 'ពិធីបញ្ចប់ការសិក្សា',
    },
    {
      en: 'Trips',
      km: 'ដំណើរកម្សាន្ត',
    },
    {
      en: 'Special Events',
      km: 'ព្រឹត្តិការណ៍ពិសេស',
    },
    {
      en: 'Social Activities and Leadership',
      km: 'សកម្មភាពសង្គម និងភាពជាអ្នកដឹកនាំ',
    },
    {
      en: 'Education',
      km: 'ការអប់រំ',
    },
    {
      en: 'Workshops',
      km: 'សិក្ខាសាលា',
    },
    {
      en: 'Student Activities',
      km: 'សកម្មភាពសិស្ស',
    },
    {
      en: 'Learning Activities',
      km: 'សកម្មភាពសិក្សា',
    },
    {
      en: 'Technology and Education',
      km: 'បច្ចេកវិទ្យា និងការអប់រំ',
    },
    {
      en: 'Youth and Leadership',
      km: 'យុវជន និងភាពជាអ្នកដឹកនាំ',
    },
    {
      en: 'Social Activities',
      km: 'សកម្មភាពសង្គម',
    },
    {
      en: 'Knowledge Sharing',
      km: 'ចែករំលែកចំណេះដឹង',
    },
    {
      en: 'Teachers',
      km: 'គ្រូបង្រៀន',
    },
    {
      en: 'School Community',
      km: 'សហគមន៍សាលា',
    },
    {
      en: 'Study Tours',
      km: 'ទស្សនកិច្ចសិក្សា',
    },
    {
      en: 'Entrepreneurship',
      km: 'សហគ្រិនភាព',
    },
    {
      en: 'School News',
      km: 'ព័ត៌មានសាលា',
    },
  ];


  // =====================================================
  // CURRENT FIELD NAMES
  // =====================================================

  const titleField =
    isKhmer
      ? 'title_km'
      : 'title_en';


  const categoryField =
    isKhmer
      ? 'category_km'
      : 'category_en';


  const descriptionField =
    isKhmer
      ? 'description_km'
      : 'description_en';


  // =====================================================
  // GET LOCALIZED VALUE
  // =====================================================

  const getLocalizedValue = (
    item,
    field
  ) => {

    if (!item) {
      return '';
    }


    if (isKhmer) {

      return (
        item[`${field}_km`] ||
        item[`${field}_en`] ||
        ''
      );

    }


    return (
      item[`${field}_en`] ||
      item[`${field}_km`] ||
      ''
    );

  };


  // =====================================================
  // FETCH IMAGES
  // =====================================================

  const fetchImages = async () => {

    try {

      setLoading(true);


      const response = await api.get(
        '/api/gallery/'
      );


      setImages(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.error(
        'Gallery error:',
        error
      );


      toast.error(
        getApiErrorMessage(
          error,
          t('gallery.loadFailed')
        )
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    fetchImages();

  }, []);


  // =====================================================
  // CLEAN OBJECT URL
  // =====================================================

  useEffect(() => {

    return () => {

      if (
        imagePreview &&
        imagePreview.startsWith('blob:')
      ) {

        URL.revokeObjectURL(
          imagePreview
        );

      }

    };

  }, [imagePreview]);


  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {

    setEditingImage(null);


    setFormData({

      title_en: '',
      category_en: '',
      description_en: '',

      title_km: '',
      category_km: '',
      description_km: '',

      is_featured: false,
      order: 0,

    });


    if (
      imagePreview &&
      imagePreview.startsWith('blob:')
    ) {

      URL.revokeObjectURL(
        imagePreview
      );

    }


    setImageFile(null);

    setImagePreview('');

  };


  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const handleAdd = () => {

    resetForm();

    setModalOpen(true);

  };


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {

    setModalOpen(false);

    resetForm();

  };


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleInputChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;


    setFormData((previous) => ({

      ...previous,

      [name]:
        type === 'checkbox'
          ? checked
          : value,

    }));

  };


  // =====================================================
  // LOCALIZED INPUT CHANGE
  // =====================================================

  const handleLocalizedChange = (
    field,
    value
  ) => {

    const fieldName =
      isKhmer
        ? `${field}_km`
        : `${field}_en`;


    setFormData((previous) => ({

      ...previous,

      [fieldName]: value,

    }));

  };


  // =====================================================
  // CATEGORY CHANGE
  // Save English + Khmer together
  // =====================================================

  const handleCategoryChange = (e) => {

    const selectedValue =
      e.target.value;


    if (!selectedValue) {

      setFormData((previous) => ({

        ...previous,

        category_en: '',
        category_km: '',

      }));

      return;

    }


    const selectedCategory =
      categoryOptions.find(
        (category) =>
          category.en === selectedValue ||
          category.km === selectedValue
      );


    if (!selectedCategory) {
      return;
    }


    setFormData((previous) => ({

      ...previous,

      category_en:
        selectedCategory.en,

      category_km:
        selectedCategory.km,

    }));

  };


  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (e) => {

    const file =
      e.target.files?.[0];


    if (!file) {
      return;
    }


    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      toast.error(
        t('gallery.invalidImage')
      );

      e.target.value = '';

      return;

    }


    if (
      file.size >
      5 * 1024 * 1024
    ) {

      toast.error(
        t('gallery.imageTooLarge')
      );

      e.target.value = '';

      return;

    }


    if (
      imagePreview &&
      imagePreview.startsWith('blob:')
    ) {

      URL.revokeObjectURL(
        imagePreview
      );

    }


    setImageFile(file);


    setImagePreview(
      URL.createObjectURL(file)
    );

  };


  // =====================================================
  // REMOVE SELECTED NEW IMAGE
  // =====================================================

  const removeSelectedImage = () => {

    if (
      imagePreview &&
      imagePreview.startsWith('blob:')
    ) {

      URL.revokeObjectURL(
        imagePreview
      );

    }


    setImageFile(null);


    if (
      editingImage?.image_url
    ) {

      setImagePreview(
        getImageUrl(editingImage.image_url)
      );

    } else {

      setImagePreview('');

    }

  };


  // =====================================================
  // VALIDATE FORM
  // =====================================================

  const validateForm = () => {

    const currentTitle =
      formData[titleField];


    if (
      !currentTitle ||
      !currentTitle.trim()
    ) {

      toast.error(
        isKhmer
          ? 'សូមបញ្ចូលចំណងជើងរូបភាព។'
          : 'Please enter an image title.'
      );

      return false;

    }


    if (
      !editingImage &&
      !imageFile
    ) {

      toast.error(
        t('gallery.imageRequired')
      );

      return false;

    }


    return true;

  };


  // =====================================================
  // BUILD FORM DATA
  // =====================================================

  const buildPayload = () => {

    const payload =
      new FormData();


    // ===================================================
    // ENGLISH
    // ===================================================

    payload.append(
      'title_en',
      formData.title_en || ''
    );


    payload.append(
      'category_en',
      formData.category_en || ''
    );


    payload.append(
      'description_en',
      formData.description_en || ''
    );


    // ===================================================
    // KHMER
    // ===================================================

    payload.append(
      'title_km',
      formData.title_km || ''
    );


    payload.append(
      'category_km',
      formData.category_km || ''
    );


    payload.append(
      'description_km',
      formData.description_km || ''
    );


    // ===================================================
    // COMMON
    // ===================================================

    payload.append(
      'is_featured',
      String(
        formData.is_featured
      )
    );


    payload.append(
      'order',
      String(
        Number(
          formData.order
        ) || 0
      )
    );


    // ===================================================
    // IMAGE
    // ===================================================

    if (imageFile) {

      payload.append(
        'image_file',
        imageFile
      );

    }


    return payload;

  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!validateForm()) {
      return;
    }


    try {

      setSubmitting(true);


      const payload =
        buildPayload();


      // =================================================
      // UPDATE
      // =================================================

      if (editingImage) {

        await api.put(
          `/api/gallery/${editingImage.id}`,
          payload
        );


        toast.success(
          t(
            'gallery.updatedSuccess'
          )
        );

      }


      // =================================================
      // CREATE
      // =================================================

      else {

        await api.post(
          '/api/gallery/',
          payload
        );


        toast.success(
          t(
            'gallery.createdSuccess'
          )
        );

      }


      handleCloseModal();


      await fetchImages();

    } catch (error) {

      console.error(
        'Gallery operation error:',
        error
      );


      toast.error(
        getApiErrorMessage(
          error,
          t(
            'common.operationFailed'
          )
        )
      );

    } finally {

      setSubmitting(false);

    }

  };


  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (image) => {

    if (
      imagePreview &&
      imagePreview.startsWith('blob:')
    ) {

      URL.revokeObjectURL(
        imagePreview
      );

    }


    setEditingImage(image);


    setFormData({

      title_en:
        image.title_en || '',

      category_en:
        image.category_en || '',

      description_en:
        image.description_en || '',


      title_km:
        image.title_km || '',

      category_km:
        image.category_km || '',

      description_km:
        image.description_km || '',


      is_featured:
        Boolean(
          image.is_featured
        ),

      order:
        Number(
          image.sort_order
        ) || 0,

    });


    setImageFile(null);


    setImagePreview(
      image.image_url
        ? getImageUrl(image.image_url)
        : ''
    );


    setModalOpen(true);

  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        t(
          'gallery.deleteConfirm'
        )
      );


    if (!confirmed) {
      return;
    }


    try {

      await api.delete(
        `/api/gallery/${id}`
      );


      toast.success(
        t(
          'gallery.deletedSuccess'
        )
      );


      await fetchImages();

    } catch (error) {

      console.error(
        'Delete image error:',
        error
      );


      toast.error(
        getApiErrorMessage(
          error,
          t(
            'gallery.deleteFailed'
          )
        )
      );

    }

  };


  // =====================================================
  // COUNTS
  // =====================================================

  const featuredCount =
    images.filter(
      (image) =>
        image.is_featured
    ).length;


  const categoryCount =
    new Set(
      images
        .map((image) =>
          isKhmer
            ? (
                image.category_km ||
                image.category_en
              )
            : (
                image.category_en ||
                image.category_km
              )
        )
        .filter(Boolean)
    ).size;


  // =====================================================
  // CURRENT FORM TEXT
  // =====================================================

  const formLabels = {

    title:
      isKhmer
        ? 'ចំណងជើងរូបភាព'
        : 'Image Title',

    titlePlaceholder:
      isKhmer
        ? 'បញ្ចូលចំណងជើងរូបភាព'
        : 'Enter image title',

    category:
      isKhmer
        ? 'ប្រភេទ'
        : 'Category',

    selectCategory:
      isKhmer
        ? 'ជ្រើសរើសប្រភេទ'
        : 'Select category',

    description:
      isKhmer
        ? 'ការពិពណ៌នា'
        : 'Description',

    descriptionPlaceholder:
      isKhmer
        ? 'បញ្ចូលការពិពណ៌នារូបភាព'
        : 'Enter image description',

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="w-full min-h-screen p-6 bg-[#F0F7FF]">


      {/* =================================================
          HEADER
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
              bg-[#0D1B3E]
              text-white
              rounded-xl
              flex
              items-center
              justify-center
              shadow-md
            "
          >

            <FiImage size={22} />

          </div>


          <div>

            <h1
              className="
                text-2xl
                md:text-3xl
                font-bold
                text-[#0D1B3E]
              "
            >
              {t(
                'gallery.title'
              )}
            </h1>


            <p
              className="
                text-sm
                text-[#6B8AFF]
                mt-0.5
              "
            >
              {t(
                'gallery.subtitle'
              )}
            </p>

          </div>

        </div>


        <button
          type="button"

          onClick={handleAdd}

          className="
            h-11
            px-5
            inline-flex
            items-center
            justify-center
            gap-2
            bg-[#C23636]
            text-white
            rounded-lg
            text-sm
            font-semibold
            shadow-sm
            hover:bg-[#A92E2E]
            transition-all
          "
        >

          <FiPlus size={18} />


          {t(
            'gallery.addImage'
          )}

        </button>

      </div>


      {/* =================================================
          SUMMARY
      ================================================== */}

      <div
        className="
          grid
          grid-cols-2
          xl:grid-cols-3
          gap-5
          mb-8
        "
      >


        {/* TOTAL */}

        <div
          className="
            bg-white
            border
            border-[#F0F4FB]
            rounded-xl
            p-5
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-[#6B8AFF]
                "
              >
                {t(
                  'gallery.totalImages'
                )}
              </p>


              <p
                className="
                  text-2xl
                  font-bold
                  text-[#0D1B3E]
                  mt-1
                "
              >
                {images.length}
              </p>

            </div>


            <div
              className="
                w-10
                h-10
                bg-[#F0F7FF]
                text-[#0D1B3E]
                rounded-lg
                flex
                items-center
                justify-center
              "
            >

              <FiImage size={18} />

            </div>

          </div>

        </div>


        {/* FEATURED */}

        <div
          className="
            bg-white
            border
            border-[#F0F4FB]
            rounded-xl
            p-5
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-[#6B8AFF]
                "
              >
                {t(
                  'gallery.featuredImages'
                )}
              </p>


              <p
                className="
                  text-2xl
                  font-bold
                  text-[#C23636]
                  mt-1
                "
              >
                {featuredCount}
              </p>

            </div>


            <div
              className="
                w-10
                h-10
                bg-[#FFEBEE]
                text-[#C23636]
                rounded-lg
                flex
                items-center
                justify-center
              "
            >

              <FiStar size={18} />

            </div>

          </div>

        </div>


        {/* CATEGORIES */}

        <div
          className="
            bg-white
            border
            border-[#F0F4FB]
            rounded-xl
            p-5
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-[#6B8AFF]
                "
              >
                {t(
                  'gallery.categories'
                )}
              </p>


              <p
                className="
                  text-2xl
                  font-bold
                  text-[#0D1B3E]
                  mt-1
                "
              >
                {categoryCount}
              </p>

            </div>


            <div
              className="
                w-10
                h-10
                bg-[#F0F7FF]
                text-[#0D1B3E]
                rounded-lg
                flex
                items-center
                justify-center
              "
            >

              <FiGrid size={18} />

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          GALLERY CARD
      ================================================== */}

      <AdminCard
        className="
          bg-white
          border
          border-[#F0F4FB]
          rounded-xl
          shadow-sm
          overflow-hidden
        "
      >

        <div
          className="
            px-6
            py-4
            border-b
            border-[#E8EEF9]
          "
        >

          <h2
            className="
              text-lg
              font-bold
              text-[#0D1B3E]
            "
          >
            {t(
              'gallery.allImages'
            )}
          </h2>


          <p
            className="
              text-xs
              text-[#6B8AFF]
              mt-0.5
            "
          >

            {images.length}{' '}

            {
              images.length === 1
                ? t(
                    'gallery.image'
                  )
                : t(
                    'gallery.images'
                  )
            }{' '}

            {t(
              'gallery.found'
            )}

          </p>

        </div>


        {/* =================================================
            LOADING
        ================================================== */}

        {
          loading ? (

            <div
              className="
                min-h-[300px]
                flex
                items-center
                justify-center
              "
            >

              <div className="text-center">

                <div
                  className="
                    w-10
                    h-10
                    border-4
                    border-[#F0F7FF]
                    border-t-[#0D1B3E]
                    rounded-full
                    animate-spin
                    mx-auto
                  "
                />


                <p
                  className="
                    text-sm
                    text-[#6B8AFF]
                    mt-3
                  "
                >
                  {t(
                    'gallery.loading'
                  )}
                </p>

              </div>

            </div>

          ) : images.length === 0 ? (

            <div
              className="
                min-h-[320px]
                flex
                items-center
                justify-center
                p-6
              "
            >

              <div className="text-center">

                <div
                  className="
                    w-16
                    h-16
                    bg-[#F0F7FF]
                    text-[#0D1B3E]
                    rounded-full
                    flex
                    items-center
                    justify-center
                    mx-auto
                    mb-4
                  "
                >

                  <FiImage size={28} />

                </div>


                <h3
                  className="
                    text-lg
                    font-bold
                    text-[#0D1B3E]
                  "
                >
                  {t(
                    'gallery.noImages'
                  )}
                </h3>


                <p
                  className="
                    text-sm
                    text-[#6B8AFF]
                    mt-1
                    mb-5
                  "
                >
                  {t(
                    'gallery.addFirstImage'
                  )}
                </p>


                <button
                  type="button"

                  onClick={handleAdd}

                  className="
                    inline-flex
                    items-center
                    gap-2
                    bg-[#C23636]
                    text-white
                    px-5
                    py-2.5
                    rounded-lg
                    text-sm
                    font-semibold
                    hover:bg-[#A92E2E]
                    transition
                  "
                >

                  <FiPlus size={18} />


                  {t(
                    'gallery.addImage'
                  )}

                </button>

              </div>

            </div>

          ) : (

            <div
              className="
                p-5
                md:p-6
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-5
              "
            >

              {
                images.map(
                  (image) => {

                    const title =
                      getLocalizedValue(
                        image,
                        'title'
                      );


                    const description =
                      getLocalizedValue(
                        image,
                        'description'
                      );


                    const category =
                      getLocalizedValue(
                        image,
                        'category'
                      );


                    return (

                      <div
                        key={image.id}

                        className="
                          group
                          bg-white
                          border
                          border-[#F0F4FB]
                          rounded-xl
                          overflow-hidden
                          shadow-sm
                          hover:shadow-md
                          hover:-translate-y-1
                          transition-all
                          duration-300
                        "
                      >


                        {/* IMAGE */}

                        <div
                          className="
                            relative
                            w-full
                            aspect-[4/3]
                            bg-[#F0F7FF]
                            overflow-hidden
                          "
                        >

                          {
                            image.image_url ? (

                              <img
                                src={
                                  getImageUrl(image.image_url)
                                }

                                alt={
                                  title ||
                                  t(
                                    'gallery.image'
                                  )
                                }

                                className="
                                  w-full
                                  h-full
                                  object-cover
                                  group-hover:scale-105
                                  transition-transform
                                  duration-500
                                "

                                onError={(e) => {

                                  e.currentTarget.style.display =
                                    'none';

                                }}
                              />

                            ) : null
                          }


                          <div
                            className="
                              absolute
                              inset-0
                              -z-10
                              flex
                              items-center
                              justify-center
                              bg-[#F0F7FF]
                              text-[#E8EEF9]
                            "
                          >

                            <FiImage size={40} />

                          </div>


                          {
                            image.is_featured && (

                              <div
                                className="
                                  absolute
                                  top-3
                                  left-3
                                  inline-flex
                                  items-center
                                  gap-1.5
                                  px-2.5
                                  py-1.5
                                  bg-[#C23636]
                                  text-white
                                  rounded-lg
                                  text-[10px]
                                  font-bold
                                  shadow-sm
                                "
                              >

                                <FiStar
                                  size={12}
                                  className="fill-current"
                                />


                                {t(
                                  'gallery.featured'
                                )}

                              </div>

                            )
                          }


                          {
                            category && (

                              <div
                                className="
                                  absolute
                                  bottom-3
                                  left-3
                                  max-w-[75%]
                                  px-2.5
                                  py-1.5
                                  bg-[#0D1B3E]/90
                                  backdrop-blur-sm
                                  text-white
                                  rounded-lg
                                  text-[10px]
                                  font-semibold
                                  truncate
                                "
                              >

                                {category}

                              </div>

                            )
                          }

                        </div>


                        {/* CONTENT */}

                        <div className="p-4">

                          <h3
                            className="
                              text-sm
                              font-bold
                              text-[#0D1B3E]
                              truncate
                            "
                          >

                            {
                              title ||
                              t(
                                'gallery.untitledImage'
                              )
                            }

                          </h3>


                          {
                            description ? (

                              <p
                                className="
                                  text-xs
                                  text-[#6B8AFF]
                                  mt-1.5
                                  line-clamp-2
                                  leading-5
                                  min-h-[40px]
                                "
                              >

                                {description}

                              </p>

                            ) : (

                              <p
                                className="
                                  text-xs
                                  text-[#6B8AFF]
                                  mt-1.5
                                  min-h-[40px]
                                "
                              >
                                {t(
                                  'gallery.noDescription'
                                )}
                              </p>

                            )
                          }


                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              pt-3
                              mt-3
                              border-t
                              border-[#E8EEF9]
                            "
                          >

                            <span
                              className="
                                text-[10px]
                                text-[#6B8AFF]
                              "
                            >

                              {t(
                                'gallery.order'
                              )}:{' '}

                              {
                                image.sort_order ??
                                0
                              }

                            </span>


                            <div
                              className="
                                flex
                                items-center
                                gap-2
                              "
                            >

                              <button
                                type="button"

                                onClick={() =>
                                  handleEdit(
                                    image
                                  )
                                }

                                className="
                                  w-8
                                  h-8
                                  flex
                                  items-center
                                  justify-center
                                  bg-[#F0F7FF]
                                  text-[#0D1B3E]
                                  rounded-lg
                                  hover:bg-[#0D1B3E]
                                  hover:text-white
                                  transition
                                "

                                title={
                                  t(
                                    'common.edit'
                                  )
                                }
                              >

                                <FiEdit2
                                  size={14}
                                />

                              </button>


                              <button
                                type="button"

                                onClick={() =>
                                  handleDelete(
                                    image.id
                                  )
                                }

                                className="
                                  w-8
                                  h-8
                                  flex
                                  items-center
                                  justify-center
                                  bg-[#FFEBEE]
                                  text-[#C62828]
                                  rounded-lg
                                  hover:bg-[#C62828]
                                  hover:text-white
                                  transition
                                "

                                title={
                                  t(
                                    'common.delete'
                                  )
                                }
                              >

                                <FiTrash2
                                  size={14}
                                />

                              </button>

                            </div>

                          </div>

                        </div>

                      </div>

                    );

                  }
                )
              }

            </div>

          )
        }

      </AdminCard>


      {/* =================================================
          ADD / EDIT MODAL
      ================================================== */}

      <AdminModal
        isOpen={modalOpen}

        onClose={
          handleCloseModal
        }

        title={
          editingImage
            ? t(
                'gallery.editImage'
              )
            : t(
                'gallery.addImage'
              )
        }
      >

        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="space-y-5">


            {/* =================================================
                SINGLE LANGUAGE FORM
            ================================================== */}

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
                {formLabels.title}

                <span className="text-[#C23636]">
                  {' '}*
                </span>
              </label>


              <input
                type="text"

                name={
                  titleField
                }

                value={
                  formData[
                    titleField
                  ]
                }

                onChange={(e) =>
                  handleLocalizedChange(
                    'title',
                    e.target.value
                  )
                }

                placeholder={
                  formLabels.titlePlaceholder
                }

                className="
                  w-full
                  h-11
                  px-3.5
                  border
                  border-[#E8EEF9]
                  rounded-lg
                  text-sm
                  text-[#0D1B3E]
                  outline-none
                  focus:border-[#0D1B3E]
                  focus:ring-1
                  focus:ring-[#0D1B3E]
                  transition
                "
              />

            </div>


            {/* =================================================
                CATEGORY
            ================================================== */}

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
                {formLabels.category}
              </label>


              <select
                name={
                  categoryField
                }

                value={
                  formData[
                    categoryField
                  ]
                }

                onChange={
                  handleCategoryChange
                }

                className="
                  w-full
                  h-11
                  px-3.5
                  border
                  border-[#E8EEF9]
                  rounded-lg
                  bg-white
                  text-sm
                  text-[#0D1B3E]
                  outline-none
                  focus:border-[#0D1B3E]
                  focus:ring-1
                  focus:ring-[#0D1B3E]
                "
              >

                <option value="">
                  {
                    formLabels.selectCategory
                  }
                </option>


                {
                  categoryOptions.map(
                    (category) => {

                      const value =
                        isKhmer
                          ? category.km
                          : category.en;


                      return (

                        <option
                          key={
                            category.en
                          }

                          value={
                            value
                          }
                        >
                          {value}
                        </option>

                      );

                    }
                  )
                }

              </select>

            </div>


            {/* =================================================
                DESCRIPTION
            ================================================== */}

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
                {formLabels.description}
              </label>


              <textarea
                name={
                  descriptionField
                }

                value={
                  formData[
                    descriptionField
                  ]
                }

                onChange={(e) =>
                  handleLocalizedChange(
                    'description',
                    e.target.value
                  )
                }

                rows="3"

                placeholder={
                  formLabels.descriptionPlaceholder
                }

                className="
                  w-full
                  px-3.5
                  py-3
                  border
                  border-[#E8EEF9]
                  rounded-lg
                  text-sm
                  text-[#0D1B3E]
                  resize-none
                  outline-none
                  focus:border-[#0D1B3E]
                  focus:ring-1
                  focus:ring-[#0D1B3E]
                  transition
                "
              />

            </div>


            {/* =================================================
                DISPLAY ORDER
            ================================================== */}

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
                {t(
                  'gallery.displayOrder'
                )}
              </label>


              <input
                type="number"

                name="order"

                min="0"

                value={
                  formData.order
                }

                onChange={(e) =>
                  setFormData(
                    (previous) => ({
                      ...previous,

                      order:
                        Number(
                          e.target.value
                        ) || 0,
                    })
                  )
                }

                className="
                  w-full
                  h-11
                  px-3.5
                  border
                  border-[#E8EEF9]
                  rounded-lg
                  text-sm
                  text-[#0D1B3E]
                  outline-none
                  focus:border-[#0D1B3E]
                  focus:ring-1
                  focus:ring-[#0D1B3E]
                "
              />

            </div>


            {/* =================================================
                IMAGE UPLOAD
            ================================================== */}

            <div>

              <label
                className="
                  block
                  text-sm                  font-semibold
                  text-[#0D1B3E]
                  mb-1.5
                "
              >

                {
                  editingImage
                    ? t(
                        'gallery.changeImage'
                      )
                    : t(
                        'gallery.uploadImage'
                      )
                }


                {
                  !editingImage && (

                    <span
                      className="
                        text-[#C23636]
                      "
                    >
                      {' '}*
                    </span>

                  )
                }

              </label>


              {
                !imagePreview ? (

                  <label
                    className="
                      min-h-[150px]
                      border-2
                      border-dashed
                      border-[#E8EEF9]
                      rounded-xl
                      bg-[#F0F7FF]
                      flex
                      flex-col
                      items-center
                      justify-center
                      cursor-pointer
                      hover:border-[#0D1B3E]
                      transition-all
                    "
                  >

                    <div
                      className="
                        w-11
                        h-11
                        bg-white
                        text-[#0D1B3E]
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        mb-2
                        shadow-sm
                      "
                    >

                      <FiUploadCloud
                        size={22}
                      />

                    </div>


                    <p
                      className="
                        text-sm
                        font-semibold
                        text-[#0D1B3E]
                      "
                    >
                      {t(
                        'gallery.clickUpload'
                      )}
                    </p>


                    <p
                      className="
                        text-xs
                        text-[#6B8AFF]
                        mt-1
                      "
                    >
                      {t(
                        'gallery.imageFormats'
                      )}
                    </p>


                    <input
                      type="file"

                      accept="
                        image/jpeg,
                        image/jpg,
                        image/png,
                        image/webp
                      "

                      onChange={
                        handleImageChange
                      }

                      className="hidden"
                    />

                  </label>

                ) : (

                  <div
                    className="
                      relative
                      w-full
                      h-[220px]
                      bg-[#F0F7FF]
                      rounded-xl
                      overflow-hidden
                      border
                      border-[#E8EEF9]
                    "
                  >

                    <img
                      src={
                        imagePreview
                      }

                      alt={
                        t(
                          'gallery.preview'
                        )
                      }

                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />


                    <button
                      type="button"

                      onClick={
                        removeSelectedImage
                      }

                      className="
                        absolute
                        top-3
                        right-3
                        w-8
                        h-8
                        bg-[#0D1B3E]/80
                        text-white
                        rounded-full
                        flex
                        items-center
                        justify-center
                        hover:bg-[#C23636]
                        transition
                      "

                      title={
                        t(
                          'common.remove'
                        )
                      }
                    >

                      <FiX size={16} />

                    </button>


                    <label
                      className="
                        absolute
                        left-3
                        bottom-3
                        inline-flex
                        items-center
                        gap-2
                        bg-white
                        text-[#0D1B3E]
                        px-3
                        py-2
                        rounded-lg
                        shadow-md
                        text-xs
                        font-semibold
                        cursor-pointer
                        hover:bg-[#0D1B3E]
                        hover:text-white
                        transition
                      "
                    >

                      <FiUploadCloud size={15} />


                      {t(
                        'gallery.changeImage'
                      )}


                      <input
                        type="file"

                        accept="
                          image/jpeg,
                          image/jpg,
                          image/png,
                          image/webp
                        "

                        onChange={
                          handleImageChange
                        }

                        className="hidden"
                      />

                    </label>

                  </div>

                )
              }


              {
                editingImage &&
                !imageFile && (

                  <p
                    className="
                      text-xs
                      text-[#6B8AFF]
                      mt-1.5
                    "
                  >
                    {t(
                      'gallery.keepCurrentImage'
                    )}
                  </p>

                )
              }

            </div>


            {/* =================================================
                FEATURED
            ================================================== */}

            <label
              className={`
                flex
                items-center
                gap-3
                p-3.5
                border
                rounded-xl
                cursor-pointer
                transition-all

                ${
                  formData.is_featured
                    ? `
                      border-red-200
                      bg-[#FFEBEE]
                    `
                    : `
                      border-[#E8EEF9]
                      bg-white
                    `
                }
              `}
            >

              <input
                type="checkbox"

                name="is_featured"

                checked={
                  formData.is_featured
                }

                onChange={
                  handleInputChange
                }

                className="
                  w-4
                  h-4
                  accent-[#C23636]
                "
              />


              <div
                className="
                  w-9
                  h-9
                  bg-[#FFEBEE]
                  text-[#C23636]
                  rounded-lg
                  flex
                  items-center
                  justify-center
                "
              >

                <FiStar size={16} />

              </div>


              <div>

                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#0D1B3E]
                  "
                >
                  {t(
                    'gallery.featured'
                  )}
                </p>


                <p
                  className="
                    text-xs
                    text-[#6B8AFF]
                    mt-0.5
                  "
                >
                  {t(
                    'gallery.featuredDescription'
                  )}
                </p>

              </div>

            </label>

          </div>


          {/* =================================================
              FOOTER
          ================================================== */}

          <div
            className="
              mt-6
              pt-4
              border-t
              border-[#E8EEF9]
              flex
              flex-col-reverse
              sm:flex-row
              items-stretch
              sm:items-center
              justify-end
              gap-3
            "
          >

            <button
              type="button"

              onClick={
                handleCloseModal
              }

              disabled={
                submitting
              }

              className="
                h-11
                px-4
                bg-white
                border
                border-[#E8EEF9]
                text-[#6B8AFF]
                rounded-lg
                text-sm
                font-semibold
                hover:bg-[#F0F7FF]
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
              "
            >
              {t(
                'common.cancel'
              )}
            </button>


            <button
              type="submit"

              disabled={
                submitting
              }

              className="
                min-w-[140px]
                h-11
                px-5
                bg-[#C23636]
                text-white
                rounded-lg
                text-sm
                font-semibold
                hover:bg-[#A92E2E]
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
              "
            >

              {
                submitting
                  ? editingImage
                    ? t(
                        'gallery.updating'
                      )
                    : t(
                        'gallery.uploading'
                      )
                  : editingImage
                  ? t(
                      'gallery.updateImage'
                    )
                  : t(
                      'gallery.addImage'
                    )
              }

            </button>

          </div>

        </form>

      </AdminModal>

    </div>

  );

};


export default AdminGallery;
