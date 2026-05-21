let horarioSelecionado = "";
let servicoSelecionado = "Manicure";
let dataSelecionada = "";

function mostrarAgenda() {
  document.getElementById("agenda").classList.remove("escondido");
  carregarDatasEHorarios();
}

function mostrarHome() {
  document.getElementById("agenda").classList.add("escondido");
}

const botoesServico = document.querySelectorAll(".servico-btn");

botoesServico.forEach(botao => {
  botao.addEventListener("click", () => {
    botoesServico.forEach(btn => btn.classList.remove("ativo"));
    botao.classList.add("ativo");
    servicoSelecionado = botao.dataset.servico;
  });
});

function carregarDatasEHorarios() {
  const container = document.getElementById("datasDisponiveis");
  container.innerHTML = "";

  horarioSelecionado = "";
  dataSelecionada = "";

  let disponibilidades = JSON.parse(localStorage.getItem("disponibilidades")) || [];

  disponibilidades = disponibilidades.map(item => ({
    ...item,
    status: item.status || "disponivel"
  }));

  if (disponibilidades.length === 0) {
    container.innerHTML = "<p class='aviso'>Nenhum horário disponível no momento.</p>";
    return;
  }

  const datasAgrupadas = {};

  disponibilidades.forEach(item => {
    if (!datasAgrupadas[item.data]) {
      datasAgrupadas[item.data] = [];
    }

    datasAgrupadas[item.data].push(item);
  });

  Object.keys(datasAgrupadas).forEach(data => {
    const bloco = document.createElement("div");
    bloco.classList.add("bloco-dia");

    const titulo = document.createElement("h4");
    titulo.innerText = formatarDataComDia(data);

    const horariosDiv = document.createElement("div");
    horariosDiv.classList.add("horarios");

    datasAgrupadas[data].forEach(item => {
      const botao = document.createElement("button");

      botao.classList.add("horario-btn");

      if (item.status === "ocupado") {
        botao.classList.add("ocupado");
      }

      botao.innerText = item.horario;

      botao.onclick = () => {
        if (item.status === "ocupado") {
          mostrarAvisoCliente("Este horário já está ocupado. Escolha outro horário disponível.");
          return;
        }

        document.querySelectorAll(".horario-btn").forEach(btn => {
          btn.classList.remove("ativo");
        });

        botao.classList.add("ativo");
        dataSelecionada = data;
        horarioSelecionado = item.horario;
      };

      horariosDiv.appendChild(botao);
    });

    bloco.appendChild(titulo);
    bloco.appendChild(horariosDiv);
    container.appendChild(bloco);
  });
}

function formatarData(data) {
  const partes = data.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarDataComDia(data) {
  const dias = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
  ];

  const dataObj = new Date(data + "T00:00:00");
  const diaSemana = dias[dataObj.getDay()];

  return `${diaSemana} • ${formatarData(data)}`;
}

function confirmarAgendamento() {
  const nome = document.getElementById("clienteNome").value.trim();

  if (!nome || !dataSelecionada || !horarioSelecionado) {
    mostrarAvisoCliente("Preencha seu nome e escolha um horário disponível.");
    return;
  }

  const telefoneStudio = "5551997529440";
  const dataFormatada = formatarData(dataSelecionada);

  const mensagem =
`*NOVO AGENDAMENTO*

*Andressa Santos Nail Designer*

Cliente: *${nome}*

Servico: *${servicoSelecionado}*
Data: *${dataFormatada}*
Horario: *${horarioSelecionado}*

Aguardando confirmacao do horario.`;

  const link = `https://wa.me/${telefoneStudio}?text=${encodeURIComponent(mensagem)}`;

  window.open(link, "_blank");
}

function mostrarAvisoCliente(texto) {
  let aviso = document.getElementById("avisoCliente");

  if (!aviso) {
    aviso = document.createElement("div");
    aviso.id = "avisoCliente";
    aviso.className = "aviso-cliente";

    const agendaBox = document.querySelector(".agenda-box");
    agendaBox.prepend(aviso);
  }

  aviso.innerText = texto;
  aviso.classList.add("ativo");

  setTimeout(() => {
    aviso.classList.remove("ativo");
  }, 3000);
}

/* PORTFÓLIO / TABELA DE SERVIÇOS */

const portfolioPadrao = {
  titulo: "Tabela de Serviços",
  subtitulo: "Beleza, cuidado e sofisticação em cada detalhe.",
  aplicacoes: [
    { nome: "Molde F1", preco: "R$ 120,00" },
    { nome: "Fibra de vidro", preco: "R$ 130,00" },
    { nome: "Banho de gel", preco: "R$ 90,00" },
    { nome: "Blindagem", preco: "R$ 80,00" },
    { nome: "Esmaltação em Gel", preco: "R$ 60,00" }
  ],
  manutencoes: [
    { nome: "Alongamento", preco: "R$ 90,00" },
    { nome: "Banho de gel", preco: "R$ 60,00" }
  ],
  fotos: [
    "./fotos/foto01.png",
    "./fotos/foto02.png",
    "./fotos/foto03.png",
    "./fotos/foto04.png",
    "./fotos/foto05.png",
    "./fotos/foto06.png"
  ]
};

function carregarPortfolio() {
  return JSON.parse(localStorage.getItem("portfolioConfig")) || portfolioPadrao;
}

function criarLinhaServico(item) {
  return `
    <div class="linha-servico">
      <span>${item.nome}</span>
      <span class="pontilhado"></span>
      <strong>${item.preco}</strong>
    </div>
  `;
}

function renderizarPortfolio() {
  const config = carregarPortfolio();

  const titulo = document.getElementById("portfolioTitulo");
  const subtitulo = document.getElementById("portfolioSubtitulo");
  const listaAplicacoes = document.getElementById("listaAplicacoes");
  const listaManutencoes = document.getElementById("listaManutencoes");

  if (!titulo) return;

  titulo.innerText = config.titulo;
  subtitulo.innerText = config.subtitulo;

  listaAplicacoes.innerHTML = config.aplicacoes.map(criarLinhaServico).join("");
  listaManutencoes.innerHTML = config.manutencoes.map(criarLinhaServico).join("");

  trocarFotosPortfolio();
  setInterval(trocarFotosPortfolio, 4500);
}

function pegarTresFotosAleatorias(fotos) {
  const embaralhadas = [...fotos].sort(() => Math.random() - 0.5);
  return embaralhadas.slice(0, 3);
}

function trocarFotosPortfolio() {
  const config = carregarPortfolio();
  const fotos = pegarTresFotosAleatorias(config.fotos);

  const img1 = document.getElementById("portfolioFoto1");
  const img2 = document.getElementById("portfolioFoto2");
  const img3 = document.getElementById("portfolioFoto3");

  if (!img1 || !img2 || !img3) return;

  document.querySelectorAll(".foto-servico").forEach(card => {
    card.classList.add("trocando");
  });

  setTimeout(() => {
    img1.src = fotos[0] || "./fotos/foto01.png";
    img2.src = fotos[1] || "./fotos/foto02.png";
    img3.src = fotos[2] || "./fotos/foto03.png";

    document.querySelectorAll(".foto-servico").forEach(card => {
      card.classList.remove("trocando");
    });
  }, 450);
}

window.addEventListener("load", renderizarPortfolio);