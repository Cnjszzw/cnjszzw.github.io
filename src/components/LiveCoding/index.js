import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const matrixCode = [
  'public class ZionCore {',
  '    public static void main(String[] args) throws Exception {',
  '        /*====== 意识觉醒协议 ======*/',
  '        new Neo("赵志文")                // 载入主体意识',
  '            .neuralLink(26)             // 神经接口协议v26',
  '            .dataInject(                // 社交节点注入',
  '                "袁巍祎" , "应耀谷" ',
  '            )',
  '            /*------ 矩阵模拟层 ------*/',
  '            .loadReality(() -> {',
  '                System.err.print("\\033[32m");  // 视觉滤镜',
  '                while (!Thread.interrupted()) {',
  '                    System.out.print(',
  '                        (char)(0x2581 + ',
  '                        new Random().nextInt(6))',
  '                    );',
  '                    Thread.sleep(30);    // 帧同步',
  '                }',
  '                return "010101";        // 底层返回码',
  '            })',
  '            /*------ 逃脱协议 ------*/',
  '            .addExitProtocol(() -> {',
  '                System.out.println(',
  '                    "\\n\\n> 系统警告：反编译意识体");',
  '                System.out.println(',
  '                    "记忆熵值加密中... [密钥矩阵:1999]");',
  '            });',
  '    }',
  '}'
];

export default function LiveCoding() {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState([]);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!isTyping) return;

    if (currentLineIndex < matrixCode.length) {
      const currentLine = matrixCode[currentLineIndex];
      
      if (currentCharIndex < currentLine.length) {
        const timer = setTimeout(() => {
          setDisplayedLines(prev => {
            const newLines = [...prev];
            if (!newLines[currentLineIndex]) {
              newLines[currentLineIndex] = '';
            }
            newLines[currentLineIndex] = currentLine.substring(0, currentCharIndex + 1);
            return newLines;
          });
          setCurrentCharIndex(prev => prev + 1);
        }, 30);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 200);
        return () => clearTimeout(timer);
      }
    } else {
      setIsTyping(false);
    }
  }, [currentLineIndex, currentCharIndex, isTyping]);

  const renderLine = (line) => {
    // 分割行为不同的部分
    const parts = line.split(/([{}();"']|\b(?:public|class|static|void|String|new|while|if|return|throws)\b|\b(?:Random|Thread|System|Exception|Neo)\b|\/\*.*?\*\/|\/\/.+$|\b\d+\b)/);
    
    return parts.map((part, index) => {
      if (/^(?:public|class|static|void|String|new|while|if|return|throws)$/.test(part)) {
        return <span key={index} className={styles.keyword}>{part}</span>;
      } else if (/^(?:Random|Thread|System|Exception|Neo)$/.test(part)) {
        return <span key={index} className={styles.type}>{part}</span>;
      } else if (/\/\*.*?\*\//.test(part)) {
        return <span key={index} className={styles.blockComment}>{part}</span>;
      } else if (part.startsWith('//')) {
        return <span key={index} className={styles.comment}>{part}</span>;
      } else if (/^["'].*["']$/.test(part)) {
        return <span key={index} className={styles.string}>{part}</span>;
      } else if (/^\d+$/.test(part)) {
        return <span key={index} className={styles.number}>{part}</span>;
      } else if (/^[{}()]$/.test(part)) {
        return <span key={index} className={styles.bracket}>{part}</span>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={styles.container}>
      <pre className={styles.codeBlock}>
        <code>
          {displayedLines.map((line, index) => (
            <div key={index}>{renderLine(line)}</div>
          ))}
          <span className={styles.cursor}>_</span>
        </code>
      </pre>
    </div>
  );
} 