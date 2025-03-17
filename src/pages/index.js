import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from '@site/src/css/home.module.css';

// 直接从frontmatter中获取数据
const info = {
  name: "Zhiwen Zhao",
  subname: "赵志文",
  avatarFront: "/img/avatar_s.jpg",
  avatarBack: "/img/avatar_s.jpg",
  tltr: "I do machine learning by day and build things for the web by night.",
  socials: [
    {
      icon: "i-academicons:cv",
      link: "/files/25届-硕士-西京学院-计算机专业-赵志文.pdf"
    },
    {
      icon: "i-ion:mail-outline",
      link: "mailto:1427226264@qq.com"
    },
    {
      icon: "i-eva:github-outline",
      link: "https://github.com/Cnjszzw"
    },
    {
      icon: "i-radix-icons:linkedin-logo",
      link: "https://www.linkedin.com/in/xiaohan-zou"
    },
    {
      icon: "i-academicons:google-scholar",
      link: "https://scholar.google.com/citations?user=RuW6xgMAAAAJ"
    },
    {
      icon: "i-carbon:logo-x",
      link: "https://www.twitter.com/renovamen_zxh"
    },
    {
      icon: "i-ant-design:zhihu-outlined",
      link: "https://www.zhihu.com/people/chao-neng-gui-su"
    },
    {
      icon: "i-ic:twotone-catching-pokemon",
      link: "https://portfolio.zxh.me",
      name: "Portfolio"
    },
    {
      icon: "i-mingcute:dashboard-4-line",
      link: "https://dashboard.zxh.me",
      name: "Dashboard"
    }
  ]
};

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={`hi@${info.name.toLowerCase().split(' ')[0]}`}
      description={`${info.name}'s Personal Website`}>
      <main className={styles.container}>
        <div className={styles.header}>
          <div className={styles.intro}>
            <h1 className={styles.greeting}>
              你好，我是
              <div className={styles.name}>{info.name} <span className={styles.subname}>({info.subname})</span>.</div>
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
                  {social.name || <i className={social.icon}></i>}
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
          <section className={styles.section}>
            <h2>Bio</h2>
            <p>I am a Ph.D. student in the <a href="https://www.eecs.psu.edu/">Computer Science and Engineering</a> department at <a href="https://www.psu.edu/">Pennsylvania State University</a> advised by Prof. <a href="https://www.cse.psu.edu/~gik2/">George Kesidis</a> and Prof. <a href="https://louise-lulin.github.io/">Lu Lin</a>. My current research focuses on trustworthiness and reliability in multimodal foundation models.</p>
            <p>Previously, I received my master's degree in <a href="https://www.bu.edu/cs/">Computer Science</a> from <a href="https://www.bu.edu/">Boston University</a> and my bachelor's degree in <a href="http://sse.tongji.edu.cn/">Software Engineering</a> from <a href="https://www.tongji.edu.cn/">Tongji University</a>. I also interned at Kuaishou.</p>
            <p>By the way, take a look at <a href="/projects">some things</a> I've built as a web developer, featuring <a href="https://ohmycv.app">ohmycv.app</a> - a sleek, in-browser, privacy-first Markdown resume builder.</p>
          </section>

          <section className={styles.section}>
            <h2>Talks</h2>
            <ul className={styles.talks}>
              <li><a href="#">Meta / Few-shot Learning</a>, Kuaishou, 08/2021</li>
              <li><a href="#">Continual Learning: Meta Continual Learning & Task Free Settings</a>, Peking University, 08/2020</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Miscellaneous</h2>
            <ul className={styles.miscList}>
              <li>🚀 This <a href="https://github.com/Renovamen/renovamen.github.io">personal website</a> is built with <a href="https://astro.build/">Astro</a>, <a href="https://www.solidjs.com/">Solid</a> and <a href="https://github.com/antfu/unocss">UnoCSS</a></li>
              <li>🧐 <i>Renovamen</i> is a Latin word means <i>renewal</i></li>
              <li>🖥 Ex-OIer/ACMer</li>
              <li>🥎 Used to be a member of the softball team of Tongji University</li>
              <li>🌭 My dream: <code>while(sleeping){'{'} money++; {'}'}</code></li>
              <li>🎮 Currently interested in <i>No Man's Sky</i> and <i>Minecraft</i></li>
            </ul>
          </section>
        </div>
      </main>
    </Layout>
  );
}

