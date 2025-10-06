
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { mockEstablishments } from '@/data/mockEstablishments';
import { Establishment } from '@/types/establishment';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import EstablishmentDetails from '@/components/EstablishmentDetails';
import EstablishmentList from '@/components/EstablishmentList';
import { useAppContext } from '@/contexts/AppContext';
import { getFavorites } from '@/utils/storage';
import { t } from '@/utils/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default function FavoritesScreen() {
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [favoriteEstablishments, setFavoriteEstablishments] = useState<Establishment[]>([]);
  const { favorites, updateFavorites } = useAppContext();
  const theme = useTheme();

  useEffect(() => {
    loadFavorites();
  }, [favorites]);

  const loadFavorites = async () => {
    try {
      const favoriteIds = await getFavorites();
      const favEstablishments = mockEstablishments.filter(est => 
        favoriteIds.includes(est.id)
      ).map(est => ({ ...est, isFavorite: true }));
      setFavoriteEstablishments(favEstablishments);
    } catch (error) {
      console.log('Error loading favorites:', error);
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
      `${t('bookAppointment')} at ${establishment.name}?`,
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('bookAppointment'), onPress: () => console.log('Booking appointment...') },
      ]
    );
  };

  const renderHeaderRight = () => (
    <IconSymbol 
      name="magnifyingglass" 
      size={24} 
      color={colors.text}
      style={{ marginRight: 16 }}
    />
  );

  const renderHeaderLeft = () => (
    selectedEstablishment ? (
      <IconSymbol 
        name="chevron.left" 
        size={24} 
        color={colors.text}
        style={{ marginLeft: 16 }}
      />
    ) : null
  );

  if (selectedEstablishment) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Stack.Screen
          options={{
            title: selectedEstablishment.name,
            headerShown: true,
            headerLeft: renderHeaderLeft,
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
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: t('favorites'),
          headerShown: true,
          headerRight: renderHeaderRight,
          headerStyle: { backgroundColor: theme.colors.card },
          headerTintColor: theme.colors.text,
          headerTitleStyle: { color: theme.colors.text },
        }}
      />
      
      {favoriteEstablishments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconSymbol 
            name="heart" 
            size={64} 
            color={theme.colors.text}
            style={[styles.emptyIcon, { opacity: 0.3 }]}
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            {t('noFavorites')}
          </Text>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            Start exploring and add places to your favorites!
          </Text>
        </View>
      ) : (
        <EstablishmentList
          establishments={favoriteEstablishments}
          onEstablishmentPress={handleEstablishmentPress}
          showSortFilter={false}
        />
      )}
    </View>
  );
}
