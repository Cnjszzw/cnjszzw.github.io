# LeetCode Hot100

LeetCode 热题 100，解题记录

## 哈希

### 001 两数之和

```java
//[1. 两数之和](https://leetcode.cn/problems/two-sum/)
//2024.8.18（Java✔）

class Solution {
    public int[] twoSum(int[] nums, int target) {
        int[] res = new int[2];
        HashMap<Integer,Integer> mp = new HashMap();
        int size = nums.length;
        for(int i = 0 ; i < size ; i++){
            if(mp.containsKey(target - nums[i])){
                res[0] = i;
                res[1] = mp.get(target - nums[i]);
                return res;
            }
            mp.put(nums[i],i);
        }

        return res;

    }
}
```

### 002 字母异位词分组

```java
//49. 字母异位词分组https://leetcode.cn/problems/group-anagrams/
//2024.8.18（Java✔）

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        List<List<String>> res = new ArrayList();
        HashMap<String,List<String>> mp = new HashMap();
        for(String string : strs){
            //1.
            char[] charArray = string.toCharArray();
            Arrays.sort(charArray);
            String sortedString = new String(charArray);
            //2.
            if(!mp.containsKey(sortedString)){
                List<String> temp = new ArrayList<String>();
                temp.add(string);
                mp.put(sortedString,temp);
            }else{
                mp.get(sortedString).add(string);
            }
        }
        for(List<String> temp : mp.values()){
            res.add(temp);
        }
        Collections.sort(res,new Comparator<List<String>>(){
            @Override
            public int compare(List<String> A,List<String> B){
                return Integer.compare(A.size(),B.size());
            }
        });
        return res;
    }
}
```

### 003  最长连续序

```java
//128. 最长连续序列 https://leetcode.cn/problems/longest-consecutive-sequence/
//2024.8.25(java✔)

class Solution {
    public int longestConsecutive(int[] nums) {
        int res = 0;
        //set记录那些元素存在
        HashSet<Integer> set = new HashSet();
        for(int num : nums){
            set.add(num);
        }
        for(int num : set){
            if(set.contains(num-1)){
                continue;
            }else{
                int maxlength = 1;
                int temp = num;
                while(set.contains(temp+1)){
                    maxlength++;
                    temp++;
                }
                res = Math.max(res,maxlength);
            }
        }
        return res;
    }
}
```

## 双指针

### 001 移动零

```java
//283. 移动零 https://leetcode.cn/problems/move-zeroes/
//2024.8.25(Java✔)

class Solution {
    public void moveZeroes(int[] nums) {
        int left = 0;
        int right = nums.length - 1;
        while(left <= right){
            if(nums[left] != 0){
                left++;
            }else{
                nums[left] = nums[right];
                nums[right] = 0;
                right--;
            }
        }

        
    }
}
```

### 002 盛水最多的容器

```java
// 11. 盛最多水的容器 https://leetcode.cn/problems/container-with-most-water/
//2024.9.23(Java✔)

class Solution {
    public int maxArea(int[] height) {
        int i = 0 ;
        int j = height.length - 1;
        int maxSize = (j - i) * Math.min(height[i],height[j]);
        while(i < j){
            if(height[i] < height[j]){
                int temp = i;
                while(i < j){
                    if(height[i] <= height[temp]){
                        i++;
                    }else{
                        int newSize = (j - i) * Math.min(height[i],height[j]);
                        maxSize = Math.max(maxSize,newSize);
                        break;
                    }
                }
            }else{
                int temp = j;
                while(i < j){
                    if(height[j] <= height[temp]){
                        j--;
                    }else{
                        int newSize = (j - i) * Math.min(height[i],height[j]);
                        maxSize = Math.max(maxSize,newSize);
                        break;
                    }
                }

            }

        }

        return maxSize;

    }
}
```



## 动态规划

### 001 [最长有效括号](https://leetcode.cn/problems/longest-valid-parentheses/)

```java
//32. 最长有效括号
//解题链接：【LeetCode每日打卡.32.最长有效括号】 https://www.bilibili.com/video/BV1Ct4y197M3/?share_source=copy_web&vd_source=f7f48f1ed79263bbbc17c452084e9965

class Solution {
    public int longestValidParentheses(String s) {
        char[] array = s.toCharArray();
        int[] dp = new int[array.length];
        Arrays.fill(dp,0);
        int length = dp.length;
        if(length == 1 || length == 0){
            return 0;
        }
        int res = 0;
        for(int i = 1 ; i < length ; i++){
            if(array[i] == ')'){
                if(array[i - dp[i-1] - 1] == '('){
                    dp[i] = 2 + dp[i-1];
                    if(i - dp[i-1] - 2 >= 0){
                        dp[i] += dp[i - dp[i-1] - 2];
                    }
                }
            }
            res = Math.max(res,dp[i]);
        }
        return res;
    }
}
```





**预备知识**

```
https://www.bilibili.com/video/BV13Q4y197Wg?spm_id_from=333.788.videopod.sections&vd_source=c0dbf12785802e85db6dcdc208a884f4
```

```java
https://www.bilibili.com/video/BV1f5411K7mo?spm_id_from=333.788.videopod.sections&vd_source=c0dbf12785802e85db6dcdc208a884f4



(1)确定dp[i]的含义
(2)递推公式
(3)dp数组如何初始化
(4)遍历顺序
(5)打印dp数组

eg：
(1) dp[i]：第i个斐波那契额数值为dp[i]
(2)递推公式：dp[i] = dp[i-1] + dp[i-2]
(3)dp数组如何初始化 dp[0] = 0 dp[1] = 1
(4)遍历顺序 从前往后
for(int i = 0 ; i <= n ; i++)}{
	dp[i] = dp[i-1] + dp[i - 2]
}
return dp[i]
(5)打印dp数组
```



## 回溯（递归）



```java
# 回溯算法

回溯 <---->递归，二者是息息相关，无法分开的,

1.递归的下面就是回溯的过程

2.回溯法是一个 纯暴力的 搜索

3.回溯法解决的问题：

3.1组合 如：1234 两两组合

3.2切割问题 如：一个字符串有多少个切割方式 ，或者切割出来是回文

3.3子集 ： 1 2 3 4 的子集

3.4排列问题（顺序）

3.5棋盘问题：n皇后 解数独

4.回溯可抽象成树形结构(!!!!!!!!!!!!重要，想象成树的结构)

5.void backtracking(){

if(终止条件) {

    收集结果

    return

}

for(集合的元素集，类似子节点的个数)

    {

        处理结点

        递归函数；

        回溯操作

        （撤销处理结点12， 2撤销 ，13 撤销3， 14）

	}

}
```

## 单调栈

单调栈，顾名思义，是一个栈, 其次，他是单调的（单调底层，和单调递减），这个栈记录了之前遍历过的所有元素，相当于是空间换时间，这种单调栈，特别适合以下场景：

```java
（1）
想找到某一个元素，右边/左边，第一个比本元素大/小的元素的位置
典型的例子就是每日温度这个题目：
https://leetcode.cn/problems/iIQa4I/description/

class Solution {
        public int[] dailyTemperatures(int[] temperatures) {
            Stack<Integer> stack = new Stack();
            int[] res = new int[temperatures.length];
            Arrays.fill(res,0);
            if(temperatures.length <=0){
                return res;
            }
            stack.push(0);
            int length = temperatures.length;
            for(int i = 1 ; i < length ; i++){
                if(temperatures[i] <= temperatures[stack.peek()]){
                    stack.push(i);
                }else{
                    while(!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]){
                        res[stack.peek()] = i - stack.peek();
                        stack.pop();
                    }
                    stack.push(i);
                }
            }
            return res;
        }
}

```























