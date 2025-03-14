import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from '@site/src/css/home.module.css';
import oceanStyles from '@site/src/css/ocean.module.css';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title="首页"
      description="赵志文的个人网站 - 博客、文档、工具">
      <main className={oceanStyles.container}>
        <div className={oceanStyles.contentContainer}>
          <div className={oceanStyles.headerContainer}>
            <div className={oceanStyles.titleSection}>
              <h1 className={oceanStyles.title}>山有顶峰，海有彼岸</h1>
              <h2 className={oceanStyles.subtitle}>The sea is rising. We're growing up.</h2>
            </div>
          </div>

          <div className={oceanStyles.waveContainer}>
            <div className={oceanStyles.wave}></div>
            <div className={oceanStyles.wave}></div>
            <div className={oceanStyles.wave}></div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

