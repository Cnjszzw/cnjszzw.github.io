import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from '@site/src/css/home.module.css';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title="hi@zxh"
      description="Xiaohan Zou's Personal Website">
      <main className={styles.container}>
        <div className={styles.header}>
          <div className={styles.intro}>
            <h1 className={styles.greeting}>
              Hello, this is
              <div className={styles.name}>Xiaohan Zou <span className={styles.subname}>(邹笑寒)</span>.</div>
            </h1>
            <p className={styles.tltr}>I do machine learning by day and build things for the web by night.</p>
            
            <div className={styles.socials}>
              <a href="/files/cv/en.pdf" className={styles.socialLink}>CV</a>
              <a href="mailto:renovamenzxh@gmail.com" className={styles.socialLink}>
                <i className="i-ion:mail-outline"></i>
              </a>
              <a href="https://github.com/Renovamen" className={styles.socialLink}>
                <i className="i-eva:github-outline"></i>
              </a>
              <a href="https://www.linkedin.com/in/xiaohan-zou" className={styles.socialLink}>
                <i className="i-radix-icons:linkedin-logo"></i>
              </a>
              <a href="https://scholar.google.com/citations?user=RuW6xgMAAAAJ" className={styles.socialLink}>
                <i className="i-academicons:google-scholar"></i>
              </a>
              <a href="https://portfolio.zxh.me" className={styles.socialLink}>Portfolio</a>
              <a href="https://dashboard.zxh.me" className={styles.socialLink}>Dashboard</a>
            </div>
          </div>
          
          <div className={styles.avatarContainer}>
            <img src="/img/me.jpg" alt="Avatar" className={styles.avatar} />
          </div>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Bio</h2>
            <p>I am a Ph.D. student in the <a href="https://www.eecs.psu.edu/">Computer Science and Engineering</a> department at <a href="https://www.psu.edu/">Pennsylvania State University</a> advised by Prof. <a href="https://www.cse.psu.edu/~gik2/">George Kesidis</a> and Prof. <a href="https://louise-lulin.github.io/">Lu Lin</a>. My current research focuses on trustworthiness and reliability in multimodal foundation models.</p>
            <p>Previously, I received my master's degree in <a href="https://www.bu.edu/cs/">Computer Science</a> from <a href="https://www.bu.edu/">Boston University</a> and my bachelor's degree in <a href="http://sse.tongji.edu.cn/">Software Engineering</a> from <a href="https://www.tongji.edu.cn/">Tongji University</a>. I also interned at Kuaishou.</p>
          </section>

          <section className={styles.section}>
            <h2>Selected Publications <span className={styles.sectionNote}>(see the <a href="/publications">full list</a> or <a href="https://scholar.google.com/citations?user=RuW6xgMAAAAJ">Google Scholar</a>)</span></h2>
            <div className={styles.papers}>
              <div className={styles.paper}>
                <img src="/img/publications/shiftdc.png" alt="Paper" />
                <div className={styles.paperContent}>
                  <h3>Understanding and Rectifying Safety Perception Distortion in VLMs</h3>
                  <p>Xiaohan Zou, Jian Kang, George Kesidis, Lu Lin</p>
                  <p className={styles.paperType}>Preprint</p>
                  <a href="https://arxiv.org/abs/2502.13095">arXiv:2502.13095</a>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Miscellaneous</h2>
            <ul className={styles.miscList}>
              <li>🚀 This <a href="https://github.com/Renovamen/renovamen.github.io">personal website</a> is built with <a href="https://astro.build/">Astro</a>, <a href="https://www.solidjs.com/">Solid</a> and <a href="https://github.com/antfu/unocss">UnoCSS</a></li>
              <li>🧐 <i>Renovamen</i> is a Latin word means <i>renewal</i></li>
              <li>🖥 Ex-OIer/ACMer</li>
              <li>🥎 Used to be a member of the softball team of Tongji University</li>
              <li>🌭 My dream: while(sleeping){'{'} money++; {'}'}</li>
              <li>🎮 Currently interested in <i>No Man's Sky</i> and <i>Minecraft</i></li>
            </ul>
          </section>
        </div>
      </main>
    </Layout>
  );
}

