# wvb-ui

## 一、项目的配置、启动和调试

| 命令           | 功能               | 场景                                   |
| -------------- | ------------------ | -------------------------------------- |
| `yarn install` | 安装依赖           | 初始化/更新依赖，生成lock文件          |
| `yarn serve`   | 启动开发服务器     | 实时编译+热更新-修改代码自动刷新浏览器 |
| `yarn build`   | 生产构建           | 压缩代码生成部署文件                   |
| `yarn lint`    | 代码规范检查与修复 | 修复格式/语法问题                      |
| `yarn test`    | 运行测试           | 单元测试/集成测试                      |

**报错：error Error: certificate has expired     at TLSSocket.onConnectSecure (node:_tls_wrap:1677:34)**

在package.json中添加以下的脚本

```json
    "dev": "SET NODE_OPTIONS=--openssl-legacy-provider && vue-cli-service serve",
    "build": "SET NODE_OPTIONS=--openssl-legacy-provider && vue-cli-service build",
```

之后可以直接运行以上的命令，例如

```shell
yarn build
yarn dev
```

**项目端口**

```
3380
```

