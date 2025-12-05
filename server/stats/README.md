# Monthly Statistics Email System

Automated system to analyze access logs and send monthly statistics reports via email.

## Features

- **Automatic log analysis**: Processes `.gz` compressed access logs
- **Real-time separation**: Distinguishes between real users and bots/crawlers
- **HTML email reports**: Beautiful formatted email with key metrics
- **JSON attachment**: Raw statistics attached to email for further analysis
- **Monthly scheduling**: Runs automatically on the 1st of every month
- **Extensible**: Easy to customize email templates and bot patterns

## Files

- `getStats.js` - Parses access logs and generates statistics JSON
- `emailStats.js` - Processes logs and sends email reports
- `scheduler.js` - Cron scheduler for monthly automation

## Setup

### 1. Email Configuration

Edit the root `.env` file with your SMTP credentials:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
RECIPIENT_EMAIL=admin@kotopes.kr.ua
```

### 2. Log File Location

The system looks for log files at `C:\kotopes\logs\`:
- `access.log` - Current log (uncompressed)
- `access.log.gz` - Compressed log
- `access.log.*.gz` - Rotated logs

## Usage

### Test Email Sending

```bash
npm run stats
```

### Start Scheduler (Production)

Using PM2:
```bash
pm2 start server/stats/scheduler.js --name "stats-scheduler"
pm2 startup
pm2 save
```

### Check Scheduler Status

```bash
pm2 status
pm2 logs stats-scheduler
```

## Log Format

Expects Apache/Nginx combined format:
```
192.168.1.1 - - [05/Dec/2025:10:15:30 +0000] "GET / HTTP/1.1" 200 5234 "-" "Mozilla/5.0..."
```

Bot detection automatically identifies:
- Googlebot, Bingbot, Yandex, Baidu
- Ahrefs, Semrush, SEMrush
- Facebook, Pingdom crawlers
- And more...

## Troubleshooting

### "No log files found"
- Ensure `C:\kotopes\logs\` exists with `.gz` files

### Email not sent: SSL certificate error
- Already handled: `rejectUnauthorized: false` allows self-signed certs

### Missing `.env` configuration
- Copy `.env.example` to `.env` and fill in SMTP details

## For production (Cityhosting)

Since global npm packages aren't allowed on shared hosting, use the cPanel cron job instead:

1. Go to cPanel > Cron Jobs
2. Add: `node /path/to/server/stats/emailStats.js`
3. Set to run: 1st of month at 00:00
