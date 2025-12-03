# Deployment Guide - Kotopes

## Local Build & Development

### Development Mode (Vite + Express)
```bash
npm run dev
```
- Frontend: http://localhost:5173 (Vite dev server with hot reload)
- Backend: http://localhost:3000 (Express API)
- Vite proxies `/api` and `/images` to Express

### Production Build (Locally)
```bash
npm run build
```
- Builds React app to `client/dist/`
- Build output ready for deployment

### Test Production Locally
```bash
npm run build:prod
```
- Builds React app
- Starts Express on port 3000
- Serves built React from `client/dist/`
- Visit http://localhost:3000

## GitHub Deployment

### 1. Build Locally
```bash
npm run build
```

### 2. Add Build to Git
```bash
# Remove dist from .gitignore if present
git add client/dist/
git add -A
git commit -m "Build: production React build"
git push origin main
```

### 3. Verify on GitHub
- Check that `client/dist/` folder is in repository
- Contains `index.html`, `assets/`, etc.

## CityHosting Deployment

### Prerequisites
- SSH access to CityHosting server
- Node.js 18+ installed on server
- Git installed on server

### Deployment Steps

#### 1. SSH into Server
```bash
ssh user@your-cityhosting-domain.com
```

#### 2. Clone Repository (First Time)
```bash
cd /var/www  # or your web root
git clone https://github.com/IvanRozinko/kotopes.git
cd kotopes
npm install
```

#### 3. Update from GitHub (Subsequent Updates)
```bash
cd /var/www/kotopes
git pull origin main
npm install  # if package.json changed
```

#### 4. Start Server in Production
```bash
# Option A: Direct start (test only)
NODE_ENV=production PORT=3000 node server/index.js

# Option B: Using PM2 (Recommended for persistence)
npm install -g pm2
pm2 start server/index.js --name "kotopes" --env NODE_ENV=production --env PORT=3000
pm2 save
pm2 startup
```

#### 5. Configure Web Server (Nginx Reverse Proxy)

Create `/etc/nginx/sites-available/kotopes` (if using Nginx):
```nginx
server {
    listen 80;
    server_name kotopes.kr.ua www.kotopes.kr.ua;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/kotopes /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Setup SSL with Let's Encrypt (HTTPS)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d kotopes.kr.ua -d www.kotopes.kr.ua
```

### Monitoring

#### Check PM2 Status
```bash
pm2 status
pm2 logs kotopes
pm2 monit
```

#### View Server Logs
```bash
cd /var/www/kotopes
tail -f nohup.out  # if using nohup
```

#### Restart Application
```bash
pm2 restart kotopes
```

## Post-Deployment Checklist

- [ ] Build produced successfully (`npm run build`)
- [ ] `client/dist/` committed to GitHub
- [ ] Server running on CityHosting
- [ ] Test API endpoints: `curl http://your-domain/api/ping`
- [ ] Test React routes: Visit http://your-domain (should load home page)
- [ ] Check images load: Verify `/images/` route works
- [ ] Test API calls: Blog posts, images, contact form

## Environment Variables

Set on CityHosting server (via PM2 or systemd):
```bash
NODE_ENV=production
PORT=3000
# Optional:
LOG_LEVEL=info
```

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### Port 3000 already in use
```bash
# Kill process on port 3000
sudo lsof -i :3000
sudo kill -9 <PID>

# Or use different port
NODE_ENV=production PORT=8080 node server/index.js
```

### API requests return 404
- Ensure Express API routes (`/api/*`) are configured
- Check that `server/index.js` is the entry point
- Verify `content/` and `data/` folders exist on server

### Static files (images) not loading
- Verify `public/` folder exists
- Check permissions: `chmod -R 755 public/`
- Verify `content/instagram/` folder exists

## Updating Content

### Blog Posts
1. Add/edit Markdown files in `content/blog/`
2. Commit and push: `git push origin main`
3. Pull on server: `cd /var/www/kotopes && git pull`
4. No rebuild needed for content changes

### Images
1. Add images to `content/instagram/<category>/`
2. Update `content/instagram/all-images.json` with metadata
3. Commit and push
4. Pull on server

## Continuous Deployment (Optional)

For automatic deployment on push, consider:
- GitHub Actions to build and push to server
- Webhooks to trigger `git pull` + `pm2 restart` on server
- Deploy services like Vercel, Netlify, Railway

