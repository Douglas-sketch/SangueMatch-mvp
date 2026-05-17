import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HemocenterCard from '../components/HemocenterCard';
import { BLOOD_TYPES } from '../constants/mockData';
import { colors, fonts, radius } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useHemocenters } from '../hooks/useHemocenters';

export default function MapScreen({ navigation }) {
  const { location, urgencies } = useApp();
  const { centers, loading, usingFallback } = useHemocenters(true);
  const [filter, setFilter] = useState('Todos');

  const region = useMemo(() => ({
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.12,
    longitudeDelta: 0.12,
  }), [location]);

  const urgentTypes = new Set(urgencies.filter((item) => item.level !== 'estável').map((item) => item.type));

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region} showsUserLocation showsMyLocationButton>
        {centers.map((center) => (
          <Marker key={center.id} coordinate={{ latitude: center.latitude, longitude: center.longitude }} title={center.name} description={`${center.distanceKm} km`} pinColor={colors.primary} />
        ))}
      </MapView>

      <View style={styles.bottomSheet}>
        <View style={styles.handle} />
        <View style={styles.sheetHeader}>
          <View>
            <Text style={styles.title}>Hemocentros próximos</Text>
            <Text style={styles.subtitle}>{usingFallback ? 'Fallback Recife/PE ativo' : 'Resultados por distância'}</Text>
          </View>
          {loading ? <ActivityIndicator color={colors.primary} /> : <MaterialCommunityIcons name="map-search" color={colors.primary} size={28} />}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {['Todos', ...BLOOD_TYPES].map((type) => {
            const active = filter === type;
            const urgent = urgentTypes.has(type);
            return (
              <Pressable key={type} onPress={() => setFilter(type)} accessibilityRole="button" accessibilityLabel={`Filtro ${type}`} style={[styles.filter, active && styles.filterActive, urgent && styles.filterUrgent]}>
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{type}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {centers.map((center) => <HemocenterCard key={center.id} center={center} onSchedule={() => navigation.navigate('Schedule', { center })} />)}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  map: { flex: 1 },
  bottomSheet: { position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '55%', backgroundColor: colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 18, borderWidth: 0.5, borderColor: colors.line },
  handle: { alignSelf: 'center', width: 54, height: 5, borderRadius: 99, backgroundColor: 'rgba(15,25,35,0.18)', marginBottom: 12 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 24 },
  subtitle: { fontFamily: fonts.regular, color: colors.muted, marginTop: 2 },
  filters: { gap: 8, paddingVertical: 14 },
  filter: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.md, backgroundColor: '#fff', borderWidth: 0.5, borderColor: colors.line },
  filterActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  filterUrgent: { borderColor: colors.primary },
  filterText: { fontFamily: fonts.bold, color: colors.secondary },
  filterTextActive: { color: '#fff' },
  list: { paddingBottom: 22 },
});
