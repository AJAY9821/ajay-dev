import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import './TerminalLoader.css'

interface TerminalLoaderProps {
  onComplete: () => void
}

interface LogEntry {
  triggerPct: number
  text: string
  hasCheck?: boolean
}

const LOGS: LogEntry[] = [
  { triggerPct: 6, text: 'dataset: MERN stack, Node.js, Express, React, MongoDB (16 modules)' },
  { triggerPct: 28, text: 'compiling REST API endpoints & JWT authentication modules', hasCheck: true },
  { triggerPct: 52, text: 'optimizing MongoDB schemas, Socket.io & enterprise HRMS engine', hasCheck: true },
  { triggerPct: 76, text: 'loading 3D developer room environment & asset shaders', hasCheck: true },
  { triggerPct: 94, text: 'environment synchronized: Ajay Singh portfolio ready', hasCheck: true },
]

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const TOTAL_BLOCKS = 36

export default function TerminalLoader({ onComplete }: TerminalLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [spinnerIdx, setSpinnerIdx] = useState(0)
  const isCompletedRef = useRef(false)

  // Skip handler
  const handleSkip = () => {
    if (isCompletedRef.current) return
    isCompletedRef.current = true
    onComplete()
  }

  // Escape key handler
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Braille spinner animation
  useEffect(() => {
    const timer = setInterval(() => {
      setSpinnerIdx((prev) => (prev + 1) % SPINNER_FRAMES.length)
    }, 75)
    return () => clearInterval(timer)
  }, [])

  // Progress animation runner
  useEffect(() => {
    let animationFrameId: number
    const startTime = performance.now()
    const totalDuration = 2700 // ~2.7s total smooth authentic loader

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const rawPct = Math.min(elapsed / totalDuration, 1)

      // Natural ease-out curve with a micro hesitation around 85%
      let easedPct: number
      if (rawPct < 0.8) {
        easedPct = (rawPct / 0.8) * 0.82
      } else if (rawPct < 0.9) {
        easedPct = 0.82 + ((rawPct - 0.8) / 0.1) * 0.08
      } else {
        easedPct = 0.9 + ((rawPct - 0.9) / 0.1) * 0.1
      }

      const currentProgress = Math.min(Math.round(easedPct * 100), 100)
      setProgress(currentProgress)

      if (rawPct < 1) {
        animationFrameId = requestAnimationFrame(updateProgress)
      } else {
        setTimeout(() => {
          if (!isCompletedRef.current) {
            isCompletedRef.current = true
            onComplete()
          }
        }, 220)
      }
    }

    animationFrameId = requestAnimationFrame(updateProgress)
    return () => cancelAnimationFrame(animationFrameId)
  }, [onComplete])

  // Active blocks for progress bar
  const activeBlocks = Math.floor((progress / 100) * TOTAL_BLOCKS)

  // Find currently active log entry
  let activeLogIdx = -1
  for (let i = LOGS.length - 1; i >= 0; i--) {
    if (progress >= LOGS[i].triggerPct) {
      activeLogIdx = i
      break
    }
  }

  // Chunks and throughput dynamic values
  const currentChunk = Math.min(Math.floor((progress / 100) * 142), 142)
  const throughput = (11.2 + (progress / 100) * 7.4).toFixed(1)
  const latency = Math.max(14, Math.round(92 - (progress / 100) * 78))

  return (
    <motion.div
      className="terminal-loader-overlay"
      role="status"
      aria-label="Initializing portfolio environment"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 0.985,
        filter: 'blur(4px)',
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      {/* Skip Button */}
      <button
        type="button"
        className="loader-skip-btn"
        onClick={handleSkip}
        aria-label="Skip initialization animation"
      >
        Skip <kbd>ESC</kbd>
      </button>

      {/* Terminal Window Container */}
      <div className="terminal-window">
        {/* Terminal Header Chrome */}
        <div className="terminal-window-header">
          <div className="terminal-window-dots">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <div className="terminal-window-title">
            ajay@workstation: ~/portfolio — zsh (x86_64)
          </div>
          <div className="terminal-window-meta">
            <span className="terminal-live-dot" />
            <span className="terminal-live-text">ONLINE</span>
          </div>
        </div>

        {/* Terminal Window Body */}
        <div className="terminal-window-body">
          {/* Command Prompt Line */}
          <p className="loader-prompt">
            <span className="loader-prompt-host">ajay@workstation</span>
            <span className="loader-prompt-colon">:</span>
            <span className="loader-prompt-path">~</span>
            <span className="loader-prompt-symbol">$</span>
            <span className="loader-prompt-cmd">npx</span>
            <span className="loader-prompt-flag">ajay-os</span>
            <span className="loader-prompt-flag">--profile</span>
            <span className="loader-prompt-target">fullstack</span>
            <span className="loader-prompt-flag">--env</span>
            <span className="loader-prompt-arg">./prod</span>
            <span className="loader-prompt-cursor">█</span>
          </p>

          {/* Real Runtime Telemetry Matrix (Replacing awkward SVG line) */}
          <div className="loader-matrix-box">
            <div className="loader-matrix-line border-top">
              ┌── RUNTIME ENVIRONMENT ─────────────────────────────────────┐
            </div>
            <div className="loader-matrix-content">
              <div className="matrix-row">
                <span className="matrix-label">TARGET   :</span>
                <span className="matrix-val-cyan">Ajay Singh · Full Stack & Backend Developer</span>
              </div>
              <div className="matrix-row">
                <span className="matrix-label">CORE     :</span>
                <span className="matrix-val">Node.js · Express · React 19 · MongoDB · Three.js</span>
              </div>
              <div className="matrix-row">
                <span className="matrix-label">SYSTEM   :</span>
                <span className="matrix-val-green">Enterprise HRMS · AI Resume Parser · REST APIs · RBAC</span>
              </div>
              <div className="matrix-row">
                <span className="matrix-label">BUILD    :</span>
                <span className="matrix-val-dim">142/142 modules synchronized · Vite 6.0 production</span>
              </div>
            </div>
            <div className="loader-matrix-line border-bottom">
              └────────────────────────────────────────────────────────────┘
            </div>
          </div>

          {/* Terminal Log Feed with Active Spinner */}
          <div className="loader-logs">
            {LOGS.map((log, idx) => {
              if (progress < log.triggerPct) return null
              const isRunning = idx === activeLogIdx && progress < 100

              return (
                <div key={idx} className="loader-log-line">
                  {isRunning ? (
                    <>
                      <span className="loader-spinner">{SPINNER_FRAMES[spinnerIdx]}</span>
                      <span className="loader-tag-run">[ RUN ]</span>
                    </>
                  ) : (
                    <span className="loader-tag-ok">[ OK ]</span>
                  )}
                  <span className="loader-log-text">{log.text}</span>
                  {!isRunning && log.hasCheck && <span className="loader-log-check">✓</span>}
                </div>
              )
            })}
          </div>

          {/* Live Metrics Ticker */}
          <p className="loader-ticker">
            module <span className="loader-ticker-active">{currentChunk}/142</span> ·{' '}
            <span className="loader-ticker-active">{throughput} MB/s</span> · latency{' '}
            <span className="loader-ticker-active">{latency}ms</span> · heap{' '}
            <span className="loader-ticker-active">46.8 MB</span>
          </p>

          {/* Segmented Block Progress Bar */}
          <div className="loader-progress-wrap">
            <div className="loader-progress-header">
              <span className="loader-progress-title">
                {progress >= 100 ? 'SYSTEM READY' : 'INITIALIZING WORKSPACE'}
              </span>
              <span className="loader-progress-pct">{progress}%</span>
            </div>
            <div className="loader-progress-blocks">
              {Array.from({ length: TOTAL_BLOCKS }).map((_, index) => (
                <div
                  key={index}
                  className={`loader-block ${index < activeBlocks ? 'filled' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
