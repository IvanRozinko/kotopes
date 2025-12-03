import React from 'react'
import ImageGallery from '../components/ImageGallery'

const IMAGES = [
  '/images/originals/wp-content/uploads/2019/07/bgc_resize.jpg',
  '/images/originals/wp-content/uploads/2019/08/certificate-e1565289666832.jpg'
]

export default function OurBoxers() {
  return (
    <div>
      <h2>Our Boxers</h2>
      <ImageGallery images={IMAGES} />
    </div>
  )
}
