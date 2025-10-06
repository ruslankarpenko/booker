
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors, commonStyles } from '../styles/commonStyles';

export default function MapPlaceholder() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <IconSymbol name="map" size={48} color={colors.textSecondary} />
        <Text style={styles.title}>Map View</Text>
        <Text style={styles.message}>
          Interactive maps are not supported in Natively at the moment.
        </Text>
        <Text style={styles.subtitle}>
          Use the list view below to browse establishments by location.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    backgroundColor: colors.card,
    margin: 16,
    borderRadius: 12,
    ...commonStyles.shadow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
