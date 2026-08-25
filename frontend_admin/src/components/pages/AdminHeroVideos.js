import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiAward,
  FiCheck,
  FiEdit2,
  FiImage,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiStar,
  FiTrash2,
  FiX,
  FiPlay,
  FiFilm,
} from "react-icons/fi";

import api from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";
import { getImageUrl } from "../../utils/helpers";

const EMPTY_FORM = {
  title: "",
  description: "",
  video: null,
  thumbnail: null,
  is_active: false,
};

const AdminHeroVideos = () => {
  const { t, language } = useLanguage();
  const isKhmer = language === "km" || language === "kh";

  const tr = (key, english, khmer) => {
    const translated = typeof t === "function" ? t(key) : "";

    if (
      translated &&
      translated !== key &&
      !String(translated).includes("undefined")
    ) {
      return translated;
    }

    return isKhmer ? khmer : english;
  };

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [activatingId, setActivatingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [previewThumbnail, setPreviewThumbnail] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState({ type: "", text: "" });

  // ==========================================
  // HELPERS
  // ==========================================

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return "-";

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getMimeTypeLabel = (mimeType) => {
    if (!mimeType) return "-";

    const map = {
      "video/mp4": "MP4",
      "video/webm": "WebM",
      "video/quicktime": "MOV",
    };

    return map[mimeType] || mimeType;
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });

    window.clearTimeout(showMessage.timer);

    showMessage.timer = window.setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 4000);
  };

  const getApiErrorMessage = (error) => {
    const detail = error?.response?.data?.detail;

    if (Array.isArray(detail)) {
      return detail
        .map((item) => item?.msg || item)
        .filter(Boolean)
        .join(", ");
    }

    if (typeof detail === "string") {
      return detail;
    }

    return (
      error?.response?.data?.message ||
      error?.message ||
      tr(
        "common.operationFailed",
        "Something went wrong. Please try again.",
        "មានបញ្ហាកើតឡើង។ សូមព្យាយាមម្ដងទៀត។"
      )
    );
  };

  // ==========================================
  // FETCH VIDEOS
  // ==========================================

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/hero-videos");

      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.items)
        ? response.data.items
        : [];

      setVideos(data);
    } catch (error) {
      console.error("Fetch hero videos error:", error);
      showMessage("error", getApiErrorMessage(error));
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // ==========================================
  // FILTERED VIDEOS
  // ==========================================

  const filteredVideos = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return videos.filter((item) => {
      const searchableText = [
        item.title,
        item.description,
        getMimeTypeLabel(item.mime_type),
      ]
        .filter((value) => value !== null && value !== undefined)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        keyword === "" || searchableText.includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.is_active) ||
        (statusFilter === "inactive" && !item.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [videos, search, statusFilter]);

  // ==========================================
  // STATS
  // ==========================================

  const stats = useMemo(() => {
    return {
      total: videos.length,
      active: videos.filter((item) => item.is_active).length,
      inactive: videos.filter((item) => !item.is_active).length,
    };
  }, [videos]);

  // ==========================================
  // FORM HANDLERS
  // ==========================================

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    setPreviewVideo(null);
    setPreviewThumbnail(null);
  };

  const openCreateForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setPreviewVideo(null);
    setPreviewThumbnail(null);
  };

  const openEditForm = (item) => {
    setEditingId(item.id);

    setFormData({
      title: item.title || "",
      description: item.description || "",
      video: null,
      thumbnail: null,
      is_active: Boolean(item.is_active),
    });

    setPreviewVideo(getImageUrl(item.video_path));
    setPreviewThumbnail(getImageUrl(item.thumbnail_path));
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;

    if (!files || !files[0]) {
      return;
    }

    const file = files[0];

    // Validate file type
    const allowedVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (name === "video") {
      if (!allowedVideoTypes.includes(file.type)) {
        showMessage(
          "error",
          tr(
            "heroVideos.invalidVideoType",
            "Invalid video type. Only MP4, WebM and MOV are allowed.",
            "ប្រភេញវីដេអូមិនត្រឹមត្រីស។"
          )
        );
        return;
      }

      const url = URL.createObjectURL(file);
      setPreviewVideo(url);
    }

    if (name === "thumbnail") {
      if (!allowedImageTypes.includes(file.type)) {
        showMessage(
          "error",
          tr(
            "heroVideos.invalidImageType",
            "Invalid image type. Only JPG, JPEG, PNG and WEBP are allowed.",
            "ប្រភេញរូបភាពមិនត្រឹមត្រីស។"
          )
        );
        return;
      }

      const url = URL.createObjectURL(file);
      setPreviewThumbnail(url);
    }

    setFormData((previous) => ({
      ...previous,
      [name]: file,
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      showMessage(
        "error",
        tr(
          "heroVideos.titleRequired",
          "Video title is required",
          "ចំណងជើងវីដេអូគាក់លើស"
        )
      );
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append("title", formData.title.trim());
      data.append("description", formData.description || "");
      data.append("is_active", String(formData.is_active));

      if (formData.video) {
        data.append("video_file", formData.video);
      }

      if (formData.thumbnail) {
        data.append("thumbnail_file", formData.thumbnail);
      }

      if (editingId) {
        await api.put(`/api/hero-videos/${editingId}`, data);
        showMessage(
          "success",
          tr(
            "heroVideos.updatedSuccess",
            "Hero video updated successfully",
            "បានធ្វើបច្ចុប្បន្នភាពវីដេអូសំខាព់ដោយជោគជ័យ"
          )
        );
      } else {
        await api.post("/api/hero-videos", data);
        showMessage(
          "success",
          tr(
            "heroVideos.createdSuccess",
            "Hero video created successfully",
            "បានបង្កើតវីដេអូសំខាព់ដោយជោគជ័យ"
          )
        );
      }

      resetForm();
      await fetchVideos();
    } catch (error) {
      console.error("Save hero video error:", error);
      showMessage("error", getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (item) => {
    const displayName = item.title || tr("heroVideos.video", "this video", "វីដេអូនេះ");

    const confirmed = window.confirm(
      tr(
        "heroVideos.deleteConfirmFull",
        `Delete "${displayName}"? This will permanently remove the video file.`,
        `តើអ្នកប្រាកដថាចង់លុប "${displayName}"? ឯកសារវីដេអូនឹងត្រូវបានដកចេញជាគាំង។`
      )
    );

    if (!confirmed) return;

    try {
      setDeletingId(item.id);

      await api.delete(`/api/hero-videos/${item.id}`);

      showMessage(
        "success",
        tr(
          "heroVideos.deletedSuccess",
          "Hero video deleted successfully",
          "បានលុបវីដេអូសំខាព់ដោយជោគជ័យ"
        )
      );
      await fetchVideos();
    } catch (error) {
      console.error("Delete hero video error:", error);
      showMessage("error", getApiErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // ACTIVATE
  // ==========================================

  const handleActivate = async (item) => {
    try {
      setActivatingId(item.id);

      await api.patch(`/api/hero-videos/${item.id}/activate`);

      showMessage(
        "success",
        tr(
          "heroVideos.activatedSuccess",
          "Hero video activated successfully",
          "បានដាក់បើកវីដេអូសំខាព់ដោយជោគជ័យ"
        )
      );
      await fetchVideos();
    } catch (error) {
      console.error("Activate hero video error:", error);
      showMessage("error", getApiErrorMessage(error));
    } finally {
      setActivatingId(null);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main
      className={`min-h-screen bg-slate-50 px-4 py-6 md:px-6 lg:px-8 ${
        isKhmer ? "font-khmer" : "font-english"
      }`}
    >
      <div className="mx-auto w-full max-w-[1450px]">
        {/* =====================================================
            HEADER
        ====================================================== */}
        <section className="mb-6 overflow-hidden rounded-2xl bg-[#0B1849] text-white shadow-sm">
          <div className="relative px-5 py-6 md:px-8 md:py-8">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-red-600/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-20 h-56 w-56 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-red-400">
                  <span className="h-[2px] w-7 rounded-full bg-red-500" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                    {tr("admin.panel", "SC Academy Admin", "ផ្ទាំងអ្នកគ្រប់គ្រង SC Academy")}
                  </span>
                </div>

                <h1 className="text-[28px] font-bold md:text-[36px]">
                  {tr("heroVideos.management", "Hero Video Management", "គ្រប់គ្រងវីដេអូសំខាព់")}
                </h1>

                <p className="mt-2 max-w-2xl text-[13px] leading-6 text-white/65">
                  {tr(
                    "heroVideos.subtitle",
                    "Upload and manage hero videos displayed on the SC Academy homepage.",
                    "បញ្ចូល និងគ្រប់គ្រងវីដេអូសំខាព់ដែលបង្ហាញលើគេហទំព័រ SC Academy។"
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateForm}
                className="inline-flex h-[44px] items-center justify-center gap-2 rounded-lg bg-red-600 px-6 text-[12px] font-bold text-white shadow-sm transition hover:bg-red-700"
              >
                <FiPlus size={16} />
                {tr("heroVideos.addHeroVideo", "Add Hero Video", "បន្ថែមវីដេអូសំខាព់")}
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            MESSAGE
        ====================================================== */}
        {message.text && (
          <div
            className={`mb-5 flex items-center justify-between rounded-xl border px-4 py-3 text-[12px] font-semibold ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <FiCheck size={16} />
              ) : (
                <FiX size={16} />
              )}
              {message.text}
            </div>

            <button
              type="button"
              onClick={() => setMessage({ type: "", text: "" })}
              className="rounded-md p-1 transition hover:bg-black/5"
              aria-label={tr("common.close", "Close", "បិទ")}
            >
              <FiX />
            </button>
          </div>
        )}

        {/* =====================================================
            STATS
        ====================================================== */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            {
              title: tr("heroVideos.totalVideos", "Total Videos", "វីដេអូសរុប"),
              value: stats.total,
              icon: FiFilm,
            },
            {
              title: tr("heroVideos.activeVideos", "Active Videos", "វីដេអូសកម្ម"),
              value: stats.active,
              icon: FiCheck,
            },
            {
              title: tr("heroVideos.inactiveVideos", "Inactive Videos", "វីដេអូអសកម្ម"),
              value: stats.inactive,
              icon: FiX,
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-[28px] font-bold text-blue-950">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                    <Icon size={20} />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* =====================================================
            FORM
        ====================================================== */}
        {showForm && (
          <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-600">
                  {editingId
                    ? tr("heroVideos.editVideo", "Edit Hero Video", "កែប្រែវីដេអូសំខាព់")
                    : tr("heroVideos.createVideo", "Create Hero Video", "បង្កើតវីដេអូសំខាព់")}
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-md p-1 transition hover:bg-black/5"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 md:p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* LEFT: Fields */}
                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                      {tr("heroVideos.title", "Title", "ចំណងជើង")}
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder={tr(
                        "heroVideos.descriptionPlaceholder",
                        "Enter video title",
                        "បញ្ចូលចំណងជើងវីដេអូ"
                      )}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                      {tr("heroVideos.description", "Description", "ការពិពណ៌នា")}
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder={tr(
                        "heroVideos.descriptionPlaceholder",
                        "Write a short description...",
                        "សរសេរការពិពណ៌នាខ្លី..."
                      )}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Active checkbox */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_active"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />

                    <label
                      htmlFor="is_active"
                      className="text-[13px] font-medium text-slate-700"
                    >
                      {tr("heroVideos.isActive", "Active", "សកម្ម")}
                    </label>
                  </div>
                </div>

                {/* RIGHT: File uploads */}
                <div className="space-y-5">
                  {/* Video file */}
                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                      {editingId
                        ? tr("heroVideos.changeVideo", "Change Video", "ប្ដូរវីដេអូ")
                        : tr("heroVideos.videoFile", "Video File", "ឯកសារវីដេអូ")}
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      type="file"
                      name="video"
                      accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                      onChange={handleFileChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] text-slate-900 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-[12px] file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                    />

                    <p className="mt-1 text-[11px] text-slate-500">
                      {tr("heroVideos.videoFormat", "MP4, WebM or MOV", "MP4, WebM ឬ MOV")} •{" "}
                      {tr("heroVideos.videoMax", "Max file size: 50 MB", "ទំហែងអតិបំផុត: 50 MB")}
                    </p>

                    {!editingId && (
                      <p className="text-[11px] text-slate-500">
                        {tr(
                          "heroVideos.keepCurrentVideo",
                          "Required for new videos.",
                          "ត្រូវការសម្រាប់វីដេអូថ្មី។"
                        )}
                      </p>
                    )}

                    {previewVideo && (
                      <div className="mt-3">
                        <video
                          src={previewVideo}
                          controls
                          className="w-full max-h-[200px] rounded-lg border border-slate-200"
                        />
                      </div>
                    )}
                  </div>

                  {/* Thumbnail file */}
                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                      {editingId
                        ? tr("heroVideos.changeThumbnail", "Change Thumbnail", "ប្ដូររូបភាពសំខាព់")
                        : tr("heroVideos.thumbnailFile", "Thumbnail Image", "រូបភាពសំខាព់")}
                    </label>

                    <input
                      type="file"
                      name="thumbnail"
                      accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] text-slate-900 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-[12px] file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                    />

                    <p className="mt-1 text-[11px] text-slate-500">
                      {tr("heroVideos.thumbnailFormat", "PNG, JPG, JPEG or WEBP", "PNG, JPG, JPEG ឬ WEBP")}
                    </p>

                    {previewThumbnail && (
                      <div className="mt-3">
                        <img
                          src={previewThumbnail}
                          alt="Thumbnail preview"
                          className="h-[120px] w-auto rounded-lg border border-slate-200 object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex h-[40px] items-center justify-center rounded-lg border border-slate-200 px-5 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {tr("common.cancel", "Cancel", "បោះបង់")}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-[40px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-[12px] font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}

                  {editingId
                    ? tr(
                        "common.update",
                        "Update",
                        "ធ្វើបច្ចុប្បន្នភាព"
                      )
                    : tr(
                        "common.create",
                        "Create",
                        "បង្កើត"
                      )}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* =====================================================
            TABLE
        ====================================================== */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Filters */}
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tr(
                  "common.search",
                  "Search...",
                  "ស្វែងរក..."
                )}
                className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none md:w-64"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">
                  {tr("common.status", "All Status", "ស្ថានភាពទាំងអស់")}
                </option>
                <option value="active">
                  {tr("common.active", "Active", "សកម្ម")}
                </option>
                <option value="inactive">
                  {tr("common.inactive", "Inactive", "អសកម្ម")}
                </option>
              </select>

              <button
                type="button"
                onClick={fetchVideos}
                className="inline-flex h-[38px] items-center justify-center rounded-lg border border-slate-200 px-3 text-slate-700 transition hover:bg-slate-50"
              >
                <FiRefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] uppercase tracking-[0.08em] text-slate-500">
                  <th className="px-5 py-3 font-semibold">#</th>
                  <th className="px-5 py-3 font-semibold">
                    {tr("heroVideos.title", "Title", "ចំណងជើង")}
                  </th>
                  <th className="px-5 py-3 font-semibold">
                    {tr("heroVideos.description", "Description", "ការពិពណ៌នា")}
                  </th>
                  <th className="px-5 py-3 font-semibold">
                    {tr("heroVideos.videoFile", "Video", "វីដេអូ")}
                  </th>
                  <th className="px-5 py-3 font-semibold">
                    {tr("common.status", "Status", "ស្ថានភាព")}
                  </th>
                  <th className="px-5 py-3 font-semibold text-right">
                    {tr("common.actions", "Actions", "សកម្មភាព")}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                        {tr(
                          "common.loading",
                          "Loading...",
                          "កំពុងផ្ទុក..."
                        )}
                      </div>
                    </td>
                  </tr>
                ) : filteredVideos.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      <FiFilm className="mx-auto mb-3 text-slate-300" size={40} />
                      <p className="text-[13px] font-medium">
                        {tr(
                          "heroVideos.noVideos",
                          "No hero videos found",
                          "មិនមានវីដេអូសំខាព់"
                        )}
                      </p>
                      <p className="mt-1 text-[12px] text-slate-400">
                        {tr(
                          "heroVideos.noVideosSubtitle",
                          "Get started by uploading your first hero video.",
                          "ចាប់ផ្តើមដោយបញ្ចូលវីដេអូសំខាព់របស់អ្នកដោយមួយ។"
                        )}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredVideos.map((video, index) => (
                    <tr
                      key={video.id}
                      className="transition hover:bg-slate-50/60"
                    >
                      <td className="px-5 py-4 text-slate-500">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {video.thumbnail_path && (
                            <img
                              src={getImageUrl(video.thumbnail_path)}
                              alt=""
                              className="h-[40px] w-[60px] rounded-md object-cover"
                            />
                          )}

                          <div>
                            <p className="font-semibold text-slate-900">
                              {video.title}
                            </p>

                            {video.mime_type && (
                              <p className="text-[11px] text-slate-500">
                                {getMimeTypeLabel(video.mime_type)}
                                {video.file_size ? ` • ${formatFileSize(video.file_size)}` : ""}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        <p className="line-clamp-2 max-w-[260px]">
                          {video.description || "-"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {video.video_path ? (
                          <a
                            href={getImageUrl(video.video_path)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100"
                          >
                            <FiPlay size={12} />
                            {tr("common.view", "View", "មើល")}
                          </a>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {video.is_active ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                            <FiCheck size={12} />
                            {tr("common.active", "Active", "សកម្ម")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                            {tr("common.inactive", "Inactive", "អសកម្ម")}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {!video.is_active && (
                            <button
                              type="button"
                              onClick={() => handleActivate(video)}
                              disabled={activatingId === video.id}
                              title={tr(
                                "heroVideos.activate",
                                "Activate",
                                "ដាក់បើក"
                              )}
                              className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-lg text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-50"
                            >
                              {activatingId === video.id ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
                              ) : (
                                <FiPlay size={16} />
                              )}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => openEditForm(video)}
                            className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50"
                          >
                            <FiEdit2 size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(video)}
                            disabled={deletingId === video.id}
                            className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === video.id ? (
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                            ) : (
                              <FiTrash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminHeroVideos;