document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-link').addEventListener('click', showLoginForm);
    document.getElementById('register-link').addEventListener('click', showRegisterForm);
    document.getElementById('cart-link').addEventListener('click', showCart);

    loadProducts();
});

function showLoginForm() {
    document.getElementById('content').innerHTML = `
        <h2>Login</h2>
        <form id="login-form">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Login</button>
        </form>
    `;
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

function showRegisterForm() {
    document.getElementById('content').innerHTML = `
        <h2>Register</h2>
        <form id="register-form">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Register</button>
        </form>
    `;
    document.getElementById('register-form').addEventListener('submit', handleRegister);
}

function showCart() {
    document.getElementById('content').innerHTML = `
        <h2>Shopping Cart</h2>
        <div id="cart-items"></div>
        <button id="checkout-button">Checkout</button>
    `;
    loadCartItems();
}

function loadProducts() {
    fetch('http://localhost:8000/api/products')
        .then(response => response.json())
        .then(products => {
            let content = '<h2>Products</h2><div id="products">';
            products.forEach(product => {
                content += `
                    <div class="product">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>$${product.price}</p>
                        <button onclick="addToCart('${product._id}')">Add to Cart</button>
                    </div>
                `;
            });
            content += '</div>';
            document.getElementById('content').innerHTML = content;
        })
        .catch(err => console.error(err));
}

function handleLogin(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    fetch('http://localhost:8000/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            alert('Login successful');
            loadProducts();
        } else {
            alert('Login failed');
        }
    })
    .catch(err => console.error(err));
}

function handleRegister(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    fetch('http://localhost:8000/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'User registered') {
            alert('Registration successful');
            showLoginForm();
        } else {
            alert('Registration failed');
        }
    })
    .catch(err => console.error(err));
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsDiv = document.getElementById('cart-items');

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        fetch('http://localhost:8000/api/products')
            .then(response => response.json())
            .then(products => {
                let cartItems = '';
                cart.forEach(productId => {
                    const product = products.find(p => p._id === productId);
                    if (product) {
                        cartItems += `
                            <div class="cart-item">
                                <h3>${product.name}</h3>
                                <p>$${product.price}</p>
                            </div>
                        `;
                    }
                });
                cartItemsDiv.innerHTML = cartItems;
            })
            .catch(err => console.error(err));
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-count').textContent = cart.length;
}
