// 获取文章列表
async function loadArticles() {
    const container = document.getElementById('articleList');

    try {
        const result = await getArticles();
        const articles = result.data || [];

        if (articles.length === 0) {
            container.innerHTML = '<p class="text-theme-muted">暂无文章</p>';
            return;
        }

        renderArticles(articles);
    } catch (error) {
        container.innerHTML = error.message;
    }
}

// 渲染文章列表
function renderArticles(articles) {
    const container = document.getElementById('articleList');
    container.innerHTML = articles.map(article => `
        <div class="theme-card p-6 mb-5 backdrop-blur-md">
            <h5 class="theme-card-title text-base">
                <a href="article.html?id=${article.id}" class="text-[var(--text-link)] no-underline font-semibold hover:text-[var(--text-link-hover)]">${article.title}</a>
            </h5>
            <p class="text-theme-muted text-sm mt-1">
                <small>${article.author} · ${article.category} · ${formatDate(article.createTime)}</small>
            </p>
            <div class="article-preview">${article.content}</div>
        </div>
    `).join('');
}

// 格式化日期
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// 页面加载时获取文章
document.addEventListener('DOMContentLoaded', loadArticles);