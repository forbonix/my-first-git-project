// js/main.js

// Firebase Data Connect pattern is moving to the official SDK in relevant pages.
// Manual REST client removed to avoid CORS/SSL issues.

// Utility: Show Toast Notification
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    if (type === 'error') {
        toast.style.backgroundColor = 'var(--error)';
    }

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Global Cart System using LocalStorage
window.Cart = {
    getItems: function () {
        const cart = localStorage.getItem('thaniyam_cart');
        return cart ? JSON.parse(cart) : [];
    },

    addItem: function (product) {
        const cart = this.getItems();
        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.cartQuantity += 1;
        } else {
            cart.push({ ...product, cartQuantity: 1 });
        }

        localStorage.setItem('thaniyam_cart', JSON.stringify(cart));
        this.updateCartUI();
        showToast(`${product.name} added to cart!`);
    },

    removeItem: function (productId) {
        let cart = this.getItems();
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('thaniyam_cart', JSON.stringify(cart));
        this.updateCartUI();
    },

    updateQuantity: function (productId, quantity) {
        let cart = this.getItems();
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.cartQuantity = parseInt(quantity);
            if (item.cartQuantity <= 0) {
                this.removeItem(productId);
                return;
            }
        }
        localStorage.setItem('thaniyam_cart', JSON.stringify(cart));
        this.updateCartUI();
    },

    clear: function () {
        localStorage.removeItem('thaniyam_cart');
        this.updateCartUI();
    },

    getTotal: function () {
        const cart = this.getItems();
        return cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
    },

    updateCartUI: function () {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const count = this.getItems().reduce((sum, item) => sum + item.cartQuantity, 0);
            cartCount.textContent = count;
            if (count > 0) {
                cartCount.style.display = 'inline-flex';
            } else {
                cartCount.style.display = 'none';
            }
        }

        // Custom event so that cart.html can update its UI if open
        window.dispatchEvent(new Event('cartUpdated'));
    }
};

// Global Auth System using Firebase
window.Auth = {
    getUser: function () {
        // Return current user from Firebase if available
        const user = firebase.auth().currentUser;
        const localUser = JSON.parse(localStorage.getItem('thaniyam_user') || '{}');
        if (user) {
            const emailPart = user.email ? user.email.split('@')[0] : 'User';
            return {
                id: user.uid,
                fullname: user.displayName || emailPart,
                email: user.email || '',
                photoURL: (user.photoURL && user.photoURL !== 'null') ? user.photoURL : null,
                role: localUser.role || 'customer'
            };
        }
        // Fallback to localStorage if Firebase hasn't loaded state yet (rough sync)
        return Object.keys(localUser).length > 0 ? localUser : null;
    },

    login: function (user) {
        // This is now handled by the onAuthStateChanged listener
        localStorage.setItem('thaniyam_user', JSON.stringify(user));
        this.updateAuthUI();
    },

    logout: function () {
        firebase.auth().signOut().then(() => {
            localStorage.removeItem('thaniyam_user');
            this.updateAuthUI();
            showToast('Logged out successfully!');
            if (window.location.pathname.includes('cart.html') || window.location.pathname.includes('login.html')) {
                window.location.href = 'index.html';
            }
        }).catch((error) => {
            showToast('Logout failed: ' + error.message, 'error');
        });
    },

    updateAuthUI: function () {
        const user = this.getUser();
        const authLinks = document.getElementById('auth-links');

        if (authLinks) {
            if (user) {
                authLinks.innerHTML = `
                    <div class="nav-account-dropdown" style="position:relative;">
                        <button id="account-btn" onclick="document.getElementById('account-menu').classList.toggle('open')"
                            style="background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:8px;font-family:inherit;font-size:0.95rem;font-weight:600;color:inherit;padding:0;">
                            ${user.photoURL ? `<img src="${user.photoURL}" style="width:32px;height:32px;border-radius:50%;border:2px solid var(--primary-color);" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';"><div style="width:32px;height:32px;border-radius:50%;background:var(--primary-color);color:#fff;display:none;align-items:center;justify-content:center;font-weight:700;">${(user.fullname || 'U').charAt(0).toUpperCase()}</div>` : `<div style="width:32px;height:32px;border-radius:50%;background:var(--primary-color);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;">${(user.fullname || 'U').charAt(0).toUpperCase()}</div>`}
                            <span style="max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">Hello, ${user.fullname}</span>
                            <i class="fa-solid fa-chevron-down" style="font-size:0.7rem;opacity:.7;"></i>
                        </button>
                        <div id="account-menu" style="display:none;position:absolute;right:0;top:calc(100% + 10px);background:#fff;border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,.15);min-width:200px;overflow:hidden;z-index:999;">
                            <div style="padding:.85rem 1.2rem;background:#f8f9fa;border-bottom:1px solid #eee;">
                                <div style="font-size:0.78rem;color:#888;">Signed in as</div>
                                <div style="font-weight:700;font-size:.9rem;overflow:hidden;text-overflow:ellipsis;">${user.email}</div>
                            </div>
                            <a href="profile.html" style="display:flex;align-items:center;gap:.75rem;padding:.85rem 1.2rem;color:#222;text-decoration:none;font-weight:500;font-size:.92rem;border-bottom:1px solid #f5f5f5;">
                                <i class="fa-solid fa-circle-user" style="color:#2e7d32;width:18px;text-align:center;"></i> My Account
                            </a>
                            ${user.role === 'admin' ? `
                            <a href="admin.html" style="display:flex;align-items:center;gap:.75rem;padding:.85rem 1.2rem;color:#222;text-decoration:none;font-weight:500;font-size:.92rem;border-bottom:1px solid #f5f5f5;">
                                <i class="fa-solid fa-shield-halved" style="color:var(--primary-color);width:18px;text-align:center;"></i> Admin Dashboard
                            </a>
                            ` : ''}
                            <a href="profile.html#orders" onclick="localStorage.setItem('profileTab','orders')" style="display:flex;align-items:center;gap:.75rem;padding:.85rem 1.2rem;color:#222;text-decoration:none;font-weight:500;font-size:.92rem;border-bottom:1px solid #f5f5f5;">
                                <i class="fa-solid fa-box" style="color:#1565c0;width:18px;text-align:center;"></i> My Orders
                            </a>
                            <a href="#" onclick="Auth.logout(); return false;" style="display:flex;align-items:center;gap:.75rem;padding:.85rem 1.2rem;color:#ef5350;text-decoration:none;font-weight:500;font-size:.92rem;">
                                <i class="fa-solid fa-right-from-bracket" style="width:18px;text-align:center;"></i> Sign Out
                            </a>
                        </div>
                    </div>
                `;
                // Close dropdown when clicking outside
                setTimeout(() => {
                    document.addEventListener('click', function closeMenu(e) {
                        const btn = document.getElementById('account-btn');
                        const menu = document.getElementById('account-menu');
                        if (menu && btn && !btn.contains(e.target) && !menu.contains(e.target)) {
                            menu.classList.remove('open');
                            menu.style.display = 'none';
                            document.removeEventListener('click', closeMenu);
                        }
                    });
                }, 100);

                // Toggle display on open class
                const observer = new MutationObserver(() => {
                    const menu = document.getElementById('account-menu');
                    if (menu) menu.style.display = menu.classList.contains('open') ? 'block' : 'none';
                });
                const menu = document.getElementById('account-menu');
                if (menu) observer.observe(menu, { attributes: true, attributeFilter: ['class'] });

            } else {
                authLinks.innerHTML = `
                    <a href="login.html?mode=login">Login</a>
                    <a href="login.html?mode=register" class="btn btn-primary" style="color:white;padding:0.5rem 1rem;">Sign Up</a>
                `;
            }
        }
    }
};

// Listen for Firebase Auth state changes
document.addEventListener('DOMContentLoaded', () => {
    if (typeof firebase !== 'undefined') {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                // User is signed in
                const localUser = JSON.parse(localStorage.getItem('thaniyam_user') || '{}');
                const emailPart = user.email ? user.email.split('@')[0] : 'User';
                const userData = {
                    id: user.uid,
                    fullname: user.displayName || emailPart,
                    email: user.email || '',
                    photoURL: (user.photoURL && user.photoURL !== 'null') ? user.photoURL : null,
                    role: localUser.role || 'customer'
                };
                localStorage.setItem('thaniyam_user', JSON.stringify(userData));

                // Role sync from Data Connect handled by local backend in future
                // For now, keep existing role or default to customer
            } else {
                // User is signed out
                localStorage.removeItem('thaniyam_user');
            }
            Auth.updateAuthUI();
            Cart.updateCartUI();
        });
    } else {
        Cart.updateCartUI();
        Auth.updateAuthUI();
    }
});

