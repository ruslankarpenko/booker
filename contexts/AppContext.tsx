
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, AppSettings, Language } from '../types/establishment';
import { getUserProfile, saveUserProfile, getAppSettings, saveAppSettings, getFavorites } from '../utils/storage';
import { setLanguage } from '../utils/i18n';

interface AppContextType {
  userProfile: UserProfile | null;
  appSettings: AppSettings;
  favorites: string[];
  updateUserProfile: (profile: UserProfile) => Promise<void>;
  updateAppSettings: (settings: AppSettings) => Promise<void>;
  updateFavorites: (favorites: string[]) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings>({ language: 'en', themeColor: '#64b5f6' });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [profile, settings, favs] = await Promise.all([
        getUserProfile(),
        getAppSettings(),
        getFavorites(),
      ]);

      if (profile) {
        setUserProfile(profile);
      }
      
      setAppSettings(settings);
      setLanguage(settings.language);
      setFavorites(favs);
    } catch (error) {
      console.log('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (profile: UserProfile) => {
    try {
      await saveUserProfile(profile);
      setUserProfile(profile);
    } catch (error) {
      console.log('Error updating user profile:', error);
    }
  };

  const updateAppSettings = async (settings: AppSettings) => {
    try {
      await saveAppSettings(settings);
      setAppSettings(settings);
      setLanguage(settings.language);
    } catch (error) {
      console.log('Error updating app settings:', error);
    }
  };

  const updateFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        appSettings,
        favorites,
        updateUserProfile,
        updateAppSettings,
        updateFavorites,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
