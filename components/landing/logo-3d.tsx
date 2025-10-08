"use client"

import { useEffect, useRef, useState } from "react"

interface Logo3DProps {
  isAnimating?: boolean
}

export default function Logo3D({ isAnimating = false }: Logo3DProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const [webglSupported, setWebglSupported] = useState(true)

  // Only render on client-side to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !containerRef.current) return undefined

    // Check WebGL support
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      setWebglSupported(false)
      return undefined
    }

    // Dynamic import to prevent SSR issues
    import('three').then((THREE) => {
      const container = containerRef.current
      if (!container) return undefined

      try {
        // Setup
        const scene = new THREE.Scene()

        // Camera
        const camera = new THREE.PerspectiveCamera(
          75,
          container.clientWidth / container.clientHeight,
          0.1,
          1000
        )
        camera.position.z = 5

        // Renderer
        const renderer = new THREE.WebGLRenderer({
          antialias: window.devicePixelRatio < 2, // Disable antialiasing on high-DPI for performance
          alpha: true,
        })

        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)) // Cap at 2x for mobile performance
        container.appendChild(renderer.domElement)

        // Create neural network with deterministic seed for consistent rendering
        let seed = 12345 // Fixed seed for consistent rendering across server/client
        const seededRandom = () => {
          seed = (seed * 9301 + 49297) % 233280
          return seed / 233280
        }

        // Create neural network lines
        const neuralNetworkGroup = new THREE.Group()

        // Create points for neural network
        const points = []
        for (let i = 0; i < 50; i++) { // Reduced from 100 for better mobile performance
          const theta = seededRandom() * Math.PI * 2
          const phi = Math.acos(2 * seededRandom() - 1)
          const radius = 0.8 + seededRandom() * 0.4

          const x = radius * Math.sin(phi) * Math.cos(theta)
          const y = radius * Math.sin(phi) * Math.sin(theta)
          const z = radius * Math.cos(phi)

          points.push(new THREE.Vector3(x, y, z))
        }

        // Create connections between points
        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < Math.min(points.length, i + 5); j++) { // Limit connections for performance
            if (points[i].distanceTo(points[j]) < 0.8) {
              const lineGeometry = new THREE.BufferGeometry().setFromPoints([points[i], points[j]])

              const colors = [
                new THREE.Color(0x06b6d4),
                new THREE.Color(0xa855f7),
                new THREE.Color(0xec4899),
              ]
              const color = colors[Math.floor(seededRandom() * colors.length)]

              const lineMaterial = new THREE.LineBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.6,
              })

              const line = new THREE.Line(lineGeometry, lineMaterial)
              neuralNetworkGroup.add(line)
            }
          }
        }

        // Add neural network to scene
        scene.add(neuralNetworkGroup)

        // Create node points
        const nodeGeometry = new THREE.SphereGeometry(0.03, 6, 6) // Reduced complexity

        points.forEach((point) => {
          const colors = [
            new THREE.Color(0x06b6d4),
            new THREE.Color(0xa855f7),
            new THREE.Color(0xec4899),
          ]
          const color = colors[Math.floor(seededRandom() * colors.length)]

          const nodeMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8,
          })

          const node = new THREE.Mesh(nodeGeometry, nodeMaterial)
          node.position.copy(point)
          neuralNetworkGroup.add(node)
        })

        // Create outer sphere
        const outerSphereGeometry = new THREE.SphereGeometry(1.1, 16, 16) // Reduced complexity
        const outerSphereMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.05,
          side: THREE.DoubleSide,
        })

        const outerSphere = new THREE.Mesh(outerSphereGeometry, outerSphereMaterial)
        scene.add(outerSphere)

        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
        scene.add(ambientLight)

        const pointLight1 = new THREE.PointLight(0x06b6d4, 1, 10)
        pointLight1.position.set(2, 2, 2)
        scene.add(pointLight1)

        const pointLight2 = new THREE.PointLight(0xec4899, 1, 10)
        pointLight2.position.set(-2, -2, 2)
        scene.add(pointLight2)

        // Animation
        let rotationSpeed = 0.005
        let targetRotationSpeed = rotationSpeed
        let animationId: number

        const animate = () => {
          animationId = requestAnimationFrame(animate)

          rotationSpeed += (targetRotationSpeed - rotationSpeed) * 0.02
          neuralNetworkGroup.rotation.y += rotationSpeed
          neuralNetworkGroup.rotation.x += rotationSpeed * 0.3
          outerSphere.rotation.y -= rotationSpeed * 0.1

          renderer.render(scene, camera)
        }

        animate()

        // Handle window resize with debouncing
        let resizeTimeout: NodeJS.Timeout
        const handleResize = () => {
          clearTimeout(resizeTimeout)
          resizeTimeout = setTimeout(() => {
            if (!container) return undefined

            camera.aspect = container.clientWidth / container.clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(container.clientWidth, container.clientHeight)
          }, 100)
        }

        window.addEventListener("resize", handleResize)

        // Update rotation speed
        const updateRotationSpeed = () => {
          targetRotationSpeed = isAnimating ? 0.02 : 0.005
        }
        updateRotationSpeed()

        // Cleanup
        return () => {
          window.removeEventListener("resize", handleResize)
          if (animationId) {
            cancelAnimationFrame(animationId)
          }
          if (container && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement)
          }
          renderer.dispose()
        }

      } catch (error) {
        console.warn('Three.js initialization failed:', error)
        setWebglSupported(false)
      }
    }).catch((error) => {
      console.warn('Failed to load Three.js:', error)
      setWebglSupported(false)
    })
  }, [isClient, isAnimating])

  // Show loading spinner while initializing or fallback for unsupported browsers
  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!webglSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-900/20 to-purple-900/20 rounded-lg border border-cyan-500/20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full animate-pulse"></div>
          </div>
          <p className="text-cyan-300 text-sm">GRC Sphere</p>
        </div>
      </div>
    )
  }

  return <div ref={containerRef} className="w-full h-full" />
}
