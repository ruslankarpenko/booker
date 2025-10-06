
import { SortOption } from '../types/establishment';
import { colors } from '../styles/commonStyles';
import React, { useState } from 'react';
import { IconSymbol } from './IconSymbol';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { t } from '../utils/i18n';

interface SortFilterBarProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  onFilterPress: () => void;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginRight: 12,
  },
  sortOptions: {
    flex: 1,
    marginRight: 12,
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeSortButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  activeSortButtonText: {
    color: '#FFFFFF',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 6,
  },
});

export default function SortFilterBar({ currentSort, onSortChange, onFilterPress }: SortFilterBarProps) {
  const sortOptions: { key: SortOption; label: string }[] = [
    { key: 'distance', label: t('distance') },
    { key: 'rating', label: t('rating') },
    { key: 'price', label: t('price') },
    { key: 'availability', label: t('availability') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sortLabel}>{t('sortBy')}:</Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.sortOptions}
        >
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortButton,
                currentSort === option.key && styles.activeSortButton,
              ]}
              onPress={() => onSortChange(option.key)}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  currentSort === option.key && styles.activeSortButtonText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <IconSymbol name="line.3.horizontal.decrease" size={16} color={colors.text} />
          <Text style={styles.filterButtonText}>{t('filter')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
