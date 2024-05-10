# LowCode
## 简介
本项目是一个拖拽式可视化搭建前端页面的低代码平台，运行于 Vite + Vue3 框架。

## 项目目录结构
```
Low-Code
│  
├─public
│      db.json
│      img.png
│      prompt.md
│      vite.svg
│      
├─server // json-server后端
│      db.json // 数据库文件
│      package.json
│      
└─src
    │  App.vue
    │  main.ts
    │  style.css
    │  vite-env.d.ts
    │  
    ├─assets
    │  │  canvas2image.js // canvas2image的npm包存在bug，故使用本地引入
    │  │  logo.png
    │  │  
    │  └─css
    │          base.css
    │          base.min.css
    │          base.scss // 全局基础样式
    │          dark.css // 黑夜模式样式
    │          icon.css // iconfont图标库样式
    │          
    ├─components
    │  │  index.ts
    │  │  
    │  ├─ComponentList // “左侧组件列表”组件
    │  │      ComponentList.tsx
    │  │      
    │  ├─ConfigMenu // “右侧属性设置”组件
    │  │      ConfigMenu.css
    │  │      ConfigMenu.min.css
    │  │      ConfigMenu.scss
    │  │      ConfigMenu.tsx
    │  │      
    │  ├─EditCanvas // “编辑画布”组件
    │  │      EditCanvas.css
    │  │      EditCanvas.min.css
    │  │      EditCanvas.scss
    │  │      EditCanvas.tsx
    │  │      renderElement.tsx
    │  │      
    │  └─ShowCanvas // 渲染画布组件
    │          renderElement.tsx
    │          ShowCanvas.tsx
    │          
    ├─http // http请求接口
    │      config.ts
    │      index.ts
    │      
    ├─interface // ts类型接口
    │      data.ts
    │      index.ts
    │      store.ts
    │      
    ├─router // 路由
    │      index.ts
    │      
    ├─store // pinia状态管理与持久化
    │      canvas.ts
    │      elements.ts
    │      index.ts
    │      publish.ts
    │      
    ├─utils // 工具函数
    │      bus.ts // bus总线
    │      deepcopy.ts // 深度拷贝函数
    │      registerCommand.ts // 注册操作命令
    │      registerComponent.tsx // 注册组件
    │      screenshots.ts // 截图
    │      throttle.ts // 节流函数
    │      useDragger.ts // 拖拽相关函数
    │      useExport.ts // 导出相关函数
    │      useMove.ts // 移动相关函数
    │      
    └─views // 页面
            HomePage.vue // 主页
            NotFound.vue // 空页面
            PreviewPage.vue // 预览页
```
