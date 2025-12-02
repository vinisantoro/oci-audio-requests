let deferredPrompt;
let installPrompt = document.getElementById('install-prompt');
let installBtn = document.getElementById('install-btn');
let dismissBtn = document.getElementById('dismiss-install');

function shouldShowInstallPrompt() {
  const dismissed = localStorage.getItem('pwa-install-dismissed');
  if (!dismissed) return true;
  
  const dismissedTime = parseInt(dismissed, 10);
  const dayInMs = 24 * 60 * 60 * 1000;
  return Date.now() - dismissedTime > dayInMs;
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true ||
         document.referrer.includes('android-app://');
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

window.addEventListener('beforeinstallprompt', (e) => {
  deferredPrompt = e;
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) {
      showInstallInstructions();
      return;
    }

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    if (installPrompt) {
      installPrompt.classList.add('is-hidden');
    }
  });
}

if (dismissBtn) {
  dismissBtn.addEventListener('click', () => {
    if (installPrompt) {
      installPrompt.classList.add('is-hidden');
    }
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  });
}

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  if (installPrompt) {
    installPrompt.classList.add('is-hidden');
  }
});

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

if (isStandalone()) {
  if (installPrompt) {
    installPrompt.classList.add('is-hidden');
  }
} else if (shouldShowInstallPrompt()) {
  setTimeout(() => {
    if (deferredPrompt && installPrompt && installPrompt.classList.contains('is-hidden')) {
      installPrompt.classList.remove('is-hidden');
      void installPrompt.offsetWidth;
      installPrompt.classList.add('show');
    }
  }, 3000);
}

