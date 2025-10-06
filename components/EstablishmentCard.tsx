
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { IconSymbol } from './IconSymbol';
import { Establishment } from '../types/establishment';
import { colors, commonStyles } from '../styles/commonStyles';
import { useAppContext } from '../contexts/AppContext';
import { addToFavorites, removeFromFavorites, getFavorites } from '../utils/storage';

interface EstablishmentCardProps {
  establishment: Establishment;
  onPress: (establishment: Establishment) => void;
}

const styles = StyleSheet.create({
  card: {
    ...commonStyles.card,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  priceRange: {
    fontSize: 14,
    fontWeight: '600',
  },
  distance: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});

export default function EstablishmentCard({ establishment, onPress }: EstablishmentCardProps) {
  const { favorites, updateFavorites } = useAppContext();
  const isFavorite = favorites.includes(establishment.id);

  const handleFavoritePress = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites(establishment.id);
      } else {
        await addToFavorites(establishment.id);
      }
      
      // Update the context with fresh data
      const updatedFavorites = await getFavorites();
      updateFavorites(updatedFavorites);
    } catch (error) {
      console.log('Error toggling favorite:', error);
    }
  };

  const getPriceRangeColor = (priceRange: string) => {
    switch (priceRange) {
      case '$': return colors.secondary;
      case '$$': return colors.primary;
      case '$$$': return colors.accent;
      case '$$$$': return '#f44336';
      default: return colors.text;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hairdresser': return 'scissors';
      case 'cosmetologist': return 'sparkles';
      case 'nail_salon': return 'hand.raised.fill';
      case 'spa': return 'leaf.fill';
      case 'barbershop': return 'mustache.fill';
      default: return 'building.2.fill';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(establishment)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: establishment.imageUrl }} style={styles.image} />
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          activeOpacity={0.7}
        >
          <IconSymbol 
            name={isFavorite ? "heart.fill" : "heart"} 
            size={20} 
            color={isFavorite ? "#ff4757" : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{establishment.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconSymbol 
              name={getTypeIcon(establishment.type)} 
              size={14} 
              color={colors.textSecondary} 
            />
            <Text style={styles.type}> {establishment.type.replace('_', ' ')}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.address}>{establishment.address}</Text>
      
      <View style={styles.infoRow}>
        <View style={styles.leftInfo}>
          <View style={styles.rating}>
            <IconSymbol name="star.fill" size={14} color="#ffc107" />
            <Text style={styles.ratingText}>{establishment.rating}</Text>
            <Text style={styles.reviewCount}>({establishment.reviewCount})</Text>
          </View>
        </View>
        
        <Text style={[styles.priceRange, { color: getPriceRangeColor(establishment.priceRange) }]}>
          {establishment.priceRange}
        </Text>
      </View>
      
      {establishment.distance && (
        <Text style={styles.distance}>
          {establishment.distance.toFixed(1)} km away
        </Text>
      )}
    </TouchableOpacity>
  );
}
