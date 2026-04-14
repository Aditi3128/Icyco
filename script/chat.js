const chatContainer = document.getElementById('chat');
const chatInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendBtn');

function appendChatMessage(type, text) {
  if (!chatContainer) {
    return null;
  }

  const messageElement = document.createElement('div');
  messageElement.className = `message ${type}`;
  messageElement.textContent = text;
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  return messageElement;
}

function saveChats(chats) {
  localStorage.setItem(
    'icyco_chats',
    JSON.stringify({
      chats: chats.slice(-15),
      last_updated_at: Date.now(),
    })
  );
}

function loadChats() {
  if (!chatContainer || window.__ICYCO_CHAT_INITIALIZED__) {
    return [];
  }

  const storedChats = JSON.parse(localStorage.getItem('icyco_chats') || 'null');
  const hasRecentChats =
    storedChats && storedChats.last_updated_at > Date.now() - 24 * 60 * 60 * 1000;

  const chats = hasRecentChats
    ? storedChats.chats
    : [{ type: 'assistant', text: "Hi! I'm your Icyco assistant. Ask me anything about our products or services!" }];

  chatContainer.innerHTML = '';
  chats.forEach((chat) => appendChatMessage(chat.type, chat.text));
  saveChats(chats);
  return chats;
}

async function sendChatMessage(chats) {
  const message = chatInput?.value.trim() || '';

  if (!message) {
    return;
  }

  appendChatMessage('user', message);
  chats.push({ type: 'user', text: message });

  const assistantMessage = appendChatMessage('assistant', 'Please wait...');
  chatInput.value = '';

  try {
    const response = await fetch('http://localhost:5000/api/ai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    const reply = data.reply || data.message || "I'm IcyCo's assistant! Ask me about flavors, prices, or stores.";

    if (assistantMessage) {
      assistantMessage.textContent = reply;
    }

    chats.push({ type: 'assistant', text: reply });
    saveChats(chats);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } catch (error) {
    if (assistantMessage) {
      assistantMessage.textContent = 'Sorry, I could not connect to the assistant right now.';
    }
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}

function initChat() {
  if (!chatContainer || !chatInput || !sendButton || window.__ICYCO_CHAT_INITIALIZED__) {
    return;
  }

  window.__ICYCO_CHAT_INITIALIZED__ = true;
  const chats = loadChats();

  sendButton.addEventListener('click', async () => {
    await sendChatMessage(chats);
  });

  chatInput.addEventListener('keydown', async (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    await sendChatMessage(chats);
  });
}

initChat();

window.IcyCoChat = { init: initChat };
