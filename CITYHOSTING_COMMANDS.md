# CityHosting Deployment Commands

## SSH Access
```bash
ssh user@your-cityhosting-domain.com
# or
ssh -p 2222 user@your-cityhosting-ip.com  # If non-standard port
```

## First-Time Setup

```bash
# 1. Navigate to web root
cd /var/www
# or check with hosting provider for correct path

# 2. Clone repository
git clone https://github.com/IvanRozinko/kotopes.git
cd kotopes

# 3. Install all dependencies
npm install

# 4. Verify build exists
ls -la client/dist/

# 5. Test server locally
NODE_ENV=production PORT=3000 node server/index.js
# Then test in another terminal: curl http://localhost:3000/api/ping
# Press Ctrl+C to stop

# 6. Start with PM2 (recommended)
npm install -g pm2
pm2 start server/index.js --name "kotopes" \
  --env NODE_ENV=production \
  --env PORT=3000

# 7. Make PM2 persistent
pm2 save
pm2 startup
```

## Subsequent Deployments (After pushing new code to GitHub)

```bash
cd /var/www/kotopes

# Pull latest from GitHub
git pull origin main

# Install any new dependencies
npm install

# Rebuild if needed (usually already in dist/)
npm run build

# If using PM2, restart
pm2 restart kotopes

# If using direct start, stop old and start new
# First, find and kill existing process:
ps aux | grep "node server"
kill -9 <PID>

# Then start new
NODE_ENV=production PORT=3000 node server/index.js
```

## PM2 Management Commands

```bash
# Start application
pm2 start server/index.js --name "kotopes" \
  --env NODE_ENV=production \
  --env PORT=3000

# View status
pm2 status

# View logs
pm2 logs kotopes

# Real-time monitoring
pm2 monit

# Restart application
pm2 restart kotopes

# Stop application
pm2 stop kotopes

# Delete from PM2
pm2 delete kotopes

# List saved apps
pm2 list

# Resurrect apps after reboot
pm2 resurrect
```

## Nginx Reverse Proxy Setup

### 1. Create Nginx config file
```bash
sudo nano /etc/nginx/sites-available/kotopes
```

### 2. Add this configuration:
```nginx
server {
    listen 80;
    server_name kotopes.kr.ua www.kotopes.kr.ua;

    # Redirect HTTP to HTTPS (optional, add after SSL setup)
    # return 301 https://$server_name$request_uri;

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
        proxy_redirect off;
    }
}
```

### 3. Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/kotopes /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## SSL/HTTPS with Let's Encrypt

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d kotopes.kr.ua -d www.kotopes.kr.ua

# Auto-renewal (already configured)
sudo systemctl status certbot.timer

# Renew manually if needed
sudo certbot renew --dry-run
sudo certbot renew
```

## Firewall Setup (if using UFW)

```bash
# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Allow SSH (don't lock yourself out!)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Monitoring and Logs

```bash
# PM2 logs
pm2 logs kotopes

# System logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Check if service is running
ps aux | grep node
ps aux | grep nginx

# System resources
top
free -h
df -h
```

## Troubleshooting Commands

```bash
# Check if port 3000 is in use
sudo netstat -tlnp | grep :3000
# or
sudo lsof -i :3000

# Kill process on port 3000
sudo kill -9 <PID>

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx config
sudo nginx -T

# Test connectivity to app
curl http://localhost:3000/api/ping

# SSH into server and test app directly
curl http://your-domain.com/api/ping

# View Node version
node --version
npm --version

# Check disk space
df -h

# Check memory usage
free -h

# View user permissions
whoami
id
```

## Backup & Restore

```bash
# Backup entire application directory
tar -czf kotopes-backup-$(date +%Y%m%d).tar.gz /var/www/kotopes

# Backup specific folder
tar -czf content-backup-$(date +%Y%m%d).tar.gz /var/www/kotopes/content

# List backups
ls -lh /var/www/*.tar.gz

# Restore from backup
tar -xzf kotopes-backup-20231203.tar.gz -C /var/www
```

## Quick Status Check

```bash
# All-in-one status check
echo "=== Node.js ===" && \
node --version && \
echo "=== Git ===" && \
git -C /var/www/kotopes log --oneline -3 && \
echo "=== PM2 ===" && \
pm2 status || echo "PM2 not running" && \
echo "=== Server ===" && \
curl -s http://localhost:3000/api/ping | head -20 && \
echo -e "\n=== Nginx ===" && \
sudo nginx -t && \
echo "=== OK ===" || echo "ERROR"
```

## Live URL After Deployment

Once deployed and Nginx configured:
- **HTTP**: http://kotopes.kr.ua
- **HTTPS**: https://kotopes.kr.ua (after SSL setup)

## Contact Support

If issues arise:
1. Check logs: `pm2 logs kotopes`
2. Test endpoint: `curl http://your-domain/api/ping`
3. Check Nginx: `sudo nginx -t`
4. Check disk space: `df -h`
5. Check memory: `free -h`

---

**Ready to deploy!** Run the First-Time Setup commands above. 🚀
