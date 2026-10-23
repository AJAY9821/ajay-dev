import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import './WallPegboardExperience.css'

export interface WallCardData {
  id: string
  company: string
  role: string
  period: string
  strapColor: string
  accentColor: string
  barcodeId: string
  bullets: string[]
}

const EXPERIENCE_CARDS: WallCardData[] = [
  {
    id: 'geo-tv',
    company: 'GEO TV Network',
    role: 'System Developer and Analyst',
    period: 'SEP 2025 TO PRESENT',
    strapColor: '#b91c1c', // Crimson Red (matching Image 2)
    accentColor: '#dc2626',
    barcodeId: '984021948201',
    bullets: [
      'RAG search over 1,000+ scripts on Qdrant, cutting retrieval time by 70%.',
      'DramaGPT: the C-suite asks production data questions in plain English; decisions 3x faster.',
      'Automated metadata ingestion pipelines for multi-format video assets.',
    ],
  },
  {
    id: 'sehatlings',
    company: 'Sehatlings',
    role: 'Founding Engineer',
    period: 'JUL 2024 TO PRESENT',
    strapColor: '#005953', // Deep Teal (matching Image 2)
    accentColor: '#0d9488',
    barcodeId: '849204918231',
    bullets: [
      'Medical platform on Claude 3.5 for biomarker extraction & pathology triage, 70% less manual review.',
      'RAG clinical engine that turns lab data into actionable health roadmaps & specialist referrals.',
      'Architected end-to-end HIPAA-compliant clinician workspace with sub-100ms render speeds.',
    ],
  },
  {
    id: 'loreal',
    company: "L'Oréal Paris",
    role: 'Business Planning Analyst',
    period: 'APR 2024 TO JUL 2024',
    strapColor: '#18181b', // Dark Charcoal / Black (matching Image 2)
    accentColor: '#eab308',
    barcodeId: '749102849102',
    bullets: [
      'Cut sales reporting from several days to same-day with an automated daily reporting engine.',
      'Unified 3 to 4 fragmented data sources into one standardized high-performance pipeline.',
      'Eliminated manual spreadsheet reconciliation errors with automated data validation.',
    ],
  },
  {
    id: 'nielseniq',
    company: 'NielsenIQ',
    role: 'Data Quality Analyst',
    period: 'SEP 2023 TO SEP 2024',
    strapColor: '#1d4ed8', // Royal Blue
    accentColor: '#3b82f6',
    barcodeId: '650192849182',
    bullets: [
      'Automated statistical validation in Power Query to catch bias and outliers across 500k+ rows.',
      'Built live KPI dashboards for dataset health, cutting overall validation turnaround time by 40%.',
      'Orchestrated automated alerting workflows for immediate pipeline schema mismatch detection.',
    ],
  },
  {
    id: 'techit',
    company: 'TechIT Solutions',
    role: 'Full Stack Tech Lead',
    period: 'DEC 2022 TO JUN 2023',
    strapColor: '#6d28d9', // Deep Purple
    accentColor: '#8b5cf6',
    barcodeId: '540192837492',
    bullets: [
      'Real-time edge threat detection using YOLO computer vision models with sub-second latency.',
      'Event-driven instant alerts via Pushover API, completely replacing manual dispatch monitoring.',
      'Led 5-engineer team from prototyping to production rollout on distributed Kubernetes clusters.',
    ],
  },
]

function BarcodeSVG() {
  const bars = [
    2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 2, 1, 2, 4, 1, 3, 1, 2,
    1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4,
  ]
  let currentX = 5
  return (
    <svg className="peg-barcode-svg" viewBox="0 0 140 24">
      {bars.map((w, idx) => {
        const x = currentX
        currentX += w + (idx % 2 === 0 ? 1.4 : 1.8)
        if (currentX > 135) return null
        return (
          <rect
            key={idx}
            x={x}
            y={0}
            width={w * 0.72}
            height={24}
            fill="#1e293b"
          />
        )
      })}
    </svg>
  )
}

interface WallPegboardExperienceProps {
  onClose: () => void
  onNavigateSection?: (section: 'projects' | 'about' | 'contact') => void
}

export default function WallPegboardExperience({
  onClose,
  onNavigateSection,
}: WallPegboardExperienceProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const handleNext = useCallback(() => {
    setIsFlipped(false)
    setActiveIndex((prev) => (prev + 1) % EXPERIENCE_CARDS.length)
  }, [])

  const handlePrev = useCallback(() => {
    setIsFlipped(false)
    setActiveIndex((prev) => (prev - 1 + EXPERIENCE_CARDS.length) % EXPERIENCE_CARDS.length)
  }, [])

  // Keyboard navigation: Left/Right arrows, Space/Enter to flip, Escape to close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        setIsFlipped((prev) => !prev)
      } else if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleNext, handlePrev, onClose])

  return (
    <motion.div
      className="wall-pegboard-stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── Top Bar: Back to Room & Options ── */}
      <div className="pegboard-top-bar">
        <button
          type="button"
          className="pegboard-back-btn"
          onClick={onClose}
          aria-label="Back to the room"
        >
          <ArrowLeft size={15} /> BACK TO THE ROOM [ESC]
        </button>

        <div className="pegboard-top-options">
          <button
            type="button"
            className="pegboard-option-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* ── Main Pegboard Assembly ── */}
      <div className="pegboard-center-wrap">
        {/* Overhead Slim Lamp Fixture (matching room render) */}
        <div className="pegboard-lamp">
          <div className="pegboard-lamp-bar">
            <span className="pegboard-lamp-bracket left" />
            <span className="pegboard-lamp-bracket right" />
          </div>
          <div className="pegboard-lamp-beam" />
        </div>

        {/* Industrial Dark Matte Pegboard */}
        <motion.div
          className="pegboard-board"
          initial={{
            scale: 0.9,
            opacity: 0,
            y: 12,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
          }}
          exit={{
            scale: 0.9,
            opacity: 0,
            y: 12,
          }}
          transition={{
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Hanging Cards Track */}
          <div className="pegboard-track">
            {EXPERIENCE_CARDS.map((card, idx) => {
              const offset = idx - activeIndex
              const isCurrent = idx === activeIndex

              let xPos = 0
              let zPos = 0
              let rotY = 0
              let scaleVal = 1
              let opacityVal = 1
              let zIndexVal = 10

              if (offset === 0) {
                // Active Card: in front, straight on
                xPos = 0
                zPos = 40
                rotY = 0
                scaleVal = 1
                opacityVal = 1
                zIndexVal = 20
              } else if (offset === 1) {
                // Next Card 1: shifted right, slightly tilted in 3D perspective
                xPos = 245
                zPos = -10
                rotY = -8
                scaleVal = 0.95
                opacityVal = 0.95
                zIndexVal = 15
              } else if (offset === 2) {
                // Next Card 2: shifted further right
                xPos = 475
                zPos = -25
                rotY = -12
                scaleVal = 0.9
                opacityVal = 0.85
                zIndexVal = 10
              } else if (offset === -1) {
                // Prev Card 1: shifted left
                xPos = -245
                zPos = -10
                rotY = 8
                scaleVal = 0.95
                opacityVal = 0.95
                zIndexVal = 15
              } else if (offset === -2) {
                // Prev Card 2: shifted further left
                xPos = -475
                zPos = -25
                rotY = 12
                scaleVal = 0.9
                opacityVal = 0.85
                zIndexVal = 10
              } else {
                // Far off
                const direction = offset > 0 ? 1 : -1
                xPos = direction * 650
                zPos = -60
                rotY = 0
                scaleVal = 0.7
                opacityVal = 0
                zIndexVal = 2
              }

              return (
                <motion.div
                  key={card.id}
                  className={`peg-badge-holder ${isCurrent ? 'active' : ''}`}
                  style={{
                    zIndex: zIndexVal,
                  }}
                  initial={{
                    x: xPos,
                    z: zPos,
                    rotateY: rotY,
                    scale: scaleVal,
                    opacity: 0,
                    rotateZ: 0,
                  }}
                  animate={{
                    x: xPos,
                    z: zPos,
                    rotateY: rotY,
                    scale: scaleVal,
                    opacity: opacityVal,
                    rotateZ: isCurrent ? [0, 1.8, -1.2, 0.5, 0] : [0, 1.2, -0.6, 0],
                  }}
                  transition={{
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => {
                    if (isCurrent) {
                      setIsFlipped(!isFlipped)
                    } else {
                      setIsFlipped(false)
                      setActiveIndex(idx)
                    }
                  }}
                >
                  {/* Metal Wall Peg plugged into pegboard hole */}
                  <div className="peg-hook" />

                  {/* Hanging Fabric Lanyard Ribbon */}
                  <div
                    className="peg-strap"
                    style={{ backgroundColor: card.strapColor }}
                  />

                  {/* Metallic Badge Clip */}
                  <div className="peg-clip" />

                  {/* 3D Flip Card */}
                  <div
                    className={`peg-card-flipper ${
                      isCurrent && isFlipped ? 'flipped' : ''
                    }`}
                  >
                    {/* Punch slot cutout at top of card */}
                    <div className="peg-card-slot" />

                    {/* FRONT FACE OF ID BADGE */}
                    <div className="peg-card-face peg-card-front">
                      <div
                        className="peg-card-band"
                        style={{ backgroundColor: card.strapColor }}
                      >
                        <h4 className="peg-company-title">{card.company}</h4>
                      </div>

                      <div className="peg-card-body">
                        {/* Avatar Headshot */}
                        <div className="peg-avatar-wrap">
                          <img
                            src="/ajay-avatar.jpg"
                            alt="Ajay"
                            className="peg-avatar-img"
                          />
                        </div>

                        {/* Role & Period */}
                        <div className="peg-role-title">{card.role}</div>
                        <div className="peg-date-sub">{card.period}</div>

                        {/* Barcode SVG */}
                        <BarcodeSVG />
                      </div>

                      {/* Click to Flip hint */}
                      <div className="peg-flip-hint">CLICK TO FLIP</div>
                    </div>

                    {/* BACK FACE (EXPERIENCE BULLETS) */}
                    <div className="peg-card-face peg-card-back">
                      <div>
                        <h4
                          className="peg-back-company"
                          style={{ color: card.strapColor }}
                        >
                          {card.company}
                        </h4>
                        <div className="peg-back-role">{card.role}</div>
                        <div className="peg-back-date">{card.period}</div>
                        <div
                          className="peg-back-divider"
                          style={{ backgroundColor: card.strapColor }}
                        />

                        <ul className="peg-back-bullets">
                          {card.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="peg-back-bullet">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="peg-back-flip">CLICK TO FLIP BACK</div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Pegboard Bottom Organizer Shelf (matching room render) */}
          <div className="pegboard-shelf">
            <div className="pegboard-shelf-lip" />
            <span className="pegboard-shelf-pin" />
            <span className="pegboard-shelf-pin" />
            <span className="pegboard-shelf-pin" />
            <span className="pegboard-shelf-pin" />
          </div>
        </motion.div>

        {/* ── Carousel Pagination (< 01 / 05 >) ── */}
        <motion.div
          className="pegboard-nav-dock"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 16, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            type="button"
            className="pegboard-nav-arrow"
            onClick={handlePrev}
            aria-label="Previous badge"
          >
            <ChevronLeft size={17} />
          </button>
          <span className="pegboard-nav-count">
            0{activeIndex + 1} / 0{EXPERIENCE_CARDS.length}
          </span>
          <button
            type="button"
            className="pegboard-nav-arrow"
            onClick={handleNext}
            aria-label="Next badge"
          >
            <ChevronRight size={17} />
          </button>
        </motion.div>
      </div>

      {/* ── Bottom Navigation Dock ── */}
      <motion.div
        className="pegboard-bottom-dock"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          type="button"
          className="pegboard-dock-tab"
          onClick={() => onNavigateSection?.('projects')}
        >
          <span className="dock-prefix">01</span> PROJECTS
        </button>

        <button
          type="button"
          className="pegboard-dock-tab active"
          onClick={onClose}
        >
          <span className="dock-prefix">02</span> EXPERIENCE
        </button>

        <button
          type="button"
          className="pegboard-dock-tab"
          onClick={() => onNavigateSection?.('about')}
        >
          <span className="dock-prefix">03</span> ABOUT
        </button>

        <button
          type="button"
          className="pegboard-dock-tab"
          onClick={() => onNavigateSection?.('contact')}
        >
          <span className="dock-prefix">04</span> CONTACT
        </button>
      </motion.div>
    </motion.div>
  )
}
