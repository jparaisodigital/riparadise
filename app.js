// ======================
// APPLY CONFIG TO CSS VARS
// ======================
function applyTheme() {
    const root = document.documentElement;
    root.style.setProperty('--bg', CONFIG.colors.bg);
    root.style.setProperty('--text', CONFIG.colors.text);
    root.style.setProperty('--muted', CONFIG.colors.muted);
    root.style.setProperty('--accent', CONFIG.colors.accent);
    root.style.setProperty('--border', CONFIG.colors.border);
    root.style.setProperty('--font-display', CONFIG.fonts.display);
    root.style.setProperty('--font-body', CONFIG.fonts.body);
    
    // Mobile nav background (config-driven)
    if (CONFIG.navMobile) {
        root.style.setProperty('--nav-bg-image', `url("${CONFIG.navMobile.image}")`);
        root.style.setProperty('--nav-overlay', CONFIG.navMobile.overlay);
        root.style.setProperty('--nav-image-opacity', CONFIG.navMobile.imageOpacity ?? 1);
    }
}

// ======================
// RENDER SIDE NAV
// ======================
function renderNav() {
    const navEl = document.getElementById('nav');
    if (!navEl) return;
    
    navEl.innerHTML = CONFIG.nav.map(item => 
        `<a href="${item.href}">${item.label}</a>`
    ).join('');
}

// ======================
// RENDER BOTTOM LOGO + SOCIALS
// ======================
function renderBottom() {
    const logoEl = document.getElementById('logo');
    const socialsEl = document.getElementById('socials');
    
    if (logoEl) {
        logoEl.innerHTML = `<img src="${CONFIG.brand.logo}" alt="${CONFIG.brand.name}" />`;
    }
    
    if (socialsEl) {
        socialsEl.innerHTML = CONFIG.socials.map(s => 
            `<a href="${s.href}" target="_blank" rel="noopener" title="${s.label}">${s.icon}</a>`
        ).join('');
    }
}

// ======================
// SLIDESHOW
// ======================
function initSlideshow() {
    const container = document.getElementById('slideshow');
    if (!container || !CONFIG.slides.length) return;
    
    container.innerHTML = CONFIG.slides.map((src, i) => 
        `<img src="${src}" alt="slide ${i+1}" class="${i === 0 ? 'active' : ''}" />`
).join('');

const images = container.querySelectorAll('img');
let current = 0;

setInterval(() => {
    images[current].classList.remove('active');
    current = (current + 1) % images.length;
    images[current].classList.add('active');
}, 3200);
}

// ======================
// CTA
// ======================
function renderCTA() {
    const btn = document.getElementById('shop-now');
    if (!btn) return;
    btn.textContent = CONFIG.cta.text;
    btn.href = CONFIG.cta.href;
}

// ======================
// PRODUCT GRID
// ======================
function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = CONFIG.products.map(product => {
        const hasHover = product.imageHover ? true : false;
        const isSoldOut = product.soldOut === true;
        
        return `
        <div class="product-card ${isSoldOut ? 'sold-out' : ''}" data-id="${product.id}">
          <div class="product-image-wrap ${hasHover ? 'has-hover' : ''}">
            ${isSoldOut ? '<span class="product-badge">Sold Out</span>' : ''}
            <img src="${product.image}" alt="${product.name}" class="product-image primary" />
            ${hasHover ? `<img src="${product.imageHover}" alt="${product.name}" class="product-image secondary" />` : ''}
          </div>
          <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-price">${formatPrice(product.price)}</div>
          </div>
        </div>
      `;
    }).join('');
    
    
    // Click to open modal
    grid.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            
            const isTouchDevice = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
            
            // Touch only: image click → toggle secondary image
            if (isTouchDevice && e.target.closest('.product-image-wrap')) {
                const wrap = e.target.closest('.product-image-wrap');
                if (wrap.classList.contains('has-hover')) {
                    wrap.classList.toggle('show-secondary');
                }
                return; 
            }
            
            // Desktop (hover) OR touch click sa name/price → open modal
            const id = card.dataset.id;
            const product = CONFIG.products.find(p => p.id === id);
            if (!product || product.soldOut) return;
            
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const side = cardCenter < window.innerWidth / 2 ? 'left' : 'right';
            openProductModal(product, side);
        });
    });
}

// ======================
// PRODUCT DETAIL MODAL
// ======================
let modalOpenToken = 0;

function openProductModal(product, side = 'right') {
    const modal = document.getElementById('product-modal');
    const panel = modal ? modal.querySelector('.product-modal') : null;
    if (!modal || !panel) return;
    
    const token = ++modalOpenToken;
    
    panel.style.transition = 'none';
    modal.classList.remove('active', 'side-left', 'side-right');
    modal.classList.add('side-' + side);
    void panel.offsetWidth;
    
    document.getElementById('pd-image').src = product.image;
    document.getElementById('pd-image').alt = product.name;
    document.getElementById('pd-brand').textContent = CONFIG.brand.shortName;
    document.getElementById('pd-name').textContent = product.name;
    document.getElementById('pd-price').textContent = formatPrice(product.price);
    document.getElementById('pd-description').textContent = product.description;
    
    // Stock note
    let stockNote = document.getElementById('pd-stock-note');
    if (!stockNote) {
        stockNote = document.createElement('p');
        stockNote.id = 'pd-stock-note';
        stockNote.className = 'pd-stock-note';
        const desc = document.getElementById('pd-description');
        desc.parentNode.insertBefore(stockNote, desc);
    }
    stockNote.textContent = 'Stock is limited / subject to availability';
    
    // Disable Add to Cart if sold out
    const addBtn = document.getElementById('pd-add-to-cart');
    if (addBtn) {
        if (product.soldOut) {
            addBtn.textContent = 'SOLD OUT';
            addBtn.disabled = true;
            addBtn.style.opacity = '0.5';
            addBtn.style.cursor = 'not-allowed';
        } else {
            addBtn.textContent = 'ADD TO CART';
            addBtn.disabled = false;
            addBtn.style.opacity = '';
            addBtn.style.cursor = '';
        }
    }
    
    // Sizes
    const sizeSelect = document.getElementById('pd-size');
    sizeSelect.innerHTML = product.sizes.map(size =>
        `<option value="${size}">${size}</option>`
    ).join('');
    
    window.currentProduct = product;
    
    requestAnimationFrame(() => {
        if (token !== modalOpenToken) return;
        panel.style.transition = '';
        requestAnimationFrame(() => {
            if (token !== modalOpenToken) return;
            modal.classList.add('active');
        });
    });
    
    document.body.style.overflow = 'hidden';
}
function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ======================
// SIZE CHART MODAL
// ======================
function openSizeModal() {
    const modal = document.getElementById('size-modal');
    if (!modal) return;
    
    document.getElementById('size-modal-title').textContent = CONFIG.sizeChart.title;
    
    const headers = CONFIG.sizeChart.headers.map(h => `<th>${h}</th>`).join('');
    const rows = CONFIG.sizeChart.rows.map(row => 
        `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
    ).join('');
    
    document.getElementById('size-table').innerHTML = `
    <thead><tr>${headers}</tr></thead>
    <tbody>${rows}</tbody>
  `;
    
    document.getElementById('size-chart-image').innerHTML = 
    `<img src="${CONFIG.sizeChart.image}" alt="Size Chart" />`;
    
    modal.classList.add('active');
}

function closeSizeModal() {
    const modal = document.getElementById('size-modal');
    if (!modal) return;
    modal.classList.remove('active');
}

// ======================
// MODAL EVENTS
// ======================
function initModals() {
    // Product modal close
    const productClose = document.getElementById('product-modal-close');
    const productOverlay = document.getElementById('product-modal');
    if (productClose) productClose.addEventListener('click', closeProductModal);
    if (productOverlay) {
        productOverlay.addEventListener('click', (e) => {
            if (e.target === productOverlay) closeProductModal();
        });
    }
    
    // Size chart button inside product modal
    const sizeBtn = document.getElementById('pd-size-chart-btn');
    if (sizeBtn) {
        sizeBtn.addEventListener('click', openSizeModal);
    }
    
    // Size modal close
    const sizeClose = document.getElementById('size-modal-close');
    const sizeOverlay = document.getElementById('size-modal');
    if (sizeClose) sizeClose.addEventListener('click', closeSizeModal);
    if (sizeOverlay) {
        sizeOverlay.addEventListener('click', (e) => {
            if (e.target === sizeOverlay) closeSizeModal();
        });
    }
    
    // ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSizeModal();
            closeProductModal();
        }
    });
}

// ======================
// PAGE TRANSITIONS
// ======================
function initPageTransitions() {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        
        if (link.classList.contains('no-transition') || link.id === 'success-back-link') return;
        
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === window.location.pathname.split('/').pop()) return;
            
            e.preventDefault();
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = href;
            }, 320);
        });
    });
}

// ======================
// HAMBURGER TOGGLE
// ======================
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when tapping outside of it
    document.addEventListener('click', (e) => {
        if (!nav.classList.contains('open')) return;
        if (nav.contains(e.target) || hamburger.contains(e.target)) return;
        hamburger.classList.remove('active');
        nav.classList.remove('open');
        document.body.style.overflow = '';
    });
}

// ======================
// TOAST NOTIFICATION
// ======================
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// ======================
// ADD TO CART WIRING   
// ======================
const addBtn = document.getElementById('pd-add-to-cart');
if (addBtn) {
    addBtn.addEventListener('click', () => {
        if (!window.currentProduct) return;
        const size = document.getElementById('pd-size').value;
        addToCart(window.currentProduct, size);
        
        closeProductModal();
        showToast('Added to Cart');
    });
}

// ======================
// CART DRAWER
// ======================
function openCart() {
    renderCartDrawer();
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('open');
    document.body.style.overflow = '';
}

function renderCartDrawer() {
    const itemsEl = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    if (!itemsEl) return;
    
    const cart = getCart();
    
    if (!cart.length) {
        itemsEl.innerHTML = '<div class="cart-empty">Cart is empty</div>';
    } else {
        itemsEl.innerHTML = cart.map(item => `
        <div class="cart-item" data-key="${item.key}">
          <img src="${item.image}" alt="${item.name}" />
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-meta">Size: ${item.size}</div>
            <div class="cart-item-row">
              <div class="qty-controls">
                <button data-action="dec">−</button>
                <span>${item.qty}</span>
                <button data-action="inc">+</button>
              </div>
              <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
            </div>
            <button class="cart-item-remove" data-action="remove">Remove</button>
          </div>
        </div>
      `).join('');
        }
        
        if (subtotalEl) subtotalEl.textContent = formatPrice(cartTotal());
        
        // qty / remove events
        itemsEl.querySelectorAll('.cart-item').forEach(row => {
            const key = row.dataset.key;
            row.querySelectorAll('button[data-action]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    if (action === 'inc') updateQty(key, 1);
                    if (action === 'dec') updateQty(key, -1);
                    if (action === 'remove') removeItem(key);
                    renderCartDrawer();
                });
            });
        });
    }
    
    function updateQty(key, delta) {
        const cart = getCart();
        const item = cart.find(i => i.key === key);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) cart.splice(cart.indexOf(item), 1);
        saveCart(cart);
    }
    
    function removeItem(key) {
        saveCart(getCart().filter(i => i.key !== key));
    }
    
    // ======================
    // DRAWER EVENTS
    // ======================
    function initCartDrawer() {
        const drawer = document.getElementById('cart-drawer');
        if (!drawer) return;
        
        document.querySelectorAll('.cart-link').forEach(link => {
            link.addEventListener('click', (e) => {
                if (!document.getElementById('cart-drawer')) return;
                e.preventDefault();
                openCart();
            });
        });
        
        // Block CHECKOUT 
        const checkoutBtn = document.querySelector('.cart-checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', (e) => {
                if (!getCart().length) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    showToast('Cart is empty');
                }
            });
        }
        
        const closeBtn = document.getElementById('cart-drawer-close');
        const overlay = document.getElementById('cart-overlay');
        if (closeBtn) closeBtn.addEventListener('click', closeCart);
        if (overlay) overlay.addEventListener('click', closeCart);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeCart();
        });
    }
    
    document.addEventListener('DOMContentLoaded', initCartDrawer);
    
    
    // ======================
    // INIT
    // ======================
    document.addEventListener('DOMContentLoaded', () => {
        applyTheme();
        renderNav();
        renderBottom();
        initSlideshow();
        renderCTA();
        renderProducts();
        initModals();
        initPageTransitions();
        renderGallery();
        initGalleryLightbox();
        renderChaptersMedia();
        renderChaptersManifesto();
        renderChaptersTimeline();
        renderFooterThanks();
        initScrollTopButton();
        
        // Show toast if redirected from empty checkout
        if (sessionStorage.getItem('rip_notice') === 'empty_cart') {
            sessionStorage.removeItem('rip_notice');
            showToast('Cart is empty');
        }
    });
    
    // ======================
    // CHAPTERS GALLERY (mosaic + tilt + lightbox)
    // ======================
    function renderGallery() {
        const mosaic = document.getElementById('gallery-mosaic');
        if (!mosaic || !CONFIG.gallery || !CONFIG.gallery.length) return;
        
        mosaic.innerHTML = CONFIG.gallery.map((item, i) => {
            const sizeClass = 'size-' + (item.size || 'medium');
            return `
        <div class="gallery-item ${sizeClass}" data-index="${i}">
          <img src="${item.image}" alt="Chapter ${i + 1}" loading="lazy" />
        </div>`;
        }).join('');
        
        // Click → lightbox
        mosaic.querySelectorAll('.gallery-item').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.index, 10);
                openGalleryLightbox(CONFIG.gallery[idx].image);
            });
        });
        
        // 3D tilt on hover (desktop)
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            initGalleryTilt(mosaic);
        }
    }
    
    function initGalleryTilt(container) {
        const items = container.querySelectorAll('.gallery-item');
        
        items.forEach(item => {
            const img = item.querySelector('img');
            if (!img) return;
            
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const midX = rect.width / 2;
                const midY = rect.height / 2;
                
                // Max tilt ±8deg
                const rotateY = ((x - midX) / midX) * 8;
                const rotateX = ((midY - y) / midY) * 8;
                
                item.classList.add('is-tilting');
                img.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
            });
            
            item.addEventListener('mouseleave', () => {
                item.classList.remove('is-tilting');
                img.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }
    
    function openGalleryLightbox(src) {
        const overlay = document.getElementById('gallery-lightbox');
        const img = document.getElementById('gallery-lightbox-img');
        if (!overlay || !img) return;
        
        img.src = src;
        img.alt = 'Chapter';
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeGalleryLightbox() {
        const overlay = document.getElementById('gallery-lightbox');
        if (!overlay) return;
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function initGalleryLightbox() {
        const closeBtn = document.getElementById('gallery-lightbox-close');
        const overlay = document.getElementById('gallery-lightbox');
        
        if (closeBtn) closeBtn.addEventListener('click', closeGalleryLightbox);
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeGalleryLightbox();
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeGalleryLightbox();
        });
    }
    
    // ======================
    // CHAPTERS MEDIA (IG embed + picture)
    // ======================
    function renderChaptersMedia() {
        const section = document.getElementById('chapters-media');
        if (!section || !CONFIG.chaptersMedia) return;
        
        const reelEl = document.getElementById('chapters-media-reel');
        const imageEl = document.getElementById('chapters-media-image');
        const media = CONFIG.chaptersMedia;
        
        // Picture
        if (imageEl && media.image) {
            imageEl.innerHTML = `<img src="${media.image}" alt="${media.imageAlt || 'R.I.PARADISE'}" />`;
        }
        
        // Instagram embed
        if (reelEl && media.instagramEmbed) {
            const permalink = media.instagramEmbed.replace(/\/$/, '');
            reelEl.innerHTML = `
            <blockquote class="instagram-media"
                data-instgrm-permalink="${permalink}"
                data-instgrm-version="14"
                style="background:#000; border:0; margin:0; max-width:100%; width:100%; min-width:0;">
            </blockquote>
        `;
            
            const matchHeights = () => {
                if (window.innerWidth <= 700) {
                    imageEl.style.height = '';
                    return;
                }
                const h = reelEl.offsetHeight;
                if (h > 100) {
                    // exact match
                    imageEl.style.height = h + 'px';
                }
            };
            
            if (!window._igEmbedLoaded) {
                const script = document.createElement('script');
                script.src = 'https://www.instagram.com/embed.js';
                script.async = true;
                script.onload = () => {
                    window._igEmbedLoaded = true;
                    if (window.instgrm && window.instgrm.Embeds) {
                        window.instgrm.Embeds.process();
                    }
                    // wait a bit for embed to render
                    setTimeout(matchHeights, 800);
                    setTimeout(matchHeights, 1600);
                };
                document.body.appendChild(script);
            } else if (window.instgrm && window.instgrm.Embeds) {
                window.instgrm.Embeds.process();
                setTimeout(matchHeights, 800);
                setTimeout(matchHeights, 1600);
            }
            
            window.addEventListener('resize', matchHeights);
        }
    }
    
    function renderChaptersManifesto() {
        const section = document.getElementById('chapters-manifesto');
        const titleEl = document.getElementById('chapters-manifesto-title');
        const textEl = document.getElementById('chapters-manifesto-text');
        if (!section || !CONFIG.chaptersManifesto) return;
        
        // Toggle
        if (CONFIG.chaptersManifesto.enabled === false) {
            section.style.display = 'none';
            return;
        }
        section.style.display = '';
        
        if (titleEl) titleEl.textContent = CONFIG.chaptersManifesto.title || '';
        if (textEl) textEl.textContent = CONFIG.chaptersManifesto.text || '';
    }
    
    function renderChaptersTimeline() {
        const section = document.getElementById('chapters-timeline');
        const listEl = document.getElementById('chapters-timeline-list');
        if (!section || !listEl || !CONFIG.chaptersTimeline) return;
        
        if (CONFIG.chaptersTimeline.enabled === false) {
            section.style.display = 'none';
            return;
        }
        section.style.display = '';
        
        const items = CONFIG.chaptersTimeline.items || [];
        listEl.innerHTML = items.map(item => `
        <div class="chapters-timeline-item">
            <div class="chapters-timeline-year">${item.year}</div>
            <div class="chapters-timeline-dot"></div>
            <div class="chapters-timeline-text">${item.text}</div>
        </div>
    `).join('');
        }
        
        // ======================
        // FOOTER THANK YOU (chapters.html — tombstone rubbing)
        // ======================
        function renderFooterThanks() {
            const section = document.getElementById('footer-thanks');
            if (!section || !CONFIG.footerThanks) return;
            
            const cfg = CONFIG.footerThanks;
            
            // ON/OFF switch
            if (cfg.enabled === false) {
                section.style.display = 'none';
                return;
            }
            section.style.display = '';
            
            section.style.backgroundImage = `url("${cfg.backgroundImage}")`;
            
            document.getElementById('ft-title').textContent = cfg.title;
            const ftMessageEl = document.getElementById('ft-message');
            const lines = cfg.message.split('\n').filter(line => line.trim());
            ftMessageEl.innerHTML = lines.map(line => `<span class="ft-line">${line}</span>`).join('');
            document.getElementById('ft-signature').textContent = cfg.signature;
            
            const canvas = document.getElementById('ft-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            
            function sizeCanvas() {
                const rect = canvas.getBoundingClientRect();
                canvas.width = Math.round(rect.width);
                canvas.height = Math.round(rect.height);
            }
            
            // Noise fallback 
            function paintNoiseFallback() {
                ctx.globalCompositeOperation = 'source-over';
                ctx.fillStyle = '#87857f';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < 800; i++) {
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    const s = 115 + Math.floor(Math.random() * 45);
                    ctx.fillStyle = `rgba(${s},${s},${s - 6},0.5)`;
                    ctx.fillRect(x, y, 1.4, 1.4);
                }
            }
            
            // Cover-fit crop 
            function drawCoverImage(img) {
                const cw = canvas.width, ch = canvas.height;
                const ir = img.width / img.height;
                const cr = cw / ch;
                let sx, sy, sw, sh;
                if (ir > cr) {
                    sh = img.height;
                    sw = sh * cr;
                    sx = (img.width - sw) / 2;
                    sy = 0;
                } else {
                    sw = img.width;
                    sh = sw / cr;
                    sx = 0;
                    sy = (img.height - sh) / 2;
                }
                ctx.globalCompositeOperation = 'source-over';
                ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
            }
            
            function paintCover() {
                if (cfg.coverImage) {
                    const img = new Image();
                    img.onload = () => drawCoverImage(img);
                    img.onerror = () => paintNoiseFallback();
                    img.src = cfg.coverImage;
                } else {
                    paintNoiseFallback();
                }
            }
            
            function paintOrClear() {
                sizeCanvas();
                paintCover();  
            }
            paintOrClear();
            window.addEventListener('resize', paintOrClear);
            
            let drawing = false;
            let last = null;
            let rubbed = false;
            
            function pos(e) {
                const rect = canvas.getBoundingClientRect();
                const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
                const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
                return { x: cx * (canvas.width / rect.width), y: cy * (canvas.height / rect.height) };
            }
            
            function rub(p) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = 32;
                ctx.beginPath();
                if (last) ctx.moveTo(last.x, last.y); else ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x, p.y);
                ctx.stroke();
                for (let i = 0; i < 8; i++) {
                    const rx = p.x + (Math.random() - 0.5) * 28;
                    const ry = p.y + (Math.random() - 0.5) * 28;
                    ctx.globalAlpha = 0.5 + Math.random() * 0.5;
                    ctx.beginPath();
                    ctx.arc(rx, ry, 1 + Math.random() * 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
                last = p;
                rubbed = true;
            }
            
            function start(e) { drawing = true; last = null; rub(pos(e)); e.preventDefault(); }
            function move(e) { if (!drawing) return; rub(pos(e)); e.preventDefault(); }
            function end() {
                drawing = false;
                last = null;
            }
            
            canvas.addEventListener('mousedown', start);
            canvas.addEventListener('mousemove', move);
            window.addEventListener('mouseup', end);
            canvas.addEventListener('touchstart', start, { passive: false });
            canvas.addEventListener('touchmove', move, { passive: false });
            canvas.addEventListener('touchend', end);
        }
        
        // ======================
        // SCROLL TO TOP BUTTON - CHAPTERS
        // ======================
        function initScrollTopButton() {
            const btn = document.getElementById('scroll-top-btn');
            if (!btn) return;
            
            const manifesto = document.querySelector('.chapters-manifesto');
            const header = document.querySelector('.site-header');
            const hero = document.querySelector('.chapters-main');
            const threshold = (manifesto ? manifesto.offsetHeight : 0) +
            (header ? header.offsetHeight : 0) +
            (hero ? hero.offsetHeight : 400);
            
            let lastY = window.scrollY;
            
            function updateButton() {
                const currentY = window.scrollY;
                const scrollingDown = currentY > lastY;
                const pastHero = currentY > threshold;
                
                if (pastHero && scrollingDown) {
                    btn.classList.add('show');
                } else {
                    btn.classList.remove('show');
                }
                
                lastY = currentY;
            }
            
            window.addEventListener('scroll', updateButton, { passive: true });
            
            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }