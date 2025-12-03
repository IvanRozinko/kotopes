import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/global.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Post from './pages/Post'
import OurBoxers from './pages/OurBoxers'
import Gallery from './pages/Gallery'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Post />} />
          <Route path="/our-boxers" element={<OurBoxers />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
