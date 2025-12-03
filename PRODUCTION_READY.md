# Production Build & Deployment - Quick Reference

## ✅ Build Setup Complete

Your Kotopes project is now configured for production deployment!

### Build Output
- ✅ Build successful: `client/dist/` created with:
  - `index.html` (SPA entry point)
  - `assets/` folder with bundled JavaScript and CSS
  - Optimized with code splitting (vendor bundle separate)
  - Total size: ~189 KB (gzipped: ~60 KB)

### Configuration Summary

| Component | Setting | Details |
|-----------|---------|---------|
| **Build Tool** | Vite | Fast production build with code splitting |
| **Minification** | Terser | JavaScript minification enabled |
| **Bundle** | Vendor splitting | React libraries in separate chunk for caching |
| **Server** | Express | Serves build + API from same port |
| **Node Env** | Production | Set `NODE_ENV=production` to activate |

## 📦 Deployment Steps

### Step 1: Build Locally
```powershell
npm run build
```
Creates production-ready files in `client/dist/`

### Step 2: Verify Locally (Optional)
```powershell
npm run build:prod
```
- Builds React app
- Starts Express on http://localhost:3000
- Test at: http://localhost:3000

### Step 3: Commit to GitHub
```bash
git add -A
git commit -m "Build: production React bundle ready for deployment"
git push origin main
```

### Step 4: Deploy on CityHosting
```bash
# SSH into server
ssh user@your-cityhosting-domain.com

# Navigate to web directory
cd /var/www/kotopes

# Clone repository (first time)
git clone https://github.com/IvanRozinko/kotopes.git .

# Or update existing (subsequent deployments)
git pull origin main

# Install dependencies
npm install

# Start server in production
NODE_ENV=production PORT=3000 node server/index.js
```

### Step 5: Set Up Reverse Proxy (Nginx)
Configure Nginx to route traffic to your Node server (see DEPLOYMENT.md)

### Step 6: Enable HTTPS
Use Let's Encrypt for free SSL certificate (see DEPLOYMENT.md)

## 🚀 Deployment Options for CityHosting

### Option A: Quick Start (Simple)
```bash
NODE_ENV=production PORT=3000 node server/index.js
```
- Works immediately
- Stops if terminal closes
- Good for testing

### Option B: Background Process (Better)
```bash
nohup NODE_ENV=production PORT=3000 node server/index.js > app.log 2>&1 &
```
- Runs in background
- Logs to `app.log`
- Survives terminal logout
- Manual restart needed

### Option C: Process Manager (Best - Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start app with PM2
pm2 start server/index.js \
  --name "kotopes" \
  --env NODE_ENV=production \
  --env PORT=3000

# Make it persistent
pm2 save
pm2 startup
```
- Auto-restart on crashes
- Auto-start on server reboot
- Manage multiple processes
- Monitoring dashboard: `pm2 monit`

## 📁 File Structure After Deployment

```
/var/www/kotopes/
├── client/
│   ├── dist/                 # ← Served by Express
│   │   ├── index.html
│   │   ├── assets/
│   │   │   ├── index-*.js
│   │   │   ├── index-*.css
│   │   │   ├── vendor-*.js
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── index.js              # ← Main entry point
│   └── package.json
├── public/
│   └── images/
│       ├── originals/
│       └── instagram/
├── content/
│   ├── instagram/
│   ├── blog/
│   └── pages/
├── package.json              # ← Root package.json
└── DEPLOYMENT.md
```

## 🔗 What Gets Served

### Frontend Routes (SPA)
All routes served by `client/dist/index.html` via React Router:
- `/` → Home
- `/about` → About
- `/gallery` → Gallery
- `/blog` → Blog
- `/our-boxers` → Our Boxers
- `/blog/:slug` → Individual posts

### API Routes
Backend Express endpoints (unchanged):
- `/api/ping` → Health check
- `/api/posts` → List blog posts
- `/api/posts/:slug` → Get single post
- `/api/pages` → List pages
- `/api/images` → Get Instagram gallery metadata
- `/api/contact` → POST contact form

### Static Assets
Served from disk:
- `/images/` → Original and Instagram images
- `assets/` → Bundled CSS and JavaScript

## 🧪 Testing Checklist

After deploying to CityHosting, verify:

- [ ] Website loads at http://your-domain.com
- [ ] Home page displays correctly
- [ ] Navigation between pages works
- [ ] Images load from `/images/` route
- [ ] API endpoints respond:
  - `curl http://your-domain.com/api/ping`
  - Should return: `{"ok":true}`
- [ ] Blog posts load
- [ ] Contact form works (or at least submits without error)
- [ ] Responsive design on mobile

## 🐛 Troubleshooting

### "Port 3000 already in use"
```bash
# Find process on port 3000
sudo lsof -i :3000

# Kill it
sudo kill -9 <PID>

# Or use different port
NODE_ENV=production PORT=8080 node server/index.js
```

### "Cannot find module" errors
```bash
npm install
node server/index.js
```

### React routing shows 404
- Check that `NODE_ENV=production` is set
- This enables SPA fallback in Express
- Server should route non-API requests to `index.html`

### Images not loading
```bash
# Verify folders exist
ls -la public/images/
ls -la content/instagram/

# Check permissions
chmod -R 755 public/
chmod -R 755 content/
```

### API returns 404
- Check Express routes in `server/index.js`
- Verify content files exist: `content/blog/`, `content/pages/`
- Check logs for errors

## 📊 What's Different in Production

| Aspect | Development | Production |
|--------|-------------|------------|
| Frontend | Vite dev server (:5173) | Express (:3000) |
| Routing | Vite proxy to Express | Direct Express routing |
| Build | Hot reload, not minified | Minified, optimized |
| Static files | Via proxy | Direct from `dist/` |
| API | Via Vite proxy | Direct from Express |
| Performance | Slower (dev mode) | Faster (optimized) |

## 🔐 Security Notes

- Set `NODE_ENV=production` to enable security features
- Configure Nginx with proper headers
- Enable HTTPS with SSL certificate
- Validate all API inputs
- Keep Node.js and packages updated

## 📝 Environment Variables

Set these on production server:

```bash
NODE_ENV=production           # Enable production mode
PORT=3000                     # Server port
# Optional:
LOG_LEVEL=info               # Logging level
CORS_ORIGIN=https://your-domain.com  # CORS restriction
```

## 🔄 Updating After Deployment

To update with new features or fixes:

```bash
# On development machine
npm run build
git add -A
git commit -m "Feature: add xyz"
git push origin main

# On CityHosting server
cd /var/www/kotopes
git pull origin main
npm install  # Only if package.json changed
pm2 restart kotopes  # or restart Express
```

## 📞 Support Resources

- **Vite Docs**: https://vitejs.dev
- **Express Docs**: https://expressjs.com
- **PM2 Docs**: https://pm2.keymetrics.io
- **Nginx Docs**: https://nginx.org/en/docs/
- **Let's Encrypt**: https://letsencrypt.org

---

**Build completed:** December 3, 2025
**Ready for production deployment!** 🚀
