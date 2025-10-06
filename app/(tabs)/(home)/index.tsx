
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { Establishment } from '@/types/establishment';
import { mockEstablishments } from '@/data/mockEstablishments';
import EstablishmentDetails from '@/components/EstablishmentDetails';
import MapView from '@/components/MapView';
import { t } from '@/utils/i18n';

export default function HomeScreen() {
  const theme = useTheme();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEstablishments();
  }, []);

  const loadEstablishments = async () => {
    try {
      // For now, using mock data. In a real app, this would fetch from Supabase
      setEstablishments(mockEstablishments);
    } catch (error) {
      console.log('Error loading establishments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEstablishmentPress = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
  };

  const handleBackPress = () => {
    setSelectedEstablishment(null);
  };

  const handleBookAppointment = (establishment: Establishment) => {
    Alert.alert(
      t('bookAppointment'),
      `Book an appointment at ${establishment.name}?`,
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('book'), onPress: () => console.log('Booking appointment...') },
      ]
    );
  };

  if (selectedEstablishment) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <Stack.Screen
          options={{
            title: selectedEstablishment.name,
            headerShown: true,
            headerStyle: { backgroundColor: theme.colors.card },
            headerTintColor: theme.colors.text,
            headerTitleStyle: { color: theme.colors.text },
          }}
        />
        <EstablishmentDetails
          establishment={selectedEstablishment}
          onBack={handleBackPress}
          onBookAppointment={handleBookAppointment}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Stack.Screen
        options={{
          title: t('map'),
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.card },
          headerTintColor: theme.colors.text,
          headerTitleStyle: { color: theme.colors.text },
        }}
      />
      
      <View style={styles.mapContainer}>
        <MapView 
          establishments={establishments}
          onEstablishmentPress={handleEstablishmentPress}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
});
