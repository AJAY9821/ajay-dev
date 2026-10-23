import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft, Disc3 } from 'lucide-react'
import WallPegboardExperience from './WallPegboardExperience'
import WorkstationProjects from './WorkstationProjects'
import SmartphoneContact from './SmartphoneContact'
import './DeveloperRoom.css'

// Contact view synced

type SectionKey = 'projects' | 'experience' | 'about' | 'contact' | 'music' | null

interface HotspotConfig {
  key: SectionKey
  label: string
  num: string
  x: number // percentage
  y: number // percentage
  scale: number
  originX: string
  originY: string
}

const HOTSPOTS: HotspotConfig[] = [
  {
    key: 'projects',
    label: 'PROJECTS',
    num: '01',
    x: 40,
    y: 35,
    scale: 2.25,
    originX: '36%',
    originY: '36%',
  },
  {
    key: 'experience',
    label: 'EXPERIENCE',
    num: '02',
    x: 89.5,
    y: 27,
    scale: 2.15,
    originX: '89.5%',
    originY: '27%',
  },
  {
    key: 'about',
    label: 'ABOUT ME',
    num: '03',
    x: 60,
    y: 46,
    scale: 1.65,
    originX: '59%',
    originY: '48%',
  },
  {
    key: 'contact',
    label: 'CONTACT',
    num: '04',
    x: 37,
    y: 64,
    scale: 2.55,
    originX: '37%',
    originY: '64%',
  },
  {
    key: 'music',
    label: 'LO-FI AUDIO',
    num: '♪',
    x: 86,
    y: 59,
    scale: 1.75,
    originX: '86%',
    originY: '59%',
  },
]

export default function DeveloperRoom() {
  const [activeSection, setActiveSection] = useState<SectionKey>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle subtle mouse tilt
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (activeSection !== null) return // don't tilt when camera is focused on a prop
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const clientX = e.clientX - rect.left
      const clientY = e.clientY - rect.top
      const normalizedX = (clientX / rect.width - 0.5) * 2 // -1 to 1
      const normalizedY = (clientY / rect.height - 0.5) * 2

      setTilt({
        x: normalizedY * -4, // max 4deg
        y: normalizedX * 6, // max 6deg
      })

      if (!hasInteracted) setHasInteracted(true)
    },
    [activeSection, hasInteracted]
  )

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  // Escape key closes focused view & flies back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeSection !== null) {
        setActiveSection(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeSection])

  // Listen for navigation events from top Navbar
  useEffect(() => {
    const handleOpenRoomSection = (e: Event) => {
      const customEvent = e as CustomEvent<SectionKey>
      if (customEvent.detail) {
        setActiveSection(customEvent.detail)
      }
    }
    window.addEventListener('open-room-section', handleOpenRoomSection)
    return () => window.removeEventListener('open-room-section', handleOpenRoomSection)
  }, [])

  // Get current camera transform for seamless in-room flight
  const currentSpot = HOTSPOTS.find((h) => h.key === activeSection)

  const stageTransform = currentSpot
    ? currentSpot.key === 'experience'
      ? 'perspective(1400px) rotateY(-4deg) scale(2.1) translate3d(-18%, 2%, 0)'
      : currentSpot.key === 'projects'
      ? 'perspective(1400px) rotateY(5deg) rotateX(-1deg) scale(2.25) translate3d(24%, 12%, 0)'
      : currentSpot.key === 'contact'
      ? 'perspective(1400px) rotateX(14deg) rotateY(2deg) scale(2.55) translate3d(20%, -22%, 0)'
      : `scale(${currentSpot.scale}) translate3d(0, 0, 0)`
    : `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`

  const transformOrigin = currentSpot
    ? `${currentSpot.originX} ${currentSpot.originY}`
    : 'center center'

  const isExperienceFocused = activeSection === 'experience'
  const isProjectsFocused = activeSection === 'projects'
  const isContactFocused = activeSection === 'contact'
  const isFullInRoomView = isExperienceFocused || isProjectsFocused || isContactFocused

  return (
    <div
      ref={containerRef}
      className="dev-room-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Room Stage with Parallax & In-Room Camera Flight */}
      <div className="dev-room-viewport">
        <div
          className="dev-room-stage"
          style={{
            transform: stageTransform,
            transformOrigin: transformOrigin,
          }}
        >
          {/* High-definition 3D Developer Room Render */}
          <img
            src="/developer-room.jpg"
            alt="Ajay's Developer Room"
            className="dev-room-image"
          />

          {/* Ambient Room Vignette & CRT Scanlines */}
          <div
            className={`dev-room-overlay ${
              isExperienceFocused
                ? 'experience-focused'
                : isProjectsFocused
                ? 'projects-focused'
                : isContactFocused
                ? 'contact-focused'
                : ''
            }`}
          />

          {/* Subtle Miniature Badge Preview on Room Pegboard */}
          {!isFullInRoomView && (
            <div
              className="wall-lanyards-preview"
              onClick={(e) => {
                e.stopPropagation()
                setActiveSection('experience')
              }}
              title="Click to inspect Work Experience Badges"
            >
              <div className="wall-preview-strap" style={{ backgroundColor: '#b91c1c' }} />
              <div className="wall-preview-strap" style={{ backgroundColor: '#005953' }} />
              <div className="wall-preview-strap" style={{ backgroundColor: '#18181b' }} />
            </div>
          )}

          {/* Interactive Floating Diamond Hotspots */}
          {activeSection === null &&
            HOTSPOTS.map((spot) => (
              <button
                key={spot.key}
                type="button"
                className="room-hotspot"
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                onClick={() => {
                  if (spot.key === 'music') {
                    setIsPlayingAudio((prev) => !prev)
                  }
                  setActiveSection(spot.key)
                }}
                aria-label={`Open ${spot.label}`}
              >
                {spot.key === 'music' && isPlayingAudio && <span className="sound-rings" />}
                <span className="diamond-pin" />
                <span className="hotspot-label">
                  {spot.num} · {spot.label}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* ── Top Left: BACK TO ROOM BUTTON (Flies camera back out for modals) ── */}
      {activeSection !== null && !isFullInRoomView && (
        <div style={{ position: 'absolute', top: '84px', left: '36px', zIndex: 40 }}>
          <button
            type="button"
            className="badge-back-room-btn"
            style={{ position: 'static' }}
            onClick={() => {
              setActiveSection(null)
            }}
          >
            <ArrowLeft size={16} /> BACK TO THE ROOM [ESC]
          </button>
        </div>
      )}

      {/* Drag to Look Around Hint */}
      {activeSection === null && !hasInteracted && (
        <div className="room-drag-hint">
          <span>Move mouse or drag to look around</span>
        </div>
      )}

      {/* Bottom Left Identity Tag */}
      <div className="room-signature">
        <h1 className="room-sig-name">AJAY</h1>
        <div className="room-sig-meta">
          <span className="room-sig-dot" />
          <span>FULL STACK DEVELOPER · OPEN TO WORK</span>
        </div>
      </div>

      {/* Bottom Center Floating Navigation Dock */}
      {!isFullInRoomView && (
        <div className="room-dock-wrap">
          <nav className="room-dock" aria-label="Room Navigation Dock">
            {(['projects', 'experience', 'about', 'contact'] as SectionKey[]).map((sec, idx) => {
              const spot = HOTSPOTS.find((h) => h.key === sec)
              const isActive = activeSection === sec
              return (
                <button
                  key={sec}
                  type="button"
                  className={`room-dock-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection(isActive ? null : sec)
                  }}
                >
                  <span className="dock-num">0{idx + 1}</span>
                  <span>{spot?.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      )}

      {/* ===================================================================
          INTERACTIVE DOCKED VIEWS (About, Contact, Music)
          =================================================================== */}
      <AnimatePresence>
        {activeSection !== null && !isFullInRoomView && (
          <>
            <motion.div
              className="docked-surface-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSection(null)}
            />

            <motion.div
              className="docked-surface-card"
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Card Header */}
              <div className="docked-surface-header">
                <div className="docked-surface-title">
                  {activeSection === 'about' && '🤖 Developer · About Me'}
                  {activeSection === 'music' && '🎵 Smart Speaker · Lo-Fi Radio'}
                </div>
                <button
                  type="button"
                  className="docked-close-btn"
                  onClick={() => setActiveSection(null)}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Card Body by Section */}

              {activeSection === 'about' && (
                <div className="flex flex-col gap-4 text-sm text-zinc-300">
                  <p className="leading-relaxed">
                    Hey! I&apos;m <strong>Ajay</strong>, a full stack developer dedicated to building
                    ultra-fast, visually captivating, and resilient web applications. I bridge the gap
                    between high-fidelity interactive user experiences and rock-solid backend
                    architecture.
                  </p>
                  <p className="leading-relaxed text-zinc-400">
                    When I&apos;m not writing code or orchestrating microservices, you&apos;ll find me
                    tweaking developer workflows, experimenting with 3D web graphics, or diving into
                    AI agent orchestration.
                  </p>
                  <div>
                    <h5 className="font-mono text-xs uppercase tracking-wider text-pink-400 mb-2">
                      Primary Tech Stack
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'React 19',
                        'TypeScript',
                        'Next.js',
                        'Node.js',
                        'TailwindCSS',
                        'Python',
                        'PostgreSQL',
                        'Framer Motion',
                        'Docker',
                      ].map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded text-cyan-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'music' && (
                <div className="flex flex-col items-center justify-center p-4 text-center gap-3">
                  <Disc3
                    size={40}
                    className={`text-pink-400 ${isPlayingAudio ? 'animate-spin' : ''}`}
                  />
                  <div>
                    <h4 className="font-bold text-white">Lo-Fi Coding Beats Radio</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      {isPlayingAudio
                        ? 'Now Playing · Chill Synthwave & Lo-Fi Beats'
                        : 'Muted · Click to start ambient background vibes'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="mt-2 font-mono text-xs px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 hover:bg-pink-500/30 transition-all"
                  >
                    {isPlayingAudio ? 'Pause Music' : 'Play Lo-Fi Radio'}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Wall Pegboard Experience (Exact replica of Image 2) ── */}
      <AnimatePresence>
        {activeSection === 'experience' && (
          <WallPegboardExperience
            onClose={() => setActiveSection(null)}
            onNavigateSection={(sec) => setActiveSection(sec)}
          />
        )}
      </AnimatePresence>

      {/* ── Desktop Workstation Projects (Curved Ultrawide Monitor) ── */}
      <AnimatePresence>
        {activeSection === 'projects' && (
          <WorkstationProjects
            onClose={() => setActiveSection(null)}
            onNavigateSection={(sec) => setActiveSection(sec)}
          />
        )}
      </AnimatePresence>

      {/* ── Desk Smartphone Contact (Modern Mobile OS Device) ── */}
      <AnimatePresence>
        {activeSection === 'contact' && (
          <SmartphoneContact
            onClose={() => setActiveSection(null)}
            onNavigateSection={(sec) => setActiveSection(sec)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

