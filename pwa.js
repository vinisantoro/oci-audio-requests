// PWA - Service Worker e Instalação
let deferredPrompt;
let installPrompt = document.getElementById('install-prompt');
let installBtn = document.getElementById('install-btn');
let dismissBtn = document.getElementById('dismiss-install');

// Verificar se já foi dispensado recentemente (últimas 24h)
function shouldShowInstallPrompt() {
  const dismissed = localStorage.getItem('pwa-install-dismissed');
  if (!dismissed) return true;
  
  const dismissedTime = parseInt(dismissed, 10);
  const dayInMs = 24 * 60 * 60 * 1000;
  return Date.now() - dismissedTime > dayInMs;
}

// Verificar se está em modo standalone (já instalado)
function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true ||
         document.referrer.includes('android-app://');
}

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration.scope);
      })
      .catch((error) => {
        console.log('Falha ao registrar Service Worker:', error);
      });
  });
}

// Detectar evento de instalação (antes do prompt nativo)
window.addEventListener('beforeinstallprompt', (e) => {
  // Guardar o evento para usar depois
  deferredPrompt = e;
  
  // Não prevenir o prompt nativo por padrão
  // Deixar o navegador mostrar o banner nativo automaticamente
  // O prompt customizado só será mostrado se o usuário clicar no botão de instalação
});

// Botão de instalação
if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) {
      // Se não tiver deferredPrompt, tentar método alternativo
      showInstallInstructions();
      return;
    }

    // Mostrar o prompt de instalação
    deferredPrompt.prompt();
    
    // Aguardar resposta do usuário
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuário aceitou a instalação');
    } else {
      console.log('Usuário rejeitou a instalação');
    }
    
    // Limpar o prompt
    deferredPrompt = null;
    if (installPrompt) {
      installPrompt.classList.add('is-hidden');
    }
  });
}

// Botão de dispensar
if (dismissBtn) {
  dismissBtn.addEventListener('click', () => {
    if (installPrompt) {
      installPrompt.classList.add('is-hidden');
    }
    // Salvar preferência (opcional - usar localStorage)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  });
}

// Verificar se já está instalado
window.addEventListener('appinstalled', () => {
  console.log('PWA instalado com sucesso');
  deferredPrompt = null;
  if (installPrompt) {
    installPrompt.classList.add('is-hidden');
  }
});

// Mostrar instruções de instalação manual
function showInstallInstructions() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  
  let message = '';
  
  if (isIOS) {
    message = 'Para instalar no iOS:\n1. Toque no botão de compartilhar\n2. Selecione "Adicionar à Tela de Início"';
  } else if (isAndroid) {
    message = 'Para instalar no Android:\n1. Toque no menu (3 pontos)\n2. Selecione "Adicionar à tela inicial" ou "Instalar app"';
  } else {
    message = 'Use o menu do navegador para instalar este app.';
  }
  
  alert(message);
}

// Inicializar
if (isStandalone()) {
  // Já está instalado, esconder prompt
  if (installPrompt) {
    installPrompt.classList.add('is-hidden');
  }
} else if (shouldShowInstallPrompt()) {
  // O prompt será mostrado quando o evento beforeinstallprompt for disparado
  // ou podemos mostrar após alguns segundos se não houver prompt nativo
  setTimeout(() => {
    if (deferredPrompt && installPrompt && installPrompt.classList.contains('is-hidden')) {
      installPrompt.classList.remove('is-hidden');
      void installPrompt.offsetWidth;
      installPrompt.classList.add('show');
    }
  }, 3000);
}

