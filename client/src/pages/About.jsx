import React, { useState } from 'react'
import '../styles/About.css'

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const dogImages = [
    { url: '/images/instagram/animals/Outside.webp', alt: 'Fun moment' },
    { url: '/images/instagram/animals/Shurik.webp', alt: 'Happy pet' },
    { url: '/images/instagram/animals/Sportive.webp', alt: 'Pet gallery' }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % dogImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + dogImages.length) % dogImages.length)
  }

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <h1>Про КітПес</h1>
        <p>Найкращий готель для вашого улюбленця</p>
      </section>

      {/* About Introduction */}
      <section className="about-intro">
        <div className="intro-content">
          <h2>Ласкаво просимо!</h2>
          <p>
            Зооготель «Кітпес» — це сучасний та комфортний простір для вашого улюбленця. Ми забезпечуємо професійний догляд, безпеку та затишну атмосферу для всіх домашніх тварин.
          </p>
          <p>
            З 2015 року ми служимо улюбленцям та їх власникам, створюючи незабутні враження та забезпечуючи найвищий рівень сервісу.
          </p>
        </div>
      </section>

      {/* Contact Information Blocks */}
      <section className="contact-blocks">
        <h2>Зв'яжіться з нами</h2>
        <div className="blocks-grid">
          {/* Address Block */}
          <div className="contact-block address-block">
            <div className="block-icon">📍</div>
            <h3>Адреса</h3>
            <p>
              вул. Бобринецький шлях, 178<br />
              м. Кропивницький<br />
              Кіровоградська область, Україна
            </p>
          </div>

          {/* Phone Block */}
          <div className="contact-block phone-block">
            <div className="block-icon">📞</div>
            <h3>Телефон</h3>
            <p>
              <a href="tel:+380685746252">+38 (068) 574 62 52</a>
            </p>
            <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
              Доступні 24/7
            </p>
          </div>

          {/* Email Block */}
          <div className="contact-block email-block">
            <div className="block-icon">✉️</div>
            <h3>Email</h3>
            <p>
              <a href="mailto:info@kotopes.kr.ua">info@kotopes.kr.ua</a>
            </p>
            <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
              Відповідаємо протягом дня
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <h2>Знайти нас на карті</h2>
        <div className="map-container">
          <iframe
            title="Kitpes Location"
            src="https://maps.google.com/maps?q=%D0%91%D0%BE%D0%B1%D1%80%D0%B8%D0%BD%D0%B5%D1%86%D1%8C%D0%BA%D0%B8%D0%B9%20%D1%88%D0%BB%D1%8F%D1%85%20178&t=m&z=13&output=embed&iwloc=near"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <p className="map-note">
          Розташовані у місті Кропивницький, легко доступні на автомобілі або громадському транспорті
        </p>
      </section>

      {/* Carousel Section */}
      <section className="carousel-section">
        <h2>Веселі моменти в Готелі 🐕😸</h2>
        <div className="carousel-container">
          <button className="carousel-btn prev" onClick={prevSlide}>❮</button>
          
          <div className="carousel-slide">
            <img 
              src={dogImages[currentSlide].url} 
              alt={dogImages[currentSlide].alt}
              onError={(e) => {
                console.log(e)
                e.target.src = '/images/instagram/animals/animals_dogs_playing.jpg'
              }}
            />
            <p className="slide-description">{dogImages[currentSlide].alt}</p>
          </div>

          <button className="carousel-btn next" onClick={nextSlide}>❯</button>
        </div>

        <div className="carousel-dots">
          {dogImages.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <h2>Готові залишити вашого улюбленця в надійних руках?</h2>
        <p>Зв'яжіться з нами сьогодні, щоб обговорити потреби вашої тварини</p>
        <a href="tel:+380685746252" className="cta-button">
          Позвонити зараз
        </a>
      </section>
    </div>
  )
}
