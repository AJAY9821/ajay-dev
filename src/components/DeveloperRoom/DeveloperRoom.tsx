import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Disc3, X } from 'lucide-react'
import gsap from 'gsap'
import WallPegboardExperience from './WallPegboardExperience'
import WorkstationProjects from './WorkstationProjects'
import SmartphoneContact from './SmartphoneContact'
import AboutDossierExperience from './AboutDossierExperience'
import './DeveloperRoom.css'

export type SectionKey = 'projects' | 'experience' | 'about' | 'contact' | 'music' | null

interface HotspotConfig {
  key: SectionKey
  label: string
  num: string
  x: number // percentage
  y: number // percentage
}

const HOTSPOTS: HotspotConfig[] = [
  {
    key: 'projects',
    label: 'PROJECTS',
    num: '01',
    x: 40,
    y: 35,
  },
  {
    key: 'experience',
    label: 'EXPERIENCE',
    num: '02',
    x: 89.5,
    y: 27,
  },
  {
    key: 'about',
    label: 'ABOUT ME',
    num: '03',
    x: 60,
    y: 46,
  },
  {
    key: 'contact',
    label: 'CONTACT',
    num: '04',
    x: 37,
    y: 64,
  },
  {
    key: 'music',
    label: 'LO-FI AUDIO',
    num: '♪',
    x: 86,
    y: 59,
  },
]

// Pure 3D camera coordinates with fixed center-center transform origin
interface CameraCoordinates {
  scale: number
  xPercent: number
  yPercent: number
  rotateX: number
  rotateY: number
}

const CAMERA_TARGETS: Record<string, CameraCoordinates> = {
  idle: {
    scale: 1.08,
    xPercent: 0,
    yPercent: 0,
    rotateX: 0,
    rotateY: 0,
  },
  projects: {
    scale: 2.25,
    xPercent: 38,
    yPercent: 26,
    rotateX: -1,
    rotateY: 5,
  },
  experience: {
    scale: 2.15,
    xPercent: -58,
    yPercent: 24,
    rotateX: 1,
    rotateY: -4,
  },
  about: {
    scale: 1.82,
    xPercent: -8,
    yPercent: 2,
    rotateX: 1,
    rotateY: -2,
  },
  contact: {
    scale: 2.55,
    xPercent: 36,
    yPercent: -38,
    rotateX: 12,
    rotateY: 2,
  },
  music: {
    scale: 2.05,
    xPercent: -52,
    yPercent: -12,
    rotateX: 2,
    rotateY: -5,
  },
}

export default function DeveloperRoom() {
  const [activeSection, setActiveSection] = useState<SectionKey>(null)
  const [displayedSection, setDisplayedSection] = useState<SectionKey>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const isTransitioningRef = useRef(false)
  const activeSectionRef = useRef<SectionKey>(null)
  activeSectionRef.current = activeSection

  // Fly to section with continuous camera physics
  const flyToSection = useCallback((targetSection: SectionKey) => {
    if (isTransitioningRef.current || !targetSection) return
    if (targetSection === activeSectionRef.current) return

    isTransitioningRef.current = true
    const fromSection = activeSectionRef.current
    setActiveSection(targetSection)

    const targetCoords = CAMERA_TARGETS[targetSection] || CAMERA_TARGETS.idle
    const isCrossFlight = fromSection !== null
    const flightDuration = isCrossFlight ? 0.6 : 0.65

    const runFlight = () => {
      if (!stageRef.current) return

      // GSAP hardware-accelerated 3D camera flight - clean uninterrupted 60fps
      gsap.to(stageRef.current, {
        scale: targetCoords.scale,
        xPercent: targetCoords.xPercent,
        yPercent: targetCoords.yPercent,
        rotationX: targetCoords.rotateX,
        rotationY: targetCoords.rotateY,
        transformPerspective: 1200,
        duration: flightDuration,
        ease: 'power2.inOut',
        overwrite: 'auto',
        onComplete: () => {
          // Mount the interactive interface on camera landing: zero frame-drop!
          setDisplayedSection(targetSection)
          isTransitioningRef.current = false
        },
      })
    }

    if (displayedSection !== null) {
      // Step 1: Smoothly dissolve current overlay first
      setDisplayedSection(null)
      setTimeout(runFlight, 120)
    } else {
      // Direct takeoff from room view
      runFlight()
    }
  }, [displayedSection])

  // Fly camera back out to default wide isometric view
  const flyBackToRoom = useCallback(() => {
    if (isTransitioningRef.current || activeSectionRef.current === null) return
    isTransitioningRef.current = true

    // Step 1: Dissolve overlay immediately
    setDisplayedSection(null)

    // Step 2: Smooth camera pull-back
    setTimeout(() => {
      if (!stageRef.current) return

      gsap.to(stageRef.current, {
        scale: CAMERA_TARGETS.idle.scale,
        xPercent: CAMERA_TARGETS.idle.xPercent,
        yPercent: CAMERA_TARGETS.idle.yPercent,
        rotationX: 0,
        rotationY: 0,
        transformPerspective: 1200,
        duration: 0.65,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete: () => {
          setActiveSection(null)
          isTransitioningRef.current = false
        },
      })
    }, 100)
  }, [])

  // Handle subtle mouse tilt when at wide room view
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (activeSectionRef.current !== null || isTransitioningRef.current) return
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect || !stageRef.current) return

      const clientX = e.clientX - rect.left
      const clientY = e.clientY - rect.top
      const normalizedX = (clientX / rect.width - 0.5) * 2 // -1 to 1
      const normalizedY = (clientY / rect.height - 0.5) * 2

      gsap.to(stageRef.current, {
        scale: CAMERA_TARGETS.idle.scale,
        rotationX: normalizedY * -2.8,
        rotationY: normalizedX * 4.2,
        duration: 0.6,
        ease: 'power1.out',
        overwrite: 'auto',
      })

      if (!hasInteracted) setHasInteracted(true)
    },
    [hasInteracted]
  )

  const handleMouseLeave = () => {
    if (activeSectionRef.current === null && !isTransitioningRef.current && stageRef.current) {
      gsap.to(stageRef.current, {
        scale: CAMERA_TARGETS.idle.scale,
        rotationX: 0,
        rotationY: 0,
        duration: 0.7,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }
  }

  // Ensure stage mounts with overscan scale to cover 100% of viewport without black edges
  useEffect(() => {
    if (stageRef.current) {
      gsap.set(stageRef.current, {
        scale: CAMERA_TARGETS.idle.scale,
        xPercent: 0,
        yPercent: 0,
        rotationX: 0,
        rotationY: 0,
        transformPerspective: 1200,
        transformOrigin: '50% 50%',
      })
    }
  }, [])

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeSectionRef.current !== null) {
        flyBackToRoom()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [flyBackToRoom])

  // External open-room-section listener (e.g. from navbar)
  useEffect(() => {
    const handleOpenRoomSection = (e: Event) => {
      const customEvent = e as CustomEvent<SectionKey>
      if (customEvent.detail) {
        flyToSection(customEvent.detail)
      }
    }
    window.addEventListener('open-room-section', handleOpenRoomSection)
    return () => window.removeEventListener('open-room-section', handleOpenRoomSection)
  }, [flyToSection])

  const isExperienceFocused = activeSection === 'experience'
  const isProjectsFocused = activeSection === 'projects'
  const isContactFocused = activeSection === 'contact'
  const isAboutFocused = activeSection === 'about'
  const isFullInRoomView = isExperienceFocused || isProjectsFocused || isContactFocused || isAboutFocused

  return (
    <div
      ref={containerRef}
      className="dev-room-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Room Stage with Parallax & In-Room Camera Flight */}
      <div className="dev-room-viewport">
        <div ref={stageRef} className="dev-room-stage">
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
                : isAboutFocused
                ? 'about-focused'
                : ''
            }`}
          />

          {/* Subtle Miniature Badge Preview on Room Pegboard */}
          {!isFullInRoomView && (
            <div
              className="wall-lanyards-preview"
              onClick={(e) => {
                e.stopPropagation()
                flyToSection('experience')
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
                  flyToSection(spot.key)
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

      {/* Drag to Look Around Hint */}
      {activeSection === null && !hasInteracted && (
        <div className="room-drag-hint">
          <span>Move mouse or drag to look around</span>
        </div>
      )}

      {/* Bottom Left Identity Tag */}
      <div className="room-signature">
        <h1 className="room-sig-name">AJAY SINGH</h1>
        <div className="room-sig-meta">
          <span className="room-sig-dot" />
          <span>MERN STACK &amp; BACKEND DEVELOPER · OPEN TO WORK</span>
        </div>
      </div>

      {/* Bottom Center Floating Navigation Dock (shown at home and for non-full views) */}
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
                    if (isActive) {
                      flyBackToRoom()
                    } else {
                      flyToSection(sec)
                    }
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
          INTERACTIVE IN-ROOM VIEWS (Orchestrated by Camera Flight)
          =================================================================== */}

      {/* ── Wall Pegboard Experience (Badges on right wall) ── */}
      <AnimatePresence mode="wait">
        {displayedSection === 'experience' && (
          <WallPegboardExperience
            key="experience"
            onClose={flyBackToRoom}
            onNavigateSection={flyToSection}
          />
        )}
      </AnimatePresence>

      {/* ── Desktop Workstation Projects (Curved Ultrawide Monitor) ── */}
      <AnimatePresence mode="wait">
        {displayedSection === 'projects' && (
          <WorkstationProjects
            key="projects"
            onClose={flyBackToRoom}
            onNavigateSection={flyToSection}
          />
        )}
      </AnimatePresence>

      {/* ── Desk Smartphone Contact (Modern Mobile OS Device) ── */}
      <AnimatePresence mode="wait">
        {displayedSection === 'contact' && (
          <SmartphoneContact
            key="contact"
            onClose={flyBackToRoom}
            onNavigateSection={flyToSection}
          />
        )}
      </AnimatePresence>

      {/* ── About Dossier Experience (Terminal Station on Desk) ── */}
      <AnimatePresence mode="wait">
        {displayedSection === 'about' && (
          <AboutDossierExperience
            key="about"
            onClose={flyBackToRoom}
            onNavigateSection={flyToSection}
          />
        )}
      </AnimatePresence>

      {/* ── Lo-Fi Radio Player ── */}
      <AnimatePresence mode="wait">
        {displayedSection === 'music' && (
          <>
            <motion.div
              className="docked-surface-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={flyBackToRoom}
            />

            <motion.div
              className="docked-surface-card"
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="docked-surface-header">
                <div className="docked-surface-title">
                  🎵 Smart Speaker · Lo-Fi Radio
                </div>
                <button
                  type="button"
                  className="docked-close-btn"
                  onClick={flyBackToRoom}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

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
                  className="mt-2 font-mono text-xs px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 hover:bg-pink-500/30 transition-all cursor-pointer"
                >
                  {isPlayingAudio ? 'Pause Music' : 'Play Lo-Fi Radio'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
