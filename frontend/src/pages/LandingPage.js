import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import styles from './LandingPage.module.css';

const profile = {
  name: 'Laxmi Varshitha J',
  github: 'https://github.com/lvarshitha7',
  linkedin: 'https://www.linkedin.com/in/lvarshitha7'
};

export default function LandingPage() {
  const [form, setForm] = useState({ email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill email and password');
    if (!agreed) return toast.error('Please agree to the terms');
    setLoading(true);
    try {
      await register(form.email.split('@')[0], form.email, form.password);
      toast.success('Account created! Welcome to Smartlytics 🎉');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>
      {/* ─── Top product bar ─── */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <Link to="/" className={styles.topLogo}>
            <span className={styles.topLogoIcon}>S</span>
            <span className={styles.topLogoText}>Smartlytics</span>
          </Link>
          <div className={styles.topLinks}>
            <a href="#features">DataPrep</a>
            <a href="#how">Dashboards</a>
            <a href="#stack">AI Insights</a>
            <a href="#contact">Demo</a>
          </div>
          <div className={styles.topRight}>
            <Link to="/login" className={styles.signInLink}>Sign In</Link>
          </div>
        </div>
      </div>

      {/* ─── Hero Section ─── */}
      <section className={styles.hero}>
        {/* Animated bar chart background */}
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.barGroup}>
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className={styles.bgBar}
                style={{
                  '--delay': `${i * 0.4}s`,
                  '--duration': `${3 + (i % 5) * 0.8}s`,
                  '--height': `${25 + (i * 17) % 55}%`,
                  '--max-height': `${50 + (i * 13) % 45}%`,
                }}
              />
            ))}
          </div>
          {/* Floating data dots */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`dot-${i}`}
              className={styles.floatingDot}
              style={{
                '--dot-x': `${10 + (i * 12) % 80}%`,
                '--dot-y': `${20 + (i * 15) % 60}%`,
                '--dot-delay': `${i * 0.7}s`,
                '--dot-duration': `${4 + (i % 3) * 1.5}s`,
              }}
            />
          ))}
          {/* Connecting lines */}
          <svg className={styles.bgLines} viewBox="0 0 1000 500" preserveAspectRatio="none">
            <path d="M0 350 Q 150 280, 300 320 T 600 250 T 900 300 T 1000 260" fill="none" stroke="rgba(99,102,241,0.08)" strokeWidth="2" />
            <path d="M0 400 Q 200 330, 400 370 T 700 300 T 1000 340" fill="none" stroke="rgba(168,85,247,0.06)" strokeWidth="1.5" />
          </svg>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <div className={styles.aiBadge}>
              <span className={styles.aiStar}>✦</span>
              <span className={styles.aiBadgeText}>Agentic AI-Powered Self-Service BI and Analytics Platform</span>
            </div>
            <h1 className={styles.heroTitle}>
              Go from data<br />to insights<br />in minutes
            </h1>
            <div className={styles.heroChecks}>
              <span className={styles.heroCheck}><CheckIcon /> Connect Data</span>
              <span className={styles.heroCheck}><CheckIcon /> Visually Analyze</span>
              <span className={styles.heroCheck}><CheckIcon /> Get Actionable Insights</span>
            </div>
            <button className={styles.watchBtn} onClick={() => navigate('/demo')}>
              <PlayIcon /> WATCH OVERVIEW
            </button>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.signupCard}>
              <div className={styles.cardTabs}>
                <label className={styles.cardTab}>
                  <input type="radio" name="mode" defaultChecked /> Cloud
                </label>
                <label className={styles.cardTab}>
                  <input type="radio" name="mode" /> On-premise
                </label>
              </div>
              <form className={styles.signupForm} onSubmit={submit}>
                <div className={styles.formGroup}>
                  <input
                    className={styles.formInput}
                    type="email"
                    name="email"
                    placeholder="Business Email *"
                    value={form.email}
                    onChange={handle}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <input
                    className={styles.formInput}
                    type="password"
                    name="password"
                    placeholder="Password *"
                    value={form.password}
                    onChange={handle}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.phoneRow}>
                    <span className={styles.phonePrefix}>+91</span>
                    <input
                      className={`${styles.formInput} ${styles.phoneInput}`}
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={handle}
                    />
                  </div>
                </div>
                <label className={styles.termsCheck}>
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                  <span>I agree to the <Link to="/terms" className={styles.termsLink}>Terms of Service</Link> and <Link to="/privacy" className={styles.termsLink}>Privacy Policy</Link>.</span>
                </label>
                <button className={styles.signupBtn} type="submit" disabled={loading}>
                  {loading ? 'Creating account…' : 'SIGN UP FOR FREE'}
                </button>
              </form>
              <div className={styles.socialRow}>
                <span className={styles.socialText}>or sign in using</span>
                <button className={styles.socialBtn} type="button" title="Google">
                  <svg width="20" height="20" viewBox="0 0 20 20"><path d="M19.8 10.2c0-.7-.1-1.4-.2-2H10v3.8h5.5c-.2 1.2-1 2.3-2 3v2.5h3.3c1.9-1.8 3-4.4 3-7.3z" fill="#4285F4" /><path d="M10 20c2.7 0 5-.9 6.7-2.4l-3.3-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H1v2.6C2.7 17.8 6.1 20 10 20z" fill="#34A853" /><path d="M4.4 12c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V5.4H1C.4 6.6 0 8.3 0 10s.4 3.4 1 4.6l3.4-2.6z" fill="#FBBC05" /><path d="M10 3.9c1.5 0 2.8.5 3.9 1.5l2.9-2.9C15 .9 12.7 0 10 0 6.1 0 2.7 2.2 1 5.4L4.4 8C5.2 5.7 7.4 3.9 10 3.9z" fill="#EA4335" /></svg>
                </button>
                <button className={styles.socialBtn} type="button" title="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" rx="3" fill="#0077B5" /><path d="M5.7 8.3H3.3v8.4h2.4V8.3zM4.5 7.2c.8 0 1.4-.6 1.4-1.4 0-.8-.6-1.4-1.4-1.4-.8 0-1.4.6-1.4 1.4 0 .8.6 1.4 1.4 1.4zM10.7 8.3H8.5v8.4h2.4v-4.2c0-1.1.2-2.2 1.6-2.2 1.4 0 1.4 1.3 1.4 2.3v4.1h2.4v-4.6c0-2.3-.5-4.1-3.2-4.1-1.3 0-2.2.7-2.5 1.4h0V8.3z" fill="white" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── "Get started in 3 simple steps" ─── */}
      <section className={styles.stepsSection} id="how">
        <div className={styles.stepsLeft}>
          <div className={styles.stepsWelcome}>
            <svg className={styles.stepsLogo} width="36" height="36" viewBox="0 0 28 28" fill="none">
              <path d="M4 8L14 3L24 8V20L14 25L4 20V8Z" stroke="#e8143c" strokeWidth="2" fill="none" />
              <path d="M14 13V25" stroke="#e8143c" strokeWidth="1.4" />
              <path d="M4 8L14 13L24 8" stroke="#e8143c" strokeWidth="1.4" />
            </svg>
            <h2 className={styles.stepsWelcomeTitle}>Welcome to <strong>Smartlytics!</strong></h2>
          </div>
          <p className={styles.stepsDesc}>
            Smartlytics is an AI-powered reporting and business intelligence service that helps you easily analyze your
            business data and create insightful reports &amp; dashboards for informed decision-making.
          </p>
          <h3 className={styles.stepsHeading}>Get started in 3 simple steps</h3>
          <div className={styles.stepsFlow}>
            <div className={styles.stepItem}>
              <div className={styles.stepIconWrap}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect x="12" y="8" width="24" height="32" rx="3" stroke="#3B5BDB" strokeWidth="2" fill="none" />
                  <path d="M20 20L24 24L28 20" stroke="#3B5BDB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M24 14V24" stroke="#3B5BDB" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16 30H32" stroke="#3B5BDB" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M16 34H32" stroke="#3B5BDB" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className={styles.stepLabel}><strong>1. Import/Connect</strong><br />Data</div>
            </div>
            <div className={styles.stepDots}>
              <svg width="60" height="20" viewBox="0 0 60 20"><path d="M0 10h60" stroke="#bbb" strokeWidth="1.5" strokeDasharray="4 4" /><polygon points="55,6 60,10 55,14" fill="#3B5BDB" /></svg>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepIconWrap}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect x="10" y="18" width="6" height="18" rx="1" fill="#3B5BDB" opacity="0.3" />
                  <rect x="21" y="12" width="6" height="24" rx="1" fill="#3B5BDB" opacity="0.6" />
                  <rect x="32" y="6" width="6" height="30" rx="1" fill="#3B5BDB" />
                  <path d="M10 38L20 28L30 22L40 12" stroke="#3B5BDB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className={styles.stepLabel}><strong>2. Create</strong><br />Reports &amp; Dashboards</div>
            </div>
            <div className={styles.stepDots}>
              <svg width="60" height="20" viewBox="0 0 60 20"><path d="M0 10h60" stroke="#bbb" strokeWidth="1.5" strokeDasharray="4 4" /><polygon points="55,6 60,10 55,14" fill="#3B5BDB" /></svg>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepIconWrap}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="20" cy="24" r="10" stroke="#3B5BDB" strokeWidth="2" fill="none" />
                  <circle cx="32" cy="24" r="10" stroke="#3B5BDB" strokeWidth="2" fill="none" />
                  <circle cx="20" cy="24" r="3" fill="#3B5BDB" opacity="0.4" />
                  <circle cx="32" cy="24" r="3" fill="#3B5BDB" opacity="0.4" />
                </svg>
              </div>
              <div className={styles.stepLabel}><strong>3. Share &amp; Embed</strong><br />Reports &amp; Dashboards</div>
            </div>
          </div>
          <Link to="/register" className={styles.getStartedBtn}>Get Started</Link>
        </div>
        <div className={styles.stepsRight}>
          <div className={styles.helpTitle}>Looking for help?</div>
          <div className={styles.helpCard} onClick={() => navigate('/demo')}>
            <div className={styles.helpThumb}>
              <div className={styles.helpChartPreview}>
                <div className={styles.miniBar} style={{ height: '60%', background: '#F59E42' }} />
                <div className={styles.miniBar} style={{ height: '80%', background: '#F59E42' }} />
                <div className={styles.miniBar} style={{ height: '45%', background: '#F59E42' }} />
                <div className={styles.miniBar} style={{ height: '90%', background: '#F59E42' }} />
                <div className={styles.miniBar} style={{ height: '70%', background: '#F59E42' }} />
                <div className={styles.miniBar} style={{ height: '55%', background: '#F59E42' }} />
              </div>
              <div className={styles.playOverlay}><PlayCircle /></div>
            </div>
            <div className={styles.helpLabel}>Watch getting started video</div>
          </div>
          <div className={styles.helpCard} onClick={() => navigate('/demo')}>
            <div className={styles.helpThumb}>
              <div className={styles.helpDashPreview}>
                <div className={styles.dashRow}>
                  <div className={styles.dashBlock} style={{ background: '#C084FC' }} />
                  <div className={styles.dashBlock} style={{ background: '#60A5FA' }} />
                </div>
                <div className={styles.dashRow}>
                  <div className={styles.dashBlock} style={{ background: '#34D399' }} />
                  <div className={styles.dashBlock} style={{ background: '#F472B6' }} />
                </div>
              </div>
              <div className={styles.playOverlay}><PlayCircle /></div>
            </div>
            <div className={styles.helpLabel}>How to create dashboard?</div>
          </div>
          <a href="#features" className={styles.helpLink}>Featured Samples</a>
          <div className={styles.helpFooterRow}>
            <Link to="/demo" className={styles.helpLink}>Request a Demo</Link>
            <span className={styles.helpDivider}>|</span>
            <a href="#contact" className={styles.helpLink}>Help</a>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
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

      {/* ─── Tech Stack ─── */}
      <section className={styles.stackSection} id="stack">
        <div className={styles.sectionTag}>Tech Stack</div>
        <h2 className={styles.sectionTitle}>Built using modern, in-demand technologies.</h2>
        <div className={styles.stackGrid}>
          {['React', 'Node.js', 'Express', 'MongoDB', 'Gemini AI', 'Vite'].map((item) => (
            <div key={item} className={styles.stackCard}>{item}</div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>See it in action. Explore the code. Build smarter.</h2>
        <p className={styles.ctaSub}>Experience the full workflow — from raw data to intelligent dashboards.</p>
        <div className={styles.ctaActions}>
          <Link to="/demo" className={styles.ctaBtn}>Try Live Demo</Link>
          <a href={profile.github} target="_blank" rel="noreferrer" className={styles.ctaGhost}>View GitHub</a>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className={styles.footer} id="contact">
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>
            <span className={styles.topLogoIcon}>S</span>
            <span>Smartlytics</span>
          </div>
          <div className={styles.footerText}>© 2026 Smartlytics | Built by {profile.name}</div>
        </div>
        <div className={styles.footerLinks}>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}


function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5l3.5 3L13 5" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginRight: 6 }}>
      <polygon points="3,1 12,7 3,13" fill="currentColor" />
    </svg>
  );
}

function PlayCircle() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="17" fill="rgba(0,0,0,0.5)" stroke="white" strokeWidth="1.5" />
      <polygon points="14,11 27,18 14,25" fill="white" />
    </svg>
  );
}
