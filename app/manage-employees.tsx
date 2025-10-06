
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useTheme } from '@react-navigation/native';
import { t } from '@/utils/i18n';
import { supabase } from '@/lib/supabase';
import { Employee } from '@/types/establishment';
import * as ImagePicker from 'expo-image-picker';

export default function ManageEmployeesScreen() {
  const theme = useTheme();
  const { establishmentId } = useLocalSearchParams<{ establishmentId: string }>();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    bio: '',
    photo_url: '',
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('establishment_id', establishmentId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error loading employees:', error);
        return;
      }

      setEmployees(data || []);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setFormData({
      name: '',
      role: '',
      phone: '',
      email: '',
      bio: '',
      photo_url: '',
    });
    setEditingEmployee(null);
    setShowAddModal(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setFormData({
      name: employee.name,
      role: employee.role,
      phone: employee.phone || '',
      email: employee.email || '',
      bio: employee.bio || '',
      photo_url: employee.photo_url || '',
    });
    setEditingEmployee(employee);
    setShowAddModal(true);
  };

  const handleSaveEmployee = async () => {
    if (!formData.name.trim() || !formData.role.trim()) {
      Alert.alert('Error', 'Please fill in name and role');
      return;
    }

    try {
      if (editingEmployee) {
        // Update existing employee
        const { error } = await supabase
          .from('employees')
          .update({
            name: formData.name.trim(),
            role: formData.role.trim(),
            phone: formData.phone.trim() || null,
            email: formData.email.trim() || null,
            bio: formData.bio.trim() || null,
            photo_url: formData.photo_url || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingEmployee.id);

        if (error) {
          console.log('Error updating employee:', error);
          Alert.alert('Error', 'Failed to update employee');
          return;
        }
      } else {
        // Create new employee
        const { error } = await supabase
          .from('employees')
          .insert({
            establishment_id: establishmentId,
            name: formData.name.trim(),
            role: formData.role.trim(),
            phone: formData.phone.trim() || null,
            email: formData.email.trim() || null,
            bio: formData.bio.trim() || null,
            photo_url: formData.photo_url || null,
          });

        if (error) {
          console.log('Error creating employee:', error);
          Alert.alert('Error', 'Failed to create employee');
          return;
        }
      }

      setShowAddModal(false);
      loadEmployees();
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleDeleteEmployee = (employee: Employee) => {
    Alert.alert(
      'Delete Employee',
      `Are you sure you want to delete ${employee.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteEmployee(employee.id) },
      ]
    );
  };

  const deleteEmployee = async (employeeId: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({ is_active: false })
        .eq('id', employeeId);

      if (error) {
        console.log('Error deleting employee:', error);
        Alert.alert('Error', 'Failed to delete employee');
        return;
      }

      loadEmployees();
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handlePhotoPress = () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to add a photo',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData(prev => ({ ...prev, photo_url: result.assets[0].uri }));
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData(prev => ({ ...prev, photo_url: result.assets[0].uri }));
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading employees...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Manage Employees',
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.card },
          headerTintColor: theme.colors.text,
          headerTitleStyle: { color: theme.colors.text },
          headerRight: () => (
            <TouchableOpacity onPress={handleAddEmployee} style={{ marginRight: 16 }}>
              <IconSymbol name="plus" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {employees.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="person.3.fill" size={64} color={theme.colors.text + '40'} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Employees Yet</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.text + '80' }]}>
              Add your first employee to get started
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleAddEmployee}
            >
              <IconSymbol name="plus" size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Employee</Text>
            </TouchableOpacity>
          </View>
        ) : (
          employees.map((employee) => (
            <View key={employee.id} style={[styles.employeeCard, { backgroundColor: theme.colors.card }]}>
              <View style={styles.employeeHeader}>
                {employee.photo_url ? (
                  <Image source={{ uri: employee.photo_url }} style={styles.employeePhoto} />
                ) : (
                  <View style={[styles.employeePhotoPlaceholder, { backgroundColor: theme.colors.background }]}>
                    <IconSymbol name="person.fill" size={24} color={theme.colors.text + '60'} />
                  </View>
                )}
                <View style={styles.employeeInfo}>
                  <Text style={[styles.employeeName, { color: theme.colors.text }]}>{employee.name}</Text>
                  <Text style={[styles.employeeRole, { color: theme.colors.text + '80' }]}>{employee.role}</Text>
                  {employee.phone && (
                    <Text style={[styles.employeeContact, { color: theme.colors.text + '60' }]}>
                      {employee.phone}
                    </Text>
                  )}
                  {employee.email && (
                    <Text style={[styles.employeeContact, { color: theme.colors.text + '60' }]}>
                      {employee.email}
                    </Text>
                  )}
                </View>
                <View style={styles.employeeActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditEmployee(employee)}
                  >
                    <IconSymbol name="pencil" size={20} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteEmployee(employee)}
                  >
                    <IconSymbol name="trash" size={20} color="#f44336" />
                  </TouchableOpacity>
                </View>
              </View>
              {employee.bio && (
                <Text style={[styles.employeeBio, { color: theme.colors.text + '80' }]}>{employee.bio}</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]} edges={['top']}>
          <View style={[styles.modalHeader, { backgroundColor: theme.colors.card }]}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={[styles.modalCancelButton, { color: theme.colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {editingEmployee ? 'Edit Employee' : 'Add Employee'}
            </Text>
            <TouchableOpacity onPress={handleSaveEmployee}>
              <Text style={[styles.modalSaveButton, { color: theme.colors.primary }]}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} contentContainerStyle={styles.modalContentContainer}>
            <View style={styles.photoSection}>
              <TouchableOpacity
                style={[styles.photoButton, { borderColor: theme.colors.border }]}
                onPress={handlePhotoPress}
              >
                {formData.photo_url ? (
                  <Image source={{ uri: formData.photo_url }} style={styles.photoPreview} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <IconSymbol name="camera.fill" size={32} color={theme.colors.text + '60'} />
                    <Text style={[styles.photoPlaceholderText, { color: theme.colors.text + '60' }]}>
                      Add Photo
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Name *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter employee name"
                placeholderTextColor={theme.colors.text + '60'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Role *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                value={formData.role}
                onChangeText={(text) => setFormData(prev => ({ ...prev, role: text }))}
                placeholder="e.g., Senior Stylist, Nail Technician"
                placeholderTextColor={theme.colors.text + '60'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Phone</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                placeholder="Enter phone number"
                placeholderTextColor={theme.colors.text + '60'}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Email</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="Enter email address"
                placeholderTextColor={theme.colors.text + '60'}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Bio</Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                value={formData.bio}
                onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
                placeholder="Tell us about this employee..."
                placeholderTextColor={theme.colors.text + '60'}
                multiline
                numberOfLines={4}
              />
            </View>
          </ScrollView>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  employeeCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  employeePhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  employeePhotoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  employeeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  employeeRole: {
    fontSize: 14,
    marginBottom: 4,
  },
  employeeContact: {
    fontSize: 12,
    marginBottom: 2,
  },
  employeeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  employeeBio: {
    fontSize: 14,
    lineHeight: 20,
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
  modalSaveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
  },
  modalContentContainer: {
    padding: 20,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPreview: {
    width: 116,
    height: 116,
    borderRadius: 58,
  },
  photoPlaceholder: {
    alignItems: 'center',
    gap: 8,
  },
  photoPlaceholderText: {
    fontSize: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
