import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Terminal, Sparkles, MapPin, Zap, Cpu, GraduationCap, Mail, Phone, ExternalLink } from 'lucide-react'
import './AboutDossierExperience.css'

interface AboutDossierExperienceProps {
  onClose: () => void
  onNavigateSection?: (section: 'projects' | 'experience' | 'about' | 'contact') => void
}

const TECH_STACK = [
  { name: 'Node.js', category: 'Backend', color: '#22c55e' },
  { name: 'Express.js', category: 'Backend', color: '#10b981' },
  { name: 'React.js', category: 'Frontend', color: '#00d4ff' },
  { name: 'MongoDB', category: 'Database', color: '#16a34a' },
  { name: 'JavaScript (ES6+)', category: 'Language', color: '#fbbf24' },
  { name: 'Java (Core)', category: 'Language', color: '#ea580c' },
  { name: 'Python', category: 'Language', color: '#38bdf8' },
  { name: 'Socket.io', category: 'Real-Time', color: '#ffffff' },
  { name: 'JWT Auth', category: 'Security', color: '#f43f5e' },
  { name: 'Amazon SES', category: 'Cloud', color: '#f97316' },
  { name: 'Google API', category: 'AI', color: '#4285f4' },
  { name: 'RESTful APIs', category: 'Architecture', color: '#a855f7' },
]

const STATS = [
  { label: 'Experience', value: '1+ Year' },
  { label: 'Master of CA', value: 'MCA (7.1)' },
  { label: 'Core Focus', value: 'MERN Stack' },
]

export default function AboutDossierExperience({
  onClose,
  onNavigateSection,
}: AboutDossierExperienceProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <motion.div
      className="about-stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── Top Header Bar ── */}
      <div className="about-top-bar">
        <button
          type="button"
          className="about-back-btn"
          onClick={onClose}
          aria-label="Back to the room"
        >
          <ArrowLeft size={15} /> BACK TO THE ROOM [ESC]
        </button>

        <div className="about-status-pill">
          <span className="about-pulse-dot" />
          <span className="font-mono text-xs uppercase tracking-wider text-pink-400">
            Developer Profile · Terminal Station
          </span>
        </div>
      </div>

      {/* ── Center Holographic Dossier ── */}
      <div className="about-center-wrap">
        <motion.div
          className="about-dossier-card"
          initial={{ scale: 0.96, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 10 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Card Ambient Header Glow */}
          <div className="about-card-glow" />

          {/* Dossier Header */}
          <div className="about-dossier-header">
            <div className="about-avatar-wrapper">
              <img
                src="/ajay-avatar.jpg"
                alt="Ajay Singh"
                className="about-avatar-img"
              />
              <span className="about-avatar-badge" title="Online / Open to work" />
            </div>

            <div className="about-header-meta">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="about-tag-badge">MERN STACK DEVELOPER</span>
                <span className="about-location-badge">
                  <MapPin size={11} /> FARIDABAD, HARYANA
                </span>
                <span className="about-contact-badge">
                  <Mail size={11} /> ajeysingh4220@gmail.com
                </span>
                <span className="about-contact-badge">
                  <Phone size={11} /> +91-9821240727
                </span>
              </div>
              <h2 className="about-name">AJAY SINGH</h2>
              <p className="about-headline">
                Software Developer | MERN Stack | Backend &amp; API Development
              </p>
            </div>
          </div>

          {/* Body Content Grid */}
          <div className="about-grid">
            {/* Left Column: Bio Narrative & Education */}
            <div className="about-col-bio">
              <div className="about-section-label">
                <User size={13} />
                <span>PROFESSIONAL SUMMARY</span>
              </div>
              <p className="about-bio-text">
                Results-driven MCA student and <strong>MERN Stack Developer</strong> with 1 year of
                hands-on experience designing and deploying scalable full-stack web applications.
                Proficient in <strong>Node.js, Express.js, React, and MongoDB</strong> with a strong
                foundation in RESTful API design, JWT authentication, database optimization, and cloud integrations.
              </p>
              <p className="about-bio-text secondary">
                Experienced in building enterprise HRMS systems, AI resume parsing pipelines, real-time Socket.io
                chat apps, and cloud workflows. Actively improving Data Structures &amp; Algorithms skills to deliver high-impact software solutions.
              </p>

              {/* Stat Chips */}
              <div className="about-stats-row">
                {STATS.map((stat) => (
                  <div key={stat.label} className="about-stat-box">
                    <span className="about-stat-val">{stat.value}</span>
                    <span className="about-stat-lbl">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Education Highlights */}
              <div className="about-section-label mt-4">
                <GraduationCap size={13} />
                <span>EDUCATION GRAPH</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="about-edu-card">
                  <div className="font-semibold text-white text-xs">Master of Computer Applications (MCA)</div>
                  <div className="text-zinc-400 text-xs">Galgotias University · Completed 2024–26 · <span className="text-pink-400 font-mono">CGPA: 7.1</span></div>
                </div>
                <div className="about-edu-card">
                  <div className="font-semibold text-white text-xs">Bachelor of Computer Applications (BCA)</div>
                  <div className="text-zinc-400 text-xs">J.C. Bose UST, YMCA · Completed · <span className="text-pink-400 font-mono">CGPA: 7.1</span></div>
                </div>
              </div>
            </div>

            {/* Right Column: Tech & Principles */}
            <div className="about-col-skills">
              <div className="about-section-label">
                <Terminal size={13} />
                <span>TECHNICAL ARSENAL</span>
              </div>

              <div className="about-tech-chips">
                {TECH_STACK.map((tech) => (
                  <span
                    key={tech.name}
                    className="about-tech-chip"
                    style={{ borderColor: `${tech.color}33` }}
                  >
                    <span
                      className="about-chip-dot"
                      style={{ backgroundColor: tech.color }}
                    />
                    <span className="about-chip-text">{tech.name}</span>
                  </span>
                ))}
              </div>

              <div className="about-section-label mt-4">
                <Zap size={13} />
                <span>ENGINEERING CAPABILITIES</span>
              </div>

              <div className="about-principles-list">
                <div className="about-principle-item">
                  <Cpu size={14} className="text-pink-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Scalable Backend &amp; APIs:</strong> Modular RESTful routing in Node/Express, role-based access control (RBAC), and compound-indexed MongoDB pipelines.
                  </div>
                </div>
                <div className="about-principle-item">
                  <Sparkles size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Real-Time &amp; Cloud Integrations:</strong> Bi-directional WebSockets/Socket.io messaging, automated email alerts via Amazon SES, and media pipelines with ImageKit &amp; Multer.
                  </div>
                </div>
              </div>

              {/* Profiles Row */}
              <div className="flex items-center gap-3 mt-4">
                <a
                  href="https://github.com/AJAY9821"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
                >
                  GitHub <ExternalLink size={11} />
                </a>
                <a
                  href="https://linkedin.com/in/ajay-singh-49a874214"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-300 hover:bg-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  LinkedIn <ExternalLink size={11} />
                </a>
                <a
                  href="https://leetcode.com/u/Ajay_pa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
                >
                  LeetCode <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Navigation Dock ── */}
      <motion.div
        className="about-bottom-dock"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          type="button"
          className="about-dock-tab"
          onClick={() => onNavigateSection?.('projects')}
        >
          <span className="dock-prefix">01</span> PROJECTS
        </button>

        <button
          type="button"
          className="about-dock-tab"
          onClick={() => onNavigateSection?.('experience')}
        >
          <span className="dock-prefix">02</span> EXPERIENCE
        </button>

        <button
          type="button"
          className="about-dock-tab active"
          onClick={onClose}
        >
          <span className="dock-prefix">03</span> ABOUT
        </button>

        <button
          type="button"
          className="about-dock-tab"
          onClick={() => onNavigateSection?.('contact')}
        >
          <span className="dock-prefix">04</span> CONTACT
        </button>
      </motion.div>
    </motion.div>
  )
}
