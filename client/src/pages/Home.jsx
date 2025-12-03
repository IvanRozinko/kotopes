import React from 'react'
import '../styles/Home.css'

export default function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>ЗООГОТЕЛЬ «КітПес»</h1>
          <p className="hero-subtitle">Завжди цікаво та затишно!</p>
        </div>
        <img
          src="/images/originals/wp-content/uploads/2019/07/bgc_resize.jpg"
          alt="KitPes Hotel"
          className="hero-image"
        />
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-box">
          <h2>Зв'яжіться з нами</h2>
          <div className="phone-number">
            <a href="tel:+380685746252"  className="phone"><strong>+38 (068) 574 62 52</strong></a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2>Про нас</h2>
        <div className="about-grid">
          <div className="about-card">
            <h3>Комфорт для вашого улюбленця</h3>
            <p>
              Ми пропонуємо просторі вольєри та клітки, які забезпечують максимальний комфорт для ваших домашніх тварин під час їхнього перебування в нашому зооготелі.
            </p>
          </div>
          <div className="about-card">
            <h3>Професійний догляд</h3>
            <p>
              Наш професійний персонал завжди готовий забезпечити найкращий догляд за вашими улюбленцями. Ми враховуємо всі потреби тварин.
            </p>
          </div>
          <div className="about-card">
            <h3>Навколишнє середовище</h3>
            <p>
              Чистота, порядок та затишна атмосфера — це основні принципи нашої роботи. Вашим тваринам буде цікаво та комфортно.
            </p>
          </div>
        </div>
      </section>

      {/* Accommodation Details Section */}
      <section className="amenities-section">
        <h2>Окремі деталі поселення</h2>
        <div className="amenities-grid">
          <div className="amenity-card">
            <div className="amenity-icon">🏠</div>
            <h3>Комфортні вольєри</h3>
            <p>
              Просторі, добре провітрювані вольєри з м'яким постільним матеріалом та іграшками для розваги ваших улюбленців.
            </p>
          </div>
          <div className="amenity-card">
            <div className="amenity-icon">🍽️</div>
            <h3>Якісне харчування</h3>
            <p>
              Ми використовуємо преміум корми та натуральну їжу з урахуванням дієти та потреб кожної тварини.
            </p>
          </div>
          <div className="amenity-card">
            <div className="amenity-icon">🚶</div>
            <h3>Регулярні прогулянки</h3>
            <p>
              Щоденні прогулянки на свіжому повітрі з професійним персоналом для фізичної активності та здоров'я.
            </p>
          </div>
          <div className="amenity-card">
            <div className="amenity-icon">🏥</div>
            <h3>Медичний нагляд</h3>
            <p>
              Постійна підтримка здоров'я тварин з можливістю екстреної ветеринарної допомоги 24/7.
            </p>
          </div>
          <div className="amenity-card">
            <div className="amenity-icon">🎮</div>
            <h3>Розваги та гра</h3>
            <p>
              Інтерактивні іграшки та ігровий час під нагляддям для розвитку та розважання вашого улюбленця.
            </p>
          </div>
          <div className="amenity-card">
            <div className="amenity-icon">🛁</div>
            <h3>Гігієна та чистота</h3>
            <p>
              Щоденна прибирання вольєрів, ванни та особиста гігієна для комфорту та здоров'я тварин.
            </p>
          </div>
        </div>
      </section>

       {/* Pricing Section */}
      <section className="pricing-section">
        <h2>Вартість проживання за добу</h2>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Дорослі собаки</h3>
            <p className="price">від 200 грн</p>
            <small>без харчування</small>
          </div>
          <div className="pricing-card">
            <h3>Цуценята</h3>
            <p className="price">від 150 грн</p>
            <small>спеціальні умови</small>
          </div>
          <div className="pricing-card">
            <h3>Кішки та кролі</h3>
            <p className="price">від 100 грн</p>
            <small>комфортні клітки</small>
          </div>
          <div className="pricing-card">
            <h3>Знижки та бонуси</h3>
            <p className="price">до 20%</p>
            <small>постійним клієнтам</small>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Готові до бронювання?</h2>
        <p>Зв'яжіться з нами сьогодні, щоб зарезервувати місце для вашого улюбленця</p>
        <button className="cta-button">
          <a href="tel:+380685746252" style={{ color: 'white', textDecoration: 'none' }}>Зв'язатися</a>
        </button>
      </section>
    </div>
  )
}
