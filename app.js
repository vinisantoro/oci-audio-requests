// Configurações sensíveis agora estão no backend (Serverless Functions)
// A lista de emails e OCI_UPLOAD_URL não são mais expostas no frontend
const form = document.getElementById("access-form");
const emailStep = document.getElementById("email-step");
const emailSummary = document.getElementById("email-summary");
const activeEmailLabel = document.getElementById("active-email-label");
const emailInput = document.getElementById("email");
const feedback = document.getElementById("email-feedback");
const recordBtn = document.getElementById("record-btn");
const recordStatus = document.getElementById("record-status");
const timerDisplay = document.getElementById("timer");
const uploadStatus = document.getElementById("upload-status");
const recorderSection = document.querySelector(".recorder");
const recordBtnLabel = document.getElementById("record-btn-label");
const sendBtn = document.getElementById("send-btn");
const sendBtnLabel = document.getElementById("send-btn-label");
const previewPanel = document.getElementById("preview-panel");
const previewAudio = document.getElementById("preview-audio");
const yearSpan = document.getElementById("year");

let mediaRecorder;
let mediaStream;
let chunks = [];
let timerInterval;
let elapsedSeconds = 0;
let activeEmail = "";
let lastAudioUrl = "";
let latestBlob = null;

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

if (!navigator.mediaDevices || typeof MediaRecorder === "undefined") {
  recordBtn.disabled = true;
  recordStatus.textContent =
    "Seu navegador não suporta gravação de áudio. Utilize a versão mais recente do Chrome ou Edge.";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const value = emailInput.value.trim();
  
  if (!value) {
    feedback.textContent = "Por favor, informe um e-mail.";
    feedback.className = "feedback error";
    return;
  }

  // Desabilitar botão durante validação
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Validando...";
  }
  feedback.textContent = "Validando e-mail...";
  feedback.className = "feedback";

  try {
    const response = await fetch("/api/validate-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: value }),
    });

    const data = await response.json();

    if (data.valid) {
      feedback.textContent =
        "E-mail validado com sucesso. Você pode gravar o áudio.";
      feedback.className = "feedback success";
      activeEmail = value;
      revealRecorder();
    } else {
      const errorMessage = data.error || 
        "Este e-mail não está autorizado. Verifique se digitou exatamente o endereço corporativo aprovado.";
      feedback.textContent = errorMessage;
      feedback.className = "feedback error";
      showErrorToast(errorMessage);
      recordBtn.disabled = true;
      if (sendBtn) {
        sendBtn.disabled = true;
      }
      recorderSection.setAttribute("aria-disabled", "true");
      recorderSection.classList.add("is-hidden");
      resetPreview();
      showEmailForm();
      activeEmail = "";
    }
  } catch (error) {
    console.error("Erro na validação:", error);
    const errorMessage = "Erro ao validar e-mail. Tente novamente.";
    feedback.textContent = errorMessage;
    feedback.className = "feedback error";
    showErrorToast(errorMessage);
    recordBtn.disabled = true;
    if (sendBtn) {
      sendBtn.disabled = true;
    }
    recorderSection.setAttribute("aria-disabled", "true");
    recorderSection.classList.add("is-hidden");
    resetPreview();
    showEmailForm();
    activeEmail = "";
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Validar";
    }
  }
});

recordBtn.addEventListener("click", () => {
  if (recordBtn.disabled) return;
  if (!mediaRecorder || mediaRecorder.state === "inactive") {
    startRecording();
  } else if (mediaRecorder.state === "recording") {
    stopRecording();
  }
});

  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      if (sendBtn.disabled) return;
      if (!latestBlob) {
        showErrorToast("Grave um áudio antes de tentar enviar.");
        return;
      }
      uploadAudio(latestBlob);
    });
  }

async function startRecording() {
  try {
    resetPreview();
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
      latestBlob = blob;
      updatePreview(blob);
      timerDisplay.textContent = "00:00";
      setRecordButtonLabel("Iniciar gravação");
      recordBtn.disabled = false;
      recordStatus.textContent =
        "Pré-escute o áudio e clique em Enviar quando estiver tudo certo.";
      if (sendBtn) {
        sendBtn.disabled = false;
        setSendButtonLabel("Enviar gravação");
      }
      stopStream();
    });

    mediaRecorder.start();
    timerInterval = window.setInterval(() => {
      elapsedSeconds += 1;
      timerDisplay.textContent = formatTime(elapsedSeconds);
    }, 1000);

    recordStatus.textContent = "Gravando... Clique para finalizar e enviar.";
    uploadStatus.textContent = "";
    setRecordButtonLabel("Parar e revisar");
    recordBtn.disabled = false;
    if (sendBtn) {
      sendBtn.disabled = true;
    }
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
  if (!blob) {
    showErrorToast("Não há áudio disponível para envio. Grave um novo arquivo.");
    return;
  }

  if (!activeEmail) {
    showErrorToast("E-mail não validado. Por favor, valide seu e-mail primeiro.");
    return;
  }

  uploadStatus.textContent = "Preparando upload...";
  uploadStatus.className = "upload-status";
  if (sendBtn) {
    sendBtn.disabled = true;
    setSendButtonLabel("Enviando...");
  }

  try {
    // Primeiro, obter a URL de upload do PAR (valida email no backend)
    const urlResponse = await fetch("/api/get-upload-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: activeEmail }),
    });

    const urlData = await urlResponse.json();

    if (!urlResponse.ok) {
      throw new Error(urlData.error || `Falha ao obter URL de upload: ${urlResponse.status}`);
    }

    // Agora fazer upload direto para OCI (sem passar pelo servidor Vercel)
    uploadStatus.textContent = "Enviando gravação para o bucket OCI...";
    
    const uploadResponse = await fetch(urlData.uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": blob.type || "application/octet-stream",
        "x-object-meta-uploader-email": urlData.email,
      },
      body: blob,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text().catch(() => 'Erro desconhecido');
      throw new Error(`Falha no upload para OCI: ${uploadResponse.status}`);
    }

    recordStatus.textContent =
      "Áudio entregue. Você pode gravar novamente se desejar.";
    uploadStatus.textContent = "";
    uploadStatus.className = "upload-status";
    resetPreview();
    showSuccessToast("Gravação enviada com sucesso para o bucket OCI.");
    if (sendBtn) {
      sendBtn.disabled = true;
      setSendButtonLabel("Enviar gravação");
    }
  } catch (error) {
    console.error("Erro no upload", error);
    const errorMessage = error.message || "Não foi possível enviar o áudio. Tente novamente.";
    recordStatus.textContent = "Ocorreu um erro durante o upload.";
    uploadStatus.textContent = "";
    uploadStatus.className = "upload-status";
    showErrorToast(errorMessage);
    if (sendBtn) {
      sendBtn.disabled = false;
      setSendButtonLabel("Enviar gravação");
    }
  }
}

// Função blobToBase64 removida - envio direto do blob via fetch

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

// Função buildUploadUrl removida - upload agora é feito via API backend

function updatePreview(blob) {
  if (!previewPanel || !previewAudio || !blob) {
    return;
  }

  if (lastAudioUrl) {
    URL.revokeObjectURL(lastAudioUrl);
    lastAudioUrl = "";
  }

  lastAudioUrl = URL.createObjectURL(blob);
  previewAudio.src = lastAudioUrl;
  previewAudio.load();
  previewPanel.classList.remove("is-hidden");
}

function resetPreview() {
  if (lastAudioUrl) {
    URL.revokeObjectURL(lastAudioUrl);
    lastAudioUrl = "";
  }

  if (previewAudio) {
    previewAudio.pause();
    previewAudio.removeAttribute("src");
    previewAudio.load();
  }

  if (previewPanel && !previewPanel.classList.contains("is-hidden")) {
    previewPanel.classList.add("is-hidden");
  }

  latestBlob = null;
}

window.addEventListener("beforeunload", resetPreview);

function setRecordButtonLabel(label) {
  if (recordBtnLabel) {
    recordBtnLabel.textContent = label;
  } else {
    recordBtn.textContent = label;
  }
}

function setSendButtonLabel(label) {
  if (sendBtnLabel) {
    sendBtnLabel.textContent = label;
  } else if (sendBtn) {
    sendBtn.textContent = label;
  }
}

function revealRecorder() {
  if (emailStep) {
    emailStep.classList.add("is-hidden");
  }
  if (emailSummary) {
    emailSummary.classList.remove("is-hidden");
  }
  if (activeEmailLabel) {
    activeEmailLabel.textContent = activeEmail;
  }

  recordBtn.disabled = false;
  recorderSection.setAttribute("aria-disabled", "false");
  recorderSection.classList.remove("is-hidden");
  recordStatus.textContent =
    "Microfone disponível. Quando estiver pronto, inicie a gravação.";
  setRecordButtonLabel("Iniciar gravação");
  if (sendBtn) {
    sendBtn.disabled = true;
    setSendButtonLabel("Enviar gravação");
  }
}

function showEmailForm() {
  if (emailStep) {
    emailStep.classList.remove("is-hidden");
  }
  if (emailSummary) {
    emailSummary.classList.add("is-hidden");
  }
  recorderSection.setAttribute("aria-disabled", "true");
  recorderSection.classList.add("is-hidden");
  emailInput.value = "";
  feedback.textContent = "";
  activeEmail = "";
  recordStatus.textContent = "Aguardando validação do e-mail.";
  uploadStatus.textContent = "";
  setRecordButtonLabel("Iniciar gravação");
  if (sendBtn) {
    sendBtn.disabled = true;
    setSendButtonLabel("Enviar gravação");
  }
}

function generateFileName(emailAddress) {
  const base = (emailAddress || "oracle-user").toLowerCase();
  const safeEmail = base.replace(/[^a-z0-9._-]/g, "-");
  return `${safeEmail}-${Date.now()}.webm`;
}

function showSuccessToast(message) {
  if (!message) return;
  
  // Criar elemento de toast se não existir
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.className = "toast toast-success";
  toast.style.display = "block";
  
  // Trigger reflow para animação
  void toast.offsetWidth;
  toast.classList.add("show");
  
  // Remover após 5 segundos
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.style.display = "none";
    }, 300); // Aguardar animação de saída
  }, 5000);
}

function showErrorToast(message) {
  if (!message) return;
  
  // Criar elemento de toast se não existir
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.className = "toast toast-error";
  toast.style.display = "block";
  
  // Trigger reflow para animação
  void toast.offsetWidth;
  toast.classList.add("show");
  
  // Remover após 5 segundos
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.style.display = "none";
    }, 300); // Aguardar animação de saída
  }, 5000);
}
