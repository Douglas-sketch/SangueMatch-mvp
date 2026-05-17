import { calculateDistanceKm } from '../utils/distance';

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const FALLBACK_USER_LOCATION = {
  latitude: -8.0476,
  longitude: -34.8770,
};

export const FALLBACK_HEMOCENTERS = [
  {
    id: 'hemope-recife',
    name: 'HEMOPE Recife',
    address: 'Rua Joaquim Nabuco, 171 - Graças, Recife - PE',
    latitude: -8.05062,
    longitude: -34.89531,
    phone: '(81) 3182-4600',
    hours: 'Seg a sáb, 07h15 às 18h30',
    simulatedOpen: true,
  },
  {
    id: 'hemope-casa-amarela',
    name: 'HEMOPE Casa Amarela',
    address: 'Av. Norte Miguel Arraes de Alencar, Casa Amarela, Recife - PE',
    latitude: -8.02193,
    longitude: -34.91827,
    phone: '(81) 3182-4600',
    hours: 'Seg a sex, 08h às 17h',
    simulatedOpen: true,
  },
  {
    id: 'hc-ufpe',
    name: 'Hospital das Clínicas UFPE',
    address: 'Av. Prof. Moraes Rego, S/N - Cidade Universitária, Recife - PE',
    latitude: -8.05141,
    longitude: -34.95134,
    phone: '(81) 2126-3633',
    hours: 'Seg a sex, 07h às 17h',
    simulatedOpen: false,
  },
];

export function getFallbackHemocenters(userLocation = FALLBACK_USER_LOCATION) {
  return FALLBACK_HEMOCENTERS.map((center) => ({
    ...center,
    distanceKm: calculateDistanceKm(userLocation, { latitude: center.latitude, longitude: center.longitude }),
    isOpen: center.simulatedOpen,
    source: 'fallback',
  })).sort((a, b) => a.distanceKm - b.distanceKm);
}

export const DEMO_DONATIONS = [
  {
    id: 'don-2025-04-22',
    local: 'HEMOPE Recife',
    date: '2025-04-22T10:00:00.000Z',
    status: 'Confirmada',
  },
  {
    id: 'don-2025-08-19',
    local: 'HEMOPE Recife',
    date: '2025-08-19T09:30:00.000Z',
    status: 'Confirmada',
  },
  {
    id: 'don-2026-01-28',
    local: 'Hospital das Clínicas UFPE',
    date: '2026-01-28T13:00:00.000Z',
    status: 'Confirmada',
  },
];

export const BADGES = [
  { id: 'first', title: '1ª doação', description: 'Começou sua jornada', emoji: '🩸', rule: ({ donations }) => donations >= 1 },
  { id: 'hero', title: 'Herói', description: 'Salvou 8 vidas', emoji: '🦸', rule: ({ lives }) => lives >= 8 },
  { id: 'streak', title: 'Sequência', description: 'Doou em meses seguidos', emoji: '🔥', rule: ({ streak }) => streak >= 2 },
  { id: 'five', title: '5 doações', description: 'Consistência real', emoji: '🏅', rule: ({ donations }) => donations >= 5 },
  { id: 'rare', title: 'Tipo raro', description: 'Sangue em destaque', emoji: '💎', rule: ({ bloodType }) => ['O-', 'AB-', 'B-'].includes(bloodType) },
  { id: 'refer', title: 'Indicou 3', description: 'Chamou amigos', emoji: '🤝', rule: ({ referrals }) => referrals >= 3 },
  { id: 'year', title: '1 ano', description: 'Um ano ajudando', emoji: '📅', rule: ({ firstDonationDays }) => firstDonationDays >= 365 },
  { id: 'legend', title: 'Lenda', description: '20 vidas salvas', emoji: '👑', rule: ({ lives }) => lives >= 20 },
];

const urgencyPresets = [
  [
    { type: 'O-', level: 'crítico' },
    { type: 'A+', level: 'baixo' },
    { type: 'B-', level: 'atenção' },
    { type: 'AB+', level: 'estável' },
  ],
  [
    { type: 'O+', level: 'baixo' },
    { type: 'A-', level: 'crítico' },
    { type: 'AB-', level: 'atenção' },
    { type: 'B+', level: 'estável' },
  ],
  [
    { type: 'A+', level: 'atenção' },
    { type: 'O-', level: 'crítico' },
    { type: 'B+', level: 'baixo' },
    { type: 'AB-', level: 'crítico' },
  ],
];

export function createSessionUrgencies() {
  const index = Math.floor(Date.now() / 1000 / 60) % urgencyPresets.length;
  return urgencyPresets[index].map((item, position) => ({
    ...item,
    id: `${item.type}-${position}`,
    updatedAt: new Date().toISOString(),
  }));
}

export const TIME_SLOTS = [
  { time: '07:00', full: false },
  { time: '08:30', full: false },
  { time: '10:00', full: false },
  { time: '11:30', full: true },
  { time: '13:00', full: false },
  { time: '14:30', full: false },
];
