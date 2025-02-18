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
            const func = new Function('data', jsCode);
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

    return (
        <Layout title="JSON 和 JS 处理器" description="交互式 JSON 和 JS 处理工具">
            <div
                style={{
                    padding: '20px',
                    width: '100%',
                    margin: '0 auto',
                    boxSizing: 'border-box',
                }}
            >
                {/* 主容器 */}
                <div style={{ display: 'flex', gap: '2%' }}>
                    {/* 左边：JSON 输入 */}
                    <div style={{ flex: 1, maxWidth: '32%' }}> {/* 设置最大宽度 */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: '20px',
                                marginBottom: '5px',
                            }}
                        >
                            <h3 style={{ margin: 0 }}>输入 JSON</h3>
                            <button
                                onClick={handlePasteJson}
                                style={{
                                    marginLeft: '10px',
                                    padding: '2px 8px',
                                    fontSize: '12px',
                                    background: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                粘贴
                            </button>
                            <button
                                onClick={handleClearJson}
                                style={{
                                    marginLeft: '10px',
                                    padding: '2px 8px',
                                    fontSize: '12px',
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                清除
                            </button>
                        </div>
                        <pre
                            contentEditable
                            suppressContentEditableWarning
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
                                whiteSpace: 'pre-wrap', // 启用自动换行
                                wordBreak: 'break-word', // 强制长单词换行
                            }}
                        >
                            {formatJsonInput(jsonInput)}
                        </pre>
                    </div>

                    {/* 中间：JS 代码输入 */}
                    <div style={{ flex: 1, maxWidth: '32%' }}> {/* 设置最大宽度 */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: '20px',
                                marginBottom: '5px',
                            }}
                        >
                            <h3 style={{ margin: 0 }}>输入 JS 代码</h3>
                            <button
                                onClick={handlePasteJs}
                                style={{
                                    marginLeft: '10px',
                                    padding: '2px 8px',
                                    fontSize: '12px',
                                    background: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                粘贴
                            </button>
                            <button
                                onClick={handleClearJs}
                                style={{
                                    marginLeft: '10px',
                                    padding: '2px 8px',
                                    fontSize: '12px',
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                清除
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <pre
                                contentEditable
                                suppressContentEditableWarning
                                onInput={(e) => {
                                    const value = e.target.innerText;
                                    setJsCode(formatJsCode(value));
                                    e.target.innerText = formatJsCode(value);
                                }}
                                style={{
                                    background: '#f4f4f4',
                                    padding: '10px',
                                    paddingBottom: '50px', // 为按钮留出足够空间
                                    borderRadius: '5px',
                                    fontFamily: 'monospace',
                                    minHeight: '300px',
                                    overflowY: 'auto',
                                    outline: 'none',
                                    width: '100%',
                                    whiteSpace: 'pre-wrap', // 启用自动换行
                                    wordBreak: 'break-word', // 强制长单词换行
                                }}
                            >
                                {formatJsCode(jsCode)}
                            </pre>
                            <button
                                onClick={handleRun}
                                style={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    right: '10px',
                                    padding: '2px 8px',
                                    fontSize: '14px',
                                    background: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    lineHeight: '1',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                运行
                            </button>
                        </div>
                    </div>

                    {/* 右边：输出 */}
                    <div style={{ flex: 1, maxWidth: '32%' }}> {/* 设置最大宽度 */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: '20px',
                                marginBottom: '5px',
                            }}
                        >
                            <h3 style={{ margin: 0 }}>输出</h3>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <pre
                                style={{
                                    background: '#f4f4f4',
                                    padding: '10px',
                                    paddingBottom: '50px', // 为保持一致性，添加底部内边距
                                    borderRadius: '5px',
                                    fontFamily: 'monospace',
                                    minHeight: '300px',
                                    overflowY: 'auto',
                                    outline: 'none',
                                    width: '100%',
                                    whiteSpace: 'pre-wrap', // 启用自动换行
                                    wordBreak: 'break-word', // 强制长单词换行
                                }}
                            >
                                <code className="language-json">{output}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default JsonJsOutput;