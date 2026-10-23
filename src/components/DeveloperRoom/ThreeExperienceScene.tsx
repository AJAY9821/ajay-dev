import { useRef, useState } from 'react'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { ArrowLeft, X } from 'lucide-react'
import { CameraRig, type CameraRigRef } from './CameraRig'
import './ExperienceBadges.css'


interface CardInfo {
  id: string
  company: string
  role: string
  period: string
  strapColor: string
  accentColor: string
  xPos: number
  bullets: string[]
}

const CARDS_DATA: CardInfo[] = [
  {
    id: 'geo-tv',
    company: 'GEO TV Network',
    role: 'System Developer & Analyst',
    period: 'SEP 2025 TO PRESENT',
    strapColor: '#dc2626', // Red
    accentColor: '#ef4444',
    xPos: -2.2,
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
    strapColor: '#0d9488', // Teal
    accentColor: '#14b8a6',
    xPos: -0.7,
    bullets: [
      'Medical platform on Claude 3.5 for biomarker extraction and pathology triage, 70% less manual review.',
      'RAG clinical engine that turns lab data into actionable health roadmaps and specialist referrals.',
      'Architected end-to-end clinician workspace with sub-100ms render speeds.',
    ],
  },
  {
    id: 'loreal',
    company: "L'Oréal Paris",
    role: 'Business Planning Analyst',
    period: 'APR 2024 TO JUL 2024',
    strapColor: '#1e293b', // Slate
    accentColor: '#eab308',
    xPos: 0.8,
    bullets: [
      'Cut sales reporting from several days to same-day with automated daily reporting engine.',
      'Unified 3 to 4 fragmented data sources into one standardized high-performance pipeline.',
      'Eliminated manual spreadsheet reconciliation errors with automated data validation.',
    ],
  },
  {
    id: 'techit',
    company: 'TechIT Solutions',
    role: 'Full Stack Tech Lead',
    period: 'DEC 2022 TO JUN 2023',
    strapColor: '#7c3aed', // Purple
    accentColor: '#8b5cf6',
    xPos: 2.3,
    bullets: [
      'Real-time edge threat detection using YOLO computer vision models with sub-second latency.',
      'Event-driven instant alerts via Pushover API, completely replacing manual dispatch monitoring.',
      'Led 5-engineer team from prototyping to production rollout on distributed Kubernetes clusters.',
    ],
  },
]

// ── 3D Hanging Card Mesh Component ──
interface Card3DProps {
  data: CardInfo
  isFocused: boolean
  onSelect: (mesh: THREE.Object3D, id: string) => void
}

function Card3D({ data, isFocused, onSelect }: Card3DProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)

  // Idle sway physics (paused when focused!)
  useFrame((state) => {
    if (!groupRef.current) return
    if (!isFocused) {
      const t = state.clock.elapsedTime
      // Subtle natural pendulum sway
      groupRef.current.rotation.z = Math.sin(t * 1.5 + data.xPos) * 0.03
      groupRef.current.rotation.y = Math.cos(t * 1.2 + data.xPos) * 0.04
    } else {
      // Keep card still when focused
      groupRef.current.rotation.z = 0
      groupRef.current.rotation.y = 0
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation() // Prevent onPointerMissed reset
    if (groupRef.current) {
      onSelect(groupRef.current, data.id)
    }
  }

  return (
    <group
      ref={groupRef}
      position={[data.xPos, 0, 0.15]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Wall Peg / Hook */}
      <mesh position={[0, 1.45, -0.05]}>
        <cylinderGeometry args={[0.04, 0.04, 0.12, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Hanging Fabric Strap */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.18, 0.55, 0.015]} />
        <meshStandardMaterial
          color={data.strapColor}
          roughness={0.6}
          bumpScale={0.05}
        />
      </mesh>

      {/* Metal Lanyard Clip */}
      <mesh position={[0, 0.85, 0.02]}>
        <boxGeometry args={[0.22, 0.08, 0.03]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Card Body (Laminated Badge) */}
      <group position={[0, 0.15, 0.02]}>
        <RoundedBox args={[1.3, 1.8, 0.02]} radius={0.04} smoothness={4}>
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.1}
            roughness={0.3}
            emissive={hovered ? data.accentColor : '#000000'}
            emissiveIntensity={hovered ? 0.08 : 0}
          />
        </RoundedBox>

        {/* Top Colored Band */}
        <mesh position={[0, 0.65, 0.012]}>
          <planeGeometry args={[1.28, 0.45]} />
          <meshBasicMaterial color={data.strapColor} />
        </mesh>

        {/* Company Title */}
        <Text
          position={[0, 0.65, 0.02]}
          fontSize={0.09}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.1}
        >
          {data.company}
        </Text>

        {/* Role Title */}
        <Text
          position={[0, 0.15, 0.02]}
          fontSize={0.075}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.1}
        >
          {data.role}
        </Text>

        {/* Period */}
        <Text
          position={[0, -0.05, 0.02]}
          fontSize={0.05}
          color="#64748b"
          anchorX="center"
          anchorY="middle"
        >
          {data.period}
        </Text>

        {/* Barcode lines */}
        <mesh position={[0, -0.38, 0.02]}>
          <planeGeometry args={[0.8, 0.18]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>

        {/* Click to inspect prompt */}
        <Text
          position={[0, -0.65, 0.02]}
          fontSize={0.045}
          color={hovered ? data.accentColor : '#94a3b8'}
          anchorX="center"
          anchorY="middle"
        >
          {isFocused ? '● FOCUSED' : 'CLICK TO FLY IN'}
        </Text>
      </group>
    </group>
  )
}

// ── 3D Pegboard Wall Mesh ──
function PegboardMesh() {
  return (
    <group position={[0, 0, -0.1]}>
      {/* Dark Pegboard Panel */}
      <RoundedBox args={[7.2, 3.6, 0.08]} radius={0.08} smoothness={4}>
        <meshStandardMaterial
          color="#13141f"
          roughness={0.7}
          metalness={0.2}
        />
      </RoundedBox>

      {/* Backlight Outer Glow Frame */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[7.4, 3.8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

// ── Main ThreeExperienceScene Component ──
interface ThreeExperienceSceneProps {
  onClose: () => void
}

export default function ThreeExperienceScene({ onClose }: ThreeExperienceSceneProps) {
  const cameraRigRef = useRef<CameraRigRef>(null)
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null)

  const handleCardSelect = (mesh: THREE.Object3D, id: string) => {
    cameraRigRef.current?.flyTo(mesh, id)
  }

  const handleReset = () => {
    cameraRigRef.current?.reset()
  }

  const activeData = CARDS_DATA.find((c) => c.id === focusedCardId)

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: '#090a10' }}>
      {/* Top Left: Back to Room Button */}
      <button
        type="button"
        className="badge-back-room-btn"
        onClick={() => {
          if (focusedCardId) {
            handleReset()
          } else {
            onClose()
          }
        }}
      >
        <ArrowLeft size={16} /> BACK TO THE ROOM [ESC]
      </button>

      {/* Canvas */}
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 48 }}
        onPointerMissed={() => handleReset()}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 6, 5]} intensity={1.5} />
        <pointLight position={[0, 2, 3]} intensity={2} color="#ffffff" />
        <spotLight
          position={[0, 4, 3]}
          angle={0.6}
          penumbra={0.8}
          intensity={2.5}
          color="#ffffff"
        />

        <OrbitControls
          makeDefault
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 2 - 0.5}
          maxDistance={7}
          minDistance={2}
        />

        {/* CameraRig with GSAP Fly-in/Fly-out */}
        <CameraRig
          ref={cameraRigRef}
          distance={2.4}
          onFocus={(cardId) => setFocusedCardId(cardId)}
          onBlur={() => setFocusedCardId(null)}
        />

        {/* Pegboard Wall */}
        <PegboardMesh />

        {/* 3D Hanging Cards */}
        {CARDS_DATA.map((card) => (
          <Card3D
            key={card.id}
            data={card}
            isFocused={focusedCardId === card.id}
            onSelect={handleCardSelect}
          />
        ))}
      </Canvas>

      {/* HTML Experience Panel Overlay (opens when camera lands on card) */}
      {activeData && (
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '560px',
            background: 'rgba(15, 15, 25, 0.92)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${activeData.strapColor}`,
            boxShadow: `0 15px 40px rgba(0, 0, 0, 0.75), 0 0 25px ${activeData.strapColor}40`,
            borderRadius: '14px',
            padding: '20px 24px',
            color: '#f8fafc',
            fontFamily: 'var(--font-sans, sans-serif)',
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: activeData.strapColor,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {activeData.period}
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '2px' }}>
                {activeData.company}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{activeData.role}</p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: '#94a3b8',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div
            style={{
              width: '100%',
              height: '1px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              margin: '12px 0',
            }}
          />

          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {activeData.bullets.map((b, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: '0.8rem',
                  color: '#cbd5e1',
                  lineHeight: '1.45',
                  paddingLeft: '14px',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    color: activeData.strapColor,
                    fontWeight: 700,
                  }}
                >
                  ▪
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
