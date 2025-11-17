const OCI_UPLOAD_URL = (
  window.__OCI_CONFIG && typeof window.__OCI_CONFIG.OCI_UPLOAD_URL === "string"
    ? window.__OCI_CONFIG.OCI_UPLOAD_URL
    : ""
).trim();
const FILE_PREFIX = "oci-audio-request";

const allowedEmails = [
  "alessandra.lima@oracle.com",
  "alex.takata@oracle.com",
  "andre.guedes@oracle.com",
  "braulio.galo@oracle.com",
  "edgar.e.araujo@oracle.com",
  "edvar.zandonade@oracle.com",
  "humberto.corbellini@oracle.com",
  "judivan.lucena@oracle.com",
  "lucas.cordeiro@oracle.com",
  "ricardo.felippeto@oracle.com",
  "rodrigo.loureiro@oracle.com",
  "thiago.ramalho@oracle.com",
  "tiago.rangel@oracle.com",
  "vitor.porto@oracle.com",
  "carlos.cm.miranda@oracle.com",
  "decio.domingues@oracle.com",
  "carlos.eduardo.santos@oracle.com",
  "eduardo.marcarini@oracle.com",
  "fernanda.carelo@oracle.com",
  "gabriel.yoshino@oracle.com",
  "givaldo.neto@oracle.com",
  "leonardo.s.silva@oracle.com",
  "marcel.rosa@oracle.com",
  "raphael.buzzi@oracle.com",
  "francis.yonemura@oracle.com",
  "herbert.marczewski@oracle.com",
  "lisboa.junior@oracle.com",
  "anderson.moreira@oracle.com",
  "eduardo.niel@oracle.com",
  "fernanda.pecarara@oracle.com",
  "gisely.rodrigues@oracle.com",
  "heder.oliveira@oracle.com",
  "humberto.siqueira@oracle.com",
  "lucio.vieira@oracle.com",
  "marcelo.r.novaes@oracle.com",
  "lucas.costa@oracle.com",
  "marcio.ferraz@oracle.com",
  "deborah.araujo@oracle.com",
  "diego.a.lima@oracle.com",
  "mauro.madela@oracle.com",
  "raul.xavier@oracle.com",
  "regis.pavinato@oracle.com",
  "ricardo.y.kobara@oracle.com",
  "salvador.junior@oracle.com",
  "thais.cavalcanti@oracle.com",
  "william.m.santos@oracle.com",
  "thiago.francisco@oracle.com",
  "victor.filho@oracle.com",
  "bruno.francisco@oracle.com",
  "carlos.monari@oracle.com",
  "daniel.bastos@oracle.com",
  "gustavo.torres@oracle.com",
  "luiz.stellato@oracle.com",
  "oscar.neto@oracle.com",
  "vitor.t.barbosa@oracle.com",
  "amadeo.cejas@oracle.com",
  "aristides.adame@oracle.com",
  "ernesto.mosqueda@oracle.com",
  "fernanda.arce@oracle.com",
  "ivan.p.romero@oracle.com",
  "aline.panama@oracle.com",
  "dina.trinidad@oracle.com",
  "jose.luis.gonzalez.cruz@oracle.com",
  "laura.contreras@oracle.com",
  "marco.jimenez@oracle.com",
  "maria.r.reyes@oracle.com",
  "martha.galicia@oracle.com",
  "norma.carballo@oracle.com",
  "marcela.delius@oracle.com",
  "alvaro.guauque@oracle.com",
  "camilo.tellez@oracle.com",
  "elena.chaves@oracle.com",
  "felix.galeano.cruz@oracle.com",
  "jonathan.sanabria@oracle.com",
  "mauricio.r.rojas@oracle.com",
  "nestor.santos@oracle.com",
  "ricardo.r.rodriguez@oracle.com",
  "taide.blanco@oracle.com",
  "cecilia.cirigliano@oracle.com",
  "edson.villaizan@oracle.com",
  "esteban.benvenuto@oracle.com",
  "leonardo.muz@oracle.com",
  "nadin.kocuper@oracle.com",
  "nathaly.rodriguez@oracle.com",
  "alexander.l.lopez@oracle.com",
  "alvaro.rueda@oracle.com",
  "andres.falla@oracle.com",
  "carlos.cc.cortes@oracle.com",
  "carolina.guerrero@oracle.com",
  "johana.polania@oracle.com",
  "leonardo.beltran@oracle.com",
  "fabiano.matos@oracle.com",
  "fernando.mendoza@oracle.com",
  "eric.valderrama@oracle.com",
  "felipe.basso@oracle.com",
  "fernando.almeida@oracle.com",
  "javier.avalos@oracle.com",
  "javier.avendano@oracle.com",
  "jorge.peralta@oracle.com",
  "marcio.miyazima@oracle.com",
  "rakesh.dadlani@oracle.com",
  "anderson.a.silva@oracle.com",
  "angelica.o.oliveira@oracle.com",
  "guilherme.raber@oracle.com",
  "leandro.camara@oracle.com",
  "linda.m.martinez@oracle.com",
  "rodrigo.b.reis@oracle.com",
  "sergio.ariza@oracle.com",
  "tayna.salvador@oracle.com",
  "vinicius.aguiar@oracle.com",
  "william.o.oliveira@oracle.com",
  "arturo.a.lopez@oracle.com",
  "gabriel.comenale@oracle.com",
  "helber.marcondes@oracle.com",
  "joao.jo.silva@oracle.com",
  "juan.figueroa@oracle.com",
  "juliana.cambrais@oracle.com",
  "mateo.saravia@oracle.com",
  "matheus.rocha@oracle.com",
  "tiago.priviero@oracle.com",
  "vinicius.fernandes@oracle.com",
  "andrews.s.santos@oracle.com",
  "gustavo.barros@oracle.com",
  "jenner.b.borges@oracle.com",
  "katia.kolling@oracle.com",
  "mairanny.ascanio@oracle.com",
  "mauricio.s.sarai@oracle.com",
  "renato.barros@oracle.com",
  "danilo.a.silva@oracle.com",
  "gabriel.p.carvalho@oracle.com",
  "lucio.rivera@oracle.com",
  "marcio.ventura@oracle.com",
  "miguel.miranda@oracle.com",
  "rodrigo.nunez@oracle.com",
  "ronaldo.silva@oracle.com",
  "daniel.armbrust@oracle.com",
  "ivens.rocha@oracle.com",
  "joao.molina@oracle.com",
  "paulina.bolanos@oracle.com",
  "ricardo.d.carrillo@oracle.com",
  "silvio.da.silva@oracle.com",
  "vinicius.correa@oracle.com",
  "wesley.ellwanger@oracle.com",
  "marcos.julien@oracle.com",
  "agustin.l.lozano@oracle.com",
  "anthoni.almeida@oracle.com",
  "augusto.aguiar@oracle.com",
  "javier.valenzuela@oracle.com",
  "jose.montero@oracle.com",
  "juliana.p.pires@oracle.com",
  "laercio.francisco@oracle.com",
  "raul.i.gonzalez@oracle.com",
  "saulo.p.pereira@oracle.com",
  "tiago.macedo@oracle.com",
];

const allowedEmailSet = new Set(allowedEmails.map((email) => email.toLowerCase()));
const form = document.getElementById("access-form");
const emailInput = document.getElementById("email");
const feedback = document.getElementById("email-feedback");
const recordBtn = document.getElementById("record-btn");
const recordStatus = document.getElementById("record-status");
const timerDisplay = document.getElementById("timer");
const uploadStatus = document.getElementById("upload-status");
const recorderSection = document.querySelector(".recorder");
const yearSpan = document.getElementById("year");

let mediaRecorder;
let mediaStream;
let chunks = [];
let timerInterval;
let elapsedSeconds = 0;
let activeEmail = "";

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

if (!navigator.mediaDevices || typeof MediaRecorder === "undefined") {
  recordBtn.disabled = true;
  recordStatus.textContent =
    "Seu navegador não suporta gravação de áudio. Utilize a versão mais recente do Chrome ou Edge.";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = emailInput.value.trim();
  if (!allowedEmailSet.has(value.toLowerCase())) {
    feedback.textContent =
      "Este e-mail não está autorizado. Verifique se digitou exatamente o endereço corporativo aprovado.";
    feedback.className = "feedback error";
    recordBtn.disabled = true;
    recorderSection.setAttribute("aria-disabled", "true");
    recorderSection.classList.add("is-hidden");
    activeEmail = "";
    return;
  }

  feedback.textContent =
    "E-mail validado com sucesso. Você pode gravar o áudio.";
  feedback.className = "feedback success";
  recordBtn.disabled = false;
  recorderSection.setAttribute("aria-disabled", "false");
  recorderSection.classList.remove("is-hidden");
  recordStatus.textContent =
    "Microfone disponível. Quando estiver pronto, inicie a gravação.";
  activeEmail = value;
});

recordBtn.addEventListener("click", () => {
  if (recordBtn.disabled) return;
  if (!mediaRecorder || mediaRecorder.state === "inactive") {
    startRecording();
  } else if (mediaRecorder.state === "recording") {
    stopRecording();
  }
});

async function startRecording() {
  try {
    recordBtn.disabled = true;
    recordStatus.textContent = "Solicitando acesso ao microfone...";
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(mediaStream);
    chunks = [];
    elapsedSeconds = 0;
    timerDisplay.textContent = "00:00";

    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    });

    mediaRecorder.addEventListener("stop", () => {
      clearInterval(timerInterval);
      timerInterval = null;
      const blob = new Blob(chunks, { type: "audio/webm" });
      timerDisplay.textContent = "00:00";
      recordBtn.textContent = "Iniciar gravação";
      recordBtn.disabled = false;
      recordStatus.textContent = "Processando áudio para upload...";
      uploadAudio(blob);
      stopStream();
    });

    mediaRecorder.start();
    timerInterval = window.setInterval(() => {
      elapsedSeconds += 1;
      timerDisplay.textContent = formatTime(elapsedSeconds);
    }, 1000);

    recordStatus.textContent = "Gravando... Clique para finalizar e enviar.";
    uploadStatus.textContent = "";
    recordBtn.textContent = "Parar e enviar";
    recordBtn.disabled = false;
  } catch (error) {
    recordBtn.disabled = false;
    recordStatus.textContent =
      "Não foi possível acessar o microfone. Verifique as permissões.";
    console.error("Erro ao iniciar gravação", error);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
}

function stopStream() {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }
}

async function uploadAudio(blob) {
  if (!OCI_UPLOAD_URL) {
    uploadStatus.textContent =
      "Configure o OCI_UPLOAD_URL no config.js ou via variável de ambiente para habilitar o upload.";
    uploadStatus.className = "upload-status error";
    return;
  }

  const fileName = `${FILE_PREFIX}-${Date.now()}.webm`;
  const formData = new FormData();
  formData.append("file", blob, fileName);
  formData.append("uploaderEmail", activeEmail);

  uploadStatus.textContent = "Enviando áudio com POST seguro para o bucket...";
  uploadStatus.className = "upload-status";

  try {
    const response = await fetch(
      `${OCI_UPLOAD_URL}${encodeURIComponent(fileName)}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Falha no upload: ${response.status}`);
    }

    uploadStatus.textContent = "Upload concluído com sucesso!";
    uploadStatus.className = "upload-status success";
    recordStatus.textContent =
      "Áudio entregue. Você pode gravar novamente se desejar.";
  } catch (error) {
    console.error("Erro no upload", error);
    uploadStatus.textContent =
      "Não foi possível enviar o áudio. Tente novamente.";
    uploadStatus.className = "upload-status error";
    recordStatus.textContent = "Ocorreu um erro durante o upload.";
  }
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}
