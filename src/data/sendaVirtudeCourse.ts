import { ExecutiveReport } from '../types';

export const SENDA_VIRTUDE_COURSE: ExecutiveReport = {
  id: 'rep-senda-virtude-adonhiramita',
  title: 'Treinamento Maçônico: A Senda da Virtude e o Rito Adonhiramita',
  nivelCurso: 1,
  category: 'RITUALÍSTICA & TRADIÇÃO',
  tags: ['Virtude', 'Adonhiramita', 'Rito', 'Treinamento'],
  department: 'EDUCAÇÃO MAÇÔNICA',
  summary: 'Treinamento interativo focado nas origens históricas, misticismo e simbolismo oculto do Rito Adonhiramita no Brasil.',
  leftBorderColor: 'gold',
  lastUpdated: '11 Jul 2026',
  owner: 'Daniel Luciano',
  confidentiality: 'Interno',
  thumbnailUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=120&q=80',
  fullMarkdown: `## Treinamento Interativo Maçônico
Este curso é executado diretamente em formato interativo HTML de alta fidelidade. Clique no botão **ACESSAR** para iniciar a jornada interativa contendo lições históricas e questionários de fixação.`,
  conteudoSemProva: true,
  status: 'Ativo',
  htmlContent: `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Treinamento Maçônico: A Senda da Virtude e o Rito Adonhiramita.</title>
    <style>
        :root {
            --gold: #D4AF37;
            --gold-light: #FFD700;
            --black: #06273a;
            --white: #FFFFFF;
            --navy: #1E3A5F;
            --dark-gray: #0b354f;
            --red: #C41E3A;
            --green: #1B5E20;
            --transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        body {
            background-color: var(--black);
            color: var(--white);
            line-height: 1.6;
            overflow-x: hidden;
            position: relative;
        }

        .floating-dots {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
            overflow: hidden;
        }

        .symbol {
            position: absolute;
            color: var(--gold);
            opacity: 0.15;
            font-size: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .symbol:nth-child(1) { top: 10%; left: 5%; animation: float 25s infinite 0s; }
        .symbol:nth-child(2) { top: 20%; right: 10%; animation: float 30s infinite 3s; }
        .symbol:nth-child(3) { top: 50%; left: 8%; animation: float 28s infinite 6s; }
        .symbol:nth-child(4) { top: 60%; right: 5%; animation: float 26s infinite 2s; }
        .symbol:nth-child(5) { top: 80%; left: 15%; animation: float 32s infinite 5s; }
        .symbol:nth-child(6) { top: 15%; left: 50%; animation: float 29s infinite 1s; }
        .symbol:nth-child(7) { top: 35%; right: 8%; animation: float 27s infinite 4s; }
        .symbol:nth-child(8) { top: 70%; left: 25%; animation: float 31s infinite 7s; }
        .symbol:nth-child(9) { top: 45%; left: 85%; animation: float 29s infinite 2s; }
        .symbol:nth-child(10) { top: 75%; right: 20%; animation: float 33s infinite 6s; }

        @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            25% { transform: translateY(-30px) translateX(20px) rotate(90deg); }
            50% { transform: translateY(-60px) translateX(-20px) rotate(180deg); }
            75% { transform: translateY(-30px) translateX(30px) rotate(270deg); }
        }

        .progress-container {
            position: fixed;
            top: 0;
            z-index: 1000;
            width: 100%;
            height: 5px;
            background: rgba(6, 39, 58, 0.5);
        }

        .progress-bar {
            height: 5px;
            background: var(--gold);
            width: 0%;
            transition: width 0.3s ease;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
            position: relative;
            z-index: 1;
        }

        section {
            display: none;
            animation: slideUp 0.6s ease-out forwards;
        }

        section.active {
            display: block;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        h1, h2, h3 {
            color: var(--gold);
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 20px;
            text-align: center;
        }

        p {
            margin-bottom: 15px;
            text-align: justify;
            color: #E0E0E0;
        }

        .card {
            background: rgba(11, 53, 79, 0.4);
            border-left: 4px solid var(--gold);
            padding: 25px;
            margin: 20px 0;
            border-radius: 4px;
            transition: var(--transition);
        }

        .card:hover {
            transform: translateY(-2px);
            background: rgba(11, 53, 79, 0.7);
        }

        .btn {
            background: var(--gold);
            color: var(--black);
            border: none;
            padding: 12px 30px;
            font-weight: bold;
            text-transform: uppercase;
            cursor: pointer;
            border-radius: 2px;
            transition: var(--transition);
            display: inline-block;
            margin: 10px;
        }

        .btn:hover {
            background: var(--gold-light);
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
        }

        .btn-outline {
            background: transparent;
            border: 2px solid var(--gold);
            color: var(--gold);
        }

        .btn-outline:hover {
            background: var(--gold);
            color: var(--black);
        }

        .quiz-container {
            background: var(--dark-gray);
            padding: 30px;
            border-radius: 8px;
            margin-top: 30px;
            border-left: 4px solid var(--gold);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        .quiz-q {
            color: var(--gold-light);
            font-weight: bold;
            margin-bottom: 20px;
            font-size: 1.1em;
        }

        .quiz-opts {
            display: grid;
            gap: 12px;
        }

        .quiz-opt-btn {
            background: rgba(6, 39, 58, 0.6);
            color: white;
            padding: 15px;
            border: 1px solid rgba(214, 175, 55, 0.3);
            text-align: left;
            cursor: pointer;
            transition: 0.2s;
            border-radius: 4px;
            font-size: 1em;
        }

        .quiz-opt-btn:hover:not(:disabled) {
            background: rgba(30, 58, 95, 0.8);
            border-color: var(--gold);
        }

        .quiz-opt-btn.correct {
            background: var(--green) !important;
            border-color: var(--green);
            color: #fff;
        }

        .quiz-opt-btn.wrong {
            background: var(--red) !important;
            border-color: var(--red);
            color: #fff;
        }

        .nav-controls {
            display: flex;
            justify-content: center;
            margin-top: 50px;
            gap: 20px;
            flex-wrap: wrap;
        }

        .intro-box {
            background: linear-gradient(135deg, #1E3A5F, #06273a);
            border: 2px solid var(--gold);
            padding: 40px;
            border-radius: 8px;
            text-align: center;
            margin: 40px 0;
        }

        .score-card {
            background: linear-gradient(135deg, #1E3A5F, #0b354f);
            padding: 40px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
            border: 2px solid var(--gold);
        }

        .score-number {
            font-size: 4em;
            color: var(--gold);
            font-weight: bold;
            margin: 20px 0;
        }

        /* ESTILOS DO NOVO FORMULÁRIO DE CERTIFICADO */
        .cert-form-container {
            max-width: 450px;
            margin: 25px auto 0 auto;
            padding: 20px;
            background: rgba(6, 39, 58, 0.8);
            border: 1px solid var(--gold);
            border-radius: 6px;
            display: none;
            animation: slideUp 0.4s ease-out forwards;
        }

        .cert-form-group {
            margin-bottom: 15px;
            text-align: left;
        }

        .cert-form-group label {
            display: block;
            color: var(--gold-light);
            margin-bottom: 5px;
            font-size: 0.9em;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .cert-form-group input {
            width: 100%;
            padding: 10px 12px;
            background: #0b354f;
            border: 1px solid rgba(214, 175, 55, 0.5);
            color: var(--white);
            border-radius: 4px;
            font-size: 1em;
            outline: none;
            transition: 0.3s;
        }

        .cert-form-group input:focus {
            border-color: var(--gold-light);
            box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);
        }

        #certMessage {
            margin-top: 15px;
            font-weight: bold;
            text-align: center;
        }

        footer {
            text-align: center;
            padding: 40px;
            color: #757575;
            font-size: 0.9em;
            border-top: 1px solid #113f5c;
            position: relative;
            z-index: 1;
        }

        @media (max-width: 768px) {
            .nav-controls {
                flex-direction: column;
            }
            h1 { font-size: 1.8em; }
        }
    </style>
</head>
<body>

    <div class="floating-dots">
        <div class="symbol">∴</div> 
        <div class="symbol">🪜</div>
        <div class="symbol">△</div>
        <div class="symbol">⚒</div>
        <div class="symbol">∴</div>
        <div class="symbol">🪜</div>
        <div class="symbol">△</div>
        <div class="symbol">⚒</div>
        <div class="symbol">∴</div>
        <div class="symbol">△</div>
    </div>

    <div class="progress-container">
        <div class="progress-bar" id="progressBar"></div>
    </div>

    <div class="container">
        
        <!-- SEÇÃO 0: HERO -->
        <section id="sec0" class="active">
            <div style="text-align: center; padding: 40px 0;">
                <h1>Bem-vindo, meu amado irmão!!! <br> Seu caminho para o entendimento da nossa ordem começa aqui.</h1>
                <p style="text-align: center; font-size: 1.3em; color: var(--gold); margin-bottom: 30px;">❖ Ciência, Justiça e Trabalho ❖</p>
                
                <div class="card" style="text-align: center; border-left: none; border-top: 4px solid var(--gold);">
                    <p style="text-align: center;">
                        Este material tem o objetivo de auxiliá-lo na obtenção de um conhecimento básico inicial, contribuindo para sua caminhada e compreensão dos princípios da Ordem.   
                    </p>
                </div>
                <button class="btn" onclick="nextSection(1)">Clique para Iniciar sua Jornada</button>
            </div>
        </section>

        <!-- SEÇÃO 1: O QUE É MAÇONARIA -->
        <section id="sec1">
            <h2>1. O que é a Maçonaria?</h2>
            <p>A Maçonaria é uma instituição essencialmente filosófica, filantrópica, educativa e progressista que trabalha pelo melhoramento intelectual, moral e social da humanidade.</p>

            <div class="card">
                <h3>✓ Os Pilares</h3>
                <p><strong>Liberdade</strong> dos indivíduos, <strong>Igualdade</strong> de direitos e obrigações, e <strong>Fraternidade</strong> universal entre os homens.</p>
            </div>

            <div class="card">
                <h3>✓ O Lema</h3>
                <p><strong>Ciência</strong> para elevar o espírito, <strong>Justiça</strong> para equilibrar as relações humanas e <strong>Trabalho</strong> para a dignidade do homem.</p>
            </div>

            <div class="nav-controls">
                <button class="btn btn-outline" onclick="nextSection(0)">← Voltar</button>
                <button class="btn" onclick="nextSection(2)">Próximo →</button>
            </div>
        </section>

        <!-- SEÇÃO 2: HISTÓRIA -->
        <section id="sec2">
            <h2>2. Origens e Evolução</h2>
            <p>As bases espirituais remetem ao Noaquismo. A Ordem evoluiu de associações de construtores (Operativa) para uma natureza filosófica (Especulativa).</p>

            <div class="card">
                <h3>Marcos Históricos</h3>
                <p>• <strong>1598 (Estatutos Schaw):</strong> William Schaw codifica as regras das lojas corporativas na Escócia, iniciando a transição para a autonomia dos grupos.<br>
                • <strong>1610 (Consolidação do Termo):</strong> O termo "maçom" se consolida ligado a modos secretos de identificação profissional.<br>
                • <strong>1630 (Os "Aceitos"):</strong> Nobres e burgueses fora do ofício de talhadores de pedra entram nas lojas em busca de tradição, sociabilidade e influência mútua.<br>
                • <strong>Gênese da Esfera Pública:</strong> As lojas tornam-se espaços democráticos de debate permanente, onde o argumento prevalecia sobre a hierarquia social, impulsionando o Iluminismo.<br>
                • <strong>1717:</strong> Fundação da Grande Loja de Londres.<br>
                • <strong>1813:</strong> Consolidação da Loja-Mãe Unida da Inglaterra.</p>
            </div>
            <div class="card">
                <h3>✓ A Loja é o Coração da Ordem</h3>
                <p><strong>A Loja</strong> é a estrutura fundamental onde os membros se reúnem. Funciona como uma estrutura sagrada baseada no auxílio mútuo e na submissão aos regulamentos comuns.</p>
                <p><strong>O Templo</strong> é o ambiente fraternal onde os maçons se dedicam ao aperfeiçoamento do caráter e à meditação sobre valores eternos.</p>
            </div>

            <div class="nav-controls">
                <button class="btn btn-outline" onclick="nextSection(1)">← Voltar</button>
                <button class="btn" onclick="nextSection(3)">Próximo →</button>
            </div>
        </section>

        <!-- SEÇÃO 3: BRASIL -->
        <section id="sec3">
            <h2>3. Maçonaria no Brasil</h2>
            <p>A Maçonaria foi protagonista em alguns dos maiores feitos da história nacional, entre eles podemos citar: a Independência, a Abolição da Escravatura e a Proclamação da República.</p>

            <div class="card">
                <h3>Marcos Nacionais</h3>
                <p><strong>1724 – Primeiro Registro:</strong> Atividade maçônica no Brasil, na Academia Brasílica dos Esquecidos (Bahia).</p>
                <p><strong>1735: Nomeação de Randolph Took:</strong> Como Grão-Mestre Provincial para a América do Sul (Brasil), via Loja de Londres.</p>
                <p><strong>1741: Registros comprovam:</strong> O funcionamento da Loja de São João do Brasil e o intercâmbio com maçons estrangeiros.</p>
                <p><strong>1750: Indícios de um Grande Oriente:</strong> Em Salvador, de forte tendência liberal e ligado ao Grande Oriente da França.</p>
                <p><strong>Fundação do Grande Oriente do Brasil (GOB):</strong> Criado em 17 de junho de 1822, o maior marco institucional do país. Única potência brasileira com reconhecimento definitivo da Loja-Mãe da Inglaterra, figurando hoje entre as maiores do mundo.</p>
                <p><strong>Atuação Política:</strong> Papel decisivo e direto nos principais eventos históricos do Brasil, tanto no Império quanto na República.</p>
                <p><strong>Alguns Maçons ilustres:</strong> Dom Pedro I (Guatimozim), José Bonifácio (Pitágoras), Marechal Deodoro da Fonseca, Nilo Peçanha, Jânio Quadros...</p>
            </div>

            <div class="nav-controls">
                <button class="btn btn-outline" onclick="nextSection(2)">← Voltar</button>
                <button class="btn" onclick="nextSection(4)">Próximo →</button>
            </div>
        </section>

        <!-- SEÇÃO 4: ORGANIZAÇÃO E PERFIL -->
        <section id="sec4">
            <h2>4. Organização e Perfil</h2>
            <p>A Maçonaria não é uma sociedade secreta, mas discreta. Sua existência é pública e seus estatutos são registrados legalmente.</p>

            <div class="card">
                <h3>Reconhecimento Internacional</h3>
                <p><strong>IMPORTANTE:</strong> No Brasil, as organizações reconhecidas internacionalmente de forma regular são o <strong>GOB</strong> (Grande Oriente do Brasil), a <strong>CMSB</strong> (Confederação da Maçonaria Simbólica do Brasil) e a <strong>COMAB</strong> (Confederação Maçônica do Brasil).</p>
            </div>

            <div class="card">
                <h3>O Maçom e os Requisitos Legais:</h3>
                <p>Mínimo de 18 anos, emprego e residência fixos, atividades lícitas. Se casado, exige-se a concordância expressa da esposa.</p>
            </div>

            <div class="card">
                <h3>Requisitos Doutrinários:</h3>
                <p>Crer em Deus (Grande Arquiteto do Universo), amor ao próximo e dedicação à família. Ter noção clara de virtude e estar de coração aberto para aprender.</p>
            </div>

            <div class="card">
                <h3>Requisitos Práticos:</h3>
                <p>Dispor de meios financeiros para cumprir os compromissos maçônicos sem jamais sacrificar o sustento de sua família.</p>
            </div>

            <div class="card">
                <h3>Deveres e Compromissos:</h3>
                <p><strong>Estudo e Sigilo:</strong> Estudar as instruções maçônicas com mente aberta e manter sigilo denso sobre rituais e ensinamentos internos.</p>
                <p><strong>Conduta Moral:</strong> Praticar a moral, a igualdade e a justiça dentro e fora da instituição.</p>
                <p><strong>Participação Ativa:</strong> Dedicar tempo às reuniões no Templo para aperfeiçoamento do caráter.</p>
                <p><strong>Contribuição:</strong> Colaborar financeiramente para a justa manutenção da Loja e de sua Obediência.</p>
            </div>
            
            <div class="card">
                <h3>Atenção!</h3>
                <p><strong>Discussões políticas partidárias ou religiosas</strong> são terminantemente proibidas em loja, preservando a união harmônica entre os membros acima de quaisquer divergências civis.</p>
                <p><strong>Além disso é IMPORTANTE saber que existem lojas não reconhecidas!</strong> Por isso, antes de realizar qualquer visita, busque orientação com irmãos mais antigos de sua oficina, garantindo a regularidade de sua caminhada.</p>
            </div>
        
            <div class="nav-controls">
                <button class="btn btn-outline" onclick="nextSection(3)">← Voltar</button>
                <button class="btn" onclick="nextSection(5)">Quiz: Material 1 →</button>
            </div>
        </section>

        <!-- SEÇÃO 5: QUIZ MATERIAL 1 -->
        <section id="sec5">
            <h2>📝 Fixação: Material 1</h2>
            <div class="quiz-container" id="quiz1">
                <div id="q1-container">
                    <p class="quiz-q" id="q1-text"></p>
                    <div class="quiz-opts" id="q1-options"></div>
                </div>
            </div>
            <div class="nav-controls">
                <button class="btn btn-outline" onclick="nextSection(4)">← Voltar</button>
                <button class="btn" id="btnNextMaterial" style="display:none;" onclick="nextSection(6)">Próximo Material →</button>
            </div>
        </section>

        <!-- SEÇÃO 6: RITO ADONHIRAMITA -->
        <section id="sec6">
            <div class="intro-box">
                <h2>🔮 O Rito Adonhiramita</h2>
                <p style="text-align:center; color: var(--gold-light);">História, Misticismo e Tradição</p>
                <p style="text-align:justify; margin-top:15px;">Uma síntese profunda sobre as origens, rituais e a geometria oculta da Maçonaria mais esotérica do Brasil.</p>
            </div>

            <div class="card">
                <h3>Os Quatro Pilares do Rito</h3>
                <p>• <strong>O Pilar Místico:</strong> Herança das antigas Escolas de Mistérios, do Egito Antigo aos magos persas. Foco na profunda viagem interior (V.I.T.R.I.O.L.).</p>
                <p>• <strong>O Pilar Histórico:</strong> Evolução a partir do Rito de Heredon escocês, adotando conceitos da Maçonaria continental francesa do século XVIII.</p>
                <p>• <strong>O Pilar Espiritual:</strong> Natureza eminentemente teísta, fundamentada nas verdades bíblicas e apocalípticas, com forte influência do gnosticismo cristão (Evangelho de João).</p>
                <p>• <strong>O Pilar Ortodoxo:</strong> Obsessão pelo rigor rigoroso, liturgia cênica e musicalidade, resistindo às simplificações de ritos mais modernos.</p>
            </div>

            <div class="card">
                <h3>O Grande Debate: Quem foi o Arquiteto?</h3>
                <p>A exegese do abade Louis Travenol (1744), baseada no Primeiro Livro dos Reis, divide as correntes:</p>
                <p>• <strong>Hiram, Rei de Tiro:</strong> Ambas as correntes concordam que foi o monarca fenício quem forneceu os materiais e a mão de obra.</p>
                <p>• <strong>Corrente Hiramita:</strong> Defende Hiram Abiff como o Arquiteto supremo do Templo (Sufixo hebraico 'Abiff' = Pai/Mestre). Considera Adonhiram apenas um título aglutinado ("Senhor Hiram").</p>
                <p>• <strong>Corrente Adonhiramita:</strong> Define Hiram Abiff apenas como um hábil fundidor de metais que chegou após a obra estrutural estar concluída. Aponta <strong>Adonhiram</strong> como o verdadeiro preposto às corveias, que recrutou e pagou os obreiros, sendo o real Arquiteto do Templo.</p>
            </div>

            <div class="card">
                <h3>O Mistério da Autoria: Recueil Précieux (1787)</h3>
                <p>• <strong>Louis Theodore Henry (Barão de Tschoudy):</strong> Cavaleiro de Lussy (falecido em 1769). Evidências apontam seu estilo literário idêntico e profundo conhecimento alquímico. Contradição: faleceu anos antes da publicação da obra.</p>
                <p>• <strong>Guillemain de Saint-Victor:</strong> O compilador oficial (1781). Assina a Compilação Preciosa e a obra de exegese posterior. Contradição: identidade fantasma; não há registros de seu nascimento, morte ou imagem, indicando um possível pseudônimo.</p>
            </div>

            <div class="card">
                <h3>A Arquitetura e Evolução dos Graus no Brasil</h3>
                <p>• <strong>Os 12 Graus Iniciais:</strong> Terminam no Cavaleiro Rosa-Cruz, classificado como <em>nec plus ultra</em> (nada há além), simbolizando o ciclo cósmico do zodíaco.</p>
                <p>• <strong>O 13º Grau (Cavaleiro Noaquita):</strong> Conhecido como o "Elemento Modificador" (como o Sol). Adicionado a partir de um ritual prussiano, era um grau honorífico (<em>sine qua non</em>).</p>
                <p>• <strong>Evolução Exclusiva Nacional:</strong> Em 1822 ocorre a fundação do Grande Oriente Brasílico sob a égide Adonhiramita ("Maçonaria dos 13"). Em 1839 cria-se o Colégio dos Ritos Azuis (administração unificada com o Rito Moderno). Em 1953 estabelece-se o Mui Poderoso e Sublime Grande Capítulo, separando definitivamente os graus Simbólicos e Filosóficos. Em 1973 o Excelso Conselho adota a hierarquia moderna de 33 graus, equiparando-se ao REAA. Em 2010 o rito faz o caminho de volta e passa a ser praticado em Portugal.</p>
            </div>

            <div class="nav-controls">
                <button class="btn btn-outline" onclick="nextSection(5)">← Voltar</button>
                <button class="btn" onclick="nextSection(7)">Próximo →</button>
            </div>
        </section>

        <!-- SEÇÃO 7: SIMBOLISMO OCULTO E LITURGIA -->
        <section id="sec7">
            <h2>7. Simbolismo Oculto e Liturgia</h2>
            
            <div class="card">
                <h3>O Stekenna: O Símbolo Máximo</h3>
                <p>• <strong>O Cordeiro (Agnus Dei):</strong> O princípio da pureza; o único digno de romper os selos e revelar a doutrina (semelhante ao Apocalipse de João).</p>
                <p>• <strong>Os 7 Selos:</strong> Representam os 7 Graus originais da Maçonaria, as 7 Virtudes, as 7 Artes Liberais e os 7 Chakras Principais.</p>
                <p>• <strong>O Estandarte:</strong> A bandeira branca com cruz vermelha remete aos Cavaleiros de Jerusalém, evidenciando a influência Templária no Rito.</p>
                <p>• <strong>O Esplendor (Shekinah):</strong> A presença divina fundindo a adoração solar egípcia (Atonismo) ao misticismo cristão de Constantino.</p>
            </div>

            <div class="card">
                <h3>A Liturgia da Luz, do Fogo e a Geometria Oculta</h3>
                <p>• <strong>O Cerimonial do Fogo:</strong> O fogo é o princípio ativo, purificador e ascendente. O revigoramento e adormecimento da Chama Sagrada representam a ligação perpétua entre o homem e o G..A..D..U..</p>
                <p>• <strong>Velas de Cera de Abelha:</strong> Proibição estrita de lâmpadas elétricas. A cera pura emite fogo verdadeiro sem fuligem, mantendo o aspecto primitivo de magia e ligação espiritual.</p>
                <p>• <strong>As Doze Badaladas:</strong> Substituindo os sinos da antiguidade, as vibrações argentinas harmonizam a egrégora, conclamando forças sobrenaturais e humanas para o início dos trabalhos.</p>
                <p>• <strong>A Inversão de Pritchard (1730):</strong> Samuel Pritchard publicou "Maçonaria Dissecada". Como defesa tática para confundir intrusos, as colunas J e B foram invertidas. O Rito Adonhiramita mantém essa inversão defensiva.</p>
                <p>• <strong>Os Vigilantes no Mesmo Meridiano:</strong> O 1º e o 2º Vigilantes sentam-se no Ocidente na exata mesma linha (perpendicular ao Equador). O objetivo astronômico é observar com precisão a passagem do Sol que nasce no Oriente.</p>
            </div>

            <div class="card">
                <h3>O Caminho do Infinito e as Proteções</h3>
                <p>• <strong>A Lemniscata:</strong> O trajeto da circunavegação em formato de "oito deitado" simboliza a estrada do tempo, a continuidade da vida e o constante renascimento cósmico.</p>
                <p>• <strong>A Marcha do Pé Direito:</strong> Rompe com o pé direito (ativo, positivo, masculino) sobrepondo-se ao lado esquerdo (passivo). É uma afirmação física da Luz subjugando as Trevas.</p>
                <p>• <strong>O Pálio (Proteção Interna):</strong> Formado pelas espadas cruzadas num ângulo de 52º. Age como um vórtice/pirâmide, absorvendo energias elevadas e protegendo a abertura do Livro da Lei.</p>
                <p>• <strong>Incensação e o Cobridor (Proteção Externa):</strong> O incenso realiza a profilaxia fluídica. O Cobridor fica na porta entreaberta, invertendo a polaridade e agindo como um "para-raios" para energias negativas externas.</p>
            </div>

            <div class="card">
                <h3>Indumentária, Etiqueta e o Calendário</h3>
                <p>• <strong>O Chapéu:</strong> Cobre a primeira Sephirah da Árvore da Vida. Significa a raiz na aristocracia do Séc. XVIII e o limite da inteligência humana perante o mistério divino.</p>
                <p>• <strong>Gravata, Luvas e Espada:</strong> Gravata branca harmoniza o interior; luvas purificam as mãos. A Espada com lâmina para baixo atua como uma antena de descarga geomagnética plantada no solo.</p>
                <p>• <strong>A Aclamação (VIVAT!):</strong> Do latim 'Vivere'. Um pedido tríplice pela vida universal, ecoando a saudação escocesa Huzzé.</p>
                <p>• <strong>O Calendário Adonhiramita:</strong> O ano é Equinocial (começa em 21 de Março, no Equinócio de Primavera). Baseia-se no ciclo lunar/solar e adiciona 4.000 anos à era vulgar (cronologia de James Usher).</p>
            </div>

            <div class="nav-controls">
                <button class="btn btn-outline" onclick="nextSection(6)">← Voltar</button>
                <button class="btn" onclick="nextSection(8)">Quiz: Material 2 →</button>
            </div>
        </section>

        <!-- SEÇÃO 8: QUIZ MATERIAL 2 -->
        <section id="sec8">
            <h2>📝 Fixação: Material 2</h2>
            <div class="quiz-container" id="quiz2">
                <div id="q2-container">
                    <p class="quiz-q" id="q2-text"></p>
                    <div class="quiz-opts" id="q2-options"></div>
                </div>
            </div>
            <div class="nav-controls">
                <button class="btn btn-outline" onclick="nextSection(7)">← Voltar</button>
                <button class="btn" id="btnFinish" style="display:none;" onclick="nextSection(9)">Ver Resultado Final →</button>
            </div>
        </section>

        <!-- SEÇÃO 9: RESULTADO FINAL -->
        <section id="sec9">
            <h2>📊 Resultado do Treinamento</h2>
            <div class="score-card">
                <h3>Sua Pontuação Total</h3>
                <div class="score-number" id="totalScore">0/22</div>
                <p id="scoreMessage" style="text-align:center; font-size:1.2em;"></p>
                
                <div style="margin-top: 30px;">
                    <button class="btn btn-outline" onclick="location.reload()">Reiniciar Treinamento</button>
                    <button class="btn" onclick="toggleCertForm()">Receber Certificado</button>
                </div>

                <!-- FORMULÁRIO DE CERTIFICADO CONDICIONAL -->
                <div class="cert-form-container" id="certForm">
                    <div class="cert-form-group">
                        <label for="userName">Seu Nome Completo:</label>
                        <input type="text" id="userName" placeholder="Ex: João Silva">
                    </div>
                    <div class="cert-form-group">
                        <label for="userEmail">Seu E-mail:</label>
                        <input type="email" id="userEmail" placeholder="Ex: joao@email.com">
                    </div>
                    <button class="btn" style="width:100%; margin:10px 0 0 0;" onclick="submitCertificateData()">Enviar Dados</button>
                    <div id="certMessage"></div>
                </div>
            </div>
        </section>

    </div>

    <footer>
        <p>Minha Jornada Maçônica • 2026</p>
    </footer>

    <script>
        const questions1 = [
            { q: "Quais são os três pilares fundamentais da Maçonaria?", opts: ["Fé, Esperança e Caridade", "Liberdade, Igualdade e Fraternidade", "Ciência, Justiça e Trabalho", "Estudo, Sigilo e Contribuição"], ans: 1 },
            { q: "Qual a função da 'Justiça' segundo o lema essencial da instituição?", opts: ["Elevar o espírito humano", "Garantir a independência civil", "Equilibrar as relações humanas", "Punir severamente os infratores"], ans: 2 },
            { q: "O que marcou a transição histórica da Maçonaria Operativa para a Especulativa?", opts: ["A proibição total de templos de pedra", "A mudança estrutural para uma natureza filosófica e de debate", "A fundação imediata do GOB em 1822", "O fim das discussões de negócios"], ans: 1 },
            { q: "A Maçonaria teve papel ativo na história do Brasil. Quais feitos contaram com seu protagonismo?", opts: ["Apenas em campanhas de caridade locais", "Na Independência, Abolição da Escravatura e República", "Na criação de universidades confessionais", "Exclusivamente no desenvolvimento bancário"], ans: 1 },
            { q: "Quais os critérios essenciais e doutrinários exigidos de um candidato?", opts: ["Ser obrigatoriamente ateu e possuir grandes posses", "Crer em Deus (G.A.D.U.), amar o próximo e ter estabilidade financeira", "Estar envolvido ativamente na política partidária", "Dominar toda a ritualística secreta antes de ingressar"], ans: 1 },
            { q: "O que representaram os Estatutos Schaw de 1598 na Escócia?", opts: ["O fechamento definitivo das primeiras lojas", "A codificação das regras corporativas e o início da transição autônoma", "A fusão da maçonaria com o clero local", "A criação do Rito Adonhiramita"], ans: 1 },
            { q: "O que diferencia o concept estrutural de 'Loja' e 'Templo'?", opts: ["Não há diferença, são sinônimos exatos", "A Loja é a estrutura institucional de reunião; o Templo é o ambiente fraternal físico e sagrado", "A Loja serve para fins comerciais e o Templo para fins ritualísticos", "A Loja pertence ao GOB e o Templo pertence às confederações"], ans: 1 },
            { q: "Qual o maior marco institucional maçônico fundado no Brasil em 17 de junho de 1822?", opts: ["A Academia Brasílica dos Esquecidos", "O Grande Oriente do Brasil (GOB)", "A Confederação Maçônica do Brasil (COMAB)", "A Loja de São João do Brasil"], ans: 1 },
            { q: "Em relação a debates em ambiente de Loja, o que é terminantemente proibido para preservar a harmonia?", opts: ["Discussões sobre filosofia e ciência", "Debates sobre arte e arquitetura antiga", "Discussões políticas partidárias ou religiosas", "Instruções sobre moral e filantropia"], ans: 2 },
            { q: "Quais são as três organizações maçônicas reconhecidas internacionalmente de forma regular no Brasil?", opts: ["Lojas de Londres, Paris e Escócia", "Apenas as Academias de Letras Maçônicas", "GOB, CMSB e COMAB", "Nenhuma organização possui reconhecimento internacional regular"], ans: 2 }
        ];

        const questions2 = [
            { q: "Em que ano o Rito Adonhiramita foi formalmente oficializado e por meio de qual obra?", opts: ["Em 1717, com as Constituições de Anderson", "Em 1781, com a publicação do primeiro volume da 'Compilação Preciosa' (Recueil Précieux)", "Em 1822, com a fundação do Grande Oriente Brasílico", "Em 1730, com o lançamento de 'Maçonaria Dissecada'"], ans: 1 },
            { q: "Qual rito escocês é considerado a base comum e o ponto de origem do Rito Adonhiramita?", opts: ["O Rito de York", "O Rito Escocês Antigo e Aceito (REAA)", "O Rito de Heredon (ou de Perfeição), originário da Escócia", "O Rito Moderno ou Francês"], ans: 2 },
            { q: "Quem é o personagem central da construção do Templo de Salomão neste rito e por que ele foi escolhido?", opts: ["Hiram Abiff, visto como o Arquiteto Supremo em todas as passagens bíblicas", "Hiram, Rei de Tiro, por liderar diretamente as corveias", "Adonhiram, por ser identificado em exegeses bíblicas como o verdadeiro supervisor e recrutador dos obreiros", "O Abade Louis Travenol, por coordenar a fundição dos metais"], ans: 2 },
            { q: "Quem é o autor (ou compilador) oficial da 'Compilação Preciosa' e qual a controvérsia sobre essa autoria?", opts: ["Louis Guillemain de Saint-Victor, embora a autoria dos textos tenha sido muito atribuída ao Barão de Tschoudy", "O Barão de Tschoudy, embora fontes aleguem ter sido Samuel Pritchard", "William Schaw, cuja identidade fantasma gerou mitos na França", "James Usher, sob o pseudônimo de Cavaleiro de Lussy"], ans: 0 },
            { q: "O que é o 'Stekenna' e qual o seu significado místico para o maçom adonhiramita?", opts: ["Uma lâmina decorada que serve como antena geomagnética no solo", "A imagem de um cordeiro branco deitado sobre o Livro dos Sete Selos, simbolizando que apenas o iniciado que atinge a perfeição desvela a doutrina", "O pálio de espadas cruzadas que protege o altar do Oriente", "A marcha ritualística realizada obrigatoriamente com o início pelo pé esquerdo"], ans: 1 },
            { q: "Como o Rito Adonhiramita é comumente caracterizado em termos de sua natureza e filosofia?", opts: ["Como um rito puramente administrativo, focado em reformas cívicas e sociais", "Como um rito secular, racionalista e resistant a influências gnósticas", "Como um rito eminentemente metafísico, teísta, esotérico, místico e preservador das Escolas de Mistério", "Como um rito operativo voltado à reconstrução cenográfica de monumentos antigos"], ans: 2 },
            { q: "O que simboliza o 'Nome Histórico' e qual sua regra de escolha?", opts: ["Simboliza o renascimento do iniciado; deve ser o nome de uma figura virtuosa já falecida (e protegia a identidade contra o Alvará de 1818)", "Simboliza a filiação à Loja-Mãe de Londres; deve ser o nome de um nobre britânico vivo", "Simboliza o nível social civil; deve corresponder ao sobrenome de fundadores da oficina", "Simboliza as artes liberais; deve ser o nome de um planeta do zodíaco"], ans: 0 },
            { q: "Quando começa o ano no Calendário Adonhiramita e qual a justificativa astronômica para essa data?", opts: ["Em 1º de Janeiro, seguindo o solstício de inverno", "Em 17 de Junho, celebrando o solstício de verão no Brasil", "Em 21 de Março, correspondendo ao equinócio de primavera no hemisfério norte", "Em 24 de Junho, coincidindo com o dia de São João Batista"], ans: 2 },
            { q: "Em qual trecho das Escrituras o Livro da Lei deve ser aberto e o que isso indica sobre a influência do rito?", opts: ["No Gênesis, denotando influência da maçonaria de tradição operativa", "No Evangelho de João (1: 6-9), denotando forte influência do gnosticismo cristão", "No Livro dos Reis, indicando a predominância da vertente puramente hiramita", "No Apocalipse, indicando influências de escolas astrológicas medievais"], ans: 1 },
            { q: "Qual é a divergência histórica sobre o número original de graus do Rito Adonhiramita?", opts: ["Se a estrutura inicial contava com 3 ou 7 graus simbólicos", "Se o rito possuía originalmente 30 ou 33 graus equiparados ao REAA", "Se a estrutura possuía 12 ou 13 graus, devido à inclusão do grau honorífico de Cavaleiro Noaquita", "Se o rito limitava-se a apenas 1 grau de coroação"], ans: 2 },
            { q: "Qual o motivo tático e histórico da Inversão de Pritchard?", opts: ["Ajustar a iluminação das colunas com lâmpadas elétricas no teto", "Confundir intrusos após a traição e publicação de 'Maçonaria Dissecada' em 1730", "Garantir que os dois Vigilantes se sentassem no Oriente", "Harmonizar a egrégora com o toque argentinho das doze badaladas"], ans: 1 },
            { q: "Quais são alguns dos principais elements ritualísticos marcantes do Rito Adonhiramita?", opts: ["Uso estrito de iluminação elétrica e sessões sem música", "Eliminação do Livro da Lei e abolição das luvas e chapéu", "A incensação fluídica, o uso de luvas, o tratamento de 'Amado Irmão' e a abertura no Evangelho de S. João", "Debates livres sobre política partidária e eliminação do cerimonial do fogo"], ans: 2 }
        ];

        let currentQ1 = 0;
        let currentQ2 = 0;
        let score1 = 0;
        let score2 = 0;

        function nextSection(id) {
            document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
            document.getElementById('sec' + id).classList.add('active');
            window.scrollTo(0, 0);
            updateProgress(id);
            
            if(id === 5) loadQuestion1();
            if(id === 8) loadQuestion2();
            if(id === 9) showFinalScore();
        }

        function updateProgress(id) {
            const total = 9;
            const progress = (id / total) * 100;
            document.getElementById('progressBar').style.width = progress + '%';
        }

        function loadQuestion1() {
            if(currentQ1 < questions1.length) {
                const q = questions1[currentQ1];
                document.getElementById('q1-text').innerText = \`Pergunta \${currentQ1 + 1} de 10: \${q.q}\`;
                const optsDiv = document.getElementById('q1-options');
                optsDiv.innerHTML = '';
                q.opts.forEach((opt, i) => {
                    const btn = document.createElement('button');
                    btn.className = 'quiz-opt-btn';
                    btn.innerText = opt;
                    btn.onclick = () => checkAns1(i);
                    optsDiv.appendChild(btn);
                });
            } else {
                document.getElementById('q1-container').innerHTML = \`<h3>Primeira Etapa Concluída!</h3><p style="text-align:center; margin-top:15px;">Você acertou \${score1} de 10 questões.</p>\`;
                document.getElementById('btnNextMaterial').style.display = 'inline-block';
            }
        }

        function checkAns1(idx) {
            const btns = document.querySelectorAll('#q1-options .quiz-opt-btn');
            btns.forEach(b => b.disabled = true);
            if(idx === questions1[currentQ1].ans) {
                btns[idx].classList.add('correct');
                score1++;
            } else {
                btns[idx].classList.add('wrong');
                btns[questions1[currentQ1].ans].classList.add('correct');
            }
            setTimeout(() => {
                currentQ1++;
                loadQuestion1();
            }, 1500);
        }

        function loadQuestion2() {
            if(currentQ2 < questions2.length) {
                const q = questions2[currentQ2];
                document.getElementById('q2-text').innerText = \`Pergunta \${currentQ2 + 1} de 12: \${q.q}\`;
                const optsDiv = document.getElementById('q2-options');
                optsDiv.innerHTML = '';
                q.opts.forEach((opt, i) => {
                    const btn = document.createElement('button');
                    btn.className = 'quiz-opt-btn';
                    btn.innerText = opt;
                    btn.onclick = () => checkAns2(i);
                    optsDiv.appendChild(btn);
                });
            } else {
                document.getElementById('q2-container').innerHTML = \`<h3>Segunda Etapa Concluída!</h3><p style="text-align:center; margin-top:15px;">Você acertou \${score2} de 12 questões.</p>\`;
                document.getElementById('btnFinish').style.display = 'inline-block';
            }
        }

        function checkAns2(idx) {
            const btns = document.querySelectorAll('#q2-options .quiz-opt-btn');
            btns.forEach(b => b.disabled = true);
            if(idx === questions2[currentQ2].ans) {
                btns[idx].classList.add('correct');
                score2++;
            } else {
                btns[idx].classList.add('wrong');
                btns[questions2[currentQ2].ans].classList.add('correct');
            }
            setTimeout(() => {
                currentQ2++;
                loadQuestion2();
            }, 1500);
        }

        function showFinalScore() {
            const total = score1 + score2;
            document.getElementById('totalScore').innerText = \`\${total}/22\`;
            let msg = "";
            if(total === 22) msg = "Excelente! Você demonstrou um conhecimento perfeito e profunda retidão sobre a Ordem.";
            else if(total >= 17) msg = "Muito bom! Você tem uma fantástica base teórica sobre as tradições, história e ritualística.";
            else msg = "Bom esforço. Recomendamos revisar os pontos litúrgicos e históricos para fortalecer sua caminhada.";
            document.getElementById('scoreMessage').innerText = msg;
        }

        // LÓGICA DO NOVO FORMULÁRIO DE CERTIFICADO
        function toggleCertForm() {
            const form = document.getElementById('certForm');
            if (form.style.display === 'block') {
                form.style.display = 'none';
            } else {
                form.style.display = 'block';
                form.scrollIntoView({ behavior: 'smooth' });
            }
        }

        function submitCertificateData() {
            const name = document.getElementById('userName').value.trim();
            const email = document.getElementById('userEmail').value.trim();
            const scoreTotal = score1 + score2;
            const msgDiv = document.getElementById('certMessage');

            if (!name || !email) {
                msgDiv.style.color = 'var(--red)';
                msgDiv.innerText = "Por favor, preencha todos os campos.";
                return;
            }

            msgDiv.style.color = 'var(--gold)';
            msgDiv.innerText = "Processando envio...";

            // IMPORTANTE: Substitua a string abaixo pelo link de implantação do seu Google Apps Script (Web App)
            const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbywPlU5RaOwAeabrrRChSXFOBc-txR_dmaLXmxWW5BSrxSA1XjP-BduT7UEzDtjHcdLLg/exec";

            // Montagem da carga de dados
            const formData = new FormData();
            formData.append("nome", name);
            formData.append("email", email);
            formData.append("pontuacao", \`\${scoreTotal}/22\`);
            formData.append("data", new Date().toLocaleString("pt-BR"));

            if (WEB_APP_URL === "URL_DO_SEU_WEB_APP") {
                // Mock visual caso o usuário ainda não tenha configurado o Apps Script
                setTimeout(() => {
                    msgDiv.style.color = 'var(--green)';
                    msgDiv.innerText = "Sucesso simulado! (Configure a URL do Web App no código para salvar na planilha real)";
                    console.log("Dados enviados:", { name, email, scoreTotal });
                }, 1200);
            } else {
                // Envio Real via POST para a planilha do Google
                fetch(WEB_APP_URL, {
                    method: "POST",
                    body: formData,
                    mode: "no-cors" // Evita problemas de CORS comuns do Google Apps Script
                })
                .then(() => {
                    msgDiv.style.color = 'var(--green)';
                    msgDiv.innerText = "Dados enviados com sucesso, aguarde seu certificado no e-mail informado!";
                    document.getElementById('userName').value = "";
                    document.getElementById('userEmail').value = "";
                })
                .catch(error => {
                    msgDiv.style.color = 'var(--red)';
                    msgDiv.innerText = "Erro ao enviar dados. Tente novamente.";
                    console.error("Erro:", error);
                });
            }
        }
    </script>
</body>
</html>`
};
