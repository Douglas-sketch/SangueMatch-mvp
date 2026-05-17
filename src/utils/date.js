export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function formatDate(dateValue) {
  const date = new Date(dateValue);
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

export function formatWeekday(dateValue) {
  const date = new Date(dateValue);
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }).format(date);
}

export function daysBetween(a, b) {
  const dateA = new Date(a);
  const dateB = new Date(b);
  const utcA = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
  const utcB = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());
  return Math.floor((utcB - utcA) / 86400000);
}

export function calculateNextDonationStatus(donations = []) {
  if (!donations.length) {
    return { eligible: true, daysLeft: 0, nextDate: null, label: 'Apto para doar' };
  }
  const lastDonation = [...donations].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const lastDate = new Date(lastDonation.date);
  const nextDate = new Date(lastDate);
  // MVP usa 90 dias como intervalo conservador para todos os perfis.
  nextDate.setDate(nextDate.getDate() + 90);
  const diff = Math.max(0, daysBetween(new Date(), nextDate));
  return {
    eligible: diff === 0,
    daysLeft: diff,
    nextDate: nextDate.toISOString(),
    label: diff === 0 ? 'Apto para doar' : `Próxima doação em ${diff} dias`,
  };
}

export function getNextAvailableDays(count = 14) {
  const days = [];
  const today = new Date();
  for (let i = 1; days.length < count; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const weekday = date.getDay();
    days.push({
      id: date.toISOString().slice(0, 10),
      date,
      label: formatWeekday(date),
      available: weekday !== 0 && weekday !== 6,
    });
  }
  return days;
}

export function appointmentNotificationDate(dateISO) {
  const date = new Date(`${dateISO}T18:00:00`);
  date.setDate(date.getDate() - 1);
  return date;
}
