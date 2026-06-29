---
title: "React useEffect 清除函数小贴士"
pubDate: 2026-06-25
tags: ["react", "前端"]
lang: zh
---

在处理以下情况时，务必在 `useEffect` 中返回清除函数（cleanup function）来避免内存泄漏：
1. 事件监听器 (`window.addEventListener`)
2. WebSocket 连接与订阅
3. 定时器 (`setTimeout`, `setInterval`)

```javascript
useEffect(() => {
  const handleResize = () => console.log(window.innerWidth);
  window.addEventListener('resize', handleResize);
  
  // 清除函数
  return () => window.removeEventListener('resize', handleResize);
}, []);
```
避免内存泄漏对于提高页面的 INP（Interaction to Next Paint）性能分数至\重要。
