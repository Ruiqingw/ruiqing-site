---
title: "理解 Transformer 中的注意力机制"
date: "2026-03-01"
tags: ["LLM", "Transformer", "Attention"]
description: "从直觉到数学，深入理解 Self-Attention 的工作原理"
---

## 为什么需要注意力机制？

在处理序列数据时，模型需要一种方式来决定"关注"输入的哪些部分。传统的 RNN 通过隐藏状态逐步传递信息，但这种方式在长序列上会遇到梯度消失的问题。

注意力机制提供了一种更直接的方式：让序列中的每个位置都能直接"看到"其他所有位置。

## Self-Attention 的核心思想

Self-Attention 的计算可以分为三步：

1. **Query, Key, Value**：对输入的每个 token，生成三个向量 Q、K、V
2. **计算注意力分数**：通过 Q 和 K 的点积来衡量 token 之间的关联度
3. **加权求和**：用 softmax 归一化后的分数对 V 加权求和

数学公式：

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

其中 $\sqrt{d_k}$ 是缩放因子，防止点积值过大导致 softmax 饱和。

## Multi-Head Attention

单个注意力头只能捕捉一种类型的关系。Multi-Head Attention 通过并行运行多个注意力头，让模型同时关注不同类型的模式——比如一个头关注语法结构，另一个关注语义关系。

## 后续探索

在下一篇文章中，我将讨论位置编码（Positional Encoding）的不同实现方式，包括 RoPE 和 ALiBi。
