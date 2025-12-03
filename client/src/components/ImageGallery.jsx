import React from 'react'

export default function ImageGallery({ images = [] }) {
  if (!images.length) return <div>No images</div>

  // Handle both string paths and image objects with metadata
  const imageList = images.map(img => {
    if (typeof img === 'string') {
      return { url: img, title: '', description: '' }
    }
    return img
  })

  return (
    <div className="image-gallery">
      {imageList.map((img, i) => (
        <div key={i} className="gallery-item">
          <img 
            src={img.url || img} 
            alt={img.alt_text || img.description || img.title || `Image ${i + 1}`} 
            loading="lazy"
          />
          {(img.title || img.description) && (
            <div className="gallery-overlay">
              <div className="overlay-content">
                {img.title && <h3>{img.title}</h3>}
                {img.description && <p>{img.description}</p>}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
