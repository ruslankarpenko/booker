
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useTheme } from '@react-navigation/native';
import { t } from '@/utils/i18n';
import { supabase } from '@/lib/supabase';
import { Service, Employee } from '@/types/establishment';
import { Calendar } from 'react-native-calendars';

export default function BookAppointmentScreen() {
  const theme = useTheme();
  const { establishmentId, establishmentName } = useLocalSearchParams<{ 
    establishmentId: string;
    establishmentName: string;
  }>();
  
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [servicesResult, employeesResult] = await Promise.all([
        supabase
          .from('services')
          .select('*')
          .eq('establishment_id', establishmentId)
          .eq('is_active', true),
        supabase
          .from('employees')
          .select('*')
          .eq('establishment_id', establishmentId)
          .eq('is_active', true)
      ]);

      if (servicesResult.error) {
        console.log('Error loading services:', servicesResult.error);
      } else {
        setServices(servicesResult.data || []);
      }

      if (employeesResult.error) {
        console.log('Error loading employees:', employeesResult.error);
      } else {
        setEmployees(employeesResult.data || []);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select a service, date, and time');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'You must be logged in to book an appointment');
        return;
      }

      // Check if the time slot is available
      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('establishment_id', establishmentId)
        .eq('booking_date', selectedDate)
        .eq('booking_time', selectedTime)
        .neq('status', 'cancelled');

      if (existingBookings && existingBookings.length > 0) {
        Alert.alert('Error', 'This time slot is no longer available');
        return;
      }

      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          establishment_id: establishmentId,
          employee_id: selectedEmployee?.id || null,
          service_id: selectedService.id,
          booking_date: selectedDate,
          booking_time: selectedTime,
          duration: selectedService.duration,
          total_price: selectedService.price,
          status: 'pending',
        });

      if (error) {
        console.log('Error creating booking:', error);
        Alert.alert('Error', 'Failed to create booking');
        return;
      }

      Alert.alert(
        'Booking Confirmed!',
        `Your appointment has been booked for ${selectedDate} at ${selectedTime}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Book Appointment',
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.card },
          headerTintColor: theme.colors.text,
          headerTitleStyle: { color: theme.colors.text },
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.establishmentName, { color: theme.colors.text }]}>
          {establishmentName}
        </Text>

        {/* Service Selection */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select Service</Text>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceItem,
                { borderColor: theme.colors.border },
                selectedService?.id === service.id && { 
                  backgroundColor: theme.colors.primary + '20',
                  borderColor: theme.colors.primary 
                }
              ]}
              onPress={() => setSelectedService(service)}
            >
              <View style={styles.serviceInfo}>
                <Text style={[styles.serviceName, { color: theme.colors.text }]}>
                  {service.name}
                </Text>
                <Text style={[styles.serviceDuration, { color: theme.colors.text + '80' }]}>
                  {service.duration} minutes
                </Text>
                {service.description && (
                  <Text style={[styles.serviceDescription, { color: theme.colors.text + '60' }]}>
                    {service.description}
                  </Text>
                )}
              </View>
              <Text style={[styles.servicePrice, { color: theme.colors.primary }]}>
                ${service.price}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Employee Selection */}
        {employees.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Select Employee (Optional)
            </Text>
            <TouchableOpacity
              style={[
                styles.employeeItem,
                { borderColor: theme.colors.border },
                !selectedEmployee && { 
                  backgroundColor: theme.colors.primary + '20',
                  borderColor: theme.colors.primary 
                }
              ]}
              onPress={() => setSelectedEmployee(null)}
            >
              <Text style={[styles.employeeName, { color: theme.colors.text }]}>
                No Preference
              </Text>
            </TouchableOpacity>
            {employees.map((employee) => (
              <TouchableOpacity
                key={employee.id}
                style={[
                  styles.employeeItem,
                  { borderColor: theme.colors.border },
                  selectedEmployee?.id === employee.id && { 
                    backgroundColor: theme.colors.primary + '20',
                    borderColor: theme.colors.primary 
                  }
                ]}
                onPress={() => setSelectedEmployee(employee)}
              >
                <Text style={[styles.employeeName, { color: theme.colors.text }]}>
                  {employee.name}
                </Text>
                <Text style={[styles.employeeRole, { color: theme.colors.text + '80' }]}>
                  {employee.role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Date Selection */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select Date</Text>
          <TouchableOpacity
            style={[styles.dateButton, { borderColor: theme.colors.border }]}
            onPress={() => setShowCalendar(true)}
          >
            <IconSymbol name="calendar" size={20} color={theme.colors.text} />
            <Text style={[styles.dateButtonText, { color: theme.colors.text }]}>
              {selectedDate ? formatDate(selectedDate) : 'Choose Date'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Time Selection */}
        {selectedDate && (
          <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select Time</Text>
            <View style={styles.timeGrid}>
              {timeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    { borderColor: theme.colors.border },
                    selectedTime === time && { 
                      backgroundColor: theme.colors.primary,
                      borderColor: theme.colors.primary 
                    }
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    { color: theme.colors.text },
                    selectedTime === time && { color: '#FFFFFF' }
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Booking Summary */}
        {selectedService && selectedDate && selectedTime && (
          <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Booking Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.text + '80' }]}>Service:</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                {selectedService.name}
              </Text>
            </View>
            {selectedEmployee && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.text + '80' }]}>Employee:</Text>
                <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                  {selectedEmployee.name}
                </Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.text + '80' }]}>Date:</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                {formatDate(selectedDate)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.text + '80' }]}>Time:</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                {selectedTime}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.text + '80' }]}>Duration:</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                {selectedService.duration} minutes
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={[styles.summaryLabel, styles.totalLabel, { color: theme.colors.text }]}>
                Total:
              </Text>
              <Text style={[styles.summaryValue, styles.totalValue, { color: theme.colors.primary }]}>
                ${selectedService.price}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.bookButton,
            { backgroundColor: theme.colors.primary },
            (!selectedService || !selectedDate || !selectedTime) && styles.bookButtonDisabled
          ]}
          onPress={handleBooking}
          disabled={!selectedService || !selectedDate || !selectedTime}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showCalendar}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCalendar(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]} edges={['top']}>
          <View style={[styles.modalHeader, { backgroundColor: theme.colors.card }]}>
            <TouchableOpacity onPress={() => setShowCalendar(false)}>
              <Text style={[styles.modalCancelButton, { color: theme.colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Date</Text>
            <View style={{ width: 60 }} />
          </View>
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setSelectedTime(''); // Reset time when date changes
              setShowCalendar(false);
            }}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: theme.colors.primary }
            }}
            minDate={new Date().toISOString().split('T')[0]}
            theme={{
              backgroundColor: theme.colors.background,
              calendarBackground: theme.colors.background,
              textSectionTitleColor: theme.colors.text,
              dayTextColor: theme.colors.text,
              todayTextColor: theme.colors.primary,
              selectedDayTextColor: '#FFFFFF',
              monthTextColor: theme.colors.text,
              arrowColor: theme.colors.primary,
            }}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  establishmentName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  serviceDuration: {
    fontSize: 14,
    marginBottom: 2,
  },
  serviceDescription: {
    fontSize: 12,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  employeeItem: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  employeeRole: {
    fontSize: 14,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    gap: 8,
  },
  dateButtonText: {
    fontSize: 16,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  bookButtonDisabled: {
    opacity: 0.5,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalCancelButton: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});
