const API = 'http://localhost:3000';
let jwtToken = null;
let cart = [];

// Affichage des messages
function showMsg(id, msg, err = false) {
  const e = document.getElementById(id);
  e.textContent = msg;
  e.style.color = err ? 'red' : 'green';
}

// Fonction de login / register
async function login(user, pwd, reg = false) {
  const url = `${API}/auth/${reg ? 'register' : 'login'}`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: user, password: pwd })  // <-- CHANGÉ ICI
  });
  const d = await r.json();
  if (r.ok) {
    jwtToken = d.token;
    // Masquer le formulaire de login/register
    document.getElementById('login').style.display = 'none';
    // Afficher produits et panier
    document.getElementById('products').style.display = 'block';
    document.getElementById('cart').style.display = 'block';
    fetchProducts();
  } else {
    showMsg('login-msg', d.error || 'Erreur', true);
  }
}

// Récupération et affichage des produits
async function fetchProducts() {
  const r = await fetch(`${API}/products`, {
    headers: { 'Authorization': `Bearer ${jwtToken}` }
  });
  const p = await r.json();
  document.getElementById('products-list').innerHTML = p.map(i => `
    <div>
      ${i.name} – €${i.price}
      <button onclick="addToCart(${i.id}, '${i.name}', ${i.price})">Ajouter</button>
    </div>
  `).join('');
}

// Gestion du panier
function addToCart(id, name, price) {
  cart.push({ id, name, price, qty: 1 });
  renderCart();
}
function renderCart() {
  const c = document.getElementById('cart-items');
  if (!cart.length) {
    c.textContent = '(vide)';
    return;
  }
  c.innerHTML = cart.map((i, idx) => `
    <div>
      ${i.name} – €${i.price}
      <button onclick="removeFromCart(${idx})">❌</button>
    </div>
  `).join('');
}
function removeFromCart(idx) {
  cart.splice(idx, 1);
  renderCart();
}

// Passer une commande
async function placeOrder() {
  if (!cart.length) {
    showMsg('order-msg', 'Le panier est vide', true);
    return;
  }
  const r = await fetch(`${API}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
    body: JSON.stringify({
      userId: 1,
      products: cart.map(i => ({ id: i.id, qty: i.qty }))
    })
  });
  const d = await r.json();
  if (r.ok) {
    showMsg('order-msg', 'Commande passée ! ID=' + d.id);
    cart = [];
    renderCart();
  } else {
    showMsg('order-msg', d.error || 'Erreur', true);
  }
}

// Événements sur les boutons
document.getElementById('btn-login').addEventListener('click', () =>
  login(
    document.getElementById('username').value,
    document.getElementById('password').value,
    false
  )
);
document.getElementById('btn-register').addEventListener('click', () =>
  login(
    document.getElementById('username').value,
    document.getElementById('password').value,
    true
  )
);
document.getElementById('btn-order').addEventListener('click', placeOrder);
