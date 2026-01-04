---
title: 博客更新日志
published: 2025-12-18
updated: 2026-01-04
description: 博客前后端更新记录
image: 'cover.webp'
tags:
  - 更新日志
  - 版本记录
category: 博客
draft: false
---

# NaN - 0x01

记录博客系统的功能更新与优化历程。

::github{repo="kwensiu/blog"}

---

# 日志

## v0.0.32 - 2026-01-04

<span class="update-tag-new">新增</span> 集成 Giscus 评论系统  

<span class="update-tag-new">新增</span> 为更新日志添加标签块

<span class="update-tag-imp">改进</span> 禁用原返回顶部按钮功能  


## v0.0.31 - 2026-01-03

<span class="update-tag-new">新增</span> 添加 NavCard 组件并更新布局结构  




## v0.0.30 - 2025-12-29

<span class="update-tag-imp">改进</span> 更新站点配置和组件样式  




## v0.0.29 - 2025-12-28 [DockTOC]

<span class="update-tag-new">新增</span> 添加 DockTOC.svelte ，允许在小屏幕下使用到TOC功能  




## v0.0.28 - 2025-12-27 [Scoop]

<span class="update-tag-post">文章</span> 添加 `优雅地使用Scoop` 推文  

<span class="update-tag-post">文章</span> 更新Scoop使用指南文档  

<span class="update-tag-imp">改进</span> 调整markdown样式和列表横线效果  

<span class="update-tag-fix">修复</span> 移除注释标记  




## v0.0.27 - 2025-12-24

<span class="update-tag-imp">改进</span> 完善写作页面功能，实际上更像一个格式生成器  

<span class="update-tag-imp">改进</span> 为Dock组件添加节流，并更新Dock文章  

<span class="update-tag-imp">改进</span> 更新关于页面与部分文章日期  




## v0.0.26 - 2025-12-24 [MEGA39]

<span class="update-tag-post">文章</span> 添加MEGA39游戏记录文章与相关图片内容  



## v0.0.25 - 2025-12-23

<span class="update-tag-new">新增</span> 为post背景添加水彩渐变; 为blog背景添加网格装饰  

<span class="update-tag-fix">修复</span> 修复 part 贴文未正确隐藏的问题  

<span class="update-tag-fix">修复</span> 修复 User-Card 缺少的 Github 图标  

<span class="update-tag-fix">修复</span> 调整 data-language 徽章的位置  




## v0.0.24 - 2025-12-23 [GitHub 用户卡片]

<span class="update-tag-new">新增</span> 新增 GitHub 用户卡片样式  




## v0.0.23 - 2025-12-22

<span class="update-tag-imp">改进</span> 调整 navbar 和 markdown 样式细节  

<span class="update-tag-fix">修复</span> 修复PostCard样式与分隔线显示  

<span class="update-tag-fix">修复</span> 修复移动设备无法打开语言切换菜单  

<span class="update-tag-fix">修复</span> 修复莫名奇妙的 @iconify/svelte 版本问题  




## v0.0.22 - 2025-12-21 [完善i18n]|[Writing页面]|[hidden重构]|[...]

<span class="update-tag-post">文章</span> 更新项目引用链接  

<span class="update-tag-new">新增</span> 为hidden字段添加更多可选项  

<span class="update-tag-new">新增</span> 实现多语言支持及语言过滤逻辑  

<span class="update-tag-new">新增</span> 实验性添加 "Writing" 页面  

<span class="update-tag-new">新增</span> 为图片添加 fetchpriority 属性支持  

<span class="update-tag-imp">改进</span> 更新站点配置为新域名和路径  

<span class="update-tag-imp">改进</span> 调整写作编辑器保存逻辑与上传接口地址  

<span class="update-tag-fix">修复</span> 调整文章的hidden与lang字段，更新部分文档  

<span class="update-tag-fix">修复</span> 将简体中文语言键的更正为 zh_CN，避免语言检测和选择出现不匹配的问题  





## v0.0.18 - 2025-12-20

<span class="update-tag-imp">改进</span> 完善文本横线的显示，用伪元素方式解决链接文本的虚线闪烁问题  



## v0.0.17 - 2025-12-20

<span class="update-tag-post">文章</span> 更新 Dock组件集成指南cn/en文档  

<span class="update-tag-imp">改进</span> 优化banner图片  

<span class="update-tag-fix">修复</span> 删除Vercel部署残留文件  




## v0.0.16 - 2025-12-20

<span class="update-tag-imp">改进</span> 微调内容与aria-label  

<span class="update-tag-fix">修复</span> 为posts添加缺失的lang  




## v0.0.15 - 2025-12-20

<span class="update-tag-post">文章</span> 添加 Dock 组件集成指南的中英文文档  

<span class="update-tag-new">新增</span> 添加文章多语言版本支持与语言切换按钮  




## v0.0.14 - 2025-12-19 - [Dock重构]

<span class="update-tag-imp">改进</span> 重构 Dock 相关组件并增强可配置性，完善CN/EN文档介绍Dock组件  




## v0.0.13 - 2025-12-18 

<span class="update-tag-post">文章</span>为biome-formatter贴文添加cover  

<span class="update-tag-fix">修复</span> 修复大图查看下意外出现的透明容器导致的放大问题  

<span class="update-tag-fix">修复</span> 执行命令 `pnpm exec biome check --write --unsafe` 格式化  




## v0.0.12 - 2025-12-18 

<span class="update-tag-imp">改进</span> 将 Dock 组件的*颜色*与*亮暗色*按钮改为*归档*与*关于*页面  

<span class="update-tag-fix">修复</span> 尝试修复图片查看器滚轮会上下滑动而非缩放的问题  




## v0.0.11 - 2025-12-18

<span class="update-tag-imp">改进</span> 调整文章卡片与元数据显示样式及布局  




## v0.0.10 - 2025-12-18 - [大图查看]

<span class="update-tag-new">新增</span> 为 ImageWrapper 添加 PhotoSwipe 支持及相关属性  

<span class="update-tag-new">新增</span> 扩展 PhotoSwipe 配置并支持 Banner 图片展示  

<span class="update-tag-new">新增</span> 添加updated字段显示贴文更新日期  

<span class="update-tag-fix">修复</span> 修改文章页面底部导航按钮布局  




## v0.0.9 - 2025-12-18

<span class="update-tag-imp">改进</span> 调整Dock组件隐藏状态，调整Dock暗色以及搜索栏背景色，以提高可视度  

<span class="update-tag-imp">改进</span> 重命名文章文件名并调整分类标签  




## v0.0.8 - 2025-12-18

<span class="update-tag-post">文章</span> 添加 Biome 格式化代码记录文章  

<span class="update-tag-post">文章</span> 添加更新日志板块，并为导航页添加链接  

<span class="update-tag-post">文章</span> 更新软件推荐贴文内容  

<span class="update-tag-imp">改进</span> 手动执行Biome相关命令格式化代码  





## v0.0.7 - 2025-12-18

<span class="update-tag-imp">改进</span> 优化 dock 组件交互与样式  




## v0.0.6 - 2025-12-18

<span class="update-tag-post">文章</span> 更新导航页描述和内容  




## v0.0.5 - 2025-12-18 - [添加Dock]

<span class="update-tag-new">新增</span> 添加底部悬浮 Dock 组件及搜索、主题切换功能  




## v0.0.4 - 2025-12-18 - [Navbar模糊]

<span class="update-tag-imp">改进</span> 更新Navbar样式并优化动画效果  



## v0.0.3 - 2025-12-16

<span class="update-tag-imp">改进</span> 更新部署配置以支持 GitHub Pages  




## v0.0.2 - 2025-12-16

<span class="update-tag-imp">改进</span> 更新站点配置中的 vercel 部署地址  




## v0.0.1 - 2025-12-16

<span class="update-tag-imp">改进</span> 更新settings.json  

<span class="update-tag-imp">改进</span> 改进搜索面板行为与焦点控制  

<span class="update-tag-imp">改进</span> Never Gonna Give You Up  

<span class="update-tag-imp">改进</span> 更新文章分类与草稿状态  

<span class="update-tag-imp">改进</span> 调整 Profile 卡片布局与响应式样式  

<span class="update-tag-fix">修复</span> 移除 GitHub 链接导航项  




## v0.0.0-C - 2025-12-16 - [部署] 

<span class="update-tag-new">新增</span> 世界加载完成：现已支持 Vercel 快递直达




## v0.0.0-B - 2025-12-16

<span class="update-tag-new">初始化</span> 正在初始化世界: 生成个性化内容




## `v0.0.0-A` - 2025-12-16

<span class="update-tag-new">初始化</span> 正在初始化世界: 调整世界生成类型

