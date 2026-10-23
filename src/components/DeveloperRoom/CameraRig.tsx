import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { useThree } from '@react-three/fiber'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import gsap from 'gsap'

export interface CameraRigRef {
  flyTo: (card: THREE.Object3D, cardId: string) => void
  reset: () => void
  isFocused: () => boolean
}

interface CameraRigProps {
  distance?: number // Distance in front of the card (default: 2.5)
  onFocus?: (cardId: string) => void
  onBlur?: () => void
}

export const CameraRig = forwardRef<CameraRigRef, CameraRigProps>(
  ({ distance = 2.5, onFocus, onBlur }, ref) => {
    const { camera, controls } = useThree()
    const orbitControls = controls as unknown as OrbitControlsImpl | null

    // Animation & Target Refs (avoid re-renders)
    const isAnimating = useRef(false)
    const isFocusedRef = useRef(false)
    const activeCardId = useRef<string | null>(null)

    // Saved starting transforms for exact return trip
    const savedCamPos = useRef(new THREE.Vector3())
    const savedTarget = useRef(new THREE.Vector3())
    const hasSavedHome = useRef(false)

    // Current LookAt point being tweened
    const currentLookAt = useRef(new THREE.Vector3())

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Save initial state once controls are ready
    useEffect(() => {
      if (orbitControls && !hasSavedHome.current) {
        savedCamPos.current.copy(camera.position)
        savedTarget.current.copy(orbitControls.target)
        currentLookAt.current.copy(orbitControls.target)
        hasSavedHome.current = true
      }
    }, [camera, orbitControls])

    // ── Fly to Card ──
    const flyTo = (card: THREE.Object3D, cardId: string) => {
      if (isAnimating.current || activeCardId.current === cardId) return
      isAnimating.current = true

      // 1. Save original transform before the very first fly
      if (!isFocusedRef.current && orbitControls) {
        savedCamPos.current.copy(camera.position)
        savedTarget.current.copy(orbitControls.target)
        currentLookAt.current.copy(orbitControls.target)
      }

      // 2. Disable OrbitControls while in flight and focused
      if (orbitControls) orbitControls.enabled = false

      // 3. Compute Card World Position & Forward Direction (handles sway)
      const cardPos = new THREE.Vector3()
      const cardDir = new THREE.Vector3()
      card.getWorldPosition(cardPos)
      card.getWorldDirection(cardDir)

      // Target position: offset along the card's forward normal
      const destCamPos = cardPos.clone().add(cardDir.clone().multiplyScalar(distance))

      // 4. Kill active tweens
      gsap.killTweensOf(camera.position)
      gsap.killTweensOf(currentLookAt.current)

      const animDuration = prefersReducedMotion ? 0 : 1.2

      // 5. Run GSAP Timeline
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false
          isFocusedRef.current = true
          activeCardId.current = cardId
          onFocus?.(cardId)
        },
      })

      // Tween Camera Position
      tl.to(
        camera.position,
        {
          x: destCamPos.x,
          y: destCamPos.y,
          z: destCamPos.z,
          duration: animDuration,
          ease: 'power3.inOut',
        },
        0
      )

      // Tween LookAt Target
      tl.to(
        currentLookAt.current,
        {
          x: cardPos.x,
          y: cardPos.y,
          z: cardPos.z,
          duration: animDuration,
          ease: 'power3.inOut',
          onUpdate: () => {
            camera.lookAt(currentLookAt.current)
          },
        },
        0
      )
    }

    // ── Reset Back to Saved Room View ──
    const reset = () => {
      if (isAnimating.current || !isFocusedRef.current) return
      isAnimating.current = true

      gsap.killTweensOf(camera.position)
      gsap.killTweensOf(currentLookAt.current)

      const animDuration = prefersReducedMotion ? 0 : 1.2

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false
          isFocusedRef.current = false
          activeCardId.current = null

          // Re-enable and sync OrbitControls
          if (orbitControls) {
            orbitControls.target.copy(savedTarget.current)
            orbitControls.enabled = true
            orbitControls.update()
          }

          onBlur?.()
        },
      })

      // Return camera.position
      tl.to(
        camera.position,
        {
          x: savedCamPos.current.x,
          y: savedCamPos.current.y,
          z: savedCamPos.current.z,
          duration: animDuration,
          ease: 'power3.inOut',
        },
        0
      )

      // Return lookAt
      tl.to(
        currentLookAt.current,
        {
          x: savedTarget.current.x,
          y: savedTarget.current.y,
          z: savedTarget.current.z,
          duration: animDuration,
          ease: 'power3.inOut',
          onUpdate: () => {
            camera.lookAt(currentLookAt.current)
          },
        },
        0
      )
    }

    // ── Escape Key Listener ──
    useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') reset()
      }
      window.addEventListener('keydown', onKeyDown)
      return () => window.removeEventListener('keydown', onKeyDown)
    }, [])

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      flyTo,
      reset,
      isFocused: () => isFocusedRef.current,
    }))

    return null
  }
)
CameraRig.displayName = 'CameraRig'
