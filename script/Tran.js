const fs = require('fs');
const path = require('path');

// 定义文件路径
const filePath = path.join(path.dirname(__dirname), 'blog/2022-07-09-去西安了 - 副本.mdx'); // 输入文件路径

// 读取文件内容
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('读取文件失败:', err);
        return;
    }

    // 使用正则表达式匹配 Markdown 图片语法 ![alt](./path/to/image.jpg)
    const updatedContent = data.replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g, // 匹配图片的正则表达式
        '<Image img={require(\'$2\')} />' // 替换为目标格式
    );

    // 写回原文件
    fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
        if (err) {
            console.error('写入文件失败:', err);
            return;
        }
        console.log('文件已成功更新！');
    });
});