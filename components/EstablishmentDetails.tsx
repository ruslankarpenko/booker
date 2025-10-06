
import React, { useState, useEffect } from 'react';
import { IconSymbol } from './IconSymbol';
import { Establishment, Employee } from '../types/establishment';
import { colors, commonStyles } from '../styles/commonStyles';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert, Linking, Modal } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import { addToFavorites, removeFromFavorites, getFavorites } from '../utils/storage';
import { t } from '../utils/i18n';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';
import { useTheme } from '@react-navigation/native';

interface EstablishmentDetailsProps {
  establishment: Establishment;
  onBack: () => void;
  onBookAppointment: (establishment: Establishment) => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  type: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  address: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rating: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  priceRange: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    boxShadow: `0px 2px 4px ${colors.shadow}`,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 8,
    boxShadow: `0px 1px 3px ${colors.shadow}`,
    elevation: 1,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  serviceDuration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  availableSlot: {
    backgroundColor: colors.highlight,
    borderColor: colors.highlight,
  },
  slotText: {
    fontSize: 14,
    color: colors.text,
  },
  availableSlotText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  hoursContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: `0px 2px 4px ${colors.shadow}`,
    elevation: 2,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastHourRow: {
    borderBottomWidth: 0,
  },
  dayText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  closedText: {
    color: '#f44336',
    fontStyle: 'italic',
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 8,
    boxShadow: `0px 1px 3px ${colors.shadow}`,
    elevation: 1,
  },
  employeePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  employeePhotoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  employeeRole: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalConfirmButton: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  modalConfirmButtonText: {
    color: '#FFFFFF',
  },
});

export default function EstablishmentDetails({ establishment, onBack, onBookAppointment }: EstablishmentDetailsProps) {
  const theme = useTheme();
  const { favorites, updateFavorites } = useAppContext();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const isFavorite = favorites.includes(establishment.id);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('establishment_id', establishment.id)
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.log('Error loading employees:', error);
        return;
      }

      setEmployees(data || []);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoadingEmployees(false);
    }
  };

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

  const handleMessagePress = () => {
    if (employees.length === 0) {
      Alert.alert('No Employees', 'This establishment has no employees available for messaging.');
      return;
    }
    setShowEmployeeModal(true);
  };

  const handleEmployeeSelect = async (employee: Employee) => {
    setShowEmployeeModal(false);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'You must be logged in to send messages');
        return;
      }

      // Check if chat already exists
      const { data: existingChat } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .eq('establishment_id', establishment.id)
        .eq('employee_id', employee.id)
        .single();

      let chatId = existingChat?.id;

      if (!existingChat) {
        // Create new chat
        const { data: newChat, error } = await supabase
          .from('chats')
          .insert({
            user_id: user.id,
            establishment_id: establishment.id,
            employee_id: employee.id,
          })
          .select()
          .single();

        if (error) {
          console.log('Error creating chat:', error);
          Alert.alert('Error', 'Failed to create chat');
          return;
        }

        chatId = newChat.id;
      }

      // Navigate to chat
      router.push({
        pathname: '/chat-detail',
        params: {
          chatId,
          establishmentName: establishment.name,
          employeeName: employee.name,
        },
      });
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
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

  const handleCallPress = () => {
    const phoneUrl = `tel:${establishment.phone}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Error', 'Phone calls are not supported on this device');
        }
      })
      .catch((error) => console.log('Error opening phone:', error));
  };

  const handleDirectionsPress = () => {
    const mapsUrl = `https://maps.google.com/?q=${establishment.latitude},${establishment.longitude}`;
    Linking.canOpenURL(mapsUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(mapsUrl);
        } else {
          Alert.alert('Error', 'Maps are not supported on this device');
        }
      })
      .catch((error) => console.log('Error opening maps:', error));
  };

  const handleBookPress = () => {
    router.push({
      pathname: '/book-appointment',
      params: {
        establishmentId: establishment.id,
        establishmentName: establishment.name,
      },
    });
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

  const getDayName = (day: string) => {
    const days = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
    };
    return days[day as keyof typeof days] || day;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.image}>
        <Image source={{ uri: establishment.imageUrl }} style={styles.image} />
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          activeOpacity={0.7}
        >
          <IconSymbol 
            name={isFavorite ? "heart.fill" : "heart"} 
            size={24} 
            color={isFavorite ? "#ff4757" : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{establishment.name}</Text>
          
          <View style={styles.typeContainer}>
            <IconSymbol 
              name={getTypeIcon(establishment.type)} 
              size={20} 
              color={colors.textSecondary} 
            />
            <Text style={styles.type}>{establishment.type.replace('_', ' ')}</Text>
          </View>
          
          <Text style={styles.address}>{establishment.address}</Text>
          
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={20} color="#ffc107" />
            <Text style={styles.rating}>{establishment.rating}</Text>
            <Text style={styles.reviewCount}>({establishment.reviewCount} {t('reviews')})</Text>
            <Text style={[styles.priceRange, { color: getPriceRangeColor(establishment.priceRange) }]}>
              {establishment.priceRange}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]} 
            onPress={handleBookPress}
          >
            <IconSymbol name="calendar" size={20} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, styles.primaryButtonText]}>
              {t('bookAppointment')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleCallPress}>
            <IconSymbol name="phone.fill" size={20} color={colors.text} />
            <Text style={styles.actionButtonText}>{t('call')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleMessagePress}>
            <IconSymbol name="message.fill" size={20} color={colors.text} />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
        </View>

        {employees.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Team</Text>
            {employees.map((employee) => (
              <View key={employee.id} style={styles.employeeItem}>
                {employee.photo_url ? (
                  <Image source={{ uri: employee.photo_url }} style={styles.employeePhoto} />
                ) : (
                  <View style={styles.employeePhotoPlaceholder}>
                    <IconSymbol name="person.fill" size={20} color={colors.textSecondary} />
                  </View>
                )}
                <View style={styles.employeeInfo}>
                  <Text style={styles.employeeName}>{employee.name}</Text>
                  <Text style={styles.employeeRole}>{employee.role}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('services')}</Text>
          {establishment.services.map((service) => (
            <View key={service.id} style={styles.serviceItem}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDuration}>{service.duration} min</Text>
              </View>
              <Text style={styles.servicePrice}>${service.price}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('availableSlots')}</Text>
          <View style={styles.slotsContainer}>
            {establishment.availableSlots.slice(0, 8).map((slot) => (
              <View 
                key={slot.id} 
                style={[
                  styles.timeSlot, 
                  slot.available && styles.availableSlot
                ]}
              >
                <Text style={[
                  styles.slotText, 
                  slot.available && styles.availableSlotText
                ]}>
                  {slot.time}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('openingHours')}</Text>
          <View style={styles.hoursContainer}>
            {Object.entries(establishment.openingHours).map(([day, hours], index, array) => (
              <View 
                key={day} 
                style={[
                  styles.hourRow, 
                  index === array.length - 1 && styles.lastHourRow
                ]}
              >
                <Text style={styles.dayText}>{getDayName(day)}</Text>
                <Text style={[
                  styles.timeText, 
                  !hours && styles.closedText
                ]}>
                  {hours ? `${hours.open} - ${hours.close}` : 'Closed'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <Modal
        visible={showEmployeeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEmployeeModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Choose Employee
            </Text>
            <Text style={[styles.modalSubtitle, { color: theme.colors.text + '80' }]}>
              Select an employee to start a conversation with:
            </Text>
            
            {employees.map((employee) => (
              <TouchableOpacity
                key={employee.id}
                style={[styles.employeeItem, { backgroundColor: theme.colors.background }]}
                onPress={() => handleEmployeeSelect(employee)}
              >
                {employee.photo_url ? (
                  <Image source={{ uri: employee.photo_url }} style={styles.employeePhoto} />
                ) : (
                  <View style={[styles.employeePhotoPlaceholder, { backgroundColor: theme.colors.card }]}>
                    <IconSymbol name="person.fill" size={20} color={theme.colors.text + '60'} />
                  </View>
                )}
                <View style={styles.employeeInfo}>
                  <Text style={[styles.employeeName, { color: theme.colors.text }]}>{employee.name}</Text>
                  <Text style={[styles.employeeRole, { color: theme.colors.text + '80' }]}>{employee.role}</Text>
                </View>
              </TouchableOpacity>
            ))}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton, { borderColor: theme.colors.border }]}
                onPress={() => setShowEmployeeModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
