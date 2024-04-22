# LowCode
## 简介
本项目是一个拖拽式可视化搭建前端页面的低代码平台，运行于 Vite + Vue3 框架，为2022年暑假字节跳动青训营结营组队项目。

在线体验: [Lowcode](https://lowcode-rqd-china.vercel.app/)

部署于 Vercel，免运维，热更新部署，不过最近访问受限，需科学上网。
![image.png](https://s2.loli.net/2022/10/16/jgrZC7DXBtm9i6N.png)
## 技术选型
本项目的技术栈包括：Vite、Vue3、Pinia、TypeScript、JSX、json-server、Element Plus。
- 我们项目的核心就是动态的生成 HTML 标签组件，所以在实现上采用的是 JSX 语法；
- 开发框架采用的 Vite+  Vue3 ，能比较好的支持 JSX 语法；
- 数据存储和状态管理采用 Pinia ，相较于 VueX 更加的轻量化、使用起来更加简便；
- 样式和组件来自于 Element Plus，适用于 Vue3；
- 本项目未涉及太多云端数据存储，因此只使用 json-server 搭建了一个简易的后端 mock，用于实现“发布页面”功能。

## 项目难点
### 场景1
拖拽式创建组件，用户需要拖拽组件到画布上进行组件的创建然后在画布上进行编辑，我们不仅需要动态地生成和控制组件，还要及时的保存用户在画布上的组件数据。
#### 解决方案
- 使用一个工具函数 registerComponent 进行组件的注册管理，所有在组件列表上的组件都将在这里进行注册，注册时需要提供组件的各项属性以及渲染出的 JSX 标签；
- 在用户注册时将统一从此处获取组件的默认数据和渲染格式渲染在画布上。
- 使用 Pinia 创建一个名为 elementsStore 的 store，存储和管理画布内元素的状态，并持久化到 LocalStorage。
### 场景2
用户在编辑过程中可能会出现误操作，我们需要为用户提供撤回/重做功能来保证用户使用本平台时的良好体验。
#### 解决方案架构设计
- 我们设计了一个工具函数 registerCommend 进行组件的注册管理，在这里注册撤回/重做操作以及需要提供“撤回/重做”功能的操作，例如删除、移动等；
- 在 registerCommend 中使用一个栈来存储操作命令过程，每个操作在执行后会进行入栈，并存储操作前的数据状态。
- 当需要撤回操作时，registerCommend 会从栈顶取出操作，然后还原数据状态到操作前的状态。

## 项目目录结构
```
Low-Code
│  
├─public
│      db.json
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

## 功能演示

### 演示demo
[演示视频](https://www.bilibili.com/video/BV1tD4y167zZ/)
