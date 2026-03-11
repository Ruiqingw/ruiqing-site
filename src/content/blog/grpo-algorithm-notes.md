---
title: "GRPO 算法笔记：无需 Critic 的强化学习"
date: "2026-02-15"
tags: ["RLHF", "GRPO", "DeepSeek"]
description: "Group Relative Policy Optimization 如何简化 RLHF 流程"
---

## 什么是 GRPO？

GRPO (Group Relative Policy Optimization) 是 DeepSeek 团队提出的一种 RL 算法，它最大的特点是**不需要训练一个单独的 Critic（价值网络）**，从而大幅降低了训练成本。

## 核心思路

传统的 PPO 需要一个 Critic 来估计每个 token 的 value baseline，而 GRPO 的做法更加简洁：

- 对每个 prompt，采样一组（group）回复
- 用组内回复的**平均 reward 作为 baseline**
- 将每个回复的 reward 减去这个 baseline，得到 advantage

这样就绕过了训练 Critic 网络的需要，同时仍然能有效减少梯度估计的方差。

## 与 PPO 的对比

PPO 需要维护一个与 policy 模型同等规模的 value network，这在大模型时代意味着双倍的显存开销。GRPO 用组内相对比较的方式巧妙地解决了这个问题。

## 实际影响

DeepSeek-R1 的成功很大程度上归功于 GRPO，它使得在大规模模型上进行 RL 训练变得更加可行。
