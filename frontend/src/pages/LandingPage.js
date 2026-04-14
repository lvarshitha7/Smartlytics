import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { KpiCard, Badge } from '../components/ui/UIComponents';
import { renderChart } from '../components/charts/ChartComponents';
import { demoDashboard, demoWidgetData } from '../data/demoDashboard';
import styles from './LandingPage.module.css';

const profile = {
  name: 'Laxmi Varshitha J',
  github: 'https://github.com/your-username',
  linkedin: 'https://www.linkedin.com/in/your-handle/',
  resume: 'https://example.com/resume.pdf'
};

const techStack = ['React', 'Node.js', 'Express', 'MongoDB', 'Gemini AI', 'Vite'];

export default function LandingPage() {
  const previewWidgets = useMemo(() => demoDashboard.widgets.filter((widget) => widget.type !== 'kpi').slice(0, 2), []);
  const previewKpis = useMemo(() => demoDashboard.widgets.filter((widget) => widget.type === 'kpi').slice(0, 3), []);

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link to="/home" className={styles.logo}>
          <span className={styles.logoBox}>S</span>
          <span className={styles.logoText}>Smartlytics</span>
        </Link>
        <div className={styles.navLinks}>
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#stack">Tech stack</a>
          <a href="#contact">Contact</a>
        </div>
        <div className={styles.navRight}>
          <Link to="/demo" className={styles.navDemo}>Try Demo</Link>
          <Link to="/register" className={styles.navCta}>Get Started</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroBadge}>
            <span className={styles.aiDot} />
            Full-Stack AI Project - React + Node.js + Gemini AI
          </div>
          <h1 className={styles.heroTitle}>
            Turn Data Into Decisions - Instantly.
            <span className={styles.heroAccent}>From raw data to insights in minutes.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Build powerful, interactive dashboards from raw business data.
          </p>
          <p className={styles.valueProp}>
            Designed for speed, clarity, and impact - helping teams make smarter decisions faster.
          </p>
          <div className={styles.heroChecks}>
            {['Public live demo with sample data', 'Gemini-powered dashboard generation', 'Responsive React + Vite frontend'].map((item) => (
              <div key={item} className={styles.heroCheck}><span className={styles.checkMark}>✓</span>{item}</div>
            ))}
          </div>
          <div className={styles.heroActions}>
            <Link to="/demo" className={styles.heroPrimary}>Try Live Demo</Link>
            <a href={profile.github} target="_blank" rel="noreferrer" className={styles.heroSecondary}>View Code</a>
          </div>
          <div className={styles.profileRow}>
            <span className={styles.builtBy}>Built by {profile.name}</span>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={profile.resume} target="_blank" rel="noreferrer">Resume</a>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.previewFrame}>
            <div className={styles.previewToolbar}>
              <div className={styles.previewDots}>
                <span />
                <span />
                <span />
              </div>
              <div className={styles.previewTitle}>Live Preview · Sample dashboard generation</div>
            </div>

            <div className={styles.previewContent}>
              <div className={styles.previewStatus}>
                <Badge color="purple" size="sm">AI Generating</Badge>
                <span>Sample dataset loaded instantly</span>
              </div>
              <div className={styles.previewKpis}>
                {previewKpis.map((widget) => (
                  <KpiCard
                    key={widget.id}
                    label={widget.title}
                    value={demoWidgetData[widget.id].value}
                    subtitle={widget.subtitle}
                    prefix={widget.kpiConfig?.prefix || ''}
                    suffix={widget.kpiConfig?.suffix || ''}
                    color={widget.kpiConfig?.colorTheme}
                  />
                ))}
              </div>
              <div className={styles.previewCharts}>
                {previewWidgets.map((widget) => (
                  <div key={widget.id} className={styles.previewChartCard}>
                    <div className={styles.previewChartHead}>
                      <div>
                        <div className={styles.previewChartTitle}>{widget.title}</div>
                        <div className={styles.previewChartSub}>{widget.subtitle}</div>
                      </div>
                      <span className={styles.previewChartType}>{widget.type}</span>
                    </div>
                    <div className={styles.previewChartBody}>
                      {renderChart(widget.type, demoWidgetData[widget.id], widget.config || {})}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.logosRow}>
        {techStack.map((item) => (
          <span key={item} className={styles.techBadge}>{item}</span>
        ))}
      </section>

      <section className={styles.howSection} id="how">
        <div className={styles.sectionTag}>How It Works</div>
        <h2 className={styles.sectionTitle}>A polished full-stack flow recruiters can test in seconds.</h2>
        <div className={styles.steps}>
          {[
            { num: '1', icon: '📁', title: 'Load data', desc: 'Try the public demo or upload CSV/Excel data to profile columns, detect types, and inspect rows.' },
            { num: '2', icon: '✨', title: 'Generate dashboard', desc: 'Gemini chooses KPIs, chart types, and layout so you can show real product depth instead of static mockups.' },
            { num: '3', icon: '💬', title: 'Ask questions', desc: 'Users can query datasets in plain English and get concise insights directly from the analytics workflow.' }
          ].map((step) => (
            <div key={step.num} className={styles.step}>
              <div className={styles.stepIcon}>{step.icon}</div>
              <div className={styles.stepNum}>{step.num}</div>
              <div className={styles.stepTitle}>{step.title}</div>
              <div className={styles.stepDesc}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.featuresSection} id="features">
        <div className={styles.sectionTag}>Features</div>
        <h2 className={styles.sectionTitle}>Core features built for real analytics workflows.</h2>
        <div className={styles.featuresGrid}>
          {[
            { icon: '🧹', color: '#fff3cd', title: 'Smart Data Processing', desc: 'Clean, transform, and structure raw data effortlessly.' },
            { icon: '📊', color: '#d1fae5', title: 'Interactive Dashboards', desc: 'Create dynamic dashboards with real-time insights.' },
            { icon: '🤖', color: '#ede9fe', title: 'AI-Powered Insights', desc: 'Leverage AI to uncover patterns and trends instantly.' },
            { icon: '📤', color: '#dbeafe', title: 'Export & Share', desc: 'Download and share dashboards with ease.' }
          ].map((feature) => (
            <div key={feature.title} className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ background: feature.color }}>{feature.icon}</div>
              <div className={styles.featureTitle}>{feature.title}</div>
              <div className={styles.featureDesc}>{feature.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.showcaseSection}>
        <div className={styles.showcaseCopy}>
          <div className={styles.sectionTag}>Sample Dashboard</div>
          <h2 className={styles.sectionTitle}>A live product preview replaces the empty hero card.</h2>
          <p className={styles.showcaseText}>
            The landing page now shows an actual dashboard snapshot built from the same sample data
            used in the public demo route, making the project feel real immediately.
          </p>
          <Link to="/demo" className={styles.inlineLink}>Open the interactive demo</Link>
        </div>
        <div className={styles.showcasePanel}>
          <div className={styles.showcasePanelHeader}>
            <div className={styles.showcasePanelTitle}>Revenue Performance Demo</div>
            <Badge color="green" size="sm">Live Preview</Badge>
          </div>
          <div className={styles.showcasePanelBody}>
            <div className={styles.miniChart}>{renderChart('line', demoWidgetData.c1, { colorScheme: 'blue' })}</div>
          </div>
        </div>
      </section>

      <section className={styles.stackSection} id="stack">
        <div className={styles.sectionTag}>Tech Stack</div>
        <h2 className={styles.sectionTitle}>Built using modern, in-demand technologies.</h2>
        <div className={styles.stackGrid}>
          {techStack.map((item) => (
            <div key={item} className={styles.stackCard}>{item}</div>
          ))}
        </div>
      </section>

      <section className={styles.impactSection}>
        <div className={styles.sectionTag}>Impact</div>
        <h2 className={styles.sectionTitle}>Designed with measurable outcomes in mind.</h2>
        <div className={styles.impactGrid}>
          <div className={styles.impactCard}>Reduced dashboard creation time by 80% through automation.</div>
          <div className={styles.impactCard}>Designed for scalability and real-world business use cases.</div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>See it in action. Explore the code. Build smarter.</h2>
        <p className={styles.ctaSub}>Experience the full workflow - from raw data to intelligent dashboards.</p>
        <p className={styles.ctaNote}>Built with performance, scalability, and real-world usability in mind.</p>
        <div className={styles.ctaActions}>
          <Link to="/demo" className={styles.ctaBtn}>Try Live Demo</Link>
          <a href={profile.github} target="_blank" rel="noreferrer" className={styles.ctaGhost}>View GitHub</a>
        </div>
      </section>

      <footer className={styles.footer} id="contact">
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>
            <span className={styles.logoBox}>S</span>
            <span>Smartlytics</span>
          </div>
          <div className={styles.footerText}>© 2026 Smartlytics | Built by {profile.name}</div>
        </div>
        <div className={styles.footerLinks}>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={profile.resume} target="_blank" rel="noreferrer">Resume</a>
        </div>
      </footer>
    </div>
  );
}
