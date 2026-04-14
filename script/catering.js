function ensureCateringMessageElement(form) {
  let messageElement = form.querySelector('[data-catering-message]');

  if (messageElement) {
    return messageElement;
  }

  messageElement = document.createElement('p');
  messageElement.setAttribute('data-catering-message', 'true');
  messageElement.style.margin = '0 20px 20px';
  messageElement.style.fontWeight = '600';

  const buttonRow = form.querySelector('.btn');
  form.insertBefore(messageElement, buttonRow ? buttonRow.nextSibling : null);

  return messageElement;
}

function setCateringMessage(form, message, isSuccess) {
  const messageElement = ensureCateringMessageElement(form);
  messageElement.textContent = message;
  messageElement.style.color = isSuccess ? '#2e7d32' : '#c62828';
}

function getCateringFormData(form) {
  const textInputs = form.querySelectorAll('input.form-text');
  const selectedEventType = form.querySelector('input[name="indoor-outdoor"]:checked');

  return {
    name: textInputs[0]?.value.trim() || '',
    email: textInputs[1]?.value.trim() || '',
    contact: form.querySelector('#contact')?.value.trim() || '',
    date: form.querySelector('#dateInput')?.value.trim() || '',
    eventType: selectedEventType?.value.trim() || '',
  };
}

async function handleCateringSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const payload = getCateringFormData(form);

  if (!payload.name || !payload.email || !payload.contact || !payload.date || !payload.eventType) {
    setCateringMessage(form, 'All fields are required', false);
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/catering', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      setCateringMessage(form, data.message || 'Unable to submit request', false);
      return;
    }

    setCateringMessage(form, 'Request submitted!', true);
    form.reset();

    const dateInput = document.getElementById('dateInput');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }
  } catch (error) {
    setCateringMessage(form, 'Unable to connect to the server', false);
  }
}

function initCateringForm() {
  if (window.__ICYCO_CATERING_INITIALIZED__) {
    return;
  }

  const form = document.querySelector('.form-contents');
  const dateInput = document.getElementById('dateInput');

  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  if (!form) {
    return;
  }

  window.__ICYCO_CATERING_INITIALIZED__ = true;
  form.addEventListener('submit', handleCateringSubmit);
}

initCateringForm();
