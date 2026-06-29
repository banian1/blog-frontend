

// 获取 URL 参数
function getArticleId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// 加载文章详情
async function loadArticle() {
    const id = getArticleId();
    if (!id) {
        showError('文章ID不存在');
        return;
    }

    const container = document.getElementById('articleDetail');

    try {
        const result = await getArticle(id);

        if (result.code === 200) {
            renderArticle(result.data);
        } else {
            showError(result.message || '文章不存在');
        }
    } catch (error) {
        console.log('后端未部署，使用模拟数据');
        const article = mockArticles[id];
        if (article) {
            renderArticle(article);
        } else {
            showError('文章不存在');
        }
    }
}

// 渲染文章
async function renderArticle(article) {
    const container = document.getElementById('articleDetail');

    document.title = article.title + ' - 我的博客';
    const formulas = [];
    let content = article.content.replace(/\$\$[\s\S]+?\$\$/g, (match) => {
        formulas.push(match);           // 把 $$...$$ 存入数组
        return `%%FORMULA${formulas.length - 1}%%`;  // 替换成占位符
    });
    // 此时 content 里没有 $$...$$ 了，_ 下标不会被 marked 处理

    // 第二步：marked 插件启用标题 id
    marked.use(markedGfmHeadingId.gfmHeadingId());

    // 第三步：marked 解析 Markdown
    let html = marked.parse(content); // _i 变成 <em>i</em>，但公式块已被保护

    // 第四步：还原公式，并确保公式在独立的 p/div 标签内
    formulas.forEach((f, i) => {
        html = html.replace(`%%FORMULA${i}%%`, `<div class="math-block">${f}</div>`);
    });

    container.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <div class="article-content markdown-body">${html}</div>
            <div class="flex gap-2 mt-5">
                <a href="index.html" class="btn-theme-primary">返回首页</a>
                <a href="edit.html?id=${article.id}" class="btn-theme-ghost">编辑文章</a>
            </div>
        </div>
    `;
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });

    if (window.MathJax) {
        await MathJax.startup.promise;
        await MathJax.typesetPromise([container]);
    }
}

// 显示错误
function showError(message) {
    const container = document.getElementById('articleDetail');
    container.innerHTML = `
        <div class="text-center py-12">
            <h3 class="text-theme-muted text-lg">${message}</h3>
            <a href="index.html" class="btn-theme-primary mt-4 inline-block">返回首页</a>
        </div>
    `;
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
document.addEventListener('DOMContentLoaded', loadArticle);