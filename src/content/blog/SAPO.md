---
title: "SAPO"
date: 2025-12-29
tags:
  - 阿里
  - Qwen
  - paper
aliases: []
created: 2025-12-29 16:59
提出时间: 2025-11-25
url: https://arxiv.org/abs/2511.20347
---
**全称：** **S**oft **A**daptive **P**olicy **O**ptimization

在MOE架构模型训练中，路由不平均和长回答可能会放大tokens之间的差异，会导致增加不稳定性。过于严格的硬裁剪限制了梯度计算的有效采样数，而宽松的硬裁剪则会引入噪声梯度。

# SAPO

**目标函数**：
$$\mathcal{J}(\theta) = \mathbb{E}_{q \sim \mathcal{D}, \{y_i\}_{i=1}^G \sim \pi_{\theta_{\text{old}}}(\cdot|q)} \left[ \frac{1}{G} \sum_{i=1}^G \frac{1}{|y_i|} \sum_{t=1}^{|y_i|} f_{i,t}(r_{i,t}(\theta)) \hat{A}_{i,t} \right]$$
where $f_{i,t}(x)$ is defined as:
$$f_{i,t}(x) = \sigma(\tau_{i,t}(x-1)) \cdot \frac{4}{\tau_{i,t}}, \quad \tau_{i,t} = \begin{cases} \tau_{\text{pos}}, & \text{if } \hat{A}_{i,t} > 0 \\ \tau_{\text{neg}}, & \text{otherwise} \end{cases}$$

其中**$f_{i,t}$ (Token-level Gate)：** 根据当前 Token 的 $r_{i,t}$ 计算出一个权重。

- 如果这个 Token 很离谱，$f_{i,t}$ 会变小（软截断）。
    
- 如果这个 Token 很正常，$f_{i,t}$ 保持正常。
其中，4是为了抵消sigmoid函数在零处的梯度(1/4)。(x-1)是为了将importance ratio=1对齐到sigmoid函数中x=0的位置。


### 为什么要采用非对称温度
在大型语言模型的强化学习微调中，动作空间是一个庞大的词汇（通常有数十万个令牌），而在特定状态下，期望动作的数量较少。因此，负梯度会扩散到许多无关的标记——虽然提供了一定的正则化，但也引发了不稳定性，尤其是在非策略场景中。