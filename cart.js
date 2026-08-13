// ======================
// CART ENGINE (localStorage)
// ======================
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('rip_cart')) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('rip_cart', JSON.stringify(cart));
    renderCartBadge();
}

function cartCount() {
    return getCart().reduce((n, i) => n + i.qty, 0);
}

function cartTotal() {
    return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

function addToCart(product, size) {
    const cart = getCart();
    const key = product.id + '-' + size;
    const existing = cart.find(i => i.key === key);
    
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            key: key,
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            qty: 1
        });
    }
    saveCart(cart);
}

// ======================
// CART BADGE
// ======================
function renderCartBadge() {
    const n = cartCount();
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = n;
        el.classList.toggle('show', n > 0);
    });
}

function formatPrice(amount) {
    return CONFIG.currency.symbol + amount.toFixed(2);
}

document.addEventListener('DOMContentLoaded', renderCartBadge);