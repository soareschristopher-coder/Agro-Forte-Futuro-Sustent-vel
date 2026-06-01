// --- ESTADOS DO JOGO ---
let estadoJogo = "INTRO"; // INTRO, MENU, JOGANDO, GAMEOVER, VITORIA
let fase = 1;
let vidas = 3;
let pontuacao = 0;
let tempo = 60; // Tempo em segundos por fase
let timerInterval;

// --- VARIÁVEIS DO JOGADOR (Estilo Mario) ---
let jogadorX = 100;
let jogadorY = 300;
let jogadorTamanho = 40;
let velocidadeY = 0;
let gravidade = 0.6;
let noChao = false;

// --- ELEMENTOS DO CENÁRIO ---
let chaoY = 360;
let itens = [];
let obstaculos = [];

// --- MENSAGENS DE SUSTENTABILIDADE ---
let mensagensEco = [
  "O plantio direto protege o solo contra a erosão!",
  "A rotação de culturas mantém os nutrientes da terra vivos.",
  "Agro forte é aquele que produz em harmonia com a natureza!",
  "Alimentos colhidos! Agora vamos abastecer a cidade de forma sustentável!"
];
let mensagemAtual = "";

function setup() {
  createCanvas(800, 400);
  inicializarFase();
  
  // Contador de tempo (1 segundo)
  setInterval(() => {
    if (estadoJogo === "JOGANDO") {
      tempo--;
      if (tempo <= 0) {
        verificarFimDeFase();
      }
    }
  }, 1000);
}

function draw() {
  background(135, 206, 235); // Céu Azul

  if (estadoJogo === "INTRO") {
    telaIntro();
  } else if (estadoJogo === "MENU") {
    telaMenu();
  } else if (estadoJogo === "JOGANDO") {
    atualizarJogo();
    desenharJogo();
  } else if (estadoJogo === "GAMEOVER") {
    telaGameOver();
  } else if (estadoJogo === "VITORIA") {
    telaVitoria();
  }
}

// --- TELAS DO JOGO ---

function telaIntro() {
  background(20, 40, 20);
  fill(255);
  textAlign(CENTER);
  textSize(22);
  text("SENAR-PR e SEED-PR Apresentam:", width / 2, 80);
  
  textSize(28);
  fill(50, 205, 50);
  text("Agro Forte, Futuro Sustentável", width / 2, 140);
  textSize(18);
  fill(255);
  text("Equilíbrio entre Produção e Meio Ambiente", width / 2, 180);
  
  textSize(16);
  fill(200);
  text("Uma aventura em 8-bits sobre agricultura consciente.", width / 2, 240);
  fill(255, 255, 0);
  text("Pressione ESPAÇO para ir ao Menu", width / 2, 320);
}

function telaMenu() {
  background(34, 139, 34); // Fundo Verde
  fill(255);
  textAlign(CENTER);
  textSize(32);
  text("MENU PRINCIPAL", width / 2, 100);
  
  textSize(18);
  text("Controles: Setas Esquerda/Direita movimentam. Seta para CIMA pula.", width / 2, 180);
  text("Fase 1: No Campo - Plante e colha sementes sustentáveis.", width / 2, 220);
  text("Fase 2: Na Cidade - Entregue os alimentos e evite a poluição.", width / 2, 250);
  
  fill(255, 255, 0);
  textSize(24);
  text("Pressione ENTER para Iniciar o Jogo", width / 2, 330);
}

function telaGameOver() {
  background(50, 0, 0);
  fill(255, 0, 0);
  textAlign(CENTER);
  textSize(40);
  text("GAME OVER", width / 2, 180);
  
  fill(255);
  textSize(18);
  text("Precisamos cuidar melhor do nosso planeta.", width / 2, 230);
  text("Pressione ENTER para tentar novamente", width / 2, 300);
}

function telaVitoria() {
  background(244, 164, 96);
  fill(0, 100, 0);
  textAlign(CENTER);
  textSize(36);
  text("PARABÉNS! VOCÊ VENCEU!", width / 2, 150);
  
  fill(0);
  textSize(18);
  text("Você provou que é possível produzir alimentos em equilíbrio com a natureza.", width / 2, 210);
  text("O Paraná agradece sua dedicação sustentável!", width / 2, 240);
  
  fill(0, 0, 139);
  text("Pressione ENTER para voltar ao Menu", width / 2, 320);
}

// --- LÓGICA DO JOGO ---

function inicializarFase() {
  jogadorX = 100;
  jogadorY = 300;
  velocidadeY = 0;
  tempo = 60;
  itens = [];
  obstaculos = [];
  
  mensagemAtual = mensagensEco[fase - 1];

  // Configuração de elementos dependendo da fase
  if (fase === 1) {
    // Fase do Campo: Coletar sementes, evitar pragas sem pesticidas nocivos
    for (let i = 0; i < 5; i++) {
      itens.push({ x: 200 + i * 130, y: 250, coletado: false, tipo: "Semente" });
    }
    obstaculos.push({ x: 350, y: chaoY - 30, w: 30, h: 30, tipo: "Nuvem de Insetos" });
    obstaculos.push({ x: 600, y: chaoY - 30, w: 30, h: 30, tipo: "Erosão" });
  } else if (fase === 2) {
    // Fase da Cidade: Entregar alimentos, evitar poluição
    for (let i = 0; i < 5; i++) {
      itens.push({ x: 200 + i * 130, y: 220, coletado: false, tipo: "Alimento" });
    }
    obstaculos.push({ x: 300, y: chaoY - 40, w: 40, h: 40, tipo: "Lixo Poluente" });
    obstaculos.push({ x: 550, y: chaoY - 40, w: 40, h: 40, tipo: "Fumaça Escura" });
  }
}

function atualizarJogo() {
  // Movimentação e Gravidade (Estilo Mario Bros)
  velocidadeY += gravidade;
  jogadorY += velocidadeY;

  if (jogadorY >= chaoY - jogadorTamanho) {
    jogadorY = chaoY - jogadorTamanho;
    velocidadeY = 0;
    noChao = true;
  }

  if (keyIsDown(LEFT_ARROW)) jogadorX -= 5;
  if (keyIsDown(RIGHT_ARROW)) jogadorX += 5;
  
  // Limites da tela
  jogadorX = constrain(jogadorX, 0, width - jogadorTamanho);

  // Verificação de colisão com Itens
  for (let item of itens) {
    if (!item.coletado && dist(jogadorX + jogadorTamanho/2, jogadorY + jogadorTamanho/2, item.x, item.y) < 30) {
      item.coletado = true;
      pontuacao += 10;
    }
  }

  // Verificação de colisão com Obstáculos
  for (let obs of obstaculos) {
    if (jogadorX < obs.x + obs.w && jogadorX + jogadorTamanho > obs.x &&
        jogadorY < obs.y + obs.h && jogadorY + jogadorTamanho > obs.y) {
      vidas--;
      jogadorX = 50; // Reseta posição ao sofrer dano
      if (vidas <= 0) {
        estadoJogo = "GAMEOVER";
      }
    }
  }

  // Verificar se coletou tudo para passar de fase
  let todosColetados = itens.every(item => item.coletado);
  if (todosColetados && jogadorX > width - 60) {
    verificarFimDeFase();
  }
}

function verificarFimDeFase() {
  if (fase === 1) {
    fase = 2;
    inicializarFase();
  } else {
    estadoJogo = "VITORIA";
  }
}

function desenharJogo() {
  // Desenha o cenário de fundo dependendo da fase
  if (fase === 1) {
    // Campo (Verde)
    fill(34, 139, 34);
    rect(0, chaoY, width, height - chaoY);
  } else {
    // Cidade (Cinza)
    fill(100);
    rect(0, chaoY, width, height - chaoY);
    // Prédios ao fundo de forma simples
    fill(150, 150, 160);
    rect(50, 150, 60, 210);
    rect(650, 100, 80, 260);
  }

  // Desenha o Jogador (Agricultor estilizado)
  fill(255, 69, 0); // Macacão Vermelho Mario-style
  rect(jogadorX, jogadorY, jogadorTamanho, jogadorTamanho, 5);
  fill(255, 222, 173); // Rosto
  rect(jogadorX + 10, jogadorY + 5, 20, 15);
  fill(0, 100, 0); // Boné Verde (Sustentabilidade/SENAR)
  rect(jogadorX + 5, jogadorY, 30, 8);

  // Desenha os Itens
  for (let item of itens) {
    if (!item.coletado) {
      if (item.tipo === "Semente") {
        fill(139, 69, 19); // Marrom semente
        ellipse(item.x, item.y, 15, 20);
        fill(50, 205, 50); // Broto verde
        triangle(item.x, item.y - 10, item.x - 5, item.y - 5, item.x + 5, item.y - 5);
      } else {
        fill(255, 0, 0); // Maçã/Alimento saudável
        ellipse(item.x, item.y, 20, 20);
        fill(0, 200, 0);
        rect(item.x - 2, item.y - 14, 4, 6);
      }
    }
  }

  // Desenha os Obstáculos
  for (let obs of obstaculos) {
    fill(120, 60, 10);
    if (obs.tipo === "Nuvem de Insetos" || obs.tipo === "Fumaça Escura") {
      fill(80);
    }
    rect(obs.x, obs.y, obs.w, obs.h, 5);
    fill(255);
    textSize(10);
    text(obs.tipo, obs.x + obs.w/2, obs.y - 5);
  }

  // Ponto de Chegada (Seta indicativa no estilo Mario)
  fill(255, 215, 0);
  triangle(width - 40, chaoY - 40, width - 40, chaoY - 10, width - 10, chaoY - 25);

  // --- INTERFACE DO USUÁRIO (HUD) ---
  fill(0);
  rect(0, 0, width, 50);
  
  fill(255);
  textSize(14);
  textAlign(LEFT);
  text(`FASE: ${fase}`, 20, 30);
  text(`VIDAS: ${"❤️".repeat(vidas)}`, 120, 30);
  text(`PONTOS: ${pontuacao}`, 260, 30);
  text(`TEMPO: ${tempo}s`, 390, 30);
  
  // Banner de mensagem ecológica rotativa
  textAlign(RIGHT);
  fill(144, 238, 144);
  text(`Dica Eco: ${mensagemAtual}`, width - 20, 30);
}

// --- ENTRADA DE TECLADO ---

function keyPressed() {
  if (estadoJogo === "INTRO") {
    if (key === ' ') {
      estadoJogo = "MENU";
    }
  } else if (estadoJogo === "MENU") {
    if (keyCode === ENTER) {
      pontuacao = 0;
      vidas = 3;
      fase = 1;
      estadoJogo = "JOGANDO";
      inicializarFase();
    }
  } else if (estadoJogo === "JOGANDO") {
    if (keyCode === UP_ARROW && noChao) {
      velocidadeY = -12; // Força do pulo
      noChao = false;
    }
  } else if (estadoJogo === "GAMEOVER" || estadoJogo === "VITORIA") {
    if (keyCode === ENTER) {
      estadoJogo = "MENU";
    }
  }
}