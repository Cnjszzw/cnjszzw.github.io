import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const javaCode = [
  'public class HelloWorld {',
  '    // 主方法入口',
  '    public static void main(String[] args) {',
  '        // 打印欢迎信息',
  '        System.out.println("Hello, World!");',
  '    }',
  '}'
];

const keywords = ['public', 'class', 'static', 'void', 'String'];

export default function LiveCoding() {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState([]);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!isTyping) return;

    if (currentLineIndex < javaCode.length) {
      const currentLine = javaCode[currentLineIndex];
      
      if (currentCharIndex < currentLine.length) {
        // 打字效果
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
        }, 50);
        return () => clearTimeout(timer);
      } else {
        // 当前行完成，进入下一行
        const timer = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 500);
        return () => clearTimeout(timer);
      }
    } else {
      setIsTyping(false);
    }
  }, [currentLineIndex, currentCharIndex, isTyping]);

  const renderLine = (line) => {
    // 分割行为单词和空格
    const parts = line.split(/([^a-zA-Z0-9_])/);
    
    return parts.map((part, index) => {
      if (keywords.includes(part)) {
        return <span key={index} className={styles.keyword}>{part}</span>;
      } else if (part.startsWith('"') && part.endsWith('"')) {
        return <span key={index} className={styles.string}>{part}</span>;
      } else if (part.startsWith('//')) {
        return <span key={index} className={styles.comment}>{part}</span>;
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