import React, { useState, useEffect } from 'react'
import ImageGallery from '../components/ImageGallery'
import '../styles/Gallery.css'

export default function Gallery() {
  const [images, setImages] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/images')
      .then(res => res.json())
      .then(data => {
        setImages(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load images:', err)
        // Fallback to hardcoded images if API fails
        setImages([])
        setLoading(false)
      })
  }, [])

  const categories = ['all', 'cover', 'animals', 'facilities', 'testimonials', 'lifestyle']
  
  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory)

  return (
    <div className="gallery-page">
      <section className="gallery-header">
        <h1>Фотогалерея</h1>
        <p>Галерея котелю для тварин Котопес</p>
      </section>

      <section className="gallery-filters">
        <div className="filter-buttons">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'Все' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="loading">Завантаження...</div>
      ) : filteredImages.length > 0 ? (
        <section className="gallery-grid">
          <ImageGallery images={filteredImages} />
        </section>
      ) : (
        <div className="no-images">
          <p>Зображень у цій категорії не знайдено</p>
        </div>
      )}
    </div>
  )
}
