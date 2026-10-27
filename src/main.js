let FaceLandmarker;
let FilesetResolver;

const icon = (name, size = 18) => {
  const icons = {
    scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><circle cx="12" cy="10" r="3"/><path d="M7 20v-1a5 5 0 0 1 10 0v1"/>',
    camera: '<path d="M14 4h-4l-2 3H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2-3Z"/><circle cx="12" cy="13" r="3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
    shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    close: '<path d="m18 6-12 12M6 6l12 12"/>',
    spark: '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] ?? ''}</svg>`;
};

document.querySelector('#app').innerHTML = `
  <div class="app-shell">
    <aside class="sidebar">
      <a class="brand" href="#" aria-label="Visão Facial início"><span class="brand-icon">${icon('scan', 21)}</span><span>visão<span class="brand-light">facial</span></span></a>
      <div class="workspace-label">WORKSPACE</div>
      <div class="workspace-switch"><span class="workspace-avatar">VF</span><span class="workspace-name">Projeto pessoal<small>Plano gratuito</small></span><span class="workspace-caret">⌄</span></div>
      <div class="side-divider"></div>
      <div class="side-section-label">FERRAMENTAS</div>
      <button class="nav-item active">${icon('scan')}<span>Detecção facial</span><span class="nav-dot"></span></button>
      <div class="side-divider side-divider-lower"></div>
      <div class="side-section-label">SEU PROJETO</div>
      <div class="project-note">O reconhecimento é feito localmente no seu navegador. Nenhuma imagem é enviada para um servidor.</div>
      <div class="sidebar-bottom"><div class="privacy-icon">${icon('shield', 16)}</div><div><strong>Seus dados ficam seguros</strong><span>Processamento local · MediaPipe</span></div></div>
    </aside>

    <main class="main-content">
      <header class="topbar"><div class="breadcrumb">Visão geral ${icon('chevron', 15)} <strong>Detecção facial</strong></div><div class="topbar-right"><span class="engine-chip"><span class="online-dot"></span> MediaPipe pronto</span><div class="top-avatar">M</div></div></header>
      <section class="page-content">
        <div class="page-heading"><div><div class="eyebrow"><span class="eyebrow-line"></span> FERRAMENTA DE VISÃO COMPUTACIONAL</div><h1>Detecção facial</h1><p class="page-subtitle">Marque olhos, nariz, boca e contorno facial em tempo real, direto no seu navegador.</p></div><div class="heading-badge">${icon('spark', 16)}<span>Desenvolvido com <strong>MediaPipe</strong></span></div></div>

        <div class="workspace-grid">
          <section class="viewer-card"><div class="viewer-top"><div class="viewer-title"><span class="viewer-title-icon">${icon('scan', 17)}</span><div><h2>Área de reconhecimento</h2><span>Pré-visualização da câmera ou imagem</span></div></div><div class="live-state"><span class="status-light" id="status-light"></span><span id="status-label">Aguardando início</span></div></div>
            <div class="stage-wrap"><div class="stage" id="stage"><div class="stage-grid"></div><div class="stage-corner corner-tl"></div><div class="stage-corner corner-tr"></div><div class="stage-corner corner-bl"></div><div class="stage-corner corner-br"></div><video id="video" autoplay playsinline muted></video><img id="preview" alt="Imagem selecionada para detecção facial" /><canvas id="overlay"></canvas><div class="empty-state" id="empty-state"><div class="empty-illustration"><span class="illustration-ring ring-one"></span><span class="illustration-ring ring-two"></span><span class="face-outline">${icon('scan', 40)}</span><span class="illustration-spark spark-a">✳</span><span class="illustration-spark spark-b">✳</span></div><h3>Sua área de detecção está pronta</h3><p>Inicie sua câmera ou envie uma imagem<br/>para marcar os pontos no rosto.</p><span class="empty-hint">PROCESSAMENTO SEGURO E LOCAL</span></div><div class="stage-overlay-label" id="stage-label">LIVE PREVIEW</div><div class="face-count" id="face-count" hidden><span class="count-pulse"></span><span id="count-value">0 rostos encontrados</span></div><div class="scanline" id="scanline"></div></div></div>
            <div class="viewer-footer"><div class="source-label"><span class="source-dot"></span><span id="source-text">Nenhuma fonte selecionada</span></div><div class="resolution" id="resolution">— × —</div></div>
          </section>

          <aside class="controls-column"><section class="control-card"><div class="card-heading"><div><span class="section-kicker">CONFIGURAÇÃO</span><h2>Fonte de imagem</h2></div><span class="step-number">01</span></div><button class="primary-action" id="camera-btn">${icon('camera', 18)}<span>Ativar câmera</span><span class="button-arrow">${icon('chevron', 16)}</span></button><button class="secondary-action" id="upload-btn">${icon('upload', 17)}<span>Enviar uma imagem</span></button><input type="file" id="file-input" accept="image/*" hidden/><div class="separator"><span>ou use um exemplo</span></div><button class="sample-btn" id="sample-btn"><span class="sample-thumb">${icon('image', 17)}</span><span class="sample-copy"><strong>Imagem de demonstração</strong><small>Veja como a detecção funciona</small></span>${icon('chevron', 16)}</button></section>
            <section class="results-card"><div class="card-heading result-heading"><div><span class="section-kicker">ANÁLISE</span><h2>Resultados</h2></div><span class="result-live" id="result-state"><span></span> INATIVO</span></div><div class="result-stat"><span class="stat-icon">${icon('scan', 17)}</span><div><span class="stat-label">Rostos detectados</span><strong id="faces-stat">—</strong></div><span class="stat-meta" id="faces-meta">Aguardando</span></div><div class="result-stat"><span class="stat-icon stat-icon-green">${icon('activity', 17)}</span><div><span class="stat-label">Pontos faciais</span><strong id="confidence-stat">—</strong></div><span class="stat-meta">por rosto</span></div><div class="result-footnote">${icon('clock', 13)}<span id="result-description">Os resultados aparecerão aqui</span></div></section>
            <div class="privacy-note">${icon('shield', 16)}<p><strong>Privacidade em primeiro lugar</strong><span>Imagens processadas no seu dispositivo. Nada é armazenado.</span></p></div>
          </aside>
        </div>
        <footer class="page-footer"><span>© 2026 Visão Facial</span><span class="footer-separator">·</span><span>Detecção facial com MediaPipe</span><span class="footer-right">Feito para explorar visão computacional <span class="heart">♡</span></span></footer>
      </section>
    </main>
    <div class="toast" id="toast" role="status"></div>
  </div>`;

const $ = (selector) => document.querySelector(selector);
const els = { video: $('#video'), preview: $('#preview'), canvas: $('#overlay'), stage: $('#stage'), empty: $('#empty-state'), scanline: $('#scanline'), statusLight: $('#status-light'), status: $('#status-label'), source: $('#source-text'), resolution: $('#resolution'), faceCount: $('#face-count'), count: $('#count-value'), faces: $('#faces-stat'), confidence: $('#confidence-stat'), facesMeta: $('#faces-meta'), resultState: $('#result-state'), resultDescription: $('#result-description'), cameraBtn: $('#camera-btn'), toast: $('#toast') };
let landmarker;
let stream;
let animationFrame;
let activeImageUrl;
let toastTimer;

async function getDetector() {
  if (landmarker) return landmarker;
  els.status.textContent = 'Carregando modelo…';
  try {
    // Use the bundled MediaPipe runtime and files so detection does not depend on a CDN.
    ({ FaceLandmarker, FilesetResolver } = await import('../vendor/mediapipe/vision_bundle.mjs'));
    // BASE_URL also works when GitHub Pages serves the project from /repository-name/.
    const publicBase = new URL(import.meta.env.BASE_URL, window.location.href);
    const wasmPath = new URL('vendor/mediapipe/wasm/', publicBase).href;
    const modelPath = new URL('models/face_landmarker.task', publicBase).href;
    const vision = await FilesetResolver.forVisionTasks(wasmPath);
    landmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: modelPath, delegate: 'CPU' },
      runningMode: 'VIDEO', numFaces: 5, minFaceDetectionConfidence: 0.5,
      minFacePresenceConfidence: 0.5, minTrackingConfidence: 0.5,
    });
    return landmarker;
  } catch (error) {
    console.error(error);
    showToast('Não foi possível iniciar a detecção. Confira os arquivos do MediaPipe na pasta do programa.');
    setIdle();
    throw error;
  }
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('visible'), 3600);
}

function setAnalyzing(source) {
  els.empty.classList.add('hidden');
  els.stage.classList.add('has-source');
  els.statusLight.className = 'status-light is-live';
  els.status.textContent = 'Detectando rostos';
  els.resultState.innerHTML = '<span></span> AO VIVO';
  els.resultState.classList.add('active');
  els.resultDescription.textContent = `Análise em andamento · ${source}`;
  els.scanline.classList.add('active');
}

function setIdle() {
  cancelAnimationFrame(animationFrame);
  els.statusLight.className = 'status-light';
  els.status.textContent = 'Aguardando início';
  els.resultState.innerHTML = '<span></span> INATIVO';
  els.resultState.classList.remove('active');
  els.resultDescription.textContent = 'Os resultados aparecerão aqui';
  els.faces.textContent = '—';
  els.confidence.textContent = '—';
  els.facesMeta.textContent = 'Aguardando';
  els.faceCount.hidden = true;
  els.scanline.classList.remove('active');
  const ctx = els.canvas.getContext('2d');
  ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
}

function prepareCanvas(width, height) {
  els.canvas.width = width;
  els.canvas.height = height;
  els.resolution.textContent = `${width} × ${height}`;
}

function drawConnections(ctx, landmarks, connections, color, lineWidth) {
  if (!connections?.length) return;
  ctx.beginPath();
  for (const { start, end } of connections) {
    const a = landmarks[start]; const b = landmarks[end];
    if (!a || !b) continue;
    ctx.moveTo(a.x * ctx.canvas.width, a.y * ctx.canvas.height);
    ctx.lineTo(b.x * ctx.canvas.width, b.y * ctx.canvas.height);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawLandmarks(result, width, height) {
  const ctx = els.canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height);
  const faces = result.faceLandmarks ?? [];
  const lineWidth = Math.max(0.7, width / 1200);
  let landmarkCount = 0;
  faces.forEach((landmarks, index) => {
    if (!landmarks.length) return;
    landmarkCount += landmarks.length;
    drawConnections(ctx, landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, 'rgba(61, 226, 178, .28)', lineWidth);
    drawConnections(ctx, landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, '#33d4a5', lineWidth * 1.7);
    drawConnections(ctx, landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, '#e5fff7', lineWidth * 1.5);
    drawConnections(ctx, landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, '#e5fff7', lineWidth * 1.5);
    drawConnections(ctx, landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, '#70f1c6', lineWidth * 1.4);
    drawConnections(ctx, landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, '#70f1c6', lineWidth * 1.4);
    drawConnections(ctx, landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, '#49e2b4', lineWidth * 1.6);
    drawConnections(ctx, landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS, '#ffffff', lineWidth * 2);
    drawConnections(ctx, landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS, '#ffffff', lineWidth * 2);

    const xs = landmarks.map((point) => point.x * width);
    const ys = landmarks.map((point) => point.y * height);
    const x = Math.min(...xs); const y = Math.min(...ys);
    const w = Math.max(...xs) - x; const h = Math.max(...ys) - y;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, Math.min(12, w * .08));
    ctx.lineWidth = Math.max(1.3, width / 600);
    ctx.strokeStyle = '#21c69a';
    ctx.stroke();

    const radius = Math.max(1.25, width / 520);
    for (const point of landmarks) {
      ctx.beginPath();
      ctx.arc(point.x * width, point.y * height, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#9affdf';
      ctx.fill();
    }

    const label = `ROSTO 0${index + 1}`;
    ctx.font = `600 ${Math.max(11, width / 58)}px "DM Sans", sans-serif`;
    const labelWidth = ctx.measureText(label).width + 18;
    ctx.fillStyle = '#1db68b';
    ctx.beginPath();
    ctx.roundRect(x, Math.max(0, y - 27), labelWidth, 23, 5);
    ctx.fill();
    ctx.fillStyle = '#06271f';
    ctx.fillText(label, x + 9, Math.max(0, y - 11));
  });
  const count = faces.length;
  els.faces.textContent = String(count).padStart(2, '0');
  els.facesMeta.textContent = count ? 'Na imagem' : 'Nenhum rosto';
  els.confidence.textContent = count ? String(Math.round(landmarkCount / count)) : '—';
  els.faceCount.hidden = false;
  els.count.textContent = `${count} ${count === 1 ? 'rosto encontrado' : 'rostos encontrados'}`;
}

function detectVideoFrame() {
  if (!stream || els.video.readyState < 2) { animationFrame = requestAnimationFrame(detectVideoFrame); return; }
  try {
    const result = landmarker.detectForVideo(els.video, performance.now());
    drawLandmarks(result, els.canvas.width, els.canvas.height);
  } catch (error) { console.warn('Não foi possível processar um quadro.', error); }
  animationFrame = requestAnimationFrame(detectVideoFrame);
}

async function stopCamera() {
  cancelAnimationFrame(animationFrame);
  if (stream) stream.getTracks().forEach((track) => track.stop());
  stream = null;
  els.video.srcObject = null;
  els.video.style.display = 'none';
  els.cameraBtn.classList.remove('is-stop');
  els.cameraBtn.innerHTML = `${icon('camera', 18)}<span>Ativar câmera</span><span class="button-arrow">${icon('chevron', 16)}</span>`;
}

async function startCamera() {
  if (stream) { await stopCamera(); setIdle(); resetStage(); return; }
  if (!navigator.mediaDevices?.getUserMedia) { showToast('Sua conexão não permite usar a câmera neste endereço.'); return; }
  try {
    await getDetector();
    await landmarker.setOptions({ runningMode: 'VIDEO' });
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
    els.preview.style.display = 'none';
    els.video.style.display = 'block';
    els.video.srcObject = stream;
    await new Promise((resolve) => { if (els.video.readyState >= 1) resolve(); else els.video.onloadedmetadata = resolve; });
    await els.video.play();
    prepareCanvas(els.video.videoWidth, els.video.videoHeight);
    els.source.textContent = 'Câmera do dispositivo';
    setAnalyzing('câmera ativa');
    els.cameraBtn.classList.add('is-stop');
    els.cameraBtn.innerHTML = `${icon('close', 17)}<span>Encerrar câmera</span><span class="button-arrow">${icon('chevron', 16)}</span>`;
    detectVideoFrame();
  } catch (error) {
    console.error(error);
    if (error.name === 'NotAllowedError') showToast('Permita o acesso à câmera no navegador para continuar.');
    else if (error.name === 'NotFoundError') showToast('Nenhuma câmera foi encontrada neste dispositivo.');
    else showToast('Não foi possível iniciar a câmera. Tente enviar uma imagem.');
    await stopCamera(); setIdle(); resetStage();
  }
}

function resetStage() {
  els.empty.classList.remove('hidden');
  els.stage.classList.remove('has-source');
  els.source.textContent = 'Nenhuma fonte selecionada';
  els.resolution.textContent = '— × —';
  els.video.style.display = 'none';
  els.preview.style.display = 'none';
}

async function analyzeImage(file) {
  if (!file || !file.type.startsWith('image/')) { showToast('Escolha um arquivo de imagem válido.'); return; }
  await stopCamera();
  setIdle();
  if (activeImageUrl) URL.revokeObjectURL(activeImageUrl);
  activeImageUrl = URL.createObjectURL(file);
  els.preview.onload = async () => {
    // Show the selected image immediately. A network/model failure must not make upload look broken.
    els.preview.style.display = 'block';
    els.video.style.display = 'none';
    prepareCanvas(els.preview.naturalWidth, els.preview.naturalHeight);
    els.source.textContent = file.name.length > 30 ? `${file.name.slice(0, 27)}…` : file.name;
    setAnalyzing('imagem enviada');
    try {
      await getDetector();
      await landmarker.setOptions({ runningMode: 'IMAGE' });
      drawLandmarks(landmarker.detect(els.preview), els.canvas.width, els.canvas.height);
      els.status.textContent = 'Análise concluída';
      els.statusLight.className = 'status-light is-live';
      els.resultDescription.textContent = `Análise concluída · ${file.name}`;
      els.resultState.innerHTML = '<span></span> CONCLUÍDO';
    } catch (error) {
      console.error('A imagem foi aberta, mas a detecção não pôde ser iniciada.', error);
      els.status.textContent = 'Imagem carregada';
      els.resultDescription.textContent = 'Imagem aberta; não foi possível carregar o modelo de detecção.';
      els.resultState.innerHTML = '<span></span> MODELO INDISPONÍVEL';
      showToast('A imagem abriu, mas a detecção não iniciou. Confira os arquivos do MediaPipe na pasta do programa.');
    }
  };
  els.preview.onerror = () => showToast('Não foi possível abrir essa imagem.');
  els.preview.src = activeImageUrl;
}

els.cameraBtn.addEventListener('click', startCamera);
$('#upload-btn').addEventListener('click', () => $('#file-input').click());
$('#file-input').addEventListener('change', (event) => { analyzeImage(event.target.files[0]); event.target.value = ''; });
$('#sample-btn').addEventListener('click', async () => {
  try {
    const sampleUrl = new URL('samples/portrait.jpg', new URL(import.meta.env.BASE_URL, window.location.href));
    const response = await fetch(sampleUrl);
    if (!response.ok) throw new Error('Não foi possível carregar a imagem de demonstração.');
    const blob = await response.blob();
    await analyzeImage(new File([blob], 'imagem-demonstracao.jpg', { type: blob.type || 'image/jpeg' }));
  } catch (error) {
    console.error(error);
    showToast('Não foi possível carregar a demonstração. Envie uma imagem do seu dispositivo.');
  }
});

// Allow image files to be dropped directly into the recognition area.
els.stage.addEventListener('dragover', (event) => { event.preventDefault(); els.stage.classList.add('dragging'); });
els.stage.addEventListener('dragleave', () => els.stage.classList.remove('dragging'));
els.stage.addEventListener('drop', (event) => {
  event.preventDefault(); els.stage.classList.remove('dragging');
  const file = event.dataTransfer.files[0];
  if (file) analyzeImage(file);
});

window.addEventListener('resize', () => {
  if (stream && els.video.videoWidth) prepareCanvas(els.video.videoWidth, els.video.videoHeight);
});
