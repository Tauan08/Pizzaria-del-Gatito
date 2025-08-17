// Inicia o carrinho de compras. Tenta carregar do localStorage, se não houver, inicia com um array vazio.
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Variáveis e Seletores
const cartButton = document.querySelector('.cart-button');
const closeButton = document.querySelector('.close-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartCountSpan = document.getElementById('cart-count');
const cartItemsList = document.getElementById('cart-items');
const cartTotalSpan = document.getElementById('cart-total-price');
const checkoutButton = document.querySelector('.checkout-btn');

// Funções do Carrinho
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartSidebar();
}

function updateCartCount() {
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountSpan.textContent = totalCount;
}

// Função para adicionar itens ao carrinho
function addToCart(productName, productPrice, productImage) {
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    saveCart();
    cartSidebar.classList.add('open');
}

function removeItem(productName) {
    cart = cart.filter(item => item.name !== productName);
    saveCart();
}

function updateQuantity(productName, change) {
    const item = cart.find(i => i.name === productName);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeItem(productName);
    } else {
        saveCart();
    }
}

// Função para atualizar a barra lateral do carrinho (sidebar)
function updateCartSidebar() {
    cartItemsList.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="item-details">
                    <span>${item.name}</span>
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-name="${item.name}" data-change="-1">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" data-name="${item.name}" data-change="1">+</button>
                    </div>
                </div>
            </div>
            <div class="item-price-remove">
                <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-btn" data-name="${item.name}"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        cartItemsList.appendChild(listItem);
        total += item.price * item.quantity;
    });

    cartTotalSpan.textContent = `R$ ${total.toFixed(2)}`;
}

// Função para finalizar o pedido
function checkout() {
    cart = [];
    saveCart();
    alert('Pedido finalizado com sucesso!');
    cartSidebar.classList.remove('open');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartSidebar();
});

cartItemsList.addEventListener('click', (e) => {
    const targetBtn = e.target.closest('button');
    if (!targetBtn) return;

    const productName = targetBtn.dataset.name;
    
    if (targetBtn.classList.contains('quantity-btn')) {
        const change = parseInt(targetBtn.dataset.change);
        updateQuantity(productName, change);
    } else if (targetBtn.classList.contains('remove-btn')) {
        removeItem(productName);
    }
});

cartButton.addEventListener('click', () => {
    cartSidebar.classList.add('open');
});

closeButton.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
});

// Listener para o botão de finalizar pedido
checkoutButton.addEventListener('click', checkout);