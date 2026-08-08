import { QuestionnaireQuestion } from '../types';

export const APRENDIZ_QUESTIONS: QuestionnaireQuestion[] = [
  {
    id: 'q1-1',
    questionText: 'Quantos sinais existem no grau de Aprendiz?',
    category: 'Ritualística e Símbolos',
    options: [
      'Apenas um sinal, o de saudação.',
      'Três sinais: de ordem, de saudação e de reconhecimento.',
      'Dois sinais: o sinal de ordem (ou gutural) e o sinal de saudação.',
      'Quatro sinais, incluindo o de socorro.'
    ],
    correctOptionIndex: 2,
    explanation: 'No grau de Aprendiz Adonhiramita existem dois sinais: o sinal de ordem (ou gutural) e o sinal de saudação.'
  },
  {
    id: 'q1-2',
    questionText: 'Qual a posição dos pés quando em posição de ordem?',
    category: 'Ritualística e Símbolos',
    options: [
      'Pés paralelos e unidos.',
      'Pé direito à frente do esquerdo em linha reta.',
      'Os pés formam uma esquadria.',
      'Calcanhares unidos com as pontas voltadas para fora em 45 graus.'
    ],
    correctOptionIndex: 2,
    explanation: 'No grau de Aprendiz, quando em posição de ordem, os pés formam uma esquadria.'
  },
  {
    id: 'q1-3',
    questionText: 'Quantas palavras existem no grau de Aprendiz?',
    category: 'Ritualística e Símbolos',
    options: [
      'Apenas a Palavra Sagrada.',
      'Duas: a Sagrada e a Semestral.',
      'Três: a Palavra Sagrada, a de Passe e a Semestral.',
      'Quatro, incluindo a palavra de reconhecimento.'
    ],
    correctOptionIndex: 2,
    explanation: 'Existem três palavras no grau de Aprendiz: a Palavra Sagrada, a de Passe e a Semestral.'
  },
  {
    id: 'q1-4',
    questionText: 'O que significa a Palavra Sagrada?',
    category: 'Filosofia e Doutrina',
    options: [
      'Que a Força reside no Mestre.',
      'Que a Sabedoria está em Deus; e que a Sabedoria é um dos atributos da Divindade.',
      'A Beleza da Criação Universal.',
      'Uso exclusivo nas sessões magnas de posse.'
    ],
    correctOptionIndex: 1,
    explanation: 'A Palavra Sagrada significa que a Sabedoria está em Deus; e que a Sabedoria é um dos atributos da Divindade.'
  },
  {
    id: 'q1-5',
    questionText: 'Para que serve a Palavra Semestral?',
    category: 'História e Legislação',
    options: [
      'Para identificar o Venerável Mestre.',
      'Para abrir os trabalhos no Altar.',
      'Para que se certifique a regularidade dos Irmãos (especialmente visitantes).',
      'Para marcar o início do ano maçônico.'
    ],
    correctOptionIndex: 2,
    explanation: 'A Palavra Semestral serve para certificar a regularidade dos Irmãos, especialmente visitantes.'
  },
  {
    id: 'q1-6',
    questionText: 'Onde é permitido ficar à ordem?',
    category: 'Ritualística e Símbolos',
    options: [
      'Em qualquer reunião de amigos.',
      'Somente no Templo ou em Loja aberta.',
      'Em eventos públicos da Maçonaria.',
      'Instrução reservada ao grau de Mestre.'
    ],
    correctOptionIndex: 1,
    explanation: 'É permitido ficar à ordem somente no Templo ou em Loja aberta.'
  },
  {
    id: 'q1-7',
    questionText: 'Qual a forma da Loja?',
    category: 'Ritualística e Símbolos',
    options: [
      'Um quadrado perfeito.',
      'Um círculo representando o Universo.',
      'Um quadrilongo, ou retângulo de proporção áurea.',
      'Um triângulo equilátero.'
    ],
    correctOptionIndex: 2,
    explanation: 'A forma da Loja é um quadrilongo, ou retângulo de proporção áurea.'
  },
  {
    id: 'q1-8',
    questionText: 'O que deve existir sobre a mesa do Ven∴?',
    category: 'Ritualística e Símbolos',
    options: [
      'Apenas o malhete e a Bíblia.',
      'Malhete, Espada Flamejante, Esquadro, candelabro, rituais, leis, estatutos e incenso.',
      'Compasso, Esquadro e a Constituição.',
      'Símbolo de autoridade profana exterior.'
    ],
    correctOptionIndex: 1,
    explanation: 'Sobre a mesa do Venerável Mestre deve existir o Malhete, Espada Flamejante, Esquadro, candelabro, rituais, leis, estatutos e incenso.'
  },
  {
    id: 'q1-9',
    questionText: 'Como se denomina o altar onde está repousada a Bíblia ou Livro da Lei?',
    category: 'Ritualística e Símbolos',
    options: [
      'Altar da Verdade.',
      'Altar dos Perfumes.',
      'Altar dos Juramentos.',
      'Trono de Salomão.'
    ],
    correctOptionIndex: 2,
    explanation: 'O altar onde está repousada a Bíblia ou Livro da Lei denomina-se Altar dos Juramentos.'
  },
  {
    id: 'q1-10',
    questionText: 'Qual a posição do Pavilhão Nacional?',
    category: 'Ritualística e Símbolos',
    options: [
      'No Ocidente, à porta do Templo.',
      'No Oriente, ao lado do Secretário (ao Norte) e junto à parede.',
      'No centro do Templo, sobre o Pavimento Mosaico.',
      'Ao lado do Orador, no Sul.'
    ],
    correctOptionIndex: 1,
    explanation: 'O Pavilhão Nacional fica situado no Oriente, ao lado do Secretário (ao Norte) e junto à parede.'
  },
  {
    id: 'q1-11',
    questionText: 'Quais os principais deveres de um Maçom?',
    category: 'Filosofia e Doutrina',
    options: [
      'Apenas o sigilo e a obediência cega.',
      'Deveres para com Deus, para com o próximo e para consigo mesmo.',
      'Frequentar as sessões e pagar as mensalidades.',
      'Prerrogativa exclusiva do Venerável Mestre.'
    ],
    correctOptionIndex: 1,
    explanation: 'Os principais deveres de um Maçom são deveres para com Deus, para com o próximo e para consigo mesmo.'
  },
  {
    id: 'q1-12',
    questionText: 'O que simboliza o avental?',
    category: 'Ritualística e Símbolos',
    options: [
      'Uma vestimenta de gala para os mestres.',
      'O serviço e a nobreza do Trabalho, indicando uma vida ativa.',
      'A proteção contra as energias negativas externas.',
      'Regra específica de ritos não reconhecidos.'
    ],
    correctOptionIndex: 1,
    explanation: 'O avental simboliza o serviço e a nobreza do Trabalho, indicando uma vida ativa.'
  },
  {
    id: 'q1-13',
    questionText: 'Qual o vestuário completo de um Maçom?',
    category: 'Ritualística e Símbolos',
    options: [
      'Sapatos/meias pretos, terno preto, camisa/luvas/gravata brancas e o avental.',
      'Qualquer traje escuro com gravata preta.',
      'Balandrau preto com luvas pretas.',
      'Símbolo do trabalho no mundo exterior profano.'
    ],
    correctOptionIndex: 0,
    explanation: 'O vestuário completo constitui-se de sapatos/meias pretos, terno preto, camisa/luvas/gravata brancas e o avental.'
  },
  {
    id: 'q1-14',
    questionText: 'O que é trolhamento?',
    category: 'Ritualística e Símbolos',
    options: [
      'O exame do candidato na porta do Templo.',
      'O ato de remover as arestas, espalhando e nivelando a massa (uso da trolha).',
      'A identificação ritualística por meio de sinais e toques.',
      'Atribuição do Guarda do Templo durante a cobrição.'
    ],
    correctOptionIndex: 1,
    explanation: 'Trolhamento é o ato de remover as arestas, espalhando e nivelando a massa (uso da trolha).'
  },
  {
    id: 'q1-15',
    questionText: 'Por que é feito o telhamento?',
    category: 'Ritualística e Símbolos',
    options: [
      'Para nos certificarmos de que se trata de um Irmão "bom, legítimo e fiel".',
      'Para testar a memória do Aprendiz.',
      'Para proteger o Templo de intempéries físicas.',
      'Representação da iluminação interior na Câmara de Reflexões.'
    ],
    correctOptionIndex: 0,
    explanation: 'O telhamento é feito para nos certificarmos de que se trata de um Irmão "bom, legítimo e fiel".'
  },
  {
    id: 'q1-16',
    questionText: 'A Maçonaria é uma instituição secreta?',
    category: 'Filosofia e Doutrina',
    options: [
      'Sim, pois ninguém sabe de sua existência.',
      'Não, é uma instituição discreta, privativa ou reservada aos seus membros.',
      'Sim, seus rituais são proibidos por lei.',
      'Atividade desempenhada exclusivamente no encerramento dos trabalhos.'
    ],
    correctOptionIndex: 1,
    explanation: 'A Maçonaria não é secreta, mas sim uma instituição discreta, privativa ou reservada aos seus membros.'
  },
  {
    id: 'q1-17',
    questionText: 'Qual a cor predominante numa Loja Adonhiramita?',
    category: 'Ritualística e Símbolos',
    options: [
      'Vermelho escarlate.',
      'Azul celeste.',
      'Branco e preto.',
      'Verde floresta.'
    ],
    correctOptionIndex: 1,
    explanation: 'A cor predominante na ornamentação de uma Loja Adonhiramita é o Azul celeste.'
  },
  {
    id: 'q1-18',
    questionText: 'Onde fica situada a porta do Templo?',
    category: 'Ritualística e Símbolos',
    options: [
      'Ao Norte, para os Aprendizes.',
      'No Oriente, atrás do Trono.',
      'No meio da parede Oeste (Ocidente).',
      'No Sul, por onde entra a luz.'
    ],
    correctOptionIndex: 2,
    explanation: 'A porta do Templo fica situada no meio da parede Oeste (Ocidente).'
  },
  {
    id: 'q1-19',
    questionText: 'Qual o nome do local onde sentam-se os Aprendizes?',
    category: 'Ritualística e Símbolos',
    options: [
      'Setentrião ou Coluna do Norte.',
      'Coluna do Meio-Dia.',
      'Oriente, junto às autoridades.',
      'Ocidente, ao lado do Tesoureiro.'
    ],
    correctOptionIndex: 0,
    explanation: 'Os Aprendizes sentam-se no Setentrião ou Coluna do Norte.'
  },
  {
    id: 'q1-20',
    questionText: 'Por que sentam os Aprendizes no Setentrião?',
    category: 'Filosofia e Doutrina',
    options: [
      'Por ser o lugar mais honroso da Loja.',
      'Por ser o local menos iluminado, pois o Aprendiz recebeu fraca luz.',
      'Para ficarem distantes do Venerável Mestre.',
      'Instrução ministrada aos neófitos antes da iniciação.'
    ],
    correctOptionIndex: 1,
    explanation: 'Sentam-se no Norte por ser o local menos iluminado, simbolizando a fraca luz recebida no início da jornada.'
  },
  {
    id: 'q1-21',
    questionText: 'O que existe no centro do soalho da Loja, ao Ociente?',
    category: 'Ritualística e Símbolos',
    options: [
      'O Altar dos Juramentos.',
      'A representação do Sol.',
      'O Pavimento Mosaico.',
      'O Mar de Bronze.'
    ],
    correctOptionIndex: 2,
    explanation: 'No centro do soalho da Loja (ao Ocidente) situa-se o Pavimento Mosaico.'
  },
  {
    id: 'q1-22',
    questionText: 'De que se compõe e quais as cores do Pavimento Mosaico?',
    category: 'Ritualística e Símbolos',
    options: [
      'Triângulos em azul e branco.',
      'Quadrados nas cores preto e branco.',
      'Círculos em dourado e prata.',
      'Losangos em verde e amarelo.'
    ],
    correctOptionIndex: 1,
    explanation: 'O Pavimento Mosaico compõe-se de quadrados alternados nas cores preto e branco.'
  },
  {
    id: 'q1-23',
    questionText: 'O que é o Pavimento de Mosaico?',
    category: 'Filosofia e Doutrina',
    options: [
      'Um tapete para o Venerável Mestre.',
      'Símbolo do equilíbrio e da coesão Universal; integração dos opostos.',
      'Uma homenagem mística a Moisés.',
      'Uso exclusivo nas sessões magnas de posse.'
    ],
    correctOptionIndex: 1,
    explanation: 'Simboliza a união e harmonia de todos os homens sobre a Terra, a despeito de suas raças, opiniões e diversidades.'
  },
  {
    id: 'q1-24',
    questionText: 'O que é a Orla Dentada?',
    category: 'Ritualística e Símbolos',
    options: [
      'Moldura azul celeste que contorna o Pavimento Mosaico; símbolo da união.',
      'Uma corda com 81 nós que protege o Templo.',
      'A base das colunas J e B.',
      'Instrução reservada ao grau de Mestre.'
    ],
    correctOptionIndex: 0,
    explanation: 'A Orla Dentada é a moldura azul celeste que contorna o Pavimento Mosaico, servindo como símbolo da união.'
  },
  {
    id: 'q1-25',
    questionText: 'De que ordem são as Colunas na entrada do Templo?',
    category: 'Ritualística e Símbolos',
    options: [
      'Ordem Dórica.',
      'Ordem Jônica.',
      'Ordem Coríntia.',
      'Ordem Egípcia.'
    ],
    correctOptionIndex: 2,
    explanation: 'As duas Colunas vestibulares são projetadas sob as regras da Ordem Coríntia.'
  },
  {
    id: 'q1-26',
    questionText: 'Qual a letra gravada na Coluna ao lado do 2° Vigilante?',
    category: 'Ritualística e Símbolos',
    options: [
      'Letra B.',
      'Letra J.',
      'Letra G.',
      'Letra A.'
    ],
    correctOptionIndex: 1,
    explanation: 'A letra gravada na Coluna do Segundo Vigilante é a letra J.'
  },
  {
    id: 'q1-27',
    questionText: 'O que significa a letra "J" na Coluna ao lado do 2° Vigilante?',
    category: 'Ritualística e Símbolos',
    options: [
      'Justiça e Juízo.',
      'Jaquim; significa que "a Sabedoria está em Deus".',
      'Jerusalém, a cidade santa.',
      'Símbolo de autoridade profana exterior.'
    ],
    correctOptionIndex: 1,
    explanation: 'Significa "Jaquim", representando a verdade moral de que "a Sabedoria está em Deus" (ou Ele estabelecerá).'
  },
  {
    id: 'q1-28',
    questionText: 'O que existe sobre as colunas?',
    category: 'Ritualística e Símbolos',
    options: [
      'Globos terrestres e celestes.',
      'Estátuas da Sabedoria e Força.',
      'As Romãs.',
      'Castiçais de prata.'
    ],
    correctOptionIndex: 2,
    explanation: 'Sobre os capitéis das Colunas ficam expostas as Romãs.'
  },
  {
    id: 'q1-29',
    questionText: 'Qual o significado das romãs?',
    category: 'Filosofia e Doutrina',
    options: [
      'Bens das estações; representam as Lojas e a fraternidade humana.',
      'A doçura da vida maçônica.',
      'O segredo que deve ser guardado individualmente.',
      'Prerrogativa exclusiva do Venerável Mestre.'
    ],
    correctOptionIndex: 0,
    explanation: 'As romãs unidas e cheias de sementes representam as Lojas formadas pela Fraternidade Universal dos seres humanos.'
  },
  {
    id: 'q1-30',
    questionText: 'Quais as dimensões das Colunas vestibulares?',
    category: 'Ritualística e Símbolos',
    options: [
      '10 metros de altura por 3 de largura.',
      '18 côvados de altura por 12 côvados de circunferência.',
      '3 metros de altura representando os três graus.',
      '7 palmos de base e 9 de altura.'
    ],
    correctOptionIndex: 1,
    explanation: 'Conforme descrito nos textos sagrados, as Colunas possuem dezoito côvados de altura por doze côvados de circunferência.'
  },
  {
    id: 'q1-31',
    questionText: 'Quantos nós existem na corda que contorna o Templo?',
    category: 'Ritualística e Símbolos',
    options: [
      'Sete nós.',
      'Trinta e três nós.',
      'Oitenta e um nós.',
      'Nove nós.'
    ],
    correctOptionIndex: 2,
    explanation: 'A corda que guarnece o contorno interior da Loja possui exatamente oitenta e um nós.'
  },
  {
    id: 'q1-32',
    questionText: 'O que simboliza o teto da Loja?',
    category: 'Ritualística e Símbolos',
    options: [
      'O limite físico da construção.',
      'A Abóbada Celeste, representando o Universo.',
      'O segredo guardado entre quatro paredes.',
      'Regra específica de ritos não reconhecidos.'
    ],
    correctOptionIndex: 1,
    explanation: 'O teto da Loja simboliza a Abóbada Celeste, indicando a universalidade e amplitude ilimitada do Templo espiritual.'
  },
  {
    id: 'q1-33',
    questionText: 'Qual a posição do Sol no painel do Templo?',
    category: 'Ritualística e Símbolos',
    options: [
      'No Ocidente, à porta.',
      'No Oriente, à direita do Retábulo (atrás do Trono).',
      'No Sul, sobre o 1º Vigilante.',
      'Símbolo do trabalho no mundo exterior profano.'
    ],
    correctOptionIndex: 1,
    explanation: 'O Sol está pintado no Oriente, à direita do painel do Retábulo (atrás do Trono do Venerável Mestre).'
  },
  {
    id: 'q1-34',
    questionText: 'Qual a posição da Lua no painel do Templo?',
    category: 'Ritualística e Símbolos',
    options: [
      'No Norte, iluminando os aprendizes.',
      'No Oriente, à esquerda do Retábulo.',
      'No centro do Pavimento Mosaico.',
      'Atribuição do Guarda do Templo durante a cobrição.'
    ],
    correctOptionIndex: 1,
    explanation: 'A Lua está pintada no Oriente, à esquerda do painel do Retábulo.'
  },
  {
    id: 'q1-35',
    questionText: 'O que é Moral Maçônica?',
    category: 'Filosofia e Doutrina',
    options: [
      'O cumprimento rigoroso das leis penais profanas.',
      'O sistema para o ensino do amor ao próximo e formação do caráter.',
      'Um conjunto de dogmas religiosos.',
      'Representação da iluminação interior na Câmara de Reflexões.'
    ],
    correctOptionIndex: 1,
    explanation: 'A Moral Maçônica é um sistema que visa o ensino do amor ao próximo e o aprimoramento interno do caráter individual.'
  },
  {
    id: 'q1-36',
    questionText: 'Como consideramos nossos semelhantes?',
    category: 'Filosofia e Doutrina',
    options: [
      'Como superiores hierárquicos.',
      'Como nossos iguais.',
      'Com indiferença, exceto se forem maçons.',
      'Atividade desempenhada exclusivamente no encerramento dos trabalhos.'
    ],
    correctOptionIndex: 1,
    explanation: 'Consideramos todos os seres humanos como nossos iguais em dignidade primordial e filiação universal.'
  },
  {
    id: 'q1-37',
    questionText: 'Qual a altura da Loja?',
    category: 'Ritualística e Símbolos',
    options: [
      'Três andares simbólicos.',
      'Da Terra ao Céu.',
      'Sete côvados.',
      'Instrução ministrada aos neófitos antes da iniciação.'
    ],
    correctOptionIndex: 1,
    explanation: 'Simbolicamente, diz-se que a altura da Loja Maçônica estende-se da Terra ao Céu.'
  },
  {
    id: 'q1-38',
    questionText: 'Qual o comprimento da Loja?',
    category: 'Ritualística e Símbolos',
    options: [
      'Do Norte ao Sul.',
      'Do Oriente ao Ocidente.',
      'Sete léguas de fraternidade.',
      'Uso exclusivo nas sessões magnas de posse.'
    ],
    correctOptionIndex: 1,
    explanation: 'Simbolicamente, o comprimento da Loja estende-se do Oriente ao Ocidente.'
  },
  {
    id: 'q1-39',
    questionText: 'Qual a largura da Loja?',
    category: 'Ritualística e Símbolos',
    options: [
      'Do Norte ao Sul.',
      'Do Oriente ao Ocidente.',
      'Da Terra ao Céu.',
      'Instrução reservada ao grau de Mestre.'
    ],
    correctOptionIndex: 0,
    explanation: 'Simbolicamente, a largura da Loja estende-se do Norte ao Sul.'
  },
  {
    id: 'q1-40',
    questionText: 'Qual a profundidade da Loja?',
    category: 'Ritualística e Símbolos',
    options: [
      'Apenas a base do soalho.',
      'Da superfície ao centro da Terra.',
      'Três palmos de fundação.',
      'Símbolo de autoridade profana exterior.'
    ],
    correctOptionIndex: 1,
    explanation: 'Simbolicamente, a profundidade da Loja estende-se da superfície ao centro da Terra.'
  },
  {
    id: 'q1-41',
    questionText: 'Por que está a Loja situada do Oriente ao Ocidente?',
    category: 'Ritualística e Símbolos',
    options: [
      'Por conveniência arquitetônica.',
      'Para manter a tradição do Templo de Salomão e o "Caminho do Sol".',
      'Para facilitar a saída dos irmãos.',
      'Prerrogativa exclusiva do Venerável Mestre.'
    ],
    correctOptionIndex: 1,
    explanation: 'A disposição serve para manter a tradição bíblica do Templo de Salomão e mimetizar a trajetória física que o Sol faz.'
  },
  {
    id: 'q1-42',
    questionText: 'Em que se apoia a Loja?',
    category: 'Ritualística e Símbolos',
    options: [
      'No Pavimento Mosaico.',
      'Em três colunas: Sabedoria, Força e Beleza.',
      'No Livro da Lei.',
      'Regra específica de ritos não reconhecidos.'
    ],
    correctOptionIndex: 1,
    explanation: 'A Loja se apoia sobre três colunas emblemáticas representativas da Sabedoria, Força e Beleza.'
  },
  {
    id: 'q1-43',
    questionText: 'Por que a Loja é sustentada por três Colunas simbólicas?',
    category: 'Filosofia e Doutrina',
    options: [
      'Porque representa a diretoria.',
      'Porque são o complemento de tudo; sem elas nada é perfeito e durável.',
      'Devido aos três vigilantes da porta.',
      'Símbolo do trabalho no mundo exterior profano.'
    ],
    correctOptionIndex: 1,
    explanation: 'No catecismo, responde-se que essas colunas sustentam pois são o complemento de tudo: sem elas nada é perfeito e durável.'
  },
  {
    id: 'q1-44',
    questionText: 'Por que a Maçonaria combate a ignorância?',
    category: 'Filosofia e Doutrina',
    options: [
      'Para aumentar o número de intelectuais.',
      'Porque a ignorância é a mãe de todos os vícios.',
      'Por ser uma exigência do Ministério da Educação.',
      'Atribuição do Guarda do Templo durante a cobrição.'
    ],
    correctOptionIndex: 1,
    explanation: 'Mormente combate-se a ignorância pois ela é apontada como a mãe de todos os vícios de comportamento moral.'
  },
  {
    id: 'q1-45',
    questionText: 'Por que a Maçonaria combate o fanatismo?',
    category: 'Filosofia e Doutrina',
    options: [
      'Porque o fanático doa pouco dinheiro.',
      'Porque a exaltação religiosa perverte a razão.',
      'Porque a Maçonaria é contra as igrejas.',
      'Representação da iluminação interior na Câmara de Reflexões.'
    ],
    correctOptionIndex: 1,
    explanation: 'O fanatismo cega e cinde a fraternidade humana, pervertendo a sã razão e instigando ódios.'
  },
  {
    id: 'q1-46',
    questionText: 'Em que consiste nossa fraternidade?',
    category: 'Filosofia e Doutrina',
    options: [
      'Em aceitar os homens com suas crenças e ensinar a dar e não a pedir.',
      'Em uma rede de favores profissionais.',
      'No auxílio financeiro incondicional a qualquer pessoa.',
      'Atividade desempenhada exclusivamente no encerramento dos trabalhos.'
    ],
    correctOptionIndex: 0,
    explanation: 'A fraternidade maçônica consiste em aceitar os seres humanos com suas crenças particulares, orientando-os para a benemerência.'
  },
  {
    id: 'q1-47',
    questionText: 'Qual a joia do 2° Vigilante?',
    category: 'Ritualística e Símbolos',
    options: [
      'O Nível.',
      'O Prumo (ou Perpendicular).',
      'O Esquadro.',
      'O Compasso.'
    ],
    correctOptionIndex: 1,
    explanation: 'O Segundo Vigilante porta a joia do Prumo ou Perpendicular.'
  },
  {
    id: 'q1-48',
    questionText: 'Em que ano se tem ideia da introdução da Maçonaria no Brasil?',
    category: 'História e Legislação',
    options: [
      '1500.',
      '1797.',
      '1822.',
      '1973.'
    ],
    correctOptionIndex: 1,
    explanation: 'Tem-se ideia de suas origens estruturadas no Brasil por volta do ano de 1797.'
  },
  {
    id: 'q1-49',
    questionText: 'Qual o nome da primeira Loja Maçônica instalada no Brasil?',
    category: 'História e Legislação',
    options: [
      'Comércio e Artes.',
      'Cavaleiros da Luz.',
      'Luz do Oriente.',
      'Reunião.'
    ],
    correctOptionIndex: 1,
    explanation: 'A primeira Loja instalada formalmente em solo brasileiro denomina-se Cavaleiros da Luz.'
  },
  {
    id: 'q1-50',
    questionText: 'O que era a Loja Comércio e Artes?',
    category: 'História e Legislação',
    options: [
      'Uma Loja Adonhiramita fundada em 1815, fundamental para o GOB.',
      'Uma associação comercial de pedreiros.',
      'Uma loja que vendia objetos ritualísticos.',
      'Instrução ministrada aos neófitos antes da iniciação.'
    ],
    correctOptionIndex: 0,
    explanation: 'A Loja Comércio e Artes foi uma Loja do Rito Adonhiramita fundada em 1815 e fundamental para a criação do GOB.'
  },
  {
    id: 'q1-51',
    questionText: 'Quando foi fundada a Loja Comércio e Artes?',
    category: 'História e Legislação',
    options: [
      'Em 15 de novembro de 1815.',
      'Em 1815.',
      'Em 1822.',
      'Em 1797.'
    ],
    correctOptionIndex: 0,
    explanation: 'A histórica Loja Comércio e Artes foi instituída no dia 15 de novembro de 1815.'
  },
  {
    id: 'q1-52',
    questionText: 'Em que ano foi totalmente proibida a Maçonaria no Brasil?',
    category: 'História e Legislação',
    options: [
      'Início do século XIX em 1822.',
      'Em 1815.',
      'Em 1818 (pelo Alvará Régio de D. João VI).',
      'Em 1973.'
    ],
    correctOptionIndex: 2,
    explanation: 'Houve a vedação e o desterro das atividades através do Alvará Régio em 1818 promulgador por D. João VI.'
  },
  {
    id: 'q1-53',
    questionText: 'Quando reergueu colunas a Loja Comércio e Artes?',
    category: 'História e Legislação',
    options: [
      'Em 1818.',
      'Em 2 de junho de 1821.',
      'Em 17 de junho de 1822.',
      'Em 1880.'
    ],
    correctOptionIndex: 1,
    explanation: 'A Loja reergueu seus estandartes e trabalhos oficialmente em 2 de junho de 1821.'
  },
  {
    id: 'q1-54',
    questionText: 'Quando foi fundado o Grande Oriente do Brasil (GOB)?',
    category: 'História e Legislação',
    options: [
      '02 de junho de 1821.',
      '17 de junho de 1822.',
      '13 de maio de 1888.',
      '15 de novembro de 1889.'
    ],
    correctOptionIndex: 1,
    explanation: 'A fundação mítica do Grande Oriente do Brasil consumou-se em 17 de junho de 1822.'
  },
  {
    id: 'q1-55',
    questionText: 'Por quais Lojas foi fundado o Grande Oriente do Brasil?',
    category: 'História e Legislação',
    options: [
      'Comércio e Artes apenas.',
      'Comércio e Artes, União e Tranquilidade, e Esperança de Niterói.',
      'Cavaleiros da Luz e Harmonia Brusquense.',
      'Pelas cinco lojas de Brusque.'
    ],
    correctOptionIndex: 1,
    explanation: 'O GOB foi constituído pela aliança unificada dessas três lojas fluminenses e ativas.'
  },
  {
    id: 'q1-56',
    questionText: 'Qual o primeiro Grão-Mestre eleito do Grande Oriente do Brasil?',
    category: 'História e Legislação',
    options: [
      'José Bonifácio de Andrada e Silva.',
      'Visconde de Rio Branco.',
      'D. Pedro I.',
      'Uso exclusivo nas sessões magnas de posse.'
    ],
    correctOptionIndex: 0,
    explanation: 'O Patriarca da Independência, José Bonifácio, foi sagrado o primeiro Grão-Mestre.'
  },
  {
    id: 'q1-57',
    questionText: 'Quem substituiu o primeiro Grão-Mestre eleito?',
    category: 'História e Legislação',
    options: [
      'D. Pedro I (sob o nome Guatimozim).',
      'José Bonifácio.',
      'Visconde de Rio Branco.',
      'Instrução reservada ao grau de Mestre.'
    ],
    correctOptionIndex: 0,
    explanation: 'D. Pedro I foi entronizado na liderança da instituição nacional adotando o cognome de Guatimozim.'
  },
  {
    id: 'q1-58',
    questionText: 'Que rito praticava o GOB na sua fundação originária?',
    category: 'História e Legislação',
    options: [
      'Rito Escocês Antigo e Aceito.',
      'Rito Adonhiramita.',
      'Rito Brasileiro.',
      'Rito Moderno.'
    ],
    correctOptionIndex: 1,
    explanation: 'O GOB utilizava de forma regular e originária a condução rito-litúrgica Adonhiramita.'
  },
  {
    id: 'q1-59',
    questionText: 'O que redundou na fundação do GOB?',
    category: 'História e Legislação',
    options: [
      'A subdivisão da Loja Comércio e Artes em três para formar a Potência.',
      'Um tratado internacional com a Inglaterra.',
      'Uma revolta contra o imperador.',
      'Símbolo de autoridade profana exterior.'
    ],
    correctOptionIndex: 0,
    explanation: 'Para atingir a condição de Potência (mínimo de três oficinas), a Loja Comércio e Artes dividiu-se originalmente.'
  },
  {
    id: 'q1-60',
    questionText: 'O que ocasionou a fundação do Grande Oriente do Brasil?',
    category: 'História e Legislação',
    options: [
      'O desejo de ter uma Potência nacional para tratar os interesses brasileiros.',
      'A necessidade de unificar todos os ritos do mundo.',
      'Uma exigência da Igreja Católica.',
      'Prerrogativa exclusiva do Venerável Mestre.'
    ],
    correctOptionIndex: 0,
    explanation: 'Havia o ardente anseio patriótico de estabelecer uma autoridade genuinamente nacional em face de Portugal.'
  },
  {
    id: 'q1-61',
    questionText: 'Onde se assenta o Ir∴ Tesoureiro?',
    category: 'Ritualística e Símbolos',
    options: [
      'Ao lado do Orador, no Sul.',
      'No Oriente, ao Sul (Misericórdia/Chesed).',
      'No Ocidente, à porta.',
      'Regra específica de ritos não reconhecidos.'
    ],
    correctOptionIndex: 1,
    explanation: 'O Tesoureiro assenta-se no quadrante do Oriente, correspondente à região ao Sul.'
  },
  {
    id: 'q1-62',
    questionText: 'Quais as obrigações fundamentais do Ir∴ Tesoureiro?',
    category: 'Cargos e Obrigações',
    options: [
      'Arrecadar metais, pagar despesas visadas pelo Ven∴ e prestar contas.',
      'Traçar o balaústre e ler as correspondências.',
      'Cuidar apenas da beneficência externa.',
      'Símbolo do trabalho no mundo exterior profano.'
    ],
    correctOptionIndex: 0,
    explanation: 'Compete-lhe administrar as finanças, efetivar pagamentos chancelados pelo Venerável e apresentar o balancete.'
  },
  {
    id: 'q1-63',
    questionText: 'Quais as obrigações fundamentais do Ir∴ Chanceler?',
    category: 'Cargos e Obrigações',
    options: [
      'Guardar selo/timbre, registrar presenças e anunciar aniversários.',
      'Cobrar mensalidades em atraso.',
      'Preparar o Templo antes das sessões.',
      'Atribuição do Guarda do Templo durante a cobrição.'
    ],
    correctOptionIndex: 0,
    explanation: 'O Chanceler detém a custódia do timbre-mágico, cuida dos livros de presenças e anota escrutínios.'
  },
  {
    id: 'q1-64',
    questionText: 'Quais as obrigações fundamentais do Ir∴ Mestre de Cerimônias?',
    category: 'Cargos e Obrigações',
    options: [
      'Executar o ritual, organizar procissões e conduzir os irmãos.',
      'Fiscalizar apenas a parte financeira.',
      'Abrir o Livro da Lei.',
      'Representação da iluminação interior na Câmara de Reflexões.'
    ],
    correctOptionIndex: 0,
    explanation: 'Responsável direto pela etiqueta ritualística, movimentação de pautas lógicas e condução espacial.'
  },
  {
    id: 'q1-65',
    questionText: 'Quais as obrigações fundamentais do Ir∴ Hospitaleiro?',
    category: 'Cargos e Obrigações',
    options: [
      'Avisar sessões, visitar doentes e conduzir o Tronco de Beneficência (Solidariedade).',
      'Guardar os paramentos após as sessões.',
      'Fiscalizar a entrada de profanos.',
      'Atividade desempenhada exclusivamente no encerramento dos trabalhos.'
    ],
    correctOptionIndex: 0,
    explanation: 'Encarregado da filantropia, conforto ao necessitado, e circulação do Tronco de Solidariedade.'
  },
  {
    id: 'q1-66',
    questionText: 'Quais as obrigações fundamentais do Ir∴ Experto?',
    category: 'Cargos e Obrigações',
    options: [
      'Manter o Templo coberto, telhar visitantes e participar do acendimento do fogo.',
      'Ler as leis e decretos da Potência.',
      'Organizar os banquetes.',
      'Instrução ministrada aos neófitos antes da iniciação.'
    ],
    correctOptionIndex: 0,
    explanation: 'Encarregado da segurança litúrgica interna, exames prévios de telhamentos e ritos iniciáticos.'
  },
  {
    id: 'q1-67',
    questionText: 'Quais as obrigações fundamentais do Ir∴ Arquiteto?',
    category: 'Cargos e Obrigações',
    options: [
      'Preparar a Loja, guardar paramentos e cuidar do inventário.',
      'Cobrir o Templo no Ocidente.',
      'Substituir o Venerável Mestre.',
      'Uso exclusivo nas sessões magnas de posse.'
    ],
    correctOptionIndex: 0,
    explanation: 'O Arquiteto responsabiliza-se pela integridade física do mobiliário, enfeites e guarda patrimonial.'
  },
  {
    id: 'q1-68',
    questionText: 'Quais as obrigações fundamentais do Ir∴ Mestre de Banquetes?',
    category: 'Cargos e Obrigações',
    options: [
      'Organizar as cerimônias dos banquetes e as festas de Loja.',
      'Preparar os pães e vinhos do Tronco.',
      'Cuidar apenas da limpeza do Templo.',
      'Instrução reservada ao grau de Mestre.'
    ],
    correctOptionIndex: 0,
    explanation: 'Supervisiona as ceias ritualísticas de solstício/equinócio e momentos de confraternização comestível.'
  },
  {
    id: 'q1-69',
    questionText: 'Quais as obrigações fundamentais do Ir∴ Cobridor?',
    category: 'Cargos e Obrigações',
    options: [
      'Verificar a identidade dos obreiros e guardar a entrada do Templo.',
      'Fazer a incensação do Templo.',
      'Conferir as esferas de votação.',
      'Símbolo de autoridade profana exterior.'
    ],
    correctOptionIndex: 0,
    explanation: 'O guarda de portal externo, obstando aproximação audível de profanos e intrusos no limiar.'
  },
  {
    id: 'q1-70',
    questionText: 'Quais as obrigações fundamentais dos Irmãos 1° e 2° Vigilantes?',
    category: 'Cargos e Obrigações',
    options: [
      'Dirigir Colunas, manter silêncio, instruir obreiros e substituir o Mestre.',
      'Apenas cobrar mensalidades.',
      'Fazer o policiamento das ruas próximas ao Templo.',
      'Prerrogativa exclusiva do Venerável Mestre.'
    ],
    correctOptionIndex: 0,
    explanation: 'Eles co-administram a oficina, dão instrução aos seus pupilos e herdam a liderança na ausência do Venerável.'
  },
  {
    id: 'q1-71',
    questionText: 'Quais as obrigações fundamentais do Ir∴ Orador?',
    category: 'Cargos e Obrigações',
    options: [
      'Zelar pelo cumprimento das leis, comentar regularidade e conferir o Tronco.',
      'Traçar as atas das sessões.',
      'Conceder a palavra no Oriente.',
      'Regra específica de ritos não reconhecidos.'
    ],
    correctOptionIndex: 0,
    explanation: 'Guardião-geral da Constituição e leis maçônicas, fiscalizador dos ritos e oráculo oficial das atas.'
  },
  {
    id: 'q1-72',
    questionText: 'Quais as obrigações fundamentais do Ir∴ Secretário?',
    category: 'Cargos e Obrigações',
    options: [
      'Traçar balaústres, organizar correspondência e o arquivo da Loja.',
      'Pagar as contas da oficina.',
      'Examinar visitantes no átrio.',
      'Símbolo do trabalho no mundo exterior profano.'
    ],
    correctOptionIndex: 0,
    explanation: 'O redator histórico dos eventos em templo (balaústres) e intermediador da correspondência interna e externa.'
  },
  {
    id: 'q1-73',
    questionText: 'Quais as obrigações fundamentais do Venerável Mestre?',
    category: 'Cargos e Obrigações',
    options: [
      'Presidir, nomear oficiais, conferir graus e coordenar todas as atividades.',
      'Ficar sempre em silêncio durante o ritual.',
      'Cuidar pessoalmente da limpeza das colunas.',
      'Atribuição do Guarda do Templo durante a cobrição.'
    ],
    correctOptionIndex: 0,
    explanation: 'A suprema autoridade da Loja, responsável pela condução geral administrativa e esotérica do corpo.'
  },
  {
    id: 'q1-74',
    questionText: 'O que significa ornamentos de uma Loja?',
    category: 'Símbolos e Jóias',
    options: [
      'O Pavimento Mosaico, a Estrela Rutilante e a Orla Dentada.',
      'As flores e tapetes usados no Oriente.',
      'As medalhas dos Mestres Instalados.',
      'Representação da iluminação interior na Câmara de Reflexões.'
    ],
    correctOptionIndex: 0,
    explanation: 'Formalmente denominam-se ornamentos o Pavimento de Mosaico, a Estrela Rutilante e a Orla Dentada.'
  },
  {
    id: 'q1-75',
    questionText: 'O que são paramentos?',
    category: 'Símbolos e Jóias',
    options: [
      'O Livro da Lei, o Compasso e o Esquadro.',
      'Os aventais e as luvas brancas.',
      'As espadas dos oficiais.',
      'Atividade desempenhada exclusivamente no encerramento dos trabalhos.'
    ],
    correctOptionIndex: 1,
    explanation: 'Os paramentos de um Maçom em sua farda tradicional consistem no Avental e luvas brancas.'
  },
  {
    id: 'q1-76',
    questionText: 'O que são as joias de uma Loja?',
    category: 'Símbolos e Jóias',
    options: [
      'Seis insígnias: três fixas e três móveis.',
      'Pedras preciosas guardadas no Tesouro.',
      'Os filhos dos maçons.',
      'Instrução ministrada aos neófitos antes da iniciação.'
    ],
    correctOptionIndex: 0,
    explanation: 'As joias dividem-se em seis insígnias intelectuais: três fixas e três classificadas de móveis.'
  },
  {
    id: 'q1-77',
    questionText: 'O que representa a Estrela Rutilante?',
    category: 'Símbolos e Jóias',
    options: [
      'O Sol, Glória do Criador, e a virtude da Caridade.',
      'O início da noite de trabalho.',
      'A luz da razão profana.',
      'Uso exclusivo nas sessões magnas de posse.'
    ],
    correctOptionIndex: 0,
    explanation: 'A Estrela Rutilante representa o Sol da Sabedoria, a Glória excelsa do Criador e o dom da Caridade.'
  },
  {
    id: 'q1-78',
    questionText: 'O que representa o Livro da Lei?',
    category: 'Símbolos e Jóias',
    options: [
      'A Verdade inspirada por Deus e o código moral de cada maçom.',
      'A constituição civil do país.',
      'Um livro de história antiga.',
      'Instrução reservada ao grau de Mestre.'
    ],
    correctOptionIndex: 0,
    explanation: 'O Livro da Lei personifica o código moral revelado de retidão ética e os ensinos revelados por Deus.'
  },
  {
    id: 'q1-79',
    questionText: 'O que representa a conjunção do Esquadro e do Compasso?',
    category: 'Símbolos e Jóias',
    options: [
      'A justa medida e retidão que devem presidir todas as nossas ações.',
      'Ferramentas para desenhar plantas.',
      'Símbolos de opressão e força.',
      'Símbolo de autoridade profana exterior.'
    ],
    correctOptionIndex: 0,
    explanation: 'Simbolizam a ponderação sã, autodomínio perfeito e limiares éticos de nossas interações sociais.'
  },
  {
    id: 'q1-80',
    questionText: 'Por que o Esquadro oculta as pontas do Compasso?',
    category: 'Símbolos e Jóias',
    options: [
      'Porque o Aprendiz apenas desbasta a Pedra Bruta e ainda não domina a perfeição.',
      'Por uma questão estética de simetria.',
      'Para não ferir as mãos dos obreiros.',
      'Prerrogativa exclusiva do Venerável Mestre.'
    ],
    correctOptionIndex: 0,
    explanation: 'Indica que a matéria/fatos imediatos do Aprendiz prevalecem sobre as aspirações espirituais não domadas.'
  },
  {
    id: 'q1-81',
    questionText: 'Quantas joias existem no total dentro de uma Loja?',
    category: 'Símbolos e Jóias',
    options: [
      'Três joias.',
      'Seis joias.',
      'Sete joias.',
      'Doze joias.'
    ],
    correctOptionIndex: 1,
    explanation: 'Contam-se precisamente seis joias estruturais emblemáticas na egrégora do Templo.'
  },
  {
    id: 'q1-82',
    questionText: 'Quais são as denominadas joias fixas?',
    category: 'Símbolos e Jóias',
    options: [
      'A Prancheta, a Pedra Bruta e a Pedra Cúbica.',
      'O Esquadro, o Nível e o Prumo.',
      'O Sol, a Lua e o Delta.',
      'Regra específica de ritos não reconhecidos.'
    ],
    correctOptionIndex: 0,
    explanation: 'As joias fixas situam-se sobre o mobiliário moral: a Prancheta, a Pedra Bruta e a Pedra Cúbica.'
  },
  {
    id: 'q1-83',
    questionText: 'Quais são as denominadas joias móveis?',
    category: 'Símbolos e Jóias',
    options: [
      'A Pedra Bruta e a Pedra Cúbica.',
      'O Esquadro, o Nível e o Prumo.',
      'Os malhetes dos vigilantes.',
      'Símbolo do trabalho no mundo exterior profano.'
    ],
    correctOptionIndex: 1,
    explanation: 'Denominam-se móveis pois se movem e passam de oficial a oficial: o Esquadro, o Nível e o Prumo.'
  },
  {
    id: 'q1-84',
    questionText: 'Qual a joia distintiva do Venerável Mestre?',
    category: 'Símbolos e Jóias',
    options: [
      'O Nível.',
      'O Prumo.',
      'O Esquadro.',
      'A Espada Flamejante.'
    ],
    correctOptionIndex: 2,
    explanation: 'A insígnia oficial do Venerável Mestre é o Esquadro (sinal geométrico de retidão total).'
  },
  {
    id: 'q1-85',
    questionText: 'Qual a joia distintiva do 1° Vigilante?',
    category: 'Símbolos e Jóias',
    options: [
      'O Prumo.',
      'O Nível.',
      'O Compasso.',
      'O Triângulo.'
    ],
    correctOptionIndex: 1,
    explanation: 'A insígnia oficial do Primeiro Vigilante é o Nível (sinal de igualdade social estrita).'
  },
  {
    id: 'q1-86',
    questionText: 'O que representa a Pedra Bruta?',
    category: 'Símbolos e Jóias',
    options: [
      'A inteligência inata e o caráter despolido do homem primitivo.',
      'O fim da jornada de aprendizado.',
      'A perfeição já alcançada na iniciação.',
      'Atribuição do Guarda do Templo durante a cobrição.'
    ],
    correctOptionIndex: 0,
    explanation: 'Simboliza as rudes faculdades originais de caráter rude que aguardam burilamento virtuoso.'
  },
  {
    id: 'q1-87',
    questionText: 'Em que local preciso do Templo fica situada a Pedra Bruta?',
    category: 'Ritualística e Símbolos',
    options: [
      'No Sul, junto ao 1º Vigilante.',
      'No Norte, em frente ao Altar do 2º Vigilante.',
      'No Oriente, junto ao Trono.',
      'Representação da iluminação interior na Câmara de Reflexões.'
    ],
    correctOptionIndex: 1,
    explanation: 'A Pedra Bruta assenta-se no Norte, nas proximidades do Altar do Segundo Vigilante.'
  },
  {
    id: 'q1-88',
    questionText: 'O que são denominados Landmarks?',
    category: 'História e Legislação',
    options: [
      'As mais antigas leis ou limites que regem a Maçonaria Universal.',
      'Livros de atas das lojas inglesas.',
      'Medalhas de honra ao mérito.',
      'Atividade desempenhada exclusivamente no encerramento dos trabalhos.'
    ],
    correctOptionIndex: 0,
    explanation: 'Marcos de imutabilidade jurídica moral que formam a coluna vertebral da Maçonaria Universal.'
  },
  {
    id: 'q1-89',
    questionText: 'Cite três Landmarks consagrados na doutrina:',
    category: 'História e Legislação',
    options: [
      'Processos de reconhecimento, lenda do 3º grau e crença em Deus.',
      'Pagamento de taxas, uso de terno e silêncio.',
      'Festa de São João, churrasco e viagens.',
      'Instrução ministrada aos neófitos antes da iniciação.'
    ],
    correctOptionIndex: 0,
    explanation: 'Mecanismos de identificação fraterna, apego doutrinário ao Grau 3 e fidedignidade teísta (crer em Deus).'
  },
  {
    id: 'q1-90',
    questionText: 'O que caracteriza especificamente o Rito Adonhiramita?',
    category: 'História e Legislação',
    options: [
      'Maçonaria baseada na lenda de Adonhiram, vinda do Rito de Héredom.',
      'Um rito criado exclusivamente no Brasil em 1973.',
      'Um rito que não admite o uso de espadas.',
      'Uso exclusivo nas sessões magnas de posse.'
    ],
    correctOptionIndex: 0,
    explanation: 'Sua base mitológica assenta-se sobre a liderança de Adonhiram (diretor florestal do templo do Rei Salomão).'
  },
  {
    id: 'q1-91',
    questionText: 'De quantos graus simbólicos era composto originalmente o Rito Adonhiramita?',
    category: 'História e Legislação',
    options: [
      '3 graus.',
      '12 graus (depois 13).',
      '33 graus desde o início.',
      '7 graus.'
    ],
    correctOptionIndex: 1,
    explanation: 'Sua arquitetura estrutural original constava de doze patamares de elevação, acrescido após para 13.'
  },
  {
    id: 'q1-92',
    questionText: 'Em que data e local foi proclamada a Constituição do Grande Capítulo Adonhiramita?',
    category: 'História e Legislação',
    options: [
      'Em 1973 no Instituto Maçônico Conselheiro Macedo Soares.',
      'Em 1822 no Rio de Janeiro.',
      'Em 1717 em Londres.',
      'Instrução reservada ao grau de Mestre.'
    ],
    correctOptionIndex: 0,
    explanation: 'A consolidação formal do órgão deliberativo consumou-se em 1973 em dependências da jurisdição.'
  },
  {
    id: 'q1-93',
    questionText: 'Quem presidiu a memorável reunião que reivindicou para o Brasil a sede do Rito Adonhiramita?',
    category: 'História e Legislação',
    options: [
      'José Bonifácio.',
      'O Irmão Aylton de Menezes.',
      'O Barão de Tschoudy.',
      'Símbolo de autoridade profana exterior.'
    ],
    correctOptionIndex: 1,
    explanation: 'O Irmão Eminente Aylton de Menezes capitaneou as resoluções daquela assembleia solene.'
  },
  {
    id: 'q1-94',
    questionText: 'Em qual fundamentação mítica se baseia a Maçonaria Adonhiramita?',
    category: 'História e Legislação',
    options: [
      'Na lenda e comemoração de Adonhiram.',
      'Apenas em obras sociais modernas.',
      'No misticismo puramente político.',
      'Prerrogativa exclusiva do Venerável Mestre.'
    ],
    correctOptionIndex: 0,
    explanation: 'Foca prioritariamente a lenda e virtudes administrativas descritas na gerência moral de Adonhiram.'
  },
  {
    id: 'q1-95',
    questionText: 'O que significa etimologicamente a palavra Adonhiram?',
    category: 'História e Legislação',
    options: [
      'Mestre dos Mestres.',
      '"Consagrado ao Senhor" ou Divino Hiram.',
      'O arquiteto traído.',
      'Regra específica de ritos não reconhecidos.'
    ],
    correctOptionIndex: 1,
    explanation: 'Vem do termo transliterado significando "Meu Senhor Altíssimo" ou "Consagrado ao Senhor".'
  },
  {
    id: 'q1-96',
    questionText: 'Por qual razão filosófica os maçons vestem-se tradicionalmente de preto?',
    category: 'Filosofia e Doutrina',
    options: [
      'Para absorver as energias benéficas que emanam dos corpos organizados.',
      'Para esconder a sujeira do trabalho manual.',
      'Porque é a cor da morte definitiva.',
      'Símbolo do trabalho no mundo exterior profano.'
    ],
    correctOptionIndex: 0,
    explanation: 'Usa-se a veste escura para neutralizar interferências externas e absorver energias em egrégora.'
  },
  {
    id: 'q1-97',
    questionText: 'O que simbolizam as luvas brancas?',
    category: 'Filosofia e Doutrina',
    options: [
      'A candura da alma e a pureza de nossas ações.',
      'A proteção contra o frio no Templo.',
      'O desapego aos metais.',
      'Atribuição do Guarda do Templo durante a cobrição.'
    ],
    correctOptionIndex: 0,
    explanation: 'Testemunham que as mãos rituais do obreiro se encontram isentas de mácula, crimes ou maledicências.'
  },
  {
    id: 'q1-98',
    questionText: 'Quais os dois instrumentos representativos e delegados ao Aprendiz?',
    category: 'Ritualística e Símbolos',
    options: [
      'Régua e Compasso.',
      'O Maço e o Cinzel.',
      'A Trolha e o Nível.',
      'Representação da iluminação interior na Câmara de Reflexões.'
    ],
    correctOptionIndex: 1,
    explanation: 'No catecismo simplificado, as ferramentas ativas de polimento moral são o Maço e o Cinzel.'
  },
  {
    id: 'q1-99',
    questionText: 'O que simboliza o instrumento do Maço?',
    category: 'Ritualística e Símbolos',
    options: [
      'A inteligência e a força dirigida e controlada pela razão.',
      'A força bruta sem nenhum controle.',
      'A autoridade do Venerável Mestre apenas.',
      'Atividade desempenhada exclusivamente no encerramento dos trabalhos.'
    ],
    correctOptionIndex: 0,
    explanation: 'O Maço simboliza a energia motriz, força ativa disciplinada e guiada retamente pelo intelecto.'
  },
  {
    id: 'q1-100',
    questionText: 'O que simboliza o instrumento do Cinzel?',
    category: 'Ritualística e Símbolos',
    options: [
      'Que a educação e perseverança são indispensáveis para a perfeição.',
      'O corte das relações com o mundo profano.',
      'O instrumento de punição dos traidores.',
      'Instrução ministrada aos neófitos antes da iniciação.'
    ],
    correctOptionIndex: 0,
    explanation: 'O Cinzel representa os conceitos refinados da educação e da perseverança moral.'
  },
  {
    id: 'q1-101',
    questionText: 'Qual a relevância e importância simbólica do número 3?',
    category: 'Filosofia e Doutrina',
    options: [
      'É o número do Aprendiz, ligado à bateria, marcha e idade.',
      'Representa os três vigilantes da porta.',
      'É apenas um número da sorte.',
      'Uso exclusivo nas sessões magnas de posse.'
    ],
    correctOptionIndex: 0,
    explanation: 'É o quantum de evolução do Aprendiz, pautando sua idade mística (3 anos), pancadas e passos.'
  },
  {
    id: 'q1-102',
    questionText: 'Por qual razão doutrinária o número dois é considerado "fatídico"?',
    category: 'Filosofia e Doutrina',
    options: [
      'Porque simboliza a dualidade, a dúvida e o antagonismo.',
      'Porque representa a morte.',
      'Because indica a ausência de Deus.',
      'Instrução reservada ao grau de Mestre.'
    ],
    correctOptionIndex: 0,
    explanation: 'O dois cinde a unidade em debate, personificando as hesitações, antagonismo ou lutas morais.'
  },
  {
    id: 'q1-103',
    questionText: 'Qual o significado cósmico e transcendental do número três?',
    category: 'Filosofia e Doutrina',
    options: [
      'Emblema da manifestação e da perfeição (Pai, Filho e Espírito Santo).',
      'O número de vezes que se deve faltar às sessões.',
      'A representação da dualidade resolvida em conflito.',
      'Símbolo de autoridade profana exterior.'
    ],
    correctOptionIndex: 0,
    explanation: 'A união virtuosa que resolve conflitos e sintetiza a manifestação cósmica perfeita.'
  },
  {
    id: 'q1-104',
    questionText: 'Qual o ternário filosófico que simboliza a Maçonaria?',
    category: 'Filosofia e Doutrina',
    options: [
      'Fé, Esperança e Caridade.',
      'Saúde, Força e União.',
      'Sabedoria, Força e Beleza.',
      'Liberdade, Igualdade e Fraternidade.'
    ],
    correctOptionIndex: 2,
    explanation: 'A Sabedoria (que inventa), a Força (que sustenta) e a Beleza (que adorna) formam o ternário.'
  },
  {
    id: 'q1-105',
    questionText: 'Qual a letra consonantal inicial do Tetragrama Sagrado?',
    category: 'Filosofia e Doutrina',
    options: [
      'Letra G.',
      'O "Iod".',
      'Letra J.',
      'Letra A.'
    ],
    correctOptionIndex: 1,
    explanation: 'A semente espiritual inicial Yod da designação hebraica mister do Criador.'
  },
  {
    id: 'q1-106',
    questionText: 'O que lembra o Tetragrama ao Aprendiz Maçom?',
    category: 'Filosofia e Doutrina',
    options: [
      'Que o Aprendiz passou pelas quatro provas dos Elementos.',
      'O nome do imperador do Brasil.',
      'As quatro colunas do Oriente.',
      'Prerrogativa exclusiva do Venerável Mestre.'
    ],
    correctOptionIndex: 0,
    explanation: 'Recorda e evoca as quatro grandes provações iniciáticas atravessadas (Terra, Ar, Água e Fogo).'
  },
  {
    id: 'q1-107',
    questionText: 'O que significa a designação secreta IEVE?',
    category: 'Filosofia e Doutrina',
    options: [
      'A grande Evolução ou "o que existe e o que existia".',
      'O nome secreto do 2º Vigilante.',
      'Justiça e Equidade em latim.',
      'Regra específica de ritos não reconhecidos.'
    ],
    correctOptionIndex: 0,
    explanation: 'Significa "Ele É/Será", compreendendo o ser absoluto atemporal que existe por si só.'
  },
  {
    id: 'q1-108',
    questionText: 'O que significa na simbologia cabalística a letra Vau?',
    category: 'Filosofia e Doutrina',
    options: [
      'As seis faces dos corpos (como as de um cubo).',
      'Vitória sobre o mal.',
      'Vontade absoluta.',
      'Símbolo do trabalho no mundo exterior profano.'
    ],
    correctOptionIndex: 0,
    explanation: 'Tem a correspondência da consolidação dimensional de seis faces representadas no cubo perfeito.'
  },
  {
    id: 'q1-109',
    questionText: 'Quais as três principais qualidades que devem adornar um Maçom?',
    category: 'Filosofia e Doutrina',
    options: [
      'Dinheiro, influência e silêncio.',
      'Vontade, Amor e Sabedoria (ou Inteligência).',
      'Força, Saúde e União.',
      'Atribuição do Guarda do Templo durante a cobrição.'
    ],
    correctOptionIndex: 1,
    explanation: 'A união virtuosa do vigor d\'alma (Vontade), benevolência (Amor) e tirocínio analítico (Sabedoria).'
  },
  {
    id: 'q1-110',
    questionText: 'A quem o Maçom reverencia com primordial fidelidade em Loja?',
    category: 'Filosofia e Doutrina',
    options: [
      'O Venerável Mestre apenas.',
      'O Pavilhão Nacional.',
      'Somente ao Gr.-. Arq∴ do Uni∴',
      'Representação da iluminação interior na Câmara de Reflexões.'
    ],
    correctOptionIndex: 2,
    explanation: 'Reconhece o Divino Princípulo Inteligente e Criador Supremo (Grande Arquiteto do Universo).'
  }
];
