import React from 'react'
import { Link } from 'react-router-dom'

const SAMPLE_POSTS = [
  { slug: 'welcome', title: 'Welcome to Kotopes' },
  { slug: 'our-first-boxer', title: 'Наші боксери — знайомство' }
]

export default function Blog() {
  return (
    <div>
      <h2>Blog</h2>
      <ul>
        {SAMPLE_POSTS.map(p => (
          <li key={p.slug}><Link to={`/blog/${p.slug}`}>{p.title}</Link></li>
        ))}
      </ul>
    </div>
  )
}
