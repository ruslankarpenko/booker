
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useAppContext } from '@/contexts/AppContext';
import { UserProfile, Language } from '@/types/establishment';
import { t } from '@/utils/i18n';
import * as ImagePicker from 'expo-image-picker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  settingLabel: {
    fontSize: 16,
    flex: 1,
  },
  settingValue: {
    fontSize: 16,
    opacity: 0.7,
    marginRight: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  photoButtonText: {
    marginLeft: 8,
    fontSize: 14,
  },
  colorPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

const THEME_COLORS = [
  '#64b5f6', // Light Blue
  '#81c784', // Light Green
  '#ffb74d', // Orange
  '#f06292', // Pink
  '#ba68c8', // Purple
  '#4fc3f7', // Cyan
  '#ff8a65', // Deep Orange
  '#a1887f', // Brown
];

const LANGUAGES = [
  { code: 'en' as Language, name: 'English' },
  { code: 'uk' as Language, name: 'Українська' },
  { code: 'ru' as Language, name: 'Русский' },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const { userProfile, appSettings, updateUserProfile, updateAppSettings } = useAppContext();
  
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    age: undefined,
    city: '',
    photo: undefined,
    phone: '',
    email: '',
    ...userProfile,
  });
  
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(appSettings.language);
  const [selectedColor, setSelectedColor] = useState(appSettings.themeColor);

  const handleSave = async () => {
    try {
      await updateUserProfile(profile);
      await updateAppSettings({
        language: selectedLanguage,
        themeColor: selectedColor,
      });
      
      Alert.alert('Success', 'Settings saved successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.log('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const handlePhotoPress = () => {
    Alert.alert(
      t('selectPhoto'),
      'Choose an option',
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('takePhoto'), onPress: takePhoto },
        { text: t('chooseFromLibrary'), onPress: pickImage },
      ]
    );
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfile(prev => ({ ...prev, photo: result.assets[0].uri }));
      }
    } catch (error) {
      console.log('Error taking photo:', error);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Photo library permission is required to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfile(prev => ({ ...prev, photo: result.assets[0].uri }));
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const showLanguagePicker = () => {
    Alert.alert(
      t('language'),
      'Select your preferred language',
      [
        ...LANGUAGES.map(lang => ({
          text: lang.name,
          onPress: () => setSelectedLanguage(lang.code),
        })),
        { text: t('cancel'), style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Stack.Screen
        options={{
          title: t('settings'),
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.card },
          headerTintColor: theme.colors.text,
          headerTitleStyle: { color: theme.colors.text },
        }}
      />
      
      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <View style={[styles.section, Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('editProfile')}
          </Text>
          
          <View style={styles.photoContainer}>
            {profile.photo ? (
              <Image source={{ uri: profile.photo }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <IconSymbol name="person.fill" size={40} color={theme.colors.text} />
              </View>
            )}
            
            <TouchableOpacity style={styles.photoButton} onPress={handlePhotoPress}>
              <IconSymbol name="camera.fill" size={16} color={theme.colors.text} />
              <Text style={[styles.photoButtonText, { color: theme.colors.text }]}>
                {t('selectPhoto')}
              </Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            placeholder={t('firstName')}
            placeholderTextColor={theme.dark ? '#98989D' : '#666'}
            value={profile.firstName}
            onChangeText={(text) => setProfile(prev => ({ ...prev, firstName: text }))}
          />
          
          <TextInput
            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            placeholder={t('lastName')}
            placeholderTextColor={theme.dark ? '#98989D' : '#666'}
            value={profile.lastName}
            onChangeText={(text) => setProfile(prev => ({ ...prev, lastName: text }))}
          />
          
          <TextInput
            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            placeholder={`${t('age')} (optional)`}
            placeholderTextColor={theme.dark ? '#98989D' : '#666'}
            value={profile.age?.toString() || ''}
            onChangeText={(text) => setProfile(prev => ({ ...prev, age: text ? parseInt(text) : undefined }))}
            keyboardType="numeric"
          />
          
          <TextInput
            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            placeholder={t('city')}
            placeholderTextColor={theme.dark ? '#98989D' : '#666'}
            value={profile.city}
            onChangeText={(text) => setProfile(prev => ({ ...prev, city: text }))}
          />
          
          <TextInput
            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            placeholder={t('phone')}
            placeholderTextColor={theme.dark ? '#98989D' : '#666'}
            value={profile.phone || ''}
            onChangeText={(text) => setProfile(prev => ({ ...prev, phone: text }))}
            keyboardType="phone-pad"
          />
          
          <TextInput
            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            placeholder={t('email')}
            placeholderTextColor={theme.dark ? '#98989D' : '#666'}
            value={profile.email || ''}
            onChangeText={(text) => setProfile(prev => ({ ...prev, email: text }))}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* App Settings Section */}
        <View style={[styles.section, Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            App Settings
          </Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={showLanguagePicker}>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
              {t('language')}
            </Text>
            <Text style={[styles.settingValue, { color: theme.colors.text }]}>
              {LANGUAGES.find(lang => lang.code === selectedLanguage)?.name}
            </Text>
            <IconSymbol name="chevron.right" size={16} color={theme.colors.text} />
          </TouchableOpacity>
          
          <View style={[styles.settingItem, styles.lastSettingItem]}>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
              {t('themeColor')}
            </Text>
          </View>
          
          <View style={styles.colorPalette}>
            {THEME_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{t('save')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
