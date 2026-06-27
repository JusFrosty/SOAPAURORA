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
        renderProductProfileDisplay(detailSurface);
    }
}

function renderCatalogDisplay(gridSurface) {
    gridSurface.innerHTML = "";
    const activeItem = PRODUCTS_DB[0];

    const cardNode = document.createElement("div");
    cardNode.className = "product-card";
    cardNode.innerHTML = `
        <div class="product-img-wrapper" onclick="navigateToProduct('${activeItem.id}')">
            <img src="${activeItem.images[0]}" alt="${activeItem.name}">
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
    currentSlideIndex = 0; // Reset slider state on page load

    // Dynamically build individual slider images
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
                <button class="btn-primary checkout-btn" onclick="executeAddToCart('${targetItem.id}')">Add to Bag</button>
            </div>
        </div>
    `;

    // Inject active navigation pill dots matching the 5 images
    const dotsContainer = document.getElementById("gallery-dots-indicator");
    if (dotsContainer) {
        targetItem.images.forEach((_, idx) => {
            dotsContainer.innerHTML += `
                <span class="dot ${idx === 0 ? 'active' : ''}" onclick="jumpToSlide(${idx})"></span>
            `;
        });
    }
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
   PAYHIP EXTERNAL INTEGRATION LAYER (FIXED TIMING BUG)
   ========================================================================== */
function executeAddToCart(productId) {
    const payhipStoreUrl = "https://payhip.com/4ur0raJournals";

    // 1. If Payhip is fully loaded, launch the popup instantly
    if (window.Payhip && typeof window.Payhip.openCheckout === "function") {
        Payhip.openCheckout({
            url: payhipStoreUrl
        });
    } 
    // 2. If it's still loading in the background, wait 300 milliseconds and try again
    else {
        console.log("Payhip script is still loading... holding checkout for a split second.");
        
        setTimeout(() => {
            if (window.Payhip && typeof window.Payhip.openCheckout === "function") {
                Payhip.openCheckout({
                    url: payhipStoreUrl
                });
            } else {
                // 3. Absolute worst-case scenario (e.g., bad internet connection blocks Payhip), open in a clean tab so the sale isn't lost
                window.open(payhipStoreUrl, "_blank");
            }
        }, 300);
    }
}
