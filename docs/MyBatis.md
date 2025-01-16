# MyBatis

## 1.数据库字段于实体类的字段不一致

**问题**：数据库的命名基本都是下划线的，比如user_name，但是实体类都是驼峰命名，比如userName,这个时候如不不进行映射会出现映射数据库查询出来的数据无法赋值给这个对象。

**方案**：

（1）自己写sql的时候，给写一个别名,不太好，要一个一个设置别名（sql片段），每次查询都要写

```xml
<select id = "test" reusltType = "com.bilibili.domin.User">
	select user_name as userName form t_user;
</select>
```

(2) 利用resultMap，进行部分字段的映射

```xml
<resultMap id = "userResultMap" type = "com.bilibili.domin.User">
    <result column = "user_name" property="userName"/>
</resultMap>
```



```xml
<select id = "test" resultMap = "userResultMap">    
    select user_name as userName form t_user;
</select>

```
PS:resultMap中一般字段使用result进行映射，主键id利用id标签，如下

```xml
    <id column = "user_id" property="userId"/>
```


## 2.参数占位符

（1）#{}：会将其设置为？，将来自动设置参数值，为了防止SQL注入（个人猜测会判断参数的类型进行验证来实现sql注入，比如是不是Integer之类的）
（2）${}：直接拼接sql，这样会存在SQL注入
（3）使用时机 : 一般传入参数的时候都用#{}就好了 ， 但是如果有的时候表名称和字段名称不确定的时候可以使用${}，不过这种情况比较少，且一定存在sql注入

## 3.类型参数ParameterTpe

一般可以不用写，可以省略

## 4.特殊字符

在xml中有些字符 ， 比如 `<`小于 是和标签开始的符号`<`冲突的，需要用转义或者CDATA区
转义方案
```xml
<select id = "test" resultMap = "userResultMap">    
    select user_name as userName form t_user where id &lt; #{id}
</select>

```
PS :
&lt;  就是    <  de 转义字符

CDATA区域方案
```xml
<select id="test" resultMap="userResultMap">
    select user_name as userName from t_user where id
    <![CDATA[
        <!-- 这是你要嵌入的特殊字符 -->
    ]]>
    #{id}
</select>

```

## 5.条件查询

### 第一种：多参数查询

```java
/**
*方式1——散装参数
* @Param("status") 和 #{status}建立了参数的映射 ， 所以 最终这个int status最终会通过#{}进行动态赋值
* 即@Param(SQL中的#{}占位符里面的名称)
*/
List<Brand> selectByCondition(@Param("status") int status, @Param("companyName") String companyName, @Param("brandName") String brandName);


/**
*方式2——对象参数
* 通过对象直接赋值，#{status} 会调用对象的getStatus()方法
*/
List<Brand> selectByCondition(Brand brand);
 

/**
*方式3——map集合参数
* 通过Map直接赋值，这里Map的所有key保存xml的#{}的名称，value保存值
*/
List<Brand> selectByCondition(Map<String, Object> map);
```

```xml
<select id="selectByCondition" resultMap="brandResultMap">
    SELECT *
    FROM tb_brand
    WHERE status = #{status}
    AND company_name LIKE #{companyName}
    AND brand_name LIKE #{brandName}
</select>
```

### 第二种：动态条件查询

eg：从三个固定的选项选择其中的0-3项进行查询（where）

eg：只选择一个选型，但是选型不确定，来进行查询（choose、when）

（1）if

`if：`用于判断参数是否有值，使用test属性进行条件判断
*存在的问题：第一个条件不需要逻辑运算符
*解决方案：
1）使用恒等式让所有条件格式都一样
2)`<where>`标签替换where关键字
```xml
<select id="selectByCondition" resultMap="brandResultMap">
    select *
    from tb_brand
    where 1=1
    <if test="status != null">
        and status = #{status}
    </if>
    <if test="companyName != null and companyName.trim() != ''">
        and company_name like #{companyName}
    </if>
    <if test="brandName != null and brandName.trim() != ''">
        and brand_name like #{brandName}
    </if>
</select>
```
```xml
<select id="selectByCondition" resultMap="brandResultMap">
    select *
    from tb_brand
    /* where 1 = 1 */
    <where>
        <if test="status != null">
            and status = #{status}
        </if>
        <if test="companyName != null and companyName != ''">
            and company_name like #{companyName}
        </if>
        <if test="brandName != null and brandName != ''">
            and brand_name like #{brandName}
        </if>
    </where>
</select>
```

（2）choose (when 、otherwise)

```xml
<!-- 从多个条件中选择一个 -->
<!-- choose(when，otherwise)：选择一个条件，类似于Java中的 switch 语句 -->


<select id="selectByConditionSingle" resultMap="brandResultMap">
    select *
    from tb_brand
    where
    <choose>
        <!-- 相当于switch -->
        <when test="status != null"><!-- 相当于case -->      
            status = #{status}
        </when>
        <when test="companyName != null and companyName != ''"><!-- 相当于case -->           
            company_name Like #{companyName}
        </when>
        <when test="brandName != null and brandName != ''"><!-- 相当于case -->           
            brand_name Like #{brandName}
        </when>
        <otherwise><!-- 相当于default --> 
            1=1
        </otherwise>
    </choose>
</select>
```
```xml
<select id="selectByConditionsingle" resultMap="brandResultMap">
    select *
    from tb_brand
    <where>
        <choose>
            <!-- 相当于switch -->
            <when test="status != null">
                <!-- 相当于case -->
                and status = #{status}
            </when>
            <when test="companyName != null and companyName != ''">
                <!-- 相当于case -->
                and company_name like #{companyName}
            </when>
            <when test="brandName != null and brandName != ''">
                <!-- 相当于case -->
                and brand_name like #{brandName}
            </when>
        </choose>
    </where>
</select>
```

（3）trim (where  、 set)

（4）foreach

## 6.添加

### 第一种：普通添加（省略）

### 第二种：主键返回
在数据添加成功后，需要获取插入数据库数据的主键的值
比如：添加订单和订单项
1.添加订单
2.添加订单项，订单项中需要设置所属订单的id
eyProperty：指的是实体类中对应主键的属性名
```xml
<inset id="addOrder" useGeneratedKeys="true" keyProperty="id">
    insert into tb_order(payment, payment_type, status)
    values(#{payment}, #{paymentType}, #{status});
</insert>
```
```xml
<insert id="addOrderItem">
    insert into tb_order_item(goods_name, goods_price, count, order_id)
    values(#{goodsName}, #{goodsPrice}, #{count}, #{orderId});
</insert>
```
PS:keyProperty要设置主键的名称

## 7.更新

前面有一个where的sql语法问题通过< where>来解决了，同样set也有这个问题，也有一个< set>标签

```xml
<update id="update">
    update tb_brand
    <set>
        <if test="brandName != null and brandName != ''">
            brand_name = #{brandName},
        </if>
        <if test="companyName != null and companyName != ''">
            company_name = #{companyName},
        </if>
        <if test="ordered != null">
            ordered = #{ordered},
        </if>
        <if test="description != null and description != ''">
            description = #{description},
        </if>
        <if test="status != null">
            status = #{status}
        </if>
    </set>
    where id = #{id}
</update>
```

## 8.删除

### 第一种：删除一个（省略）

### 第二种：批量删除

方式1
PS：这里面要注意以下，这里的数组只有一个也要加上@Param注解，如下
```xml
<delete id="deleteByIds">
    delete from tb_brand where id in
    <foreach collection="ids" item="id" separator="," open="(" close=")">
        #{id}
    </foreach>
</delete>
```

```java
方式1
void deleteByIds(@Param("ids") int[] ids);
```

方式2
PS：不加上@Param注解，则默认为array（Collection、List、Array都要加上注解）
```xml
<delete id="deleteByIds">
    delete from tb_brand where id in
    <foreach collection="arary" item="id" separator="," open="(" close=")">
        #{id}
    </foreach>
</delete>
```

```java
方式2
void deleteByIdsint[] ids);
```

## 9.Mybatis参数封装

```
MyBatis参数封装：
*单个参数：
1. POJO类型：直接使用，属性名和参数占位符名称一致
2. Map集合：直接使用，键名和参数占位符名称一致
3. Collection：封装为Map集合，可以使用@Param注解，替换Map集合中默认的arg键名
   map.put("arg0", collection集合);
   map.put("collection", collection集合)
4. List：封装为Map集合，可以使用@Param注解，替换Map集合中默认的arg键名
   map.put("arg0", list集合);
   map.put("collection", list集合);
   map.put("list", list集合);
5. Array：封装为Map集合，可以使用@Param注解，替换Map集合中默认的arg键名
   map.put("arg0", 数组);
   map.put("array", 数组);
6. 其他类型：直接使用
*多个参数：封装为Map集合，可以使用@Param注解，替换Map集合中默认的arg键名
```

这段文本详细说明了在MyBatis中如何封装不同类型的参数，以便在SQL映射文件中使用。

## 10.注解开发

```java
## 使用注解开发会比配置文件开发更加方便

@Select("select * from tb_user where id=#{id}")
public User selectById(int id);

查询：@Select
添加：@Insert
修改：@Update
删除：@Delete

提示：
注解完成简单功能
配置文件完成复杂功能
```