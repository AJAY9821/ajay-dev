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
    id: 'devtinder',
    title: 'DevTinder — Developer Networking Platform',
    fileName: 'connectionController.ts',
    fileLang: 'ts',
    tagline: 'MERN stack developer platform for professional networking, connection requests, and real-time chat with JWT auth.',
    whyBuilt:
      'Developers need a dedicated space to connect, review skill profiles, and collaborate on software stacks. DevTinder delivers swiping, matching, secure authentication, and instant messaging.',
    architectureWins: [
      'Secure authentication layer built with stateless JWT tokens, HTTP-only cookies, and bcrypt password hashing.',
      'Bi-directional real-time chat architecture powered by Socket.io and WebSockets with active presence tracking.',
      'Automated transactional email notifications dispatched via Amazon SES for connection requests and messages.',
      'Compound-indexed MongoDB schemas ensuring sub-25ms response times on feed queries and user matching.',
    ],
    metrics: [
      { label: 'Auth Scheme', value: 'JWT + bcrypt' },
      { label: 'Real-Time Chat', value: '< 20ms Socket.io' },
      { label: 'Cloud Mail', value: 'Amazon SES' },
    ],
    tags: ['Node.js', 'Express.js', 'React', 'MongoDB', 'Socket.io', 'JWT', 'Amazon SES', 'WebSockets', 'bcrypt'],
    githubUrl: 'https://github.com/AJAY9821',
    demoUrl: 'https://github.com/AJAY9821',
    codeSnippet: `import { Router, Request, Response } from 'express'
import { userAuth } from '../middlewares/auth'
import { ConnectionRequest } from '../models/connectionRequest'
import { sendEmail } from '../utils/ses'

export const requestRouter = Router()

// Send Connection Request (interested / ignored)
requestRouter.post(
  '/request/send/:status/:toUserId',
  userAuth,
  async (req: Request, res: Response) => {
    const fromUserId = req.user._id
    const { status, toUserId } = req.params

    const allowedStatus = ['interested', 'ignored']
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status type' })
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    })
    if (existingRequest) {
      return res.status(400).json({ message: 'Connection request already exists' })
    }

    const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status })
    const data = await connectionRequest.save()

    // Trigger automated email alert via Amazon SES
    if (status === 'interested') {
      await sendEmail(toUserId, \`\${req.user.firstName} sent you a connection request on DevTinder!\`)
    }

    return res.json({ message: \`Connection \${status} successfully\`, data })
  }
)`,
    terminalLogs: [
      '$ git clone https://github.com/AJAY9821/devtinder && npm run dev',
      '[DEV-TINDER] MongoDB Replica Set connected at mongodb://127.0.0.1:27017/devtinder',
      '[AUTH] JWT authentication middleware initialized with 256-bit secret.',
      '[SOCKET] Socket.io server mounted on port 7777 (transport: websocket).',
      '[AMAZON-SES] Cloud mail transport verified: region=ap-south-1.',
      '[CLIENT] React 19 SPA mounted with TailwindCSS responsive layout.',
      '[TEST] POST /request/send/interested/65f12a... -> 200 OK (18ms).',
      '[NOTIFY] Amazon SES email queued & dispatched successfully.',
    ],
  },
  {
    id: 'music-stream',
    title: 'Music Streaming Application',
    fileName: 'musicController.ts',
    fileLang: 'ts',
    tagline: 'Full-stack audio streaming service featuring cloud media ingestion, album management, and RBAC authorization.',
    whyBuilt:
      'Built to provide smooth audio playback with cloud-hosted media assets, secure artist upload workflows, and role-based permissions separating listeners from content creators.',
    architectureWins: [
      'Streamlined media ingestion pipeline combining Multer multipart handling and ImageKit CDN for optimized streaming.',
      'Granular Role-Based Access Control (RBAC) allowing admins/artists to manage tracks, albums, and playlists.',
      'RESTful API design with Mongoose schemas featuring sub-document indexing for fast search and stream requests.',
      'JWT token verification protecting user library modifications and album creation routes.',
    ],
    metrics: [
      { label: 'Media CDN', value: 'ImageKit Cloud' },
      { label: 'Upload Pipeline', value: 'Multer + Buffer' },
      { label: 'Auth Scheme', value: 'Role-Based JWT' },
    ],
    tags: ['Node.js', 'Express.js', 'MongoDB', 'React', 'ImageKit', 'Multer', 'JWT', 'Mongoose'],
    githubUrl: 'https://github.com/AJAY9821',
    demoUrl: 'https://github.com/AJAY9821',
    codeSnippet: `import { Router, Request, Response } from 'express'
import multer from 'multer'
import { imagekit } from '../config/imagekit'
import { Track } from '../models/trackModel'
import { verifyArtistRole } from '../middlewares/rbac'

const upload = multer({ storage: multer.memoryStorage() })
export const trackRouter = Router()

// Upload audio track to ImageKit and persist metadata in MongoDB
trackRouter.post(
  '/tracks/upload',
  verifyArtistRole,
  upload.single('audioFile'),
  async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: 'Audio file is required' })

    // Stream buffer directly to ImageKit CDN
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: \`track_\${Date.now()}_\${req.file.originalname}\`,
      folder: '/music-app/tracks',
    })

    const track = new Track({
      title: req.body.title,
      artist: req.user._id,
      album: req.body.albumId,
      audioUrl: uploadResponse.url,
      duration: req.body.duration,
    })
    await track.save()

    return res.status(201).json({ message: 'Track published successfully', track })
  }
)`,
    terminalLogs: [
      '$ npm run dev:music-api',
      '[MUSIC-STREAM] Server listening on http://localhost:5000',
      '[DATABASE] MongoDB connection established via Mongoose ODM.',
      '[STORAGE] ImageKit CDN connected with public endpoint initialized.',
      '[SECURITY] JWT verification enabled with Role-Based Access Control (RBAC).',
      '[STREAM] Upload request received: "track_04_ambient.mp3" (8.4MB).',
      '[IMAGEKIT] Direct memory buffer uploaded to /music-app/tracks in 142ms.',
      '[DATABASE] Track document saved with indexed title and artist fields.',
    ],
  },
  {
    id: 'hrms-payroll',
    title: 'HRMS — Enterprise Payroll & Leave Platform',
    fileName: 'payrollEngine.ts',
    fileLang: 'ts',
    tagline: 'Enterprise Human Resource platform automating end-to-end payroll computation, payslip distribution, and leave approvals.',
    whyBuilt:
      'Replaced error-prone manual spreadsheet payroll processing with an automated calculation engine and multi-level leave tracking for employees, managers, and HR admins at ProBey Services.',
    architectureWins: [
      'Automated payroll calculation engine accounting for deductions, tax brackets, and attendance records.',
      'Multi-tier approval state machine for leave requests with instant balance deduction.',
      'Role-based dashboards delivering custom filtered analytics for employees, managers, and HR admins.',
      'Modular RESTful architecture supporting seamless integration with employee master data.',
    ],
    metrics: [
      { label: 'Payroll Processing', value: '100% Automated' },
      { label: 'Approval Speed', value: 'Real-Time Sync' },
      { label: 'Database', value: 'Indexed MongoDB' },
    ],
    tags: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'REST API', 'RBAC'],
    githubUrl: 'https://github.com/AJAY9821',
    demoUrl: 'https://github.com/AJAY9821',
    codeSnippet: `import { Router, Request, Response } from 'express'
import { verifyHRAdmin } from '../middlewares/rbac'
import { Employee } from '../models/employee'
import { Payslip } from '../models/payslip'

export const payrollRouter = Router()

// Compute monthly payroll batch and generate payslips
payrollRouter.post('/payroll/compute-batch', verifyHRAdmin, async (req: Request, res: Response) => {
  const { month, year } = req.body
  const activeEmployees = await Employee.find({ status: 'ACTIVE' }).populate('leaveBalance')

  const payslips = activeEmployees.map((emp) => {
    const grossSalary = emp.baseSalary + (emp.allowances || 0)
    const unpaidLeaves = emp.unpaidLeavesThisMonth || 0
    const perDayDeduction = (emp.baseSalary / 30) * unpaidLeaves
    const taxDeduction = grossSalary > 50000 ? grossSalary * 0.1 : 0
    const netSalary = Math.round(grossSalary - perDayDeduction - taxDeduction)

    return {
      employeeId: emp._id,
      month,
      year,
      grossSalary,
      deductions: Math.round(perDayDeduction + taxDeduction),
      netSalary,
      status: 'PROCESSED',
    }
  })

  await Payslip.insertMany(payslips)
  return res.json({ message: \`Processed payroll for \${payslips.length} employees\`, totalProcessed: payslips.length })
})`,
    terminalLogs: [
      '$ npm run hrms:start',
      '[HRMS-CORE] Enterprise HR service online.',
      '[RBAC] Role permissions loaded: Employee, Manager, HR Admin.',
      '[PAYROLL] Initializing monthly automated salary computation...',
      '[LEAVE] Syncing approved leaves against monthly attendance ledger.',
      '[CALC] Batch processing 124 employee records...',
      '[BATCH] 124 payslips generated with tax/deduction algorithms in 64ms.',
      '[DASHBOARD] Real-time KPI charts broadcast to HR Admin portals.',
    ],
  },
  {
    id: 'career-portal',
    title: 'AI Resume Parser & Career Portal',
    fileName: 'resumeParser.ts',
    fileLang: 'ts',
    tagline: 'Automated candidate ingestion pipeline with AI document parsing, structured talent indexing, and high-concurrency job APIs.',
    whyBuilt:
      'Accelerated technical recruiting at ProBey Services by leveraging Google API to parse unstructured resumes into queryable candidate profiles with optimized search.',
    architectureWins: [
      'AI document parsing pipeline using Google API to extract skills, experience, and education from candidate PDFs.',
      'MongoDB schema indexing and query optimization keeping query latency low under high applicant volumes.',
      'Server-side caching layer buffering frequent job listings and candidate search filters.',
      'End-to-end RESTful APIs supporting job postings, applicant tracking, and recruiter hiring stages.',
    ],
    metrics: [
      { label: 'AI Extraction', value: 'Google API' },
      { label: 'Query Latency', value: '< 40ms Optimized' },
      { label: 'Data Model', value: 'Schema Indexed' },
    ],
    tags: ['Node.js', 'Express.js', 'Google API', 'MongoDB', 'React', 'Caching'],
    githubUrl: 'https://github.com/AJAY9821',
    demoUrl: 'https://github.com/AJAY9821',
    codeSnippet: `import { Router, Request, Response } from 'express'
import multer from 'multer'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { CandidateProfile } from '../models/candidate'

const upload = multer({ storage: multer.memoryStorage() })
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
export const careerRouter = Router()

careerRouter.post('/parse-resume', upload.single('resumePdf'), async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'Resume PDF required' })

  // Send document buffer to Google API with structured schema instructions
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const prompt = 'Extract candidate name, contact, skills array, experience list, and education into valid JSON.'

  const result = await model.generateContent([
    { inlineData: { data: req.file.buffer.toString('base64'), mimeType: 'application/pdf' } },
    prompt,
  ])

  const parsedData = JSON.parse(result.response.text())
  const profile = await CandidateProfile.create(parsedData)
  return res.status(201).json({ message: 'Resume parsed and indexed', profile })
})`,
    terminalLogs: [
      '$ npm run career:server',
      '[CAREER-PORTAL] Recruitment platform running on port 8080.',
      '[AI-PIPELINE] Google API authenticated for candidate resume ingestion.',
      '[MONGODB] Compound indexes initialized: { skills: 1, experienceYears: -1 }.',
      '[UPLOAD] Incoming applicant resume: "Ajay_Singh_Resume.pdf"',
      '[AI-EXTRACTION] Google API parsed: 14 skills, 2 degrees, 1 year experience in 820ms.',
      '[INDEX] Candidate structured profile created and cached.',
      '[API] 201 Created: Candidate ready for recruiter evaluation.',
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
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
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
          initial={{ scale: 0.96, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 10 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
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
