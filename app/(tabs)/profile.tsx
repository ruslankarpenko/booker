
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";
import { router, Stack } from "expo-router";
import { useAppContext } from "@/contexts/AppContext";
import { t } from "@/utils/i18n";
import { supabase } from "@/lib/supabase";
import { Establishment } from "@/types/establishment";

export default function ProfileScreen() {
  const theme = useTheme();
  const { userProfile, isLoading } = useAppContext();
  const [myEstablishments, setMyEstablishments] = useState<Establishment[]>([]);
  const [loadingEstablishments, setLoadingEstablishments] = useState(true);

  useEffect(() => {
    loadMyEstablishments();
  }, []);

  const loadMyEstablishments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoadingEstablishments(false);
        return;
      }

      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error loading establishments:', error);
        return;
      }

      setMyEstablishments(data || []);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoadingEstablishments(false);
    }
  };

  const renderHeaderRight = () => (
    <TouchableOpacity 
      onPress={() => router.push('/settings')}
      style={{ marginRight: 16 }}
    >
      <IconSymbol 
        name="gearshape.fill" 
        size={24} 
        color={theme.colors.text}
      />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Stack.Screen
        options={{
          title: t('profile'),
          headerShown: true,
          headerRight: renderHeaderRight,
          headerStyle: { backgroundColor: theme.colors.card },
          headerTintColor: theme.colors.text,
          headerTitleStyle: { color: theme.colors.text },
        }}
      />
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
      >
        <GlassView style={[
          styles.profileHeader,
          Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
        ]} glassEffectStyle="regular">
          {userProfile?.photo ? (
            <Image source={{ uri: userProfile.photo }} style={styles.profileImage} />
          ) : (
            <IconSymbol name="person.circle.fill" size={80} color={theme.colors.primary} />
          )}
          
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {userProfile?.firstName && userProfile?.lastName 
              ? `${userProfile.firstName} ${userProfile.lastName}`
              : 'John Doe'
            }
          </Text>
          
          {userProfile?.email && (
            <Text style={[styles.email, { color: theme.dark ? '#98989D' : '#666' }]}>
              {userProfile.email}
            </Text>
          )}
        </GlassView>

        <GlassView style={[
          styles.section,
          Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
        ]} glassEffectStyle="regular">
          {userProfile?.phone && (
            <View style={styles.infoRow}>
              <IconSymbol name="phone.fill" size={20} color={theme.dark ? '#98989D' : '#666'} />
              <Text style={[styles.infoText, { color: theme.colors.text }]}>
                {userProfile.phone}
              </Text>
            </View>
          )}
          
          {userProfile?.city && (
            <View style={styles.infoRow}>
              <IconSymbol name="location.fill" size={20} color={theme.dark ? '#98989D' : '#666'} />
              <Text style={[styles.infoText, { color: theme.colors.text }]}>
                {userProfile.city}
              </Text>
            </View>
          )}
          
          {userProfile?.age && (
            <View style={styles.infoRow}>
              <IconSymbol name="calendar" size={20} color={theme.dark ? '#98989D' : '#666'} />
              <Text style={[styles.infoText, { color: theme.colors.text }]}>
                {userProfile.age} years old
              </Text>
            </View>
          )}
          
          {!userProfile?.phone && !userProfile?.city && !userProfile?.age && (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                No additional information available.
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.dark ? '#98989D' : '#666' }]}>
                Tap the settings button to add your details.
              </Text>
            </View>
          )}
        </GlassView>

        {/* My Establishments Section */}
        <GlassView style={[
          styles.section,
          Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
        ]} glassEffectStyle="regular">
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              My Establishments
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/add-establishment')}
              style={styles.addButton}
            >
              <IconSymbol name="plus" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {loadingEstablishments ? (
            <Text style={[styles.loadingText, { color: theme.colors.text + '80' }]}>
              Loading establishments...
            </Text>
          ) : myEstablishments.length === 0 ? (
            <View style={styles.emptyEstablishments}>
              <IconSymbol name="building.2.fill" size={32} color={theme.colors.text + '40'} />
              <Text style={[styles.emptyEstablishmentsText, { color: theme.colors.text + '80' }]}>
                No establishments yet
              </Text>
              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => router.push('/add-establishment')}
              >
                <Text style={styles.createButtonText}>Create Your First Establishment</Text>
              </TouchableOpacity>
            </View>
          ) : (
            myEstablishments.map((establishment) => (
              <TouchableOpacity
                key={establishment.id}
                style={[styles.establishmentItem, { backgroundColor: theme.colors.background }]}
                onPress={() => router.push({
                  pathname: '/manage-employees',
                  params: { establishmentId: establishment.id }
                })}
              >
                <View style={styles.establishmentInfo}>
                  <Text style={[styles.establishmentName, { color: theme.colors.text }]}>
                    {establishment.name}
                  </Text>
                  <Text style={[styles.establishmentType, { color: theme.colors.text + '80' }]}>
                    {establishment.type.replace('_', ' ')}
                  </Text>
                  <Text style={[styles.establishmentAddress, { color: theme.colors.text + '60' }]}>
                    {establishment.address}
                  </Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color={theme.colors.text + '40'} />
              </TouchableOpacity>
            ))
          )}
        </GlassView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100, // Extra padding for floating tab bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  profileHeader: {
    alignItems: 'center',
    borderRadius: 12,
    padding: 32,
    marginBottom: 16,
    gap: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
  },
  section: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    padding: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyEstablishments: {
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  emptyEstablishmentsText: {
    fontSize: 14,
    textAlign: 'center',
  },
  createButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  establishmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  establishmentInfo: {
    flex: 1,
  },
  establishmentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  establishmentType: {
    fontSize: 14,
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  establishmentAddress: {
    fontSize: 12,
  },
});
