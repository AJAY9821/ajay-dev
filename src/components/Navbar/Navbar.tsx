import { Download } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  return (
    <header className="navbar-header" role="banner">
      <nav className="navbar-inner" aria-label="Main navigation">
        {/* ── Resume Button (top right) ── */}
        <a
          href="/resume.pdf"
          download
          className="resume-btn btn-outline"
          aria-label="Download resume PDF"
        >
          <Download size={14} strokeWidth={2} />
          Resume
        </a>
      </nav>
    </header>
  )
}
