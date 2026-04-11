---
title: "MiniMax-M1"
date: 2025-12-28
tags:
  - minimax
  - CISPO
  - paper
aliases:
  - CISPO
created: 2025-12-2801:18
提出时间:
url: https://arxiv.org/abs/2506.13585
---
**MiniMax 团队发现梯度clip导致严重的问题：**

- **场景：** 在复杂的推理链中，往往有一些**关键转折词**（如 "Wait", "However", "Recheck"）。
    
- **现状：** 这些词在旧模型（Base Model）中概率很低（High Entropy）。
    
- **后果：** 一旦 RL 发现这些词很有用，新模型会大幅提高它们的概率。这导致概率比率 $r_t = \frac{\pi_{new}}{\pi_{old}}$ 瞬间爆炸（远大于 $1+\epsilon$）。
    
- **灾难：** GRPO 的 Clip 机制立刻触发，把这一项的梯度切断（变成 0）。
    
- **结局：** **模型刚学会“这个词很重要”，系统就禁止它继续学习这个词了。** 这导致长推理链很难涌现。

# CISPO(Clipped IS-weight Policy Optimization)
完整公式如下：
$$J_{CISPO} = \mathbb{E} \left[ \underbrace{\text{detach}\left( \text{clip}(r_t, 1-\epsilon_{low}, 1+\epsilon_{high}) \right)}_{\text{完整的被锁定权重}} \cdot \hat{A}_t \cdot \log \pi_\theta(t) \right]$$
注意这里与GSPO的写法不一样，但是本质是一样的，分子分母约掉，剩下token-level的梯度：
$$ (\ln f)' = \frac{f'}{f}$$

unified fomulation:
$$J_{\text{unify}}(\theta) = \mathbb{E}_{(q,a) \sim \mathcal{D}, \{o_i\}_{i=1}^G \sim \pi_{\theta_{\text{old}}}(\cdot|q)} \left[ \frac{1}{\sum_{i=1}^G |o_i|} \sum_{i=1}^G \sum_{t=1}^{|o_i|} \text{sg}(\hat{r}_{i,t}(\theta))\hat{A}_{i,t} \log \pi_\theta(o_{i,t} | q, o_{i, <t}) M_{i,t} \right]$$
where $M_{i,t}$ is defined as:
$$
M_{i,t} = \begin{cases} 
0 & \text{if } \hat{A}_{i,t} > 0 \text{ and } r_{i,t}(\theta) > 1 + \epsilon_{\text{high}}, \\ 
0 & \text{if } \hat{A}_{i,t} < 0 \text{ and } r_{i,t}(\theta) < 1 - \epsilon_{\text{low}}, \\ 
1 & \text{otherwise.} 
\end{cases}
$$

### GSPO与CISPO对比
| **维度**       | **GSPO (General Sequence PO)**                            | **CISPO (Clipped IS PO)**                                          |
| ------------ | --------------------------------------------------------- | ------------------------------------------------------------------ |
| **针对的敌人**    | **高方差 (High Variance)**                                   | **梯度消失 (Gradient Vanishing)**                                      |
| **GRPO 的缺陷** | GRPO 给每个 Token 分配的权重不同（有的极大，有的极小），导致梯度更新方向抖动，训练不稳定。       | GRPO 的 Clip 机制（`min` 函数）在比率过大时会把梯度**直接切断为 0**，导致模型无法学习那些“突变”的关键步骤。 |
| **核心哲学**     | **“众生平等” (Sequence-level)**<br>不管这一个词说得怎么样，它都要服从整句话的平均表现。 | **“保住火种” (Keep Gradient)**<br>不管这一个词变化多大，都要保留它的梯度信号，不能让它“死”掉。      |
| **比喻**       | **平滑器**：把波峰波谷磨平，大家拿一样的平均工资。                               | **限流阀**：水流太大时限制流量（权重），但绝不关如水龙头（保留梯度）。                              |

# GenRM(Generative Reward Model)
**使用场景**：标准答案有多种形式，规则判断器失效。
**如何评估GenRM**:
- Best-of-N(BON)
- pass@N

# Interesting findings
在每个长度窗口的训练后期发现模型容易发生**模式崩溃**。原因是：在输出长度延长期间，负样本长度增长速度明显快于正样本，且常常更早达到上下文窗口限制。因此，在生成序列的后期段会不成比例地积累较大的负梯度。->熵增
>[!hint]
>模式崩溃：生成的开头还好，越往后越乱，变成乱码或重复的废话。往往是因为陷入了死循环（复读机）或者胡言乱语，导致长度失控，迅速填满整个上下文窗口

**应对措施：**
1. 检测复读机，直接停止输出
2. 结合 “sequence-loss” + “Token-level loss”
3. 降低clip阈值，