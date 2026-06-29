---
title: "基于 Astro 与 Tailwind CSS v4 搭建静态博客"
description: "深入了解本站是如何配置极客质感的冰蓝色调与现代前端集成的。"
pubDate: 2026-06-28
tags: ["技术", "astro", "tailwind"]
featured: false
lang: zh
---

# Astro 与 Tailwind v4 配置指南

在这篇文章中，我将带你了解本数字花园的技术底座与配置过程。

## 技术栈

本站基于 **Astro** 静态网站生成器（SSG）和 **Tailwind CSS v4** 样式库搭建而成。

### 为什么选择 Tailwind CSS v4？

Tailwind v4 引入了全新的性能编译器，运行速度极快，且全面移除了原有的 JS 配置文件，所有主题变量都直接在 CSS 文件 (`global.css`) 中以 `@theme` 进行定义，与标准 CSS 变量天然契合。

以下是本站 `global.css` 的主题配置片段：

```css
@theme {
  --color-bg-main: var(--bg-main);
  --color-bg-surface: var(--bg-surface);
  --color-primary: var(--color-primary);
  --color-secondary: var(--color-secondary);
  --color-accent: var(--color-accent);
}
```

## 冰蓝色调色彩系统

我们的颜色直接映射到 `:root`（用于深色夜间模式）和 `:root.light`（用于浅色自适应模式）的 CSS 变量中，呈现出深邃宁静的极客法术质感。

1.  **夜空深邃蓝** (`#080b11`)：底色背景，代表星空的秩序。
2.  **矢车菊蓝** (`#547cf5`)：主色调，用于标题与品牌标志。
3.  **法术冰蓝** (`#38bdf8`)：强调色，用于发光元素、按钮状态和链接。

接下来我们还将继续丰富时间轴、追番列表和交互实验室。敬请关注！
