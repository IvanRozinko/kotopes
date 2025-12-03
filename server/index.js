const path = require('path')
const express = require('express')
const cors = require('cors')
const fs = require('fs').promises
const matter = require('gray-matter')

const app = express()
app.use(cors())
app.use(express.json())

// Serve public static files (images)
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')))

// Serve React build in production
const buildPath = path.join(__dirname, '..', 'client', 'dist')
if (process.env.NODE_ENV !== 'development') {
  // Serve static files from React build
  app.use(express.static(buildPath))
}

const CONTENT_DIR = path.join(__dirname, '..', 'content')
const DATA_DIR = path.join(__dirname, '..', 'data')

async function loadMarkdownDir(dir) {
  try {
    const files = await fs.readdir(dir)
    const items = []
    for (const file of files) {
      if (!file.endsWith('.md')) continue
      const full = path.join(dir, file)
      const raw = await fs.readFile(full, 'utf8')
      const parsed = matter(raw)
      const meta = parsed.data || {}
      meta.slug = meta.slug || file.replace(/\.md$/, '')
      items.push({ ...meta, content: parsed.content })
    }
    return items
  } catch (err) {
    return []
  }
}

app.get('/api/ping', (req, res) => res.json({ ok: true }))

app.get('/api/pages', async (req, res) => {
  const pagesDir = path.join(CONTENT_DIR, 'pages')
  const pages = await loadMarkdownDir(pagesDir)
  res.json(pages.map(p => ({ title: p.title, slug: p.slug, description: p.description || '' })))
})

app.get('/api/posts', async (req, res) => {
  const postsDir = path.join(CONTENT_DIR, 'blog')
  const posts = await loadMarkdownDir(postsDir)
  // sort by date if present
  posts.sort((a, b) => (a.date < b.date ? 1 : -1))
  res.json(posts.map(p => ({ title: p.title, slug: p.slug, date: p.date, excerpt: p.excerpt })))
})

app.get('/api/posts/:slug', async (req, res) => {
  const postsDir = path.join(CONTENT_DIR, 'blog')
  const posts = await loadMarkdownDir(postsDir)
  const post = posts.find(p => p.slug === req.params.slug)
  if (!post) return res.status(404).json({ error: 'Not found' })
  res.json(post)
})

// Images endpoint: serve Instagram gallery metadata
app.get('/api/images', async (req, res) => {
  try {
    const imagesFile = path.join(CONTENT_DIR, 'instagram', 'all-images.json')
    const data = await fs.readFile(imagesFile, 'utf8')
    const images = JSON.parse(data)
    
    // Add full path to each image
    const enriched = images.map(img => ({
      ...img,
      url: `/images/instagram/${img.category}/${img.filename}`
    }))
    
    res.json(enriched)
  } catch (err) {
    console.error('Failed to load images:', err)
    res.json([])
  }
})

// Serve Instagram images as static files
app.use('/images/instagram', express.static(path.join(__dirname, '..', 'content', 'instagram')))

// Contact endpoint: append messages to data/contacts.json (no external SMTP configured)
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {}
  if (!name || !email || !message) return res.status(400).json({ error: 'name, email and message are required' })
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    const contactsFile = path.join(DATA_DIR, 'contacts.json')
    let list = []
    try {
      const raw = await fs.readFile(contactsFile, 'utf8')
      list = JSON.parse(raw)
    } catch (e) {
      list = []
    }
    const record = { name, email, message, receivedAt: new Date().toISOString(), ip: req.ip }
    list.push(record)
    await fs.writeFile(contactsFile, JSON.stringify(list, null, 2), 'utf8')
    // In future: send email via SMTP or transactional provider
    res.status(201).json({ ok: true })
  } catch (err) {
    console.error('contact save error', err)
    res.status(500).json({ error: 'Failed to save message' })
  }
})

// SPA fallback: serve index.html for non-API routes in production
if (process.env.NODE_ENV !== 'development') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'))
  })
}

const port = process.env.PORT || 3000
const env = process.env.NODE_ENV || 'development'
app.listen(port, () => console.log(`Server listening on http://localhost:${port} (${env} mode)`))
