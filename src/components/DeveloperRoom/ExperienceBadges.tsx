import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import './ExperienceBadges.css'

export interface ExperienceBadgeData {
  id: string
  company: string
  role: string
  period: string
  strapColor: string
  accentColor: string
  avatarUrl?: string
  barcodeId: string
  bullets: string[]
}

const BADGES: ExperienceBadgeData[] = [
  {
    id: 'geo-tv',
    company: 'GEO TV Network',
    role: 'System Developer and Analyst',
    period: 'SEP 2025 TO PRESENT',
    strapColor: '#b91c1c', // Crimson
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
    company: 'Sehatlings AI',
    role: 'Founding Engineer',
    period: 'JUL 2024 TO PRESENT',
    strapColor: '#0f766e', // Teal
    accentColor: '#14b8a6',
    barcodeId: '849204918231',
    bullets: [
      'Medical platform on Claude 3.5 for biomarker extraction and pathology triage, 70% less manual review.',
      'RAG clinical engine that turns lab data into actionable health roadmaps and specialist referrals.',
      'Architected end-to-end HIPAA-compliant clinician workspace with sub-100ms render speeds.',
    ],
  },
  {
    id: 'loreal',
    company: "L'Oréal Paris",
    role: 'Business Planning Analyst',
    period: 'APR 2024 TO JUL 2024',
    strapColor: '#18181b', // Dark Slate
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

// Render realistic barcode lines
function BarcodeSVG() {
  const bars = [
    2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 2, 1, 2, 4, 1, 3, 1, 2,
    1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4,
  ]
  let currentX = 5
  return (
    <svg className="badge-barcode-svg" viewBox="0 0 140 26">
      {bars.map((w, idx) => {
        const x = currentX
        currentX += w + (idx % 2 === 0 ? 1.5 : 2)
        if (currentX > 135) return null
        return (
          <rect
            key={idx}
            x={x}
            y={0}
            width={w * 0.75}
            height={26}
            fill="#1e293b"
          />
        )
      })}
    </svg>
  )
}

interface ExperienceBadgesProps {
  onClose: () => void
}

export default function ExperienceBadges({ onClose }: ExperienceBadgesProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const handleNext = useCallback(() => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % BADGES.length)
  }, [])

  const handlePrev = useCallback(() => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + BADGES.length) % BADGES.length)
  }, [])

  // Keyboard navigation: Left/Right arrows cycle, Space/Enter flips, Escape closes
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
      className="badges-stage-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top Left: Back to the Room button */}
      <button
        type="button"
        className="badge-back-room-btn"
        onClick={onClose}
        aria-label="Back to the room"
      >
        <ArrowLeft size={16} /> BACK TO THE ROOM
      </button>

      {/* Main Pegboard Section */}
      <div className="badges-pegboard">
        <div className="badges-carousel">
          {BADGES.map((badge, index) => {
            let stateClass = 'state-hidden'
            if (index === currentIndex) {
              stateClass = 'state-active'
            } else if (
              index ===
              (currentIndex - 1 + BADGES.length) % BADGES.length
            ) {
              stateClass = 'state-prev'
            } else if (index === (currentIndex + 1) % BADGES.length) {
              stateClass = 'state-next'
            }

            const isCurrent = index === currentIndex

            return (
              <div
                key={badge.id}
                className={`badge-holder ${stateClass}`}
                onClick={() => {
                  if (isCurrent) {
                    setIsFlipped(!isFlipped)
                  } else if (
                    index ===
                    (currentIndex - 1 + BADGES.length) % BADGES.length
                  ) {
                    handlePrev()
                  } else if (index === (currentIndex + 1) % BADGES.length) {
                    handleNext()
                  }
                }}
              >
                {/* Wall Peg */}
                <div className="badge-peg" />

                {/* Hanging Lanyard Strap */}
                <div
                  className="badge-strap"
                  style={{ backgroundColor: badge.strapColor }}
                />

                {/* Metal Badge Clip */}
                <div className="badge-clip" />

                {/* 3D Flip Card */}
                <div
                  className={`badge-card-flipper ${
                    isCurrent && isFlipped ? 'flipped' : ''
                  }`}
                >
                  {/* Slot Cutout */}
                  <div className="badge-slot" />

                  {/* FRONT FACE */}
                  <div className="badge-face badge-front">
                    <div
                      className="badge-header-band"
                      style={{ backgroundColor: badge.strapColor }}
                    >
                      <h3 className="badge-company-title">{badge.company}</h3>
                    </div>

                    <div className="badge-body">
                      {/* Stylized Developer Avatar */}
                      <div className="badge-avatar-wrap">
                        <img
                          src="/developer-room.jpg"
                          alt="Ajay Avatar"
                          className="badge-avatar-img"
                          style={{
                            objectPosition: '59% 46%',
                            transform: 'scale(3.2)',
                          }}
                        />
                      </div>

                      <div className="badge-role-title">{badge.role}</div>
                      <div className="badge-date-sub">{badge.period}</div>

                      <div className="badge-barcode-wrap">
                        <BarcodeSVG />
                      </div>
                    </div>

                    <div className="badge-flip-hint">CLICK TO FLIP</div>
                  </div>

                  {/* BACK FACE */}
                  <div className="badge-face badge-back">
                    <div className="badge-back-top">
                      <h3
                        className="badge-back-company"
                        style={{ color: badge.strapColor }}
                      >
                        {badge.company}
                      </h3>
                      <div className="badge-back-role">{badge.role}</div>
                      <div className="badge-back-date">{badge.period}</div>
                      <div
                        className="badge-back-divider"
                        style={{ backgroundColor: badge.strapColor }}
                      />

                      <ul className="badge-back-bullets">
                        {badge.bullets.map((bullet, bIdx) => (
                          <li
                            key={bIdx}
                            className="badge-back-bullet"
                            style={
                              {
                                '--bullet-color': badge.strapColor,
                              } as React.CSSProperties
                            }
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="badge-back-flip">CLICK TO FLIP BACK</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Carousel Navigation Bar (< 01 / 05 >) */}
        <div className="badge-nav-bar" role="group" aria-label="Experience Badges">
          <button
            type="button"
            className="badge-nav-arrow"
            onClick={handlePrev}
            aria-label="Previous badge"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="badge-nav-count">
            0{currentIndex + 1} / 0{BADGES.length}
          </span>
          <button
            type="button"
            className="badge-nav-arrow"
            onClick={handleNext}
            aria-label="Next badge"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
