# 安卓/meshT点播流程

> 点播设备分三种：安卓/meshT/国标
>
> （1）meshT点播的条件是，自身带视频音频源，或者绑定了国标设备
>
> （2）安卓和meshT底层都用websocket协议和server通信，但是国标是用sip协议

## 1.架构图

![image-20250417103651896](assets/image-20250417103651896.png)

## 2.点播流程

**前端接口：**

```bash
curl 'http://localhost:6767/api/webrtc/play/video/1/607da3d8526d4d6f837ecc08d5154bd0' \
  -X 'POST' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6' \
  -H 'Connection: keep-alive' \
  -H 'Content-Length: 0' \
  -b '_ga=GA1.1.2131977798.1744198900; _ga_CCYCB23FSV=GS1.1.1744246933.2.1.1744246937.0.0.0' \
  -H 'Origin: http://localhost:6767' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0' \
  -H 'sec-ch-ua: "Microsoft Edge";v="135", "Not-A.Brand";v="8", "Chromium";v="135"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'token: eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxIiwic3ViIjoiYWRtaW4iLCJpc3MiOiJ0b2tlbi1zZXJ2ZXIiLCJpYXQiOjE3NDQ4NTgzMDgsImV4cCI6MTc0NDk0NDcwOCwicm9sZXMiOiJPcGVyYXRpb25Sb2xlLGFkbWluIiwiaWQiOiIxIiwidXNlcm5hbWUiOiJhZG1pbiJ9.4NZ462Me02K59Lybsd-VPvn3et3Rm8Edp7UTeq8En-uK_zJwYx1T9wsh3qDIfatOaqoaUOaXldKwqWBfewAR3A'
```

### 1.进入前端Controller入口

`com/gbcom/wvp/webrtc/controller/WsPlayController.java`，传入用户id和设备(安卓或meshT)

```java
@ApiOperation("申请点播")
    @PostMapping("/video/{demanderId}/{providerId}")
    public DeferredResult<RS> more(@PathVariable String demanderId, @PathVariable String providerId) {
        String eventId = "playVideo" + MessageIdUtil.random();
        DeferredResult<RS> deferredResult = new DeferredResult<>(12000L);
        wsDeferredResultHolder.add(eventId, deferredResult,demanderId);
        playService.playCmd(eventId, demanderId, providerId);
        return deferredResult;
    }
```

### 2.记录点播信息

`com/gbcom/wvp/webrtc/service/impl/WsPlayServiceImpl.java`

```java
@Override
    public void playCmd(String eventId, String demanderId, String providerId) {
        >>---------------------------------------------------
        insertSysCommunicationRecord(1,demanderId,providerId);
		>>---------------------------------------------------
        sendWebsocketMessage(eventId,demanderId,providerId);
    }
```

### 3.发送websocket消息给设备
`com/gbcom/wvp/webrtc/service/impl/WsPlayServiceImpl.java`

```java
@Override
    public void playCmd(String eventId, String demanderId, String providerId) {
        insertSysCommunicationRecord(1,demanderId,providerId);
        >>---------------------------------------------------
        sendWebsocketMessage(eventId,demanderId,providerId);
        >>---------------------------------------------------
    }

private void sendWebsocketMessage(String eventId, String demanderId, String providerId){
        //
        GbUser gbUser1 = new GbUser();
        GbUser gbUser = gbUserMapper.selectByPrimaryKey(demanderId);
        if(gbUser==null){
            gbUser1.setNickname("sup");
            gbUser1.setId(demanderId);
        }else{
            BeanUtils.copyProperties(gbUser,gbUser1);
        }
        JSONObject info = new JSONObject();
        info.put("eventId", eventId);
        info.put("id", demanderId);
        info.put("userName", gbUser1);
        WsSendMessage wsSendMessage = new WsSendMessage(MessageIdUtil.random());
        wsSendMessage.setAction(WsConst.CALL_VIDEO_MSG);
        wsSendMessage.setInfo(info);
        WebsocketSessionManager.send(providerId, wsSendMessage.toJsonString());
    }
```

`com/gbcom/wvp/webrtc/server/WebsocketSessionManager.java`

```java
// 此为单点消息
public static boolean send(Session session, String message) {
    boolean blag = false;
    if (session == null) {
        logger.error("【websocket】 发送消息失败 session == null：" + message + " id:" + getIdBySession(session));
        return blag;
    }
    synchronized (session) {
        if (session.isOpen()) {
            try {
                blag = true;
                session.getBasicRemote().sendText(message);
                logger.info("【websocket】【send->" + getIdBySession(session) + "】" + message);
            } catch (Exception e) {
                blag = false;
                e.printStackTrace();
                logger.error("【websocket】【send Fail->id==>" + getIdBySession(session) + ",type ==>" +sessionMemberType.get(getIdBySession(session))+"】" + message, e);
            }
        }
    }
    return blag;
}
```

**Q :** 为什么要用synchronized

- - **WebSocket 的多线程场景** ：

    - WebSocket 服务器通常基于异步、多线程模型处理请求。例如，一个客户端可能同时触发多个事件（如消息发送、心跳检测、会话关闭等），这些操作可能由不同的线程并发执行。

    - 如果多个线程同时调用 

      ```
      session.getBasicRemote().sendText()
      ```

       向同一个会话发送消息，可能导致以下问题：

      - **消息乱序** ：多个线程同时写入网络流，导致消息顺序错乱。
      - **会话状态不一致** ：在发送消息前检查 `session.isOpen()` 后，另一个线程可能突然关闭会话，导致后续操作失败。
      - **资源竞争** ：底层网络资源（如 TCP 连接）可能被多个线程同时修改，引发不可预知的异常。

- - **通过 `synchronized` 同步** ：
- 使用 `synchronized(session)` 可确保同一时间只有一个线程能进入该代码块，对 `session` 的操作（检查状态、发送消息）是原子性的，避免了并发问题。

**Q:** websocket是怎么用netty的，我看项目中有用netty



