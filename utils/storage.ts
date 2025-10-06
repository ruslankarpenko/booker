
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, AppSettings, Language } from '../types/establishment';

const KEYS = {
  FAVORITES: 'favorites',
  USER_PROFILE: 'userProfile',
  APP_SETTINGS: 'appSettings',
};

// Favorites
export const getFavorites = async (): Promise<string[]> => {
  try {
    const favorites = await AsyncStorage.getItem(KEYS.FAVORITES);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.log('Error getting favorites:', error);
    return [];
  }
};

export const addToFavorites = async (establishmentId: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    if (!favorites.includes(establishmentId)) {
      favorites.push(establishmentId);
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
    }
  } catch (error) {
    console.log('Error adding to favorites:', error);
  }
};

export const removeFromFavorites = async (establishmentId: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(id => id !== establishmentId);
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.log('Error removing from favorites:', error);
  }
};

// User Profile
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const profile = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.log('Error getting user profile:', error);
    return null;
  }
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.log('Error saving user profile:', error);
  }
};

// App Settings
export const getAppSettings = async (): Promise<AppSettings> => {
  try {
    const settings = await AsyncStorage.getItem(KEYS.APP_SETTINGS);
    return settings ? JSON.parse(settings) : { language: 'en', themeColor: '#64b5f6' };
  } catch (error) {
    console.log('Error getting app settings:', error);
    return { language: 'en', themeColor: '#64b5f6' };
  }
};

export const saveAppSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.APP_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.log('Error saving app settings:', error);
  }
};
