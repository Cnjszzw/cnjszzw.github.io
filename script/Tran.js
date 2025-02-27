const fs = require('fs');
const path = require('path');

// 定义文件路径
const filePath = path.join(path.dirname(__dirname), 'docs/defaultDoc/Algorithm/Java_API.md'); // 输入文件路径

// 读取文件内容
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('读取文件失败:', err);
        return;
    }

    // 使用正则表达式匹配 <span style={{ color: ... }}>...</span>
    const updatedContent = data.replace(
        /<span style={{[^}]+}}>(.*?)<\/span>/g,
        '<u>$1</u>' // 将匹配到的内容用 <u> 包裹
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