
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { useTheme } from '@react-navigation/native';
import { Establishment } from '@/types/establishment';

interface MapViewProps {
  establishments: Establishment[];
  onEstablishmentPress?: (establishment: Establishment) => void;
}

export default function MapView({ establishments, onEstablishmentPress }: MapViewProps) {
  const theme = useTheme();

  const openInMaps = () => {
    if (establishments.length > 0) {
      const firstEstablishment = establishments[0];
      const url = `https://maps.google.com/?q=${firstEstablishment.latitude},${firstEstablishment.longitude}`;
      Linking.openURL(url);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={styles.content}>
        <IconSymbol name="map.fill" size={64} color={theme.colors.text + '40'} />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Map View Not Available
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text + '80' }]}>
          react-native-maps is not supported in Natively right now.
        </Text>
        <Text style={[styles.description, { color: theme.colors.text + '60' }]}>
          You can view establishments in list format or open them in your device's maps app.
        </Text>
        
        {establishments.length > 0 && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={openInMaps}
          >
            <IconSymbol name="location.fill" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Open in Maps</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  content: {
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
