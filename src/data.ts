import { ExecutiveReport, SystemAlert } from './types';

export const INITIAL_REPORTS: ExecutiveReport[] = [
  {
    id: 'rep-estrategia-segmentos',
    title: 'ESTRATÉGIA DOS SEGMENTOS',
    nivelCurso: 33,
    category: 'ESTRATÉGIA',
    tags: ['Negócios', 'Receita Recorrente', 'Market Share'],
    department: 'RESULTADOS DE NEGÓCIO E ESTRATÉGIA',
    summary: 'resumo: Direcionamento estratégico do Segmento.',
    leftBorderColor: 'gold',
    owner: 'Gisela S. (Diretoria Executiva de Negócios)',
    lastUpdated: '04 Jun 2026',
    confidentiality: 'Altamente Confidencial',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=120&q=80',
    additionalLink: 'https://www.masonicacademy.com.br/sobre/',
    material1Link: 'https://www.masonicacademy.com.br/wp-content/uploads/manual-aluno.pdf',
    material2Link: 'https://www.masonicacademy.com.br/biblioteca-virtual/',
    material3Link: 'https://www.masonicacademy.com.br/contato/',
    fullMarkdown: `## Direcionamento Estratégico Multidisciplinar
O foco prioritário do corrente ano fiscal é o fortalecimento de canais de **Cross-selling** e consolidar a transição estrutural rumo ao **SaaS Pure-Play**, reduzindo o atrito de implantação sob o modelo tradicional.

### 🎯 Principais Alavancas:
1. **Verticalização Setorial**: Expansão de funcionalidades nativas em verticais-chave (Agro, Logística e Manufatura), mitigando integrações customizadas complexas.
2. **Monetização de APIs**: Criação de novas oportunidades em Fintech e Techfin, embarcando automações de pagamento nos pontos de decisão dos ERPs.
3. **Eficiência no Atendimento**: Descentralização de suporte técnico básico utilizando automação inteligente contextualizada em produtos.
`
  },
  {
    id: 'rep-visao-uso-rm',
    title: 'VISÃO DE USO LINHA RM (USO DO PRODUTO)',
    nivelCurso: 1,
    category: 'PRODUTO & OPERAÇÃO',
    tags: ['ERP RM', 'Telemetria', 'Engajamento'],
    department: 'PRODUTO & OPERAÇÃO',
    summary: 'resumo: Como o produto é utilizado pelos clientes.',
    leftBorderColor: 'teal',
    owner: 'Rodrigo M. (Diretoria de Produtos RM)',
    lastUpdated: '02 Jun 2026',
    confidentiality: 'Interno',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=120&q=80',
    additionalLink: 'https://tdn.masonicacademy.com.br/display/LRM',
    fullMarkdown: `## Telemetria e Padrões de Uso do ERP RM
A Linha RM continua sua evolução de arquitetura unificada multi-tenant. Dados recentes de telemetria baseados em interações de back-office apontam padrões claros de usabilidade a guiar os próximos sprints.

### 📊 Descobertas Críticas:
* **Módulos Críticos**: Folha de Pagamento (*Labore*) e Gestão Educacional (*Class*) representam 68% do throughput de requisições transacionais diárias.
* **Modernização de Interface**: Clientes que migraram para os novos portais web responsivos apresentaram um NPS 12 pontos maior que a média histórica em desktop legado.
* **Latência de Banco**: Identificado gargalo pontual na consolidação de guias fiscais e fechamento mensal. O comitê técnico já iniciou a otimização de índices e cache em nuvem de alto desempenho.
`
  },
  {
    id: 'rep-estrategia-backoffice',
    title: 'ESTRATÉGIA DO BACKOFFICE',
    nivelCurso: 15,
    category: 'ESTRATÉGIA',
    tags: ['Eficiência', 'SLA', 'Controladoria'],
    department: 'RESULTADOS DE NEGÓCIO E ESTRATÉGIA',
    summary: 'resumo: Objetivos e metas de longo prazo.',
    leftBorderColor: 'gold',
    owner: 'Renata L. (Controladoria-Geral)',
    lastUpdated: '28 Mai 2026',
    confidentiality: 'Restrito',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=120&q=80',
    additionalLink: 'https://www.masonicacademy.com.br/erp/',
    fullMarkdown: `## Planejamento de Otimização Administrativa e Operações
Maximizar a automatização sob fluxos de robôs RPA e inteligência integrativa de notas fiscais representa a chave para escalar as operações sem inflacionar desnecessariamente os custos indiretos.

### 🚀 Metas Estabelecidas:
1. **Unificação Fiscal**: Reduzir em 30% o tempo despendido em conciliação contábil manual mediante integração direta com prefeituras via API.
2. **Escritório de Serviços Compartilhados**: Centralização das aprovações regionais e gestão do fluxo de caixa sob um único painel executivo dinâmico.
3. **Plataforma Única**: Eliminar 3 sistemas satélites redundantes legados até o fim do segundo trimestre fiscal.
`
  },
  {
    id: 'rep-estrategia-engenharia',
    title: 'ESTRATÉGIA DA ENGENHARIA',
    nivelCurso: 10,
    category: 'TECNOLOGIA',
    tags: ['Arquitetura', 'Cloud native', 'CI/CD'],
    department: 'ENGENHARIA & TECNOLOGIA',
    summary: 'resumo: Objetivos e metas de longo prazo.',
    leftBorderColor: 'blue',
    owner: 'Carlos P. (Diretoria de Tecnologia)',
    lastUpdated: '01 Jun 2026',
    confidentiality: 'Interno',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=120&q=80',
    additionalLink: 'https://github.com/masonicacademy',
    fullMarkdown: `## Consolidação Cloud Native e Resiliência Técnica
A engenharia de software transiciona de forma ágil rumo ao modelo Serverless e contêineres resilientes isolados. O principal KPI técnico foca na disponibilidade global continuada e tempo ágil de recuperação.

### 🛠️ Eixos de Arquitetura:
* **CI/CD Automatizado**: Implantação de pipelines seguros em nuvem híbrida com rollback automático assistido por análise de telemetria.
* **Segurança na Origem (Shift-Left)**: Auditoria e varreduras estáticas de código (SAST) em tempo de commit para prevenir exposições em APIs sensíveis.
* **Kubernetes Multi-Região**: Fornecer alta tolerância a desastres físicos distribuindo o tráfego geograficamente nas principais nuvens parceiras.
`
  },
  {
    id: 'rep-estrategia-servicos',
    title: 'ESTRATÉGIA DE SERVIÇOS',
    nivelCurso: 5,
    category: 'SERVIÇOS',
    tags: ['Clientes', 'Consultoria', 'Suporte'],
    department: 'SERVIÇOS & CLIENTES',
    summary: 'resumo: Objetivos e metas de longo prazo.',
    leftBorderColor: 'purple',
    owner: 'Fábio T. (Serviços e Práticas)',
    lastUpdated: '31 Mai 2026',
    confidentiality: 'Interno',
    thumbnailUrl: 'https://images.unsplash.com/photo-1521791136365-c73dbe75736f?auto=format&fit=crop&w=120&q=80',
    additionalLink: 'https://store.masonicacademy.com.br/',
    fullMarkdown: `## Portfólio de Serviços Profissionais e Suporte Crítico
A busca contínua por excelência operacional gerou maior satisfação de clientes diretos. A reestruturação de pacotes de horas de consultoria reduziu o tempo de espera no atendimento técnico.

### 🌟 Entregas e Foco:
* **Acordo de Nível de Serviço (SLA)**: Implementação de canal exclusivo prioritário Red 24/7 para clientes em período de alta temporada fiscal.
* **Consultoria Conectada**: Redesenho do modelo comercial, permitindo aquisição simplificada e fracionada de consultores certificados Masonic Academy sob demanda.
* **Profissionalização de Parceiros**: Lançamento da nova central unificada de treinamento e trilhas de recertificação para integradores parceiros.
`
  },
  {
    id: 'rep-pes-educacional',
    title: 'PES EDUCACIONAL - 2023 A 2026',
    nivelCurso: 12,
    category: 'PRODUTO & OPERAÇÃO',
    tags: ['PES', 'Educação', 'Escola', 'Faculdade'],
    department: 'PES EDUCACIONAL',
    summary: 'resumo: Alinhamento de longo prazo estratégico.',
    leftBorderColor: 'teal',
    owner: 'Camila F. (Líder Segmento Educação)',
    lastUpdated: '29 Mai 2026',
    confidentiality: 'Restrito',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=120&q=80',
    additionalLink: 'https://www.masonicacademy.com.br/segmentos/educacional/',
    fullMarkdown: `## Planejamento Estratégico de Software (PES) Educacional
O segmento Educacional transiciona vigorosamente no triênio 2023 a 2026. A digitalização massiva das jornadas do aluno e do corpo docente culmina em maior engajamento e combate à evasão de matrículas acadêmicas.

### 🎓 Objetivos Chave Consolidados:
1. **Portal Unificado do Aluno**: Automação ponta-a-ponta, do vestibular e assinatura digital do contrato de matrícula até a emissão do diploma em blockchain corporativo.
2. **Combate à Evasão via Análise Preditiva**: Algoritmos de aprendizado de máquina identificando alunos com padrão de frequência sob risco, gerando alertas instantâneos de intervenção psicopedagógica.
3. **Plataforma de Avaliação Unificada**: Aplicação de provas e avaliações formativas online integradas diretamente aos boletins escolares do ERP.
`
  }
];

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'alt-1',
    title: 'Estratégia Segmentos Atualizada',
    description: 'A diretoria de negócios atualizou as projeções do EBITDA para o Q2-26.',
    time: 'Há 10 minutos',
    reportId: 'rep-estrategia-segmentos',
    type: 'update',
    read: false,
    createdAt: Date.now() - 10 * 60 * 1000
  },
  {
    id: 'alt-2',
    title: 'Ata de Conformidade LGPD',
    description: 'Adicionado selo de conformidade e auditoria de dados no ERP RM.',
    time: 'Há 2 horas',
    reportId: 'rep-visao-uso-rm',
    type: 'update',
    read: false,
    createdAt: Date.now() - 2 * 60 * 60 * 1000
  },
  {
    id: 'alt-3',
    title: 'Alerta de Acesso Incomum',
    description: 'Curso altamente confidencial acessado fora do horário habitual.',
    time: 'Ontem',
    reportId: 'rep-estrategia-backoffice',
    type: 'critical',
    read: true,
    createdAt: Date.now() - 24 * 60 * 60 * 1000
  }
];
