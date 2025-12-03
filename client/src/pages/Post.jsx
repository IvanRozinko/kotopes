import React from 'react'
import { useParams } from 'react-router-dom'

export default function Post() {
  const { slug } = useParams()
  return (
    <article>
      <h2>Post: {slug}</h2>
      <p>This is a placeholder for post content. We'll load Markdown or CMS content here.</p>
    </article>
  )
}
