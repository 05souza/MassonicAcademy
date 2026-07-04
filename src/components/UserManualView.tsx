import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  FileText, 
  CheckCircle, 
  Shield, 
  Award, 
  Sparkles, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  Upload, 
  Users, 
  Settings, 
  User, 
  BookOpenCheck,
  CheckCircle2,
  Info
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'aluno' | 'admin' | 'geral';
}

interface UserManualViewProps {
  isAdmin?: boolean;
}

export default function UserManualView({ isAdmin = false }: UserManualViewProps) {
  const [activeManualSection, setActiveManualSection] = useState<'geral' | 'aluno' | 'admin' | 'faq'>('geral');
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      category: 'aluno',
      question: 'Quem pode emitir um certificado na plataforma?',
      answer: 'Qualquer usuário ativo que realizar um Simulado de Grau e atingir a pontuação mínima de aprovação exigida (definida pelo administrador). Observe que, se a opção "Emitir Certificado apenas para Conteúdo Completo" estiver ativada nas configurações daquele questionário, você só terá o botão de certificado disponível se realizar o "Simulado Completo", pois os simulados nos modos "Amostra" ou "Por Tema" servirão apenas como treino.'
    },
    {
      category: 'aluno',
      question: 'Como vejo o meu progresso de estudo?',
      answer: 'Na aba "Início", cada título possui uma barra de progresso individual. Quando você entra em um título e lê suas diretrizes/instruções, existe uma opção para marcar a leitura como concluída. Seu progresso geral também é resumido na aba "Perfil".'
    },
    {
      category: 'aluno',
      question: 'O que define o meu Grau de Acesso?',
      answer: 'Cada usuário possui um Grau de Acesso (nível de 1 a 33) configurado pelo Administrador. Você apenas visualizará no painel os títulos e questionários cujo nível exigido seja igual ou inferior ao seu próprio grau.'
    },
    {
      category: 'aluno',
      question: 'Como posso consultar e ler materiais na Biblioteca Virtual?',
      answer: 'Basta acessar a aba "Biblioteca" no menu principal. Lá você pode pesquisar por palavras-chave, filtrar as obras pelas categorias ou por graus específicos, e alternar o modo de visualização entre Grade ou Lista. Caso um livro exija um Grau de Instrução superior ao seu, ele aparecerá como Bloqueado para você.'
    },
    {
      category: 'admin',
      question: 'Como posso importar uma lista de títulos em massa via Excel?',
      answer: 'Como Administrador, vá até a aba "Perfil", clique em "Gerenciar Títulos" e depois no botão "Importar de Excel / CSV". O arquivo deve conter colunas com os cabeçalhos: "titulo" ou "title" (para o nome), "instrutor" ou "owner" (para o responsável), e "grau" ou "level" (nível requerido).'
    },
    {
      category: 'admin',
      question: 'Como funciona o limite "Emitir Certificado apenas para Conteúdo Completo"?',
      answer: 'Esta é uma configuração habilitada individualmente por questionário. Se habilitada, impede que irmãos obtenham certificados ao fazerem simulados rápidos baseados em "Amostras" de 10 ou 20 questões ou simulações por uma categoria temática única. Isso garante que o certificado oficial só seja liberado após o exame abrangente de 100% das perguntas.'
    },
    {
      category: 'admin',
      question: 'Como ocultar temporariamente um material ou livro da Biblioteca Virtual?',
      answer: 'Acesse o menu "Perfil", clique em "Gerenciar Biblioteca" e edite o material correspondente, alterando seu status de "Ativo" para "Inativo". Obras inativas continuam salvas no seu painel administrativo, mas desaparecem completamente da visão dos alunos na Biblioteca.'
    },
    {
      category: 'admin',
      question: 'Como faço para reajustar a nota de aprovação de um simulado?',
      answer: 'No menu "Questionários", sob o painel de Administração Master (na parte inferior), selecione o questionário desejado no seletor de ajustes. Use o slider para alterar a nota de aprovação (com limites flexíveis entre 25% e 95%) e clique em "Salvar Ajuste Master".'
    },
    {
      category: 'geral',
      question: 'Os dados são salvos na nuvem ou apenas no meu navegador?',
      answer: 'A plataforma opera com sincronização híbrida. Caso exista conexão com o Firebase Firestore ativa, as alterações em questionários, progresso e usuários são salvas eletronicamente e em tempo real na nuvem. Em cenários offline, uma cópia de contingência é mantida instantaneamente no LocalStorage do seu navegador.'
    },
    {
      category: 'geral',
      question: 'Posso usar a plataforma no meu celular ou tablet?',
      answer: 'Sim, toda a interface do Masonic Academy foi desenvolvida de forma 100% responsiva. Ela se adapta automaticamente para smartphones, tablets e desktops com alta densidade e legibilidade visual otimizada para leitura.'
    }
  ];

  const filteredFaqs = faqItems.filter(item => {
    const text = (item.question + ' ' + item.answer).toLowerCase();
    const query = faqSearchQuery.toLowerCase();
    const matchesSearch = text.includes(query);
    
    if (activeManualSection === 'faq') return matchesSearch;
    // If we're on a specific conceptual section, we can also link or filter appropriate FAQs
    return matchesSearch;
  });

  return (
    <div id="user-manual-view" className="space-y-6 max-w-4xl mx-auto pb-24 font-sans animate-fade-in text-left">
      
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-[#06273A] to-[#04141D] border-2 border-[#D4AF37] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E9C349]/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-[10px] font-mono text-[#E9C349] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Manual de Instruções do Sistema
            </span>
            <h2 className="text-xl md:text-2xl font-sans font-bold text-[#d4e5f2] tracking-tight">
              Masonic Academy • Guia de Uso Completo
            </h2>
            <p className="text-xs text-[#99907c] leading-relaxed">
              Bem-vindo à base de conhecimento integrada da plataforma. Aqui você aprenderá como gerenciar títulos, simular exames de avanço de grau, emitir certificados consolidados e otimizar todo o portal administrativo.
            </p>
          </div>
          <div className="shrink-0 flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#081721] border border-[#D4AF37]/45 flex items-center justify-center text-[#E9C349] shadow-inner">
              <BookOpen className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Manual Content Tabs Selector */}
      <div className="flex flex-wrap gap-2 border-b border-[#1c2c36]/50 pb-3">
        {[
          { id: 'geral', label: '📙 Visão Geral', color: 'border-[#D4AF37]' },
          { id: 'aluno', label: '🎓 Área do Irmão', color: 'border-[#66d9cc]' },
          { id: 'admin', label: '👑 Painel Master', color: 'border-[#e07553]' },
          { id: 'faq', label: '💬 Perguntas Frequentes', color: 'border-blue-400' }
        ].filter(tab => tab.id !== 'admin' || isAdmin).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveManualSection(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold tracking-tight cursor-pointer transition-all ${
              activeManualSection === tab.id
                ? 'bg-[#E9C349]/15 text-[#f2ca50] border-[#E9C349]/50 shadow-md font-extrabold'
                : 'bg-[#081721]/60 text-[#99907c] border-[#1c2c36]/50 hover:text-[#d4e5f2] hover:bg-[#11212b]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content Rendering */}
      <div className="bg-[#081721]/80 border border-[#1c2c36] rounded-2xl p-6 shadow-md min-h-[400px]">
        
        {/* SECTION: VISÃO GERAL */}
        {activeManualSection === 'geral' && (
          <div className="space-y-6">
            <div className="border-b border-[#1c2c36]/50 pb-3">
              <h3 className="text-base font-sans font-black text-[#d4e5f2] flex items-center gap-1.5 uppercase tracking-wide">
                <Info className="w-4.5 h-4.5 text-[#E9C349]" /> Apresentação da Plataforma
              </h3>
              <p className="text-xs text-[#99907c] mt-1 leading-relaxed">
                Entenda a arquitetura modular construída para o Portal de Ensino.
              </p>
            </div>

            <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-2' : ''} gap-5`}>
              <div className="bg-[#0c1d27] border border-[#1c2c36]/80 rounded-xl p-4.5 space-y-2.5">
                <h4 className="text-xs font-mono font-bold text-[#E9C349] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#1c2c36]/60 pb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E9C349]" />
                  Estrutura Hierárquica de Ensino
                </h4>
                <p className="text-[11px] text-[#9cbfd5] leading-relaxed">
                  A plataforma utiliza um modelo de <strong>Graus de Instrução (1 ao 33)</strong>. Cada usuário é filiado a um grau específico.
                  Isso restringe automaticamente quais relatórios, diretrizes e simulados podem ser visualizados na tela principal do irmão.
                </p>
              </div>

              {isAdmin && (
                <div className="bg-[#0c1d27] border border-[#1c2c36]/80 rounded-xl p-4.5 space-y-2.5">
                  <h4 className="text-xs font-mono font-bold text-[#66d9cc] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#1c2c36]/60 pb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#66d9cc]" />
                    Funcionamento Offline & Cloud
                  </h4>
                  <p className="text-[11px] text-[#9cbfd5] leading-relaxed">
                    Trabalhamos com bancos de dados unificados no <strong>Firebase Firestore</strong> para garantir dados sincronizados entre múltiplos dispositivos, além de uma robusta contingência local persistida no navegador do usuário.
                  </p>
                </div>
              )}
            </div>

            {/* Architecture Flow Visual */}
            <div className="bg-[#04141d] border border-[#1c2c36]/60 rounded-xl p-5 space-y-4">
              <h4 className="text-[11px] font-mono text-[#99907c] uppercase tracking-wider text-center">Fluxo Básico de Funcionamento</h4>
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 py-2">
                
                {/* Step 1 */}
                <div className="flex-1 text-center bg-[#0c1d27] p-3 rounded-lg border border-[#1c2c36] relative z-10 w-full">
                  <span className="text-[9px] font-mono text-[#E9C349] block font-black">PASSO 01</span>
                  <span className="text-[11px] font-sans font-bold text-[#d4e5f2] block mt-1">Ler Diretrizes</span>
                  <span className="text-[9px] text-[#99907c] block mt-0.5">Leitura dos títulos e materiais de instrução na aba principal.</span>
                </div>
                
                <div className="hidden md:block text-[#1c2c36] font-mono text-lg font-black shrink-0">➔</div>
                
                {/* Step 2 */}
                <div className="flex-1 text-center bg-[#0c1d27] p-3 rounded-lg border border-[#1c2c36] relative z-10 w-full">
                  <span className="text-[9px] font-mono text-[#66d9cc] block font-black">PASSO 02</span>
                  <span className="text-[11px] font-sans font-bold text-[#d4e5f2] block mt-1">Fazer o Simulado</span>
                  <span className="text-[9px] text-[#99907c] block mt-0.5">Praticar exames nos modos Completo, Amostra ou Temático.</span>
                </div>

                <div className="hidden md:block text-[#1c2c36] font-mono text-lg font-black shrink-0">➔</div>

                {/* Step 3 */}
                <div className="flex-1 text-center bg-[#0c1d27] p-3 rounded-lg border border-[#e07553] relative z-10 w-full">
                  <span className="text-[9px] font-mono text-[#e07553] block font-black">PASSO 03</span>
                  <span className="text-[11px] font-sans font-bold text-white block mt-1">Emitir Certificado</span>
                  <span className="text-[9px] text-[#99907c] block mt-0.5">Se aprovado no modo qualificado, realizar a inscrição oficial em segundos.</span>
                </div>

              </div>
            </div>

            <div className="text-[11px] text-[#99907c] leading-relaxed space-y-2">
              <p>
                <strong>Dica de Organização:</strong> No canto superior direito, você pode ver seus dados de login do painel. A aba <strong>"Início"</strong> organiza as disciplinas em categorias para tornar o estudo focado. Use as opções de ordenação para priorizar os títulos pelo nome, pelo grau ou de acordo com as datas das últimas revisões de conteúdo.
              </p>
            </div>
          </div>
        )}

        {/* SECTION: ÁREA DO IRMÃO */}
        {activeManualSection === 'aluno' && (
          <div className="space-y-6">
            <div className="border-b border-[#1c2c36]/50 pb-3">
              <h3 className="text-base font-sans font-black text-[#d4e5f2] flex items-center gap-1.5 uppercase tracking-wide">
                <BookOpenCheck className="w-4.5 h-4.5 text-[#66d9cc]" /> Instruções de Estudo do Irmão
              </h3>
              <p className="text-xs text-[#99907c] mt-1 leading-relaxed">
                Descubra como maximizar seus estudos e solicitar seus certificados oficiais de forma integrada.
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Leitura e Conclusão */}
              <div className="flex gap-4 items-start bg-[#0c1d27] p-4 rounded-xl border border-[#1c2c36]">
                <div className="w-8 h-8 rounded-full bg-[#185347]/50 border border-[#26a69a]/40 flex items-center justify-center text-[#66d9cc] shrink-0 font-bold font-mono text-xs">
                  A
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-sans font-bold text-[#d4e5f2] uppercase tracking-wider">Leitura de Conteúdos & Meta de Progresso</h4>
                  <p className="text-[11px] text-[#9cbfd5] leading-relaxed">
                    Clique em qualquer item no painel inicial para abrir suas diretrizes detalhadas. Após a leitura atenta do conteúdo instrutivo, use o botão <strong>"Marcar Leitura como Concluída"</strong>. Isso atualizará imediatamente as barras de avanço de progresso em toda a plataforma.
                  </p>
                </div>
              </div>

              {/* Responder Simulados */}
              <div className="flex gap-4 items-start bg-[#0c1d27] p-4 rounded-xl border border-[#1c2c36]">
                <div className="w-8 h-8 rounded-full bg-[#033c4c]/50 border border-[#00bcd4]/30 flex items-center justify-center text-sky-400 shrink-0 font-bold font-mono text-xs">
                  B
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-sans font-bold text-[#d4e5f2] uppercase tracking-wider">Modos de Questionários Dinâmicos</h4>
                  <p className="text-[11px] text-[#9cbfd5] leading-relaxed">
                    Cada disciplina possui um questionário dedicado composto por dezenas ou centenas de perguntas de fixação. Ao iniciar um simulado, você tem três opções:
                  </p>
                  <ul className="text-[10px] text-[#99907c] list-disc list-inside space-y-1.5 mt-2 pl-1">
                    <li><strong className="text-white">Simulado Completo:</strong> Você responderá a todas as perguntas disponíveis na íntegra. Ideal para testar o conhecimento geral final.</li>
                    <li><strong className="text-white">Amostra de Estudo:</strong> Seleciona aleatoriamente um número reduzido de questões (por exemplo, 10, 15, ou 30 perguntas). Excelente para revisões curtas diárias.</li>
                    <li><strong className="text-white">Por Tema Específico:</strong> Filtra dinamicamente as perguntas do simulado por sub-áreas temáticas cadastradas pelo instrutor.</li>
                  </ul>
                </div>
              </div>

              {/* Solicitar Certificados */}
              <div className="flex gap-4 items-start bg-[#0c1d27] p-4 rounded-xl border-2 border-[#D4AF37]/35 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-1.5 bg-[#D4AF37]/10 rounded-bl text-[8px] font-mono text-[#E9C349] uppercase font-bold">
                  Recompensa Oficial
                </div>
                <div className="w-8 h-8 rounded-full bg-[#3c2a05] border border-[#D4AF37]/45 flex items-center justify-center text-[#E9C349] shrink-0 font-bold font-mono text-xs">
                  C
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-sans font-bold text-[#d4e5f2] uppercase tracking-wider">Habilitação e Emissão de Certificados</h4>
                  <p className="text-[11px] text-[#9cbfd5] leading-relaxed">
                    Caso você alcance a nota de aprovação necessária no simulado, será exibido um quadro de sucesso com a opção de <strong>Solicitar Certificado</strong>. Ao clicar, seus dados de aprovação serão transmitidos e salvos eletronicamente na planilha mestre de controle escolar.
                  </p>
                  <div className="mt-2.5 bg-[#04141d] p-3 rounded border border-yellow-600/30 text-[10px] text-[#99907c] leading-relaxed">
                    <span className="text-[#E9C349] font-bold">Atenção ao Bloqueio de Amostra:</span> Se o seu Instrutor ativou a flag de segurança do questionário chamada <em>"Emitir Certificados apenas para Conteúdo Completo"</em>, o botão de solicitação de diploma <strong>NÃO</strong> aparecerá em simulados concluídos nos modos Amostra ou Temas, requerendo obrigatoriamente a aprovação no modo Completo para outorga do certificado.
                  </div>
                </div>
              </div>

              {/* Biblioteca Virtual */}
              <div className="flex gap-4 items-start bg-[#0c1d27] p-4 rounded-xl border border-[#1c2c36]">
                <div className="w-8 h-8 rounded-full bg-orange-950/50 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0 font-bold font-mono text-xs">
                  D
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-sans font-bold text-[#d4e5f2] uppercase tracking-wider">Biblioteca Virtual & Consulta de Materiais</h4>
                  <p className="text-[11px] text-[#9cbfd5] leading-relaxed">
                    A aba <strong>"Biblioteca"</strong> funciona como um repositório centralizado de obras virtuais, livros, rituais e artigos de estudo. O acesso a essas obras é regulado e otimizado da seguinte forma:
                  </p>
                  <ul className="text-[10px] text-[#99907c] list-disc list-inside space-y-1.5 mt-2 pl-1">
                    <li><strong className="text-white">Regra de Grau de Acesso:</strong> Cada material cadastrado exige um grau mínimo de instrução (1 a 33). Caso o seu grau atual seja inferior ao exigido pela obra, o conteúdo aparecerá como <span className="text-rose-400 font-bold">Bloqueado</span> e o acesso não será permitido, garantindo o respeito à hierarquia de estudos.</li>
                    <li><strong className="text-white">Busca Rápida e Filtros Dinâmicos:</strong> Utilize o menu lateral esquerdo para realizar buscas por palavras-chave ou filtrar as obras selecionando categorias temáticas específicas e faixas de graus de instrução.</li>
                    <li><strong className="text-white">Visualização e Ordenação:</strong> Você pode alternar o layout de exibição entre <span className="text-white">Grade</span> (com as capas das obras) e <span className="text-white">Lista</span>, além de ordenar as obras por ordem alfabética ou nível de grau.</li>
                    <li><strong className="text-white">Acesso Seguro:</strong> Ao clicar em <span className="text-[#E9C349] font-bold">Acessar Material</span>, a obra será aberta de forma segura por meio do visualizador em tela cheia da plataforma ou link seguro externo de consulta.</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION: PAINEL MASTER */}
        {activeManualSection === 'admin' && isAdmin && (
          <div className="space-y-6">
            <div className="border-b border-[#1c2c36]/50 pb-3">
              <h3 className="text-base font-sans font-black text-[#d4e5f2] flex items-center gap-1.5 uppercase tracking-wide">
                <Shield className="w-4.5 h-4.5 text-[#e07553]" /> Manual do Administrador Master (Instrutor)
              </h3>
              <p className="text-xs text-[#99907c] mt-1 leading-relaxed">
                Ferramentas de controle, importação de dados e parametrização educacional.
              </p>
            </div>

            <div className="space-y-5">
              
              {/* Gerenciamento de Disciplinas e Importação Excel */}
              <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl p-5 space-y-3">
                <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#66d9cc]" /> Cadastro e Importação de Títulos (Excel / CSV)
                </h4>
                <p className="text-[11px] text-[#9cbfd5] leading-relaxed">
                  Para simplificar a carga inicial de conteúdo, os administradores contam com uma central de importação em massa na aba <strong>Perfil ➔ Gerenciar Títulos ➔ Importar de Excel / CSV</strong>. 
                </p>
                <div className="bg-[#04141d] p-3 rounded border border-[#1c2c36] text-[10px] text-[#a5b8c7] space-y-1 font-mono">
                  <div className="text-white font-bold mb-1 border-b border-[#1c2c36] pb-1">Colunas recomendadas no cabeçalho do arquivo:</div>
                  <div>1. <strong>"titulo"</strong> (Ex: Instrução de Companheiro Maçom)</div>
                  <div>2. <strong>"instrutor"</strong> (Ex: Daniel Luciano)</div>
                  <div>3. <strong>"grau"</strong> (Ex: 2)</div>
                </div>
              </div>

              {/* Gerenciamento de Usuários */}
              <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl p-5 space-y-3">
                <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#E9C349]" /> Controle de Irmãos & Permissões de Acesso
                </h4>
                <p className="text-[11px] text-[#9cbfd5] leading-relaxed">
                  Na seção de gerenciamento de usuários, o Administrador possui controle sobre:
                </p>
                <ul className="text-[10px] text-[#99907c] list-disc list-inside space-y-1.5 pl-1.5">
                  <li><strong className="text-white">Nível de Grau do Usuário:</strong> Limita o acesso apenas a disciplinas do seu grau ou inferiores.</li>
                  <li><strong className="text-white">Status ("Ativo" ou "Inativo"):</strong> Bloqueia instantaneamente o acesso do irmão caso o status físico seja configurado para Inativo.</li>
                  <li><strong className="text-white">Adicionar Novos Usuários:</strong> Cadastrar nomes, e-mails específicos e graus correspondentes de forma individual.</li>
                </ul>
              </div>

              {/* Gerenciamento da Biblioteca Virtual */}
              <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl p-5 space-y-3">
                <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-400" /> Cadastro e Gestão de Materiais / Livros (Biblioteca)
                </h4>
                <p className="text-[11px] text-[#9cbfd5] leading-relaxed">
                  Para gerenciar as obras virtuais, livros e PDFs da Biblioteca, acesse a aba <strong>Perfil ➔ Gerenciar Biblioteca</strong>. Como Administrador, você possui controle sobre:
                </p>
                <ul className="text-[10px] text-[#99907c] list-disc list-inside space-y-1.5 pl-1.5">
                  <li><strong className="text-white">Adicionar e Editar Materiais:</strong> Cadastre novos livros com capa (URL), título, autor, link do documento, categorias (sub-áreas) e o nível de Grau necessário para acesso.</li>
                  <li><strong className="text-white">Gerenciar Status (Ativo / Inativo):</strong> Defina o status de cada material. Obras marcadas como <span className="text-rose-400">Inativo</span> ficarão guardadas no seu banco de dados para manutenção futura, mas ficam totalmente <span className="text-rose-400 font-bold">ocultas</span> para os irmãos na Biblioteca Virtual.</li>
                  <li><strong className="text-white">Filtro Administrativo por Status:</strong> No painel de gerenciamento, utilize o seletor de status para buscar rapidamente materiais Ativos ou Inativos para auditoria rápida.</li>
                  <li><strong className="text-white">Importação em Massa via Excel / CSV:</strong> Você pode carregar um catálogo inteiro de livros enviando um arquivo Excel contendo as colunas de cabeçalho: <em>"titulo"</em>, <em>"autor"</em>, <em>"categoria"</em>, <em>"link"</em> e <em>"grau"</em>.</li>
                </ul>
              </div>

              {/* Configuração Master de Questionários */}
              <div className="bg-[#0c1d27] border border-[#1c2c36] rounded-xl p-5 space-y-3">
                <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Settings className="w-4 h-4 text-orange-400" /> Parametrização Master de Questionários
                </h4>
                <p className="text-[11px] text-[#9cbfd5] leading-relaxed">
                  Os administradores possuem ferramentas exclusivas de ajuste na parte inferior da aba <strong>"Questionários"</strong>:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-[#04141d] p-3 rounded border border-[#1c2c36] space-y-1">
                    <span className="text-[10px] font-mono text-orange-400 font-bold block">REAJUSTE DE NOTA MÍNIMA</span>
                    <span className="text-[10px] text-[#99907c] block leading-relaxed">
                      Altere a porcentagem de pontuação mínima para aprovação e emissão de diplomas de forma dinâmica por meio de controle do tipo slider.
                    </span>
                  </div>
                  <div className="bg-[#04141d] p-3 rounded border border-[#1c2c36] space-y-1">
                    <span className="text-[10px] font-mono text-orange-400 font-bold block">RESTRIÇÃO DE CERTIFICADO</span>
                    <span className="text-[10px] text-[#99907c] block leading-relaxed">
                      Marque "Emitir apenas para conteúdo completo" para forçar que o irmão execute todo o escopo de perguntas, evitando simulações curtas e superficiais.
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION: FAQ */}
        {activeManualSection === 'faq' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-[#1c2c36]/50 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h3 className="text-base font-sans font-black text-[#d4e5f2] flex items-center gap-1.5 uppercase tracking-wide">
                  <HelpCircle className="w-4.5 h-4.5 text-blue-400" /> Perguntas e Respostas Comuns
                </h3>
                <p className="text-xs text-[#99907c] leading-relaxed">
                  Utilize o campo de busca rápido para filtrar dúvidas escolares e de ferramentas.
                </p>
              </div>
              
              <div className="relative shrink-0 w-full md:w-64">
                <Search className="w-3.5 h-3.5 text-[#99907c] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar dúvidas..."
                  value={faqSearchQuery}
                  onChange={(e) => setFaqSearchQuery(e.target.value)}
                  className="w-full bg-[#04141d] border border-[#1c2c36] rounded-lg pl-8 pr-3 py-1 text-[11px] text-[#d4e5f2] focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredFaqs.map((faq, idx) => {
                const isExpanded = expandedFaqIndex === idx;
                return (
                  <div 
                    key={idx}
                    className={`border rounded-xl transition-all ${
                      isExpanded 
                        ? 'bg-[#0c1d27] border-[#D4AF37]/35 shadow-sm' 
                        : 'bg-[#0c1d27]/40 border-[#1c2c36]/70 hover:border-[#1c2c36]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                      className="w-full text-left p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`text-[8px] font-mono px-2 py-0.5 rounded uppercase font-black tracking-wider ${
                          faq.category === 'aluno' 
                            ? 'bg-[#185347]/40 text-[#66d9cc]' 
                            : faq.category === 'admin' 
                            ? 'bg-orange-950 text-orange-400' 
                            : 'bg-[#11212b] text-blue-400'
                        }`}>
                          {faq.category === 'aluno' ? 'Irmão' : faq.category === 'admin' ? 'Admin' : 'Geral'}
                        </span>
                        <span className="text-xs font-sans font-bold text-[#d4e5f2] hover:text-white transition-colors">
                          {faq.question}
                        </span>
                      </div>
                      <div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#99907c]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#99907c]" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4.5 pt-1 text-[11px] text-[#9cbfd5] leading-relaxed border-t border-[#1c2c36]/30 animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredFaqs.length === 0 && (
                <div className="text-center py-10 text-[#99907c]">
                  <HelpCircle className="w-8 h-8 mx-auto opacity-30 mb-2" />
                  <span className="text-xs font-mono">Nenhuma resposta encontrada para "{faqSearchQuery}".</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
