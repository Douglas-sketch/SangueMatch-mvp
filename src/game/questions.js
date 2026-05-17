export const QUESTIONS = Array.from({ length: 20 }).map((_, i) => ({
  id: `q-${i+1}`,
  question: `Pergunta educativa #${i+1}: qual a regra correta sobre doação de sangue?`,
  options: ['Alternativa A', 'Alternativa B', 'Alternativa C', 'Alternativa D'],
  answer: i % 4,
  explanation: 'A resposta correta segue critérios de elegibilidade e compatibilidade ABO/Rh.'
}));

export const BLOOD_CLASSES = {
  'O-': { name: 'Herói Universal', skill: 'Escudo que protege qualquer aliado' },
  'O+': { name: 'Guardião', skill: 'Cura em área' },
  'A-': { name: 'Estrategista', skill: 'Visão expandida do mapa' },
  'A+': { name: 'Aliado', skill: 'Bônus de XP em missões em grupo' },
  'B-': { name: 'Explorador', skill: 'Descobre missões secretas' },
  'B+': { name: 'Resistente', skill: 'HP dobrado em missões difíceis' },
  'AB-': { name: 'Sábio', skill: 'Respostas corretas valem XP duplo' },
  'AB+': { name: 'Receptor Mestre', skill: 'Absorve poderes de aliados' },
};
