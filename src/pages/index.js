import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
//重定向的代码
//import { Redirect } from '@docusaurus/router';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Docusaurus Tutorial - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

//重定向的代码
//function Index() {
//    return <Redirect to="/docs/category/算法" />;
//}
//
//export default Index;

//官方原代码
// export default function Home() {
//   const {siteConfig} = useDocusaurusContext();
//   return (
//     <Layout
//       title={`Hello from ${siteConfig.title}`}
//       description="Description will go into a meta tag in <head />">
//       <HomepageHeader />
//       <main>
//         <HomepageFeatures />
//       </main>
//     </Layout>
//   );
// }

//我写的，只显示图标和标题的主页
export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title="Welcome" // 主页自定义的标题
      description="基于 Docusaurus 的文档管理网站，由赵志文构建。" // 主页自定义的描述
      wrapperClassName="home-page" // 特定的类名，可以用于额外的样式定制
    >
      <main className={styles.cleanLayout}>
        <div className={styles.logoContainer}>
          <img
            src="/img/my-logo.svg"
            alt="Site Logo"
            className={styles.logoImage}
          />
          <h1 className={styles.siteTitle}>{siteConfig.title}</h1>
          {/* 粗箭头链接 */}
            <Link
              to="/docs/defaultDoc/Intro"
              className={styles.boldArrowLink}
              aria-label="前往介绍页面"
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-width="3"
                  stroke-linecap="butt"
                  stroke-linejoin="miter"
                  stroke-miterlimit="20"  // 新增关键参数
                  d="M14 5l7 7-7 7"      // 优化路径结构
                />
                <path
                  stroke-width="3"
                  stroke-linecap="butt"
                  d="M21 12H3"           // 分离水平线
                />
              </svg>
            </Link>


        </div>
      </main>
    </Layout>
  );
}

