export const compatibilityTable = {
  'O-': {
    receiveFrom: ['O-'],
    donateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  },
  'O+': {
    receiveFrom: ['O-', 'O+'],
    donateTo: ['O+', 'A+', 'B+', 'AB+'],
  },
  'A-': {
    receiveFrom: ['O-', 'A-'],
    donateTo: ['A-', 'A+', 'AB-', 'AB+'],
  },
  'A+': {
    receiveFrom: ['O-', 'O+', 'A-', 'A+'],
    donateTo: ['A+', 'AB+'],
  },
  'B-': {
    receiveFrom: ['O-', 'B-'],
    donateTo: ['B-', 'B+', 'AB-', 'AB+'],
  },
  'B+': {
    receiveFrom: ['O-', 'O+', 'B-', 'B+'],
    donateTo: ['B+', 'AB+'],
  },
  'AB-': {
    receiveFrom: ['O-', 'A-', 'B-', 'AB-'],
    donateTo: ['AB-', 'AB+'],
  },
  'AB+': {
    receiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    donateTo: ['AB+'],
  },
};

export function getCompatibility(type) {
  if (!type || type === 'Não sei') {
    return {
      receiveFrom: [],
      donateTo: [],
      explanation: 'Informe seu tipo sanguíneo para ver a compatibilidade personalizada.',
    };
  }
  return compatibilityTable[type] ?? compatibilityTable['O+'];
}

export function splitBloodType(type) {
  if (!type || type === 'Não sei') return { abo: 'indefinido', rh: 'indefinido' };
  const rh = type.endsWith('+') ? 'positivo' : 'negativo';
  const abo = type.replace('+', '').replace('-', '');
  return { abo, rh };
}
