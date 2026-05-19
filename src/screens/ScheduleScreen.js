import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AnimatedView from '../components/AnimatedView';
import Button from '../components/Button';
import CalendarStrip from '../components/CalendarStrip';
import Card from '../components/Card';
import { TIME_SLOTS } from '../constants/mockData';
import { colors, fonts, radius } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { appointmentNotificationDate, formatDate, getNextAvailableDays } from '../utils/date';
import { scheduleDonationReminder } from '../utils/notifications';

export default function ScheduleScreen({ route, navigation }) {
  const { saveAppointment, addDonation } = useApp();
  const center = route.params?.center;
  const firstAvailable = useMemo(() => getNextAvailableDays(14).find((day) => day.available)?.id, []);
  const [selectedDate, setSelectedDate] = useState(firstAvailable);
  const [selectedTime, setSelectedTime] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  async function confirm() {
    if (!center || !selectedDate || !selectedTime) return;
    setLoading(true);
    const reminderAt = appointmentNotificationDate(selectedDate);
    const notificationId = await scheduleDonationReminder({ date: reminderAt, centerName: center.name });
    const appointment = {
      id: `app-${Date.now()}`,
      center,
      date: selectedDate,
      time: selectedTime,
      status: 'Confirmada',
      reminderAt: reminderAt.toISOString(),
      notificationId,
    };
    await saveAppointment(appointment);
    await addDonation({
      local: center.name,
      date: new Date(`${selectedDate}T${selectedTime}:00`).toISOString(),
      status: 'Confirmada',
    });
    setLoading(false);
    setModalVisible(true);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AnimatedView>
        <Card>
          <Text style={styles.kicker}>Local escolhido</Text>
          <Text style={styles.title}>{center?.name || 'Escolha um hemocentro pelo mapa'}</Text>
          <Text style={styles.address}>{center?.address}</Text>
        </Card>
      </AnimatedView>

      <AnimatedView delay={80}>
        <Text style={styles.section}>Escolha um dia</Text>
        <CalendarStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </AnimatedView>

      <AnimatedView delay={140}>
        <Text style={styles.section}>Escolha um horário</Text>
        <View style={styles.timeGrid}>
          {TIME_SLOTS.map((slot) => {
            const active = selectedTime === slot.time;
            return (
              <Pressable
                key={slot.time}
                disabled={slot.full}
                onPress={() => setSelectedTime(slot.time)}
                accessibilityRole="button"
                accessibilityLabel={`${slot.time}, ${slot.full ? 'horário cheio' : 'disponível'}`}
                style={({ pressed }) => [styles.time, active && styles.timeActive, slot.full && styles.timeFull, pressed && styles.pressed]}
              >
                <Text style={[styles.timeText, active && styles.timeTextActive]}>{slot.time}</Text>
                {slot.full ? <Text style={styles.fullText}>cheio</Text> : null}
              </Pressable>
            );
          })}
        </View>
      </AnimatedView>

      <Button title="Confirmar agendamento" accessibilityLabel="Confirmar agendamento" accessibilityHint="Confirma sua doação e agenda um lembrete" onPress={confirm} disabled={!center || !selectedDate || !selectedTime} loading={loading} style={styles.button} />

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <AnimatedView style={styles.modalCard} from={40}>
            <View style={styles.successIcon}>
              <MaterialCommunityIcons name="check-bold" color="#fff" size={42} />
            </View>
            <Text style={styles.modalTitle}>Agendamento confirmado!</Text>
            <Text style={styles.modalText}>{center?.name} • {formatDate(`${selectedDate}T00:00:00`)} às {selectedTime}</Text>
            <Text style={styles.modalHint}>Também agendei um lembrete para o dia anterior às 18h, se as notificações estiverem permitidas.</Text>
            <Button title="Ver checklist" variant="ghost" onPress={() => { setModalVisible(false); navigation.navigate('PreDonationChecklist'); }} />
            <Button title="Voltar para Home" onPress={() => { setModalVisible(false); navigation.navigate('Main', { screen: 'Home' }); }} />
          </AnimatedView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 120 },
  kicker: { fontFamily: fonts.bold, color: colors.primary, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 26, marginTop: 4 },
  address: { fontFamily: fonts.regular, color: colors.muted, marginTop: 6, lineHeight: 21 },
  section: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 24, marginTop: 24, marginBottom: 12 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  time: { width: '30.8%', minHeight: 66, borderRadius: radius.lg, backgroundColor: '#fff', borderWidth: 0.5, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  timeActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeFull: { opacity: 0.38 },
  timeText: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 20 },
  timeTextActive: { color: '#fff' },
  fullText: { fontFamily: fonts.bold, color: colors.primary, fontSize: 11, marginTop: 2 },
  pressed: { opacity: 0.85 },
  button: { marginTop: 28 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15,25,35,0.58)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#fff', borderRadius: 28, padding: 24, width: '100%', alignItems: 'center' },
  successIcon: { width: 84, height: 84, borderRadius: 28, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  modalTitle: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 28, textAlign: 'center' },
  modalText: { fontFamily: fonts.bold, color: colors.primary, textAlign: 'center', marginTop: 8 },
  modalHint: { fontFamily: fonts.regular, color: colors.muted, textAlign: 'center', lineHeight: 21, marginVertical: 18 },
});
