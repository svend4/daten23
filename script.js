// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count on page load
updateCartCount();

// Add to cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const name = this.getAttribute('data-name');
        const price = parseInt(this.getAttribute('data-price'));

        addToCart(name, price);

        // Visual feedback
        this.textContent = 'Добавлено!';
        this.style.backgroundColor = '#28a745';

        setTimeout(() => {
            this.textContent = 'В корзину';
            this.style.backgroundColor = '';
        }, 1000);
    });
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    displayCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

function displayCart() {
    const cartItemsElement = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');

    if (!cartItemsElement) return;

    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
        cartTotalElement.textContent = '0';
        return;
    }

    let cartHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price} ₽ × ${item.quantity} = ${itemTotal} ₽</div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">Удалить</button>
            </div>
        `;
    });

    cartItemsElement.innerHTML = cartHTML;
    cartTotalElement.textContent = total;
}

// Modal functionality
const modal = document.getElementById('cartModal');
const cartLink = document.getElementById('cartLink');
const closeBtn = document.querySelector('.close');

if (cartLink) {
    cartLink.addEventListener('click', function(e) {
        e.preventDefault();
        displayCart();
        modal.style.display = 'block';
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
}

window.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Checkout button
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Корзина пуста!');
            return;
        }

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`Спасибо за заказ!\n\nИтого: ${total} ₽\n\nМы свяжемся с вами для подтверждения заказа.`);

        cart = [];
        saveCart();
        updateCartCount();
        displayCart();
    });
}

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        alert(`Спасибо, ${name}!\n\nВаше сообщение отправлено. Мы свяжемся с вами по адресу ${email}.`);

        contactForm.reset();
    });
}
