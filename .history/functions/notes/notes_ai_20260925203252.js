const workspace = document.getElementById('notes-workspace');
const toggleButton = document.getElementById('notes-ai-toggle');
const closeButton = document.getElementById('notes-ai-close');
const panel = document.getElementById('notes-ai-panel');
const form = document.getElementById('notes-ai-form');
const input = document.getElementById('notes-ai-input');
const chatWindow = document.getElementById('notes-ai-chat-window');

if (workspace && toggleButton && closeButton && panel && form && input && chatWindow) {
  const setPanelState = (isOpen) => {
    workspace.classList.toggle('ai-open', isOpen);
    toggleButton.setAttribute('aria-expanded', String(isOpen));
    panel.setAttribute('aria-hidden', String(!isOpen));
  };

  const addMessage = (role, text) => {
    const bubble = document.createElement('div');
    bubble.className = `ai-message ai-${role}`;
    bubble.textContent = text;
    chatWindow.appendChild(bubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  };

  toggleButton.addEventListener('click', () => {
    const isOpen = workspace.classList.contains('ai-open');
    setPanelState(!isOpen);
  });

  closeButton.addEventListener('click', () => setPanelState(false));

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const message = input.value.trim();
    if (!message) {
      return;
    }

    addMessage('user', message);
    input.value = '';

    window.setTimeout(() => {
      addMessage('bot', 'I can tighten this idea, turn it into bullet points, or suggest a cleaner structure for the note.');
    }, 220);
  });

  setPanelState(false);
}
