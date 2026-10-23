import { useEffect, useState, useRef, useMemo } from 'react'
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
  { triggerPct: 8, text: 'dataset: MERN stack, Node.js, Express, React, MongoDB (16 modules)' },
  { triggerPct: 30, text: 'compiling REST API endpoints & JWT authentication modules', hasCheck: true },
  { triggerPct: 52, text: 'optimizing MongoDB schemas, Socket.io & Amazon SES pipeline', hasCheck: true },
  { triggerPct: 75, text: 'loading 3D developer room environment & asset shaders', hasCheck: true },
  { triggerPct: 94, text: 'environment synchronized: Ajay Singh portfolio ready', hasCheck: true },
]

const TOTAL_BLOCKS = 36

export default function TerminalLoader({ onComplete }: TerminalLoaderProps) {
  const [progress, setProgress] = useState(0)
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

  // Progress animation runner
  useEffect(() => {
    let animationFrameId: number
    const startTime = performance.now()
    const totalDuration = 2800 // ~2.8s total smooth loader

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const rawPct = Math.min(elapsed / totalDuration, 1)

      // Natural ease-out curve with a micro hesitation around 85%
      let easedPct: number
      if (rawPct < 0.8) {
        easedPct = (rawPct / 0.8) * 0.82
      } else if (rawPct < 0.9) {
        // slight hesitation
        easedPct = 0.82 + ((rawPct - 0.8) / 0.1) * 0.08
      } else {
        // fast sprint to finish
        easedPct = 0.9 + ((rawPct - 0.9) / 0.1) * 0.1
      }

      const currentProgress = Math.min(Math.round(easedPct * 100), 100)
      setProgress(currentProgress)

      if (rawPct < 1) {
        animationFrameId = requestAnimationFrame(updateProgress)
      } else {
        // Finished
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

  // Generate SVG telemetry loss/latency curve points based on progress
  const { pathString, dotX, dotY, metricValue } = useMemo(() => {
    const width = 300
    const startY = 12
    const endY = 62

    // Current width drawn based on progress
    const currentW = Math.max((progress / 100) * width, 2)
    const points: string[] = []

    const steps = Math.floor(currentW)
    for (let x = 0; x <= steps; x += 3) {
      const normalizedX = x / width
      // Smooth exponential decay curve mimicking neural loss / latency drop
      const decay = Math.exp(-2.5 * normalizedX)
      const wobble = Math.sin(normalizedX * 12) * 1.5
      const y = endY - (endY - startY) * decay + wobble
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`)
    }

    const lastX = currentW
    const normalizedLast = lastX / width
    const decayLast = Math.exp(-2.5 * normalizedLast)
    const wobbleLast = Math.sin(normalizedLast * 12) * 1.5
    const lastY = endY - (endY - startY) * decayLast + wobbleLast

    // Metric reading from 0.840s down to 0.012s
    const latency = (0.84 * Math.exp(-2.6 * (progress / 100))).toFixed(3)

    return {
      pathString: points.join(' '),
      dotX: lastX,
      dotY: lastY,
      metricValue: `${latency}s`,
    }
  }, [progress])

  // Active blocks for progress bar
  const activeBlocks = Math.floor((progress / 100) * TOTAL_BLOCKS)

  // Chunks and throughput dynamic values
  const currentChunk = Math.min(Math.floor((progress / 100) * 142), 142)
  const throughput = (10.2 + (progress / 100) * 4.8).toFixed(1)

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

      <div className="terminal-loader-content">
        {/* Terminal Header Prompt */}
        <p className="loader-prompt">
          <span className="loader-prompt-symbol">$</span>
          <span className="loader-prompt-cmd">npx</span>
          <span className="loader-prompt-flag">ajay-os</span>
          <span className="loader-prompt-flag">--profile</span>
          <span className="loader-prompt-target">fullstack</span>
          <span className="loader-prompt-flag">--env</span>
          <span className="loader-prompt-arg">./prod</span>
        </p>

        {/* Dynamic Telemetry / Curve Chart */}
        <div className="loader-chart-container">
          <svg
            className="loader-chart-svg"
            viewBox="0 0 300 80"
            preserveAspectRatio="none"
          >
            {pathString && (
              <polyline
                className="loader-chart-path"
                points={pathString}
              />
            )}
            <circle
              className="loader-chart-dot"
              cx={dotX}
              cy={dotY}
              r="3"
            />
          </svg>
          <div className="loader-chart-axis">
            <span>build_latency</span>
            <span className="loader-chart-value">{metricValue}</span>
          </div>
        </div>

        {/* Real-time Log Feed */}
        <div className="loader-logs">
          {LOGS.map((log, idx) => {
            if (progress < log.triggerPct) return null
            return (
              <div key={idx} className="loader-log-line">
                <span className="loader-tag-ok">[ OK ]</span>
                <span className="loader-log-text">{log.text}</span>
                {log.hasCheck && <span className="loader-log-check">✓</span>}
              </div>
            )
          })}
        </div>

        {/* Live Metrics Ticker */}
        <p className="loader-ticker">
          module <span className="loader-ticker-active">{currentChunk}/142</span> ·{' '}
          <span className="loader-ticker-active">{throughput} MB/s</span> · latency{' '}
          <span className="loader-ticker-active">{metricValue}</span>
        </p>

        {/* Segmented Block Progress Bar */}
        <div className="loader-progress-wrap">
          <div className="loader-progress-header">
            <span className="loader-progress-title">
              {progress >= 100 ? 'SYSTEM READY' : 'BUILDING'}
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
    </motion.div>
  )
}
