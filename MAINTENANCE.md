# 网站维护说明

当前维护目录是 `work/publish-repo`。`publish/optimized-portfolio` 是旧副本，不能作为当前发布源。

## 修改与构建

在网站目录执行：

```powershell
node tools/build-site.cjs
node tools/audit-site.cjs --out ../../output/website-audit-latest
```

`site-build.config.json` 列出首页脚本和样式的顺序。修改其中的源文件后重新构建；不要直接修改 `site-runtime.js`、`site-styles.css`、`site-assets.json`，这些是生成文件。构建不需要安装依赖。

`portfolio-layout.css` 是保留了后续修正的基础样式输入。目录外的旧 `work/build-layout-css.cjs` 指向旧网站副本，不能用于重建当前网站。

构建使用内容指纹查询参数更新浏览器缓存，文件名固定，不会生成一批历史哈希文件。首页保留早期布局脚本、合并样式、延迟运行脚本三个入口；Three.js 仍按需加载。

## 必须保留的文件

- `index.html` 与 `zhong-xi-han-portfolio-preview.html` 内容相同，后者用于兼容旧预览链接。
- 独立项目 HTML 与所引用脚本仍支持直接访问，不能只按首页引用删除文件。
- CSS 源文件包含合并样式的输入、维护来源或独立页面样式；审计的“未引用候选”不等于可以删除。
- `assets/record-labels` 是快速预览小图，之后会加载高清项目图，属于渐进加载设计。
- `cat-shape-masks.js` 是猫图标轮廓数据；`vendor/three.min.js` 是播放器依赖。
- 项目图片、视频和静态播放器后备图是内容资产，不是缓存。

审计使用保守的文本引用扫描，动态拼接路径仍需结合浏览器验证。已停用文件及旧样式备份位于网站目录外的 `output/website-audit-2026-10-31`。
