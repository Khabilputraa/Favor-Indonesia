const API_BASE_URL = 'http://localhost:8000/api';

async function fetchLatestNews() {
    const container = document.getElementById('latest-news-container');
    if (!container) {
        console.error('❌ Latest news container not found!');
        return;
    }

    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Memuat berita terbaru...</p>
        </div>
    `;

    try {
        console.log('🔄 Fetching latest news from:', `${API_BASE_URL}/news/`);

        const response = await fetch(`${API_BASE_URL}/news/`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ API Response received');

        if (data.status === 'success' && Array.isArray(data.data)) {
            const allNews = data.data;

            const sortedNews = [...allNews].sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
            );

            const latestNews = sortedNews.slice(0, 3);
            console.log('📰 Displaying', latestNews.length, 'latest news items');

            displayLatestNews(latestNews, container);

            if (typeof WOW !== 'undefined') {
                new WOW().init();
            }
        } else {
            throw new Error('Invalid response format');
        }

    } catch (error) {
        console.error('❌ Error fetching news:', error);
        showErrorState(container, error.message);
    }
}

function displayLatestNews(newsArray, container) {
    if (!newsArray || newsArray.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted">Belum ada berita tersedia saat ini.</p>
            </div>
        `;
        return;
    }

    let html = '';

    newsArray.forEach((news, index) => {
        if (index === 0) {
            html += createFeaturedNewsCard(news);
        } else if (index === 1) {
            html += '<div class="col-lg-4">';
            html += createSmallNewsCard(news, true);
        } else if (index === 2) {
            html += createSmallNewsCard(news, false);
            html += '</div>';
        }
    });

    container.innerHTML = html;
}

function createFeaturedNewsCard(news) {
    const imageUrl = getImageUrl(news.image);
    const publishDate = formatDate(news.created_at);
    const excerpt = news.excerpt || truncateText(stripHtml(news.content), 100);
    const categoryName = news.category_name || 'News';

    return `
        <div class="col-lg-8 wow fadeInUp" data-wow-delay="0.1s">
            <div class="rounded overflow-hidden bg-white shadow">
                <img class="img-fluid w-100" src="${imageUrl}" alt="${escapeHtml(news.title)}"
                    style="height: 280px; object-fit: cover;"
                    onerror="this.src='assets/news/placeholder.jpg'">
                <div class="p-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-primary" style="font-size: 11px;">${escapeHtml(categoryName)}</span>
                        <small class="text-muted" style="font-size: 12px;">${publishDate}</small>
                    </div>
                    <h5 class="mb-1" style="font-size: 16px;">${escapeHtml(news.title)}</h5>
                    <p class="small mb-2 text-muted">${escapeHtml(excerpt)}</p>
                    <a class="btn btn-sm btn-primary" href="news.html">Read Full Story</a>
                </div>
            </div>
        </div>
    `;
}

function createSmallNewsCard(news, isFirst) {
    const imageUrl = getImageUrl(news.image);
    const publishDate = formatDate(news.created_at);
    const excerpt = news.excerpt || truncateText(stripHtml(news.content), 50);
    const categoryName = news.category_name || 'News';
    const mbClass = isFirst ? 'mb-3' : '';
    const delay = isFirst ? '0.3s' : '0.5s';

    return `
        <div class="rounded overflow-hidden bg-white shadow ${mbClass} wow fadeInUp" data-wow-delay="${delay}">
            <img class="img-fluid w-100" src="${imageUrl}" alt="${escapeHtml(news.title)}"
                style="height: 175px; object-fit: cover;"
                onerror="this.src='assets/news/placeholder.jpg'">
            <div class="p-2">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="badge bg-primary" style="font-size: 9px;">${escapeHtml(categoryName)}</span>
                    <small class="text-muted" style="font-size: 11px;">${publishDate}</small>
                </div>
                <h6 class="mb-1" style="font-size: 13px;">${escapeHtml(news.title)}</h6>
                <p class="small text-muted mb-2" style="font-size: 11px;">${escapeHtml(excerpt)}...</p>
                <a class="btn btn-sm btn-primary" style="font-size: 11px; padding: 4px 8px;"
                    href="news.html">Read More</a>
            </div>
        </div>
    `;
}

function showErrorState(container, errorMessage) {
    container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-warning text-center" role="alert">
                <i class="fas fa-exclamation-triangle mb-2" style="font-size: 2rem;"></i>
                <h5 class="alert-heading">Tidak Dapat Memuat Berita</h5>
                <p class="mb-2">${escapeHtml(errorMessage)}</p>
                <hr>
                <p class="mb-0 small">
                    Pastikan backend server berjalan di 
                    <code>http://localhost:8000</code>
                </p>
                <button class="btn btn-primary btn-sm mt-3" onclick="fetchLatestNews()">
                    <i class="fas fa-sync-alt"></i> Coba Lagi
                </button>
            </div>
        </div>
    `;
}


function getImageUrl(imagePath) {
    if (!imagePath) {
        console.warn('⚠️ No image path provided');
        return 'assets/news/placeholder.jpg';
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    if (imagePath.startsWith('/media/')) {
        return `http://localhost:8000${imagePath}`;
    }

    if (!imagePath.startsWith('/')) {
        return `http://localhost:8000/media/${imagePath}`;
    }

    return imagePath;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim();
}

function stripHtml(html) {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Initializing Latest News for Index Page...');
    console.log('🔗 API URL:', API_BASE_URL);

    const container = document.getElementById('latest-news-container');
    if (container) {
        console.log('✅ Container found, fetching latest news...');
        fetchLatestNews();
    } else {
        console.error('❌ Latest news container not found!');
    }
});

window.fetchLatestNews = fetchLatestNews;