import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Mail,
  FileText,
  Send,
  Check,
  Copy,
  Wifi,
  Battery,
  MapPin,
  Clock,
  Sparkles,
  MessageSquare,
} from 'lucide-react'
import './SmartphoneContact.css'

function GithubIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function LinkedinIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

interface SmartphoneContactProps {
  onClose: () => void
  onNavigateSection?: (section: 'projects' | 'experience' | 'about' | 'contact') => void
}

export default function SmartphoneContact({
  onClose,
  onNavigateSection,
}: SmartphoneContactProps) {
  // Live clock formatted to HH:MM
  const [timeStr, setTimeStr] = useState('')
  const [emailCopied, setEmailCopied] = useState(false)
  const [formSent, setFormSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000 * 30)
    return () => clearInterval(timer)
  }, [])

  // Escape key listener to close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const copyEmail = () => {
    navigator.clipboard.writeText('ajeysingh4220@gmail.com')
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2200)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setFormSent(true)
    }, 800)
  }

  return (
    <motion.div
      className="smartphone-stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── Top Bar: Back to Room & Status Pill ── */}
      <div className="smartphone-top-bar">
        <button
          type="button"
          className="smartphone-back-btn"
          onClick={onClose}
          aria-label="Back to the room"
        >
          <ArrowLeft size={15} /> BACK TO THE ROOM [ESC]
        </button>

        <div className="smartphone-status-pill">
          <span className="smartphone-pulse-dot" />
          <span className="font-mono text-xs uppercase tracking-wider text-pink-300">
            Smartphone · Desk Connect
          </span>
        </div>
      </div>

      {/* ── The Smartphone Hardware Chassis (lying on desk) ── */}
      <div className="smartphone-device-wrap">
        {/* Ambient backlight glow reflecting on desk */}
        <div className="smartphone-screen-ambient" />

        <motion.div
          className="smartphone-device"
          initial={{ scale: 0.96, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 10 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Glass Specular Reflection Highlight */}
          <div className="phone-glass-glare" />

          {/* ── Mobile OS Status Bar ── */}
          <div className="phone-status-bar">
            <span className="phone-clock font-mono">{timeStr || '12:45 PM'}</span>

            {/* Dynamic Island Pill with Camera & Sensor */}
            <div className="phone-dynamic-island">
              <span className="island-camera" />
              <span className="island-sensor" />
            </div>

            <div className="phone-icons-group">
              {/* Cellular 5G Bars */}
              <div className="phone-cell-signal">
                <span className="bar bar1" />
                <span className="bar bar2" />
                <span className="bar bar3" />
                <span className="bar bar4" />
              </div>
              <Wifi size={13} className="text-zinc-200" />
              <div className="flex items-center gap-1 text-zinc-200">
                <span className="text-[10px] font-mono">98%</span>
                <Battery size={13} />
              </div>
            </div>
          </div>

          {/* ── Phone Screen Content Scroll ── */}
          <div className="phone-screen-content">
            {/* Profile Avatar & Identity Card */}
            <div className="phone-profile-card">
              <div className="phone-avatar-wrap">
                <img
                  src="/ajay-avatar.jpg"
                  alt="Ajay Avatar"
                  className="phone-avatar-img"
                />
                <span className="phone-online-pulse" title="Available now" />
              </div>

              <div className="phone-profile-text">
                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="phone-profile-name">Ajay Singh</h3>
                  <Sparkles size={14} className="text-pink-400" />
                </div>
                <p className="phone-profile-role">Software Developer | MERN Stack</p>

                {/* Open to Work Status Badge */}
                <div className="phone-availability-tag">
                  <span className="status-dot-green" />
                  <span>Open to Work · Full-Time / Remote</span>
                </div>
              </div>
            </div>

            {/* ── Quick Action Dials (iOS Style Action Pills) ── */}
            <div className="phone-quick-actions">
              <button
                type="button"
                className="quick-action-btn email"
                onClick={copyEmail}
                title="Click to copy email: ajeysingh4220@gmail.com"
              >
                <div className="action-circle">
                  {emailCopied ? (
                    <Check size={18} className="text-emerald-400" />
                  ) : (
                    <Mail size={18} />
                  )}
                </div>
                <span className="action-label">
                  {emailCopied ? 'Copied!' : 'Email'}
                </span>
              </button>

              <a
                href="https://linkedin.com/in/ajay-singh-49a874214"
                target="_blank"
                rel="noopener noreferrer"
                className="quick-action-btn linkedin"
              >
                <div className="action-circle">
                  <LinkedinIcon size={18} />
                </div>
                <span className="action-label">LinkedIn</span>
              </a>

              <a
                href="https://github.com/AJAY9821"
                target="_blank"
                rel="noopener noreferrer"
                className="quick-action-btn github"
              >
                <div className="action-circle">
                  <GithubIcon size={18} />
                </div>
                <span className="action-label">GitHub</span>
              </a>

              <a
                href="https://leetcode.com/u/Ajay_pa/"
                target="_blank"
                rel="noopener noreferrer"
                className="quick-action-btn resume"
                title="LeetCode Profile"
              >
                <div className="action-circle">
                  <FileText size={18} />
                </div>
                <span className="action-label">LeetCode</span>
              </a>
            </div>

            {/* ── Interactive Direct Message Form ── */}
            <div className="phone-form-container">
              <div className="phone-section-header">
                <MessageSquare size={13} className="text-pink-400" />
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-300">
                  Direct Message
                </span>
              </div>

              {formSent ? (
                <motion.div
                  className="phone-sent-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="success-icon-wrap">
                    <Check size={22} className="text-emerald-400" />
                  </div>
                  <h4 className="success-title">Message Delivered!</h4>
                  <p className="success-desc">
                    Thanks for reaching out! Ajay will review your note and get back to your email
                    within 24 hours.
                  </p>
                  <button
                    type="button"
                    className="send-another-btn"
                    onClick={() => {
                      setFormSent(false)
                      setFormData({ name: '', email: '', message: '' })
                    }}
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="phone-msg-form">
                  <div className="form-group">
                    <input
                      type="text"
                      className="phone-input"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="email"
                      className="phone-input"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <textarea
                      className="phone-input phone-textarea"
                      placeholder="Hi Ajay, let's talk about..."
                      rows={3}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="phone-submit-btn"
                    disabled={isSubmitting}
                  >
                    <Send size={14} />
                    <span>{isSubmitting ? 'Transmitting...' : 'Send to Phone'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* ── Metadata & Location Tag ── */}
            <div className="phone-meta-row">
              <div className="meta-item">
                <MapPin size={12} className="text-pink-400" />
                <span>Faridabad, Haryana · Remote / On-Site</span>
              </div>
              <div className="meta-item">
                <Clock size={12} className="text-cyan-400" />
                <span>+91-9821240727</span>
              </div>
            </div>

            {/* Direct Email Address Display with Copy */}
            <div className="phone-email-bar" onClick={copyEmail} title="Click to copy email">
              <span className="font-mono text-xs text-zinc-300">ajeysingh4220@gmail.com</span>
              {emailCopied ? (
                <span className="copy-badge copied">Copied!</span>
              ) : (
                <Copy size={13} className="text-zinc-400" />
              )}
            </div>
          </div>

          {/* ── iOS Style Home Indicator Bar ── */}
          <div className="phone-home-indicator" onClick={onClose} title="Click to close" />
        </motion.div>
      </div>

      {/* ── Bottom Navigation Dock ── */}
      <motion.div
        className="smartphone-bottom-dock"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          type="button"
          className="smartphone-dock-tab"
          onClick={() => onNavigateSection?.('projects')}
        >
          <span className="dock-prefix">01</span> PROJECTS
        </button>

        <button
          type="button"
          className="smartphone-dock-tab"
          onClick={() => onNavigateSection?.('experience')}
        >
          <span className="dock-prefix">02</span> EXPERIENCE
        </button>

        <button
          type="button"
          className="smartphone-dock-tab"
          onClick={() => onNavigateSection?.('about')}
        >
          <span className="dock-prefix">03</span> ABOUT
        </button>

        <button
          type="button"
          className="smartphone-dock-tab active"
          onClick={onClose}
        >
          <span className="dock-prefix">04</span> CONTACT
        </button>
      </motion.div>
    </motion.div>
  )
}
