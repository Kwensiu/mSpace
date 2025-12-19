---
title: Dock 组件集成指南
published: 2025-12-19
description: '展示如何集成我的 Dock 组件到 fuwari'
image: ''
tags: [开发, 博客, fuwari]
category: '开发'
draft: false 
lang: 'zh'
en: "dockcomponentguide/dock-component-guide-en/"
updated: 2025-12-20T06:00:00.000Z
---

_本文表达简略，如有任何问题，敬请指出。_

# 下滑即可看到 Dock 组件

Dock 组件的添加解决两个主要问题：
1. 阅读时无法搜索或切换页面
2. 中小屏幕下"回到顶部"按钮的缺失  
3. ~更有质感的博客~  

# 组件概述

## 主要功能

1. **自动显隐**: 向下滚动(超过 150 像素)时自动显示，向上滚动或返回顶部时隐藏。
2. **快速导航**：提供首页、存档和关于页面的快速访问按钮
3. **返回顶部**：一键平滑滚动至页面顶部
4. **底部搜索**：我还创建了一个类似导航栏搜索的组件

## 文件结构

```
src/components/dock/
├── Dock.svelte          # Main Dock component
└── DockSearch.svelte     # Search functionality sub-component
```
---

# 集成步骤(简略)

## 1. 创建文件

在项目的 `src/components/` 目录下创建一个名为 `dock` 的文件夹(可选)，并添加以下两个文件：

1. **Dock.svelte** - Dock 组件组件主体，包括UI显示与滚动处理
   - 参考: [src/components/dock/Dock.svelte](https://github.com/Kwensiu/mSpace/blob/main/src/components/dock/Dock.svelte)

2. **DockSearch.svelte** - Dock 的搜索功能组件
   - 参考: [src/components/dock/DockSearch.svelte](https://github.com/Kwensiu/mSpace/blob/main/src/components/dock/DockSearch.svelte)
   - 这是可选的，假如你不需要 Dock 的搜索功能

## 2. 导入到 Layout

将 Dock 组件导入并添加到 Layout 文件（`src/layouts/Layout.astro`）：

```astro title="Layout.astro" {"  // 添加在 body 闭合前":4-5}
---
import Dock from "@components/dock/Dock.svelte";
---

<Dock client:only="svelte" />
```

   - 参考: [src/layouts/Layout.astro](https://github.com/Kwensiu/mSpace/blob/main/src/layouts/Layout.astro#L157)

---

# 个性化设置

## 配置选项

Dock 组件包含一个配置对象，可根据您网站的结构和个人偏好进行修改：

```js title="Dock.svelet"
const config = {
	scrollThreshold: 150,  // Show dock after scrolling this many pixels
	homePath: "/",
	archivePath: "/archive/",
	aboutPath: "/about/"
};
```

## 防抖功能

如果您需要防抖功能，还可以在 `Dock.svelte` 中添加一个简单的定时器。

```diff lang:"js" title="Dock.svelet"
+ let scrollTimer: NodeJS.Timeout | null = null;
                       
  function handleScroll() {

+   if (scrollTimer) clearTimeout(scrollTimer);
+   scrollTimer = setTimeout(() => {
      const currentScrollY = window.scrollY;
      showDock = currentScrollY > config.scrollThreshold;
+   }, 100); // 在这里设置延迟时间。
  }
  
+ onDestroy(() => {
+   if (scrollTimer) clearTimeout(scrollTimer);
+   scrollTimer = null;
+ });
```
---

# 样式问题？

我在项目中自定义了一些全局样式。
如果最终呈现与我的示例不同，请检查样式定义。

# 更多功能

Dock 还可以执行许多其他功能，例如在中小屏幕上显示缺失的 `TOC` 组件。

---

_更多功能等待更新_