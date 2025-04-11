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

**环境切换**

`.env.development`文件,通过切换`VUE_APP_API_URL1`来切换环境，其中`172.168.5.247:8972`前一个为ip，后一个为端口，注意自能填写ipv4地址，不可以填写`localhost`或者`127.0.0.1`

注意：对于后端，`8970`是`https`的端口，而`8972`是`http`的端口

```
# 只在开发模式中被载入

# 网站前缀
BASE_URL = /

# API
#VUE_APP_API_URL1 = http://29135jo738.zicp.vip/api/v1
# VUE_APP_API_URL1 = https://10.60.100.196:18080
//VUE_APP_API_URL1 = http://10.30.2.13:8972
//VUE_APP_API_URL1 = http://10.30.2.8:8972
VUE_APP_API_URL1 = http://172.168.5.247:8972
//VUE_APP_API_URL2 = https://10.60.100.190:8443/
VUE_APP_UI_VERSION = WVPUI_V1.0_20210408
VUE_APP_JITSI_URL = https://10.60.100.190:8443
VUE_APP_WEBSOCKET_URL = 127.0.0.1:18080
```

## 二、报错

如果提示`liences`的报错，可以修改`src/views/shared/login/index.vue`这个文件，注释掉这行代码`lisence()`：

```ts
    const ontipcancel =  () => {
      tipmodel.value = false
      getsetipdlg(true)
    }
    //lisence()
    const getsetipdlg = (blag) => {
      isModalVisible.value = true;
    }
```

