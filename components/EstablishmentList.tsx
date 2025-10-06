
import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { Establishment, SortOption } from '../types/establishment';
import EstablishmentCard from './EstablishmentCard';
import SortFilterBar from './SortFilterBar';

interface EstablishmentListProps {
  establishments: Establishment[];
  onEstablishmentPress: (establishment: Establishment) => void;
  showSortFilter?: boolean;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Platform.OS !== 'ios' ? 100 : 20, // Extra padding for floating tab bar
  },
});

export default function EstablishmentList({ 
  establishments, 
  onEstablishmentPress, 
  showSortFilter = true 
}: EstablishmentListProps) {
  const [currentSort, setCurrentSort] = useState<SortOption>('distance');

  const sortedEstablishments = useMemo(() => {
    const sorted = [...establishments];
    
    switch (currentSort) {
      case 'distance':
        return sorted.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'price':
        return sorted.sort((a, b) => {
          const priceOrder = { '$': 1, '$$': 2, '$$$': 3, '$$$$': 4 };
          return priceOrder[a.priceRange] - priceOrder[b.priceRange];
        });
      case 'availability':
        return sorted.sort((a, b) => {
          const aAvailable = a.availableSlots.filter(slot => slot.available).length;
          const bAvailable = b.availableSlots.filter(slot => slot.available).length;
          return bAvailable - aAvailable;
        });
      default:
        return sorted;
    }
  }, [establishments, currentSort]);

  const handleSortChange = (sort: SortOption) => {
    setCurrentSort(sort);
  };

  const handleFilterPress = () => {
    console.log('Filter pressed');
    // TODO: Implement filter functionality
  };

  return (
    <View style={styles.container}>
      {showSortFilter && (
        <SortFilterBar
          currentSort={currentSort}
          onSortChange={handleSortChange}
          onFilterPress={handleFilterPress}
        />
      )}
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {sortedEstablishments.map((establishment) => (
          <EstablishmentCard
            key={establishment.id}
            establishment={establishment}
            onPress={onEstablishmentPress}
          />
        ))}
      </ScrollView>
    </View>
  );
}
