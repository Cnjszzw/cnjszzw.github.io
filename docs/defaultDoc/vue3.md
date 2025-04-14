---
Title : vue3学习笔记
Source: 尚硅谷-禹神
---

# # vue3项目结构

## 1.整体结构

```
my-vue3-project/
├── node_modules			 # 依赖的文件，类似于java中的jar包  
├── public/            # 静态资源目录（不经过构建处理）
│   └── favicon.ico    # 网站图标
├── src/							 # 源代码文件
│   ├── assets/        # 静态资源（图片、字体等，会经过构建处理）
│   │   └── logo.png
│   ├── components/    # 公共组件（可复用的 UI 组件）
│   │   └── Example.vue
│   ├── App.vue        # 根组件
│   └── main.js        # 入口文件（初始化 Vue 应用）
│
├── index.html       	 # 入口文件（使用vite），如果是webpack可能就是main.js或者main.js 
├── env.d.ts       		 # 这个文件的作用就是让项目识别jpg txt各种常用文件
├── package.json       # 项目依赖和脚本配置
├── package-lock.json  # 项目依赖和脚本配置(这个一般是自动生成的)
├── tsconfig.app.json  # 配置文件
├── tsconfig.json  		 # 配置文件
├── tsconfig.lock.json # 配置文件
└── vite.config.js     # 整个文件的配置，包括插件和代理都在这配置│
```

## 2.`index.html`

注意其中的`src="/src/main.ts"`支撑着一切

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="icon" href="/favicon.ico">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vite App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

## 3.`src/main.js`

```ts
import './assets/main.css'
//引入createApp用于创建应用
import { createApp } from 'vue'
import App from './App.vue'
//引入App根组件
createApp(App).mount('#app')
```

如果把写app比喻成种花

`createApp`就是花盆（创建应用 ）

`App`就是花的根（组件），所以 `src/app.vue`就是组件了 ，而树叶和枝叶（组件）就是`compontents`下的vue组件

 **src中main.js和app.vue必不可少**  

## 4.App.vue

一个vue文件中，最基本就三个标签：`<template>` `<script>` `<style>`

```vue
<template>
	//用来写结构的，html
</template>

<script>
  //用来写交互的，js或者ts
</script>

<style>
  //用来写样式的
</style>

```

案例：

```vue
<template>
  <div class="app">
    <h1>你好啊！</h1>
  </div>
</template>

<script lang="ts">
export default {
  name: 'App' // 组件名，导出暴露给别人用的，App就是类似于唯一Id
}
</script>

<style>
.app {
  background-color: #ddd;
  box-shadow: 0 0 10px;
  border-radius: 10px;
  padding: 20px;
}
</style>
```































