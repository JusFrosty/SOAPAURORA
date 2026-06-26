/* ==========================================================================
   AURORA JOURNALS - CORE ENGINE (BUG-FREE SINGLE PRODUCT SETUP)
   ========================================================================== */

// Exclusive Live Catalog Data
const PRODUCTS_DB = [
    {
        id: "soap-bible-journal",
        name: "SOAP Bible Journal",
        price: 8.99,
        image: "images/RealTalk.PNG",
        desc: "Our signature high-vibe structural devotional framework utilizing Scripture, Observation, Application, and Prayer to completely elevate your daily quiet time."
    }
];

// Global Transactional Application State
let cartState = [];

document.addEventListener("DOMContentLoaded", () => {
    initializeCartUX();
    initializeCatalogEngine();
});

/* --- CATALOG DOM RENDER CONTROLLER --- */
function initializeCatalogEngine() {
    // 1. Handle Grid Rendering (Home & Shop pages)
    const gridSurface = document.getElementById("catalog-grid-surface");
    if (gridSurface) {
        renderCatalogDisplay(gridSurface);
        
        const searchField = document.getElementById("shop-search-field");
        if (searchField) {
            searchField.addEventListener("input", (e) => {
                renderCatalogDisplay(gridSurface, e.target.value.trim());
            });
        }
    }
    
    // 2. Handle Individual Product Profile Pages (product.html)
    const detailSurface = document.getElementById("product-detail-surface");
    if (detailSurface) {
        renderProductProfileDisplay(detailSurface);
    }
}

function renderCatalogDisplay(gridSurface, filterQuery = "") {
    gridSurface.innerHTML = "";
    const activeItem = PRODUCTS_DB[0];

    // Simple matching if search is utilized
    if (filterQuery && !activeItem.name.toLowerCase().includes(filterQuery.toLowerCase())) {
        gridSurface.innerHTML = `<p class="empty-cart-msg">No products match your search criteria.</p>`;
        return;
    }

    const cardNode = document.createElement("div");
    cardNode.className = "product-card";
    cardNode.innerHTML = `
        <div class="product-img-wrapper" onclick="navigateToProduct('${activeItem.id}')">
            <img src="${activeItem.image}" alt="${activeItem.name}">
        </div>
        <div class="product-info">
            <h3 class="product-name" onclick="navigateToProduct('${activeItem.id}')">${activeItem.name}</h3>
            <p class="product-desc">${activeItem.desc}</p>
            <div class="product-meta">
                <span class="product-price">$${activeItem.price.toFixed(2)}</span>
                <button class="btn-secondary" onclick="executeAddToCart('${activeItem.id}')">Add to Bag</button>
            </div>
        </div>
    `;
    gridSurface.appendChild(cardNode);
}

function renderProductProfileDisplay(detailSurface) {
    const targetItem = PRODUCTS_DB[0];

    detailSurface.innerHTML = `
        <div class="single-product-layout">
            <div class="detail-gallery-surface">
                <img src="${targetItem.image}" alt="${targetItem.name}">
            </div>
            <div class="detail-info-surface">
                <h1 class="detail-product-title">${targetItem.name}</h1>
                <div class="detail-product-price">$${targetItem.price.toFixed(2)}</div>
                <p class="detail-product-description">${targetItem.desc}</p>
                <button class="btn-primary checkout-btn" onclick="executeAddToCart('${targetItem.id}')">Add to Bag</button>
            </div>
        </div>
    `;
}

function navigateToProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

/* --- TRANSACTIONAL CART DRAWER UX CONTROLLER --- */
function initializeCartUX() {
    const openNodes = document.querySelectorAll(".cart-btn, #nav-cart-trigger");
    const closeNode = document.getElementById("close-cart-drawer");
    const overlayNode = document.getElementById("cart-global-overlay");
    const drawerNode = document.getElementById("cart-global-drawer");

    if (!overlayNode || !drawerNode) return;

    const toggleCart = () => {
        overlayNode.classList.toggle("open");
        drawerNode.classList.toggle("open");
        syncCartDrawerUI();
    };

    openNodes.forEach(btn => btn.addEventListener("click", toggleCart));
    if (closeNode) closeNode.addEventListener("click", toggleCart);
    if (overlayNode) overlayNode.addEventListener("click", toggleCart);

    // Initial storage sync check
    const cachedCart = localStorage.getItem("aurora_cart");
    if (cachedCart) {
        try {
            cartState = JSON.parse(cachedCart);
            updateCartBadgeIndicators();
        } catch (e) {
            cartState = [];
        }
    }
}

function executeAddToCart(productId) {
    const inventoryMatch = PRODUCTS_DB.find(p => p.id === productId);
    if (!inventoryMatch) return;

    const cartMatch = cartState.find(item => item.id === productId);
    if (cartMatch) {
        cartMatch.quantity += 1;
    } else {
        cartState.push({ ...inventoryMatch, quantity: 1 });
    }

    localStorage.setItem("aurora_cart", JSON.stringify(cartState));
    updateCartBadgeIndicators();
    syncCartDrawerUI();

    // Open drawer seamlessly
    const overlayNode = document.getElementById("cart-global-overlay");
    const drawerNode = document.getElementById("cart-global-drawer");
    if (overlayNode && drawerNode) {
        overlayNode.classList.add("open");
        drawerNode.classList.add("open");
    }
}

function modifyCartQuantity(productId, modifier) {
    const itemMatch = cartState.find(item => item.id === productId);
    if (!itemMatch) return;

    itemMatch.quantity += modifier;
    if (itemMatch.quantity <= 0) {
        cartState = cartState.filter(item => item.id !== productId);
    }

    localStorage.setItem("aurora_cart", JSON.stringify(cartState));
    updateCartBadgeIndicators();
    syncCartDrawerUI();
}

function updateCartBadgeIndicators() {
    const totalCount = cartState.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll(".cart-count").forEach(node => {
        node.textContent = totalCount;
    });
}

function syncCartDrawerUI() {
    const listSurface = document.getElementById("drawer-items-surface");
    const operationalTotalNode = document.getElementById("drawer-computed-total");
    if (!listSurface || !operationalTotalNode) return;

    listSurface.innerHTML = "";

    if (cartState.length === 0) {
        listSurface.innerHTML = `<p class="empty-cart-msg">Your shopping bag is completely empty.</p>`;
        operationalTotalNode.textContent = "$0.00";
        return;
    }

    let runningTotal = 0;

    cartState.forEach(item => {
        runningTotal += item.price * item.quantity;
        const itemRow = document.createElement("div");
        itemRow.className = "cart-item";
        itemRow.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-meta">$${item.price.toFixed(2)} &times; ${item.quantity}</div>
                <button class="remove-item" onclick="modifyCartQuantity('${item.id}', -${item.quantity})">Remove</button>
            </div>
        `;
        listSurface.appendChild(itemRow);
    });

    operationalTotalNode.textContent = `$${runningTotal.toFixed(2)}`;
}
