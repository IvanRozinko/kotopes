import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Header.css'

export default function Header() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const burgerRef = useRef(null)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    function onClick(e) {
      // Ignore clicks inside the menu or on the burger button itself
      const target = e.target
      const clickedInsideMenu = menuRef.current && menuRef.current.contains(target)
      const clickedOnBurger = burgerRef.current && burgerRef.current.contains(target)
      if (open && !clickedInsideMenu && !clickedOnBurger) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [open])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/blog', label: 'Blog' },
    { to: '/our-boxers', label: 'Our Boxers' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/about', label: 'About' }
  ]

  return (
    <header className="site-header">
      <div className="container header-row">
        <h1 className="site-logo"><Link to="/">КітПес</Link></h1>

        <nav className="main-nav" aria-label="Primary navigation">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="nav-link">{l.label}</Link>
          ))}
        </nav>

        <button
          ref={burgerRef}
          className={`burger ${open ? 'open' : ''}`}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="burger-box">
            <span className="burger-inner" />
          </span>
        </button>
      </div>

      {/* Mobile menu overlay / slide-in */}
      <div className={`mobile-menu ${open ? 'open' : ''}`} ref={menuRef} aria-hidden={!open}>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="mobile-link" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
        </nav>
        <div className="mobile-contact">
          <a href="tel:+380685746252" className="phone">+38 (068) 574 62 52</a>
        </div>
        </div>
        <div className={`overlay ${open ? 'active' : ''}`} onClick={() => setOpen(false)} />
    </header>
  )
}
