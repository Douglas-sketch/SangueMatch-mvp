import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function configureNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('lembretes', {
      name: 'Lembretes de doação',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E05252',
    });
  }
}

export async function requestNotificationPermission() {
  await configureNotifications();

  const current = await Notifications.getPermissionsAsync();
  if (current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });

  return requested.granted || requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

export async function scheduleDonationReminder({ date, centerName }) {
  const granted = await requestNotificationPermission();
  if (!granted) return null;

  const triggerDate = new Date(date);
  if (Number.isNaN(triggerDate.getTime()) || triggerDate <= new Date()) return null;

  const trigger =
    Platform.OS === 'android'
      ? {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          channelId: 'lembretes',
          date: triggerDate,
        }
      : {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        };

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Sua doação é amanhã 🩸',
      body: `Lembrete do SangueMatch: você tem agendamento em ${centerName}. Hidrate-se e leve documento com foto.`,
      sound: true,
    },
    trigger,
  });
}
