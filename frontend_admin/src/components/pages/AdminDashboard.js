import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FiActivity, FiArrowUpRight, FiBarChart2, FiBookOpen, FiClock, FiImage,
  FiMessageSquare, FiRefreshCw, FiSettings, FiShield, FiUsers, FiVideo,
  FiTrendingUp,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

const endpoints = {
  courses: '/api/courses/', messages: '/api/contact/', videos: '/api/videos/',
  gallery: '/api/gallery/', users: '/api/admin/users',
};

const getCount = (result) => (
  result.status === 'fulfilled' && Array.isArray(result.value.data)
    ? result.value.data.length : 0
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isKhmer = language === 'km' || language === 'kh';
  const [stats, setStats] = useState({ courses: 0, messages: 0, videos: 0, gallery: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [failedServices, setFailedServices] = useState(0);

  const fetchStats = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    const entries = Object.entries(endpoints);
    const results = await Promise.allSettled(entries.map(([, url]) => api.get(url)));
    const nextStats = {};
    results.forEach((result, index) => { nextStats[entries[index][0]] = getCount(result); });
    setStats(nextStats);
    setFailedServices(results.filter((result) => result.status === 'rejected').length);
    setLastUpdated(new Date());
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const statsData = useMemo(() => [
    { title: t('dashboard.totalCourses'), description: t('dashboard.availableCourses'), value: stats.courses, icon: FiBookOpen, accent: 'from-blue-600 to-blue-800', glow: 'bg-blue-500/10', path: '/courses' },
    { title: t('dashboard.messages'), description: t('dashboard.contactMessages'), value: stats.messages, icon: FiMessageSquare, accent: 'from-rose-500 to-red-700', glow: 'bg-red-500/10', path: '/messages' },
    { title: t('dashboard.videos'), description: t('dashboard.publishedVideos'), value: stats.videos, icon: FiVideo, accent: 'from-violet-500 to-indigo-700', glow: 'bg-violet-500/10', path: '/videos' },
    { title: t('dashboard.galleryImages'), description: t('dashboard.galleryPhotos'), value: stats.gallery, icon: FiImage, accent: 'from-cyan-500 to-blue-700', glow: 'bg-cyan-500/10', path: '/gallery' },
    { title: t('dashboard.adminUsers'), description: t('dashboard.systemAdministrators'), value: stats.users, icon: FiUsers, accent: 'from-amber-500 to-orange-700', glow: 'bg-amber-500/10', path: '/settings' },
  ], [stats, t]);

  const quickActions = [
    { label: t('dashboard.addNewCourse'), icon: FiBookOpen, path: '/courses' },
    { label: t('dashboard.uploadGalleryImage'), icon: FiImage, path: '/gallery' },
    { label: t('dashboard.messages'), icon: FiMessageSquare, path: '/messages' },
    { label: t('admin.settings'), icon: FiSettings, path: '/settings' },
  ];

  const contentMetrics = [
    { label: t('dashboard.totalCourses'), value: stats.courses, color: 'bg-blue-600' },
    { label: t('dashboard.videos'), value: stats.videos, color: 'bg-violet-500' },
    { label: t('dashboard.galleryImages'), value: stats.gallery, color: 'bg-cyan-500' },
    { label: t('dashboard.messages'), value: stats.messages, color: 'bg-rose-500' },
  ];
  const totalContent = contentMetrics.reduce((total, item) => total + item.value, 0);
  const highestMetric = Math.max(...contentMetrics.map((item) => item.value), 1);

  if (loading) return (
    <div className="flex min-h-[65vh] items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-800" />
        <p className="mt-4 text-sm font-medium text-slate-500">{t('dashboard.loadingDashboard')}</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f4f7fb] p-4 md:p-6 lg:p-8">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#071a3d] via-[#103778] to-[#1458a6] p-6 text-white shadow-xl shadow-blue-950/10 md:p-9">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-cyan-300/10 blur-2xl" />
        <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-red-500/20 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
              SC Academy Control Center
            </div>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">{t('dashboard.managementDashboard')}</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-blue-100 md:text-base">{t('dashboard.managementDescription')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="flex items-center gap-2 text-xs text-blue-100"><FiClock />{isKhmer ? 'ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ' : 'Last updated'}</div>
              <p className="mt-1 text-sm font-bold">{lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <button type="button" onClick={() => fetchStats(true)} disabled={refreshing} className="inline-flex h-[58px] items-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-blue-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50 disabled:opacity-60">
              <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? t('common.refreshing') : t('common.refresh')}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <button key={stat.title} type="button" onClick={() => navigate(stat.path)} className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5">
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${stat.glow} transition group-hover:scale-125`} />
              <div className={`relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.accent} text-white shadow-lg`}><Icon size={19} /></div>
              <div className="relative mt-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-3xl font-black tracking-tight text-slate-900">{stat.value}</p>
                  <p className="mt-1 text-sm font-bold text-slate-700">{stat.title}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-400">{stat.description}</p>
                </div>
                <FiArrowUpRight className="mb-1 text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-700" />
              </div>
            </button>
          );
        })}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-2 md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                <FiBarChart2 />
                {isKhmer ? 'ការវិភាគមាតិកា' : 'Content analytics'}
              </div>
              <h2 className="mt-2 text-lg font-black text-slate-900">
                {isKhmer ? 'ទិដ្ឋភាពទូទៅនៃមាតិកា' : 'Content distribution'}
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              <FiTrendingUp /> {isKhmer ? 'ទិន្នន័យបច្ចុប្បន្ន' : 'Live data'}
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {contentMetrics.map((metric) => (
              <div key={metric.label}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-slate-600">{metric.label}</span>
                  <span className="text-sm font-black tabular-nums text-slate-900">{metric.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${metric.color} transition-all duration-700`}
                    style={{ width: `${metric.value ? Math.max((metric.value / highestMetric) * 100, 8) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-600/5" />
          <p className="relative text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            {isKhmer ? 'មាតិកាសរុប' : 'Total managed content'}
          </p>
          <p className="relative mt-3 text-5xl font-black tracking-tight text-blue-950">{totalContent}</p>
          <p className="relative mt-2 text-sm leading-6 text-slate-500">
            {isKhmer
              ? 'ចំនួនទិន្នន័យសរុបដែលកំពុងគ្រប់គ្រងនៅក្នុងប្រព័ន្ធ។'
              : 'Total records currently managed across your main content areas.'}
          </p>
          <div className="relative mt-7 grid grid-cols-2 gap-3 border-t border-blue-100 pt-5">
            <div><p className="text-xs text-slate-400">API services</p><p className="mt-1 text-lg font-black text-slate-900">{Object.keys(endpoints).length}</p></div>
            <div><p className="text-xs text-slate-400">Admin users</p><p className="mt-1 text-lg font-black text-slate-900">{stats.users}</p></div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm xl:col-span-2 md:p-6">
          <div className="flex items-center justify-between">
            <div><h2 className="text-lg font-black text-slate-900">{t('dashboard.quickActions')}</h2><p className="mt-1 text-sm text-slate-500">{t('dashboard.quickActionsDescription')}</p></div>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-800"><FiActivity /></div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button key={action.path} type="button" onClick={() => navigate(action.path)} className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50">
                  <span className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-800 shadow-sm"><Icon /></span><span className="text-sm font-bold text-slate-800">{action.label}</span></span>
                  <FiArrowUpRight className="text-slate-300 transition group-hover:text-blue-700" />
                </button>
              );
            })}
          </div>
        </div>

        <aside className="rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 p-6 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-emerald-300"><FiShield size={22} /></div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${failedServices ? 'bg-amber-400/15 text-amber-300' : 'bg-emerald-400/15 text-emerald-300'}`}>{failedServices ? `${failedServices} API issue` : 'All systems online'}</span>
          </div>
          <h2 className="mt-8 text-xl font-black">{isKhmer ? 'ស្ថានភាពប្រព័ន្ធ' : 'System overview'}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">{isKhmer ? 'API និងផ្នែកគ្រប់គ្រងត្រូវបានត្រួតពិនិត្យរាល់ពេល Dashboard ធ្វើបច្ចុប្បន្នភាព។' : 'Your APIs and administration services are checked whenever the dashboard refreshes.'}</p>
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400"><span>SC Academy API</span><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Operational</span></div>
        </aside>
      </section>
    </main>
  );
};

export default AdminDashboard;
