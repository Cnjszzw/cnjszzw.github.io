# 一、内容概述

主要参考以下链接的文章，这个文章是一个WebRTC的快速入门指南。

```url
http://www.52im.net/thread-4184-1-1.html
```

# 二、什么是WebRTC

中文翻译过来就叫网页即时通信（Web Real-Time Communication），是一个支持网页浏览器进行实时语音对话或视频对话的技术方案。注意区分下P2P、UDP、WebRTC的区别。

# 三、为什么需要WebRTC

## 3.1、我们为何要建立 WebRTC？

P2P是架构（常见的种子文件共享也是用的这个），UDP是传输层协议，类似TCP，而WebRTC接近于HTTP这种应用层协议的定位，本质上 是 P2P 模式的实时通信框架，依赖 UDP 和自定义协议，WebRTC 不是单一协议，而是**协议集合** （如 RTP/RTCP、DTLS、ICE 等）和**API 标准**。

| 概念       | 层级/类型  | 作用                                                         | 关键特性                                                     |
| ---------- | ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **P2P**    | 网络架构   | 设备直接通信，减少中转延迟，适合实时场景（如直播、视频会议）。 | 去中心化、低延迟、直接传输，依赖 NAT 穿透技术（如 ICE、STUN/TURN）。 |
| **UDP**    | 传输层协议 | 提供无连接、不可靠但低延迟的数据传输，适合实时音视频场景。   | 无握手、无重传、无拥塞控制，需应用层自行处理可靠性（如 WebRTC 封装）。 |
| **WebRTC** | 应用层框架 | 基于 UDP 的实时音视频通信标准，支持浏览器和设备间的 P2P 通信。 | 封装 UDP 实现加密（DTLS）、拥塞控制、NAT 穿透，提供标准化 API（如 `RTCPeerConnection`）。 |

**关键关系**

1. **层级依赖**：  
   - WebRTC（应用层） → 封装 UDP（传输层） → 实现 P2P（网络架构）。  
2. **协议协作**：  
   - UDP 提供低延迟传输，WebRTC 补充可靠性与安全性，P2P 确保直接路径。  
3. **适用场景**：  
   - 实时音视频（直播、会议）优先选择 **P2P + UDP + WebRTC** 组合。

## 3.2、在 WebRTC 中究竟发生了哪些事呢？

---

### **1. 互相“介绍自己”**
- **A 和 B 各自写一份“简历”（SDP）**：  
  - 我的联系方式（IP 地址、端口）  
  - 我能发什么视频（支持的格式，比如高清/标清）  
  - 我想怎么加密通话（安全协议）  

---

### **2. 通过“朋友”交换简历**
- **找中间人传话**：  
  - A 和 B 用微信、邮件、甚至喊一嗓子，把简历给对方。  
  - **注意**：中间人只负责传简历，不参与后续通话！

---

### **3. 找到最快的通话路径**
- **尝试所有可能的路**：  
  - 直接打电话（P2P 直连）  
  - 通过运营商转接（STUN 服务器穿透 NAT）  
  - 实在不行用快递（TURN 服务器中继，兜底用）  
- **选最快的路**：通常是直接通话，延迟最低！

---

### **4. 开始加密通话**
- **加密通道**：用简历里约定的密码（DTLS）加密，防止偷听。  
- **实时传输**：边说话边调整音量（动态码率），保证不卡顿。

---

### **为什么不用中间人直接传话？**
- **中间人太慢**：就像快递绕道北京再到上海，P2P 是直达航班！  
- **省钱省资源**：不经过服务器，带宽成本归用户自己（比如直播平台省流量）。

---

### **一句话总结**
**WebRTC = 先通过朋友互相认识（交换 SDP），然后直接打电话（P2P），选最快的路，加密防偷听。**

# 四、WebRTC 的关键技术和概念

## 4.1、概述

对主要解释了WebRTC 的各项关键技术和概念。

```
Q NAT是什么？
Q STUN是什么？
Q TURN是什么？
Q ICE、SDP是什么？
Q 信令交换是什么？


Q wbeRTC为什么需要内网穿透？仅仅使用NAT不可以吗？
```

## 4.2、NAT

### **1. 什么是 NAT？一句话解释**  
**NAT（网络地址转换）** = 路由器的“翻译官”  

- **作用**：让你家多台设备（手机、电脑）共用一个公网 IP 上网。  
- **问题**：外网设备找不到你家的内网设备（比如你的电脑），因为内网 IP 是“隐形”的。  

---

### **2. 举个栗子：你家电脑如何访问网站？**  
- **场景**：你的电脑（内网 IP `10.0.0.2`）想访问网站服务器（公网 IP `4.4.4.4:80`）。  
- **步骤**：  
  
  1. **电脑发请求**：电脑生成数据包，写上“我要访问 `4.4.4.4:80`”，**源地址**填自己的内网 IP `10.0.0.2`。  
  2. **路由器翻译**：  
     
     - 路由器收到请求，发现目标地址是外网（怎么发现的？是通过子网掩码的运算），立刻变身“翻译官”：  
       - 把 **源地址** 从 `10.0.0.2` 改成自己的公网 IP `5.5.5.5`，  
       - 随机分配一个端口（比如 `3333`），并记下“小本本”：  
         > `5.5.5.5:3333` → `10.0.0.2`  
  3. **服务器回复**：网站服务器收到请求，回复数据包发到 `5.5.5.5:3333`。  
  4. **路由器再翻译**：  
     - 路由器查“小本本”，把目标地址 `5.5.5.5:3333` 转回 `10.0.0.2`，数据包成功送到你电脑！  

### **3. NAT 的四种“门卫模式”**  
路由器的“严格程度”不同，影响外网能否主动找到你：  

| **模式**            | **规则**                                                                 | **类比**                                                                 |
|---------------------|-------------------------------------------------------------------------|-------------------------------------------------------------------------|
| **完全开放型**       | 任何外网设备发到 `5.5.5.5:3333` 的数据，都转给 `10.0.0.2`。               | 小区门卫：只要快递寄到你家地址，不管是谁寄的，直接放行。                          |
| **半开放型**         | 只转给之前联系过的 IP（比如 `4.4.4.4`），其他 IP 的快递拒收。               | 门卫：只收你之前买过东西的商家快递。                                            |
| **较严格型**         | 只收特定 IP + 端口的快递（比如 `4.4.4.4:80`），其他全拒。                   | 门卫：必须是某商家的某个分店寄的快递才收。                                        |
| **最严格型（对称NAT）** | 快递必须是 **同一商家、同一分店、同一快递员** 寄的，否则拒收。                | 门卫：连快递员换了个工牌都不行，直接扔掉！                                        |


### **4. WebRTC 如何突破 NAT？**  
- **问题**：WebRTC 需要两台内网设备直接通话（比如视频聊天），但 NAT 挡在中间。  
- **解决工具**：  
  - **STUN 服务器**：像“侦察兵”，帮你找到自己的公网 IP 和端口。  
  - **TURN 服务器**：如果 NAT 太严格（比如对称型），直接通过它中转数据（备用方案）。  
- **关键结论**：  
  - 前三种 NAT 可通过 STUN 穿透，WebRTC 正常工作。  
  - 对称 NAT 必须依赖 TURN 服务器（性能差，成本高）。  

---

**一句话总结**：NAT 是路由器的“隐形斗篷”，WebRTC 需要 STUN/TURN 这类“破隐符”才能穿透斗篷，实现直接通话！

## 4.3、STUN
### **1. 什么是 STUN？一句话解释**  
**STUN（Session Traversal Utilities for NAT）** = 帮你“照镜子”的服务器  
- **作用**：让内网设备（如你的电脑）知道自己在公网的“形象”（Public IP + Port）。  
- **限制**：能搞定前三种 NAT（完全开放/半开放/较严格），但搞不定最严格的对称 NAT。  

### **2. 举个栗子：STUN 如何帮你“照镜子”？**  
- **场景**：你的电脑（内网 IP `10.0.0.2`）想知道自己在公网的“形象”。  
- **步骤**：  
  
  1. **发请求**：电脑向 STUN 服务器（如 `stun.l.google.com:19302`）发送一个“照镜子”请求。  
  2. **路由器翻译**：  
     
     - 路由器把请求的源地址 `10.0.0.2` 改成自己的公网 IP `5.5.5.5`，  
     - 随机分配端口 `3333`，并记下“小本本”：  
       > `5.5.5.5:3333` → `10.0.0.2`  
  3. **STUN 服务器反馈**：  
     - 服务器收到请求后，直接读取数据包的来源地址（即 `5.5.5.5:3333`），  
     - 把这个公网“形象”打包成响应，发回给你的电脑。  
  4. **你的电脑觉醒**：  
     - 现在你知道了：“我在外网看来是 `5.5.5.5:3333`！”  
### **3. STUN 的“超能力”与“死穴”**  
| **NAT 类型**       | **STUN 能否穿透？** | **为什么？**                                                                 |
|--------------------|---------------------|-----------------------------------------------------------------------------|
| **完全开放型**      | ✅ 轻松穿透          | 外网设备直接通过 `5.5.5.5:3333` 找到你，无需任何条件。                          |
| **半开放型**        | ✅ 需要“预热”        | 第一次连接会失败，需先通过服务器交换信息，让路由器记录对方的 IP。                |
| **较严格型**        | ✅ 需要“精准预热”    | 不仅要记录对方的 IP，还要固定端口（比如 `4.4.4.4:80`）。                        |
| **对称 NAT**        | ❌ 完全无效          | 路由器每次连接都分配新端口，STUN 给的“形象”会失效，必须用 TURN 中转。            |

### **4. 一句话总结 STUN 的用途**  
**STUN = 快速低成本的“破隐符”**  
- 帮你快速找到自己的公网地址，让 WebRTC 等应用能直接“穿墙”通信。  
- **但遇到对称 NAT 时**：必须召唤更强大的 **TURN 服务器**（相当于花钱雇快递中转站）。 

### **附：公共 STUN 服务器（直接可用）**  
```plaintext
stun1.l.google.com:19302  
stun2.l.google.com:19302  
stun3.l.google.com:19302  
stun4.l.google.com:19302  
stun.stunprotocol.org:3478  
```

## 4.4、TURN

**对称 NAT 的路由器“反复无常”** ：每次连接外部地址时，都会分配**随机端口** ，导致 STUN 获取的公网地址瞬间失效，只能通过 TURN 服务器中转数据。所有的通信内容都要经过 TURN 服务器的转发

## 4.5、ICE

**ICE 是 WebRTC 的“智能路径导航”**：  
1. **收集所有可能的地址**（本地 IP、STUN 公网地址、TURN 中转地址）。  
2. **自动测试并选择最优路径**：优先直连，失败则用中转，确保穿透 NAT 和防火墙。  
**一句话总结**：ICE 通过整合多种地址候选，自动化解决复杂网络下的连接问题。

## 4.6、SDP

**SDP 是 WebRTC 的“会话说明书”**：  
1. **核心作用**：用文本格式描述双方的媒体能力（如视频编解码器）、网络信息（IP/端口）、安全配置等，帮助两端协商匹配参数。  
2. **无关传输**：SDP 只是数据格式（像配置文件），不关心如何传递（可通过 WebSocket、HTTP 等任意方式交换）。  
**一句话总结**：SDP 是包含媒体、网络、安全等元数据的“连接指南”，让双方设备能互相理解并建立通信。

## 4.7、Signaling（信令交换）

**信令（Signaling）是 WebRTC 的“快递员”**：  

1. **核心任务**：将 SDP（含 ICE 候选地址）通过**任意方式**（WebSocket、QR 码、邮件等）传递给对方。  
2. **无关技术**：只要能传递字符串即可，具体用 Twitter、HTTP 还是二维码不重要。  
    **一句话总结**：信令是“传递连接信息”的过程，确保双方拿到彼此的 SDP 和网络参数



## 4.8、小结

一个典型的WebRTC通信流程是这样的：

1）A 想要和B建立连接； 

2）A 创建了一个 offer，它寻找所有的 ICE candidate、安全选项、音视频选项等并创建 SDP（简单来说这个 offer 就是 SDP）；

3）A 将 SDP 信令传递给 B（Signaling）； 

4）B 根据 A 的 offer 进行设置，并创建应答（answer）； 

5）B 将 Answer 信令传递给 A（Signaling）；

6）连接建立。

# 五、WebRTC 的信令（Signal）

**用快递比喻 WebRTC 信令：**  

---

### **1. 信令是什么？**  
**信令 = 快递员**  
- **作用**：帮你传递“怎么连接”的说明书（SDP）和“可能的地址”（ICE 候选）。  
- **三步任务**：  
  1. 送出发起连接的请求（比如“我要视频通话”）。  
  2. 交换双方的“收件地址”（公网 IP + 端口）。  
  3. 协商用什么格式通话（比如 1080p 视频、Opus 音频）。  

---

### **2. 为什么需要信令？**  
- **找不到对方**：你的设备在内网（如家里），外网看不到你的地址，需要快递员（信令）传递信息。  
- **统一规则**：双方需协商用什么“语言”通话（比如都用 H.264 编码）。  

---

### **3. 信令服务器的作用**  
- **临时工具**：像快递中转站，只负责传递连接信息，不参与实际通话。  
- **技术无关**：可以用任何方式传递信息（微信、二维码、WebSocket 都行）。  

---

### **4. STUN 和 TURN 的作用**  
- **STUN**：帮你问路由器“我的公网地址是什么？”（适合普通家庭路由器）。  
- **TURN**：如果 STUN 失败（比如公司防火墙），直接通过它中转数据（像备用快递仓库）。  

---

### **5. SDP 请求与答复**  
- **流程**：  
  1. **你**：生成一份“连接说明书”（SDP Offer），通过快递员发给对方。  
  2. **对方**：收到后回复“我同意”或“我拒绝”（SDP Answer）。  

---

**一句话总结**：  
**信令就是“快递员”，帮你传递连接信息，让两个躲在内网的人找到彼此并开始通话！**

# 六、WebRTC架构核心

**1. 核心目标**：用户间直接 P2P 通信，最小化延迟。  

**2. 关键组件**：  
- **信令服务器**：临时传递连接信息（SDP + ICE）。  
- **STUN/TURN**：穿透 NAT（STUN 获取地址，TURN 中转数据）。  
- **RTCPeerConnection**：管理音视频传输与加密。  

**3. 连接流程**：  
1. 通过信令交换 SDP 和 ICE 地址。  
2. 用 STUN 尝试直连，失败则改用 TURN。  
3. 建立 P2P 通道，数据直接传输。  

**4. 优势**：低延迟、加密安全、无需插件。  
**5. 缺陷**：依赖服务器、大规模场景需改用集中式架构。  

# 七、WebRTC 的优缺点  

---

## **7.1 优点**  

### **1. P2P 通信的高效性**  
- **低延迟**：数据直接通过最优路径传输，无需经过第三方服务器。  
- **高性能**：  
  - 使用 **UDP 协议**，适合实时音视频（如视频会议、直播）。  
  - 数据加密后直接传输，路由器仅负责转发，不解析内容。  

### **2. 标准化 API**  
- **浏览器原生支持**：无需额外安装插件或工具。  
- **开发便捷**：提供简洁的 JavaScript API（如 `RTCPeerConnection`），快速实现音视频通信。  

---

## **7.2 缺点**  

### **1. 依赖 STUN/TURN 服务器**  
- **成本问题**：  
  - **STUN**：轻量级，但仅解决部分 NAT 穿透问题。  
  - **TURN**：需维护高性能服务器（带宽、公网 IP），成本高昂。  
- **维护复杂度**：需确保服务器高可用性，否则影响通信稳定性。  

### **2. 多人场景扩展性差**  
- **连接数爆炸**：  
  - 例如 100 个用户需建立 **4950 条 P2P 连接**（组合公式：`n(n-1)/2`）。  
  - 网络负载和带宽消耗随用户数激增。  
- **适用场景限制**：  
  - 适合 **1对1 或小规模通信**（如视频通话）。  
  - 大规模场景（如百人会议、游戏）需改用 **集中式服务器** 中转。  

---

**总结**：  
- **优势**：低延迟、高性能、开发便捷，适合实时互动场景。  
- **劣势**：依赖第三方服务器、大规模场景扩展性差。  

# 八、WebSocket 与 WebRTC 的区别  

---

## **1. 核心目标不同**  
| **技术**      | **设计目的**                           | **典型场景**               |
| ------------- | -------------------------------------- | -------------------------- |
| **WebSocket** | 实现实时双向通信（如聊天、实时通知）。 | 聊天应用、股票行情推送。   |
| **WebRTC**    | 低延迟音视频传输（如视频通话、直播）。 | 视频会议、在线教育、游戏。 |

---

## **2. 技术差异**  
| **维度**     | **WebSocket**                   | **WebRTC**                     |
| ------------ | ------------------------------- | ------------------------------ |
| **协议**     | 基于 **TCP**（可靠传输）。      | 基于 **UDP**（低延迟优先）。   |
| **延迟**     | 较高（受 TCP 握手和重传影响）。 | 极低（优化实时性，容忍丢包）。 |
| **传输内容** | 文本、二进制数据。              | 音视频流（内置编解码优化）。   |

---

## **3. 依赖关系**  
- **WebRTC 依赖 WebSocket**：  
  - 用于初始信令交换（传递 SDP 和 ICE 信息）。  
  - 连接建立后，音视频数据直接通过 P2P 传输，不再需要 WebSocket。  

---

## **一句话总结**  
- **WebSocket**：通用实时数据通道（TCP 保可靠）。  
- **WebRTC**：专用音视频传输（UDP 保实时）。  

好的！我用一个快递运输的比喻来帮你理解它们的关系：

# **九、webRTC、RTP、RTPS的关系**

**想象你要寄送一件包裹（音视频数据）**

1. **RTP（运输货车）**
   - **角色** ：负责把包裹（数据）从 A 地运到 B 地。
   - **特点** ：货车只管运输，不关心路线规划或是否堵车（不保证可靠性），但会在包裹上贴时间戳（同步播放）和编号（防止丢包）。
   - **比喻** ：RTP 就是一辆普通的快递货车，负责实际运送货物。
2. **RTSP（快递公司调度中心）**
   - **角色** ：负责协调货车的运输流程，比如“开始送货”“暂停”“取消”。
   - **特点** ：你需要打电话给调度中心（RTSP 控制命令），告诉它“开始送货”（`PLAY`）或“停止送货”（`TEARDOWN`），调度中心再指挥货车（RTP）行动。
   - **比喻** ：RTSP 就像快递公司的客服中心，负责协调运输流程，但不直接开车。
3. **WebRTC（端到端的智能快递服务）**
   - **角色** ：提供一整套快递服务，包括自动规划路线（NAT 穿透）、加密包裹（SRTP）、实时追踪（带宽自适应）。
   - **特点** ：不需要调度中心（RTSP），直接让寄件人和收件人通过智能系统（P2P）对接，货车（RTP）在后台默默运输。
   - **比喻** ：WebRTC 就像一个全自动的快递 App，用户只需一键下单，系统自动处理运输细节，甚至帮你避开堵车（网络优化）。

------

### **三者如何协作？举个具体场景：**

假设你要通过手机观看一个直播：

- **传统方式（RTSP + RTP）** ：
  1. 你用 RTSP 告诉服务器：“我要播放直播”（发送 `PLAY` 命令）。
  2. 服务器用 RTSP 回复：“好的，开始传输”。
  3. 服务器通过 RTP 把视频数据像货车一样源源不断发给你。
- **WebRTC 方式** ：
  1. 你直接通过 WebRTC 和主播的设备建立连接（P2P），不需要服务器中转。
  2. WebRTC 自动选择最优路线（ICE/STUN/TURN），加密数据（SRTP），并用 RTP 传输。
  3. 整个过程像一键呼叫无人机快递，直接从主播家飞到你家，无需中间调度。

------

### **关键区别总结**

| 协议   | 像什么？             | 核心任务                     | 是否需要服务器？             |
| ------ | -------------------- | ---------------------------- | ---------------------------- |
| RTP    | 快递货车             | 运输数据                     | 不需要（但通常配合其他协议） |
| RTSP   | 快递客服中心         | 控制运输流程（开始/停止）    | 需要（依赖服务器）           |
| WebRTC | 全自动无人机快递服务 | 端到端直接运输，自动优化路线 | 不需要（P2P 直连）           |

------

