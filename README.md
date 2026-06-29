# 博客前端

静态博客页面，部署到 GitHub Pages。

## 页面结构

```
blog-frontend/
├── index.html       # 首页（文章列表）
├── article.html     # 文章详情页
├── js/
│   ├── main.js      # 首页逻辑
│   └── article.js   # 详情页逻辑
└── README.md
```

## 本地预览

直接用浏览器打开 `index.html` 即可预览（会使用模拟数据）。

## 部署到 GitHub Pages

1. **创建 GitHub 仓库**

2. **推送代码**
```bash
git init
git add .
git commit -m "博客前端初始版本"
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

3. **开启 GitHub Pages**
- 进入仓库 Settings
- 左侧选择 Pages
- Source 选择 `main` 分支和 `/ (root)`
- 点击 Save

4. **访问**
- 等待 1-2 分钟
- 访问 `https://你的用户名.github.io/仓库名/`

## 配置后端 API

部署到 GitHub Pages 后，需要修改 JS 中的 API 地址：

修改 `js/main.js` 和 `js/article.js` 中的：
```javascript
const API_BASE = 'http://localhost:8080/api';
```

改成你的后端地址（Railway 部署后会提供 URL）。

