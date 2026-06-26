/* ==========================================================================
   FAITHFUL PAGES - GLOBAL BUSINESS ENGINE
   ========================================================================== */

// Shared Static Catalog Database
const PRODUCTS_DB = [
    {
        id: "soap-bible-journal",
        name: "SOAP Bible Journal",
        price: 6.99,
        image: "images/RealTalk.png",
        desc: "A structural devotional framework utilizing Scripture, Observation, Application, and Prayer variables to unlock foundational study routines."
    },
    {
        id: "prayer-journal",
        name: "Prayer Journal",
        price: 5.99,
        image: "images/RealTalk2.png",
        desc: "An intentional repository optimized for cataloging daily intercessions, requests, and structural declarations of personal gratitude."
    },
    {
        id: "faith-planner",
        name: "Faith Planner",
        price: 8.89,
        image: "images/RealTalk3.png",
        desc: "A premium hybrid calendar framework combining daily task-management configurations with custom spiritual milestone pacing structures."
    }
];

// Persistent App State Management Matrix
let ApplicationCart = JSON.parse(localStorage.getItem('FP_CART_STORAGE')) || [];

document.addEventListener("DOMContentLoaded", () => {
    InitializeSystemCartComponents();
    
    // Core Engine Interceptor Routing Configurations
    if (document.getElementById("bestseller-injection-target")) {
        RenderProductGrid(PRODUCTS_DB, "bestseller-injection-target");
    }
    if (document.getElementById("shop-injection-target")) {
        RenderProductGrid(PRODUCTS_DB, "shop-injection-target");
        SetupStorefrontSearchFilter();
    }
    if (document.getElementById("dynamic-product-root")) {
        CompileDynamicProductDataView();
    }
});

/* ==========================================================================
   STORE FRONT END RENDER CONTROLLERS
   ========================================================================== */
function RenderProductGrid(productsArray, elementTargetId) {
    const layerTarget = document.getElementById(elementTargetId);
    if(!layerTarget) return;
    
    layerTarget.innerHTML = "";
    if(productsArray.length === 0) {
        layerTarget.innerHTML = `<p class="empty-cart-msg">No products found fitting this profile matches.</p>`;
        return;
    }

    productsArray.forEach(product => {
        const productCardDOM = document.createElement("div");
        productCardDOM.className = "product-card";
        productCardDOM.innerHTML = `
            <div class="product-img-wrapper" onclick="RouteToProductProfile('${product.id}')">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200x200?text=Faithful+Pages'">
            </div>
            <div class="product-info">
                <h3 class="product-name" onclick="RouteToProductProfile('${product.id}')">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-meta">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="btn-secondary" onclick="CommitProductToCart('${product.id}')">Add To Cart</button>
                </div>
            </div>
        `;
        layerTarget.appendChild(productCardDOM);
    });
}

function SetupStorefrontSearchFilter() {
    const inputField = document.getElementById("shop-search-field");
    if (!inputField) return;
    inputField.addEventListener("input", (e) => {
        const clearTerm = e.target.value.toLowerCase().trim();
        const isolatedMatches = PRODUCTS_DB.filter(p => 
            p.name.toLowerCase().includes(clearTerm) || 
            p.desc.toLowerCase().includes(clearTerm)
        );
        RenderProductGrid(isolatedMatches, "shop-injection-target");
    });
}

function RouteToProductProfile(id) {
    window.location.href = `product.html?pid=${id}`;
}

/* ==========================================================================
   DYNAMIC INDIVIDUAL PRODUCT ENGINE
   ========================================================================== */
function CompileDynamicProductDataView() {
    const queryParams = new URLSearchParams(window.location.search);
    const selectedProductId = queryParams.get("pid") || "soap-bible-journal"; // Failover fallback profile
    const catalogMatch = PRODUCTS_DB.find(p => p.id === selectedProductId);

    if (!catalogMatch) return;

    document.getElementById("dp-title").innerText = catalogMatch.name;
    document.getElementById("dp-price").innerText = `$${catalogMatch.price.toFixed(2)}`;
    document.getElementById("dp-desc").innerText = catalogMatch.desc;
    
    const imageDOM = document.getElementById("dp-image");
    imageDOM.src = catalogMatch.image;
    imageDOM.alt = catalogMatch.name;

    const actionButton = document.getElementById("dp-action-btn");
    actionButton.onclick = () => {
        CommitProductToCart(catalogMatch.id);
    };
}

/* ==========================================================================
   CART TRANSACTION CONTROLLER OPERATIONS
   ========================================================================== */
function InitializeSystemCartComponents() {
    const triggerBtn = document.getElementById("cart-trigger-node");
    const closeBtn = document.getElementById("cart-close-node");
    const overlay = document.getElementById("cart-overlay-node");

    if (triggerBtn) triggerBtn.addEventListener("click", ToggleCartDrawerVisibility);
    if (closeBtn) closeBtn.addEventListener("click", ToggleCartDrawerVisibility);
    if (overlay) overlay.addEventListener("click", ToggleCartDrawerVisibility);

    SynchronizeCartStateInterface();
}

function ToggleCartDrawerVisibility() {
    document.getElementById("cart-drawer-node").classList.toggle("open");
    document.getElementById("cart-overlay-node").classList.toggle("open");
}

function CommitProductToCart(id) {
    const masterReference = PRODUCTS_DB.find(p => p.id === id);
    if(!masterReference) return;

    const cartMatchIndex = ApplicationCart.findIndex(item => item.id === id);

    if (cartMatchIndex > -1) {
        ApplicationCart[cartMatchIndex].quantity += 1;
    } else {
        ApplicationCart.push({
            id: masterReference.id,
            name: masterReference.name,
            price: masterReference.price,
            image: masterReference.image,
            quantity: 1
        });
    }

    SyncAndCommitStorage();
    // Micro interaction feedback layout loop: slide cart open instantly on addition
    document.getElementById("cart-drawer-node").classList.add("open");
    document.getElementById("cart-overlay-node").classList.add("open");
}

function TerminateCartLineItem(id) {
    ApplicationCart = ApplicationCart.filter(item => item.id !== id);
    SyncAndCommitStorage();
}

function SyncAndCommitStorage() {
    localStorage.setItem('FP_CART_STORAGE', JSON.stringify(ApplicationCart));
    SynchronizeCartStateInterface();
}

function SynchronizeCartStateInterface() {
    // Sync Counter Node Elements Globally
    const totalCount = ApplicationCart.reduce((sum, item) => sum + item.quantity, 0);
    const runtimeCounters = document.querySelectorAll(".cart-count");
    runtimeCounters.forEach(node => node.innerText = totalCount);

    // Sync Cart List Container Items UI View
    const listBody = document.getElementById("cart-items-wrapper");
    if (!listBody) return;

    listBody.innerHTML = "";
    
    if(ApplicationCart.length === 0) {
        listBody.innerHTML = `<p class="empty-cart-msg">Your shopping bag is currently empty.</p>`;
        document.getElementById("cart-running-total").innerText = "$0.00";
        return;
    }

    let computationRunningSum = 0;

    ApplicationCart.forEach(item => {
        const itemLineCost = item.price * item.quantity;
        computationRunningSum += itemLineCost;

        const cartLineDOM = document.createElement("div");
        cartLineDOM.className = "cart-item";
        cartLineDOM.innerHTML = `
            <img class="cart-item-img" src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-meta">${item.quantity} × $${item.price.toFixed(2)}</div>
                <button class="remove-item" onclick="TerminateCartLineItem('${item.id}')">Remove</button>
            </div>
            <div style="font-weight:600; font-size:0.95rem;">$${itemLineCost.toFixed(2)}</div>
        `;
        listBody.appendChild(cartLineDOM);
    });

    document.getElementById("cart-running-total").innerText = `$${computationRunningSum.toFixed(2)}`;
}
