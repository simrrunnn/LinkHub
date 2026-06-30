const params = new URLSearchParams(location.search);
const isContextMode = params.get('mode') === 'context';

const loadingEl = document.getElementById('loading');
const mainEl = document.getElementById('main');
const successEl = document.getElementById('success');
const errorEl = document.getElementById('error');
const urlInput = document.getElementById('url-input');
const boardsList = document.getElementById('boards-list');
const saveBtn = document.getElementById('save-btn');

let boards = [];
let selectedBoardIds = [];

async function init() {
  const boardsRes = await chrome.runtime.sendMessage({ type: 'GET_BOARDS' });
  boards = boardsRes.ok ? boardsRes.data : [];

  if (isContextMode) {
    const { url } = await chrome.runtime.sendMessage({ type: 'GET_PENDING_URL' });
    if (url) urlInput.value = url;
  }

  renderBoards();
  loadingEl.classList.add('hidden');
  mainEl.classList.remove('hidden');
}

function renderBoards() {
  if (boards.length === 0) {
    boardsList.innerHTML = '<p class="no-boards">No boards yet — create one in the app first.</p>';
    return;
  }

  boardsList.innerHTML = '';
  boards.forEach(board => {
    const item = document.createElement('label');
    item.className = 'board-item';
    item.innerHTML = `
      <input type="checkbox" value="${board.id}" />
      <span class="board-dot" style="background:${board.color}"></span>
      <span class="board-name">${board.name}</span>
    `;
    const checkbox = item.querySelector('input');
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        selectedBoardIds.push(board.id);
      } else {
        selectedBoardIds = selectedBoardIds.filter(id => id !== board.id);
      }
    });
    boardsList.appendChild(item);
  });
}

saveBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) {
    showError('Please enter a URL.');
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving…';
  errorEl.classList.add('hidden');

  const res = await chrome.runtime.sendMessage({
    type: 'SAVE_LINK',
    url,
    boardIds: selectedBoardIds,
  });

  if (res.ok) {
    mainEl.classList.add('hidden');
    successEl.classList.remove('hidden');
    if (isContextMode) setTimeout(() => window.close(), 1200);
  } else {
    showError('Failed to save. Is the backend running?');
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Link';
  }
});

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.remove('hidden');
}

init().catch(() => {
  showError('Could not connect to backend. Make sure it is running on port 3001.');
  loadingEl.classList.add('hidden');
  mainEl.classList.remove('hidden');
});
