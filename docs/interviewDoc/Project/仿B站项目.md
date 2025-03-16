# 仿B站项目

## 一.文件断点续传

**可能涉及的问题**

- 你这个过程中如何判断这个文件是否已经上传了？A：前端传入md5，后端根据md5查询数据库，看是否存在

- 在这个过程中，压测过吗？A：这个真的无解，目前还有bug，正常流程都不行，别谈压测

- 假如FastDfs是集群，如何解决过程中文件分散存储的问题？A：面试官给了个思路不错，nginx判断ip，同一个ip文件存到同一个机器

- Q：在这个过程中Redis是怎么用的,作用是什么？

  A：主要是用来暂存过程中文件的路径和上传的状态，一方面是方便后端查询，第二个方面断点续传，前端可以从后端redis查询需要从哪里进行重新上传，不用redis，前端就需要缓存这些所有信息，并且传递给后端，前端比较难处理。

**问题以及可能的改进**

- 目前是串行执行的，未来可不可以去并发执行？

**基本流程**

- 一、前端去递归调用后端的接口，调用的时候，传入计算好的文件整体md5值，并且从第一片，**依次**上传到最后一片，**过程中如果失败，后端应该提供接口，可以查询当前上传的情况，前端可以从失败的地方继续上传，断点，续传，这个目前没做**
- 二、后端接收到之后，首先判断这个文件是不是已经上传了，上传了就直接返回url，判断的方式是根据md5去查询数据库
- 三、后端如果发现确实没有上传好，就会去调用底层的上传服务，过程中每次切片上传成功只会返回空字符串，发生异常整个过程就停止，直到最后一片上传成功，才会去返回完整的url，**同时**入库
- 四、后端再去调用接口的时候，判断是否为第一片，第一片就去调用首次上传的接口，并且返回文件url，之后更新redis中关于本文件的路径和已经上传的大小和片数，如果不是第一片，就去读取这个redis中这个文件当前已经上传的片数，去追加上传，直到成功后返回URL

```javascript
// 前端js代码
async uploadFileBySlices(selectedFile) {
  // 1. 参数校验
  if (!selectedFile) {
    window.alert('没有选择文件');
    return;
  }

  // 2. 计算文件 MD5
  const fileMd5 = await this.calculateVideoMD5(selectedFile);

  // 3. 分片参数设置
  const sliceSize = 2 * 1024 * 1024; // 分片大小 2MB
  const totalSliceNo = Math.ceil(selectedFile.size / sliceSize);
  const fileNameParts = selectedFile.name.split(".");
  const sliceName = fileNameParts[0]; // 文件名前缀
  const sliceType = fileNameParts[1]; // 文件扩展名

  // 4. 递归上传分片
  const uploadSlice = (sliceIndex) => {
    // 分片切割
    const start = sliceIndex * sliceSize;
    const end = Math.min(start + sliceSize, selectedFile.size);
    let slice = selectedFile.slice(start, end);

    // 分片重命名（如 "video0.mp4"）
    slice = new File([slice], `${sliceName}${sliceIndex}.${sliceType}`);

    // 构建 FormData
    const formData = new FormData();
    formData.append('fileMd5', fileMd5);
    formData.append('sliceNo', sliceIndex + 1); // 分片序号从 1 开始
    formData.append('totalSliceNo', totalSliceNo);
    formData.append('slice', slice);

    // 发送分片并递归上传下一片
    return new Promise((resolve) => {
      videoApi.uploadFileBySlices(formData).then((response) => {
        // 更新进度
        this.uploadProgress = ((sliceIndex + 1) / totalSliceNo * 100).toFixed(1);
        
        // 递归终止条件：上传完成
        if (sliceIndex + 1 === totalSliceNo) {
          resolve(response);
        } else {
          uploadSlice(sliceIndex + 1).then(resolve);
        }
      });
    });
  };

  return await uploadSlice(0); // 从第 0 片开始
}
```

```java
//FileApi
@PutMapping("/file-slices")
    public JsonResponse<String> uploadFileBySlices(MultipartFile slice,
                                                   String fileMd5,
                                                   Integer sliceNo,
                                                   Integer totalSliceNo) throws Exception {
        String filePath = fileService.uploadFileBySlices(slice, fileMd5, sliceNo, totalSliceNo);
        return new JsonResponse<>(filePath);
    }
```

```java
//FileService
public String uploadFileBySlices(MultipartFile slice,
                                         String fileMD5,
                                         Integer sliceNo,
                                         Integer totalSliceNo) throws Exception {
        File dbFileMD5 = fileDao.getFileByMD5(fileMD5);
        if(dbFileMD5 != null){
            return dbFileMD5.getUrl();
        }
        String url = fastDFSUtil.uploadFileBySlices(slice, fileMD5, sliceNo, totalSliceNo);
        if(!StringUtil.isNullOrEmpty(url)){
            dbFileMD5 = new File();
            dbFileMD5.setCreateTime(new Date());
            dbFileMD5.setMd5(fileMD5);
            dbFileMD5.setUrl(url);
            dbFileMD5.setType(fastDFSUtil.getFileType(slice));
            fileDao.addFile(dbFileMD5);
        }
        return url;
    }
```

```java
//FastDFSUtils

private static final String PATH_KEY = "path-key:";

private static final String UPLOADED_SIZE_KEY = "uploaded-size-key:";

private static final String UPLOADED_NO_KEY = "uploaded-no-key:";

private static final String DEFAULT_GROUP = "group1";

private static final int SLICE_SIZE = 1024 * 1024 * 2;

public String uploadFileBySlices(MultipartFile file, String fileMd5, Integer sliceNo, Integer totalSliceNo) throws Exception {
        if(file == null || sliceNo == null || totalSliceNo == null){
            throw new ConditionException("参数异常！");
        }
        String pathKey = PATH_KEY + fileMd5;
        String uploadedSizeKey = UPLOADED_SIZE_KEY + fileMd5;
        String uploadedNoKey = UPLOADED_NO_KEY + fileMd5;
        String uploadedSizeStr = redisTemplate.opsForValue().get(uploadedSizeKey);
        Long uploadedSize = 0L;
        if(!StringUtil.isNullOrEmpty(uploadedSizeStr)){
            uploadedSize = Long.valueOf(uploadedSizeStr);
        }
        if(sliceNo == 1){ //上传的是第一个分片
            String path = this.uploadAppenderFile(file);
            if(StringUtil.isNullOrEmpty(path)){
                throw new ConditionException("上传失败！");
            }
            redisTemplate.opsForValue().set(pathKey, path);
            redisTemplate.opsForValue().set(uploadedNoKey, "1");
        }else{
            String filePath = redisTemplate.opsForValue().get(pathKey);
            if(StringUtil.isNullOrEmpty(filePath)){
                throw new ConditionException("上传失败！");
            }
            this.modifyAppenderFile(file, filePath,  uploadedSize);
            redisTemplate.opsForValue().increment(uploadedNoKey);
        }
        // 修改历史上传分片文件大小
        uploadedSize  += file.getSize();
        redisTemplate.opsForValue().set(uploadedSizeKey, String.valueOf(uploadedSize));
        //如果所有分片全部上传完毕，则清空redis里面相关的key和value
        String uploadedNoStr = redisTemplate.opsForValue().get(uploadedNoKey);
        Integer uploadedNo = Integer.valueOf(uploadedNoStr);
        String resultPath = "";
        if(uploadedNo.equals(totalSliceNo)){
            resultPath = redisTemplate.opsForValue().get(pathKey);
            List<String> keyList = Arrays.asList(uploadedNoKey, pathKey, uploadedSizeKey);
            redisTemplate.delete(keyList);
        }
        return resultPath;
    }
```



## 亮点一：设计模式的使用

### 背景（技术问题）：

当时在做这个登录的功能，这个登录同时支持这个邮箱和手机号码登录，大致的流程就是前端会传过来两个字段，一个字段是email或者phone，另一个是对应的值，后端接收到这两个参数的时候，会判断传的是哪一个字段，首先对这个用户有没有注册进行判断校验，校验成功后会这个进行密码验证，验证成功了就会这个返回一个token。在这个背景中我就发现有一个问题，就是这个代码的拓展性不是很好，并且要写过多的代码，因为你要写很多的if语句去判断各种情况，看一下前端到底传的是哪个值，比如传输的是手机号还是这个emial，确认了之后，还需要些不同的sql去查用户，比如说这个知道了手机号，我就要通过这个手机号，看一下这个用户是否存在，传的是email就要去根据email写一个sql看一下是否存在。

在没有了解过策略模式之前，我其实自己已经进行了一点优化，我这个去除了所有的if-else，我把这个所有的参数，比如说手机和邮箱都传入到了一条的mybatis的sql里面，在这个mybatis的xml中，我用了一个动态的sql，会去判断传进来的参数是否为空，只有这个不为空，才会调用这个where语句，这样相当于减少了这个sql语句的编写，也省去了很多的if-else判断。

### 过程（解决问题的过程）：

后来我学习了设计模式，了解到了，这个策略和工厂模式以及这个开闭原则，发现了我的原来的代码还可以进行改进，因为我原来的代码，比如说增加了一个微信登录的代码，还是要去修改这个主业务代码，不能去做到真正的解耦，但是用了这个策略家工厂的话，我们可以定义一个抽象工厂，和两个具体的工厂，按照不同策略，可以实现为手机号登录和这个邮箱登录，我们不用去关心内部实习，只要获取不同的工厂就行了，后续如果增加，也只需要增加不同的策略，不需要改动原来的代码。

### 最终落地方案

首先设计了一个抽象策略类，和两个具体的策略类，在抽象策略类这个interface中定义了一个login方法，两个具体的策略类，分别是这个手机登录策略类和这个email登录策略类，分别实现了这个login方法。其次我定义了一个工厂类，这个工厂类继承了ApplicationContextAware，并且重写了里面的一个setApplicationContext类，这个方法会在初始化工厂的时候，根据我在这个application.propertities配之类中去读取数据，然后读取到一个map中去，并且这个工厂中提供来一个生产具体策略的方法，里面传入的值是登录的类型，因此在这个业务代码中，我只需要去初始化这个工厂类，然后在这个工厂类中去获取一个工厂，然后把前端传过来的登录的类型传给工厂的获取具体策略的方法，最后再调用这个策略工厂的登录方法就可以了，过程中完全不需要进行修改原来的代码



## 亮点二：线程池的使用

### 背景：

当时我在做这个视频详情页的功能，这里面前端需要获取点赞、投币和收藏的数量以及本人是否点赞投币过的这种接口，当时我自己是写了三个接口，然后前端需要去调用三次，每次的调用时间，都在130ms左右，由于是这种串行调用的，加起来差不掉就是400ms了，因此还是比较影响这个详情也整体的加载速度的，因为这个详情页的体验是最难做好的，是一个比较重的页面，元素比较多，包括这个弹幕和视频，肯定是能优化一点，就能提升比较大的用户体验的。因此当时就想到了用线程池

### 过程:

期间我利用这个线程池用多线程来进行了这个的加速，因为我认为我这个三个接口中，是没有前后依赖的一个关系的，类似于一个报表的功能，因此可以用这个线程池的技术来进行优化。

### 最终落地：

具体来说，我首先创建了一个线程池的配之类，在配置类中，定义了一个线池成员变量，并且用的也是这个ThreadPoolExecutor，并且规定了一下线程池的参数，其中考虑到我这个三个接口其实都没有什么cpu的消耗，主要是进行一些教研去查数据库，主要是有IO的操作，因此我判定这个本质还是属于一个IO密集型，因此我设置了这个核心线程数为这个推荐的2N + 1，由于我这个是租的腾讯云的2c2g的这个服务器，因此也就是5，并且我考虑到了，这个用户不会频繁去刷新，因此这个最大线程数就只设置了6，并且设置了1分钟的存活时间，也选用了这个LinkedBlockingQueue，并且设置了1000的大小。并且，我把这个初始化的动作，放到了一个静态代码快中，类加载之后就可以直接初始化线程池，之后拿来就用。之后我重新写了一个接口，在这个接口的方法中，我把这个获取点赞投币收藏的三个操作，每次都提交这个线程池中去执行，并且由于我是要返回数据的，我这里选择了重写这个Callable接口并且搭配这个Future获取到了数据，最后整合到map中进行了返回，最终经过测试，接口响应时间从150ms优化到了50ms，接口的速度提升了67%。

