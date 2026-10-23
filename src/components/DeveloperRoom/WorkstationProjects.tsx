import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Code2,
  Terminal,
  Check,
  Copy,
  FolderGit2,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react'
import './WorkstationProjects.css'

function GithubIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
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

export interface ProjectData {
  id: string
  title: string
  fileName: string
  fileLang: string
  tagline: string
  whyBuilt: string
  architectureWins: string[]
  metrics: { label: string; value: string }[]
  tags: string[]
  githubUrl: string
  demoUrl?: string
  codeSnippet: string
  terminalLogs: string[]
}

const PROJECTS_DATA: ProjectData[] = [
  {
    id: 'edi',
    title: 'EDI — Local AI Spreadsheet',
    fileName: 'edi_engine.tsx',
    fileLang: 'tsx',
    tagline: 'Private, in-memory AI spreadsheet running 100% locally with zero cloud data egress.',
    whyBuilt:
      'Analysts deal with multi-gigabyte confidential financial sheets and cannot paste company data into cloud AI services. EDI brings in-memory DuckDB and local Ollama models directly to the user machine.',
    architectureWins: [
      'Stateless FastAPI engine rebuilds in-memory SQLite/DuckDB on cache hash in <15ms.',
      'Natural-language-to-SQL compiler handles multi-table joins and data cleaning turns.',
      'Interactive Recharts visualizer streams chart objects directly to client canvas.',
    ],
    metrics: [
      { label: 'Cloud Data Leakage', value: '0 bytes (100% Local)' },
      { label: '500k-Row Query Latency', value: '< 38ms' },
      { label: 'Memory Footprint', value: '84MB RAM' },
    ],
    tags: ['React 19', 'TypeScript', 'DuckDB', 'Ollama', 'FastAPI', 'Recharts'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://github.com',
    codeSnippet: `import { DuckDBClient } from '@duckdb/wasm'
import { OllamaLocalLLM } from 'ollama-node'

export class LocalSpreadsheetEngine {
  private db: DuckDBClient
  private llm: OllamaLocalLLM

  constructor() {
    this.db = new DuckDBClient({ inMemory: true })
    this.llm = new OllamaLocalLLM({ model: 'qwen2.5-coder:7b' })
  }

  async queryNaturalLanguage(sheetData: Row[], prompt: string): Promise<QueryResult> {
    // 1. Hash & register virtual table in memory
    const tableHash = await this.db.registerTable('active_sheet', sheetData)
    
    // 2. Compile user intent to verified SQL without external cloud API
    const sql = await this.llm.generateSQL(prompt, { schema: tableHash.schema })
    
    // 3. Sub-40ms execution on local CPU threads
    const results = await this.db.query(sql)
    return { data: results, sql, rowsProcessed: sheetData.length }
  }
}`,
    terminalLogs: [
      '$ git clone https://github.com/ajay/edi && cd edi',
      '$ npm install && ollama run qwen2.5-coder:7b',
      '[EDI-CORE] Loading in-memory DuckDB WASM instance...',
      '[EDI-CORE] DuckDB v1.1 initialized in 12ms.',
      '[OLLAMA] Local model qwen2.5-coder:7b ready on port 11434.',
      '[CLIENT] Mounted React 19 sheet viewport with 500,000 cells.',
      '[QUERY] "Plot monthly net margin by region for Q3"',
      '[SQL] SELECT region, SUM(revenue - cost) as net_margin FROM active_sheet GROUP BY region;',
      '[RESULT] 4 rows returned in 28ms. Chart rendered.',
    ],
  },
  {
    id: 'mentora',
    title: 'Mentora — Local AI Code Tutor',
    fileName: 'mentora_agent.py',
    fileLang: 'py',
    tagline: 'Algorithmic and full-stack code tutor that adapts pacing, tracks mistake patterns, and drills weak spots.',
    whyBuilt:
      'AI code generation can lead to passive learning. Mentora flips the script: it enforces active recall, evaluates learner test cases, and dynamically adjusts drill difficulty without leaking learner progress.',
    architectureWins: [
      'Dual-tier model architecture: Claude Code for complex AST parsing with Ollama fallback.',
      'Deterministic sandbox evaluation runs learner code in isolated WebAssembly micro-containers.',
      'Spaced repetition engine schedules syntax and algorithmic reviews on SQLite vector store.',
    ],
    metrics: [
      { label: 'Evaluation Speed', value: 'sub-60ms' },
      { label: 'Curriculum Depth', value: '13 Mastery Phases' },
      { label: 'Offline Mode', value: 'Fully Functional' },
    ],
    tags: ['Next.js', 'Python', 'LiteLLM', 'WebAssembly', 'SQLite', 'TailwindCSS'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://github.com',
    codeSnippet: `from litellm import completion
import wasmtime

class CodeTutorAgent:
    def __init__(self, learner_id: str, local_mode: bool = True):
        self.learner_id = learner_id
        self.model = "ollama/llama3.2:3b" if local_mode else "claude-3-5-sonnet"
        self.sandbox = wasmtime.Store()

    async def evaluate_submission(self, code: str, test_suite: list) -> dict:
        """Run student code inside isolated WASM sandbox with strict timeout."""
        exec_result = self.sandbox.execute(code, test_suite, timeout_ms=250)
        
        if not exec_result.passed:
            # Diagnose specific algorithmic anti-patterns rather than giving raw answers
            diagnosis = await completion(
                model=self.model,
                messages=[{"role": "user", "content": f"Guide without spoiling: {exec_result.diff}"}],
                temperature=0.2
            )
            return {"status": "retry", "hint": diagnosis.choices[0].message.content}
            
        return {"status": "mastered", "xp": 100, "next_topic": "dynamic_programming_2"}`,
    terminalLogs: [
      '$ python -m mentora --user ajay --topic dynamic_programming',
      '[TUTOR] Initializing local spaced repetition graph...',
      '[SANDBOX] WebAssembly runner booted in 8ms.',
      '[EXERCISE] Phase 4: Longest Increasing Subsequence (O(n log n))',
      '[SUBMISSION] Received 42 lines of Python solution.',
      '[TESTS] Running 15 test vectors against sandboxed bytecode...',
      '[PASS] 15/15 assertions passed in 18ms.',
      '[ANALYSIS] Time complexity verified: O(n log n). Memory: O(n).',
      '[PROGRESS] Mastery score updated: 94.2%. Next review in 48 hours.',
    ],
  },
  {
    id: 'resumewesume',
    title: 'ResumeWesume — Real-Time AI Editor',
    fileName: 'resume_compiler.ts',
    fileLang: 'ts',
    tagline: 'ATS-validated resume tailoring engine with automated headless Chromium PDF compilation.',
    whyBuilt:
      'Applying for jobs requires customizing resumes without breaking formatting or introducing hallucinated credentials. ResumeWesume uses typed schema tools to validate every bullet point before rendering.',
    architectureWins: [
      'AST-based schema parser guarantees zero formatting breakage and 100% ATS readability.',
      'Automated headless Chromium driver runs on serverless container to produce print-quality PDFs.',
      'Prompt-injection defense prevents hidden prompt overrides in imported job specifications.',
    ],
    metrics: [
      { label: 'PDF Generation Time', value: '< 1.4s' },
      { label: 'ATS Score Verification', value: '100% Pass Rate' },
      { label: 'Model Reasoning Overhead', value: 'Reduced by 88%' },
    ],
    tags: ['React', 'Python', 'FastAPI', 'Chromium', 'Tailwind', 'LiteLLM'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://github.com',
    codeSnippet: `import { chromium } from 'playwright-core'
import { z } from 'zod'

const ResumeSchema = z.object({
  contact: z.object({ name: z.string(), email: z.string().email(), title: z.string() }),
  experience: z.array(z.object({
    role: z.string(),
    company: z.string(),
    period: z.string(),
    metrics: z.array(z.string().min(10))
  }))
})

export async function compileATSResume(jsonContent: unknown): Promise<Buffer> {
  // Validate schema before passing to renderer
  const validated = ResumeSchema.parse(jsonContent)
  
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setContent(renderResumeHTML(validated), { waitUntil: 'networkidle' })
  
  const pdfBuffer = await page.pdf({
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.4in', bottom: '0.4in', left: '0.45in', right: '0.45in' }
  })
  
  await browser.close()
  return pdfBuffer
}`,
    terminalLogs: [
      '$ curl -X POST /api/v1/tailor -d @job_description.json',
      '[ATS-ENGINE] Parsing target job: "Senior Full Stack AI Engineer"...',
      '[EXTRACTOR] Extracted 8 core competencies & key metrics.',
      '[DIFF-CHECK] Validating experience bullets against verified career graph...',
      '[SECURITY] Prompt injection guard: zero untrusted overrides detected.',
      '[COMPILER] Headless Chromium launched in background.',
      '[RENDER] Printing vector-sharp PDF with exact typographic hierarchy.',
      '[DONE] Export generated: ajay_resume_tailored.pdf (142 KB, 1.2s)',
    ],
  },
  {
    id: 'pulseengine',
    title: 'PulseEngine — Real-Time CV Threat Engine',
    fileName: 'edge_detector.py',
    fileLang: 'py',
    tagline: 'Sub-second real-time computer vision threat detection deployed on distributed edge Kubernetes clusters.',
    whyBuilt:
      'Manual security video monitoring is error-prone and labor intensive. PulseEngine runs lightweight YOLO models on edge cameras, dispatching instant push alerts over WebSockets and Pushover API.',
    architectureWins: [
      'Edge-optimized YOLOv8 model quantized to INT8 runs at 45 FPS on edge hardware.',
      'Event-driven instant alert pipeline over WebSockets, replacing legacy polling.',
      'Fault-tolerant deployment orchestrated on k3s lightweight Kubernetes clusters.',
    ],
    metrics: [
      { label: 'Inference Latency', value: '22ms / Frame' },
      { label: 'False Positive Drop', value: '65% Reduction' },
      { label: 'Frame Rate', value: '45+ FPS Edge' },
    ],
    tags: ['Python', 'YOLOv8', 'FastAPI', 'WebSockets', 'Kubernetes', 'OpenCV'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://github.com',
    codeSnippet: `import cv2
from ultralytics import YOLO
import asyncio
import websockets

class EdgeThreatEngine:
    def __init__(self, weights_path: str = "models/yolov8n-quantized.onnx"):
        # Load edge-quantized ONNX runtime model for sub-30ms frame inference
        self.model = YOLO(weights_path, task="detect")
        self.active_subscribers = set()

    async def process_stream(self, rtsp_stream_url: str):
        cap = cv2.VideoCapture(rtsp_stream_url)
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            # Perform edge detection
            results = self.model.predict(source=frame, conf=0.72, verbose=False)
            anomalies = [box for box in results[0].boxes if box.cls in [0, 2]]
            
            if anomalies:
                alert_payload = {"timestamp": cv2.getTickCount(), "threat_count": len(anomalies)}
                # Fan out over WebSockets to monitoring dashboards
                await asyncio.gather(*[ws.send(str(alert_payload)) for ws in self.active_subscribers])`,
    terminalLogs: [
      '$ k3s kubectl get pods -n edge-inference',
      'NAME                            READY   STATUS    RESTARTS   AGE',
      'pulse-engine-worker-7b9c9-x8j   1/1     Running   0          4d12h',
      '[STREAM] Connected to RTSP stream 10.0.4.12:554/live.sdp',
      '[INFERENCE] Quantized ONNX model loaded on edge TensorRT accelerator.',
      '[STATS] Processing 45 FPS · Frame latency: 21.8ms.',
      '[EVENT] Anomaly detected: unauthorized access in zone B (confidence: 0.94)',
      '[ALERT] WebSocket broadcast dispatched to 14 clients in 3ms.',
    ],
  },
]

interface WorkstationProjectsProps {
  onClose: () => void
  onNavigateSection?: (section: 'projects' | 'experience' | 'about' | 'contact') => void
}

export default function WorkstationProjects({
  onClose,
  onNavigateSection,
}: WorkstationProjectsProps) {
  const [activeProjectIdx, setActiveProjectIdx] = useState(0)
  const [rightPaneTab, setRightPaneTab] = useState<'code' | 'terminal'>('code')
  const [copied, setCopied] = useState(false)

  const currentProject = PROJECTS_DATA[activeProjectIdx]

  const handleNext = useCallback(() => {
    setActiveProjectIdx((prev) => (prev + 1) % PROJECTS_DATA.length)
  }, [])

  const handlePrev = useCallback(() => {
    setActiveProjectIdx((prev) => (prev - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length)
  }, [])

  // Keyboard navigation: Left/Right arrows, 1-4 for projects, Escape to return
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'Escape') {
        onClose()
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        setActiveProjectIdx(parseInt(e.key, 10) - 1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleNext, handlePrev, onClose])

  const copyCode = () => {
    navigator.clipboard.writeText(currentProject.codeSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      className="workstation-stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── Top Bar: Back to Room & Section Hint ── */}
      <div className="workstation-top-bar">
        <button
          type="button"
          className="workstation-back-btn"
          onClick={onClose}
          aria-label="Back to the room"
        >
          <ArrowLeft size={15} /> BACK TO THE ROOM [ESC]
        </button>

        <div className="workstation-status-pill">
          <span className="workstation-pulse-dot" />
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-300">
            Workstation · Ultrawide 34&quot; 144Hz
          </span>
        </div>
      </div>

      {/* ── The Curved Ultrawide Monitor Workstation Frame ── */}
      <div className="workstation-monitor-wrap">
        {/* Soft Ambient Screen Backlight Glow cast onto room */}
        <div className="workstation-screen-ambient" />

        <motion.div
          className="workstation-monitor-screen"
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Top Window Chrome (Traffic Lights, Tabs, Search) */}
          <div className="monitor-chrome-header">
            {/* Traffic Light Dots */}
            <div className="monitor-traffic-lights">
              <span className="traffic-dot red" onClick={onClose} title="Close view" />
              <span className="traffic-dot yellow" title="Minimize" />
              <span className="traffic-dot green" title="Expand" />
            </div>

            {/* IDE File Tabs */}
            <div className="monitor-file-tabs">
              {PROJECTS_DATA.map((proj, idx) => {
                const isActive = idx === activeProjectIdx
                return (
                  <button
                    key={proj.id}
                    type="button"
                    className={`monitor-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveProjectIdx(idx)}
                  >
                    <span className={`tab-icon-lang ${proj.fileLang}`}>
                      {proj.fileLang.toUpperCase()}
                    </span>
                    <span className="tab-filename">{proj.fileName}</span>
                    {isActive && <span className="tab-active-line" />}
                  </button>
                )
              })}
            </div>

            {/* Git Branch & Search Hint */}
            <div className="monitor-chrome-meta">
              <span className="monitor-git-tag">
                <FolderGit2 size={13} className="text-cyan-400" /> main*
              </span>
            </div>
          </div>

          {/* ── Monitor Dual-Pane Workstation Body ── */}
          <div className="monitor-workspace-body">
            {/* LEFT PANE: Project Overview, Problem & Architecture */}
            <div className="workspace-left-pane">
              <div className="pane-content-scroll">
                {/* Title & Tagline */}
                <div className="project-heading-block">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="project-badge-pill">
                      <Sparkles size={12} className="text-pink-400" />
                      Featured Project 0{activeProjectIdx + 1}
                    </span>
                  </div>
                  <h2 className="project-main-title">{currentProject.title}</h2>
                  <p className="project-tagline">{currentProject.tagline}</p>
                </div>

                {/* Why I Built It */}
                <div className="project-section-card">
                  <h4 className="section-label-sm">
                    <Cpu size={14} className="text-cyan-400" /> Why I Built It & The Problem
                  </h4>
                  <p className="section-body-text">{currentProject.whyBuilt}</p>
                </div>

                {/* Key Architectural Decisions */}
                <div className="project-section-card">
                  <h4 className="section-label-sm">
                    <Layers size={14} className="text-pink-400" /> Architectural Highlights
                  </h4>
                  <ul className="project-architecture-list">
                    {currentProject.architectureWins.map((win, wIdx) => (
                      <li key={wIdx} className="project-architecture-item">
                        <span className="bullet-point">▸</span>
                        <span>{win}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Performance Metrics Badges */}
                <div className="project-metrics-grid">
                  {currentProject.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="metric-box">
                      <span className="metric-value">{m.value}</span>
                      <span className="metric-label">{m.label}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Pills */}
                <div className="project-tags-wrap">
                  {currentProject.tags.map((tag) => (
                    <span key={tag} className="project-tech-pill">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons: GitHub & Demo */}
                <div className="project-actions-row">
                  <a
                    href={currentProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn-primary"
                  >
                    <GithubIcon size={16} />
                    <span>View GitHub Source</span>
                    <ExternalLink size={13} className="opacity-70" />
                  </a>

                  {currentProject.demoUrl && (
                    <a
                      href={currentProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-btn-secondary"
                    >
                      <Sparkles size={14} className="text-cyan-400" />
                      <span>Live Architecture Demo</span>
                      <ExternalLink size={13} className="opacity-70" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT PANE: Code Snippet & Live Terminal Toggle */}
            <div className="workspace-right-pane">
              {/* Top Sub-Bar: Code Snippet / Terminal Toggle */}
              <div className="right-pane-toolbar">
                <div className="pane-toggle-group">
                  <button
                    type="button"
                    className={`pane-toggle-btn ${rightPaneTab === 'code' ? 'active' : ''}`}
                    onClick={() => setRightPaneTab('code')}
                  >
                    <Code2 size={14} />
                    <span>Core Engine Code</span>
                  </button>

                  <button
                    type="button"
                    className={`pane-toggle-btn ${rightPaneTab === 'terminal' ? 'active' : ''}`}
                    onClick={() => setRightPaneTab('terminal')}
                  >
                    <Terminal size={14} />
                    <span>Live Terminal Run</span>
                  </button>
                </div>

                {rightPaneTab === 'code' && (
                  <button
                    type="button"
                    className="copy-snippet-btn"
                    onClick={copyCode}
                    title="Copy code to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check size={13} className="text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Code Snippet Viewer or Terminal Output */}
              <div className="right-pane-viewport">
                <AnimatePresence mode="wait">
                  {rightPaneTab === 'code' ? (
                    <motion.div
                      key={`code-${currentProject.id}`}
                      className="code-editor-view"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <pre className="code-pre">
                        <code className="code-block font-mono">
                          {currentProject.codeSnippet.split('\n').map((line, lIdx) => (
                            <div key={lIdx} className="code-line">
                              <span className="line-num">{lIdx + 1}</span>
                              <span className="line-code">{line}</span>
                            </div>
                          ))}
                        </code>
                      </pre>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`term-${currentProject.id}`}
                      className="terminal-shell-view"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="terminal-header-prompt">
                        <span className="term-user font-mono">ajay@workstation</span>
                        <span className="term-sep">:</span>
                        <span className="term-dir font-mono">~/projects/{currentProject.id}</span>
                        <span className="term-sym font-mono">$</span>
                      </div>

                      <div className="terminal-log-output font-mono">
                        {currentProject.terminalLogs.map((log, logIdx) => (
                          <div
                            key={logIdx}
                            className={`term-log-line ${
                              log.startsWith('$')
                                ? 'command-line'
                                : log.includes('PASS') || log.includes('DONE')
                                ? 'success-line'
                                : 'stdout-line'
                            }`}
                          >
                            {log}
                          </div>
                        ))}
                        <div className="term-cursor-row">
                          <span className="term-user">ajay@workstation</span>:
                          <span className="term-dir">~/projects/{currentProject.id}</span>${' '}
                          <span className="term-blink-cursor" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Carousel Pagination Dock (< 01 / 04 >) ── */}
        <motion.div
          className="workstation-nav-dock"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 16, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            type="button"
            className="workstation-nav-arrow"
            onClick={handlePrev}
            aria-label="Previous project"
          >
            <ChevronLeft size={17} />
          </button>
          <span className="workstation-nav-count font-mono">
            0{activeProjectIdx + 1} / 0{PROJECTS_DATA.length}
          </span>
          <button
            type="button"
            className="workstation-nav-arrow"
            onClick={handleNext}
            aria-label="Next project"
          >
            <ChevronRight size={17} />
          </button>
        </motion.div>
      </div>

      {/* ── Bottom Navigation Dock ── */}
      <motion.div
        className="workstation-bottom-dock"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          type="button"
          className="workstation-dock-tab active"
          onClick={onClose}
        >
          <span className="dock-prefix">01</span> PROJECTS
        </button>

        <button
          type="button"
          className="workstation-dock-tab"
          onClick={() => onNavigateSection?.('experience')}
        >
          <span className="dock-prefix">02</span> EXPERIENCE
        </button>

        <button
          type="button"
          className="workstation-dock-tab"
          onClick={() => onNavigateSection?.('about')}
        >
          <span className="dock-prefix">03</span> ABOUT
        </button>

        <button
          type="button"
          className="workstation-dock-tab"
          onClick={() => onNavigateSection?.('contact')}
        >
          <span className="dock-prefix">04</span> CONTACT
        </button>
      </motion.div>
    </motion.div>
  )
}
