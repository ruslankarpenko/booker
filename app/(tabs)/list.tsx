
import React, { useState } from "react";
import { Stack } from "expo-router";
import { View, StyleSheet, Platform, Alert } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import EstablishmentList from "@/components/EstablishmentList";
import EstablishmentDetails from "@/components/EstablishmentDetails";
import { mockEstablishments } from "@/data/mockEstablishments";
import { Establishment } from "@/types/establishment";
import { colors } from "@/styles/commonStyles";

export default function ListScreen() {
  const theme = useTheme();
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);

  const handleEstablishmentPress = (establishment: Establishment) => {
    console.log('Selected establishment:', establishment.name);
    setSelectedEstablishment(establishment);
  };

  const handleBackPress = () => {
    console.log('Back pressed');
    setSelectedEstablishment(null);
  };

  const handleBookAppointment = (establishment: Establishment) => {
    console.log('Book appointment for:', establishment.name);
    Alert.alert(
      "Book Appointment",
      `Would you like to book an appointment at ${establishment.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Book Now", onPress: () => console.log('Booking confirmed') }
      ]
    );
  };

  const renderHeaderRight = () => (
    <View style={styles.headerButtonContainer}>
      <IconSymbol name="magnifyingglass" color={colors.text} size={20} />
    </View>
  );

  const renderHeaderLeft = () => (
    <View style={styles.headerButtonContainer}>
      <IconSymbol name="line.3.horizontal" color={colors.text} size={20} />
    </View>
  );

  if (selectedEstablishment) {
    return (
      <>
        {Platform.OS === 'ios' && (
          <Stack.Screen
            options={{
              title: "",
              headerShown: false,
            }}
          />
        )}
        <EstablishmentDetails
          establishment={selectedEstablishment}
          onBack={handleBackPress}
          onBookAppointment={handleBookAppointment}
        />
      </>
    );
  }

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "All Services",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EstablishmentList 
          establishments={mockEstablishments}
          onEstablishmentPress={handleEstablishmentPress}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButtonContainer: {
    padding: 6,
  },
});
