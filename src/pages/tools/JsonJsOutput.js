import React, { useState } from 'react';
import Layout from '@theme/Layout'; // 引入 Docusaurus 的 Layout 组件

function JsonJsOutput() {
    const [jsonInput, setJsonInput] = useState('');
    const [jsCode, setJsCode] = useState('');
    const [output, setOutput] = useState('');

    // 处理运行逻辑
    const handleRun = () => {
        try {
            const parsedJson = JSON.parse(jsonInput);
            const func = new Function('input', jsCode); // 修改参数名为 input
            const result = func(parsedJson);
            setOutput(JSON.stringify(result, null, 2));
        } catch (error) {
            setOutput(`Error: ${error.message}`);
        }
    };

    // 粘贴 JSON 的功能
    const handlePasteJson = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const formatted = formatJsonInput(text);
            setJsonInput(formatted);
        } catch (error) {
            console.error('粘贴 JSON 失败:', error);
        }
    };

    // 粘贴 JS 代码的功能
    const handlePasteJs = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const formatted = formatJsCode(text);
            setJsCode(formatted);
        } catch (error) {
            console.error('粘贴 JS 失败:', error);
        }
    };

    // 清空 JSON 输入框
    const handleClearJson = () => {
        setJsonInput('');
    };

    // 清空 JS 输入框
    const handleClearJs = () => {
        setJsCode('');
    };

    // 格式化 JSON 输入
    const formatJsonInput = (value) => {
        try {
            return JSON.stringify(JSON.parse(value), null, 2);
        } catch {
            return value; // 如果解析失败，返回原始输入
        }
    };

    // 格式化 JS 代码输入
    const formatJsCode = (value) => {
        // 这里可以添加额外的格式化逻辑（如美化代码）
        return value;
    };

    // 加载模板代码
    const handleLoadTemplate = () => {
        const templateCode = `return (function(input) {
    try {
        // 检查输入是否包含 RespDatas 字段
        if (!input || typeof input.RespDatas !== "string") {
            throw new Error("输入数据中缺少 RespDatas 字段或其值不是字符串");
        }

        // 解析 RespDatas 字段为 JSON 对象
        const respDatas = JSON.parse(input.RespDatas);

        // 返回解析后的结果
        return respDatas;
    } catch (error) {
        // 捕获错误并返回友好的错误信息
        throw new Error(\`处理失败: \${error.message}\`);
    }
})(input);`;
        setJsCode(templateCode);
    };

    return (
        <Layout>
            {/* 主容器 */}
            <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
                {/* 左边：JSON 输入 */}
                <div style={{ flex: 1, maxWidth: '33%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: '0' }}>输入 JSON</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                style={{
                                    padding: '5px 10px',
                                    background: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                                onClick={handlePasteJson}
                            >
                                粘贴
                            </button>
                            <button
                                style={{
                                    padding: '5px 10px',
                                    background: '#dc3545',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                                onClick={handleClearJson}
                            >
                                清除
                            </button>
                        </div>
                    </div>
                    <div
                        contentEditable
                        onInput={(e) => {
                            const value = e.target.innerText;
                            setJsonInput(formatJsonInput(value));
                            e.target.innerText = formatJsonInput(value);
                        }}
                        style={{
                            background: '#f4f4f4',
                            padding: '10px',
                            borderRadius: '5px',
                            fontFamily: 'monospace',
                            minHeight: '300px',
                            overflowY: 'auto',
                            outline: 'none',
                            width: '100%',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}
                    >
                        {formatJsonInput(jsonInput)}
                    </div>
                </div>

                {/* 中间：JS 代码输入 */}
                <div style={{ flex: 1, maxWidth: '33%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: '0' }}>输入 JS 代码</h3>
                        <div style={{display: 'flex', gap: '10px'}}>
                            <button
                                style={{
                                    padding: '5px 10px',
                                    background: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                                onClick={handleRun}
                            >
                                运行
                            </button>
                            <button
                                style={{
                                    padding: '5px 10px',
                                    background: '#28a745',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                                onClick={handleLoadTemplate}
                            >
                                模板
                            </button>
                            <button
                                style={{
                                    padding: '5px 10px',
                                    background: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                                onClick={handlePasteJs}
                            >
                                粘贴
                            </button>
                            <button
                                style={{
                                    padding: '5px 10px',
                                    background: '#dc3545',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                                onClick={handleClearJs}
                            >
                                清除
                            </button>
                        </div>
                    </div>
                    <div
                        contentEditable
                        onInput={(e) => {
                            const value = e.target.innerText;
                            setJsCode(formatJsCode(value));
                            e.target.innerText = formatJsCode(value);
                        }}
                        style={{
                            background: '#f4f4f4',
                            padding: '10px',
                            paddingBottom: '50px',
                            borderRadius: '5px',
                            fontFamily: 'monospace',
                            minHeight: '300px',
                            overflowY: 'auto',
                            outline: 'none',
                            width: '100%',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}
                    >
                        {formatJsCode(jsCode)}
                    </div>
                </div>

                {/* 右边：输出 */}
                <div style={{flex: 1, maxWidth: '33%'}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: '0' }}>输出</h3>
                    </div>
                    <div
                        style={{
                            background: '#f4f4f4',
                            padding: '10px',
                            borderRadius: '5px',
                            fontFamily: 'monospace',
                            minHeight: '300px',
                            overflowY: 'auto',
                            outline: 'none',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}
                    >
                        {output}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default JsonJsOutput;