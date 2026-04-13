---
title: "GSPO"
date: 2025-12-24
tags:
  - 阿里
  - Qwen
  - sequence-level
  - paper
aliases:
created: 2025-12-2415:58
url: https://arxiv.org/abs/2507.18071
提出时间:
---
**全称：** **G**roup **S**equence **P**olicy **O**ptimization（群体序列策略优化）。

**核心思想：** 在 GRPO 中，我们给模型一个任务，模型生成了一个完整的回答（Sequence）。如果回答对了，我们给整个回答打 1 分，然后把这个奖励广播给每一个token。但是这句话能得 1 分是因为它**整体**连贯，不是因为每一个字都完美。单独去奖励每个字，会导致梯度的方差极大，甚至让模型学崩（Model Collapse）

## GSPO的改进

### 句子级重要性比率

$$
s_i(\theta) = \left( \frac{\pi_\theta(y_i | x)}{\pi_{\theta_{old}}(y_i | x)} \right)^{\frac{1}{|y_i|}} = \exp \left( \frac{1}{|y_i|} \sum_{t=1}^{|y_i|} \log \frac{\pi_\theta(y_{i,t} | x, y_{i, <t})}{\pi_{\theta_{old}}(y_{i,t} | x, y_{i, <t})} \right)
$$

- $s_i(\theta)$：**比率 (Ratio)**。如果它大于 1，说明新模型比旧模型更倾向于生成这句话。

- $y_i$：第 $i$ 个完整的**回答序列**（Sequence）。

- $|y_i|$：这个回答的**长度**（有多少个 token）。

- $\pi_\theta(y_i | x)$：**新模型**生成这**整句话**的联合概率。

    - _注意：是整句话所有 token 概率的乘积。_

- $\pi_{\theta_{old}}(y_i | x)$：**旧模型**生成这**整句话**的联合概率。

- $\frac{1}{|y_i|}$（指数部分）：**几何平均（Geometric Mean）的归一化**。

    - _为什么要加这个？_ 因为一句话越长，概率乘积就会越小（越乘越接近0）。如果不除以长度，长句子的比率数值会极不稳定。这个操作相当于把"整句话的概率"平摊到了"平均每个字"的层面上。

- $\exp(\dots \sum \log \dots)$：等号右边是把乘法变成了**对数加法**。

把重要性比率的计算方式从计算每个token的log prob的比率变成了计算整个句子的联合概率的比率，使用log改成相加。

### 优势函数计算

$$
\hat{A}_i = \frac{r(x, y_i) - \text{mean}\left( \{ r(x, y_i) \}_{i=1}^G \right)}{\text{std}\left( \{ r(x, y_i) \}_{i=1}^G \right)}
$$

与GRPO一样

### 最终目标函数

$$
J_{\text{GSPO}}(\theta) = \mathbb{E}_{x \sim \mathcal{D}, \{y_i\}_{i=1}^G \sim \pi_{\theta_{old}}} \left[ \frac{1}{G} \sum_{i=1}^G \min \left( s_i(\theta) \hat{A}_i, \text{clip}(s_i(\theta), 1-\epsilon, 1+\epsilon) \hat{A}_i \right) \right]
$$

## token-level 的目标函数变体

$$
J_{\text{GSPO-token}}(\theta) = \mathbb{E}_{x \sim \mathcal{D}, \{y_i\}_{i=1}^G \sim \pi_{\theta_{\text{old}}}(\cdot|x)} \left[ \frac{1}{G} \sum_{i=1}^G \frac{1}{|y_i|} \sum_{t=1}^{|y_i|} \min \left( s_{i,t}(\theta) \hat{A}_{i,t}, \text{clip} \left( s_{i,t}(\theta), 1-\epsilon, 1+\epsilon \right) \hat{A}_{i,t} \right) \right]
$$

**Token 级importance ratio的定义**

$$
s_{i,t}(\theta) = \text{sg}[s_i(\theta)] \cdot \frac{\pi_\theta(y_{i,t} | x, y_{i, <t})}{\text{sg}[\pi_\theta(y_{i,t} | x, y_{i, <t})]}
$$

其中：
sg = Stop Gradient, 相当于python中的torch.detach()
$s_i$ 相当于被"广播"给了这句话里的每一个 Token，然后通过 $\frac{1}{|y_i|} \sum_{t=1}^{|y_i|}$ 平均来还原，保持数值不变。

同时 $\pi_\theta(y_{i,t} | x, y_{i, <t})$ 表示当前这个token的概率值。通过sg和

$$
\frac{\pi_\theta(y_{i,t} | x, y_{i, <t})}{\text{sg}[\pi_\theta(y_{i,t} | x, y_{i, <t})]}
$$

成功完成了梯度转换，获得了token-level的梯度，为将来可能的梯度级别的reward做好了准备。
