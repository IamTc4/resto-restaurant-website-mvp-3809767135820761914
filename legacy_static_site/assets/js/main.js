// Initialize Cart
let cart = JSON.parse(localStorage.getItem('savoria_cart')) || [];

// DOM Elements
const menuContainer = document.getElementById('menu-container');
const cartCountElement = document.getElementById('cart-count');

// Render Menu
function renderMenu() {
    if (!menuContainer) return;

    menuContainer.innerHTML = '';

    // Group by category logic or just flat list? Let's do flat list for simplicity but sorted by category could be nice.
    // Following the system prompt "Menu Showcase".

    menuData.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'menu-item';
        itemCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-content">
                <div class="menu-header">
                    <span class="menu-title">${item.name}</span>
                    <span class="menu-price">₹${item.price}</span>
                </div>
                <p class="menu-desc">${item.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.8rem; color: #777;">${item.tags.join(', ')}</span>
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${item.id})">Add</button>
                </div>
            </div>
        `;
        menuContainer.appendChild(itemCard);
    });
}

// Add to Cart
function addToCart(itemId) {
    const item = menuData.find(i => i.id === itemId);
    if (!item) return;

    const existingItem = cart.find(i => i.id === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCart();

    // Simple toast notification
    const toast = document.createElement('div');
    toast.textContent = `Added ${item.name} to cart`;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = '#2ecc71';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '1000';
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// Update Cart Storage and UI
function updateCart() {
    localStorage.setItem('savoria_cart', JSON.stringify(cart));
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    updateCart();
});
