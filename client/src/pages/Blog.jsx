import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Blog.css'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch('/api/posts')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load posts')
        return res.json()
      })
      .then((data) => {
        if (mounted) setPosts(data)
      })
      .catch((err) => {
        if (mounted) setError(err.message || 'Error')
      })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  function formatDate(d) {
    if (!d) return ''
    try {
      const dt = new Date(d)
      return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    } catch (e) { return d }
  }

  return (
    <div className="blog-page">
      <h2>Блог</h2>

      {loading && <p>Завантаження...</p>}
      {error && <p className="error">Помилка: {error}</p>}

      {!loading && !error && (
        <div className="posts-grid">
          {posts.map((p) => (
            <article key={p.slug} className="post-card">
              <h3><Link to={`/blog/${p.slug}`}>{p.title}</Link></h3>
              {p.date && <div className="post-date">{formatDate(p.date)}</div>}
              {p.excerpt && <p className="post-excerpt">{p.excerpt}</p>}
              <Link to={`/blog/${p.slug}`} className="read-more">Читайте далі →</Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
