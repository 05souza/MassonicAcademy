import { QuestionnaireQuestion } from '../types';

export const GRAU_1_RITUALISTICA_QUESTIONS: QuestionnaireQuestion[] = [
  {
    id: 'g1r-1',
    questionText: 'Um Irmão quer publicar trechos da obra em seu Instagram. Isso é:',
    category: 'Apresentação',
    options: [
      'Permitido, desde que cite a fonte.',
      'Proibido — a publicação em sites abertos ao público é vedada.',
      'Permitido apenas para maçons regulares.',
      'Permitido com autorização do GOB.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "é proibida sua publicação em sites abertos ao público em geral, páginas do Facebook, Instagram, etc."'
  },
  {
    id: 'g1r-4',
    questionText: 'O Revigoramento da Chama Sagrada simbolicamente reproduz:',
    category: 'Revigoramento da Chama Sagrada',
    options: [
      'A paixão de Cristo.',
      'A criação do Universo segundo a tradição judaico-cristã.',
      'A construção do Templo de Salomão.',
      'A lenda de Hiram Abif.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "O processo de abertura da Loja no Rito Adonhiramita simbolicamente reproduz a criação do Universo segundo a tradição judaico-cristã"'
  },
  {
    id: 'g1r-5',
    questionText: 'Quantos e quais Irmãos executam o Revigoramento da Chama Sagrada?',
    category: 'Revigoramento da Chama Sagrada',
    options: [
      'Três: Arq, 1° Exp e Mestr de CCer.',
      'Quatro: Arq, 2° Exp, Mestr de CCer e Cobr Int.',
      'Dois: Mestr de CCer e Cobr Int.',
      'Cinco: Arq, 2° Exp, Mestr de CCer, Cobr Int e Mestr de Harm.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "é executada pelos IIrm Arq, 2° Exp, Mestr de CCer e Cobr Int"'
  },
  {
    id: 'g1r-6',
    questionText: 'Um Irmão diz que a circulação só se torna ritualística após a abertura da Loja. Isso está:',
    category: 'Revigoramento da Chama Sagrada',
    options: [
      'Correto.',
      'Errado — a circulação passa a ser ritualística após o Revigoramento da Chama Sagrada.',
      'Correto apenas para o Oriente.',
      'Correto apenas para visitantes.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "A partir deste momento todos desembainham suas espadas, pois simbolicamente se tornam os guardiões da Chama Sagrada, e a circulação passa a ser ritualística"'
  },
  {
    id: 'g1r-7',
    questionText: 'Na ausência dos titulares, quem pode executar o Revigoramento da Chama Sagrada?',
    category: 'Substituição de Oficiais',
    options: [
      'Apenas Mestr Maç do quadro da Loja.',
      'Qualquer Mestr Maç, inclusive visitantes e praticantes de outros Ritos.',
      'AApr e CComp em casos de emergência.',
      'Apenas o Ven Mestr e os VVig.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "a função poderá ser desempenhada por qualquer Mestr Maç, inclusive os visitantes e praticantes de outros Ritos"'
  },
  {
    id: 'g1r-8',
    questionText: 'Quantos cargos precisam estar ocupados para abertura da Loja no Rito Adonhiramita?',
    category: 'Substituição de Oficiais',
    options: [
      '5 cargos.',
      '7 cargos.',
      '9 cargos.',
      '3 cargos.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Para abertura da Loja no Rito Adonhiramita é necessário que 7 cargos estejam ocupados"'
  },
  {
    id: 'g1r-9',
    questionText: 'Um Irmão sugere que um AApr ajude no Revigoramento da Chama Sagrada por falta de MMestr. Isso é:',
    category: 'Substituição de Oficiais',
    options: [
      'Permitido em caso de emergência.',
      'Proibido — em hipótese alguma pode ser executado por AApr ou CComp.',
      'Permitido com autorização do Ven Mestr.',
      'Permitido apenas para AApr com mais de 2 anos.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Em hipótese alguma o Revigoramento da Chama Sagrada poderá ser executado por AApr ou CComp"'
  },
  {
    id: 'g1r-10',
    questionText: 'No Rito Adonhiramita, quem usa colares?',
    category: 'Uso das Joias',
    options: [
      'Todos os MMestr que ocupam cargos.',
      'Apenas o Ven Mestr e os dois VVig.',
      'Apenas o Ven Mestr.',
      'Todos os MMestr, independentemente de cargo.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Apenas o Ven Mestr e os dois VVig usam colares"'
  },
  {
    id: 'g1r-11',
    questionText: 'Sobre o uso de espadas pelo Ven Mestr e VVig:',
    category: 'Uso das Joias',
    options: [
      'Todos os MMestr usam espadas, inclusive Ven Mestr e VVig.',
      'O Ven Mestr e os dois VVig não usam espadas.',
      'Apenas o Ven Mestr não usa espada.',
      'Apenas os VVig não usam espadas.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "O Ven Mestr e os dois VVig não usam espadas, pois o instrumento de sua autoridade é o malhete"'
  },
  {
    id: 'g1r-12',
    questionText: 'Qual é a espada especial usada pelo Ven Mestr?',
    category: 'Uso das Joias',
    options: [
      'Espada de Cavaleiro.',
      'Espada Flamígera.',
      'Espada Reta.',
      'Espada Cerimonial.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "o Ven Mestr usa uma espada especial, a Espada Flamígera"'
  },
  {
    id: 'g1r-13',
    questionText: 'Sobre o uso de balandrau no Rito Adonhiramita, um visitante de outro Rito chega usando. Ele pode participar?',
    category: 'Traje',
    options: [
      'Não, balandrau é proibido em qualquer circunstância.',
      'Sim, se for visitante de Rito que permite e a sessão não for magna.',
      'Sim, em qualquer sessão.',
      'Apenas em sessões magnas.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "IIrm visitantes praticantes de outros Ritos que permitam o uso do balandrau poderão participar da sessão desde que esta não seja magna"'
  },
  {
    id: 'g1r-14',
    questionText: 'Qual é a gravata usada nas sessões ordinárias?',
    category: 'Traje',
    options: [
      'Gravata borboleta branca.',
      'Gravata branca do tipo corrido.',
      'Gravata preta.',
      'Gravata azul.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "gravata branca do tipo corrido nas sessões ordinárias, e modelo borboleta para as sessões magnas"'
  },
  {
    id: 'g1r-15',
    questionText: 'Um obreiro chega com tênis preto. Isso é:',
    category: 'Traje',
    options: [
      'Permitido se for preto.',
      'Proibido — não é permitido o uso de tênis.',
      'Permitido apenas em sessões ordinárias.',
      'Permitido para AApr.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Não é permitido o uso de tênis"'
  },
  {
    id: 'g1r-16',
    questionText: 'Quem organiza o cortejo de entrada?',
    category: 'Cortejo de Entrada',
    options: [
      'O Ven Mestr.',
      'O Mestr de CCer.',
      'O Cobr Int.',
      'O 1° Vig.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "o Mestr de CCer, que se posiciona de costas para a porta do Templo em Sinal de Guarda, é quem organiza o cortejo"'
  },
  {
    id: 'g1r-17',
    questionText: 'Segundo o SOR, quantas filas devem ser formadas no cortejo de entrada?',
    category: 'Cortejo de Entrada',
    options: [
      'Três filas.',
      'Cinco filas.',
      'Duas filas.',
      'Sete filas.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "O Serviço de Orientação Ritualística, SOR, do Grande Oriente do Brasil para o Rito Adonhiramita determina que sejam formadas cinco filas no cortejo de entrada"'
  },
  {
    id: 'g1r-18',
    questionText: 'Durante a formação do cortejo, dois Irmãos conversam no átrio. Isso é:',
    category: 'Cortejo de Entrada',
    options: [
      'Permitido em voz baixa.',
      'Proibido — não se deve conversar ou falar no átrio durante a formação do cortejo.',
      'Permitido para orientar visitantes.',
      'Não há restrição.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Não se deve conversar ou falar no átrio durante a formação do cortejo de entrada"'
  },
  {
    id: 'g1r-19',
    questionText: 'Qual é a ordem correta de ingresso dos obreiros no Templo?',
    category: 'Ingresso no Templo',
    options: [
      'MMestr primeiro, depois CComp, depois AApr.',
      'Primeiro AApr, depois CComp, MMestr da Col do N, MMestr da Col do S, e por fim MMestr com assento no Oriente.',
      'Ven Mestr primeiro, depois os demais.',
      'A ordem é livre.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Primeiro os AApr, depois os CComp, os MMestr da Col do N, os MMestr da Col do S, e por fim os MMestr com assento no Oriente"'
  },
  {
    id: 'g1r-20',
    questionText: 'Quem é o último a ingressar no Templo?',
    category: 'Ingresso no Templo',
    options: [
      'O Mestr de CCer.',
      'O Apr mais novo.',
      'O Ven Mestr.',
      'O Cobr Int.'
    ],
    correctOptionIndex: 2,
    explanation: 'Citação: "O Ven Mestr é o último a ingressar no Templo"'
  },
  {
    id: 'g1r-21',
    questionText: 'No Grau 1, qual é o sentido da circulação ritualística no Templo?',
    category: 'Ingresso no Templo',
    options: [
      'Anti-horário no Ocidente e horário no Oriente.',
      'Horário no Ocidente e anti-horário no Oriente.',
      'Apenas horário em todo o Templo.',
      'Apenas anti-horário em todo o Templo.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "No Grau 1 do Rito Adonhiramita a circulação é realizada no sentido horário no Ocidente e anti-horário no Oriente"'
  },
  {
    id: 'g1r-22',
    questionText: 'Quantos cargos são obrigatórios para abertura da Loja?',
    category: 'Preenchimento de Cargos',
    options: [
      '5 cargos.',
      '7 cargos.',
      '9 cargos.',
      '3 cargos.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Sete são os cargos obrigatórios a serem preenchidos"'
  },
  {
    id: 'g1r-23',
    questionText: 'Na ausência de MMestr suficientes, o Mestr de CCer acumulará quais funções?',
    category: 'Preenchimento de Cargos',
    options: [
      'Tes e Chanc.',
      'Hosp, 2° Exp e eventualmente P-Band.',
      'Or e Secr.',
      'Cobr Int e 1° Exp.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "o Mestr de CCer acumulará as funções de Hosp, 2° Exp e eventualmente de P-Band"'
  },
  {
    id: 'g1r-24',
    questionText: 'Quais cargos não atuam ritualisticamente?',
    category: 'Preenchimento de Cargos',
    options: [
      'Hosp e Mestr de Harm.',
      'Bibl e Mestr de Banq.',
      'Arq e 2° Exp.',
      'Tes e Chanc.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Os cargos de Bibl e Mestr de Banq não atuam ritualisticamente, por isso não foram citados"'
  },
  {
    id: 'g1r-25',
    questionText: 'Na ausência do Ven Mestr, quem é seu substituto imediato?',
    category: 'Substituição do Venerável Mestre',
    options: [
      'O 2° Vig.',
      'O 1° Vig.',
      'O Or.',
      'O Mestr de CCer.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "se o Ven Mestr estiver ausente na sessão seu substituto imediato é o 1° Vig"'
  },
  {
    id: 'g1r-26',
    questionText: 'Em sessões de admissão de membros e concessão de Graus, quem deve ocupar o cargo de Ven Mestr?',
    category: 'Substituição do Venerável Mestre',
    options: [
      'Qualquer Mestr Maç do quadro.',
      'Um Mestr Inst da Loja.',
      'Um Mestr visitante.',
      'O 1° Vig automaticamente.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Nas sessões de admissão de membros e concessão de Graus o cargo de Ven Mestr deverá obrigatoriamente ser ocupado por um Mestr Inst da Loja"'
  },
  {
    id: 'g1r-27',
    questionText: 'O Mestr que substitui o Ven Mestr usa colar e punhos?',
    category: 'Substituição do Venerável Mestre',
    options: [
      'Sim, sempre.',
      'Não usa o colar e os punhos.',
      'Usa apenas o colar.',
      'Usa apenas os punhos.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "o Mestr que substitui o Ven Mestr não usa o colar e os punhos"'
  },
  {
    id: 'g1r-28',
    questionText: 'Qual é o incenso preconizado pelo ritual?',
    category: 'Cerimônia da Incensação',
    options: [
      'Sândalo.',
      'Benjoim, ou alternativamente de rosas.',
      'Mirra.',
      'Olíbano.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "O incenso preconizado pelo ritual é o de benjoim, ou alternativamente de rosas"'
  },
  {
    id: 'g1r-29',
    questionText: 'Em que posição devem estar os obreiros durante a Cerimônia da Incensação?',
    category: 'Cerimônia da Incensação',
    options: [
      'Sentados, sem Sinal.',
      'De pé e sem executar qualquer Sinal.',
      'De pé, à Ordem.',
      'Sentados, à Ordem.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "É realizada com todos os obreiros dentro do Templo de pé e sem executar qualquer Sinal"'
  },
  {
    id: 'g1r-30',
    questionText: 'Um Irmão bater à porta durante a Cerimônia da Incensação. O que deve fazer?',
    category: 'Cerimônia da Incensação',
    options: [
      'Entrar imediatamente.',
      'Aguardar até que a Loja esteja aberta.',
      'Bater mais forte.',
      'Entrar em silêncio.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "os IIrm retardatários que baterem à porta do Templo durante sua realização deverão aguardar até que a Loja esteja aberta para ingressar"'
  },
  {
    id: 'g1r-31',
    questionText: 'O que representa o Cerimonial do Fogo?',
    category: 'Cerimonial do Fogo',
    options: [
      'A paixão de Cristo.',
      'O desdobramento da Chama Sagrada nas três Luzes da Loja.',
      'A criação do mundo.',
      'A morte de Hiram Abif.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "o Cerimonial do Fogo representa o desdobramento da Chama Sagrada ou Fogo Eterno nas três Luzes da Loja, Sabedoria, Força e Beleza"'
  },
  {
    id: 'g1r-32',
    questionText: 'Um Irmão trouxe velas coloridas e de sete dias para o Cerimonial do Fogo. Isso é:',
    category: 'Cerimonial do Fogo',
    options: [
      'Permitido se forem da cor do Grau.',
      'Proibido — velas coloridas e de sete dias não devem ser utilizadas.',
      'Permitido apenas para sessões magnas.',
      'Permitido apenas para velas de sete dias.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Não devem ser utilizadas velas coloridas ou de sete dias"'
  },
  {
    id: 'g1r-33',
    questionText: 'Quantas velas dos candelabros das Luzes da Loja são acesas?',
    category: 'Cerimonial do Fogo',
    options: [
      'Todas as velas.',
      'Apenas a vela do braço central.',
      'Apenas as velas laterais.',
      'Apenas uma vela por candelabro.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Apenas a vela do braço central dos candelabros das Luzes da Loja é acesa"'
  },
  {
    id: 'g1r-34',
    questionText: 'Se a Chama Sagrada se apagar, o que deve ser feito?',
    category: 'Reacendendo as Velas',
    options: [
      'Reacender diretamente com fósforo.',
      'O Mestr de CCer alimentará o acendedor na Chama da Sabedoria e a revigorará.',
      'A sessão deve ser interrompida.',
      'O Ven Mestr deve reacender com uma vela nova.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Se a Chama Sagrada se apagar o Mestr de CCer alimentará o acendedor na Chama da Sabedoria e a revigorará"'
  },
  {
    id: 'g1r-35',
    questionText: 'Durante o reacendimento das velas, há falas ritualísticas?',
    category: 'Reacendendo as Velas',
    options: [
      'Sim, o Ven Mestr profere palavras.',
      'Sim, o Mestr de CCer faz a locução.',
      'Não, o reacendimento é feito em silêncio.',
      'Sim, o Or recita um versículo.'
    ],
    correctOptionIndex: 2,
    explanation: 'Citação: "Em nenhuma das hipóteses comentadas existem falas ritualísticas, o reacendimento das velas é feito em silêncio"'
  },
  {
    id: 'g1r-36',
    questionText: 'Se a Chama da Beleza se apagar, quem a revigorará?',
    category: 'Reacendendo as Velas',
    options: [
      'O Ven Mestr.',
      'O 1° Vig.',
      'O 2° Vig.',
      'O Mestr de CCer.'
    ],
    correctOptionIndex: 2,
    explanation: 'Citação: "Se a Chama da Beleza se apagar o Mestr de CCer alimentará o acendedor na Chama da Força e o entregará ao 2° Vig que a revigorará"'
  },
  {
    id: 'g1r-37',
    questionText: 'Se o sino estiver fixo na parede, como o Cobr Int deve proceder durante as Vibrações Argentinas?',
    category: 'Doze Vibrações Argentinas',
    options: [
      'Colocar a espada no suporte e usar as duas mãos.',
      'Estender o braço esquerdo para acionar o badalo, mantendo a espada na mão direita.',
      'Entregar a espada ao Mestr de CCer.',
      'Sair do Templo.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "basta que o Cobr Int estenda seu braço esquerdo para acionar o badalo, mantendo a espada segura pela mão direita"'
  },
  {
    id: 'g1r-38',
    questionText: 'Em Lojas sem suporte de chão para espada, onde ela deve ser posicionada?',
    category: 'Doze Vibrações Argentinas',
    options: [
      'Sobre a mesa do Ven Mestr.',
      'No chão, com a ponta voltada para a porta.',
      'Pendurada na parede.',
      'Embainhada no cinto.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "esta deve ser posicionada no chão, com a ponta voltada para a porta"'
  },
  {
    id: 'g1r-39',
    questionText: 'Como devem ser as pancadas no sino?',
    category: 'Doze Vibrações Argentinas',
    options: [
      'Fortes e marcadas.',
      'Ritmadas e suaves, sem excesso de força.',
      'Aleatórias.',
      'Apenas uma pancada.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "As pancadas no sino devem ser ritmadas conforme prescreve o ritual, e suaves, sem excesso de força"'
  },
  {
    id: 'g1r-40',
    questionText: 'No Grau 1, por quantos MMestr é formado o Pálio?',
    category: 'Pálio para Abertura e Fechamento do Livro da Lei',
    options: [
      'Dois.',
      'Três.',
      'Quatro.',
      'Cinco.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "No Grau 1 o Pálio é formado por três MMestr"'
  },
  {
    id: 'g1r-41',
    questionText: 'Sem MMestr suficientes para formar o Pálio, o que ocorre?',
    category: 'Pálio para Abertura e Fechamento do Livro da Lei',
    options: [
      'O Pálio é dispensado.',
      'O Mestr de CCer o fará sozinho.',
      'CComp poderão participar.',
      'AApr poderá participar.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Na hipótese de não haver MMestr em número suficiente para formar o Pálio o Mestr de CCer o fará sozinho"'
  },
  {
    id: 'g1r-42',
    questionText: 'Após a leitura do versículo pelo Or, deve-se exclamar "que assim seja"?',
    category: 'Pálio para Abertura e Fechamento do Livro da Lei',
    options: [
      'Sim, sempre.',
      'Não se exclama "que assim seja".',
      'Apenas em sessões magnas.',
      'Apenas o Ven Mestr profere.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Não se exclama \'que assim seja\' após a leitura do versículo pelo Or"'
  },
  {
    id: 'g1r-43',
    questionText: 'Como o S de PProp e IInf é conduzido?',
    category: 'Saco de Propostas e Informações',
    options: [
      'Aberto, à altura do peito.',
      'Fechado, à altura do coração, com a mão esquerda à altura deste e a direita por cima.',
      'Aberto, nas mãos do Ven Mestr.',
      'Fechado, no bolso do Mestr de CCer.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "O S de PProp e IInf é conduzido fechado, à altura do coração, com a mão esquerda à altura deste e com a mão direita por cima"'
  },
  {
    id: 'g1r-44',
    questionText: 'Como o Mestr de CCer colhe as propostas?',
    category: 'Saco de Propostas e Informações',
    options: [
      'Do lado direito de quem oferta, olhando diretamente.',
      'Do lado esquerdo de quem oferta, com o rosto voltado para o outro lado.',
      'Apenas do Ven Mestr.',
      'Em qualquer posição.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "colhe do lado esquerdo de quem oferta com o rosto voltado para o outro lado, de modo a não enxergar o que está sendo coletado"'
  },
  {
    id: 'g1r-45',
    questionText: 'Um Irmão propõe colher em lugares vazios em homenagem a IIrm desencarnados. Isso é:',
    category: 'Saco de Propostas e Informações',
    options: [
      'Uma prática tradicional aceitável.',
      'Proibido — não se colhe em lugares vazios.',
      'Permitido apenas em sessões magnas.',
      'Permitido com autorização do Ven Mestr.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "não se colhe em lugares vazios, mesmo sob a argumentação de proceder a coleta de IIrm desencarnados"'
  },
  {
    id: 'g1r-46',
    questionText: 'Por que o Mestr de CCer e o Cobr Int trocam de função?',
    category: 'Troca de Funções entre Mestre de Cerimônias e Cobridor Interno',
    options: [
      'Para revezar cargos.',
      'Para que ambos possam depositar no S de PProp e IInf.',
      'Por determinação do RGF.',
      'Para o Cobr Int assumir a Loja.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Para que o Mestr de CCer e o Cobr Int possam depositar no S de PProp e IInf é necessário que troquem temporariamente de função"'
  },
  {
    id: 'g1r-47',
    questionText: 'Como a troca de função é realizada?',
    category: 'Troca de Funções entre Mestre de Cerimônias e Cobridor Interno',
    options: [
      'Apenas trocam os paramentos.',
      'O Mestr de CCer entrega o S com a mão esquerda, recebe a espada com a direita, e ambos giram para a esquerda.',
      'O Cobr Int sai do Templo e o Mestr de CCer assume a porta.',
      'O Ven Mestr autoriza verbalmente.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "O Mestr de CCer entrega o S de PProp e IInf com a mão esquerda ao Cobr Int... ambos giram simultaneamente, para sua esquerda"'
  },
  {
    id: 'g1r-48',
    questionText: 'Quem é o último a comparecer no S de PProp e IInf?',
    category: 'Troca de Funções entre Mestre de Cerimônias e Cobridor Interno',
    options: [
      'O Ven Mestr.',
      'O Mestr de CCer.',
      'O Cobr Int.',
      'O 1° Vig.'
    ],
    correctOptionIndex: 2,
    explanation: 'Citação: "O Cobr Int é o último a comparecer no S de PProp e IInf"'
  },
  {
    id: 'g1r-49',
    questionText: 'Como o Or e o Secr procedem para verificar o conteúdo do S de PProp e IInf?',
    category: 'Verificação do Saco de Propostas e Informações',
    options: [
      'Circulam por trás do retábulo.',
      'Levantam-se, posicionam-se à Ordem, e dão apenas um passo lateral na direção do Altar da Sabedoria.',
      'São guiados pelo Mestr de CCer.',
      'Vão até o centro do Templo.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "o Or e o Secr levantam-se de seus lugares, posicionam-se à Ordem, e dão apenas um passo lateral na direção do Altar da Sabedoria"'
  },
  {
    id: 'g1r-50',
    questionText: 'É necessário fazer a circulação por trás do retábulo nesta verificação?',
    category: 'Verificação do Saco de Propostas e Informações',
    options: [
      'Sim, sempre.',
      'Não é necessário.',
      'Apenas em sessões magnas.',
      'Apenas quando guiados pelo Mestr de CCer.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Não é necessário fazer a circulação por trás do retábulo, e muito menos serem guiados pelo Mestr de CCer"'
  },
  {
    id: 'g1r-51',
    questionText: 'Este mesmo procedimento deve ser adotado em qual outra situação?',
    category: 'Verificação do Saco de Propostas e Informações',
    options: [
      'Na abertura da Loja.',
      'Na verificação da contagem das esferas no Escr Secr.',
      'No Tronco de Solidariedade.',
      'Na Cadeia de União.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Este mesmo procedimento deve ser adotado na verificação da contagem das esferas no Escr Secr"'
  },
  {
    id: 'g1r-52',
    questionText: 'É permitido efetuar doação via PIX ou depósito bancário para o Tr de Sol?',
    category: 'Tronco de Solidariedade',
    options: [
      'Sim, é preferível.',
      'Não é permitido.',
      'Apenas em casos excepcionais.',
      'Apenas com autorização do Ven Mestr.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Não é permitido efetuar transferência via PIX, nem depósitos na conta bancária da Loja para essa finalidade"'
  },
  {
    id: 'g1r-53',
    questionText: 'Um obreiro pode participar da sessão sem comparecer ao Tr de Sol?',
    category: 'Tronco de Solidariedade',
    options: [
      'Sim, basta enviar via PIX.',
      'Não — nenhum obreiro pode participar da sessão sem fazer sua doação.',
      'Sim, se for visitante.',
      'Sim, em sessões ordinárias.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Nenhum obreiro pode participar da sessão sem fazer sua doação"'
  },
  {
    id: 'g1r-54',
    questionText: 'Durante o Tr de Sol, um Irmão declara que está doando em nome de um Irm ausente. Isso é:',
    category: 'Tronco de Solidariedade',
    options: [
      'Uma prática aceitável.',
      'Vedado — não se fala durante o Tr de Sol.',
      'Permitido com autorização do Ven Mestr.',
      'Permitido apenas em sessões magnas.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Não se fala durante a realização do Tr de Sol, por essa razão é vedado a um obreiro declarar durante esta etapa que está fazendo doação em nome de um Irm ausente"'
  },
  {
    id: 'g1r-55',
    questionText: 'O Adormecimento do Fogo segue qual dinâmica?',
    category: 'Adormecimento do Fogo',
    options: [
      'A mesma do Cerimonial da Incensação.',
      'A mesma do Cerimonial do Fogo, porém em sentido inverso.',
      'Uma dinâmica própria e diferente.',
      'A mesma do Revigoramento da Chama Sagrada.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "O Adormecimento do Fogo segue a mesma dinâmica do Cerimonial do Fogo, porém em sentido inverso"'
  },
  {
    id: 'g1r-56',
    questionText: 'Um Irmão sugere apagar as velas com sopro para agilizar. Isso é:',
    category: 'Adormecimento do Fogo',
    options: [
      'Correto.',
      'Errado — as velas não devem ser apagadas com sopro.',
      'Correto se não houver abafador.',
      'Correto apenas para as velas laterais.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "As velas não devem ser apagadas com sopro. Na ausência do abafador deve-se improvisar um objeto para este fim"'
  },
  {
    id: 'g1r-57',
    questionText: 'Após o Adormecimento, enquanto a Chama Sagrada estiver acesa, a circulação deve ser:',
    category: 'Adormecimento do Fogo',
    options: [
      'Livre.',
      'Ritualística.',
      'Dispensada.',
      'Apenas horária.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "enquanto a Chama Sagrada estiver acesa a circulação deve ser ritualística"'
  },
  {
    id: 'g1r-58',
    questionText: 'Quem é o primeiro a sair do Templo?',
    category: 'Saída do Templo',
    options: [
      'O Apr mais novo.',
      'O Ven Mestr.',
      'O Mestr de CCer.',
      'O Cobr Int.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "O Ven Mestr é o primeiro a sair do Templo, com o Mestr de CCer às suas costas"'
  },
  {
    id: 'g1r-59',
    questionText: 'Quem é o último obreiro a sair do Templo?',
    category: 'Saída do Templo',
    options: [
      'O Ven Mestr.',
      'O Mestr de CCer.',
      'O Apr mais novo.',
      'O Cobr Int.'
    ],
    correctOptionIndex: 2,
    explanation: 'Citação: "O último obreiro a sair é o Apr mais novo, que foi o primeiro a entrar"'
  },
  {
    id: 'g1r-60',
    questionText: 'Quando é permitido retornar ao Templo após a saída?',
    category: 'Saída do Templo',
    options: [
      'Imediatamente.',
      'Apenas após o Adormecimento da Chama Sagrada.',
      'Nunca.',
      'Apenas com autorização do Ven Mestr.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Só é permitido retornar ao Templo após o Adormecimento da Chama Sagrada"'
  },
  {
    id: 'g1r-61',
    questionText: 'Qual é o sentido da circulação no Ocidente e no Oriente?',
    category: 'Circulação em Loja',
    options: [
      'Anti-horário no Ocidente e horário no Oriente.',
      'Horário no Ocidente e anti-horário no Oriente.',
      'Horário em todo o Templo.',
      'Anti-horário em todo o Templo.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "O sentido é dextrógiro, sentido horário, no Ocidente, e sinistrogiro, sentido anti-horário, no Oriente"'
  },
  {
    id: 'g1r-62',
    questionText: 'É permitido transitar sobre o Pavimento Mosaico?',
    category: 'Circulação em Loja',
    options: [
      'Sim, com a Loja aberta.',
      'Não, mesmo com a Loja fechada.',
      'Apenas em caso de emergência.',
      'Apenas pelo Mestr de CCer.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Não se transita sobre o Pavimento Mosaico, mesmo com a Loja fechada"'
  },
  {
    id: 'g1r-63',
    questionText: 'Com a Loja aberta, a circulação deve ser acompanhada de qual Sinal?',
    category: 'Circulação em Loja',
    options: [
      'Sinal de Ordem.',
      'Sinal do Grau.',
      'Sinal de Guarda.',
      'Nenhum Sinal.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Com a Loja aberta a circulação deve ser acompanhada do Sinal do Grau, e não do de Ordem"'
  },
  {
    id: 'g1r-64',
    questionText: 'Os degraus devem ser subidos ou descidos de que forma?',
    category: 'Vênia, Subida e Descida dos Degraus',
    options: [
      'Dois de cada vez.',
      'Um a um, fazendo-se uma pausa em esquadria em cada um deles.',
      'Livremente.',
      'Apenas em sessões magnas.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Os degraus devem ser subidos ou descidos um a um, fazendo-se uma pausa em esquadria em cada um deles"'
  },
  {
    id: 'g1r-65',
    questionText: 'Na entrada e saída do Templo com a Loja aberta, a saudação deve ser dirigida a quem e em que ordem?',
    category: 'Vênia, Subida e Descida dos Degraus',
    options: [
      'Ven Mestr, 2° Vig e 1° Vig.',
      'Ven Mestr, 1° Vig e 2° Vig, exatamente nessa ordem.',
      'Apenas ao Ven Mestr.',
      'Aos VVig apenas.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "a saudação entre CCol deverá ser dirigida ao Ven Mestr, 1° Vig e 2° Vig, exatamente nessa ordem"'
  },
  {
    id: 'g1r-66',
    questionText: 'Durante as Viagens da Iniciação, faz-se a saudação maçônica?',
    category: 'Vênia, Subida e Descida dos Degraus',
    options: [
      'Sim, sempre.',
      'Não se faz a saudação maçônica durante as Viagens da Iniciação.',
      'Apenas na primeira viagem.',
      'Apenas na última viagem.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Não se faz a saudação maçônica durante as Viagens da Iniciação"'
  },
  {
    id: 'g1r-67',
    questionText: 'Qual é a sequência correta da Aclamação?',
    category: 'Aclamação',
    options: [
      'Bateria, Sinal de Saudação, Aclamação.',
      'Sinal de Saudação, Bateria do Grau, e por fim Aclamação.',
      'Aclamação, Bateria, Sinal de Saudação.',
      'Bateria, Aclamação, Sinal de Saudação.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "O comando do Ven Mestr é para que executemos o Sinal de Saudação... façamos a Bateria do Grau, e por fim brademos a Aclamação"'
  },
  {
    id: 'g1r-68',
    questionText: 'Como o Cobr Int se posiciona durante a Aclamação?',
    category: 'Aclamação',
    options: [
      'Sentado, sem espada.',
      'De pé, em Sinal de Guarda, e apenas brada a Aclamação ao final.',
      'De pé, à Ordem.',
      'Sentado, em Sinal de Guarda.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "para executar a Aclamação, o Cobr Int mantem-se de pé, em Sinal de Guarda, e apenas brada a Aclamação ao final"'
  },
  {
    id: 'g1r-69',
    questionText: 'Sobre a palavra VIVAT, o ritual afirma ser francesa. O autor esclarece que:',
    category: 'Aclamação',
    options: [
      'É realmente francesa.',
      'Na verdade é do latim, e na França o "T" é mudo, sem acentuação.',
      'É uma palavra hebraica.',
      'É uma palavra portuguesa.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "não se trata de um vocábulo francês e sim do latim, e que na França, assim como no latim, a pronúncia é com \'T\' mudo ao final, sem qualquer acentuação"'
  },
  {
    id: 'g1r-70',
    questionText: 'Quando sentados, qual é a postura correta?',
    category: 'Postura em Loja',
    options: [
      'Ereta, com as palmas das mãos apoiadas sobre as coxas, sem cruzar as pernas.',
      'Recostado confortavelmente.',
      'Com os braços cruzados.',
      'Livre, desde que em silêncio.'
    ],
    correctOptionIndex: 0,
    explanation: 'Citação: "a postura é ereta, com as palmas das mãos apoiadas sobre as coxas. Não é permitido cruzar as pernas ou reclinar-se no assento"'
  },
  {
    id: 'g1r-71',
    questionText: 'AApr e CComp podem pedir a palavra em Loja?',
    category: 'Postura em Loja',
    options: [
      'Sim, sempre.',
      'Não têm permissão para pedir a palavra.',
      'Apenas os CComp.',
      'Apenas com autorização do 1° Vig.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "AApr e CComp não têm permissão para pedir a palavra"'
  },
  {
    id: 'g1r-72',
    questionText: 'Sobre o uso de smartphones com fones de ouvido durante as sessões:',
    category: 'Postura em Loja',
    options: [
      'É permitido.',
      'Não é permitido fazer uso de smartphones, sequer com fones de ouvido.',
      'É permitido apenas para AApr.',
      'É permitido em modo silencioso.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Não é permitido fazer uso de smartphones, sequer com fones de ouvido"'
  },
  {
    id: 'g1r-73',
    questionText: 'É obrigatório que as músicas executadas sejam exclusivamente clássicas e instrumentais?',
    category: 'Harmonia',
    options: [
      'Sim, sempre.',
      'Não existe vedação quanto ao estilo e ritmo das músicas.',
      'Apenas instrumentais são permitidas.',
      'Apenas clássicas são permitidas.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Não existe vedação no ritual quanto ao estilo e ritmo das músicas a serem executadas durante as sessões"'
  },
  {
    id: 'g1r-74',
    questionText: 'Quando NÃO deve ser executada música?',
    category: 'Harmonia',
    options: [
      'Durante a Cerimônia da Incensação.',
      'Durante etapas onde a fala seja o principal elemento, como Leitura de Balaústres.',
      'Durante o Cortejo de Entrada.',
      'Durante o Tr de Sol.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Não deve ser executada música durantes as etapas onde a fala seja o principal elemento, como por exemplo na Leitura de Balaústres"'
  },
  {
    id: 'g1r-75',
    questionText: 'Músicas instrumentais com letra conhecida podem causar problema?',
    category: 'Harmonia',
    options: [
      'Não, nunca.',
      'Sim, existe a possibilidade de algum Irm se empolgar e cantarolar ou assobiar.',
      'Apenas se forem músicas sacras.',
      'Apenas se forem em português.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "existe a possibilidade de algum Irm se empolgar e cantarolar ou assobiar"'
  },
  {
    id: 'g1r-76',
    questionText: 'Qual é a diferença entre Cadeia de União e Corrente Fraternal?',
    category: 'Cadeia de União e Corrente Fraternal',
    options: [
      'Não há diferença.',
      'A Cadeia de União se presta à transmissão da Pal Sem; a Corrente Fraternal pode ser feita em todas as sessões.',
      'A Corrente Fraternal é apenas para Grau 1.',
      'A Cadeia de União é semanal.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "a Cadeia de União se presta exclusivamente à transmissão da Pal Sem, sendo realizada duas vezes por ano, e a Corrente Fraternal pode ser feita em todas as sessões"'
  },
  {
    id: 'g1r-77',
    questionText: 'As duas modalidades podem ser realizadas na mesma sessão?',
    category: 'Cadeia de União e Corrente Fraternal',
    options: [
      'Sim.',
      'Não, as duas modalidades não podem ser realizadas na mesma sessão.',
      'Apenas em sessões magnas.',
      'Apenas com autorização especial.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "as duas modalidades não podem ser realizadas na mesma sessão"'
  },
  {
    id: 'g1r-78',
    questionText: 'Da Cadeia de União, quem pode participar?',
    category: 'Cadeia de União e Corrente Fraternal',
    options: [
      'Todos os maçons presentes.',
      'Apenas os obreiros que efetuam sua contribuição pela Loja.',
      'Qualquer visitante.',
      'AApr e CComp.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Da Cadeia de União podem participar apenas os obreiros que efetuam sua contribuição pela Loja"'
  },
  {
    id: 'g1r-79',
    questionText: 'Durante a Cena da Traição, o que é fundamental?',
    category: 'Cena da Traição e Câmara Ardente',
    options: [
      'Que todos observem o candidato.',
      'O silêncio — o candidato deve ter a impressão de estar sozinho com o Irm Traidor.',
      'Que o Ven Mestr acompanhe o candidato.',
      'Que haja música de fundo.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "o silêncio é fundamental, o candidato deve ter a impressão de estar sozinho com o Irm Traidor, e não de estar sendo observado"'
  },
  {
    id: 'g1r-80',
    questionText: 'Os MMestr que participarão da encenação de frente para o candidato devem ter:',
    category: 'Cena da Traição e Câmara Ardente',
    options: [
      'Paramentos normais e rostos descobertos.',
      'Paramentos invertidos e rostos cobertos por capuz preto ou máscara preta.',
      'Apenas avental, sem faixa.',
      'Paramentos completos e luvas.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "deverão ter seus paramentos invertidos... e seus rostos deverão estar cobertos por um capuz preto, ou alternativamente seus olhos cobertos por uma máscara preta"'
  },
  {
    id: 'g1r-81',
    questionText: 'Aqueles que apenas assistirão à cena sem nela atuar devem se posicionar:',
    category: 'Cena da Traição e Câmara Ardente',
    options: [
      'À frente do candidato.',
      'Atrás do candidato, de modo a não permitir que ele os veja.',
      'Ao lado do candidato.',
      'No Oriente.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Aqueles que apenas assistirão a cena sem nela atuar deverão se posicionar atrás do candidato de modo a não permitir que ele os veja"'
  },
  {
    id: 'g1r-82',
    questionText: 'Quem é o único maçom Adonhiramita com permissão de usar balandrau?',
    category: 'Irmão Terrível',
    options: [
      'O Ven Mestr.',
      'O 1° Exp desempenhando as funções de Irmão Terrível nas Iniciações.',
      'O Mestr de CCer.',
      'O Cobr Int.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "O 1° Exp desempenhando as funções de Irmão Terrível nas Iniciações é o único maçom Adonhiramita que tem permissão de usar balandrau"'
  },
  {
    id: 'g1r-83',
    questionText: 'O Irmão Terrível deve usar avental ou faixa de Mestr?',
    category: 'Irmão Terrível',
    options: [
      'Sim, sempre.',
      'Não deve usar avental ou faixa de Mestr.',
      'Apenas a faixa.',
      'Apenas o avental.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Ele representa um carrasco medieval, não deve usar avental ou faixa de Mestr"'
  },
  {
    id: 'g1r-84',
    questionText: 'Após encerrada a atuação do Irmão Terrível, o que ele deve fazer?',
    category: 'Irmão Terrível',
    options: [
      'Permanecer com o balandrau até o fim da sessão.',
      'Retirar o balandrau e participar do restante com os paramentos de Mestr.',
      'Sair do Templo.',
      'Entregar o balandrau ao Ven Mestr.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "logo após as Viagens e encerrada a atuação do Irmão Terrível ele deve retirar o balandrau e participar do restante da sessão com os paramentos de Mestr"'
  },
  {
    id: 'g1r-85',
    questionText: 'Ao visitar outra Loja, qual Rito deve ser seguido?',
    category: 'Visita a Outras Lojas',
    options: [
      'O Rito Adonhiramita.',
      'O Rito praticado pela Loja visitada.',
      'O Rito de preferência do visitante.',
      'O Rito do GOB.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Quando visitamos outras Lojas estamos sob a égide do Rito praticado por ela, e devemos desta forma seguir o seu ritual"'
  },
  {
    id: 'g1r-86',
    questionText: 'Se não souber a Bateria do Grau e a Aclamação do Rito da Loja visitada, o que deve fazer?',
    category: 'Visita a Outras Lojas',
    options: [
      'Executar a prática Adonhiramita.',
      'Manter-se em silêncio e jamais executar a prática Adonhiramita.',
      'Perguntar ao Ven Mestr visitante.',
      'Sair do Templo.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Se não soubermos como fazer devemos nos manter em silêncio e jamais executar a prática Adonhiramita em Lojas praticantes de outros Ritos"'
  },
  {
    id: 'g1r-87',
    questionText: 'Sobre o traje ao visitar outras Lojas:',
    category: 'Visita a Outras Lojas',
    options: [
      'Devemos usar os paramentos do Rito da Loja visitada.',
      'Devemos usar os paramentos do Rito Adonhiramita.',
      'É permitido usar balandrau.',
      'Não há regra específica.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "devemos usar os paramentos do Rito Adonhiramita mesmo que a Loja visitada pratique outros Ritos"'
  },
  {
    id: 'g1r-88',
    questionText: 'Quando é possível trabalhar incorporada?',
    category: 'Sessões Conjuntas e Incorporadas',
    options: [
      'Sempre que ambas as Lojas forem do GOB.',
      'Apenas se as duas Lojas praticarem o mesmo Rito.',
      'Em qualquer circunstância.',
      'Apenas em sessões magnas.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Só é possível trabalhar incorporada se as duas Lojas praticarem o mesmo Rito, caso contrário a sessão será conjunta"'
  },
  {
    id: 'g1r-89',
    questionText: 'Na recepção de Loja visitante, quem entra primeiro no Templo?',
    category: 'Sessões Conjuntas e Incorporadas',
    options: [
      'A Loja visitante.',
      'A Loja anfitriã ou proprietária do Templo.',
      'Entram simultaneamente.',
      'A de menor título.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "A Loja anfitriã ou proprietária do Templo ingressa antes"'
  },
  {
    id: 'g1r-90',
    questionText: 'Quando existirem duas ou mais Lojas em visitação, qual entrará por último?',
    category: 'Sessões Conjuntas e Incorporadas',
    options: [
      'A mais antiga na Ordem.',
      'A de maior título ou condecoração.',
      'A mais nova.',
      'A de maior número cadastral.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "entrará por último a de maior título ou condecoração e, se forem iguais nisso, a mais antiga na Ordem, de acordo com o menor número cadastral"'
  },
  {
    id: 'g1r-91',
    questionText: 'É permitido acrescentar, modificar ou subtrair falas ritualísticas?',
    category: 'Considerações Gerais',
    options: [
      'Sim, com autorização do Ven Mestr.',
      'É proibido acrescentar, modificar ou subtrair falas ritualísticas.',
      'Apenas em sessões magnas.',
      'Apenas acréscimos são permitidos.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "É proibido acrescentar, modificar ou subtrair falas ritualísticas"'
  },
  {
    id: 'g1r-92',
    questionText: 'Em sessões públicas com não maçons no Templo, como deve estar a Chama Sagrada?',
    category: 'Considerações Gerais',
    options: [
      'Acesa.',
      'Apagada.',
      'Acesa apenas no Oriente.',
      'Não há regra.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "nas sessões públicas e naquelas em que não maçons sejam convidados a ingressar no Templo a Chama Sagrada deverá estar apagada"'
  },
  {
    id: 'g1r-93',
    questionText: 'AApr e CComp podem exercer cargos a título de instrução?',
    category: 'Considerações Gerais',
    options: [
      'Sim, como forma de aprendizado.',
      'Não podem exercer cargos, nem a título de instrução.',
      'Apenas CComp podem.',
      'Apenas em sessões ordinárias.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "AApr e CComp não podem exercer cargos, nem a título de instrução"'
  },
  {
    id: 'g1r-94',
    questionText: 'Quem tem acesso ao SOR?',
    category: 'Serviço de Orientação Ritualística',
    options: [
      'Apenas os VVen MMestr.',
      'Todo maçom regular e ativo.',
      'Apenas membros do GOB no Rio de Janeiro.',
      'Apenas os Secretários Estaduais.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Todo maçom regular e ativo tem acesso ao SOR"'
  },
  {
    id: 'g1r-95',
    questionText: 'O acesso ao SOR é restrito por:',
    category: 'Serviço de Orientação Ritualística',
    options: [
      'Tempo de filiação.',
      'Grau do maçom, identificado pelo número do CIM.',
      'Cargo ocupado.',
      'Loja de origem.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "a permissão de acesso será restrita ao Grau do maçom, que será identificado pelo número do CIM"'
  },
  {
    id: 'g1r-96',
    questionText: 'Qual edição dos rituais está em vigor?',
    category: 'Serviço de Orientação Ritualística',
    options: [
      'Edição de 2019.',
      'Edição de 2009.',
      'Edição de 2024.',
      'Edição de 2015.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "Não há previsão de publicação de novas edições dos rituais, permanecendo em vigor a edição de 2009"'
  },
  {
    id: 'g1r-97',
    questionText: 'As ilustrações do caderno foram produzidas por quem?',
    category: 'Epílogo',
    options: [
      'Por uma equipe de designers.',
      'Pelo autor.',
      'Por terceiros contratados.',
      'Pelo GOB.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "As ilustrações foram produzidas pelo autor"'
  },
  {
    id: 'g1r-98',
    questionText: 'O conteúdo deste caderno substitui as orientações da Secretaria Geral?',
    category: 'Epílogo',
    options: [
      'Sim, completamente.',
      'Não substitui as orientações da Secretaria Geral da Orientação Ritualística.',
      'Apenas em casos de dúvida.',
      'Apenas para o Grau 1.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "O conteúdo deste caderno não substitui as orientações da Secretaria Geral da Orientação Ritualística"'
  },
  {
    id: 'g1r-99',
    questionText: 'A quem o autor agradece na revisão de texto?',
    category: 'Epílogo',
    options: [
      'Aos VVen MMestr de sua Loja.',
      'Aos AAm IIrm Swami Caetano, Sergio Lyra e Rafael Gramelich.',
      'Ao GOB.',
      'Ao SOR.'
    ],
    correctOptionIndex: 1,
    explanation: 'Citação: "registro meus sinceros agradecimentos aos AAm IIrm Swami Caetano, Sergio Lyra e Rafael Gramelich que em muito me auxiliaram na revisão de texto"'
  }
];
