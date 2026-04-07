const API_BASE_URL = 'http://localhost:8000/api/products';
let products = [];
let currentBrand = 'all';
let currentCategory = 'all';
let featuredOnly = false;
let currentSort = 'default';
let currentView = 'grid';
let currentPage = 1;
const ITEMS_PER_PAGE = 12;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Catalog page loaded');
    loadProducts();
    initializeSidebarInteractions();
    initializeViewControls();
    initializeModal();
    addScrollAnimations();
});

/* ==============================
   API & DATA LOADING
   ============================== */

async function loadProducts() {
    try {
        showLoadingState();
        const response = await fetch(`${API_BASE_URL}/catalog/`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        products = result.data || [];
        console.log('Total products:', products.length);
        updateCounts();
        buildCategoryFilter();
        applyFiltersAndRender();
    } catch (error) {
        console.error('Error loading products:', error);
        displayError();
    }
}

function showLoadingState() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:4rem 0;">
            <div style="width:56px;height:56px;border:4px solid #f3f3f3;border-top-color:#D4AF37;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 1.25rem;"></div>
            <p style="color:#6c757d;font-size:1rem;">Memuat produk...</p>
        </div>
    `;
    document.getElementById('resultsCount').textContent = 'Memuat produk...';
}

function displayError() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = `
        <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h3>Gagal Memuat Produk</h3>
            <p>Tidak dapat terhubung ke server. Periksa koneksi dan coba lagi.</p>
            <button onclick="location.reload()" style="margin-top:1.5rem;padding:0.7rem 2rem;background:#D4AF37;color:#fff;border:none;border-radius:50px;font-weight:700;cursor:pointer;">Coba Lagi</button>
        </div>
    `;
    document.getElementById('resultsCount').textContent = 'Error memuat produk';
}

/* ==============================
   FILTER LOGIC
   ============================== */

function getFilteredProducts() {
    let result = [...products];

    // Brand filter
    if (currentBrand !== 'all') {
        result = result.filter(p => p.brand_slug === currentBrand);
    }

    // Category filter
    if (currentCategory !== 'all') {
        result = result.filter(p => p.category_name === currentCategory);
    }

    // Featured filter
    if (featuredOnly) {
        result = result.filter(p => p.featured);
    }

    // Sort
    switch (currentSort) {
        case 'price-asc':
            result.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
            break;
        case 'price-desc':
            result.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
            break;
        case 'name-asc':
            result.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'featured':
            result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            break;
    }

    return result;
}

function applyFiltersAndRender() {
    currentPage = 1;
    const filtered = getFilteredProducts();
    updateResultsBar(filtered.length);
    updateActiveFilters();
    renderProducts(filtered);
}

function updateCounts() {
    const countEl = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };
    countEl('count-all', products.length);
    const brands = ['heritage', 'patisserie', 'catering', 'express', 'tujie'];
    brands.forEach(b => {
        const c = products.filter(p => p.brand_slug === b).length;
        countEl(`count-${b}`, c);
    });
}

function buildCategoryFilter() {
    const categories = [...new Set(products.map(p => p.category_name).filter(Boolean))];
    const section = document.getElementById('categorySection');
    const options = document.getElementById('categoryOptions');
    if (!section || !options || categories.length === 0) return;

    section.style.display = '';
    options.innerHTML = `
        <label class="sidebar-option active" data-value="all">
            <span class="option-radio"></span>
            <span class="option-label">Semua Kategori</span>
            <span class="option-count">${products.length}</span>
        </label>
        ${categories.map(cat => `
            <label class="sidebar-option" data-value="${cat}">
                <span class="option-radio"></span>
                <span class="option-label">${cat}</span>
                <span class="option-count">${products.filter(p => p.category_name === cat).length}</span>
            </label>
        `).join('')}
    `;

    // Bind events
    options.querySelectorAll('.sidebar-option').forEach(opt => {
        opt.addEventListener('click', () => {
            options.querySelectorAll('.sidebar-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            currentCategory = opt.dataset.value;
            applyFiltersAndRender();
        });
    });
}

/* ==============================
   SIDEBAR INTERACTIONS
   ============================== */

function initializeSidebarInteractions() {
    // Brand filter
    const brandOptions = document.querySelectorAll('#brandOptions .sidebar-option');
    brandOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            brandOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            currentBrand = opt.dataset.value;
            applyFiltersAndRender();
        });
    });

    // Featured toggle
    const featuredCheck = document.getElementById('featuredOnly');
    if (featuredCheck) {
        featuredCheck.addEventListener('change', () => {
            featuredOnly = featuredCheck.checked;
            applyFiltersAndRender();
        });
    }

    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            currentSort = sortSelect.value;
            applyFiltersAndRender();
        });
    }

    // Reset filters
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentBrand = 'all';
            currentCategory = 'all';
            featuredOnly = false;
            currentSort = 'default';

            document.querySelectorAll('#brandOptions .sidebar-option').forEach((o, i) => {
                o.classList.toggle('active', i === 0);
            });
            document.querySelectorAll('#categoryOptions .sidebar-option').forEach((o, i) => {
                o.classList.toggle('active', i === 0);
            });
            const featuredCb = document.getElementById('featuredOnly');
            if (featuredCb) featuredCb.checked = false;
            const sortSel = document.getElementById('sortSelect');
            if (sortSel) sortSel.value = 'default';

            applyFiltersAndRender();
        });
    }

    // Mobile sidebar toggle
    const mobileBtn = document.getElementById('mobileFilterBtn');
    const sidebar = document.getElementById('catalogSidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (mobileBtn && sidebar && overlay) {
        mobileBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        overlay.addEventListener('click', closeMobileSidebar);
    }

    // Collapsible sections
    document.querySelectorAll('.sidebar-section-title').forEach(title => {
        title.addEventListener('click', () => {
            const section = title.closest('.sidebar-section');
            section.classList.toggle('collapsed');
        });
    });
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('catalogSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

/* ==============================
   VIEW TOGGLE
   ============================== */

function initializeViewControls() {
    const gridBtn = document.getElementById('gridViewBtn');
    const listBtn = document.getElementById('listViewBtn');
    const grid    = document.getElementById('productGrid');

    if (gridBtn && listBtn && grid) {
        gridBtn.addEventListener('click', () => {
            currentView = 'grid';
            grid.classList.remove('list-view');
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        });

        listBtn.addEventListener('click', () => {
            currentView = 'list';
            grid.classList.add('list-view');
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        });
    }
}

/* ==============================
   RESULTS BAR & ACTIVE FILTERS
   ============================== */

function updateResultsBar(total) {
    const el = document.getElementById('resultsCount');
    if (!el) return;
    const start = Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, total);
    const end   = Math.min(currentPage * ITEMS_PER_PAGE, total);
    if (total === 0) {
        el.textContent = 'Tidak ada produk ditemukan';
    } else {
        el.innerHTML = `Menampilkan <strong>${start}–${end}</strong> dari <strong>${total}</strong> produk`;
    }
}

function updateActiveFilters() {
    const container = document.getElementById('activeFilters');
    if (!container) return;

    const tags = [];
    if (currentBrand !== 'all')    tags.push({ label: `Brand: ${getBrandDisplayName(currentBrand)}`, action: () => { currentBrand = 'all'; resetBrandUI(); applyFiltersAndRender(); } });
    if (currentCategory !== 'all') tags.push({ label: `Kategori: ${currentCategory}`, action: () => { currentCategory = 'all'; resetCategoryUI(); applyFiltersAndRender(); } });
    if (featuredOnly)               tags.push({ label: 'Featured saja', action: () => { featuredOnly = false; const cb = document.getElementById('featuredOnly'); if (cb) cb.checked = false; applyFiltersAndRender(); } });

    if (tags.length === 0) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
    }

    container.style.display = 'flex';
    container.innerHTML = tags.map((t, i) => `
        <span class="filter-tag" data-index="${i}">
            ${t.label}
            <button title="Hapus filter">×</button>
        </span>
    `).join('');

    container.querySelectorAll('.filter-tag button').forEach((btn, i) => {
        btn.addEventListener('click', () => tags[i].action());
    });
}

function resetBrandUI() {
    document.querySelectorAll('#brandOptions .sidebar-option').forEach((o, i) => o.classList.toggle('active', i === 0));
}

function resetCategoryUI() {
    document.querySelectorAll('#categoryOptions .sidebar-option').forEach((o, i) => o.classList.toggle('active', i === 0));
}

/* ==============================
   RENDER PRODUCTS
   ============================== */

function renderProducts(filtered) {
    const grid = document.getElementById('productGrid');
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(12px)';

    setTimeout(() => {
        grid.innerHTML = '';

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M3 3h18v18H3V3z"/><path d="M3 9h18M9 21V9"/>
                    </svg>
                    <h3>Produk Tidak Ditemukan</h3>
                    <p>Coba ubah filter atau kategori yang dipilih.</p>
                </div>
            `;
            hidePagination();
        } else {
            // Pagination slice
            const total = filtered.length;
            const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
            const pageItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

            pageItems.forEach((product, index) => {
                const card = createProductCard(product, index);
                grid.appendChild(card);
            });

            renderPagination(total, totalPages);
            updateResultsBar(total);
        }

        if (currentView === 'list') grid.classList.add('list-view');

        setTimeout(() => {
            grid.style.opacity = '1';
            grid.style.transform = 'translateY(0)';
        }, 30);
    }, 180);
}

function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.04}s`;

    const imageUrl = product.image
        ? `${API_BASE_URL.replace('/api/products', '')}${product.image}`
        : 'assets/placeholder.jpg';

    const rawDesc = product.short_description || product.description || '';
    const desc = rawDesc.length > 100 ? rawDesc.substring(0, 100) + '...' : rawDesc;

    card.innerHTML = `
        <div class="product-image" style="background-image:url('${imageUrl}');">
            <div class="product-badge ${product.brand_slug || ''}">${product.brand_name || 'Favor'}</div>
            ${product.featured ? '<div class="product-featured-badge">★ Featured</div>' : ''}
        </div>
        <div class="product-content">
            <div class="product-category">${product.category_name || 'Produk'}</div>
            <h3>${product.name}</h3>
            <p class="product-description">${desc}</p>
            <div class="product-footer">
                <span class="product-price">${product.formatted_price || 'Rp ' + formatPrice(product.price)}</span>
                <a href="#" class="product-link" data-slug="${product.slug}">
                    Detail
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
        </div>
    `;

    card.querySelector('.product-link').addEventListener('click', e => {
        e.preventDefault();
        openModalBySlug(product.slug);
    });

    card.addEventListener('click', e => {
        if (!e.target.closest('.product-link')) openModalBySlug(product.slug);
    });

    return card;
}

/* ==============================
   PAGINATION
   ============================== */

function renderPagination(total, totalPages) {
    const bar = document.getElementById('paginationBar');
    if (!bar) return;

    if (totalPages <= 1) {
        bar.style.display = 'none';
        return;
    }

    bar.style.display = 'flex';
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const numbersEl = document.getElementById('pageNumbers');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    // Build page numbers (show max 5)
    let pages = [];
    if (totalPages <= 5) {
        pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
        pages = [1];
        if (currentPage > 3) pages.push('...');
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push('...');
        pages.push(totalPages);
    }

    numbersEl.innerHTML = pages.map(p =>
        p === '...'
            ? `<span style="display:flex;align-items:center;padding:0 0.25rem;color:#adb5bd;">…</span>`
            : `<button class="page-number ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`
    ).join('');

    numbersEl.querySelectorAll('.page-number').forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = parseInt(btn.dataset.page);
            const filtered = getFilteredProducts();
            updateResultsBar(filtered.length);
            renderProducts(filtered);
            window.scrollTo({ top: document.querySelector('.catalog-main').offsetTop - 100, behavior: 'smooth' });
        });
    });

    prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; const f = getFilteredProducts(); updateResultsBar(f.length); renderProducts(f); } };
    nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; const f = getFilteredProducts(); updateResultsBar(f.length); renderProducts(f); } };
}

function hidePagination() {
    const bar = document.getElementById('paginationBar');
    if (bar) bar.style.display = 'none';
}

/* ==============================
   MODAL
   ============================== */

function initializeModal() {
    const modal   = document.getElementById('productModal');
    const close   = document.getElementById('modalClose');
    const overlay = document.getElementById('modalOverlay');
    if (!modal || !close || !overlay) return;

    close.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}

async function openModalBySlug(slug) {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const cached = products.find(p => p.slug === slug);
    if (cached) { openModal(cached); return; }

    const modalInfo = document.querySelector('.modal-info');
    if (modalInfo) {
        modalInfo.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;gap:1rem;">
                <div style="width:48px;height:48px;border:4px solid #f3f3f3;border-top-color:#D4AF37;border-radius:50%;animation:spin 1s linear infinite;"></div>
                <p style="color:#6c757d;">Memuat detail produk...</p>
            </div>
        `;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/catalog/${slug}/`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        if (!result.data) throw new Error('Invalid API response');
        openModal(result.data);
    } catch (error) {
        const fallback = products.find(p => p.slug === slug);
        if (fallback) { openModal(fallback); return; }

        const modalInfo = document.querySelector('.modal-info');
        if (modalInfo) {
            modalInfo.innerHTML = `
                <div style="text-align:center;padding:2rem;">
                    <h3 style="color:#E74C3C;">Gagal Memuat</h3>
                    <p style="color:#6c757d;margin:0.5rem 0 1.5rem;">${error.message}</p>
                    <button onclick="closeModal()" style="padding:0.7rem 2rem;background:#D4AF37;color:#fff;border:none;border-radius:50px;cursor:pointer;font-weight:700;">Tutup</button>
                </div>
            `;
        }
    }
}

function openModal(product) {
    const modal       = document.getElementById('productModal');
    const modalImage  = document.getElementById('modalProductImage');
    const modalName   = document.getElementById('modalProductName');
    const modalPrice  = document.getElementById('modalProductPrice');
    const modalDesc   = document.getElementById('modalProductDescription');
    if (!modal || !modalImage || !modalName || !modalPrice || !modalDesc) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const imageUrl = product.image
        ? `${API_BASE_URL.replace('/api/products', '')}${product.image}`
        : 'assets/placeholder.jpg';

    modalImage.src = imageUrl;
    modalImage.alt = product.name || 'Product';
    modalName.textContent = product.name || 'Nama Produk';
    modalPrice.textContent = product.formatted_price || 'Rp ' + formatPrice(product.price);
    modalDesc.textContent = product.description || product.short_description || 'Tidak ada deskripsi.';

    const ingrList = document.getElementById('modalIngredientsList');
    const ingrSection = document.getElementById('modalIngredients');
    if (ingrList && ingrSection) {
        ingrList.innerHTML = '';
        if (product.ingredients_list?.length > 0) {
            const ul = document.createElement('ul');
            product.ingredients_list.forEach(i => {
                const li = document.createElement('li');
                li.textContent = i;
                ul.appendChild(li);
            });
            ingrList.appendChild(ul);
            ingrSection.style.display = 'block';
        } else {
            ingrSection.style.display = 'none';
        }
    }
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ==============================
   HELPERS
   ============================== */

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price);
}

function getBrandDisplayName(slug) {
    const names = { heritage: 'Heritage', patisserie: 'Patisserie', catering: 'Catering', express: 'Express', tujie: 'Tujie Coffee', 'tujie-coffee': 'Tujie Coffee' };
    return names[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}

function addScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    const grid = document.getElementById('productGrid');
    new MutationObserver(() => {
        grid.querySelectorAll('.product-card').forEach(c => observer.observe(c));
    }).observe(grid, { childList: true });
}

// Spinner keyframe
const style = document.createElement('style');
style.textContent = `@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`;
document.head.appendChild(style);

window.closeModal = closeModal;
console.log('💡 Run catalogDiagnostic() in console to debug.');