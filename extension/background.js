const API_BASE = 'https://linkhub-p9qi.onrender.com/api';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'save-link',
    title: 'Save to Links Manager',
    contexts: ['link'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'save-link') return;
  chrome.storage.session.set({ pendingUrl: info.linkUrl }, () => {
    chrome.windows.create({
      url: chrome.runtime.getURL('popup/popup.html?mode=context'),
      type: 'popup',
      width: 380,
      height: 480,
    });
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'SAVE_LINK') {
    fetch(`${API_BASE}/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: msg.url, boardIds: msg.boardIds }),
    })
      .then(r => r.json())
      .then(data => sendResponse({ ok: true, data }))
      .catch(err => sendResponse({ ok: false, error: err.message }));
    return true;
  }

  if (msg.type === 'GET_BOARDS') {
    fetch(`${API_BASE}/boards`)
      .then(r => r.json())
      .then(data => sendResponse({ ok: true, data }))
      .catch(err => sendResponse({ ok: false, error: err.message }));
    return true;
  }

  if (msg.type === 'GET_PENDING_URL') {
    chrome.storage.session.get('pendingUrl', ({ pendingUrl }) => {
      sendResponse({ url: pendingUrl || null });
    });
    return true;
  }
});
