export function installGuidance(userAgent = '', platform = '', maxTouchPoints = 0) {
  if (/iPad|iPhone|iPod/.test(userAgent) || (platform === 'MacIntel' && maxTouchPoints > 1)) return 'To install on iPhone or iPad, use Share, then Add to Home Screen.';
  if (/Macintosh/.test(userAgent) && /Safari/.test(userAgent) && !/Chrome|Chromium|Edg/.test(userAgent)) return 'To install in Safari, choose File, then Add to Dock.';
  return '';
}

export function startOfflineAppLifecycle({ windowRef = window, documentRef = document } = {}) {
  const navigatorRef = windowRef.navigator;
  const installButton = documentRef.getElementById('installbtn');
  const installHelp = documentRef.getElementById('installhelp');
  const updateBanner = documentRef.getElementById('updatebanner');
  const restartButton = documentRef.getElementById('restartupdate');
  let deferredPrompt = null;
  let waitingWorker = null;
  let reloadForUpdate = false;

  const guidance = installGuidance(navigatorRef.userAgent || '', navigatorRef.platform || '', navigatorRef.maxTouchPoints || 0);
  if (guidance && installHelp) {
    installHelp.hidden = false;
    installHelp.textContent = guidance;
  }

  windowRef.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    if (installButton) installButton.hidden = false;
  });
  installButton?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    installButton.hidden = true;
    await deferredPrompt.prompt();
    deferredPrompt = null;
  });

  const showWaitingUpdate = worker => {
    waitingWorker = worker;
    if (updateBanner) updateBanner.hidden = false;
  };
  restartButton?.addEventListener('click', () => {
    if (!waitingWorker) return;
    reloadForUpdate = true;
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  });

  if (!navigatorRef.serviceWorker) return { registration: Promise.resolve(null) };
  const registration = navigatorRef.serviceWorker.register('./service-worker.js').then(value => {
    if (value.waiting) showWaitingUpdate(value.waiting);
    value.addEventListener('updatefound', () => {
      const worker = value.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigatorRef.serviceWorker.controller) showWaitingUpdate(value.waiting || worker);
      });
    });
    return value;
  }).catch(() => null);
  navigatorRef.serviceWorker.addEventListener('controllerchange', () => {
    if (reloadForUpdate) windowRef.location.reload();
  });
  return { registration };
}
