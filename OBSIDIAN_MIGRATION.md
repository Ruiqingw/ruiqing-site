# Obsidian → Astro 迁移注意事项

从 Obsidian vault 搬运文章到 `src/content/blog/` 时，以下语法需要转换：

## 1. 图片引用
```
❌ ![[DAPO clip.png]]
✅ ![DAPO clip](/blog-images/DAPO%20clip.png)
```
图片放到 `public/blog-images/`，文件名空格用 `%20`。

## 2. 加粗 + 数学公式不能混用
```
❌ **$f_{i,t}$ (Token-level Gate)：**
✅ $f_{i,t}$ **(Token-level Gate)：**
```
把 `$...$` 移到 `**...**` 外面。

## 3. `$$` 公式块前后必须空行
```
❌ 完整公式如下：
   $$J = ...$$
   注意这里...

✅ 完整公式如下：

   $$
   J = ...
   $$

   注意这里...
```

## 4. Callout 语法 ✅ 已支持
`>[!question]`、`>[!hint]`、`>[!warning]`、`>[!info]` 等已通过 `remark-obsidian-callout` 插件支持，无需手动转换。

## 5. Frontmatter 必需字段
Astro 要求 `title` 和 `date`，Obsidian 笔记可能缺少。
```yaml
---
title: "文章标题"
date: 2025-12-28
tags:
  - tag1
---
```
