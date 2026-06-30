---
title: "外部图片生成模型专用 Prompt 手册 (小林coding图解风格)"
description: "💡 使用说明：本手册中定义的 17 个 Prompt，与你 5 个面试知识点文件里预留的图片占位符实现了 1对1完美映射。"
pubDate: 2026-06-30
order: 93
priority: "中"
category: "assets"
tags: ["图片Prompt","图解","学习资料"]
lang: "zh"
---

> 💡 **使用说明**：本手册中定义的 17 个 Prompt，与你 5 个面试知识点文件里预留的图片占位符实现了 **1对1完美映射**。
> 所有 Prompt 均遵循「小林coding」的核心插图美学：**浅色系背景（避免深色遮盖）、圆角框图块、清晰粗实线条、高度体系化的中文逻辑标示、核心节点色块区分**。
> 你可以直接将对应的 Prompt 复制给 AI 绘图模型（如 DALL-E 3、Midjourney、FLUX）或使用 Diagrams.net (draw.io) 按照本描述进行绘制。

---

## 目录索引

*   **知识点 1：Handler/Looper + View绘制 + 事件分发**
    *   [图片 01-1：Handler 消息循环与 Linux epoll 挂起唤醒机制](#-图片-01-1handler-消息循环与-linux-epoll-挂起唤醒机制)
    *   [图片 01-2：View 测量绘制与 MeasureSpec 传递递归过程](#-图片-01-2view-测量绘制与-measurespec-传递递归过程)
    *   [图片 01-3：触摸事件分发拦截与消费决策流程图](#-图片-01-3触摸事件分发拦截与消费决策流程图)
    *   [图片 01-4：滑动冲突外部拦截法与内部拦截法数据流向图](#-图片-01-4滑动冲突外部拦截法与内部拦截法数据流向图)
*   **知识点 2：性能优化与分析工具**
    *   [图片 02-1：CPU Profiler Flame Chart 火焰图与方法耗时比例示意图](#-图片-02-1cpu-profiler-flame-chart-火焰图与方法耗时比例示意图)
    *   [图片 02-2：Systrace 渲染时间线、主线程 Blocked 锁竞争及 Binder 调用阻塞原理图](#-图片-02-2systrace-渲染时间线主线程-blocked-锁竞争及-binder-调用阻塞原理图)
    *   [图片 02-3：LeakCanary 弱引用队列检测与堆分析堆栈定位流程](#-图片-02-3leakcanary-弱引用队列检测与堆分析堆栈定位流程)
    *   [图片 02-4：OkHttp 协程桥接导致 ViewModel 内存泄漏引用链与 invokeOnCancellation 修复对照图](#-图片-02-4okhttp-协程桥接导致-viewmodel-内存泄漏引用链与-invokeoncancellation-修复对照图)
*   **知识点 3：RecyclerView**
    *   [图片 03-1：RecyclerView 四级缓存查找复用决策流程图](#-图片-03-1recyclerview-四级缓存查找复用决策流程图)
    *   [图片 03-2：DiffUtil 最小化差异更新与 Payload 局部刷新 bindViewHolder 链路对比图](#-图片-03-2diffutil-最小化差异更新与-payload-局部刷新-bindviewholder-链路对比图)
    *   [图片 03-3：StaggeredGridLayoutManager 切换 Tab 导致 span 缓存清空引发 Crash 机制与 BiSerialFlow 修复方案](#-图片-03-3staggeredgridlayoutmanager-切换-tab-导致-span-缓存清空引发-crash-机制与-biserialflow-修复方案)
*   **知识点 4：Jetpack Lifecycle + ViewModel**
    *   [图片 04-1：LifecycleOwner 与 LifecycleRegistry 观察者状态对齐状态机](#-图片-04-1lifecycleowner-与-lifecycleregistry-观察者状态对齐状态机)
    *   [图片 04-2：Activity 配置变更重建与 ViewModelStore 暂存恢复机制图](#-图片-04-2activity-配置变更重建与-viewmodelstore-暂存恢复机制图)
    *   [图片 04-3：repeatOnLifecycle(STARTED) 自动收集与后台自动取消协程生命周期图](#-图片-04-3repeatonlifecyclestarted-自动收集与后台自动取消协程生命周期图)
*   **知识点 5：MVVM / MVP / MVC 对比**
    *   [图片 05-1：MVC、MVP 和 MVVM 架构中 View-Model-Controller 依赖与数据流向对比](#-图片-05-1mvcmvp-和-mvvm-架构中-view-model-controller-依赖与数据流向对比)
    *   [图片 05-2：MVI 模式单向数据流 (Unidirectional Data Flow) 闭环与不可变状态 copy 机制](#-图片-05-2mvi-模式单向数据流-unidirectional-data-flow-闭环与不可变状态-copy-机制)
    *   [图片 05-3：MVP 模式中 Presenter 持有 View 导致 Activity 内存泄漏链与 LifecycleObserver 修复方案](#-图片-05-3mvp-模式中-presenter-持有-view-导致-activity-内存泄漏链与-lifecycleobserver-修复方案)

---

## 知识点 1：Handler/Looper + View绘制 + 事件分发

### 🖼️ 图片 01-1：Handler 消息循环与 Linux epoll 挂起唤醒机制
*   **目标文件位置**：`01-Handler-View绘制-事件分发.md` 的 "Handler/Looper/MessageQueue 是怎么协作的？" 小节下方
*   **逻辑闭环与中文标注设计**：
    1.  **左侧（用户空间 - Java 层）**：画一个闭环循环流。
        - 节点一：「Handler」发送消息（`sendMessage`）
        - 节点二：「MessageQueue」消息队列存储
        - 节点三：「Looper.loop()」取出消息并分发（`dispatchMessage`）回到「Handler」
    2.  **右侧（内核空间 - C++/Linux内核层）**：
        - 从「MessageQueue」拉出一条向下的虚线指向内核：「队列无消息，调用 nativePollOnce()」 $\rightarrow$ 进入内核「epoll_wait() 阻塞挂起状态」（用淡红色标示，标注："主线程释放 CPU，线程进入休眠"）。
        - 从外界事件拉一条线指向内核：「用户触摸屏幕 / 硬件中断」 $\rightarrow$ 「写入 eventfd」 $\rightarrow$ 「唤醒 epoll_wait()」 $\rightarrow$ 向上拉虚线返回 Java 层：「nativeWake() 唤醒 Looper 继续循环」（用淡绿色标示）。
*   **图像生成 Prompt**：
    ```text
    A professional, clean systems programming flowchart showing "Android Handler Loop & Linux epoll Wakeup Mechanism" in a light-themed diagrams.net style. 
    Divided into two main horizontal lanes:
    - Top lane (User Space, Java): Containing light blue rounded rects: "Handler (发送/处理消息)", "MessageQueue (消息队列)", and "Looper.loop() (循环分发)". Show a clear circular loop flow using arrows.
    - Bottom lane (Kernel Space, C++): Containing a light red box "epoll_wait() 阻塞挂起 (CPU休眠)" and a light green box "eventfd 写入唤醒".
    Show directional arrows mapping:
    - Empty queue triggering nativePollOnce down to epoll_wait.
    - User Touch Event writing to eventfd, waking up epoll_wait, sending nativeWake arrow back to Looper.loop() to resume.
    All text labels must be written in crisp, clean, highly legible Chinese characters. Soft colors, clean black lines, minimalist vector layout, white background.
    ```

### 🖼️ 图片 01-2：View 测量绘制与 MeasureSpec 传递递归过程
*   **目标文件位置**：`01-Handler-View绘制-事件分发.md` 的 "View 的 measure / layout / draw" 小节下方
*   **逻辑闭环与中文标注设计**：
    1.  展示一个树形结构：「DecorView（根节点）」 $\rightarrow$ 「ViewGroup（父容器）」 $\rightarrow$ 「子 View」。
    2.  **测量阶段（红线双向）**：
        - 向下箭头：「父 View 传递宽高 MeasureSpec 限制」（标注：包含 EXACTLY/精确、AT_MOST/最大、UNSPECIFIED/无限制）
        - 子 View 处理：「结合自身LayoutParams计算出 MeasuredWidth/Height」
        - 向上箭头：「子 View 回传测量结果（setMeasuredDimension）」
    3.  **布局与绘制（绿/蓝线单向）**：
        - 布局箭头（自上而下）：「layout() 分配左上右下顶点 L, T, R, B」
        - 绘制箭头（自上而下）：「draw() 顺序绘制：背景 -> 自身内容 -> 子View -> 滚动条装饰」
*   **图像生成 Prompt**：
    ```text
    A clean, academic-style UI framework tree diagram showing "Android View Layout MeasureSpec Propagation and Rendering Steps" in light vector style.
    Features a parent ViewGroup node pointing to two child View nodes. Show two-way flow arrows for "measure()" labeled in Chinese: "父容器向下传递 MeasureSpec 约束", "子控件计算后向上汇报 Measured 尺寸".
    Draw a side timeline showing: 1. measure() (宽高测量), 2. layout() (确定顶点 L, T, R, B), 3. draw() (背景与内容画布绘制). 
    Colors: light pink for measure, light green for layout, light blue for draw. Crisp Chinese text, no jargon gibberish, white background.
    ```

### 🖼️ 图片 01-3：触摸事件分发拦截与消费决策流程图
*   **目标文件位置**：`01-Handler-View绘制-事件分发.md` 的 "事件分发的三板斧" 小节下方
*   **逻辑闭环与中文标注设计**：
    1.  顶端起点：「MotionEvent (ACTION_DOWN)」 $\rightarrow$ 「Activity.dispatchTouchEvent()」。
    2.  中间分叉决策点（ViewGroup 层）：
        - 「ViewGroup.onInterceptTouchEvent()」
        - 如果拦截 (Yes, 标淡红色)：流向「ViewGroup.onTouchEvent()」
        - 如果不拦截 (No, 标淡绿色)：向下传递给「子 View.dispatchTouchEvent()」 $\rightarrow$ 进入「子 View.onTouchEvent()」
    3.  下端消费分叉决策点（View 消费）：
        - 「子 View.onTouchEvent() 是否返回 true (消费)?」
        - 是 (Yes)：事件链终止，后续 MOVE/UP 独占。
        - 否 (No)：事件向上回传，回到「ViewGroup.onTouchEvent()」进行兜底，若 ViewGroup 也不消费，最终回传给「Activity.onTouchEvent()」。
*   **图像生成 Prompt**：
    ```text
    A technical decision flowchart showing "Android MotionEvent Dispatching & Interception Decision Tree" in diagrams.net white-theme style.
    Use clean geometric diamond boxes for conditions and rounded rects for methods: "dispatchTouchEvent (事件分发)", "onInterceptTouchEvent (事件拦截判断)", and "onTouchEvent (事件消费/处理)".
    Show green paths for "No Intercept / Consumed (返回 true)" and red paths for "Intercepted / Not Consumed (返回 false)".
    Show the event cascading down from Activity through ViewGroup to Child View, and backtracking up when unconsumed.
    All texts are in precise Chinese, high contrast, clean thin line arrows, minimalistic vector layout.
    ```

### 🖼️ 图片 01-4：滑动冲突外部拦截法与内部拦截法数据流向图
*   **目标文件位置**：`01-Handler-View绘制-事件分发.md` 的 "处理嵌套滑动冲突有两种经典方案" 结尾处
*   **逻辑闭环与中文标注设计**：
    1.  **左侧（外部拦截法）**：
        - 「ViewGroup (父容器)」是主宰者。
        - 在 `onInterceptTouchEvent` 中判断滑动方向 $\rightarrow$ 满足自身滑动需求（如纵向） $\rightarrow$ 拦截并消费事件，子 View 收到 `ACTION_CANCEL`。
    2.  **右侧（内部拦截法）**：
        - 「子 View」是主动控制者。
        - 子 View 在 `dispatchTouchEvent` 收到 `ACTION_DOWN` 时，强行调用 `parent.requestDisallowInterceptTouchEvent(true)` 锁死父容器的拦截权。
        - 在 `ACTION_MOVE` 时，如果发现不符合自身滑动需求 $\rightarrow$ 调用 `parent.requestDisallowInterceptTouchEvent(false)` 主动放手，把控制权交还父容器。
*   **图像生成 Prompt**：
    ```text
    A comparative software design diagram showing "Android Nested Scroll Conflict Resolution: External vs Internal Interception".
    - Left Panel: "外部拦截法 (ViewGroup 主导)", showing events flowing into ViewGroup.onInterceptTouchEvent, deciding to hijack (Intercept = true) or deliver to child.
    - Right Panel: "内部拦截法 (子View 主导)", showing child View dispatchTouchEvent calling parent.requestDisallowInterceptTouchEvent(true) to disallow parent interception, and releasing it dynamically.
    Use distinct light-colored boxes, clean direction lines, clear Chinese text labels. Minimalist architecture blueprint style, white background.
    ```

---

## 知识点 2：性能优化与分析工具

### 🖼️ 图片 02-1：CPU Profiler Flame Chart 火焰图与方法耗时比例示意图
*   **目标文件位置**：`02-性能优化与分析工具.md` 的 "Android Profiler 怎么用？" 小节下方
*   **逻辑闭环与中文标注设计**：
    1.  绘制一个典型的火焰图层次结构（横轴代表时间/耗时占比，纵轴代表方法调用栈）。
    2.  顶层方块：「Thread.run()」 (最宽) $\rightarrow$ 下层分支：「Choreographer.doFrame()」 $\rightarrow$ 再下层分支：「performTraversals()」 $\rightarrow$ 底层分支分为测量、布局与绘制。
    3.  **高亮指出耗时热点**：在底层某一个方块（例如「BitmapFactory.decodeStream()」或「自定义 View 的 onMeasure()」）用醒目的淡红色框出，并拉出箭头标注："耗时占比高（方块最宽），说明是瓶颈节点，应当首先优化它"。
*   **图像生成 Prompt**：
    ```text
    A visualization of an "Android Studio CPU Profiler Flame Chart" for debugging call stack execution times.
    Horizontal axis represents execution time percentage; vertical axis represents call stack depth. Clean vector rects stacked on top of each other.
    Show nested blocks in Chinese: "主线程循环", "Choreographer 帧回调", "View树遍历绘制 performTraversals", and a very wide red highlighted bottom block "ImageView图片解码 (耗时瓶颈)".
    Minimalist design, light background, clear layout with a scale bar, clean Chinese labels, high-contrast, diagrams.net style.
    ```

### 🖼️ 图片 02-2：Systrace 渲染时间线、主线程 Blocked 锁竞争及 Binder 调用阻塞原理图
*   **目标文件位置**：`02-性能优化与分析工具.md` 的 "Perfetto / Systrace 的读图思路" 小节下方
*   **逻辑闭环与中文标注设计**：
    1.  横向绘制三条并行的轨道轴：「Frame (帧状态轨道)」、「UI Thread (主线程)」、「RenderThread (渲染线程)」。
    2.  **Frame 轨道**：前两帧是绿色的（正常），第三帧标记为红色（掉帧，耗时超过 16.6ms）。
    3.  **UI Thread 轨道**：在红帧的时间区间内，主线程先有一段是绿色的 `Running` 状态，接着突变成灰色的 `Blocked` 状态，标注指向下方：「主线程遭遇锁竞争或执行 Binder 同步阻塞调用，被挂起等待」。
    4.  **RenderThread 轨道**：由于主线程 Blocked 导致没有在 VSYNC 周期内完成绘图数据交付，RenderThread 轨道呈现空白，最终导致画面掉帧（标红）。
*   **图像生成 Prompt**：
    ```text
    A technical schematic timeline of "Android Systrace / Perfetto Thread Scheduling and Frame Dropping".
    Draw three parallel horizontal tracks:
    - "Frame 状态": showing normal green frames and one red frame (Jank, >16.6ms).
    - "UI Thread (主线程)": showing Running state (green) changing into Blocked state (gray), labeled with an arrow pointing to "锁竞争 (Monitor Contention) 或 Binder 同步阻塞".
    - "RenderThread (渲染线程)": showing delay due to UI thread block.
    Ensure neat lines, flat vector layout, light theme, high contrast Chinese labels. White background.
    ```

### 🖼️ 图片 02-3：LeakCanary 弱引用队列检测与堆分析堆栈定位流程
*   **目标文件位置**：`02-性能优化与分析工具.md` 的 "LeakCanary 的检测原理" 小节下方
*   **逻辑闭环与中文标注设计**：
    1.  时序左往右流程图。
        - 步骤一：「Activity/Fragment 销毁 (onDestroy)」 $\rightarrow$ 包装成「WeakReference（弱引用）」并关联「ReferenceQueue（引用队列）」。
        - 步骤二：「等待 5 秒」 $\rightarrow$ 「主动向虚拟机调用 Runtime.gc() 建议垃圾回收」。
        - 步骤三：判定分叉：「判断 ReferenceQueue 中是否有刚才销毁对象的弱引用？」。
            - 有（绿色分支） $\rightarrow$ 标注："对象已被安全回收，无内存泄漏"。
            - 无（红色分支） $\rightarrow$ 标注："对象无法回收，仍在堆中！" $\rightarrow$ 进入步骤四：「Dump 堆内存，生成 .hprof 文件」 $\rightarrow$ 「Shark 库静态分析引用链」 $\rightarrow$ 「计算出 GC Root 最短引用链并通知开发者」。
*   **图像生成 Prompt**：
    ```text
    A sleek step-by-step pipeline diagram showing "LeakCanary WeakReference and ReferenceQueue Memory Leak Detection Flow".
    Use clean numbered boxes (1 to 4) in Chinese:
    1. "包装弱引用并关联引用队列", 
    2. "延时触发主动 GC", 
    3. "检查引用队列判断是否回收" (a split diamond condition), 
    4. "Dump堆内存并通过 Shark 引擎计算 GC Root 引用链".
    Use soft green for successful GC path, soft red for leak detected path. Minimalist vector art, clean labels, high resolution Chinese text, white background.
    ```

### 🖼️ 图片 02-4：OkHttp 协程桥接导致 ViewModel 内存泄漏引用链与 invokeOnCancellation 修复对照图
*   **目标文件位置**：`02-性能优化与分析工具.md` 的 "桥接话术与实战模板" 小节下方
*   **逻辑闭环与中文标注设计**：
    1.  **左侧（泄漏状态）**：
        - 绘制引用长链（上而下）：[GC Root (网络线程池 / OkHttp Dispatcher)] $\rightarrow$ (强引用) $\rightarrow$ [OkHttp RealCall & Callback] $\rightarrow$ (持有其隐式成员) $\rightarrow$ [Continuation 挂起点对象] $\rightarrow$ (持有作用域) $\rightarrow$ [viewModelScope] $\rightarrow$ (持有宿主) $\rightarrow$ [ViewModel (已销毁，无法释放)]。
    2.  **右侧（修复状态）**：
        - 在 `viewModelScope` 上画一个闪电/取消符号。
        - 指向右侧：「注册 invokeOnCancellation 回调」 $\rightarrow$ 触发「okHttpClient.call.cancel()」 $\rightarrow$ 斩断了 [GC Root / OkHttp Thread] 到 [Callback] 的关联（用红色的剪断符号标示） $\rightarrow$ 整个 ViewModel 被垃圾回收器成功回收（标绿）。
*   **图像生成 Prompt**：
    ```text
    A reference graph illustrating "OkHttp Coroutine Bridge Memory Leak and Fixing Solution" for Android.
    - Left side: "内存泄漏链", a vertical chain starting from "GC Root (网络线程池)" -> "OkHttp RealCall & Callback" -> "Continuation (协程挂起点)" -> "viewModelScope" -> "ViewModel (已销毁，锁死在堆中)". Color code the ViewModel node red to represent leak.
    - Right side: "修复方案", showing a scissors or cut sign breaking the link, triggered by viewModelScope.cancel() executing invokeOnCancellation { call.cancel() }.
    All labels must be in clean Chinese characters. Diagrams.net flat vector style, light background, clear layout.
    ```

---

## 知识点 3：RecyclerView

### 🖼️ 图片 03-1：RecyclerView 四级缓存查找复用决策流程图
*   **目标文件位置**：`03-RecyclerView.md` 的 "RecyclerView 的四级缓存是怎么协同复用的？" 小节下方
*   **逻辑闭环与中文标注设计**：
    1.  起始点：「需要复用一个 ViewHolder（根据 position 和 viewType）」。
    2.  逐级向下判断：
        - 一级决策：「mAttachedScrap (屏幕内缓存)」有吗？ $\rightarrow$ 有 (Yes)：「取回，直接复用（无需重新 measure/layout/draw）」。
        - 二级决策：「mCachedViews (屏幕外缓存，容量2)」有吗？ $\rightarrow$ 有 (Yes)：「取回，带数据直接上屏（免 bind）」。
        - 三级决策：「mViewCacheExtension (自定义缓存)」有吗？ $\rightarrow$ 有 (Yes)：「按自定义规则复用」。
        - 四级决策：「RecycledViewPool (共享池)」有对应 viewType 的 ViewHolder 吗？ $\rightarrow$ 有 (Yes)：「取出，调用 onBindViewHolder() 重新绑定数据」。
        - 以上均无：「调用 onCreateViewHolder() 创建新实例」 $\rightarrow$ 「调用 onBindViewHolder() 绑定数据」。
*   **图像生成 Prompt**：
    ```text
    A decision tree flow chart for "RecyclerView 4-Level Cache Reuse Flow" with neat visual blocks in Chinese.
    Top entry: "需要获取 ViewHolder". Four conditional diamonds: 
    1. "1级 mAttachedScrap 命中?", 
    2. "2级 mCachedViews 命中?", 
    3. "3级 mViewCacheExtension 命中?", 
    4. "4级 RecycledViewPool 缓存池有对应 viewType?".
    Map the result boxes in soft green: "直接上屏复用 (免create, 免bind)" and "清空状态, 重新调用 onBindViewHolder 绑定数据".
    Show fallback path if all fail: "调用 onCreateViewHolder 新建" -> "onBindViewHolder 绑定".
    Clean vector diagram, high legibility Chinese font, pastel colors, white background.
    ```

### 🖼️ 图片 03-2：DiffUtil 最小化差异更新与 Payload 局部刷新 bindViewHolder 链路对比图
*   **目标文件位置**：`03-RecyclerView.md` 的 "DiffUtil 原理与 Payload 局部刷新" 小节下方
*   **逻辑闭环与中文标注设计**：
    1.  **左侧（常规刷新 notifyDataSetChanged）**：
        - 列表里的一个 Item 卡片被彻底移除，然后又重新创建。
        - 标注红线：“清除原有 ViewHolder $\rightarrow$ 从 Pool 中取或重新 create $\rightarrow$ 重新加载大图图片 $\rightarrow$ 触发完整绘制（耗时大，卡片闪烁）”。
    2.  **右侧（Payload 局部刷新）**：
        - 列表里的 Item 卡片只对其中部分数据（例如红心和点赞数字）产生更新。
        - 标注绿线：“DiffUtil 计算出仅有点赞数变化 $\rightarrow$ 调用 notifyItemChanged(position, NOTIFY_LIKE_CHANGE_TAG) $\rightarrow$ 触发三参数 bindViewHolder $\rightarrow$ **只更新数字 Text，大图 ImageView 不动**（不闪烁，极速上屏）”。
*   **图像生成 Prompt**：
    ```text
    A technical comparison diagram showing "RecyclerView DiffUtil & Payload Partial Refresh vs Global notifyDataSetChanged" with Chinese labels.
    - Left half: "传统全局刷新 (notifyDataSetChanged)", showing a card layout with image and text completely cleared and rebuilt, resulting in high overhead (marked in light red).
    - Right half: "Payload 局部刷新", showing DiffUtil calculating change, delivering a payload bundle, executing three-parameter onBindViewHolder to ONLY update the like count TextView, bypassing image decoding (marked in light green).
    Clean vector style, neat layouts, precise Chinese typography, white background.
    ```

### 🖼️ 图片 03-3：StaggeredGridLayoutManager 切换 Tab 导致 span 缓存清空引发 Crash 机制与 BiSerialFlow 修复方案
*   **目标文件位置**：`03-RecyclerView.md` 的 "瀑布流常见崩溃与不一致现象" 小节下方
*   **逻辑闭环与中文标注设计**：
    1.  **崩溃链路（左侧）**：
        - 1. ViewPager2 快速切 Tab $\rightarrow$ 2. 触发原生的 `onDetachedFromWindow()` $\rightarrow$ 3. 原生 LayoutManager **强制调用 `invalidateSpanAssignments()` 彻底清除全部已有的 span 列状态缓存** $\rightarrow$ 4. 切回原页面重新 Attach，由于在并发滑动，系统再次计算布局锚点指向该 item，却因为没有 span 缓存而返回 null $\rightarrow$ **引发 IndexOutOfBoundsException NPE 崩溃**。
    2.  **修复方案（右侧）**：
        - 自定义 `BiSerialFlowLayoutManager` $\rightarrow$ 重写 `onDetachedFromWindow()` 为**空实现**，拒绝清除 span 缓存 $\rightarrow$ 同时拦截滑动标志位 `canScrollVertically` 屏蔽并发布局滑动 $\rightarrow$ 数据完整保留，零崩溃。
*   **图像生成 Prompt**：
    ```text
    A detailed sequence/cause-effect architecture diagram showing "RecyclerView StaggeredGridLayoutManager Tab Switch Crash & BiSerialFlow Solution" in Chinese.
    - Left side: "崩溃触发过程", showing ViewPager2 switching tab -> detaching -> SLM calling invalidateSpanAssignments() -> clearing span cache (mSpans) -> reattaching while scrolling -> accessing null span -> IndexOutOfBoundsException Crash.
    - Right side: "BiSerialFlowLayoutManager 修复方案", showing empty override of onDetachedFromWindow() to keep span cache intact, combined with custom canScrollVertically() to block invalid scroll updates during layout.
    Neat boxes, soft red and green highlights, bold clean Chinese text, white background.
    ```

---

## 知识点 4：Jetpack Lifecycle + ViewModel

### 🖼️ 图片 04-1：LifecycleOwner 与 LifecycleRegistry 观察者状态对齐状态机
*   **目标文件位置**：`04-Lifecycle-ViewModel.md` 的 "Lifecycle 观察者模式是怎么实现的？" 小节下方
*   **逻辑闭环与中文标注设计**：
    1.  绘制一个包含 5 个生命周期 State（状态）的横向环形状态转移图。
        - 状态点：「INITIALIZED」 $\rightarrow$ 「CREATED」 $\rightarrow$ 「STARTED」 $\rightarrow$ 「RESUMED」 $\rightarrow$ 「DESTROYED」
    2.  在状态转移线之间，标注对应的 `Event`（事件）：
        - `ON_CREATE`（从 INITIALIZED 到 CREATED）
        - `ON_START`（从 CREATED 到 STARTED）
        - `ON_RESUME`（从 STARTED 到 RESUMED）
        - 反向事件：`ON_PAUSE`、`ON_STOP`、`ON_DESTROY`。
    3.  展示观察者（Observer）注册时的状态对齐机制：不管你是在 `onStart` 还是 `onResume` 注册，`LifecycleRegistry` 都会驱动观察者一路向后走，直到其生命周期 State 对齐到宿主的最前台状态。
*   **图像生成 Prompt**：
    ```text
    A clean state machine diagram illustrating the "Android Jetpack Lifecycle State & Event Transitions" with Chinese labels.
    Show the five core states: INITIALIZED, CREATED, STARTED, RESUMED, and DESTROYED as rounded nodes. Connect them with transition arrows showing events: ON_CREATE, ON_START, ON_RESUME, ON_PAUSE, ON_STOP, ON_DESTROY.
    Illustrate an observer aligning its status automatically to matching host state (状态自动对齐机制).
    Clean layout, diagrams.net technical flat style, sans-serif Chinese font, white background.
    ```

### 🖼️ 图片 04-2：Activity 配置变更重建与 ViewModelStore 暂存恢复机制图
*   **目标文件位置**：`04-Lifecycle-ViewModel.md` 的 "ViewModel 重建保活的机制" 小节下方
*   **逻辑闭环与中文标注设计**：
    1.  绘制一个左至右的时间轴。
    2.  **左侧（Activity A 销毁阶段）**：
        - 遭遇配置变更（屏幕旋转） $\rightarrow$ 触发销毁。
        - 关键动作：“调用 `retainNonConfigurationInstances()`，将 Activity 持有的唯一的 `ViewModelStore` 提取出来，暂存在系统服务的 NonConfigurationInstances 容器中”。
    3.  **右侧（Activity B 创建重建阶段）**：
        - 重新实例化的 Activity B 执行 `onCreate()` $\rightarrow$ 通过 `getLastNonConfigurationInstance()` 拿回刚才暂存的 `ViewModelStore` $\rightarrow$ 访问同一个 ViewModel 实例（数据完好如初）。
*   **图像生成 Prompt**：
    ```text
    An architectural workflow diagram showing "Android Activity Configuration Change and ViewModelStore Retention Mechanism" with clear Chinese labels.
    Timeline layout showing:
    1. Old Activity A destroying due to screen rotation -> extracting ViewModelStore container.
    2. Saving ViewModelStore inside system's NonConfigurationInstances cache (NonConfigurationInstances 暂存器).
    3. Recreated Activity B query ViewModelProvider -> fetching back the cached ViewModelStore via getLastNonConfigurationInstance() -> reusing identical ViewModel.
    Clean flat vectors, light colors (light blue/green), sans-serif Chinese text, white background.
    ```

### 🖼️ 图片 04-3：repeatOnLifecycle(STARTED) 自动收集与后台自动取消协程生命周期图
*   **目标文件位置**：`04-Lifecycle-ViewModel.md` 的 "StateFlow 在 MVI 中的订阅防漏与生命周期感知" 小节下方
*   **逻辑闭环与中文标注设计**：
    1.  **Activity 前后台切换状态对照**：
        - **处于前台（STARTED / RESUMED 状态）**：
            - `repeatOnLifecycle(STARTED)` 开启收集，订阅协程激活。
            - 标注绿线：“Flow 数据流 $\rightarrow$ UI 界面刷新”（资源消耗中，UI正常响应）。
        - **切入后台（STOPPED 状态，App 被 Home 键退后台）**：
            - `repeatOnLifecycle(STARTED)` 自动触发 **`job.cancel()`，终止订阅协程**。
            - 标注红叉断裂线：“Flow 收集器彻底关闭 $\rightarrow$ 生产者向缓冲区发送数据停止（不消耗后台 CPU，不发生内存泄漏）”。
*   **图像生成 Prompt**：
    ```text
    A timeline state diagram showing "repeatOnLifecycle(STARTED) Auto Collect and Cancel Pipeline" in Chinese.
    Show two comparative columns:
    - Left Column: "前台状态 (STARTED/RESUMED)", showing coroutine collecting from StateFlow, updating UI dynamically (marked green).
    - Right Column: "后台状态 (STOPPED)", showing repeatOnLifecycle automatically calling job.cancel() to close collector, preventing background CPU overhead or leaks (marked in warning soft red).
    Crisp typography, clean arrows, modern flat diagram design, white background.
    ```

---

## 知识点 5：MVVM / MVP / MVC 对比

### 🖼️ 图片 05-1：MVC、MVP 和 MVVM 架构中 View-Model-Controller 依赖与数据流向对比
*   **目标文件位置**：`05-MVVM-MVP-MVC对比.md` 的 "从 MVC 到 MVP 的演进" 小节下方
*   **逻辑闭环与中文标注设计**：
    1.  绘制并排展示的三个经典三角架构图。
        - **MVC 图**：View (XML/Activity) $\rightarrow$ Controller (Activity) $\rightarrow$ Model $\rightarrow$ View。双向交叉线，标注：“双向耦合重，关系杂乱”。
        - **MVP 图**：View (Activity) $\leftrightarrow$ Presenter $\leftrightarrow$ Model。Presenter 充当双向中介，View 和 Presenter 双向持有（接口爆炸）。
        - **MVVM 图**：View (Activity/XML) $\rightarrow$ ViewModel $\leftrightarrow$ Model。ViewModel 不持有 View，View 通过单向 LiveData/Flow 观察 ViewModel 的数据（解耦最彻底，VM 无 UI 依赖）。
*   **图像生成 Prompt**：
    ```text
    A three-panel architectural comparison diagram showing "MVC vs MVP vs MVVM Architecture and Data Flow in Android" in clean vector blueprint style.
    Use distinct panels with Chinese titles: "MVC 模式", "MVP 模式", and "MVVM 模式".
    Show directional arrows between boxes: View, Model, Controller (in MVC), Presenter (in MVP), and ViewModel (in MVVM).
    Highlight that:
    - In MVP, View and Presenter have two-way dependency interfaces.
    - In MVVM, ViewModel does not hold a View reference, View observes ViewModel via reactive streams (单向观察).
    Light theme, pastel block colors, highly legible Chinese labels, white background.
    ```

### 🖼️ 图片 05-2：MVI 模式单向数据流 (Unidirectional Data Flow) 闭环与不可变状态 copy 机制
*   **目标文件位置**：`05-MVVM-MVP-MVC对比.md` 的 "MVI 强化（单向数据流与单一可信数据源）" 小节下方
*   **逻辑闭环与中文标注设计**：
    1.  绘制一个环状流程图。
        - 「View (Activity/Fragment)」 $\rightarrow$ 发送「Intent (用户意图：如 LoadMore/Like)」 $\rightarrow$ 「ViewModel」 $\rightarrow$ 执行逻辑后，通过 `State.copy()` 产生全新的不可变状态 $\rightarrow$ 「UiState (唯一数据源)」 $\rightarrow$ 单向观察流回 $\rightarrow$ 「View 渲染」。
    2.  高亮放大 `State.copy()` 节点的不可变机制：
        - “数据状态是只读的，只 copy 变化的部分，生成新 State 实例，而不是直接修改旧 State 的属性值。这保证了状态转移的完全可控”。
*   **图像生成 Prompt**：
    ```text
    A circular loop flow diagram illustrating "MVI Unidirectional Data Flow and Immutable State copy Mechanism".
    clockwise loop layout: View -> (triggers Intent/用户意图) -> Intent -> (handled by) -> ViewModel -> (creates new state copy) -> UiState (唯一数据源) -> (observes back to) -> View.
    Highlight the "state.copy()" node in a callout bubble, explaining in Chinese: "不可变状态增量克隆, 严禁直接修改原有状态属性".
    Clean vector graphic style, diagrams.net aesthetic, light background, clear Chinese text, high resolution.
    ```

### 🖼️ 图片 05-3：MVP 模式中 Presenter 持有 View 导致 Activity 内存泄漏链与 LifecycleObserver 修复方案
*   **目标文件位置**：`05-MVVM-MVP-MVC对比.md` 的 "追问 2：你之前说在今日头条面试时被问到没用过 MVP？如果现在面试官追问你怎么看 MVP 的内存泄漏问题，怎么答？" 小节下方
*   **逻辑闭环与中文标注设计**：
    1.  **左侧（内存泄漏链）**：
        - GC Root (网络回调/线程) $\rightarrow$ 强引用 $\rightarrow$ Presenter $\rightarrow$ 强引用（`mView` 属性） $\rightarrow$ View (Activity 实例已销毁) $\rightarrow$ **无法被回收，内存泄漏**。
    2.  **右侧（解决方案对照）**：
        - 方案一：「引入 WeakReference」 $\rightarrow$ Presenter 持有的是 `WeakReference<View>`，GC 时可直接切断并回收。
        - 方案二：「Lifecycle 感知」 $\rightarrow$ Presenter 绑定 LifecycleObserver，监听到宿主 onDestroy 事件 $\rightarrow$ 自动触发 `mView = null` 解绑，斩断引用长链，Activity 安全释放。
*   **图像生成 Prompt**：
    ```text
    A diagnostic memory reference diagram illustrating "MVP Presenter Memory Leak Chain and Lifecycle Fix" with Chinese text.
    - Left Panel: "内存泄漏链", showing GC Root (异步任务线程) -> holding Presenter -> holding mView (Activity instance which is already destroyed, marked in soft red "内存泄漏").
    - Right Panel: "修复方案", showing two options: 1. WeakReference<View> instead of direct reference, 2. Presenter implementing LifecycleObserver to set mView = null on ON_DESTROY (marked in green "连接断开, Activity回收成功").
    Flat vector blueprint style, highly readable Chinese characters, white background.
    ```
