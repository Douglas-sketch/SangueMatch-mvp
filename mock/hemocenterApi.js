const HEMOCENTROS = [
  {
    id: 'h1',
    nome: 'HEMOPE Recife',
    cidade: 'Recife',
    endereco: 'R. Joaquim Nabuco, 171',
    telefone: '(81) 3182-4600',
  },
  {
    id: 'h2',
    nome: 'HemoRio',
    cidade: 'Rio de Janeiro',
    endereco: 'R. Frei Caneca, 8',
    telefone: '(21) 3233-5950',
  },
];

const URGENCIAS = [
  { tipo: 'O-', nivel: 'crítico' },
  { tipo: 'A-', nivel: 'alto' },
];

const DISPONIBILIDADE = [
  { hemocentroId: 'h1', hemocentro: 'HEMOPE Recife', slots: ['08:00', '10:00', '14:00'] },
  { hemocentroId: 'h2', hemocentro: 'HemoRio', slots: ['09:00', '11:30', '16:00'] },
];

const NETWORK_DELAY_MS = 120;

function delay(ms = NETWORK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function ensureRequired(payload, fields) {
  const missing = fields.filter((field) => !payload?.[field]);
  if (missing.length > 0) {
    const error = new Error(`Campos obrigatórios ausentes: ${missing.join(', ')}`);
    error.code = 'VALIDATION_ERROR';
    throw error;
  }
}

export async function getHemocentros() {
  await delay();
  return clone(HEMOCENTROS);
}

export async function getUrgencias() {
  await delay();
  return clone(URGENCIAS);
}

export async function getDisponibilidade(hemocentroId) {
  await delay();

  if (!hemocentroId) return clone(DISPONIBILIDADE);

  const filtered = DISPONIBILIDADE.filter((item) => item.hemocentroId === hemocentroId);
  return clone(filtered);
}

export async function postAgendamento(payload = {}) {
  await delay();
  ensureRequired(payload, ['hemocentroId', 'date', 'time', 'donorName']);

  const agendamento = {
    ok: true,
    id: `ag-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...payload,
  };

  return agendamento;
}
