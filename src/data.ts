import { ExecutiveReport, SystemAlert, Book } from './types';
import { SENDA_VIRTUDE_COURSE } from './data/sendaVirtudeCourse';

export const INITIAL_REPORTS: ExecutiveReport[] = [
  SENDA_VIRTUDE_COURSE,
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
O segmento Educacional transiciona vigorosamente no triênio 2023 a 2026. A digitalização massiva das jornadas do irmão e do corpo docente culmina em maior engajamento e combate à evasão de matrículas acadêmicas.

### 🎓 Objetivos Chave Consolidados:
1. **Portal Unificado do Irmão**: Automação ponta-a-ponta, do vestibular e assinatura digital do contrato de matrícula até a emissão do diploma em blockchain corporativo.
2. **Combate à Evasão via Análise Preditiva**: Algoritmos de aprendizado de máquina identificando irmãos com padrão de frequência sob risco, gerando alertas instantâneos de intervenção psicopedagógica.
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

export const INITIAL_BOOKS: Book[] = (() => {
  const RAW_CSV_BOOKS = `CATECHISME DES FRANCS MAÇONS - ED-1744;Adonhiramita;1;https://drive.google.com/file/d/19UH_Z-MQKESMru0Nf3Xf1YeCNbkY9Fkq/view
RITUAL ADONH.'. DE BANQUETE 2009;Ritual;1;https://drive.google.com/file/d/1PCwMTpMdvEnFBLHYty_nwFFqxksHay7B/view
RITUAL APRENDIZ RITO MODERNO_1927 {1892};Ritual;1;https://drive.google.com/file/d/1rkrv2SKbgwzRlq8vTXH3poWod7X-5xR7/view
RITUAL APRENDIZ 2009-PROTEGIDO;Adonhiramita,Ritual;1;https://drive.google.com/file/d/1vtZBQmi6EZMLA1jQtvNyMA-C82mH2Vu0/view
RITUAL COMPANHEIRO 2009-PROTEGIDO;Adonhiramita,Ritual;2;https://drive.google.com/file/d/19qnKEz63U58Hwl8VD0jMfID_KXQIwXtz/view
O CERIMONIAL DO FOGO;;1;https://drive.google.com/file/d/1wYz6cIA-7j5n3GTUxVtOZsAUEmolFKgd/view
O ARQUITETO NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1csDuWxMeKjA1ZCZisslCOxwAdRkyh90O/view
A_CORDA DE 81 NÓS_NO_RITO_ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1HvidQ-iR2m-2fBSE4j4ZQ6w6xRcX9yi0/view
A CERIMÔNIA DA INCENSAÇÃO NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1uearVCfW7BE3g-1OfAFneh2PzlgvqK52/view
A_ABÓBADA_CELESTE_NO_RITO_ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1_aWAaRQQB_MlI2-tIF6DZzpw2-8cp6jo/view
AS COLUNAS NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1cW70eYqZgq2AokesmfafyvdD7buYLQGx/view
A-EGREGORA-NO-RITO-ADONHIRAMITA-25-10-2021;Adonhiramita;1;https://drive.google.com/file/d/1dwyac6xm5RG6FSU8MpXUGjahapnLL4-v/view
ADONHIRAM E O RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1zHiGKIaNYuUfsL6QMHnFQ8fKfboieUGK/view
RITUALÍSTICA_PARTE 3;Adonhiramita;1;https://drive.google.com/file/d/1CqB5tRy00ZxL3__VKZkmBKb_jackY5wU/view
RITUALÍSTICA_PARTE 2;Adonhiramita;1;https://drive.google.com/file/d/1OZl449F9y4pSXee26nLNBZoT_vgPoKiD/view
RITUALÍSTICA_PARTE 1;Adonhiramita;1;https://drive.google.com/file/d/1nMe8OXmdhNo3aysKe91zJ0DCN1BCx_Fr/view
O VENERÁVEL MESTRE NO RITO ADONHIRAMITA;Adonhiramita;3;https://drive.google.com/file/d/1neQvQDuIMxMXNn5clIraphLADRDOizGQ/view
OS VIGILANTES NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1-o68CZrlPLsEFqgMY6ARFrIEAMz5DuCS/view
OS DEGRAUS DO TEMPLO NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1vNTifhB5UXntlwOh3w2vrJmEn4ZPhrzh/view
OS CHAKRAS NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1fdMKIK7LeUKbX610y9IcHFIBqhVjV_oH/view
O_PAVIMENTO_MOSAICO_NO_RITO_ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/129aiQ6FA5Q7bQaHHLnvrtfW0E5W8Fvv7/view
A INICIAÇÃO NO RITO ADONHIRAMITA_PARTE 2;Adonhiramita;1;https://drive.google.com/file/d/1YvTgeSrJV1_aGpxgaz9IbyqkHmu987Gv/view
O TESOUREIRO NO RITO ADONHIRAMITA_2;Adonhiramita;1;https://drive.google.com/file/d/1x4jap09k4wjIUJao6wgAReRWG5Uu8p-P/view
O SECRETÁRIO NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1Rt3z_Y4VBVIMcicxwhn0uDlt1G2h84UY/view
O PORTA BANDEIRA E O PORTA ESTANDARTE NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1AedZ-rn0C9YRTawXiMgvra5HEvKJg4RK/view
O ORADOR NO RITO ADONHIRAMITA_2;Adonhiramita;1;https://drive.google.com/file/d/1JLtEuGvPJZ8KhPUoUhuii1kVxi-1jF8i/view
O MESTRE DE BANQUETE NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1rD4Ka5eXR0dWxErJc1pN-dLub90qkMwI/view
O LIVRO DA LEI NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/176TSo07w98ehlugWpKK63CA_rzUPXzmZ/view
A INICIAÇÃO NO RITO ADONHIRAMITA_PARTE 3;Adonhiramita;1;https://drive.google.com/file/d/1J4YzAGd9Z6qKluiVbdzzWCmtkJc-tBOB/view
AS LUVAS NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1NilN3j9KiJc7QWRxGYp9iePrG7Kr0UKP/view
O ELEMENTO FOGO NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1xo5TbIWGEaY3UldQOjl8GjuSnlatQj6a/view
O PAINEL DO GRAU NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1efU999KaNTFsWWXDtnhxMm_bkl7M4ahl/view
O MESTRE DE HARMONIA NO RITO ADONHIRAMITA (1);Adonhiramita;1;https://drive.google.com/file/d/1ZWGvEmSVMY2V_Smy82a2sXTRfHw25MUR/view
INTRODDUÇÃO À NUMEROLOGIA;;1;https://drive.google.com/file/d/1Tl17jQAHcApkc5LFWXDUnVawno3PWE_2/view
O SILÊNCIO DO APRENDIZ NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1VoC5Y0K7lznWq3Y9_i5bfMrqLf8WeQ_H/view
O NOME HISTÓRICO NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1LvAFI35gMXyvuDR9L8EkErUvvN_0-vmR/view
ABERTURA DO LIVRO DA LEI;Adonhiramita;1;https://drive.google.com/file/d/10bQoH-DtFzVyTxlCF7QRMo64Q_MYywKr/view
O BIBLIOTECÁRIO NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1ZenmpZ2vTDD_ONV8UxDoTgHqPq4w1Ri4/view
OS CARGOS EM LOJA NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1uPYfM0T1ai_Bjvqi7-srk6eXJUutWYq4/view
A_CÂMARA_DE_REFLEXÕES;Adonhiramita;1;https://drive.google.com/file/d/1dv-KbSBYlko_mnWpcmUYW2fRtCt0fJtj/view
A ADMINISTRAÇÃO DA LOJA NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1_JGoFLB-aK_eTgmtBaV3dqZ6ilZuJWKX/view
O MESTRE DE CERIMÔNIAS_ARTIGO;Adonhiramita;1;https://drive.google.com/file/d/1zDDhoeEh9XQmDZ1bA5f4VRTY-UUR27-i/view
O CHANCELER NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1OONaH05CYlgStaeMH8czwJ32Eazdgz2B/view
O MESTRE DE CERIMÔNIAS NO RITO ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1V0YsjO-9kZS3zKkmXWAjGQG4A5CDt3Z7/view
RAÍZES DO OCULTO;;1;
ABC DO APRENDIZ;;1;https://drive.google.com/file/d/11Km1owMhlECh8vrR0-uQiLSNGl_Zv90y/view
ABC DOS SIGNIFICA DOS MACONICOS;;1;https://drive.google.com/file/d/13z00CqfKdoL2Ko3YBhzvep1qYojvyWOS/view
ADOUM_EL_MAESTRO_PERFECTO_Y_SUS_MISTERIOS;;1;https://drive.google.com/file/d/1CMvyO9BDGGVWy1Jf2aJyzhld0GozLeRV/view
ALCORAO;;1;https://drive.google.com/file/d/1SSw4cT1hJIPWspGOUvuL9iN-HGi-LcOX/view
ANTHONY ROBBINS - DESPERTE O GIGANTE  INTERIOR;;1;https://drive.google.com/file/d/1l38sMzH8vKywkzsJ_XkFrIaXV165iemk/view
ANTHONY-ROBBINS-PODER-SEM-LIMITES;;1;https://drive.google.com/file/d/1zCz9t0g3SUc9v6LcPxZyZVDDq1Uv7g_t/view
ANTIGUOS RITOS MISTICOS;;1;https://drive.google.com/file/d/1ZI5BbHNYRD0efFF8_Xj8hOTl3g9APPI7/view
AO ORADOR-DE-UMA-LOJA;;1;https://drive.google.com/file/d/1ozsrmqxx_UCd8nI4ZrUOC_mjTV8bAz-N/view
MANUAL DO APRENDIZ FRANCO MAÇOM;;1;https://drive.google.com/file/d/1CENurx6QXEbNIv8k0jMKZ-M9XpSyDwu1/view
AS CLAVICULAS DE SALOMAO - COMPLETO;;1;https://drive.google.com/file/d/1gXaPr6OQwbbgp9NKJCb5-TPV7hDpGwTF/view
AS MÁSCARAS DE DEUS - VOL. II;;1;https://drive.google.com/file/d/1ObiJ_Usyp-5UxtDs1bFQ0ax_pLVW4Q0h/view
AS ORIGENS HISTÓRICAS DA MÍSTICA MAÇÔNICA - JOSÉ CASTELLANI;;1;https://drive.google.com/file/d/1cp6rN_wkG-Dk1ZgImiaQtmkTVWdKkr4l/view
AS SOCIEDADE SECRETAS;;1;https://drive.google.com/file/d/11pxhOp3q_WF1hhoIo2U3Y2ypqap4_GOh/view
ASTROLOGIA CABALISTICARAV. PHILIP S;;1;https://drive.google.com/file/d/1jeQUm6jjVz9vA-UnInaD-UAIIRuH5yY1/view
ASTROS E SIMBOLOS;;1;https://drive.google.com/file/d/1c-TTZrvcBJ_lbuoJyvN-lww2HQK1p7Fz/view
ATLAS ILUSTRADO DE LOS MISTERIOS;;1;https://drive.google.com/file/d/1mtQH9PWjTU4dZldIUqRi-v70g2CLjPjw/view
ATOS DE SALOMÃO TRADUÇÃO;;1;https://drive.google.com/file/d/1hMqs-qWdB-iXpBFB7H4tMssKPfS_d1uk/view
AUTORRESPONSABILIDADE PAULO VIEIRA;;1;https://drive.google.com/file/d/1XMQMJkJ2T_ogVxtqwkn_z01uVqTukAYd/view
BILIONÁRIOS - RICARDO GEROMEL;;1;https://drive.google.com/file/d/1NJy8JYMUO2Zcxh-fmAm16PM6GECOOWsr/view
CADEIA DE UNIAO;Adonhiramita;1;https://drive.google.com/file/d/1sC2MJCfZO4iRtOwhKWdfRdcf8BGGuSdd/view
CATECISMO APRENDIZ ADONHIRAMITA;Adonhiramita;1;https://drive.google.com/file/d/1CH5KAKbbhM4MLdEkwoLb3ql5BLcgbpj6/view
COMO EVITAR PREOCUPACOES E COMECAR A VIV - DALE CARNEGIE;;1;https://drive.google.com/file/d/1EbgTa3gahaUtK-0QNxiANgz6SlGLxf1x/view
CONCEITO ROSA CRUZ DOS COSMOS;;1;https://drive.google.com/file/d/1BsG1QaFHRo-XTR_FCmESYYjUsOTeLFg0/view
CONSTITUIÇÃO DA MAÇONARIA BRASILEIRA - 1873;Maçonaria;1;https://drive.google.com/file/d/1iX1NXBInnSM5BMB2zZApStL9zkO3rKxk/view
CORPUS HERMÉTICUM (ILUSTRADO);;1;https://drive.google.com/file/d/1JZcSZ_J-ZtQvknhByVrpvDiMKhQsI1n2/view
CURSO DE CABALA COM NOCOES DE HEBRAICO & ARAMAICO;Cabala;1;https://drive.google.com/file/d/1-j6SuMhFDqwaUVdwjtfyE7nEqNAwqC2u/view
DANIEL GOLEMAN _ A ARTE DA MEDITACAO;;1;https://drive.google.com/file/d/1NkE7A8Vp24vjwXsm-LYMTJ-iGHB6nig-/view
DESVENDANDO A MAÇONARIA (1);Maçonaria;1;https://drive.google.com/file/d/1L5CufqfzzTN1tVeyuKNUssHplOUdpWZC/view
DICCIONARIO ENCICLOPÉDICO DE LA MASONERÍA II - FRAU ABRINES;;1;https://drive.google.com/file/d/1GRj7cVORmTasq2FtYt7T6vj8-DRuguKZ/view
DICINARIO MAÇONARIA COMPLETA;Maçonaria;1;https://drive.google.com/file/d/1JX0HldXBqkwPO2TqqIMDZucDbNCf9pVV/view
DICIONARIO SECRETO DA MAÇONARIA;Maçonaria;1;https://drive.google.com/file/d/191ONRF1N15u7plwvc8794q5EnYKLrD_2/view
DICIONARIO-DE-MACONARIA-JOAQUIM-GERVASIO-DE-FIGUEIREDO;;1;https://drive.google.com/file/d/1DMpPqQPtKtsCm6cQwnXo0OdqpPn5drWY/view
DINHEIRO DOMINE ESSE JOGO - TONY ROBBINS;;1;https://drive.google.com/file/d/1BI5OJx1d9V-vsrPfop_Vyi3ZPUdWPovT/view
O CAMINHO DOS ESSENIOS;;1;https://drive.google.com/file/d/1ddlvqU1x5MrUjQWrvtLp4BHAW7KeG244/view
FAÇA O  QUE TEM DE SER FEITO;;1;https://drive.google.com/file/d/1-dj-E24Ujzi2Pfk0Kc1ctIzJgcCLyx8-/view
FIGURINOS MAÇÔNICOS OITOCENTISTAS;;1;https://drive.google.com/file/d/1yYm3-0ogBBxH-_PJsW7eD4AMA7L8Hvij/view
FIM DOS TEMPOS - ZECHARIA SITCHIN;;1;https://drive.google.com/file/d/1ioqwvddnMtp5L1bTNj8WgVlpH7ptJ4yi/view
GEOMETRIA SAGRADA;;1;https://drive.google.com/file/d/1UuZkoxJGD2b99mFUENoJv3fsWpXWG49c/view
GEOMETRIA SAGRADA NIGEL PENNICK;;1;https://drive.google.com/file/d/1e1UEk3BZRM1SGCYC6zOSI5WVnYGDysDG/view
GIORDANO_BRUNO;;1;https://drive.google.com/file/d/1alLHuuattwDrUOAbAyDAT3yMfPJZcyB4/view
GRANDES VULTOS DA INDEPENDÊNCIA DO BRASIL (1);;1;https://drive.google.com/file/d/1Nda_419hIgb1WpZEFG9ZWg_MzTqH6ZWe/view
GRAU 1 ADONHIRAMITA 1836;Adonhiramita;1;https://drive.google.com/file/d/1uFn3--1kpXfeqi2uwCgAMPQvI-M3Hqa1/view
GRAU DE APRENDIZ MACOM;;1;https://drive.google.com/file/d/1VAMkZbPFphhX0_pWvETh33wBxY5jo0NW/view
GUIA DOS ALTOS GRAUS - JOHN SEBASTIAN MARLOW WARD;;1;https://drive.google.com/file/d/1ff_jjmGhSxN6sQ2JKCQNKvTOotW1dtlt/view
GUIA-PRÁTICO-DECODIFICANDO-O-CÉREBRO-HUMANO;;1;https://drive.google.com/file/d/1LEooNqK4v1HzeDh_99WBeLNZ0fImXrhb/view
HISTORIA DA MACONARIA - DAS ORIGENS CORPORATIVAS A MACONARIA MODERNA;;1;https://drive.google.com/file/d/1ooG8fI8bmE9utpNAyYB9p7CKdr4uwmOB/view
HISTÓRIA DA MAÇONARIA NO BRASIL COMPILADA;Maçonaria;1;https://drive.google.com/file/d/124Q7cVMGnmiNQhJ3Ob_dCrDZE54tMZX4/view
INDIVIDUO E COSMO NA FILOSOFIA DO RENASCIMENTO;Filosofia;1;https://drive.google.com/file/d/119pAbF5WPE0WBjvJHlnDGzLix0knDpwK/view
INFLUENCIAS DA ORIGEM DA ORDEM MACONICA;;1;https://drive.google.com/file/d/1TE5Rj2xa0KRiCiJ7wF7RtN-vyT6VHqVJ/view
INTELIGENCIA EMOCIONAL - DANIEL GOLEMAN;;1;https://drive.google.com/file/d/18p6I07TmUI8IYxNbQkdH6Rc1mSgDy898/view
INTELIGENCIA POSITITY SHIRZARD CHAMINE-1;;1;https://drive.google.com/file/d/1VVaZ3OFZvs19Oamptq5Gh2WnLsksavWo/view
INTELIGENCIA SOCIAL - DANIEL GOLEMAN;;1;https://drive.google.com/file/d/1xn5dJ_lG36J-1XfbgpmdaG6oChjAJ9_H/view
INTRODUCAO A ALQUIMIA;;1;https://drive.google.com/file/d/1Qirvn2z7HKOAr07UjJdvWG_ARf2tAn0S/view
INTRODUCAO A MACONARIA;;1;https://drive.google.com/file/d/1T3EiIi7Bp86p4Cm1rtTlpWuRm-hAu2Gu/view
A AÇÃO SECRETA DA MAÇONARIA NA POLÍTICA MUNDIAL-JOSÉ CASTELLANI -;Maçonaria;1;https://drive.google.com/file/d/1JqAA7nHIQEeDLS4Dmcm0tbUGx3LhVoBa/view
LANDMARQUES - VANILDO DE SENNA - 1981;;1;https://drive.google.com/file/d/1CGWcekLVlOsbd12mop1orrv1mtjP5_zM/view
LIVRO_TRANSFORMACAO_DIGITAL_ADDTECH;;1;https://drive.google.com/file/d/13cNl5LpQG_MBB3OG8yKBlk5sTWIdHz7C/view
LUZ-MARTINISTA_;;1;https://drive.google.com/file/d/1UYO2ZLogOzpplb_GbI39QcZoVJK96ri4/view
LVR - MAÇONARIA PARA LEIGOS;Maçonaria;1;https://drive.google.com/file/d/1Mptt4o5Co2pkn0_gZjtlHlYeNYfSjfqj/view
MAÇONARIA ADONHIRAMITA - APONTAMENTOS -JOSÉ MARTINS JURADO;Adonhiramita, Maçonaria;1;https://drive.google.com/file/d/1fyWv7rdha7o7_ryjfcjO7igNeLHXgxbA/view
MAÇONARIA E ASTROLOGIA - JOSÉ CASTELLANI;Maçonaria;1;https://drive.google.com/file/d/1-4H6vYi0ZWl7W1__s7pv5n_657ZrzuE1/view
MAÇONARIA E SIMBOLOGIA;Maçonaria;1;https://drive.google.com/file/d/17z7-0yvJCRjWYlQHgXazgUC2fricetrQ/view
MAÇONARIA REVELADA - OS SEGREDOS DO APRENDIZ MAÇOM;Maçonaria;1;https://drive.google.com/file/d/1Z70evss6z291f47JXATOiB5uQX8ADjvK/view
MAÇONARIA SIMBOLICA2;Maçonaria;1;https://drive.google.com/file/d/1R2dRkvetcLtN0nqozxQG176M8PHeFKPw/view
MACONARIA_EDUCACAO_CULTURA_E_DIREITOS_HUMANOS;;1;https://drive.google.com/file/d/1toU8JgKWidiVvw93Mmz6d_H06jn6GnYB/view
MAÇONARIA-100-INSTRUÇÕES-DE-APRENDIZ;Maçonaria;1;https://drive.google.com/file/d/1WAC-ikyQbqN13wnQlLpBGt2byQsBvCfD/view
MANUAL DE CAÇA AOS MAÇONS;;1;https://drive.google.com/file/d/1_cDWsuamxEjbRBS2DAjGLn51k5uXCtcE/view
MANUAL OF FREEMASONRY - RICHARD CARLILE - 1833;;1;https://drive.google.com/file/d/1ijw1sBQM0C7HYi_k-zct_QFFPb5VWlwI/view
MANUAL_MESTRE_CERIMONIAS;;3;https://drive.google.com/file/d/1OC0tjvuOBR6G_WNGj12f9_d0R4nlPfud/view
MINDSET - A NOVA PSICOLOGIA DO SUCESSO - CAROL DWECK (1);;1;https://drive.google.com/file/d/1BkoKIoYGwRaebvHzLRsw9T9IqnHwPpkX/view
MORAL E DOGMA COMPLETO - ALBERT PIKE;;1;https://drive.google.com/file/d/1IQbtt9pnvwehr5pGLmePxc4MQCQbLalB/view
O CATECISMO DOS RITOS MACONICOS ADOTADOS PELO GOB;;1;https://drive.google.com/file/d/1soUu1krWrYyNE_zOBDY1tLOZVbWlR68t/view
O CÓDIGO DE SALOMÃO;;1;https://drive.google.com/file/d/1qLMFSez2U33ydbR4x3OrcFrmPCKWaZXe/view
O COMPANHEIRISMO MAÇONICO;;1;https://drive.google.com/file/d/16tSDE66cOe7rvVSCZbs5jgE-xyJKrQNW/view
O GRANDE LIVRO DA LEI;;1;https://drive.google.com/file/d/12iZt9eS3yJ42XrmH_OwajyWtERcx71PV/view
O HOMEM E SEUS SIMBOLOS;;1;https://drive.google.com/file/d/1EeM9IP5n5UbPhZCYolPpjYbZ8U2I832V/view
O JEITO HARVARD DE SER FELIZ - - SHAWN ACHOR;;1;https://drive.google.com/file/d/1iI3LdpJEoI-y30JX_E0MKjdfzRxwaGWY/view
O LIVRO DE OURO DA MITOLOGIA - THOMAS BULFINCH;;1;https://drive.google.com/file/d/1jfP-zlt9gkmcHeOt7POxHV83aZDsLI8S/view
O LIVRO SECRETO DA MAÇONARIA - LOURIVALDO PEREZ BAÇAN;Maçonaria;1;https://drive.google.com/file/d/1mBMBobn01MZD9NFINooYxnJeIl6o6q5F/view
O PODER DA ACAO - PAULO VIEIRA;;1;https://drive.google.com/file/d/1Ou2F6oZxLtLUdN3eoRrhVvOqNc4TQw5c/view
O PODER DO HABITO - CHARLES DUHIGG;;1;https://drive.google.com/file/d/1Bz7juB1VUvH4J5mPau9kbQvawOKewv4s/view
O PODER DO SUBCONSCIENTE - JOSEPH MURPHY-2;;1;https://drive.google.com/file/d/1rf-a9qEaAUwuvVRz9WwaymhveWU1DXYK/view
O QUE VOCE PRECISA SABER SOBRE A MAÇONARIA;Maçonaria;1;https://drive.google.com/file/d/17kDrP5lcrFEXZk3Ou-DFst0SxujFX2fE/view
O SANTO GRAAL E A LINHAGEM SAGRADA - MICHAEL BAIGENT;;1;https://drive.google.com/file/d/1rBBkLN5FotOBEAVR2Pw_2GvwEnJ0hyhC/view
O SANTUARIO DO EU;;1;https://drive.google.com/file/d/1eCr-_HlNXd19WSWC1uZP5BNJhqsooDkw/view
O SEGREDO DA MACONARIA;;1;https://drive.google.com/file/d/1Joa6fW7THXT0eApEWnc4-0xgsTW3R3U1/view
O SIGNIFICADO DA MACONARIA;;1;https://drive.google.com/file/d/1vu2dOrazHoOaOaPqp08AFOPM6lzr-eAz/view
O SIMBOLISMO DA CRUZ;;1;https://drive.google.com/file/d/19QnXdRDnVWMlcGPu2cCHeXvFVPg12Fle/view
O TESTAMENTO DE SÃO JOÃO_J. J. BENÍTEZ_219;;1;https://drive.google.com/file/d/1xzsy9J-kEdczcyguLDLbA3CbbJ4zZ88A/view
O TRIVIUM - BIBLIOTECA FREEMASONRY;;1;https://drive.google.com/file/d/16xQ-Lpc2_8d8dqQmTyxaxzR7H9cF3D8f/view
O_CICLO_DO_SUCESSO__COMO_DESCOBRIR;;1;https://drive.google.com/file/d/1Oxd3MYRrrnw2kUG-roK6GupB_Xlpl9j0/view
O_PODER_DO_AGORA_ECKHART_TOLLE;;1;https://drive.google.com/file/d/1K_il5ZfLZXG9iMhWYmBzsqZKgwPXDaoe/view
O-CAVALEIRO-PRESO-NA-ARMADURA_ROBERT-FISHER;;1;https://drive.google.com/file/d/1yBBQFa4hbqsu1akzexBndcsoPNBVW7Dp/view
ORIGINE DE LA MACONNERIE - 1787 SAN VICTOR;;1;https://drive.google.com/file/d/1ykaDMDbUTtKBuAupDXF96lCw9h46SbgO/view
OS DRUIDAS OS DEUSES CELTAS COM FORMAS DE ANIMAIS;;1;https://drive.google.com/file/d/1ErAnjhVfUCnPRTKsumuw0wHUF6fUA6fW/view
OS GRANDES INICIADOS - ÉDOUARD SCHURÉ;;1;https://drive.google.com/file/d/1ZLXOTbJ5V-UYHk3_zNHWW99Dl1PeETAW/view
OS ROSA CRUZ OU A CONSPIRACAO DOS SAPIENTES;;1;https://drive.google.com/file/d/1fdb3g5kVpNkvX6XlZLJp0N_IZorFp2_M/view
OS SEGREDOS DA MENTE MILIONARIA;;1;https://drive.google.com/file/d/1G2AZBPM9f5ODZApBqqMr4rzAdLRRQ2Cs/view
OS SEGREDOS DO APRENDIZ MAÇOM;;1;https://drive.google.com/file/d/1XG59YBooxunemWvOpYeicgMId5OvQxWz/view
OS SEGREDOS PERDIDOS DA ARCA SAGRADA - LAURENCE GARDNER;;1;https://drive.google.com/file/d/1SZq038797NRNhcqxJncAIdtyBITNs6W7/view
OS TEMPLÁRIOS E O PERGAMINHO DE CHINON;;1;https://drive.google.com/file/d/1pUihGCMJP2_hv8fz59asjQQeAChyM1s-/view
OS_7_HÁBITOS_DAS_PESSOAS_ALTAMENTE_EFICAZES-STEPHEN_COVEY;;1;https://drive.google.com/file/d/1AiAsJZX4D5vqqLSgLoIO6d8BmoWerxRV/view
PICOS-E-VALES-SPENCER-JOHNSON;;1;https://drive.google.com/file/d/1tyYDQWv3ETiPLYeqycC5Ce04K6gEfH9G/view
PINGA FOGO NA MACONARIA;;1;https://drive.google.com/file/d/177d6PyQp43319i8rO-PBHU6VmZrAKxmB/view
POR QUE FAZEMOS O QUE FAZEMOS_ - MARIO SERGIO CORTELLA-1;;1;https://drive.google.com/file/d/1T_LfOQVLvWnSd5083a4TcfZQgFJ-KS6m/view
PRINCE HALL;;1;https://drive.google.com/file/d/13Hnxo6Ok7EY2himMuZtNR6laTY5xck0C/view
QUADRIVIUM;;1;https://drive.google.com/file/d/1A5XB5_q0jp8sqTdxDUexlKaRaC4fUXHa/view
QUE É MAÇÔNARIA;;1;https://drive.google.com/file/d/1Ul2iH2N4khS9MahYMGYcybOE9eiiRsvW/view
QUEM PENSA ENRIQUECE - NAPOLEON HILL-1;;1;https://drive.google.com/file/d/1wiZ8xA-Ej1XgTJKhzSuhiAgAS7udGwgG/view
RAÍZES DO OCULTO - BLAVATSKY;;1;https://drive.google.com/file/d/1IMOMyYmoU2d4rOvPn1sHmJA499xHuTOo/view
RESUMO DA HISTÓRIA DA MAÇONARIA - 1836;Maçonaria;1;https://drive.google.com/file/d/1ul3ZtjeLFOer0oIW3WC1MtRVn-7XKkDr/view
RITUAL ADONH.'. GRAU 01 - 1949;Adonhiramita;1;https://drive.google.com/file/d/1olYzDD0D01m5Zxm8spDBUcopyGpdpOHl/view
RITUAL ADONHIRAMITA GRAU 01 - 1822;Adonhiramita,Ritual;1;https://drive.google.com/file/d/1F4S8r4N9ICcVCF6LO9R3yRCdM7eFhF_t/view
RITUAL ADONHIRAMITA GRAU 01 - 1836;Adonhiramita,Ritual;1;https://drive.google.com/file/d/1EN6eiemLUmARIUVliJ0_M7T_FzJovowL/view
RITUAL ADONHIRAMITA GRAU 01 - 1896;Adonhiramita,Ritual;1;https://drive.google.com/file/d/1K-uj4dwGHmIAenARoiOlscfmd4HSTyVf/view
RITUAL ADONHIRAMITA GRAU 01 - 1954;Adonhiramita,Ritual;1;https://drive.google.com/file/d/1pt_D7SoyrVjUdqpK1rTzwevajvjlWCRL/view
RITUAL ADONHIRAMITA GRAU 01 - 1963;Adonhiramita,Ritual;1;https://drive.google.com/file/d/1vPBiT30tO7KUMSNW560EPOvGwqmDP7eR/view
RITUAL ADONHIRAMITA GRAU 01 - 1969;Adonhiramita,Ritual;1;https://drive.google.com/file/d/1nZbDJvLM17sDT85ngG258IPi8s-9eWrp/view
RITUAL ADONHIRAMITA GRAU 01 - 1986;Adonhiramita,Ritual;1;https://drive.google.com/file/d/1Vg-j_lrb5emxKWLjamCA8IgAQknXccAa/view
RITUAL ADONHIRAMITA GRAU 01-1977;Adonhiramita,Ritual;1;https://drive.google.com/file/d/1BW3_B1vJItzKxWDFdK2olmrxPVeBHzP9/view
RITUAL ADONHIRAMITA GRAU GRAU 01 - 2006-GLESP;Adonhiramita,Ritual;1;https://drive.google.com/file/d/1lY_IYHaFLZIEF1kO9phSJax7rroJw8Ue/view
RITUAL ADONHIRAMITAL LOJA COMERCIO E ARTE-1822;Adonhiramita,Ritual;1;https://drive.google.com/file/d/1-mPl6HYJWqSzV5zhiP8G6RwEjdOVLxJJ/view
RITUAL APRENDIZ RITO MODERNO_2009;Ritual;1;https://drive.google.com/file/d/18pJsm60nX4AkYvZfJj-wAIVqxYTnZ2NK/view
RITUAL DE  APRENDIZ RFM_1952;Ritual;1;https://drive.google.com/file/d/1LQf3UkXbBuIKjubcP9aQLqJx1LCBCwXh/view
RITUAL DE EMULAÇÃO - A MACONARIA INGLESA NO BRASIL - FÁBIO M PAULINO;Ritual;1;https://drive.google.com/file/d/1ePEt5XGHZb5hwqbiip9RxjhohjumCz0z/view
RITUAL I II E III REAA 1904[1];Ritual;3;https://drive.google.com/file/d/1h4nky8OJHUVCgKmy3v3_yogMxv68BwPx/view
RITUAL.GRAU.1.1924.RITO.MODERNO;Ritual;1;https://drive.google.com/file/d/1XfJlEqHGlnruRT3eHN07mI4BYzsGSjLC/view
RIZZARDO DA CAMINO - SIMBOLISMO DO 1 GRAU;;1;https://drive.google.com/file/d/1-loNe9HM3hQbnkvP88UGCYT-eHNZ8OZ0/view
ROTEIRO MAÇÔNICO;;1;https://drive.google.com/file/d/1kI86iEpBBRVKADcZ1lekPXea4fEe1qSy/view
SIDARTA;;1;https://drive.google.com/file/d/1sjejbUHpgJpZcJW6r1YkjX33NtOsakT7/view
SIMBOLISMO NUMEROS;;1;https://drive.google.com/file/d/1tzSrDjbixwLBd8waN5aXXKrSakxy3uA6/view
SOCIEDADES SECRETAS - PHILIP GARDINER;;1;https://drive.google.com/file/d/1WYZYX8TTxJBSU_JfLx4HghNvymtCKKTS/view
SOCIEDADES SECRETAS - SERGIO PEREIRA COUTO;;1;https://drive.google.com/file/d/1BPQukZkJpoMiBKWD7lyIlvGZ5MCfTfip/view
SUPERCEREBRO - DEEPAK CHOPRA-1 (1);;1;https://drive.google.com/file/d/1__LMSpxZTNHze_HIXvZN4xYNoTmcLVdD/view
TODOS OS PERSONAGENS DA BÍBLIA DE A A Z;;1;https://drive.google.com/file/d/1gowUw7Xaz8geRBzybNKIliic_lVoKo50/view
TORÁ_COM_NOTAS_E_ILUSTRADO_O_LIVRO_SAGRADO_DA_INSTRUÇÃO;;1;https://drive.google.com/file/d/1xqwT-PxV1W4C0xwppNcflkzNGfZ-kiAI/view
TRANSFORMANDO-SUOR-EM-OURO-BERNARDO-ROCHA-DE-REZENDE (1);;1;https://drive.google.com/file/d/1iVAqQeRxCad7KgJR16-rluPfJqYjaLO3/view
TRATADO SOBRE A TOLERÂNCIA - VOLTAIRE;;1;https://drive.google.com/file/d/1YXv1kwenMtReSGZNKYQ2SyOetT-SDSrc/view
TRATADO_DE_CIENCIAS_OCULTAS;;1;https://drive.google.com/file/d/1aab2RzRIl7ki3pfFDQxTtAyImQcQUeKy/view
TREINANDO A EMOCAO PARA SER FEL - AUGUSTO CURY (1);;1;https://drive.google.com/file/d/1cy3KD1dhakJCBDP-mXKWwlB8jKSbI0rK/view
VERSOS AUREOS PITAGORAS- MARIO FERREIRA DOS SANTOS;;1;https://drive.google.com/file/d/1G1EgSiyjBFF1Z__ud6KA1DZOGpUatnr8/view
VIRTUDE E VERDADE GRAUS SIMBOL;;1;https://drive.google.com/file/d/1GkLyG_9dUZPuaOAeEqlZKsKjNGsQgwmU/view
ZÉ RODRIX - TRILOGIA DO TEMPLO 2 - ZOROBABEL;;1;https://drive.google.com/file/d/13w68o7tK2A_qdbI00xRWVrF_9wgTGX5u/view
ZÉ RODRIX - TRILOGIA DO TEMPLO 3 - ESQUIN DE FLOYRAC;;1;https://drive.google.com/file/d/16-pZJ4bWHVI-a8k9n_zPF-E1XwVRCDcG/view
ZE RODRIX_JOABEN - DIÁRIO DE UM CONSTRUTOR DO TEMPLO;;1;https://drive.google.com/file/d/1IRPmHHTdA6FWqDIM14xgWYnSLirJx2Ie/view
ZEN PARA DISTRAIDOS - MONJA COEN (1);;1;https://drive.google.com/file/d/1qRoqUU73XatobftqnJVPDUcY-lobgcce/view`;

  const getCoverUrl = (category: string) => {
    switch (category) {
      case 'Adonhiramita':
        return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80';
      case 'Adonhiramita-Rituais':
      case 'Rituais':
        return 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80';
      case 'História do Brasil':
        return 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=300&q=80';
      case 'Filosofia':
        return 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=300&q=80';
      case 'Simbologia':
        return 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=300&q=80';
      case 'Maçonaria':
        return 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=300&q=80';
      case 'Cabala':
        return 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=300&q=80';
      default:
        return 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=300&q=80';
    }
  };

  const list: Book[] = [];
  const lines = RAW_CSV_BOOKS.split('\n');

  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split(';');
    if (parts.length < 3) continue;

    const originalTitle = parts[0].trim();
    if (originalTitle === 'Título' || originalTitle === 'Título ') continue;

    // Standard Cleanups
    let title = originalTitle
      .replace(/\s*\(\d+\)$/, '')
      .replace(/\s*\[\d+\]$/, '')
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Map categories
    const rawCats = parts[1]
      ? parts[1].split(',').map(c => c.trim()).filter(Boolean)
      : [];

    if (rawCats.length === 0) {
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes('ritual') || lowerTitle.includes('catecismo') || lowerTitle.includes('rit') || lowerTitle.includes('cerimonia') || lowerTitle.includes('cerimônia') || lowerTitle.includes('abertura') || lowerTitle.includes('banquete') || lowerTitle.includes('roteiro')) {
        rawCats.push('Rituais');
      }
      if (lowerTitle.includes('adonhiramita') || lowerTitle.includes('adonh')) {
        rawCats.push('Adonhiramita');
      }
      if (lowerTitle.includes('maçonaria') || lowerTitle.includes('maçon') || lowerTitle.includes('macon') || lowerTitle.includes('loja') || lowerTitle.includes('veneravel') || lowerTitle.includes('venerável') || lowerTitle.includes('aprendiz') || lowerTitle.includes('companheiro') || lowerTitle.includes('mestre') || lowerTitle.includes('grau') || lowerTitle.includes('orador') || lowerTitle.includes('chanceler') || lowerTitle.includes('tesoureiro') || lowerTitle.includes('secretario') || lowerTitle.includes('porta bandeira') || lowerTitle.includes('harmonia') || lowerTitle.includes('cargos') || lowerTitle.includes('administração') || lowerTitle.includes('masonic') || lowerTitle.includes('freemasonry') || lowerTitle.includes('landmarks') || lowerTitle.includes('pinga fogo') || lowerTitle.includes('francs maçons')) {
        if (!rawCats.includes('Maçonaria')) rawCats.push('Maçonaria');
      }
      if (lowerTitle.includes('simbolo') || lowerTitle.includes('símbolo') || lowerTitle.includes('significado') || lowerTitle.includes('geometria') || lowerTitle.includes('misterio') || lowerTitle.includes('mistica') || lowerTitle.includes('mística') || lowerTitle.includes('oculto') || lowerTitle.includes('alquimia') || lowerTitle.includes('astrologia') || lowerTitle.includes('astros') || lowerTitle.includes('luz') || lowerTitle.includes('martinista') || lowerTitle.includes('druidas') || lowerTitle.includes('iniciados') || lowerTitle.includes('santo graal') || lowerTitle.includes('testamento') || lowerTitle.includes('bíblia') || lowerTitle.includes('biblia') || lowerTitle.includes('personagens') || lowerTitle.includes('fogo') || lowerTitle.includes('incensação') || lowerTitle.includes('corda') || lowerTitle.includes('abóbada') || lowerTitle.includes('colunas') || lowerTitle.includes('pavimento') || lowerTitle.includes('mosaico') || lowerTitle.includes('luvas') || lowerTitle.includes('painel') || lowerTitle.includes('câmara') || lowerTitle.includes('reflexões') || lowerTitle.includes('claviculas') || lowerTitle.includes('salomao') || lowerTitle.includes('salomão') || lowerTitle.includes('atos') || lowerTitle.includes('código') || lowerTitle.includes('codigo') || lowerTitle.includes('rosa cruz') || lowerTitle.includes('herméticum') || lowerTitle.includes('hermeticum') || lowerTitle.includes('essênios') || lowerTitle.includes('essenios')) {
        if (!rawCats.includes('Simbologia')) rawCats.push('Simbologia');
      }
      if (lowerTitle.includes('cabala') || lowerTitle.includes('cabalistica') || lowerTitle.includes('hebraico') || lowerTitle.includes('aramaico') || lowerTitle.includes('torá') || lowerTitle.includes('tora') || lowerTitle.includes('numerologia')) {
        if (!rawCats.includes('Cabala')) rawCats.push('Cabala');
      }
      if (lowerTitle.includes('brasil') || lowerTitle.includes('independência') || lowerTitle.includes('história') || lowerTitle.includes('historia') || lowerTitle.includes('século') || lowerTitle.includes('oitocentistas') || lowerTitle.includes('chinon') || lowerTitle.includes('templários')) {
        if (!rawCats.includes('História do Brasil')) rawCats.push('História do Brasil');
      }
      if (rawCats.length === 0) {
        rawCats.push('Filosofia');
      }
    } else {
      for (let i = 0; i < rawCats.length; i++) {
        if (rawCats[i] === 'Ritual') rawCats[i] = 'Rituais';
      }
    }

    const nivelAcesso = parts[2] ? parseInt(parts[2].trim()) || 1 : 1;
    const link = parts[3] ? parts[3].trim() : 'https://www.masonicacademy.com.br/wp-content/uploads/manual-aluno.pdf';

    // Extract authors and polish titles
    let author = 'Adonhiramita';
    let finalTitle = title;

    if (title.includes('ANTHONY ROBBINS')) {
      author = 'Anthony Robbins';
      finalTitle = title.replace(/ANTHONY ROBBINS\s*-\s*/, '').replace(/ANTHONY-ROBBINS-/, '');
    } else if (title.includes('DALE CARNEGIE')) {
      author = 'Dale Carnegie';
      finalTitle = title.replace(/\s*-\s*DALE CARNEGIE.*/, '');
    } else if (title.includes('DANIEL GOLEMAN')) {
      author = 'Daniel Goleman';
      finalTitle = title.replace(/DANIEL GOLEMAN\s*[-_]\s*/, '');
    } else if (title.includes('JOSÉ CASTELLANI')) {
      author = 'José Castellani';
      finalTitle = title.replace(/\s*-\s*JOSÉ CASTELLANI.*/, '');
    } else if (title.includes('JOAQUIM GERVASIO DE FIGUEIREDO')) {
      author = 'Joaquim Gervásio de Figueiredo';
      finalTitle = title.replace(/\s*-\s*JOAQUIM GERVASIO DE FIGUEIREDO.*/, '').replace(/-JOAQUIM-GERVASIO-DE-FIGUEIREDO/, '');
    } else if (title.includes('TONY ROBBINS')) {
      author = 'Tony Robbins';
      finalTitle = title.replace(/\s*-\s*TONY ROBBINS.*/, '');
    } else if (title.includes('ZECHARIA SITCHIN')) {
      author = 'Zecharia Sitchin';
      finalTitle = title.replace(/\s*-\s*ZECHARIA SITCHIN.*/, '');
    } else if (title.includes('NIGEL PENNICK')) {
      author = 'Nigel Pennick';
      finalTitle = title.replace(/\s*NIGEL PENNICK.*/, '');
    } else if (title.includes('JOHN SEBASTIAN MARLOW WARD')) {
      author = 'John Sebastian Marlow Ward';
      finalTitle = title.replace(/\s*-\s*JOHN SEBASTIAN MARLOW WARD.*/, '');
    } else if (title.includes('SHIRZARD CHAMINE')) {
      author = 'Shirzard Chamine';
      finalTitle = title.replace(/\s*SHIRZARD CHAMINE.*/, '');
    } else if (title.includes('JOSÉ MARTINS JURADO')) {
      author = 'José Martins Jurado';
      finalTitle = title.replace(/\s*[-_]\s*JOSÉ MARTINS JURADO.*/, '');
    } else if (title.includes('CAROL DWECK')) {
      author = 'Carol Dweck';
      finalTitle = title.replace(/\s*-\s*CAROL DWECK.*/, '');
    } else if (title.includes('ALBERT PIKE')) {
      author = 'Albert Pike';
      finalTitle = title.replace(/\s*-\s*ALBERT PIKE.*/, '');
    } else if (title.includes('THOMAS BULFINCH')) {
      author = 'Thomas Bulfinch';
      finalTitle = title.replace(/\s*-\s*THOMAS BULFINCH.*/, '');
    } else if (title.includes('LOURIVALDO PEREZ BAÇAN')) {
      author = 'Lourivaldo Perez Baçan';
      finalTitle = title.replace(/\s*-\s*LOURIVALDO PEREZ BAÇAN.*/, '');
    } else if (title.includes('PAULO VIEIRA')) {
      author = 'Paulo Vieira';
      finalTitle = title.replace(/\s*-\s*PAULO VIEIRA.*/, '');
    } else if (title.includes('CHARLES DUHIGG')) {
      author = 'Charles Duhigg';
      finalTitle = title.replace(/\s*-\s*CHARLES DUHIGG.*/, '');
    } else if (title.includes('JOSEPH MURPHY')) {
      author = 'Joseph Murphy';
      finalTitle = title.replace(/\s*-\s*JOSEPH MURPHY.*/, '');
    } else if (title.includes('MICHAEL BAIGENT')) {
      author = 'Michael Baigent';
      finalTitle = title.replace(/\s*-\s*MICHAEL BAIGENT.*/, '');
    } else if (title.includes('J. J. BENÍTEZ')) {
      author = 'J. J. Benítez';
      finalTitle = title.replace(/_J\.\s*J\.\s*BENÍTEZ.*/, '');
    } else if (title.includes('ECKHART TOLLE')) {
      author = 'Eckhart Tolle';
      finalTitle = title.replace(/_ECKHART_TOLLE.*/, '');
    } else if (title.includes('ROBERT FISHER')) {
      author = 'Robert Fisher';
      finalTitle = title.replace(/_ROBERT[-_]FISHER.*/, '');
    } else if (title.includes('ÉDOUARD SCHURÉ')) {
      author = 'Édouard Schuré';
      finalTitle = title.replace(/\s*-\s*ÉDOUARD SCHURÉ.*/, '');
    } else if (title.includes('LAURENCE GARDNER')) {
      author = 'Laurence Gardner';
      finalTitle = title.replace(/\s*-\s*LAURENCE GARDNER.*/, '');
    } else if (title.includes('STEPHEN COVEY')) {
      author = 'Stephen Covey';
      finalTitle = title.replace(/-STEPHEN_COVEY.*/, '');
    } else if (title.includes('SPENCER JOHNSON')) {
      author = 'Spencer Johnson';
      finalTitle = title.replace(/-SPENCER[-_]JOHNSON.*/, '');
    } else if (title.includes('MARIO SERGIO CORTELLA')) {
      author = 'Mário Sergio Cortella';
      finalTitle = title.replace(/\s*[-_]\s*MARIO SERGIO CORTELLA.*/, '');
    } else if (title.includes('NAPOLEON HILL')) {
      author = 'Napoleon Hill';
      finalTitle = title.replace(/\s*-\s*NAPOLEON HILL.*/, '');
    } else if (title.includes('BLAVATSKY')) {
      author = 'Helena Blavatsky';
      finalTitle = title.replace(/\s*-\s*BLAVATSKY.*/, '');
    } else if (title.includes('FÁBIO M PAULINO')) {
      author = 'Fábio M. Paulino';
      finalTitle = title.replace(/\s*-\s*FÁBIO M PAULINO.*/, '');
    } else if (title.includes('RIZZARDO DA CAMINO')) {
      author = 'Rizzardo da Camino';
      finalTitle = title.replace(/RIZZARDO DA CAMINO\s*-\s*/, '');
    } else if (title.includes('PHILIP GARDINER')) {
      author = 'Philip Gardiner';
      finalTitle = title.replace(/\s*-\s*PHILIP GARDINER.*/, '');
    } else if (title.includes('SERGIO PEREIRA COUTO')) {
      author = 'Sérgio Pereira Couto';
      finalTitle = title.replace(/\s*-\s*SERGIO PEREIRA COUTO.*/, '');
    } else if (title.includes('DEEPAK CHOPRA')) {
      author = 'Deepak Chopra';
      finalTitle = title.replace(/\s*-\s*DEEPAK CHOPRA.*/, '');
    } else if (title.includes('BERNARDO ROCHA DE REZENDE')) {
      author = 'Bernardo Rezende (Bernardinho)';
      finalTitle = title.replace(/-BERNARDO-ROCHA-DE-REZENDE.*/, '');
    } else if (title.includes('VOLTAIRE')) {
      author = 'Voltaire';
      finalTitle = title.replace(/\s*-\s*VOLTAIRE.*/, '');
    } else if (title.includes('AUGUSTO CURY')) {
      author = 'Augusto Cury';
      finalTitle = title.replace(/\s*[-_]\s*AUGUSTO CURY.*/, '');
    } else if (title.includes('MARIO FERREIRA DOS SANTOS')) {
      author = 'Mário Ferreira dos Santos';
      finalTitle = title.replace(/-\s*MARIO FERREIRA DOS SANTOS.*/, '');
    } else if (title.includes('ZÉ RODRIX')) {
      author = 'Zé Rodrix';
    } else if (title.includes('MONJA COEN')) {
      author = 'Monja Coen';
      finalTitle = title.replace(/\s*-\s*MONJA COEN.*/, '');
    } else if (title.includes('PHILIP S')) {
      author = 'Rav. Philip S.';
      finalTitle = title.replace(/RAV\.\s*PHILIP\s*S.*/, '');
    } else {
      const hypParts = title.split(' - ');
      if (hypParts.length > 1) {
        const potential = hypParts[hypParts.length - 1].trim();
        if (/^[A-Za-zÀ-ÖØ-öø-ÿ\s\.]+$/.test(potential) && potential.length > 2 && potential.length < 30) {
          author = potential;
          finalTitle = hypParts.slice(0, -1).join(' - ').trim();
        }
      }
    }

    // Double clean title to avoid any weird prefix or leftovers
    finalTitle = finalTitle.replace(/^(O_PODER_DO_AGORA|O-CAVALEIRO-PRESO-NA-ARMADURA|TRANSFORMANDO-SUOR-EM-OURO|RAÍZES DO OCULTO)\s*[-_]\s*/i, '');
    finalTitle = finalTitle.replace(/\s+/g, ' ').trim();

    const slug = originalTitle.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const id = `book-${slug}`;

    const tagsSet = new Set<string>();
    tagsSet.add(rawCats[0] || 'Filosofia');
    if (author && author !== 'Adonhiramita') tagsSet.add(author);
    if (finalTitle.toLowerCase().includes('aprendiz')) tagsSet.add('Aprendiz');
    if (finalTitle.toLowerCase().includes('companheiro')) tagsSet.add('Companheiro');
    if (finalTitle.toLowerCase().includes('mestre')) tagsSet.add('Mestre');
    if (finalTitle.toLowerCase().includes('ritual')) tagsSet.add('Ritual');

    list.push({
      id,
      title: finalTitle,
      author,
      category: rawCats[0] || 'Filosofia',
      categories: rawCats,
      nivelAcesso,
      status: 'Ativo',
      tags: Array.from(tagsSet),
      thumbnailUrl: getCoverUrl(rawCats[0] || 'Filosofia'),
      link: link || 'https://www.masonicacademy.com.br/wp-content/uploads/manual-aluno.pdf'
    });
  }

  return list;
})();

