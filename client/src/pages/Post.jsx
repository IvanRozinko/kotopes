import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import '../styles/Post.css'

export default function Post() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch(`/api/posts/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then((data) => {
        if (mounted) setPost(data)
      })
      .catch((err) => {
        if (mounted) setError(err.message || 'Error loading post')
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [slug])

  function transformImageUrl(url) {
    if (!url) return url
    // Leave absolute URLs untouched
    if (/^(https?:)?\/\//.test(url)) return url

    // If it already points to the blog images folder, return as-is
    if (url.startsWith('/images/blog/')) return url

    // If it's an absolute images path like /images/foo.jpg, strip to basename
    if (url.startsWith('/images/')) {
      const name = url.split('/').pop()
      return `/images/blog/${name}`
    }

    // Handle relative paths: ./images/name, images/name or just name
    const name = url.split('/').pop()
    return `/images/blog/${name}`
  }

  const imageComponent = ({ node, ...props }) => {
    const src = transformImageUrl(props.src)
    console.log('Rendering image src:', src)
    return <img {...props} src={src} alt={props.alt || 'Image'} />
  }

  if (loading) return <p>Завантаження...</p>
  if (error) return <p className="error">Помилка: {error}</p>
  if (!post) return <p>Публікація не знайдена.</p>

  // Replace raw HTML <img> tags with Markdown image syntax so ReactMarkdown handles them consistently
  const rawHtmlImgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>|<img\s+[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']+)["'][^>]*>|<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi

  const renderContent = (post.content || '').replace(rawHtmlImgRegex, (match, src1, alt1, alt2, src2, src3) => {
    const src = src1 || src2 || src3 || ''
    const alt = alt1 || alt2 || ''
    return `![${alt}](${transformImageUrl(src)})`
  })

  return (
    <article className="post-article">
      <section className="post-content">
        <ReactMarkdown 
          rehypePlugins={[rehypeRaw]}
          components={{ img: imageComponent }}
        >
          {renderContent}
        </ReactMarkdown>
      </section>
    </article>
  )
}
