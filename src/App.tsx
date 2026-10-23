import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar/Navbar'
import TerminalLoader from './components/TerminalLoader/TerminalLoader'
import DeveloperRoom from './components/DeveloperRoom/DeveloperRoom'
import './App.css'

// Last updated: contact experience v2

function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {isLoading && (
          <TerminalLoader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Navbar />

        <main className="w-full h-screen overflow-hidden">
          {/* Interactive 3D Developer Room Single-Page Canvas */}
          <section id="hero" className="w-full h-screen overflow-hidden relative">
            <DeveloperRoom />
          </section>
        </main>
      </motion.div>
    </div>
  )
}

export default App

