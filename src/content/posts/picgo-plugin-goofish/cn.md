---
title: PicGo插件 - 闲鱼图床
published: 2026-01-06
updated: 2026-01-06
description: ''
image: 'https://img.alicdn.com/imgextra/i3/O1CN016HS0ab1ZXwVUAvXT3_!!2205575593205-2-fleamarket.png'
tags: ["图床", "闲鱼", "PicGo",]
category: '开发'
draft: false 
lang: 'zh_CN'
pin: false
pinOrder: 0
hidden: none
---



# 前言

在 fuwari 的 [forks](https://github.com/saicaca/fuwari/forks) 闲逛，发现 [Tavre 的博客](https://blog.tavr.top/)有个很有意思的文章 :  
[**《阿里图床 不死速度快无敌图床！》**](https://blog.tavr.top/posts/aliimg/)  

::github{repo="tavre/goofish_img"}  

下载体验了一下，配置好后确实能正常使用，但是部分内容需要个性化处理。例如分类和网页结构。  
鉴于已有类似PicGo这样的图床管理软件，我便着手制作了基于闲鱼API的PicGo插件。  

---

# 项目

::github{repo="kwensiu/picgo-plugin-goofish"}

插件已发布到Github，也在PicGo提交了插件PR。

## 功能特点

- 支持上传图片到闲鱼图床
- 支持多种图片格式（JPG、PNG、GIF、WebP）
- 简单易用，只需配置 cookie2 即可

<div class="custom-bl"></div>

## 安装方式

### 1. 通过 PicGo 安装

1. 打开 PicGo
2. 点击「插件设置」 -> 「搜索插件」
3. 搜索 `picgo-plugin-goofish`
4. 点击安装

### 2. 手动安装

1. 下载项目文件到本地任意位置：

```
git clone https://github.com/Kwensiu/picgo-plugin-goofish.git
```

- 或直接通过 Github 页面的 `Code` 按钮下载项目文件到本地任意位置

2. 在 PicGo 的“插件设置”页面，点击“导入本地插件”
3. 选择刚刚下载的文件夹后导入即可

<div class="custom-bl"></div>

## 配置方式

### 获取 cookie2
1. 访问 闲鱼创作者平台
2. 登录你的闲鱼账号
3. 按 F12 打开开发者工具
4. 刷新页面，在网络选项卡中找到任意请求
5. 查看请求头中的 Cookie 字段
6. 复制 cookie2= 后面的值（不包含分号）

:::note
下图就是我在Picgo通过闲鱼API插件添加的，如果失效了请提交issue告诉我，非常感谢！
<img src="https://img.alicdn.com/imgextra/i4/O1CN01UcnNyo1ZXwVUCazhz_!!2205575593205-2-fleamarket.png" alt="cookie2">
:::

### 在 PicGo 中配置

1. 打开 PicGo
2. 点击「图床设置」 -> 「闲鱼图床」
3. 在 `cookie2` 输入框中粘贴你获取的 cookie2 值
4. 点击「确定」保存配置

<div class="custom-bl"></div>

## 注意事项

- Cookie 可能会过期，如果上传失败请重新获取
- 请妥善保管你的 cookie 信息，不要泄露给他人
- 闲鱼可能会对上传频率有限制，请合理使用
- 建议在上传成功后及时保存图片地址，否则永久丢失
- 本插件仅供个人学习交流使用，请勿滥用