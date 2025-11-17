const OCI_UPLOAD_URL = window.OCI_UPLOAD_URL || 'https://objectstorage.<regiao>.oraclecloud.com/p/<par-id>/?filename=';
const FILE_PREFIX = 'oci-audio-request';

const emailPattern = /^[A-Za-z0-9._%+-]+@oracle\.com$/i;
const form = document.getElementById('access-form');
const emailInput = document.getElementById('email');
const feedback = document.getElementById('email-feedback');
const recordBtn = document.getElementById('record-btn');
const recordStatus = document.getElementById('record-status');
const timerDisplay = document.getElementById('timer');
const uploadStatus = document.getElementById('upload-status');
const recorderSection = document.querySelector('.recorder');
const yearSpan = document.getElementById('year');

let mediaRecorder;
let mediaStream;
let chunks = [];
let timerInterval;
let elapsedSeconds = 0;
let activeEmail = '';

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

if (!navigator.mediaDevices || typeof MediaRecorder === 'undefined') {
  recordBtn.disabled = true;
  recordStatus.textContent = 'Seu navegador não suporta gravação de áudio. Utilize a versão mais recente do Chrome ou Edge.';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = emailInput.value.trim();
  if (!emailPattern.test(value)) {
    feedback.textContent = 'Use apenas um endereço corporativo @oracle.com.';
    feedback.className = 'feedback error';
    recordBtn.disabled = true;
    recorderSection.setAttribute('aria-disabled', 'true');
    recorderSection.classList.add('is-hidden');
    activeEmail = '';
    return;
  }

  feedback.textContent = 'E-mail validado com sucesso. Você pode gravar o áudio.';
  feedback.className = 'feedback success';
  recordBtn.disabled = false;
  recorderSection.setAttribute('aria-disabled', 'false');
  recorderSection.classList.remove('is-hidden');
  recordStatus.textContent = 'Microfone disponível. Quando estiver pronto, inicie a gravação.';
  activeEmail = value;
});

recordBtn.addEventListener('click', () => {
  if (recordBtn.disabled) return;
  if (!mediaRecorder || mediaRecorder.state === 'inactive') {
    startRecording();
  } else if (mediaRecorder.state === 'recording') {
    stopRecording();
  }
});

async function startRecording() {
  try {
    recordBtn.disabled = true;
    recordStatus.textContent = 'Solicitando acesso ao microfone...';
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(mediaStream);
    chunks = [];
    elapsedSeconds = 0;
    timerDisplay.textContent = '00:00';

    mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    });

    mediaRecorder.addEventListener('stop', () => {
      clearInterval(timerInterval);
      timerInterval = null;
      const blob = new Blob(chunks, { type: 'audio/webm' });
      timerDisplay.textContent = '00:00';
      recordBtn.textContent = 'Iniciar gravação';
      recordBtn.disabled = false;
      recordStatus.textContent = 'Processando áudio para upload...';
      uploadAudio(blob);
      stopStream();
    });

    mediaRecorder.start();
    timerInterval = window.setInterval(() => {
      elapsedSeconds += 1;
      timerDisplay.textContent = formatTime(elapsedSeconds);
    }, 1000);

    recordStatus.textContent = 'Gravando... Clique para finalizar e enviar.';
    uploadStatus.textContent = '';
    recordBtn.textContent = 'Parar e enviar';
    recordBtn.disabled = false;
  } catch (error) {
    recordBtn.disabled = false;
    recordStatus.textContent = 'Não foi possível acessar o microfone. Verifique as permissões.';
    console.error('Erro ao iniciar gravação', error);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
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
  if (!OCI_UPLOAD_URL || OCI_UPLOAD_URL.includes('<par-id>')) {
    uploadStatus.textContent = 'Configure o OCI_UPLOAD_URL com o endpoint de POST do bucket pre-autenticado.';
    uploadStatus.className = 'upload-status error';
    return;
  }

  const fileName = `${FILE_PREFIX}-${Date.now()}.webm`;
  const formData = new FormData();
  formData.append('file', blob, fileName);
  formData.append('uploaderEmail', activeEmail);

  uploadStatus.textContent = 'Enviando áudio com POST seguro para o bucket...';
  uploadStatus.className = 'upload-status';

  try {
    const response = await fetch(`${OCI_UPLOAD_URL}${encodeURIComponent(fileName)}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Falha no upload: ${response.status}`);
    }

    uploadStatus.textContent = 'Upload concluído com sucesso!';
    uploadStatus.className = 'upload-status success';
    recordStatus.textContent = 'Áudio entregue. Você pode gravar novamente se desejar.';
  } catch (error) {
    console.error('Erro no upload', error);
    uploadStatus.textContent = 'Não foi possível enviar o áudio. Tente novamente.';
    uploadStatus.className = 'upload-status error';
    recordStatus.textContent = 'Ocorreu um erro durante o upload.';
  }
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}
