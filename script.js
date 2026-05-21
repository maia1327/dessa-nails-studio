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

/* GALERIA AUTOMÁTICA DA HOME */

const fotosGaleria = [
  "fotos/foto1.png",
  "fotos/foto2.png",
  "fotos/foto3.png",
  "fotos/foto4.png",
];

function iniciarGaleriaHome() {
  const imagemHome = document.getElementById("fotoGaleriaHome");

  if (!imagemHome) return;

  let fotoAtual = 0;

  imagemHome.src = fotosGaleria[0];

  setInterval(() => {

    imagemHome.classList.add("trocando");

    setTimeout(() => {

      fotoAtual++;

      if (fotoAtual >= fotosGaleria.length) {
        fotoAtual = 0;
      }

      imagemHome.src = fotosGaleria[fotoAtual];

      imagemHome.classList.remove("trocando");

    }, 300);

  }, 3000);
}

iniciarGaleriaHome();