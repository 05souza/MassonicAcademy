const fs = require('fs');

// 1. Update companheiroQuestions.ts
let cContent = fs.readFileSync('./src/data/companheiroQuestions.ts', 'utf8');

const replacements = [
  {
    id: 'q2-23',
    newBlock: `  {
    id: 'q2-23',
    questionText: 'A que alude a lenda da Escada em Caracol? Como a interpretais?',
    category: 'Filosofia e Doutrina',
    options: [
      'Ao esforço gradual do Companheiro para ascender na busca da sabedoria, das artes liberais e alcançar a Câmara do Meio.',
      'À subida literal ao topo do Templo para vigiar os trabalhadores.',
      'À sucessão temporal dos Reis de Israel e suas linhagens dinásticas.',
      'Ao caminho percorrido pelos profanos durante as viagens da iniciação.'
    ],
    correctOptionIndex: 0,
    explanation: 'A Escada em Caracol simboliza a jornada difícil e gradativa do Companheiro, que sobe pelos degraus do conhecimento humano e das artes liberais para atingir a iluminação na Câmara do Meio.'
  }`
  },
  {
    id: 'q2-28',
    newBlock: `  {
    id: 'q2-28',
    questionText: 'O que é, em vosso entender, ser Companheiro?',
    category: 'Filosofia e Doutrina',
    options: [
      'É ser um auxiliar passivo dos mestres sem voz nas decisões.',
      'É aprender a usar o esquadro sem estudar os outros instrumentos.',
      'É ser um trabalhador ativo que domina o intelecto, estuda as ciências e serve à fraternidade na edificação moral.',
      'É frequentar as sessões com assiduidade sem compromisso de estudo.'
    ],
    correctOptionIndex: 2,
    explanation: 'Ser Companheiro Maçom significa atuar ativamente no desbaste da pedra e na edificação moral, aplicando a inteligência e o estudo das ciências e artes liberais.'
  }`
  },
  {
    id: 'q2-30',
    newBlock: `  {
    id: 'q2-30',
    questionText: 'Qual é o vosso conceito de Vida?',
    category: 'Filosofia e Doutrina',
    options: [
      'É o sopro divino na matéria.',
      'É um ciclo puramente biológico sem transcendência espiritual.',
      'É a manifestação sagrada da criação, unindo a matéria e o espírito para o constante aperfeiçoamento moral.',
      'É o acúmulo temporário de bens materiais e glórias profanas.'
    ],
    correctOptionIndex: 2,
    explanation: 'Na filosofia maçônica, a Vida é concebida como a manifestação do Grande Arquiteto do Universo, onde o espírito dinamiza a matéria em busca da constante evolução.'
  }`
  },
  {
    id: 'q2-31',
    newBlock: `  {
    id: 'q2-31',
    questionText: 'Como concebeis o Tetragrama?',
    category: 'Filosofia e Doutrina',
    options: [
      'Como o nome secreto da Ordem.',
      'Como as quatro provas da iniciação.',
      'Como a representação sagrada do nome inefável do Criador (YHVH), simbolizando a essência e a harmonia universal.',
      'Como a união simples dos quatro elementos físicos da natureza.'
    ],
    correctOptionIndex: 2,
    explanation: 'O Tetragrama (YHVH) representa o nome inefável de Deus, simbolizando a eternidade, a causa primeira e a harmonia sublime de todo o Universo.'
  }`
  },
  {
    id: 'q2-33',
    newBlock: `  {
    id: 'q2-33',
    questionText: 'Dai vossa interpretação esotérica do Esquadro.',
    category: 'Filosofia e Doutrina',
    options: [
      'É a ferramenta exclusiva de punição do Venerável Mestre.',
      'É a medida do mundo físico desprovida de sentido moral.',
      'Simboliza a retidão de caráter, a equidade e a justa ação do homem pautada na moral e na consciência.',
      'É o equilíbrio entre o vertical e o horizontal apenas nas construções profanas.'
    ],
    correctOptionIndex: 2,
    explanation: 'Esotericamente, o Esquadro é o emblema da retidão moral, ensinando que nossas ações em relação ao próximo devem ser sempre pautadas pela justiça e equidade.'
  }`
  },
  {
    id: 'q2-36',
    newBlock: `  {
    id: 'q2-36',
    questionText: 'Analisai a luz da numerologia o simbolismo numérico do Grau de Companheiro.',
    category: 'Filosofia e Doutrina',
    options: [
      'O número 3 rege o Grau de Companheiro, ligado às 3 pancadas e 3 anos.',
      'O número 7 rege o Grau de Companheiro, ligado aos 7 planetas clássicos.',
      'O número 5 rege o Grau de Companheiro, simbolizando os 5 sentidos, 5 degraus, 5 ordens de arquitetura e a Estrela Pentagramática.',
      'O número 12 rege o Grau de Companheiro, representando as 12 tribos.'
    ],
    correctOptionIndex: 2,
    explanation: 'A simbologia numérica central do Grau de Companheiro é o número 5 (cinco sentidos, cinco ordens de arquitetura, cinco degraus da escada e a Estrela Rutilante de 5 pontas).'
  }`
  },
  {
    id: 'q2-59',
    newBlock: `  {
    id: 'q2-59',
    questionText: 'Por que, esotericamente, no vosso entender, o Cobridor tem assento junto à porta do Templo?',
    category: 'Filosofia e Doutrina',
    options: [
      'Para impedir a entrada de correntes de ar frio.',
      'Porque o guarda deve estar no limite entre o recinto sagrado e o mundo profano, protegendo a Loja contra pensamentos indiscretos.',
      'Para efetuar o recolhimento das contribuições financeiras na entrada.',
      'Para conferir as luvas dos irmãos que chegam atrasados.'
    ],
    correctOptionIndex: 1,
    explanation: 'O Cobridor guarda a fronteira sagrada do Templo, garantindo a cobrição dos trabalhos contra interferências e contaminações do mundo profano.'
  }`
  },
  {
    id: 'q2-60',
    newBlock: `  {
    id: 'q2-60',
    questionText: 'Dai vossa interpretação do 2° Grau e expressai vossos comentários sobre o mesmo.',
    category: 'Filosofia e Doutrina',
    options: [
      'É um grau de transição administrativa sem importância ritualística.',
      'É a fase de estudo das ciências, artes liberais e aprimoramento do trabalho para a elevação do espírito.',
      'É o grau que autoriza o Obreiro a presidir administrativamente a Loja.',
      'É uma etapa de repetição dos símbolos aprendidos no Primeiro Grau.'
    ],
    correctOptionIndex: 1,
    explanation: 'O Segundo Grau (Companheiro) foca no trabalho consciente, no aprimoramento do intelecto através das artes liberais e no estudo da natureza para servir à humanidade.'
  }`
  }
];

replacements.forEach(r => {
  const reg = new RegExp(`{\\s*id:\\s*'${r.id}'[\\s\\S]*?}`, 'g');
  cContent = cContent.replace(reg, r.newBlock);
});

fs.writeFileSync('./src/data/companheiroQuestions.ts', cContent, 'utf8');
console.log('companheiroQuestions.ts updated successfully.');

// 2. Update aprendizQuestions.ts
let aContent = fs.readFileSync('./src/data/aprendizQuestions.ts', 'utf8');

const distractors = [
  'Uso exclusivo nas sessões magnas de posse.',
  'Instrução reservada ao grau de Mestre.',
  'Símbolo de autoridade profana exterior.',
  'Prerrogativa exclusiva do Venerável Mestre.',
  'Regra específica de ritos não reconhecidos.',
  'Símbolo do trabalho no mundo exterior profano.',
  'Atribuição do Guarda do Templo durante a cobrição.',
  'Representação da iluminação interior na Câmara de Reflexões.',
  'Atividade desempenhada exclusivamente no encerramento dos trabalhos.',
  'Instrução ministrada aos neófitos antes da iniciação.'
];

let dIdx = 0;
aContent = aContent.replace(/'Opinião do Obreiro\.'/g, () => {
  const replacement = distractors[dIdx % distractors.length];
  dIdx++;
  return `'${replacement}'`;
});

fs.writeFileSync('./src/data/aprendizQuestions.ts', aContent, 'utf8');
console.log(`aprendizQuestions.ts updated ${dIdx} occurrences successfully.`);
