// API 调用模块

/**
 * 获取文章列表
 */
async function getArticles() {
    const res = await fetch(`${API_BASE}/articles`, {
        cache: 'default'
    });
    return res.json();
}

/**
 * 获取单篇文章
 * @param {number} id - 文章ID
 */
async function getArticle(id) {
    const res = await fetch(`${API_BASE}/articles/${id}`, {
        cache: 'default'
    });
    return res.json();
}

/**
 * 根据标题搜索文章
 * @param {string} title - 文章标题
 */
async function getArticleByTitle(title) {
    const res = await fetch(`${API_BASE}/articles/search/${encodeURIComponent(title)}`, {
        cache: 'default'
    });
    return res.json();
}

/**
 * 创建文章
 * @param {Object} article - 文章数据 {title, content, author, category}
 */
async function createArticle(article) {
    const res = await fetch(`${API_BASE}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
    });
    return res.json();
}

/**
 * 更新文章
 * @param {number} id - 文章ID
 * @param {Object} article - 文章数据
 */
async function updateArticle(id, article) {
    const res = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
    });
    return res.json();
}

/**
 * 删除文章
 * @param {number} id - 文章ID
 */
async function deleteArticle(id) {
    const res = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'DELETE'
    });
    return res.json();
}
