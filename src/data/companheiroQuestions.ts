import { QuestionnaireQuestion } from '../types';

export const COMPANHEIRO_QUESTIONS: QuestionnaireQuestion[] = [
  {
    id: 'q2-1',
    questionText: 'Em Loja de Companheiro, qual o tratamento dado ao Venerável Mestre e aos Vigilantes?',
    category: 'Ritualística e Símbolos',
    options: [
      'Excelentíssimo e Respeitáveis',
      'Respeitabilíssimo e Veneráveis',
      'Sereníssimo e Dignos',
      'Venerabilíssimo e Sábios'
    ],
    correctOptionIndex: 1,
    explanation: 'Em Loja de Companheiro, o tratamento dado ao Venerável Mestre é Respeitabilíssimo e aos Vigilantes é Veneráveis.'
  },
  {
    id: 'q2-2',
    questionText: 'Sabe-se que na construção do Templo de Salomão, foi empregado um número imenso de Obreiros, que na sua maior parte eram Aprendizes. O que recebiam semanalmente como salário os Aprendizes?',
    category: 'Filosofia e Doutrina',
    options: [
      'Pagamento em metais (moeda corrente)',
      'Ração de trigo, de vinho e azeite',
      'Sal e especiarias do oriente',
      'Pedras preciosas e linho fino'
    ],
    correctOptionIndex: 1,
    explanation: 'Os Aprendizes recebiam como salário semanal ração de trigo, de vinho e azeite.'
  },
  {
    id: 'q2-3',
    questionText: 'Qual é a Palavra de Passe do Companheiro?',
    category: 'Ritualística e Símbolos',
    options: [
      'Booz',
      'Jaquin',
      'Schiboleth',
      'Tubalcaim'
    ],
    correctOptionIndex: 2,
    explanation: 'A Palavra de Passe do Companheiro é Schiboleth.'
  },
  {
    id: 'q2-4',
    questionText: 'A letra G simboliza duas ideias grandes e sublimes. Quais são elas?',
    category: 'Filosofia e Doutrina',
    options: [
      'Graça e Gratidão',
      'Glória e Geometria (também Gênio e Gnose)',
      'Guia e Governo',
      'Geração e Generosidade'
    ],
    correctOptionIndex: 1,
    explanation: 'A letra G simboliza prioritariamente Glória (a Deus) e Geometria (a ciência das construções), além de também evocar Gênio e Gnose.'
  },
  {
    id: 'q2-5',
    questionText: 'Qual o significado da Palavra Sagrada do Companheiro?',
    category: 'Filosofia e Doutrina',
    options: [
      'A Sabedoria está no silêncio',
      'A Força está em Deus',
      'A Beleza reside na arte',
      'O Trabalho dignifica o homem'
    ],
    correctOptionIndex: 1,
    explanation: 'A Palavra Sagrada do Companheiro significa "A Força está em Deus".'
  },
  {
    id: 'q2-6',
    questionText: 'Encimando as Colunas do Templo de Salomão viam-se capitéis, cercados por um delicado rendilhado de bronze e ornados de lírios e romãs. Dê a altura dos capitéis e o significado do rendilhado, dos lírios e das romãs.',
    category: 'Ritualística e Símbolos',
    options: [
      '3 côvados; rendilhado: força; lírios: amor; romãs: paz.',
      '5 côvados; rendilhado: unidade, união e harmonia; lírios: pureza, castidade e inocência; romãs: abundância e fertilidade.',
      '7 côvados; rendilhado: proteção; lírios: luz; romãs: amizade.',
      '12 côvados; rendilhado: segredo; lírios: fé; romãs: vida eterna.'
    ],
    correctOptionIndex: 1,
    explanation: 'Os capitéis mediam 5 côvados; o rendilhado significa unidade, união e harmonia; os lírios expressam pureza, castidade e inocência; e as romãs representam abundância e fertilidade.'
  },
  {
    id: 'q2-7',
    questionText: 'Como e em que época teve origem a Palavra Schiboleth?',
    category: 'História e Legislação',
    options: [
      'Na fundação da Grande Loja da Inglaterra em 1717.',
      'Na guerra de Jefté contra os efrainitas, por volta de 1045 a.C.',
      'Na construção das pirâmides do Egito sob o faraó Quéops.',
      'Durante as Cruzadas em Jerusalém no século XI.'
    ],
    correctOptionIndex: 1,
    explanation: 'A palavra Schiboleth originou-se na guerra de Jefté, chefe dos gileaditas, contra os efrainitas, aproximadamente em 1045 a.C.'
  },
  {
    id: 'q2-8',
    questionText: 'O que representa a Coluna que está na direção do Altar do Irmão Chanceler?',
    category: 'Ritualística e Símbolos',
    options: [
      'Ordem Dórica; Força.',
      'Ordem Coríntia; Beleza.',
      'Ordem Jônica; Sabedoria.',
      'Ordem Toscana; Humildade.'
    ],
    correctOptionIndex: 2,
    explanation: 'A Coluna na direção do Altar do Irmão Chanceler representa a Ordem Jônica, que simboliza a Sabedoria.'
  },
  {
    id: 'q2-9',
    questionText: 'Quais são os instrumentos que o Companheiro carrega em sua segunda viagem?',
    category: 'Ritualística e Símbolos',
    options: [
      'Maço e cinzel',
      'Régua e compasso',
      'Alavanca e régua',
      'Esquadro e régua'
    ],
    correctOptionIndex: 1,
    explanation: 'Na sua segunda viagem, o Companheiro carrega a Régua e o Compasso.'
  },
  {
    id: 'q2-10',
    questionText: 'Quando galgastes os cinco degraus do Templo, o que vistes junto ao Pórtico?',
    category: 'Ritualística e Símbolos',
    options: [
      'O Mar de Bronze',
      'O Altar dos Holocaustos',
      'Duas grandes colunas (J e B)',
      'O Painel do Grau'
    ],
    correctOptionIndex: 2,
    explanation: 'Ao subir os cinco degraus, encontram-se as duas grandes colunas J e B situadas junto ao Pórtico do Templo.'
  },
  {
    id: 'q2-11',
    questionText: 'O que representa a Coluna que está próxima do Altar do 1° Vigilante?',
    category: 'Ritualística e Símbolos',
    options: [
      'Ordem Jônica; Sabedoria.',
      'Ordem Toscana; Humildade (ideal de beleza e funcionalidade).',
      'Ordem Compósita; Harmonia.',
      'Ordem Dórica; Força.'
    ],
    correctOptionIndex: 1,
    explanation: 'A Coluna próxima ao Altar do 1° Vigilante representa a Ordem Toscana, que evoca a Humildade (essência de utilidade combinada à beleza).'
  },
  {
    id: 'q2-12',
    questionText: 'Quais são os instrumentos que o Companheiro carrega em sua quarta viagem?',
    category: 'Ritualística e Símbolos',
    options: [
      'Régua e compasso',
      'Alavanca e régua',
      'Esquadro e régua',
      'Maço e escopro'
    ],
    correctOptionIndex: 2,
    explanation: 'Na quarta viagem, o Companheiro carrega o Esquadro e a Régua.'
  },
  {
    id: 'q2-13',
    questionText: 'Por que eram ocas as duas grandes Colunas?',
    category: 'Ritualística e Símbolos',
    options: [
      'Para economizar o bronze utilizado na fundição.',
      'Para servirem de arquivo e guardar tesouros e ferramentas.',
      'Para que o som do sino pudesse ecoar no Templo.',
      'Para permitir a passagem de luz solar durante o solstício.'
    ],
    correctOptionIndex: 1,
    explanation: 'As colunas eram ocas para permitir a guarda segura de ferramentas, manuscritos, tesouros e arquivos.'
  },
  {
    id: 'q2-14',
    questionText: 'Por que a Estrela Flamígera é tomada como símbolo do Companheiro?',
    category: 'Filosofia e Doutrina',
    options: [
      'Porque representa a luz do sol nascente no oriente.',
      'Porque o companheiro deve tornar-se um fogo ardente, fonte de luz e calor.',
      'Porque é o sinal de identificação dos pastores da Judéia.',
      'Porque simboliza a estrela que guiou os Reis Magos.'
    ],
    correctOptionIndex: 1,
    explanation: 'A Estrela Flamígera representa que o Companheiro deve arder em zelo e dedicação, tornando-se uma fonte ativa de luz, calor espiritual e instrução moral.'
  },
  {
    id: 'q2-15',
    questionText: 'Quais são os instrumentos que o Companheiro carrega em sua quinta viagem?',
    category: 'Ritualística e Símbolos',
    options: [
      'Alavanca',
      'Régua',
      'Esquadro',
      'Nenhum instrumento'
    ],
    correctOptionIndex: 3,
    explanation: 'Na quinta viagem, o Companheiro não carrega nenhum instrumento físico, simbolizando a pura contemplação moral.'
  },
  {
    id: 'q2-16',
    questionText: 'O que simboliza a marcha irregular do Companheiro?',
    category: 'Filosofia e Doutrina',
    options: [
      'A dificuldade de caminhar em terrenos acidentados.',
      'Que o companheiro pode afastar-se do caminho para colher a verdade, mas deve voltar à retidão.',
      'O desequilíbrio das paixões humanas que ainda não foram vencidas.',
      'A busca pela saída do labirinto da ignorância profana.'
    ],
    correctOptionIndex: 1,
    explanation: 'A marcha irregular simboliza que, em sua busca pelo saber, o Companheiro pode afastar-se momentaneamente do curso direto, mas deve sempre saber retornar firmemente à direção reta.'
  },
  {
    id: 'q2-17',
    questionText: 'Quais são os ornamentos da Loja de Companheiro?',
    category: 'Ritualística e Símbolos',
    options: [
      'As Jóias Móveis, Jóias Imóveis e o Dossel.',
      'O Pavimento Mosaico, a Estrela Rutilante e a Orla Dentada.',
      'O Livro da Lei, o Esquadro e o Compasso.',
      'O Sol, a Lua e o Mestre da Loja.'
    ],
    correctOptionIndex: 1,
    explanation: 'Os ornamentos da Loja de Companheiro permanecem os três principais: o Pavimento de Mosaico, a Estrela Rutilante e a Orla Dentada.'
  },
  {
    id: 'q2-18',
    questionText: '“O Venerável estava vestido de ouro e azul.” O que significam estas cores?',
    category: 'Filosofia e Doutrina',
    options: [
      'Sol e Céu.',
      'Riqueza e Sabedoria.',
      'Nobreza e Divindade.',
      'Fogo e Ar.'
    ],
    correctOptionIndex: 2,
    explanation: 'O ouro e o azul celeste vestindo o Venerável representam espiritualmente a Nobreza moral e a essência da Divindade.'
  },
  {
    id: 'q2-19',
    questionText: 'Qual é a relação existente entre a régua e o compasso?',
    category: 'Filosofia e Doutrina',
    options: [
      'Régua: o início do trabalho; Compasso: a finalização.',
      'Régua: o direito inflexível (lei moral); Compasso: o círculo da relatividade.',
      'Régua: a matéria; Compasso: o espírito.',
      'Régua: a inteligência; Compasso: a razão.'
    ],
    correctOptionIndex: 1,
    explanation: 'A régua simboliza a linha reta inflexível e os limites da lei moral, enquanto o compasso delimita o círculo de nossas ações em relação a nossos semelhantes, expressando moderação na relatividade da vida.'
  },
  {
    id: 'q2-20',
    questionText: 'Quais foram os três Grão-Mestres que presidiram a construção do primeiro Templo em Jerusalém?',
    category: 'História e Legislação',
    options: [
      'David, Salomão e Roboão.',
      'Salomão, Hiram de Tiro e Adonhiram.',
      'Moisés, Aarão e Josué.',
      'Zorobabel, Esdras e Neemias.'
    ],
    correctOptionIndex: 1,
    explanation: 'Na mítica de base Adonhiramita, os três dirigentes da obra do templo de Jerusalém foram o Rei Salomão, o Rei Hiram de Tiro e o Administrador-Mestre Adonhiram.'
  },
  {
    id: 'q2-21',
    questionText: 'O que indica a letra B?',
    category: 'Ritualística e Símbolos',
    options: [
      'Beleza',
      'Bondade',
      'Boaz (ou Booz); "Na força" ou "A força está em Deus".',
      'Beneficência'
    ],
    correctOptionIndex: 2,
    explanation: 'A coluna B denota Booz (ou Boaz), que significa "Na força" ou "A força está em Deus".'
  },
  {
    id: 'q2-22',
    questionText: 'Porque se diz que “cinco constituem a Loja”?',
    category: 'Filosofia e Doutrina',
    options: [
      'Por causa dos cinco degraus da escada.',
      'Em consideração às cinco ordens de arquitetura.',
      'Devido aos cinco sentidos do homem.',
      'Porque são cinco os oficiais que assinam a ata.'
    ],
    correctOptionIndex: 1,
    explanation: 'Diz-se que cinco formam ou constituem a Loja em consideração direta às cinco ordens fundamentais de arquitetura clássica: Dórica, Jônica, Coríntia, Toscana e Compósita.'
  },
  {
    id: 'q2-23',
    questionText: 'A que alude a lenda da Escada em Caracol? Como a interpretais?',
    category: 'Filosofia e Doutrina',
    options: [
      'Alude à subida aos céus; perseverança.',
      'Alude ao conhecimento científico; estudo.',
      'Alude ao esforço do iniciado para subir em busca da luz; fé.',
      'Opinião do Obreiro.'
    ],
    correctOptionIndex: 3,
    explanation: 'A interpretação subjetiva da subida pelos degraus da Escada em Caracol varia individualmente, mantendo a resposta em aberto como uma reflexão pessoal.'
  },
  {
    id: 'q2-24',
    questionText: 'Qual era o nome do general Gileadita que derrotou os Efrainitas? Qual a origem da desavença?',
    category: 'História e Legislação',
    options: [
      'Saul; disputa pelo trono de Israel.',
      'Jefté; não participação dos efrainitas nos despojos da guerra amonita.',
      'Josué; partilha desigual das terras de Canaã.',
      'Gideão; recusa em prestar culto a Iahweh.'
    ],
    correctOptionIndex: 1,
    explanation: 'O general era Jefté; a desavença ocorreu porque os efrainitas reclamaram de forma violenta sobre não terem sido chamados para participar do combate e subsequente partilha de conquistas contra os amonitas.'
  },
  {
    id: 'q2-25',
    questionText: 'Por que Sete tornam uma Loja Perfeita?',
    category: 'Filosofia e Doutrina',
    options: [
      'Por causa das sete cores do arco-íris.',
      'Porque Salomão gastou mais de sete anos na construção do templo.',
      'Devido aos sete pecados capitais que devem ser vencidos.',
      'Em honra às sete notas musicais.'
    ],
    correctOptionIndex: 1,
    explanation: 'Diz-se que sete tornam a Loja Perfeita em memória ao fato histórico-simbólico de que o rei Salomão dispendeu pouco mais de sete anos para erguer o Templo de Jerusalém.'
  },
  {
    id: 'q2-26',
    questionText: 'Cinco Anos é a idade do Companheiro. A que este número se refere?',
    category: 'Filosofia e Doutrina',
    options: [
      'Refere-se aos cinco degraus do trono.',
      'Refere-se aos cinco sentidos e à quintessência.',
      'Refere-se aos cinco anos de trabalho no campo.',
      'Refere-se às cinco chagas de Cristo.'
    ],
    correctOptionIndex: 1,
    explanation: 'A mística idade de cinco anos do Companheiro refere-se aos cinco canais de recepção sensorial (sentidos) combinados com o refinamento espiritual supremo (a quintessência).'
  },
  {
    id: 'q2-27',
    questionText: 'Três Mestres Maçons conduzem símbolos que são depositados no Pavimento Mosaico. Quais são e o que significam tais símbolos?',
    category: 'Ritualística e Símbolos',
    options: [
      'Régua, Compasso e Esquadro; simbolizam a lei.',
      'Pão, Vinho e Azeite; simbolizam o salário.',
      'Pontos dispostos em 1, 2, 3, 4 (Tetraktys); simbolizam o desenvolvimento das formas.',
      'Incenso, Fogo e Água; simbolizam a purificação.'
    ],
    correctOptionIndex: 2,
    explanation: 'Os símbolos depositados formam a Tetraktys pitagórica (pontos em arranjo 1, 2, 3, 4), expressando o desabrochar progressivo das formas universais.'
  },
  {
    id: 'q2-28',
    questionText: 'O que é, em vosso entender, ser Companheiro?',
    category: 'Filosofia e Doutrina',
    options: [
      'É ser um auxiliar dos mestres.',
      'É aprender a usar o esquadro.',
      'Opinião do Obreiro.',
      'É frequentar as sessões com assiduidade.'
    ],
    correctOptionIndex: 2,
    explanation: 'Definir intimamente o que é caminhar sob o título de Companheiro Maçom é uma prerrogativa individual e interpretativa.'
  },
  {
    id: 'q2-29',
    questionText: 'Para que se reúnem os Companheiros?',
    category: 'Filosofia e Doutrina',
    options: [
      'Para discutir assuntos políticos e sociais.',
      'Para se instruírem na Arte Real e estudar as ciências exigidas.',
      'Para organizar eventos de beneficência.',
      'Para confraternizarem após o trabalho profano.'
    ],
    correctOptionIndex: 1,
    explanation: 'O objetivo do labor do Companheiro é instruir-se devidamente nas pautas intelectuais da Arte Real e dedicar-se ao estudo de ciências e filosofias de aperfeiçoamento.'
  },
  {
    id: 'q2-30',
    questionText: 'Qual é o vosso conceito de Vida?',
    category: 'Filosofia e Doutrina',
    options: [
      'É o sopro divino na matéria.',
      'É um ciclo de renascimentos.',
      'Opinião do Obreiro.',
      'É a manifestação da energia universal.'
    ],
    correctOptionIndex: 2,
    explanation: 'O mistério sublime da existência e do sopro vital recebe resposta estritamente íntima de cada iniciante.'
  },
  {
    id: 'q2-31',
    questionText: 'Como concebeis o Tetragrama?',
    category: 'Filosofia e Doutrina',
    options: [
      'Como o nome secreto da Ordem.',
      'Como as quatro provas da iniciação.',
      'Opinião do Obreiro.',
      'Como a união dos quatro elementos.'
    ],
    correctOptionIndex: 2,
    explanation: 'A significação transcendente das quatro letras sagradas hebraicas que formam o nome inefável do Criador é respondida filosoficamente de modo individual.'
  },
  {
    id: 'q2-32',
    questionText: 'Em que consiste o gênio?',
    category: 'Filosofia e Doutrina',
    options: [
      'Na capacidade de inventar novas ferramentas.',
      'Na exaltação das atividades intelectuais, imaginação e intuição.',
      'No dom de falar várias línguas estrangeiras.',
      'Na habilidade de governar grandes multidões.'
    ],
    correctOptionIndex: 1,
    explanation: 'A faculdade genial consiste no ápice coordenado de nossa imaginação profunda, faculdades de cognição intelectual e clarividência intuitiva.'
  },
  {
    id: 'q2-33',
    questionText: 'Dai vossa interpretação esotérica do Esquadro.',
    category: 'Filosofia e Doutrina',
    options: [
      'É a ferramenta do mestre.',
      'É a medida do mundo físico.',
      'Opinião do Obreiro.',
      'É o equilíbrio entre o vertical e o horizontal.'
    ],
    correctOptionIndex: 2,
    explanation: 'As lições geométricas e as implicações esotéricas que o Esquadro encarna são interpretadas de maneira livre e pessoal.'
  },
  {
    id: 'q2-34',
    questionText: 'O que é a quintessência do ponto de vista hermético?',
    category: 'Filosofia e Doutrina',
    options: [
      'O extrato de cinco ervas medicinais.',
      'O sopro vital ou a matriz primordial que gera a matéria.',
      'A união dos quatro evangelistas.',
      'A quinta nota da escala musical.'
    ],
    correctOptionIndex: 1,
    explanation: 'Hermeticamente, a quintessência (ou o quinto elemento sutil) é o sopro vivificante e a matriz primordial que engendra o próprio nascimento substancial de toda a criação.'
  },
  {
    id: 'q2-35',
    questionText: 'Quais são as quatro letras do tetragrama?',
    category: 'Ritualística e Símbolos',
    options: [
      'A, B, G, D',
      'J, A, K, B',
      'Iod, He, Vau, He',
      'S, C, H, B'
    ],
    correctOptionIndex: 2,
    explanation: 'As consoantes fundamentais da grafia mister do Divino são Yodh, He, Waw, He (Iod, He, Vau, He).'
  },
  {
    id: 'q2-36',
    questionText: 'Analisai a luz da numerologia vosso nome profano e histórico.',
    category: 'Filosofia e Doutrina',
    options: [
      'Nome 1: criativo; Nome 2: líder.',
      'Nome 1: equilibrado; Nome 2: sonhador.',
      'Opinião do Obreiro.',
      'Nome 1: prático; Nome 2: místico.'
    ],
    correctOptionIndex: 2,
    explanation: 'O cálculo onomástico de identificação numérica vibratória de vossa alcunha pessoal é, naturalmente, individual.'
  },
  {
    id: 'q2-37',
    questionText: 'Analisai o nome NAPHTALI à luz da Tábua Hebraica.',
    category: 'Filosofia e Doutrina',
    options: [
      'Equivale a 12.',
      'Equivale a 25.',
      'Equivale aos valores das letras: N=50, A=1, P=7, H=5, T=400, A=1, L=30, I=10.',
      'Equivale ao número de ouro.'
    ],
    correctOptionIndex: 2,
    explanation: 'De acordo com os valores atribuídos na tábua das letras místicas: N=50, A=1, P=7, H=5, T=400, A=1, L=30, I=10.'
  },
  {
    id: 'q2-38',
    questionText: 'Analisai o nome Cabala (KABBALAH) à luz da Tábua Hebraica.',
    category: 'Filosofia e Doutrina',
    options: [
      'Q=100, B=2, L=30, H=5 (QBLH).',
      'C=3, A=1, B=2, A=1, L=30, A=1.',
      'K=20, A=1, B=2, A=1, L=30, A=1.',
      'S=60, I=10, L=30, B=2.'
    ],
    correctOptionIndex: 0,
    explanation: 'A estruturação silábica ou das consoantes na chave hebraica QBLH (Qabalah) traduz-se numericamente por Q=100, B=2, L=30, H=5.'
  },
  {
    id: 'q2-39',
    questionText: 'Por que ninguém ainda conseguiu a posse da Verdade?',
    category: 'Filosofia e Doutrina',
    options: [
      'Porque a verdade está escondida nos livros proibidos.',
      'Porque exige a renúncia do eu individual para atingir o Todo (Absoluto).',
      'Porque os segredos foram perdidos com a morte de Hiram.',
      'Porque os homens preferem a mentira e o vício.'
    ],
    correctOptionIndex: 1,
    explanation: 'A verdade eterna e integral permanece inalcançável enquanto houver apego às imperfeições do ego de separação, pois descobri-la verdadeiramente exige unificar-se desinteressadamente ao Todo absoluto.'
  },
  {
    id: 'q2-40',
    questionText: 'A que conduz o exercício da Meditação?',
    category: 'Filosofia e Doutrina',
    options: [
      'Ao sono profundo e reparador.',
      'À compreensão profunda, inspiração e sintonia com o mundo Cósmico.',
      'Ao desenvolvimento de poderes sobrenaturais.',
      'Ao isolamento da sociedade humana.'
    ],
    correctOptionIndex: 1,
    explanation: 'A reflexão silenciosa e a meditação interior propiciam discernimento profundo, sintonizando os canais da mente com o fluxo harmônico do universo cósmico.'
  },
  {
    id: 'q2-41',
    questionText: 'Quais são os quatro sinais fundamentais do ideografismo?',
    category: 'Ritualística e Símbolos',
    options: [
      'Reta, Curva, Ponto, Espiral.',
      'Círculo, Cruz, Triângulo, Quadrado.',
      'Sol, Lua, Estrela, Planeta.',
      'Maço, Cinzel, Régua, Compasso.'
    ],
    correctOptionIndex: 1,
    explanation: 'As formas basilares da representação ideográfica do pensamento geométrico e humano são o Círculo, a Cruz, o Triângulo e o Quadrado.'
  },
  {
    id: 'q2-42',
    questionText: 'Qual é o significado da letra IOD?',
    category: 'Filosofia e Doutrina',
    options: [
      'Inteligência e Ordem Divina.',
      'Princípio ativo, causa primeira, o Ser que pensa.',
      'Início de tudo o que existe.',
      'Justiça, Igualdade e Liberdade.'
    ],
    correctOptionIndex: 1,
    explanation: 'A letra Yod representa a energia geradora focal inicial, a faísca seminal e a causa ativa primária pensante.'
  },
  {
    id: 'q2-43',
    questionText: 'O que representa o Signo de Salomão?',
    category: 'Ritualística e Símbolos',
    options: [
      'O domínio sobre os espíritos da natureza.',
      'O macrocosmo e a harmonia entre o mundo divino e material.',
      'A planta do Templo de Jerusalém.',
      'A assinatura dos mestres pedreiros medievais.'
    ],
    correctOptionIndex: 1,
    explanation: 'O hexagrama (ou Signo de Salomão) simboliza a correlação harmoniosa perfeita e o equilíbrio benéfico entre o macrocosmo divino e o plano material terreno.'
  },
  {
    id: 'q2-44',
    questionText: 'Quais são os instrumentos que o Companheiro utiliza para transformar a Pedra Bruta em Pedra Cúbica?',
    category: 'Ritualística e Símbolos',
    options: [
      'Maço e Cinzel (escopro).',
      'Régua e Compasso.',
      'Alavanca e Esquadro.',
      'Prumo e Nível.'
    ],
    correctOptionIndex: 0,
    explanation: 'O desbaste das arestas e o nivelamento para transformar a Pedra Bruta em Pedra Cúbica requerem a aplicação coordenada do Maço e do Cinzel (escopro).'
  },
  {
    id: 'q2-45',
    questionText: 'Qual é a grande modificação Iniciática representada pela passagem da Coluna “J” para a Coluna “B”?',
    category: 'Filosofia e Doutrina',
    options: [
      'A troca do avental de aprendiz pelo de companheiro.',
      'A passagem da disciplina racional (razão) para a sensibilidade e imaginação.',
      'A mudança do lado norte para o lado sul do templo.',
      'O aumento de salário pago em moedas de ouro.'
    ],
    correctOptionIndex: 1,
    explanation: 'A transição representa sair dos limites severos do rigor da pura lógica ou razão fria (J) para desabrochar os potenciais do sentir, da imaginação fecunda e sensibilidade intuitiva (B).'
  },
  {
    id: 'q2-46',
    questionText: 'Quais são as joias da Loja de Companheiro?',
    category: 'Símbolos e Jóias',
    options: [
      'A Bíblia, o Esquadro e o Compasso.',
      'Móveis: Esquadro, Nível e Prumo. Imóveis: Pedra Bruta, Pedra Cúbica e Painel.',
      'O Sol, a Lua e a Estrela Flamígera.',
      'O Malhete, a Espada e o Livro de Atas.'
    ],
    correctOptionIndex: 1,
    explanation: 'As joias da oficina de Companheiro compreendem as móveis (Esquadro, Nível, Prumo) e as imóveis (Pedra Bruta, Pedra Cúbica, Painel).'
  },
  {
    id: 'q2-47',
    questionText: 'Como vós conheceis o número 7?',
    category: 'Filosofia e Doutrina',
    options: [
      'Como o número da sorte.',
      'Como o número da harmonia e do equilíbrio estabelecido.',
      'Como o número de dias da semana profana.',
      'Como o número de maravilhas do mundo.'
    ],
    correctOptionIndex: 1,
    explanation: 'Nas chaves tradicionais das ciências simbólicas, o sete consagra-se como o número que expressa a harmonia cósmica absoluta e a perfeita ordem de equilíbrio estabelecida.'
  },
  {
    id: 'q2-48',
    questionText: 'O que representa a síntese na Numerologia?',
    category: 'Filosofia e Doutrina',
    options: [
      'A unificação ou redução de um número complexo à unidade.',
      'A soma dos anos de vida do iniciado.',
      'O resumo de todas as leis da natureza.',
      'A divisão do nome em partes iguais.'
    ],
    correctOptionIndex: 0,
    explanation: 'A síntese ou redução teosófica consiste em unificar qualquer montante ou soma de caracteres numéricos complexos, reduzindo-os por soma simples a uma única unidade entre 1 e 9.'
  },
  {
    id: 'q2-49',
    questionText: 'Por que existem e quais são as qualidades exigidas dos Maçons?',
    category: 'Filosofia e Doutrina',
    options: [
      'Para governar o mundo; sabedoria e poder.',
      'Cumprir obrigações, fugir do vício e praticar a virtude.',
      'Para praticar a caridade; riqueza e bondade.',
      'Para estudar os astros; inteligência e curiosidade.'
    ],
    correctOptionIndex: 1,
    explanation: 'As diretrizes morais exigem de todo maçon cumprir seus deveres éticos, afastar-se de falhas de caráter (vício) e cultivar diligentemente as virtudes.'
  },
  {
    id: 'q2-50',
    questionText: 'Onde está situada a Loja de Companheiro?',
    category: 'Ritualística e Símbolos',
    options: [
      'No Oriente, onde nasce a luz.',
      'No Sul (Meio-dia).',
      'No Norte (Setentrião).',
      'No centro do Piso Mosaico.'
    ],
    correctOptionIndex: 1,
    explanation: 'A Loja de Companheiro situa-se misticamente na região meridional, correspondente ao Sul ou Meio-dia, onde brilha a coluna mais iluminada.'
  },
  {
    id: 'q2-51',
    questionText: 'Por que e a quem é dedicada a Loja onde fostes recebidos?',
    category: 'História e Legislação',
    options: [
      'A Salomão, por ter construído o templo.',
      'A São João de Jerusalém, devido à tradição das Cruzadas.',
      'A Hiram Abiff, em memória do seu sacrifício.',
      'Ao Grande Arquiteto do Universo, criador de tudo.'
    ],
    correctOptionIndex: 1,
    explanation: 'As oficinas são tradicionalmente dedicadas a São João de Jerusalém (o Batista e o Evangelista), honrando costumes consagrados desde a época das Cruzadas.'
  },
  {
    id: 'q2-52',
    questionText: 'Como podeis fazer reconhecer-vos Companheiro?',
    category: 'Ritualística e Símbolos',
    options: [
      'Pela cor azul do debrum do avental.',
      'Por meio de um sinal, um toque e duas palavras (passagem e sagrada).',
      'Pela idade de sete anos.',
      'Pela forma de segurar o malhete.'
    ],
    correctOptionIndex: 1,
    explanation: 'O Companheiro faz-se identificar exibindo o Sinal correspondente, o Toque particular, e fornecendo a Palavra de Passe (Schiboleth) e a Palavra Sagrada.'
  },
  {
    id: 'q2-53',
    questionText: 'Onde ficam assentados os Companheiros e por quê?',
    category: 'Ritualística e Símbolos',
    options: [
      'Ao Norte, para aprender com os aprendizes.',
      'Ao Sul, para receber as ordens dos mestres.',
      'No Oriente, para auxiliar o venerável mestre.',
      'Ao Ocidente, para guardar a porta do templo.'
    ],
    correctOptionIndex: 1,
    explanation: 'Assentam-se na Coluna do Sul (Meio-dia) para realizar seus trabalhos sob maior incidência de claridade intelectual e receber as devidas orientações.'
  },
  {
    id: 'q2-54',
    questionText: 'Dai o significado do Hexagrama.',
    category: 'Filosofia e Doutrina',
    options: [
      'Representa o selo dos templários.',
      'Representa o macrocosmo e o equilíbrio entre os opostos.',
      'Representa as seis etapas da criação do mundo.',
      'Representa a união das seis colunas do templo.'
    ],
    correctOptionIndex: 1,
    explanation: 'O hexagrama expressa o macrocosmo e o perfeito equilíbrio entre as forças opostas (o plano superior divino e o plano inferior material).'
  },
  {
    id: 'q2-55',
    questionText: 'Por que o Aprendiz deve descer à Câmara de Reflexão antes de ser recebido Companheiro?',
    category: 'Filosofia e Doutrina',
    options: [
      'Para verificar se o local está limpo.',
      'Para um momento de introspecção, silêncio e purificação.',
      'Para buscar as ferramentas que esqueceu no primeiro grau.',
      'Para ser testado quanto ao medo da escuridão.'
    ],
    correctOptionIndex: 1,
    explanation: 'O recolhimento à silenciosa Câmara propicia um momento profundo de introspecção e depuração moral antes da elevação intelectual.'
  },
  {
    id: 'q2-56',
    questionText: 'Quais são e como são simbolizadas as virtudes do Perfeito Companheiro?',
    category: 'Filosofia e Doutrina',
    options: [
      'Fé, Esperança e Caridade.',
      'Amável, Severo, Benéfico, Incorruptível e Casto.',
      'Prudência, Temperança, Fortaleza e Justiça.',
      'Lealdade, Honestidade e Sinceridade.'
    ],
    correctOptionIndex: 1,
    explanation: 'Em sua cartilha formativa, o modelo que rege a conduta ética do Companheiro inspira-se nos atributos: Amável, Severo, Benéfico, Incorruptível e Casto.'
  },
  {
    id: 'q2-57',
    questionText: 'Qual é o significado do Pentalfa?',
    category: 'Ritualística e Símbolos',
    options: [
      'A estrela de cinco pontas; o homem iniciado (Atreo, Aisto...).',
      'A união dos cinco oficiais de honra.',
      'O conjunto das cinco ferramentas de trabalho.',
      'O nome das cinco colunas do Piso Mosaico.'
    ],
    correctOptionIndex: 0,
    explanation: 'A estrela de cinco vértices simboliza a Pentalfa ou pentagrama, representando o homem espiritualizado e consciente.'
  },
  {
    id: 'q2-58',
    questionText: 'Por que o Venerável Mestre tem assento no Oriente?',
    category: 'Filosofia e Doutrina',
    options: [
      'Para ficar longe da porta de entrada.',
      'Porque do Oriente vem a luz e a sabedoria.',
      'Because é o lugar mais confortável da loja.',
      'Para poder vigiar melhor as colunas.'
    ],
    correctOptionIndex: 1,
    explanation: 'O trono se situa no Oriente em alusão ao nascente do Sol, representando a fonte de instrução moral, iluminação e sabedoria.'
  },
  {
    id: 'q2-59',
    questionText: 'Por que, esotericamente, no vosso entender, o Cobridor tem assento junto à porta do Templo?',
    category: 'Filosofia e Doutrina',
    options: [
      'Para impedir a entrada de correntes de ar.',
      'Porque o guarda deve estar no limite entre o sagrado e o profano.',
      'Opinião do Obreiro.',
      'Para conferir as luvas dos irmãos.'
    ],
    correctOptionIndex: 2,
    explanation: 'A justificativa para o Cobridor assentar-se rente à entrada do Templo recebe livre interpretação íntima e pessoal de cada Companheiro.'
  },
  {
    id: 'q2-60',
    questionText: 'Dai vossa interpretação do 2° Grau e expressai vossos comentários sobre o mesmo.',
    category: 'Filosofia e Doutrina',
    options: [
      'É um grau de transição sem importância real.',
      'É a fase de maior estudo das ciências.',
      'É o grau que molda o maçom do futuro.',
      'Opinião do Obreiro.'
    ],
    correctOptionIndex: 3,
    explanation: 'As impressões particulares e os comentários analíticos sobre a vivência do segundo grau consagram-se como uma prerrogativa de reflexão pessoal.'
  }
];
