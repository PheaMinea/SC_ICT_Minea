import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { getImageUrl } from '../utils/helpers';

const DEFAULT_LOGO = '/logo.png';

const defaultSettings = {
  site_name_en: 'SC Academy',
  site_name_km: 'SC Academy',
  site_description_en: 'SC Academy - Building Knowledge, Skills & Future Leaders',
  site_description_km: 'SC Academy - កសាងចំណេះដឹង ជំនាញ និងអ្នកដឹកនាំអនាគត',
  logo_url: '',
  favicon_url: '',
  address_en: 'AP Plaza, Preah Monivong Blvd, Phnom Penh, Cambodia',
  address_km: 'អគារ AP Plaza មហាវិថីព្រះមុនីវង្ស រាជធានីភ្នំពេញ',
  phone: '+855 12 345 678',
  email: 'info@scacademy.edu.kh',
  facebook_url: 'https://facebook.com',
  telegram_url: 'https://t.me',
  youtube_url: 'https://youtube.com',
  google_map_url: 'https://maps.app.goo.gl/y19U8vRnrNh8tSvo8',
};

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/api/settings/');
      if (response.data) {
        setSettings((prev) => ({
          ...prev,
          ...response.data,
        }));
      }
    } catch (err) {
      console.warn('Failed to load settings from server, using default settings:', err?.message);
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Update Favicon dynamically when favicon_url changes
  useEffect(() => {
    if (settings.favicon_url) {
      const link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = getImageUrl(settings.favicon_url);
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [settings.favicon_url]);

  const value = {
    settings,
    loadingSettings,
    refreshSettings: fetchSettings,
    logo: settings.logo_url ? getImageUrl(settings.logo_url) : DEFAULT_LOGO,
    favicon: settings.favicon_url ? getImageUrl(settings.favicon_url) : '/favicon.ico',
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    return {
      settings: defaultSettings,
      loadingSettings: false,
      refreshSettings: () => {},
      logo: DEFAULT_LOGO,
      favicon: '/favicon.ico',
    };
  }
  return context;
};
