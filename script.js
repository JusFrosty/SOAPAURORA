/* ==========================================================================
   AURORA JOURNALS - CORE ENGINE (PAYHIP MODAL & 5-IMAGE SLIDER)
   ========================================================================== */

// Exclusive Live Catalog Data with all 5 Gallery Images
const PRODUCTS_DB = [
    {
        id: "soap-bible-journal",
        name: "SOAP Bible Journal",
        price: 8.99,
        images: [
            "images/RealTalk.PNG",
            "images/RealTalk2.PNG",
            "images/RealTalk3.PNG",
            "images/RealTalk4.PNG",
            "images/RealTalk5.PNG"
        ],
        desc: "Our signature high-vibe structural devotional framework utilizing Scripture, Observation, Application, and Prayer to completely elevate your daily quiet time."
    }
];

// Global UI Navigation State
let currentSlideIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    initializeCatalogEngine();
});

/* --- CATALOG DOM RENDER CONTROLLER --- */
function initializeCatalogEngine() {
    const gridSurface = document.getElementById("catalog-grid-surface");
    if (gridSurface) {
        renderCatalogDisplay(gridSurface);
    }
    
    const detailSurface = document.getElementById("product-detail-surface");
    if (detailSurface) {
        renderProductProductProfileDisplay(detailSurface);
    }
}

function renderCatalogDisplay(gridSurface) {
    gridSurface.innerHTML = "";
    const activeItem = PRODUCTS_DB[0];

    const cardNode = document.createElement("div");
    cardNode.className = "product-card";
    
    // FIXED: Changed the quote architecture so the browser executes the click perfectly on the homepage
    cardNode.innerHTML = `
        <div class="product-img-wrapper" onclick="navigateToProduct('soap-bible-journal')">
            <img src="${activeItem.images[0]}" alt="${activeItem.name}">
        </div>
        <div class="product-info">
            <h3 class="product-name" onclick="navigateToProduct('soap-bible-journal')">${activeItem.name}</h3>
            <p class="product-desc">${activeItem.desc}</p>
            <div class="product-meta">
                <span class="product-price">$${activeItem.price.toFixed(2)}</span>
                <button class="btn-secondary" id="home-buy-btn">Add to Bag</button>
            </div>
        </div>
    `;
    gridSurface.appendChild(cardNode);

    // Hardwire the click directly through code to prevent syntax errors
    document.getElementById("home-buy-btn").addEventListener("click", function() {
        executeAddToCart('soap-bible-journal');
    });
}

function renderProductProductProfileDisplay(detailSurface) {
    const targetItem = PRODUCTS_DB[0];
    currentSlideIndex = 0; 

    let slideImagesHTML = "";
    targetItem.images.forEach((imgUrl, index) => {
        slideImagesHTML += `
            <div class="gallery-slide ${index === 0 ? 'active' : ''}">
                <img src="${imgUrl}" alt="${targetItem.name} View ${index + 1}">
            </div>
        `;
    });

    detailSurface.innerHTML = `
        <div class="single-product-layout">
            <div class="gallery-scroller-container">
                <div class="gallery-viewport">
                    ${slideImagesHTML}
                </div>
                <div class="gallery-controls">
                    <button class="gallery-btn prev-btn" onclick="shiftSlide(-1)">❮</button>
                    <div class="gallery-dots" id="gallery-dots-indicator"></div>
                    <button class="gallery-btn next-btn" onclick="shiftSlide(1)">❯</button>
                </div>
            </div>
            <div class="detail-info-surface">
                <h1 class="detail-product-title">${targetItem.name}</h1>
                <div class="detail-product-price">$${targetItem.price.toFixed(2)}</div>
                <p class="detail-product-description">${targetItem.desc}</p>
                <button class="btn-primary checkout-btn" id="shop-buy-btn">Add to Bag</button>
            </div>
        </div>
    `;

    const dotsContainer = document.getElementById("gallery-dots-indicator");
    if (dotsContainer) {
        targetItem.images.forEach((_, idx) => {
            dotsContainer.innerHTML += `
                <span class="dot ${idx === 0 ? 'active' : ''}" onclick="jumpToSlide(${idx})"></span>
            `;
        });
    }

    document.getElementById("shop-buy-btn").addEventListener("click", function() {
        executeAddToCart('soap-bible-journal');
    });
}

/* --- ACTIVE MULTI-IMAGE SLIDER METHODS --- */
window.shiftSlide = function(direction) {
    const slides = document.querySelectorAll(".gallery-slide");
    const dots = document.querySelectorAll(".gallery-dots .dot");
    if (!slides.length) return;
    
    slides[currentSlideIndex].classList.remove("active");
    if (dots.length) dots[currentSlideIndex].classList.remove("active");
    
    currentSlideIndex = (currentSlideIndex + direction + slides.length) % slides.length;
    
    slides[currentSlideIndex].classList.add("active");
    if (dots.length) dots[currentSlideIndex].classList.add("active");
};

window.jumpToSlide = function(index) {
    const slides = document.querySelectorAll(".gallery-slide");
    const dots = document.querySelectorAll(".gallery-dots .dot");
    if (!slides.length) return;
    
    slides[currentSlideIndex].classList.remove("active");
    if (dots.length) dots[currentSlideIndex].classList.remove("active");
    
    currentSlideIndex = index;
    
    slides[currentSlideIndex].classList.add("active");
    if (dots.length) dots[currentSlideIndex].classList.add("active");
};

function navigateToProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

/* ==========================================================================
   PAYHIP EXTERNAL INTEGRATION LAYER (UNIVERSAL FIX)
   ========================================================================== */
function executeAddToCart(productId) {
    const payhipStoreUrl = "https://payhip.com/4ur0raJournals";

    if (window.Payhip && typeof window.Payhip.openCheckout === "function") {
        Payhip.openCheckout({
            url: payhipStoreUrl
        });
    } else {
        setTimeout(() => {
            if (window.Payhip && typeof window.Payhip.openCheckout === "function") {
                Payhip.openCheckout({
                    url: payhipStoreUrl
                });
            } else {
                window.open(payhipStoreUrl, "_blank");
            }
        }, 300);
    }
}
