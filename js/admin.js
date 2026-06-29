/*
 * 文件上传功能
 * 当用户选择文件时触发
 *
 * FileReader API：
 * - 用于读取用户选择的文件内容到临时变量
 * - readAsText() 方法读取文本文件
 */
const articles = [];  // 文章列表,用于存储上传的文章数据
document.getElementById('fileInput').addEventListener('change', function (e) {
    // e.target.files 是用户选择的文件列表

    // 考虑多选情况
    for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        if (!file) return;  // 用户取消选择时直接返回

        // 创建 FileReader 实例，用于读取文件
        const reader = new FileReader();
        // 开始读取文件为文本
        reader.readAsText(file);
        // 读取完成后触发 onload 事件
        reader.onload = function () {
            const content = reader.result;
            // 从文件名中提取标题（去掉扩展名）
            const title = file.name.replace(/\.[^/.]+$/, '');
            // 创建文章对象，默认作者和分类
            const article = {
                title: title,
                content: content,
                author: '默认作者',
                category: '默认分类'
            };
            articles.push(article);
        };
    }

});


/**
 * 发布文章
 * 监听表单提交事件，发送 POST 请求到后端
 *
 * fetch API：
 * - 用于发送 HTTP 请求
 * - method: HTTP 方法（GET/POST/PUT/DELETE）
 * - headers: 请求头，Content-Type 表示发送的是 JSON
 * - body: 请求体，需要 JSON.stringify() 转换
 */
// 选择表单元素，监听 submit 事件
document.getElementById('articleForm').addEventListener('submit', async function (e) {
    // 阻止表单默认提交行为（防止页面刷新）
    e.preventDefault();


    for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        const existing = await getArticleByTitle(article.title);
        if (existing.code === 200) {
            const id = existing.data.id;
            await updateArticle(id, article);
            console.log(article.title + '更新成功');
            continue;
        }
        if (existing.code == 500) {
            break;
        }
        try {
            // 发送 POST 请求创建文章
            const response = await createArticle(article);

            // 解析响应 JSON
            const result = await response.json();

            // 判断返回结果
            if (result.code === 200) {
                console.log(article.title + '发布成功');
                // 刷新文章列表
                loadArticles();
            } else {
                console.error(article.title + '发布失败: ' + result.message);
            }
        } catch (error) {
            console.error(error);
        }
    }
});

/**
 * 加载文章列表
 * 从后端获取所有文章并渲染到页面
 *
 * async/await：
 * - async 表示这是一个异步函数
 * - await 等待 Promise 结果（暂停执行，等待网络响应）
 *
 * Promise 和 fetch：
 * - fetch() 返回一个 Promise 对象
 * - .then() 是 Promise 的回调方式
 * - await 是 async/await 语法，更简洁
 */
async function loadArticles() {
    // 获取文章列表容器
    const container = document.getElementById('articleList');

    try {

        const result = await getArticles();
        // 获取文章数组（data 字段）
        const articles = result.data || [];

        // 无文章时显示提示
        if (articles.length === 0) {
            container.innerHTML = '<p class="text-theme-muted text-sm p-4">暂无文章</p>';
            return;
        }

        // 使用 map 遍历数组，生成 HTML
        // articles.map(article => ...) 遍历每个 article
        // .join('') 把所有 HTML 片段合并成一个字符串
        container.innerHTML = articles.map(a => `
                    <div class="list-theme-item flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] last:border-b-0 hover:bg-[var(--btn-ghost-hover-bg)] transition-colors">
                        <!-- 点击标题打开文章详情页 -->
                        <a href="article.html?id=${a.id}" target="_blank" class="text-[var(--text-link)] no-underline hover:underline text-sm">${escapeHtml(a.title)}</a>
                        <div class="flex gap-1.5">
                            <button class="px-2.5 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors" onclick="adminDeleteArticle(${a.id})">删除</button>
                            <button class="px-2.5 py-1 bg-[var(--btn-primary-bg)] text-white text-xs rounded hover:opacity-90 transition-colors" onclick="window.open('edit.html?id=${a.id}', '_blank')">编辑</button>
                        </div>
                    </div>
                `).join('');
    } catch (error) {
        // 显示错误信息
        container.innerHTML = '<p class="text-red-500 text-sm p-4">' + error.message + '</p>';
    }
}

/**
 * 删除文章
 * 发送 DELETE 请求到后端
 *
 * confirm()：
 * - 浏览器原生弹窗
 * - 返回 true（用户点确定）或 false（用户点取消）
 */
async function adminDeleteArticle(id) {
    // 弹出确认框
    if (!confirm('确定要删除这篇文章吗？')) return;

    try {

        const result = await deleteArticle(id);

        if (result.code === 200) {
            alert('删除成功');
            // 刷新列表
            loadArticles();
        }
    } catch (error) {
        alert('删除失败');
    }
}

/**
 * HTML 转义
 * 防止 XSS 攻击（跨站脚本攻击）
 *
 * XSS 攻击示例：
 * 用户输入 <script>alert('hack')</script> 作为文章内容
* 如果不转义，这段 JS 代码会被浏览器执行
*
* 解决方案：
* 将
变成 &lt;script&gt;，浏览器就会把它当作文本显示
 *
 * 原理：
 * 创建一个临时 div，设置 textContent（纯文本），再获取 innerHTML
 * 浏览器会自动转义
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    // textContent 会把任何内容当作纯文本
    div.textContent = text;
    // innerHTML 会返回转义后的 HTML
    return div.innerHTML;
}

/**
 * 页面加载完成后自动执行
 * DOMContentLoaded 是 DOM 加载完成的事件
 */
document.addEventListener('DOMContentLoaded', loadArticles);
