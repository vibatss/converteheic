const uploadInput = document.getElementById("upload");
const preview = document.getElementById("preview");
const convertBtn = document.getElementById("convertBtn");
const carregando = document.getElementById("carregando");

const statusUpload = document.getElementById("status-upload");
const uploadInfo = document.getElementById("upload-info");
const uploadNome = document.getElementById("upload-nome");
const uploadPorcentagem = document.getElementById("upload-porcentagem");
const uploadVelocidade = document.getElementById("upload-velocidade");
const progresso = document.getElementById("progresso");
const arquivoNumero = document.getElementById("arquivo-numero");
const arquivoTotal = document.getElementById("arquivo-total");

let arquivosSelecionados = [];

uploadInput.addEventListener("change", () => {
  arquivosSelecionados = Array.from(uploadInput.files).slice(0, 5);
  preview.innerHTML = "";
  convertBtn.style.display = arquivosSelecionados.length > 0 ? "inline-block" : "none";
});

async function converter() {
  const formatoSelecionado = document.getElementById("formato").value;
  carregando.style.display = "none";
  statusUpload.style.display = "block";
  preview.innerHTML = "";

  arquivoTotal.textContent = arquivosSelecionados.length;

  for (let i = 0; i < arquivosSelecionados.length; i++) {
    const file = arquivosSelecionados[i];
    arquivoNumero.textContent = i + 1;
    uploadNome.textContent = "Arquivo: " + file.name;

    let progressoAtual = 0;
    let velocidade = Math.floor(Math.random() * 300) + 700;

    // Simula o carregamento antes de converter
    await new Promise((resolve) => {
      const intervalo = setInterval(() => {
        progressoAtual += Math.floor(Math.random() * 10) + 5;
        if (progressoAtual >= 100) {
          progressoAtual = 100;
          clearInterval(intervalo);
          resolve();
        }

        progresso.style.width = progressoAtual + "%";
        uploadPorcentagem.textContent = progressoAtual + "%";
        uploadVelocidade.textContent = "Velocidade: " + velocidade + " KB/s";
      }, 80);
    });

    try {
      const result = await heic2any({
        blob: file,
        toType: formatoSelecionado,
        quality: 0.9,
      });

      const extensao = formatoSelecionado.split("/")[1];
      const url = URL.createObjectURL(result);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name.replace(/\.heic$/i, `.${extensao}`);
      link.textContent = `⬇️ Baixar ${link.download}`;
      link.className = "btn";
      link.style.display = "block";
      link.style.margin = "10px auto";

      preview.appendChild(link);
    } catch (e) {
      const error = document.createElement("p");
      error.textContent = `Erro ao converter ${file.name}`;
      preview.appendChild(error);
    }

    // Reseta barra
    progresso.style.width = "0%";
    uploadPorcentagem.textContent = "0%";
    uploadVelocidade.textContent = "Velocidade: 0 KB/s";
  }

  statusUpload.style.display = "none";
}
