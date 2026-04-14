function setSubscribeMessage(form, message, isSuccess) {
  const messageElement =
    form.closest('.popup-right')?.querySelector('.terms') ||
    form.parentElement?.querySelector('[data-subscribe-message]');

  if (messageElement) {
    messageElement.textContent = message;
    messageElement.style.color = isSuccess ? '#2e7d32' : '#c62828';
  }
}

async function handleSubscribeSubmit(event) {
  event.preventDefault();

  const subscribeForm = event.currentTarget;
  const subscribeEmailInput = subscribeForm.querySelector('#popup-email');
  const closeBtn = document.getElementById('close-btn2');
  const email = subscribeEmailInput?.value.trim() || '';

  if (!email) {
    setSubscribeMessage(subscribeForm, 'Email is required', false);
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      setSubscribeMessage(subscribeForm, data.message || 'Subscription failed', false);
      return;
    }

    setSubscribeMessage(subscribeForm, 'Subscribed successfully!', true);
    subscribeEmailInput.value = '';

    if (closeBtn) {
      window.setTimeout(() => {
        closeBtn.click();
      }, 600);
    }
  } catch (error) {
    setSubscribeMessage(subscribeForm, 'Unable to connect to the server', false);
  }
}

function initSubscribeForm() {
  if (window.__ICYCO_SUBSCRIBE_INITIALIZED__) {
    return;
  }

  const subscribeForm = document.getElementById('emailForm');
  const subscribeEmailInput = document.getElementById('popup-email');

  if (!subscribeForm || !subscribeEmailInput) {
    return;
  }

  window.__ICYCO_SUBSCRIBE_INITIALIZED__ = true;
  subscribeForm.addEventListener('submit', handleSubscribeSubmit);
}

initSubscribeForm();

window.IcyCoSubscribe = { init: initSubscribeForm };
