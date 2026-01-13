const emailStep = document.getElementById("email-step");
const emailSummary = document.getElementById("email-summary");
const activeEmailLabel = document.getElementById("active-email-label");
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
let currentUser = null;
let lastAudioUrl = "";
let latestBlob = null;

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

if (!navigator.mediaDevices || typeof MediaRecorder === "undefined") {
  if (recordBtn) {
    recordBtn.disabled = true;
  }
  if (recordStatus) {
    recordStatus.textContent =
      "Seu navegador não suporta gravação de áudio. Utilize a versão mais recente do Chrome ou Edge.";
  }
}

/**
 * Check authentication status
 */
async function checkAuthStatus() {
  try {
    const response = await fetch("/api/auth/status", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    if (data.authenticated && data.user) {
      currentUser = data.user;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking auth status:", error);
    return false;
  }
}

/**
 * Initiate SSO login (OIDC)
 */
function initiateSSOLogin() {
  window.location.href = "/api/auth/login";
}

/**
 * Handle logout (OIDC)
 */
async function handleLogout() {
  try {
    await fetch("/api/auth/logout", {
      method: "GET",
      credentials: "include",
    });
    
    currentUser = null;
    showEmailForm();
    showSuccessToast("Logout realizado com sucesso.");
  } catch (error) {
    console.error("Logout error:", error);
    // Still clear local state
    currentUser = null;
    showEmailForm();
  }
}

/**
 * Initialize application
 */
async function init() {
  const isAuthenticated = await checkAuthStatus();
  
  if (isAuthenticated) {
    revealRecorder();
    if (activeEmailLabel && currentUser) {
      activeEmailLabel.textContent = currentUser.email;
    }
  } else {
    // Check if we're coming back from OIDC callback (URL might have params)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("code") || urlParams.has("error") || window.location.pathname.includes("callback")) {
      // Wait a bit for cookie to be set, then check again
      setTimeout(async () => {
        const authenticated = await checkAuthStatus();
        if (authenticated) {
          revealRecorder();
          // Clean URL (remove OAuth params)
          window.history.replaceState({}, document.title, '/');
        } else {
          // Check for error in URL
          if (urlParams.has("error")) {
            const error = urlParams.get("error");
            const details = urlParams.get("details");
            let errorMessage = `Erro na autenticação: ${decodeURIComponent(error)}`;
            
            if (error === 'missing_parameters') {
              errorMessage += '. O OCI Domain não está enviando os parâmetros necessários (code, state). Verifique a configuração do Redirect URI na aplicação OCI Domain.';
              if (details) {
                errorMessage += ` Detalhes: ${decodeURIComponent(details)}`;
              }
            }
            
            console.error('Authentication error:', error, details);
            showErrorToast(errorMessage);
            // Clean URL after showing error
            window.history.replaceState({}, document.title, '/');
          }
          showLoginPrompt();
        }
      }, 500);
    } else {
      showLoginPrompt();
    }
  }
}

/**
 * Show login prompt
 */
function showLoginPrompt() {
  if (emailStep) {
    emailStep.classList.remove("is-hidden");
    
    // Replace form content with SSO login button
    const form = document.getElementById("access-form");
    if (form) {
      form.innerHTML = `
        <div style="text-align: center;">
          <p class="lead" style="margin-bottom: 1.5rem;">
            Por segurança, apenas colaboradores autenticados via SSO corporativo podem enviar áudios.
          </p>
          <button type="button" id="sso-login-btn" class="primary" style="width: 100%; max-width: 300px;">
            Entrar com SSO Corporativo
          </button>
        </div>
        <p id="email-feedback" class="feedback" role="status"></p>
      `;
      
      const ssoBtn = document.getElementById("sso-login-btn");
      if (ssoBtn) {
        ssoBtn.addEventListener("click", initiateSSOLogin);
      }
    }
  }
  
  if (recorderSection) {
    recorderSection.setAttribute("aria-disabled", "true");
    recorderSection.classList.add("is-hidden");
  }
  
  if (recordStatus) {
    recordStatus.textContent = "Aguardando autenticação SSO.";
  }
}

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
    if (recordStatus) {
      recordStatus.textContent = "Solicitando acesso ao microfone...";
    }
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(mediaStream);
    chunks = [];
    elapsedSeconds = 0;
    if (timerDisplay) {
      timerDisplay.textContent = "00:00";
    }

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
      if (timerDisplay) {
        timerDisplay.textContent = "00:00";
      }
      setRecordButtonLabel("Iniciar gravação");
      recordBtn.disabled = false;
      if (recordStatus) {
        recordStatus.textContent =
          "Pré-escute o áudio e clique em Enviar quando estiver tudo certo.";
      }
      if (sendBtn) {
        sendBtn.disabled = false;
        setSendButtonLabel("Enviar gravação");
      }
      stopStream();
    });

    mediaRecorder.start();
    timerInterval = window.setInterval(() => {
      elapsedSeconds += 1;
      if (timerDisplay) {
        timerDisplay.textContent = formatTime(elapsedSeconds);
      }
    }, 1000);

    if (recordStatus) {
      recordStatus.textContent = "Gravando... Clique para finalizar e enviar.";
    }
    if (uploadStatus) {
      uploadStatus.textContent = "";
    }
    setRecordButtonLabel("Parar e revisar");
    recordBtn.disabled = false;
    if (sendBtn) {
      sendBtn.disabled = true;
    }
  } catch (error) {
    recordBtn.disabled = false;
    if (recordStatus) {
      recordStatus.textContent =
        "Não foi possível acessar o microfone. Verifique as permissões.";
    }
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

  if (!currentUser) {
    showErrorToast("Sessão expirada. Por favor, faça login novamente.");
    await checkAuthStatus();
    if (!currentUser) {
      showLoginPrompt();
      return;
    }
  }

  if (uploadStatus) {
    uploadStatus.textContent = "Preparando upload...";
    uploadStatus.className = "upload-status";
  }
  if (sendBtn) {
    sendBtn.disabled = true;
    setSendButtonLabel("Enviando...");
  }

  try {
    const urlResponse = await fetch("/api/get-upload-url", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const contentType = urlResponse.headers.get('content-type');
    let urlData;
    
    if (contentType && contentType.includes('application/json')) {
      try {
        urlData = await urlResponse.json();
      } catch (jsonError) {
        const errorText = await urlResponse.text().catch(() => 'Resposta inválida do servidor');
        throw new Error(`Erro ao processar resposta JSON: ${errorText.substring(0, 100)}`);
      }
    } else {
      const errorText = await urlResponse.text().catch(() => 'Resposta inválida do servidor');
      throw new Error(`Servidor retornou resposta não-JSON (${urlResponse.status}): ${errorText.substring(0, 200)}`);
    }

    if (!urlResponse.ok) {
      if (urlResponse.status === 401) {
        // Session expired
        currentUser = null;
        showLoginPrompt();
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
      throw new Error(urlData?.error || `Falha ao obter URL de upload: ${urlResponse.status}`);
    }

    if (!urlData.uploadUrl) {
      throw new Error('URL de upload não retornada pelo servidor');
    }

    if (uploadStatus) {
      uploadStatus.textContent = "Enviando gravação para o bucket OCI...";
    }
    
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
      throw new Error(`Falha no upload para OCI: ${uploadResponse.status} - ${errorText}`);
    }

    if (recordStatus) {
      recordStatus.textContent =
        "Áudio entregue. Você pode gravar novamente se desejar.";
    }
    if (uploadStatus) {
      uploadStatus.textContent = "";
      uploadStatus.className = "upload-status";
    }
    resetPreview();
    showSuccessToast("Gravação enviada com sucesso para o bucket OCI.");
    if (sendBtn) {
      sendBtn.disabled = true;
      setSendButtonLabel("Enviar gravação");
    }
  } catch (error) {
    const errorMessage = error.message || "Não foi possível enviar o áudio. Tente novamente.";
    if (recordStatus) {
      recordStatus.textContent = "Ocorreu um erro durante o upload.";
    }
    if (uploadStatus) {
      uploadStatus.textContent = "";
      uploadStatus.className = "upload-status";
    }
    showErrorToast(errorMessage);
    if (sendBtn) {
      sendBtn.disabled = false;
      setSendButtonLabel("Enviar gravação");
    }
  }
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

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
  } else if (recordBtn) {
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
  if (activeEmailLabel && currentUser) {
    activeEmailLabel.textContent = currentUser.email;
  }

  if (recordBtn) {
    recordBtn.disabled = false;
  }
  if (recorderSection) {
    recorderSection.setAttribute("aria-disabled", "false");
    recorderSection.classList.remove("is-hidden");
  }
  if (recordStatus) {
    recordStatus.textContent =
      "Microfone disponível. Quando estiver pronto, inicie a gravação.";
  }
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
  if (recorderSection) {
    recorderSection.setAttribute("aria-disabled", "true");
    recorderSection.classList.add("is-hidden");
  }
  if (recordStatus) {
    recordStatus.textContent = "Aguardando autenticação SSO.";
  }
  if (uploadStatus) {
    uploadStatus.textContent = "";
  }
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
  
  void toast.offsetWidth;
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.style.display = "none";
    }, 300);
  }, 5000);
}

function showErrorToast(message) {
  if (!message) return;
  
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
  
  void toast.offsetWidth;
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.style.display = "none";
    }, 300);
  }, 5000);
}

/**
 * Initialize info section toggles (Política de Uso and Como Usar)
 */
function initInfoSections() {
  const toggles = document.querySelectorAll('.info-section-toggle');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
    });
  });
}

// Logout button handler
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Initialize info sections
  initInfoSections();
});

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
