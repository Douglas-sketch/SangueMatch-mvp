import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from './Card';
import Button from './Button';
import { colors, fonts, radius } from '../constants/theme';

export default function HemocenterCard({ center, onSchedule, compact = false }) {
  function openMaps() {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}&travelmode=driving`;
    Linking.openURL(url);
  }

  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <View style={styles.pin}>
          <MaterialCommunityIcons name="hospital-building" color="#fff" size={22} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{center.name}</Text>
          <Text style={styles.address}>{center.address}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.distance}>{center.distanceKm} km</Text>
            <Text style={[styles.status, center.isOpen ? styles.open : styles.closed]}>{center.isOpen ? 'Aberto' : 'Fechado'}</Text>
          </View>
          {!compact ? <Text style={styles.hours}>{center.hours}</Text> : null}
        </View>
      </View>
      {!compact ? (
        <View style={styles.actions}>
          <Button title="Agendar aqui" onPress={() => onSchedule?.(center)} style={{ flex: 1 }} />
          <Pressable onPress={openMaps} accessibilityRole="button" accessibilityLabel={`Como chegar em ${center.name}`} style={styles.routeButton}>
            <MaterialCommunityIcons name="navigation-variant" color={colors.secondary} size={20} />
            <Text style={styles.routeText}>Como chegar</Text>
          </Pressable>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 14 },
  top: { flexDirection: 'row', gap: 14 },
  pin: { width: 44, height: 44, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 18 },
  address: { fontFamily: fonts.regular, color: colors.muted, marginTop: 4, lineHeight: 19 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  distance: { fontFamily: fonts.bold, color: colors.secondary },
  status: { fontFamily: fonts.bold, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: 'hidden', fontSize: 12 },
  open: { color: colors.success, backgroundColor: 'rgba(76,175,133,0.12)' },
  closed: { color: colors.primary, backgroundColor: 'rgba(224,82,82,0.12)' },
  hours: { marginTop: 8, fontFamily: fonts.medium, color: colors.muted },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16, alignItems: 'center' },
  routeButton: { minHeight: 54, paddingHorizontal: 14, borderRadius: radius.lg, backgroundColor: '#F5E8E6', flexDirection: 'row', alignItems: 'center', gap: 8 },
  routeText: { fontFamily: fonts.bold, color: colors.secondary },
});
