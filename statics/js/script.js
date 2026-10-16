/**
 * ── モーダル①（メイン動画プレイヤー）────────────────────────────
 */
function openDiagnosis(url) {
  document.getElementById('diag-frame').src = url;
  document.getElementById('video-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDiagnosis() {
  document.getElementById('video-modal').classList.remove('open');
  document.getElementById('diag-frame').src = '';
  closeDetailModal();                      // 先に孫モーダルを閉じる
  document.body.style.overflow = 'auto';  // 最後に overflow を戻す
}


/**
 * ── モーダル②（詳細動画）────────────────────────────────────────
 * OverlayButton から postMessage で飛んでくる:
 * { type: "open-detail-modal", config: "設定JSONのURL文字列" }
 */
function openDetailModal(configUrl) {
  const url = `https://video-story-common.pages.dev/?config=${encodeURIComponent(configUrl)}`;
  document.getElementById('detail-frame').src = url;
  document.getElementById('detail-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('diag-frame').contentWindow?.postMessage({ type: 'pause' }, '*');
}

function closeDetailModal() {
  document.getElementById('detail-modal').classList.remove('open');
  document.getElementById('detail-frame').src = '';
  document.getElementById('diag-frame').contentWindow?.postMessage({ type: 'resume' }, '*');
  document.body.style.overflow = 'auto';  // 最後に overflow を戻す
}


/**
 * ── iframe クリックの伝播防止 ───────────────────────────────────
 */
document.getElementById('diag-frame').addEventListener('click', e => e.stopPropagation());
document.getElementById('detail-frame').addEventListener('click', e => e.stopPropagation());


/**
 * ── postMessage 受信 ────────────────────────────────────────────
 */
window.addEventListener('message', (e) => {
  // 本番では送信元ドメインを限定する
  // if (e.origin !== 'https://video-story.pages.dev') return;

  if (!e.data || typeof e.data !== 'object') return;

  switch (e.data.type) {
    case 'open-detail-modal':
      if (e.data.config) openDetailModal(e.data.config);
      break;
    case 'close-self':
      closeDetailModal();
      break;
  }
});