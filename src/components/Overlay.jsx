import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'

/* ─── Preloader Removed ─── */

/* ─── CursorGlow ─── */
function CursorGlow() {
  const ref = useRef(null)

  useEffect(() => {
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0
    const el = ref.current
    if (!el) return

    const onMove = (e) => { mouseX = e.clientX; mouseY = e.clientY }
    document.addEventListener('mousemove', onMove)

    let raf
    function animate() {
      glowX += (mouseX - glowX) * 0.1
      glowY += (mouseY - glowY) * 0.1
      el.style.left = glowX + 'px'
      el.style.top = glowY + 'px'
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div className="cursor-glow" ref={ref} />
}

/* ─── Nav ─── */
function Nav({ triggerGlitch }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const smoothScroll = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="nav-container">
          <a href="#" className="nav-logo" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><span className="logo-text">Asher</span></a>
          <div className="nav-links">
            {['about', 'skills', 'works', 'contact'].map(s => (
              <a key={s} href={`#${s}`} className="nav-link" onClick={e => smoothScroll(e, `#${s}`)} onMouseEnter={triggerGlitch}>{s === 'skills' ? 'My Skills' : s.charAt(0).toUpperCase() + s.slice(1)}</a>
            ))}
          </div>
          <button className={`nav-toggle${menuOpen ? ' active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' active' : ''}`}>
        <div className="mobile-menu-content">
          {['about', 'skills', 'works', 'contact'].map(s => (
            <a key={s} href={`#${s}`} className="mobile-link" onClick={e => smoothScroll(e, `#${s}`)}>{s === 'skills' ? 'My Skills' : s.charAt(0).toUpperCase() + s.slice(1)}</a>
          ))}
        </div>
      </div>
    </>
  )
}

/* ─── Falling Bricks Profile ─── */
const GRID_SIZE = 40
const TOTAL_BRICKS = GRID_SIZE * GRID_SIZE

function FallingBricksProfile() {
  const [phase, setPhase] = useState('hidden_top')

  const bricks = useMemo(() => {
    return Array.from({ length: TOTAL_BRICKS }).map((_, i) => {
      const r = Math.floor(i / GRID_SIZE)
      const c = i % GRID_SIZE
      const bgPosX = c * (100 / (GRID_SIZE - 1))
      const bgPosY = r * (100 / (GRID_SIZE - 1))
      
      const rowDelay = (GRID_SIZE - 1 - r) * 0.03
      const centerDist = Math.abs(c - GRID_SIZE / 2)
      const colDelay = centerDist * 0.015
      const randomDelay = Math.random() * 0.05
      const delay = rowDelay + colDelay + randomDelay
      
      const translateX = (Math.random() - 0.5) * 60 
      return { id: i, bgPosX, bgPosY, delay, translateX }
    })
  }, [])

  useEffect(() => {
    let t1, t2, t3;
    const runCycle = () => {
      setPhase('hidden_top')
      t1 = setTimeout(() => setPhase('falling_in'), 100)
      t2 = setTimeout(() => setPhase('assembled'), 3000)
      t3 = setTimeout(() => setPhase('falling_out'), 6000)
    }
    runCycle()
    const interval = setInterval(runCycle, 9000)
    return () => {
      clearInterval(interval)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  return (
    <div className="falling-bricks-container">
      <div className="bricks-grid">
        {bricks.map((brick) => (
          <div 
            key={brick.id} 
            className={`brick phase-${phase}`}
            style={{
              backgroundPosition: `${brick.bgPosX}% ${brick.bgPosY}%`,
              transitionDelay: phase === 'hidden_top' ? '0s' : `${brick.delay}s`,
              '--tx': `${brick.translateX}px`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── Hero ─── */
function Hero({ triggerGlitch }) {
  const smoothScroll = (e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' })
  }

  return (
    <header className="hero" id="hero">
      <div className="hero-bg">
        <div className="hero-gradient" />
      </div>

      <div className="hero-content hero-content-centered">
        
        <FallingBricksProfile />

        <h2 className="hero-subtitle" style={{ height: '1.5em', display: 'flex', alignItems: 'center' }}>
          <span>Writer ✦ Brand & Content Strategist</span>
        </h2>

        <div className="hero-cta">
          <a href="#works" className="btn btn-primary" onClick={e => smoothScroll(e, '#works')} onMouseEnter={triggerGlitch}>
            <span>Explore My Work</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
          </a>
          <a href="https://asherfaithy.github.io/My-Resume/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" onMouseEnter={triggerGlitch}><span>View my Resume</span></a>
        </div>
      </div>

      <div className="hero-scroll"><span>Scroll to explore</span>
        <div className="scroll-indicator"><div className="scroll-dot" /></div>
      </div>
    </header>
  )
}

/* Marquee removed and replaced with 3D Cosmic Bodies */

/* ─── About ─── */
function About() {
  return (
    <section className="about" id="about">
      <div className="about-bg"><div className="about-lines" /></div>
      <div className="container">
        <div className="about-grid">
          <div className="about-content">
            <span className="section-label">About Me</span>
            <div className="about-text">
              <p>I've always been an observer first. I like acting because it forces you to pay attention to the things most people miss, the rhythms of how people actually talk and the small details of how they move when they aren't 'performing.' It's a study of the human mask, and it's that same eye for detail that I bring to my research and writing.</p>
              <p>Beyond that, I just love the act of creating, anything, basically. Whether I'm building a brand story or just making something from scratch, I'm driven by the process of turning an idea into something tangible. I don't want to produce work that sounds like a performance; I want to create things that feel like they belong in the real world.</p>
              <p>When I'm not working, I'm usually just watching the world go by and trying to find the 'why' behind the way things are or just appreciating the aura of a cat.</p>
            </div>
            <div className="about-highlights">
              {['Brand Storyteller', 'Technical Writer', 'Content Strategist', 'Researcher'].map(h => (
                <div key={h} className="highlight-item"><span className="highlight-icon">✦</span><span>{h}</span></div>
              ))}
            </div>
            <div className="communities-section">
              <h3 className="communities-title">Communities &amp; Affiliation</h3>
              <div className="community-item"><strong>SuperteamNG</strong><br />Contributor and State Lead Writer</div>
              <div className="community-item"><strong>Solana Collective</strong><br />Member and Active Contributor</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}        

/* ─── Skills ─── */
function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="container">
        <div className="section-header centered"><span className="section-label">My Skills</span></div>
        <div className="skills-content">
          <div className="skill-category">
            <h3>📝 Content Strategy &amp; Brand Storytelling</h3>
            <ul className="skill-list">
              {['Brand Narrative & Creative Writing', 'Technical Writing', 'Editorial Collaboration', 'Long-Form Articles', 'Brand Voice Development'].map(s => <li key={s}>{s}</li>)}
            </ul>
          </div>
          <div className="skill-category">
            <h3>🎤 Communication &amp; Multimedia</h3>
            <ul className="skill-list">
              {['Public Speaking', 'Video Creation', 'Co-hosting (AMAs / Spaces)', 'Community Advocacy'].map(s => <li key={s}>{s}</li>)}
            </ul>
          </div>
          <div className="skill-category">
            <h3>📊 Ecosystem Research &amp; Analysis</h3>
            <ul className="skill-list">
              {['Solana Protocol Knowledge', 'Token & Data Analysis', 'Market Research'].map(s => <li key={s}>{s}</li>)}
            </ul>
          </div>
        </div>
        <div className="tools-section">
          <h3 className="tools-title">Tools &amp; Platforms</h3>
          <p><strong>Community &amp; Social:</strong> Discord, Telegram, Twitter</p>
          <p><strong>Content &amp; Collaboration:</strong> Substack, Medium, Canva, Google Workspace, Notion</p>
        </div>
      </div>
    </section>
  )
}

/* ─── Experience ─── */
function Experience() {
  return (
    <section className="experience" id="experience">
      <div className="container">
        <div className="section-header centered"><span className="section-label">Experience</span></div>
        <div className="experience-content">
          <div className="experience-item">
            <h3 className="experience-title">Technical Writer &amp; Contributor | SuperteamNG</h3>
            <p className="experience-meta">Remote | 2024 – Present</p>
            <p className="experience-description">Served as a contributing author for the 2025 Solana magazine "This Is Solana," collaborating with 20+ writers. Leveraged Superteam Earn writing bounties to earn a contributor role. Specialized in translating complex Solana protocols and blockchain concepts into accessible long-form research articles.</p>
          </div>
          <div className="experience-item">
            <h3 className="experience-title">Content Strategist &amp; Creative Writer</h3>
            <p className="experience-meta">Remote | 2024 – Present</p>
            <p className="experience-description">Secured 2nd place in the 2025 Solana Contentathon (Infinity Labs track). Develop narrative strategies that blend technical utility with creative storytelling. Conduct deep-dive research for Superteam Earn submissions and produce long-form articles, threads, and videos for technical and non-technical audiences.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Works ─── */
const projects = [
  {
    num: '01', category: 'Research Paper', title: 'Cracking Product Market Fit in Harsh Markets', featured: true,
    excerpt: 'A Nigerian Solana startups case study showing how local teams are finding real product-market fit by solving everyday financial problems with fast, low-cost, user-friendly apps that hide blockchain complexity and build trust through clear utility and community-led growth.',
    tags: ['Writing', 'Blockchain', 'Research'], year: '2025', img: '/project1.jpg',
    link: 'https://open.substack.com/pub/klausofnifes/p/nigerian-solana-startups-cracking?r=3pfsdi&utm_medium=ios&shareImageVariant=overlay'
  },
  {
    num: '02', category: 'Article', title: 'What Makes a Good Stable Coin?',
    excerpt: 'A concise analysis of what defines a good stablecoin, focusing on stability, trust, and real-world usefulness.',
    tags: ['Writing', 'Research'], year: '2025', img: '/project2.jpg',
    link: 'https://medium.com/@awudangfaith/what-makes-a-good-stable-coin-ff71e5f2ae9f'
  },
  {
    num: '03', category: 'Article', title: 'Beer, stablecoins and Finna',
    excerpt: 'This article explores "survival economics" in Nigeria, examining how citizens navigate inflation and naira volatility through unconventional means. It highlights the strategic pivot toward stablecoins and the Finna as essential tools for preserving purchasing power.',
    tags: ['Writing', 'Research'], year: '2025', img: '/finna-article.jpg',
    link: 'https://medium.com/@awudangfaith/beer-stablecoins-and-finna-nigerias-survival-economics-80b566039c12'
  },
  {
    num: '04', category: 'Fiction (Thread)', title: 'The Koyn Evening',
    excerpt: 'A short fiction set in bustling Lagos, using storytelling to show how Koyn helps Nigerians escape P2P stress and scams while paying bills seamlessly in one app.',
    tags: ['Writing', 'Storytelling', 'Research'], year: '2025', img: '/project4.jpg',
    link: 'https://x.com/faithy_danniel/status/1999025556621291703?s=46'
  }
]

function Works({ triggerGlitch }) {
  return (
    <section className="works" id="works">
      <div className="container">
        <div className="section-header"><span className="section-label">Featured Works</span></div>
        <div className="works-grid">
          {projects.map(p => (
            <article key={p.num} className={`work-card${p.featured ? ' featured' : ''}`} onMouseEnter={triggerGlitch}>
              <div className="work-image">
                <img src={p.img} alt={p.title} className="project-img" />
                <div className="work-overlay" />
              </div>
              <div className="work-content">
                <span className="work-category">{p.category}</span>
                <h3 className="work-title">{p.title}</h3>
                <p className="work-excerpt">{p.excerpt}</p>
                <div className="work-meta">
                  <span className="work-year">{p.year}</span>
                  {p.tags.map(t => <span key={t} className="work-tag">{t}</span>)}
                </div>
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="view-project-link">View project →</a>
              </div>
            </article>
          ))}
        </div>
        <div className="read-more-section">
          <h3 className="read-more-title">Read more of my works.</h3>
          <div className="read-more-links">
            <a href="https://substack.com/@asherfaithy?r=4btj06&utm_medium=ios&utm_source=profile&shareImageVariant=blur" target="_blank" rel="noopener noreferrer" className="read-more-icon" aria-label="Substack" onMouseEnter={triggerGlitch}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" /></svg>
            </a>
            <a href="https://medium.com/@awudangfaith" target="_blank" rel="noopener noreferrer" className="read-more-icon" aria-label="Medium" onMouseEnter={triggerGlitch}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" /></svg>
            </a>
            <a href="https://x.com/faithy_danniel?s=21" target="_blank" rel="noopener noreferrer" className="read-more-icon" aria-label="X (Twitter)" onMouseEnter={triggerGlitch}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Contact ─── */
function Contact({ triggerGlitch }) {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    const formData = new FormData(e.target)
    try {
      const res = await fetch('https://formspree.io/f/mnjjqypl', {
        method: 'POST', body: formData, headers: { Accept: 'application/json' }
      })
      if (res.ok) { setStatus('sent'); e.target.reset() }
      else throw new Error()
    } catch { setStatus('error') }
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <section className="contact" id="contact">
      <div className="contact-bg"><div className="contact-pattern" /></div>
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <span className="section-label">Get in Touch</span>
            <h2 className="section-title">Let's create<br /><span className="highlight">something together</span></h2>
            <p className="contact-description">Have a story waiting to be told? I'd love to hear from you.</p>
            <div className="contact-details">
              <a href="mailto:awudangfaith@gmail.com" className="contact-link" onMouseEnter={triggerGlitch}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <span>awudangfaith@gmail.com</span>
              </a>
              <div className="contact-socials">
                <a href="https://x.com/faithy_danniel?s=21" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="X (Twitter)" onMouseEnter={triggerGlitch}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a href="https://www.linkedin.com/in/faith-awudang-49a6553a5?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn" onMouseEnter={triggerGlitch}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </a>
                <a href="https://t.me/faithy_danniel" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Telegram" onMouseEnter={triggerGlitch}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.891 8.11l-1.92 9.049c-.145.639-.524.796-1.059.496l-2.92-2.154-1.408 1.354c-.156.156-.287.287-.588.287l.206-2.951 5.373-4.853c.234-.208-.052-.323-.362-.117l-6.642 4.18-2.859-.894c-.622-.194-.635-.622.13-.92l11.173-4.305c.517-.186.97.123.826.872z" /></svg>
                </a>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group"><label htmlFor="name">Your Name</label><input type="text" id="name" name="name" required placeholder="What should I call you?" /></div>
            <div className="form-group"><label htmlFor="email">Email</label><input type="email" id="email" name="email" required placeholder="Where can I reach you?" /></div>
            <div className="form-group"><label htmlFor="project">Project Type</label>
              <select id="project" name="project" required defaultValue="">
                <option value="" disabled>What are you looking for?</option>
                <option value="fiction">Fiction Writing</option>
                <option value="copywriting">Copywriting</option>
                <option value="editing">Editing</option>
                <option value="other">Something Else</option>
              </select>
            </div>
            <div className="form-group"><label htmlFor="message">Message</label><textarea id="message" name="message" rows="4" required placeholder="Tell me about your project..." /></div>
            <button type="submit" className={`btn btn-primary btn-full${status === 'sent' ? ' btn-success' : status === 'error' ? ' btn-error' : ''}`} disabled={status === 'sending'} onMouseEnter={triggerGlitch}>
              <span>{status === 'sending' ? 'Sending Message...' : status === 'sent' ? 'Message Sent! ✓' : status === 'error' ? 'Error! Please try again.' : 'Send Message'}</span>
              {status === 'idle' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─── */
function Footer({ triggerGlitch }) {
  const smoothScroll = (e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand"><span className="footer-logo">Asher</span><p>Crafting stories that matter.</p></div>
          <div className="footer-nav">
            {[['#about', 'About'], ['#skills', 'My Skills'], ['#works', 'Work'], ['#contact', 'Contact']].map(([href, label]) => (
              <a key={href} href={href} onClick={e => smoothScroll(e, href)} onMouseEnter={triggerGlitch}>{label}</a>
            ))}
          </div>
          <div className="footer-bottom">
            <span>© 2026 Asher. All rights reserved.</span>
            <span>[ SYSTEM . OFFLINE ]</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── Main Overlay ─── */
export default function Overlay({ setGlitching }) {
  // Fire a tiny 0.1s glitch event
  const triggerGlitch = useCallback(() => {
    setGlitching(true)
    setTimeout(() => {
      setGlitching(false)
    }, 150)
  }, [setGlitching])

  return (
    <div className="overlay">

      <CursorGlow />
      <Nav triggerGlitch={triggerGlitch} />
      <Hero triggerGlitch={triggerGlitch} />
      <About />
      <Skills />
      <Experience />
      <Works triggerGlitch={triggerGlitch} />
      <Contact triggerGlitch={triggerGlitch} />
      <Footer triggerGlitch={triggerGlitch} />
    </div>
  )
}
