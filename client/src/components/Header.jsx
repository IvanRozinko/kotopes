import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header style={{ padding: '12px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ margin: 0 }}><Link to="/">КОТОПЕС</Link></h1>
        <nav style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/">Home</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/our-boxers">Our Boxers</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/about">About</Link>
        </nav>
      </div>
    </header>
  )
}
