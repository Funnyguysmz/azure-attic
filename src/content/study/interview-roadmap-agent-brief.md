---
title: "面试知识点路线图（Agent任务书）"
description: "涵盖范围：面试中高频出现 + 自身相对薄弱的5个知识点（对应\"第一档+第二档\"，即优先级最高的部分）。"
pubDate: 2026-06-30
order: 92
priority: "高"
category: "roadmap"
tags: ["学习路线","Agent"]
lang: "zh"
---

## 用途说明
本文档用于喂给AI Agent，批量生成面试QA、学习要点、以及与本人真实经历的桥接话术。背景信息和任务说明都已包含，可直接整体粘贴作为任务输入，不需要额外补充上下文。

涵盖范围：面试中**高频出现 + 自身相对薄弱**的5个知识点（对应"第一档+第二档"，即优先级最高的部分）。

---

## 候选人背景速览（生成内容时必须绑定使用，确保答案不是教科书式背诵）

- 2025届CS本科，约1年Android开发经验，技术栈以Kotlin为主，C++/ACM竞赛背景转Android，算法基础较强
- 上一份工作：互联网大厂AI产品团队，独立负责AI图创Feed流从零搭建，14个版本迭代保持**零状态不一致Bug**
- 架构：项目整体走MVVM，但状态管理做了MVI风格强化（StateFlow + sealed class 不可变UiState，单向数据流）
- 性能治理实战经历：Payload局部刷新、瀑布流崩溃修复、**协程内存泄漏排查**（这是最有分量的实战案例，重点利用）
- AI Coding工程化：自研Skills和工作流，团队内推广使用，累计400+会话
- 已知短板：Compose未实战（项目用XML）、跨端框架仅了解原理未深入

---

## 任务说明（对Agent的统一要求）

针对下面5个知识点，分别生成：

1. **核心原理讲解**（200-400字，按面试官能听懂、不绕弯子的方式讲，不是教科书复述）
2. **与候选人经历的桥接话术**（1-2句，把抽象知识点接到候选人真实项目经验上，让回答显得不是死记硬背）
3. **3-5个高频追问 + 参考答案要点**（给答题框架和要点，不需要写满分长篇答案）
4. **当前知识缺口提示**（结合候选人背景，指出这个点上他可能答不上来的细节，方便针对性补）

---

## 知识点1：Handler/Looper消息机制 + View绘制三大流程 + 事件分发
**优先级：最高（高频 + 当前最弱）**

覆盖子点：
- Handler/Looper/MessageQueue协作关系，主线程Looper.loop()为什么不会卡死的本质
- View的measure/layout/draw三大流程，MeasureSpec三种模式的含义和触发条件
- 事件分发链路：dispatchTouchEvent / onInterceptTouchEvent / onTouchEvent的调用关系，多层嵌套滑动冲突场景

桥接素材：候选人做过瀑布流（多级嵌套滚动容器，天然涉及事件分发冲突）和Feed流局部刷新（可能涉及View重新测量/绘制的性能问题）

---

## 知识点2：性能优化与分析工具
**优先级：最高（高频 + 当前最弱，但有真实案例可用）**

覆盖子点：
- Android Profiler（CPU/Memory面板）的实际排查流程
- Perfetto / Systrace的使用场景和读图思路
- LeakCanary的工作原理（弱引用 + ReferenceQueue检测）
- 协程相关内存泄漏的常见模式（Job未取消、CoroutineScope绑定生命周期错误、GlobalScope滥用）

桥接素材：候选人有真实的"协程内存泄漏排查"经历，**这是核心素材**。要求Agent重点围绕这一案例反推出一套可复用的叙述模板：怎么发现的 → 用什么工具定位 → 根因是什么 → 怎么修的。再补充1-2个候选人可能没接触过但常被问到的工具细节（比如TraceView怎么看方法耗时）。

---

## 知识点3：RecyclerView
**优先级：高（高频，且有实战经验可直接复用）**

覆盖子点：
- 四级缓存机制（mAttachedScrap / mCachedViews / mViewCacheExtension / RecycledViewPool）
- DiffUtil原理、Payload局部刷新机制
- 瀑布流场景常见崩溃类型：notifyDataSetChanged时机错误、Adapter数据源并发修改、滑动时数据更新导致的IndexOutOfBounds

桥接素材：候选人有真实的Payload局部刷新落地经验和瀑布流崩溃修复经验，**直接复用候选人提到的具体案例**，不要泛泛而谈。

---

## 知识点4：Jetpack Lifecycle + ViewModel
**优先级：高（候选人强项，重点准备深度追问）**

覆盖子点：
- Lifecycle观察者模式实现，LifecycleOwner / LifecycleObserver
- ViewModel存活机制（为什么配置变更能保留数据）、与Activity/Fragment的绑定关系
- 与StateFlow/MVI结合的最佳实践（viewModelScope、repeatOnLifecycle避免重复订阅/内存泄漏）

桥接素材：候选人项目大量使用ViewModel+StateFlow做状态管理，这是他最强的点之一。重点准备"如何用Lifecycle感知能力避免重复订阅/内存泄漏"这类深挖追问，体现深度而不是停留在表面定义。

---

## 知识点5：MVVM / MVP / MVC 对比
**优先级：中（高频开场题，但投入产出比很高）**

覆盖子点：
- 三种模式的核心差异（数据流向、各层职责、对UI测试的友好度）
- 为什么现代Android开发普遍转向MVVM/MVI

桥接素材：候选人项目本质MVVM，但状态管理做了MVI风格强化（StateFlow+sealed class不可变State）。**要求Agent生成一段可以直接在面试中说出的桥接话术**，把这道概念对比题转成"我们实际怎么落地、为什么这么选、效果如何（14个版本零状态不一致）"的经历展示题。

---

## 输出格式要求

请按以上结构，为每个知识点生成完整的Q&A学习卡片，5个知识点格式保持统一，方便后续导入到刷题/复习工具（如QuizMate或新做的移动端知识库）中使用。
