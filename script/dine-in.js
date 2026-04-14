const menuItems = [
  'Vanilla Scoop ₹80',
  'Chocolate Cone ₹100',
  'Mango Gelato ₹120',
  'Strawberry Cup ₹90',
  'Pistachio Sundae ₹150',
];

function getOrCreateMenuModal() {
  let overlay = document.getElementById('dineInMenuOverlay');

  if (overlay) {
    return overlay;
  }

  overlay = document.createElement('div');
  overlay.id = 'dineInMenuOverlay';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0, 0, 0, 0.45)';
  overlay.style.display = 'none';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.padding = '24px';
  overlay.style.zIndex = '9999';

  const modal = document.createElement('div');
  modal.style.width = 'min(92vw, 460px)';
  modal.style.background = 'var(--white, #fff)';
  modal.style.color = 'var(--black, #222)';
  modal.style.borderRadius = '18px';
  modal.style.padding = '24px';
  modal.style.boxShadow = '0 18px 50px rgba(0, 0, 0, 0.2)';
  modal.style.fontFamily = 'inherit';

  const title = document.createElement('h3');
  title.id = 'dineInMenuTitle';
  title.style.margin = '0 0 16px 0';
  title.style.color = 'var(--main-color, #e26d8f)';

  const menuList = document.createElement('ul');
  menuList.id = 'dineInMenuList';
  menuList.style.paddingLeft = '20px';
  menuList.style.margin = '0 0 20px 0';

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.textContent = 'Close';
  closeButton.style.border = 'none';
  closeButton.style.background = 'var(--main-color, #e26d8f)';
  closeButton.style.color = '#fff';
  closeButton.style.padding = '10px 18px';
  closeButton.style.borderRadius = '999px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.font = 'inherit';

  closeButton.addEventListener('click', () => {
    overlay.style.display = 'none';
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      overlay.style.display = 'none';
    }
  });

  modal.appendChild(title);
  modal.appendChild(menuList);
  modal.appendChild(closeButton);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  return overlay;
}

function showMenuModal(shopName) {
  const overlay = getOrCreateMenuModal();
  const title = overlay.querySelector('#dineInMenuTitle');
  const menuList = overlay.querySelector('#dineInMenuList');

  title.textContent = `${shopName} Menu`;
  menuList.innerHTML = '';

  menuItems.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = item;
    listItem.style.marginBottom = '10px';
    menuList.appendChild(listItem);
  });

  overlay.style.display = 'flex';
}

function initDineInPage() {
  const searchInput = document.querySelector('.search-bar input');
  const shopCards = document.querySelectorAll('.restaurant-card');

  if (!searchInput || !shopCards.length || window.__ICYCO_DINE_IN_INITIALIZED__) {
    return;
  }

  window.__ICYCO_DINE_IN_INITIALIZED__ = true;

  searchInput.addEventListener('input', () => {
    const searchText = searchInput.value.toLowerCase().trim();

    shopCards.forEach((card) => {
      const shopName = card.querySelector('h3')?.textContent.toLowerCase() || '';
      card.style.display = shopName.includes(searchText) ? '' : 'none';
    });
  });

  shopCards.forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const shopName = card.querySelector('h3')?.textContent.trim() || 'IcyCo Store';
      showMenuModal(shopName);
    });
  });
}

initDineInPage();
