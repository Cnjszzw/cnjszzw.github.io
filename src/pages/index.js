import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from '@site/src/css/home.module.css';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title="首页"
      description="赵志文的个人网站 - 博客、文档、工具">
      <main className={styles.container}>
        <div className={styles.contentContainer}>
          <div className={styles.headerContainer}>
            <div className={styles.titleSection}>
              <div className={styles.greeting}>你好，</div>
              <h1 className={styles.title}>我是赵志文</h1>
            </div>
          </div>

          <p className={styles.subtitle}>
            <strong>INFO.CENTER</strong> 是我的个人网站，这里不仅是我的博客，也是一个集合文档、工具与技术分享的平台。欢迎探索！
          </p>
        </div>
      </main>
    </Layout>
  );
}

