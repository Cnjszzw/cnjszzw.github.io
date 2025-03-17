import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from '@site/src/css/home.module.css';
import Icons from '@site/src/components/Icons';

const info = {
  name: "赵志文",
  subname: "Zhiwen Zhao",
  avatarFront: "/img/avatar_s.jpg",
  avatarBack: "/img/avatar_s.jpg",
  tltr: "后端开发是主场，测试质量守门员，前端体验缝合怪.",
  socials: [
    {
      icon: "ion:mail-outline",
      link: "mailto:1427226264@qq.com"
    },
    {
      icon: "eva:github-outline",
      link: "https://github.com/Cnjszzw"
    },
    {
      icon: "carbon:logo-x",
      link: "https://x.com/cynicil"
    },
    {
      icon: "ant-design:zhihu-outlined",
      link: "https://www.zhihu.com/people/zhao-zhi-wen-58-15"
    },
    {
      icon: "ri:bilibili-line",
      link: "https://space.bilibili.com/35762084?spm_id_from=333.1007.0.0"
    },
    {
      icon: "ri:contacts-line",
      link: "https://maimai.cn/profile/detail?dstu=231439153",
      name: "脉脉"
    },
    {
      icon: "ri:file-paper-2-line",
      link: "/files/cv/zh.pdf",
      name: "简历"
    }
  ]
};

export default function Home() {
  const {siteConfig} = useDocusaurusContext();



  return (
    <Layout
      title={`hi@${info.name}`}
      description={`${info.name}'s Personal Website`}>
      <main className={styles.container}>
        <div className={styles.header}>
          <div className={styles.intro}>
            <h1 className={styles.greeting}>
              你好，我是
              <div className={styles.name}>{info.name} <span className={styles.subname}>({info.subname})</span></div>
            </h1>
            <p className={styles.tltr}>{info.tltr}</p>
            
            <div className={styles.socials}>
              {info.socials.map((social, index) => (
                <a 
                  key={index} 
                  href={social.link} 
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {Icons[social.icon]()}
                  {social.name && <span className={styles.socialName}>{social.name}</span>}
                </a>
              ))}
            </div>
          </div>
          
          <div className={styles.avatarContainer}>
            <img src={info.avatarFront} alt="Avatar Front" className={`${styles.avatar} ${styles.avatarFront}`} />
            <img src={info.avatarBack} alt="Avatar Back" className={`${styles.avatar} ${styles.avatarBack}`} />
          </div>
        </div>

        <div className={styles.content}>
          <section className={`${styles.section} ${styles.bioSection}`}>
            <h2>简介</h2>
            <p>嗨👋，我是赵志文，2025年1月硕士毕业于<a href="https://www.xijing.edu.cn/">西京学院</a>电子信息（<a href="https://jsjxy.xijing.edu.cn/">计算机技术方向</a>），在<a href="https://jsjxy.xijing.edu.cn/info/1005/2094.htm">郝东来教授</a>指导下专注于目标检测领域的算法研究。本科阶段就读于<a href="https://www.sdnu.edu.cn/">山东师范大学</a>艺术学（<a href="http://www.cbxy.sdnu.edu.cn/">广播电视编导</a>），兼具艺术与计算机技术的<strong>跨学科背景</strong>。在校期间，也曾经<a href="https://www.bjljsy.com/">流金科技</a>、<a href="https://baike.baidu.com/item/%E7%BE%8E%E5%9B%A2?fromModule=lemma_search-box">美团</a>、<a href="https://baike.baidu.com/item/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9/8018053">哔哩哔哩</a>等公司实习，担任过后端开发、测试开发等实习生职位。</p>
            <p><a href="http://cnjszzw.github.io">INFO.CENTER</a>是我的个人网站，这里不仅是我的博客，也是一个集合文档、工具与技术分享的平台。欢迎探索！</p>
          </section>

          <section className={`${styles.section} ${styles.miscSection}`}>
            <h2>杂项</h2>
            <ul className={styles.miscList}>
              <li>🌐 该<a href="https://github.com/Cnjszzw/cnjszzw.github.io">个人网站</a>基于<a href="https://docusaurus.io/">Docusaurus</a>构建</li>
              <li>📺 追剧清单：<a href="https://movie.douban.com/subject/6142597/">《新闻编辑室》</a>、  <a href="https://movie.douban.com/subject/36151693/">《不够善良的我们》</a></li>
              <li>🎮 游戏收藏：<a href="https://store.steampowered.com/app/646570/">《杀戮尖塔》</a>、<a href="https://store.steampowered.com/app/329050">《鬼泣4》</a></li>
            </ul>
          </section>
        </div>
      </main>
    </Layout>
  );
}

