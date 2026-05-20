const horariosFixos = [
  "19:00",
  "20:00",
  "21:00",
];

let horarioSelecionado = "";
let servicoSelecionado = "Manicure";

function mostrarAgenda() {
  document.getElementById("home").classList.add("escondido");
  document.getElementById("agenda").classList.remove("escondido");
  window.scrollTo(0, 0);
}

function mostrarHome() {
  document.getElementById("agenda").classList.add("escondido");
  document.getElementById("home").classList.remove("escondido");
  window.scrollTo(0, 0);
}

const botoesServico = document.querySelectorAll(".servico-btn");

botoesServico.forEach(botao => {
  botao.addEventListener("click", () => {
    botoesServico.forEach(btn => btn.classList.remove("ativo"));

    botao.classList.add("ativo");
    servicoSelecionado = botao.dataset.servico;
  });
});

const dataAgenda = document.getElementById("dataAgenda");

dataAgenda.addEventListener("change", () => {
  carregarHorarios();
});

function carregarHorarios() {
  const container = document.getElementById("horariosDisponiveis");

  container.innerHTML = "";
  horarioSelecionado = "";

  horariosFixos.forEach(horario => {
    const botao = document.createElement("button");

    botao.classList.add("horario-btn");
    botao.innerText = horario;

    botao.onclick = () => {
      document.querySelectorAll(".horario-btn").forEach(btn => {
        btn.classList.remove("ativo");
      });

      botao.classList.add("ativo");
      horarioSelecionado = horario;
    };

    container.appendChild(botao);
  });
}

function formatarData(data) {
  const partes = data.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function confirmarAgendamento() {
  const nome = document.getElementById("clienteNome").value.trim();
  const telefoneCliente = document.getElementById("clienteTelefone").value.trim();
  const data = document.getElementById("dataAgenda").value;

  if (!nome || !telefoneCliente || !data || !horarioSelecionado) {
    alert("Preencha todos os campos.");
    return;
  }

  const telefoneStudio = "5551997529440";
  const dataFormatada = formatarData(data);

  const mensagem =
`✨ *NOVO AGENDAMENTO* ✨

💅 *Andressa Santos Nails Studio*

👩 Cliente: *${nome}*
📞 WhatsApp: ${telefoneCliente}

📌 Serviço: *${servicoSelecionado}*
📅 Data: *${dataFormatada}*
⏰ Horário: *${horarioSelecionado}*

💖 Aguardo confirmação do horário.`;

  const link = `https://wa.me/${telefoneStudio}?text=${encodeURIComponent(mensagem)}`;

  window.open(link, "_blank");
}