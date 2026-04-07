const API_BASE_URL = 'http://localhost:8000/api';

let allNews = [];
let filteredNews = [];
let isLoading = false;
let displayedCount = 6;
const INCREMENT = 6;
let activeCategories = new Set(); 


async function fetchAllNews() {
    if (isLoading) return;
    isLoading = true;
    showLoading();

    try {
        const response = await fetch(`${API_BASE_URL}/news/`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (data.status === 'success' && Array.isArray(data.data)) {
            allNews = data.data;
            applyFilters();
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('❌ Error fetching news:', error);
        showErrorMessage(`Gagal memuat berita: ${error.message}`);
    } finally {
        isLoading = false;
        hideLoading();
    }
}

async function fetchNewsById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/news/${id}/`);
        const data = await response.json();
        if (data.status === 'success') return data.data;
        return null;
    } catch (error) {
        console.error('❌ Error fetching news detail:', error);
        return null;
    }
}


function applyFilters() {
    const sorted = [...allNews].sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
    );

    if (activeCategories.size === 0) {
        filteredNews = sorted;
    } else {
        filteredNews = sorted.filter(news => {
            const cat = (news.category_name || 'news').toLowerCase();
            return activeCategories.has(cat);
        });
    }

    displayedCount = INCREMENT;
    renderNewsList();
}

function renderNewsList() {
    const container = document.getElementById('news-container');
    const viewMoreSection = document.getElementById('view-more-section');
    const viewMoreBtn = document.getElementById('btn-view-more');

    if (!container) return;

    container.innerHTML = '';
    container.style.display = 'flex';

    if (!filteredNews || filteredNews.length === 0) {
        container.innerHTML = `
            <div class="news-empty">
                <p style="font-size:36px;margin-bottom:16px;">📭</p>
                <p>Belum ada berita untuk kategori ini.</p>
            </div>`;
        if (viewMoreSection) viewMoreSection.style.display = 'none';
        return;
    }

    const toShow = filteredNews.slice(0, displayedCount);
    toShow.forEach(news => {
        container.appendChild(createNewsItem(news));
    });

    if (viewMoreSection) {
        if (displayedCount >= filteredNews.length) {
            viewMoreSection.style.display = 'none';
        } else {
            viewMoreSection.style.display = 'block';
            const remaining = filteredNews.length - displayedCount;
            if (viewMoreBtn) {
                viewMoreBtn.querySelector('span').textContent =
                    `VIEW MORE NEWS & EVENTS (${remaining} more)`;
            }
        }
    }

    container.querySelectorAll('.news-item-readmore').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = btn.getAttribute('data-news-id');
            if (!id) return;

            btn.textContent = 'Loading...';
            btn.disabled = true;

            const newsData = await fetchNewsById(id);

            btn.disabled = false;
            btn.innerHTML = `Read More <span class="arrow">→</span>`;

            if (newsData) openNewsModal(newsData);
        });
    });
}

function createNewsItem(news) {
    const item = document.createElement('div');
    item.className = 'news-item';
    item.setAttribute('data-news-id', news.id);

    const date = formatDate(news.created_at);
    const imageUrl = getImageUrl(news.image);
    const excerpt = news.excerpt || truncateText(stripHtml(news.content), 120);
    const categoryName = news.category_name || 'News';
    const isEvent = categoryName.toLowerCase() === 'event';

    const thumbHtml = imageUrl
        ? `<div class="thumb-bg" style="background-image:url('${imageUrl}'); background-size:cover; background-position:center; width:100%; height:100%;"></div>`
        : `<div class="thumb-placeholder">🍽️</div>`;

    item.innerHTML = `
        <div class="news-item-body">
            <div class="news-item-meta">
                <div class="news-item-categories">
                    <span class="news-tag ${isEvent ? 'tag-event' : ''}">${escapeHtml(categoryName)}</span>
                </div>
                <span class="news-item-date">${date}</span>
            </div>
            <h3 class="news-item-title">${escapeHtml(news.title)}</h3>
            <p class="news-item-excerpt">${escapeHtml(excerpt)}</p>
            <button class="news-item-readmore" data-news-id="${news.id}">
                Read More <span class="arrow">→</span>
            </button>
        </div>
        <div class="news-item-thumb">
            ${thumbHtml}
        </div>
    `;

    return item;
}

function getImageUrl(imagePath) {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    if (imagePath.startsWith('/media/')) return `http://localhost:8000${imagePath}`;
    if (!imagePath.startsWith('/')) return `http://localhost:8000/media/${imagePath}`;
    return imagePath;
}

function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

function stripHtml(html) {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function escapeHtml(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showLoading() {
    const loadingEl = document.getElementById('loading-news');
    const container = document.getElementById('news-container');
    if (loadingEl) loadingEl.style.display = 'block';
    if (container) container.style.display = 'none';
}

function hideLoading() {
    const loadingEl = document.getElementById('loading-news');
    if (loadingEl) loadingEl.style.display = 'none';
}

function showErrorMessage(message) {
    const container = document.getElementById('news-container');
    hideLoading();
    if (container) {
        container.style.display = 'block';
        container.innerHTML = `
            <div style="text-align:center;padding:60px 20px;color:rgba(255,255,255,0.4);">
                <div style="font-size:48px;margin-bottom:16px;">😞</div>
                <p style="font-family:'DM Sans',sans-serif;font-size:15px;margin-bottom:8px;">
                    ${escapeHtml(message)}
                </p>
                <p style="font-size:13px;margin-bottom:24px;">
                    Pastikan backend Django berjalan di 
                    <code style="background:rgba(255,255,255,0.08);padding:3px 7px;border-radius:3px;">
                        http://localhost:8000
                    </code>
                </p>
                <button onclick="fetchAllNews()" style="
                    font-family:'DM Sans',sans-serif;
                    font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;
                    color:rgba(255,255,255,0.7);background:transparent;
                    border:1px solid rgba(255,255,255,0.2);padding:14px 32px;
                    cursor:pointer;border-radius:2px;transition:all 0.2s;">
                    🔄 Coba Lagi
                </button>
            </div>`;
    }
}

function openNewsModal(newsData) {
    const modal = document.getElementById('newsModal');
    if (!modal) return;

    document.getElementById('newsModalTitle').textContent = newsData.title;
    document.getElementById('newsModalCategory').textContent = newsData.category_name || 'News';
    document.getElementById('newsModalDate').textContent = formatDate(newsData.created_at);

    const textEl = document.getElementById('newsModalText');
    if (textEl) {
        textEl.innerHTML = (newsData.content || '')
            .split('\n\n')
            .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
            .join('');
    }

    const imageEl = document.getElementById('newsModalImage');
    if (imageEl) {
        const url = getImageUrl(newsData.image);
        if (url) {
            imageEl.style.backgroundImage = `url('${url}')`;
            imageEl.style.display = 'block';
        } else {
            imageEl.style.display = 'none';
        }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeNewsModal() {
    const modal = document.getElementById('newsModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('newsModalOverlay').onclick = closeNewsModal;
    document.getElementById('newsModalClose').onclick = closeNewsModal;
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeNewsModal();
    });

    document.querySelectorAll('.category-item').forEach(item => {
        const checkbox = item.querySelector('.category-checkbox');
        const cat = item.getAttribute('data-category');

        item.addEventListener('click', (e) => {
            if (e.target !== checkbox) checkbox.checked = !checkbox.checked;

            if (checkbox.checked) {
                activeCategories.add(cat);
            } else {
                activeCategories.delete(cat);
            }
            applyFilters();
        });
    });

    // View more button
    const viewMoreBtn = document.getElementById('btn-view-more');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            displayedCount += INCREMENT;
            renderNewsList();
        });
    }

    // Initial fetch
    fetchAllNews();
});

// Expose globals
window.fetchAllNews = fetchAllNews;
window.closeNewsModal = closeNewsModal;