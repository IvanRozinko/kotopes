# Monthly Statistics Email System

Automated system to analyze access logs and send monthly statistics reports via email.

## Features

- **Automatic log analysis**: Processes `.gz` compressed access logs
- **Real-time separation**: Distinguishes between real users and bots/crawlers
- **HTML email reports**: Beautiful formatted email with key metrics
- **JSON attachment**: Raw statistics attached to email for further analysis
- **Monthly scheduling**: Runs automatically on the 1st of every month
- **Extensible**: Easy to customize email templates and bot patterns

## Setup

### 1. Install Dependencies

Dependencies are already installed:
```bash
npm install nodemailer node-cron dotenv --save
```

### 2. Configure Email Settings

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your email credentials:

```env
# SMTP Server Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Recipients
FROM_EMAIL=your-email@gmail.com
RECIPIENT_EMAIL=admin@kotopes.kr.ua
```

#### Gmail Configuration
If using Gmail:
1. Enable 2-Factor Authentication on your Google account
2. Create an App Password at: https://myaccount.google.com/apppasswords
3. Use the 16-character app password in `SMTP_PASS`
4. Set `SMTP_HOST=smtp.gmail.com` and `SMTP_PORT=587`

#### Other SMTP Providers
- **Outlook/Office 365**: `smtp.office365.com:587`
- **SendGrid**: `smtp.sendgrid.net:587` (user: `apikey`, pass: API key)
- **Mailgun**: `smtp.mailgun.org:587`
- **Custom SMTP**: Use your provider's settings

### 3. Log File Location

The system expects log files at:
```
../../logs/  (two levels up from project root)
```

Example structure:
```
c:\kotopes\
  logs/
    access.log
    access.log.gz
    access.log.1.gz
  node\kotopes\  (project root)
    stats/
      emailStats.js
      scheduler.js
```

The system automatically finds and processes the latest `access.log*.gz` file.

## Usage

### Test Email Sending (One-time)

Run the stats and email job immediately:
```bash
npm run stats
```

This will:
1. Find the latest log file in `../../logs/`
2. Analyze it with `getStats.js`
3. Generate an HTML report
4. Send an email to `RECIPIENT_EMAIL`
5. Attach raw JSON statistics

### Enable Automatic Monthly Scheduling

Start the scheduler (runs on 1st of every month at 00:00 UTC):
```bash
npm run stats:scheduler
```

**For production**, use a process manager like PM2:
```bash
npm install -g pm2
pm2 start stats/scheduler.js --name "stats-scheduler"
pm2 startup
pm2 save
```

This ensures the scheduler restarts if it crashes or the server reboots.

## Email Report Contents

Each monthly email includes:

### Summary Statistics
- **Total Requests**: All HTTP requests logged
- **Unique Real Users**: IPs classified as humans (not bots)
- **Real User Requests**: HTTP requests from real users
- **Bot/Crawler Requests**: Requests from identified bots

### Top 10 Real Users
Table showing:
- IP Address
- Number of requests
- First appearance time

### Top 10 Bots/Crawlers
Table showing:
- Bot IP Address
- Number of requests
- First appearance time

### JSON Attachment
Raw statistics file for spreadsheet/database import

## Log File Format

The system parses Apache/Nginx access logs (combined format):
```
127.0.0.1 - - [02/Dec/2025:10:15:30 +0000] "GET /api/posts HTTP/1.1" 200 1234 "-" "Mozilla/5.0..."
```

Automatic detection for:
- **Real users**: Modern browsers (Firefox, Chrome, Safari, Edge, etc.)
- **Bots/Crawlers**: Googlebot, Bingbot, Yandex, Ahrefs, Semrush, etc.

Bot patterns can be customized in `stats/getStats.js`.

## Testing

### Test with a sample log file (locally)

Create a test folder and log:
```bash
mkdir -p logs
# Add an access.log or access.log.gz file to the logs folder
```

Then test the emailStats script:
```bash
npm run stats
```

### Check logs directory

```powershell
# Windows
Get-ChildItem C:\kotopes\logs

# Linux/Mac
ls -lh ../../logs/
```

## Troubleshooting

### "No log files found"
- Check that `../../logs/` exists relative to project root
- Ensure files are named `access.log` or `access.log.*.gz`
- Verify file permissions (readable)

### Email not sent: "Missing email configuration"
- Verify `.env` file exists with all required fields
- Check `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `RECIPIENT_EMAIL`
- For Gmail: ensure App Password is used (not regular password)

### Email timeout or connection refused
- Check SMTP credentials
- Verify firewall allows outbound SMTP (port 587 or 465)
- Some ISPs block port 25; use port 587 instead

### Scheduler not running on Windows
- Run as Administrator or use Task Scheduler instead:
  ```bash
  # Windows Task Scheduler setup
  schtasks /create /tn "Kotopes-Stats" /tr "node C:\kotopes\node\kotopes\stats\emailStats.js" /sc MONTHLY /d 1 /st 00:00
  ```

## Files Overview

- `stats/getStats.js`: Parses access logs, generates statistics
- `stats/emailStats.js`: Runs getStats, formats email, sends via SMTP
- `stats/scheduler.js`: Cron scheduler for monthly automation
- `.env.example`: Template for environment configuration
- `package.json`: Dependencies (nodemailer, node-cron, dotenv)

## Security Notes

- **Never commit `.env` file** with real credentials
- Keep `.env` in `.gitignore` (it should already be there)
- Use app-specific passwords (not main account passwords)
- Rotate credentials periodically
- For production, use secrets management (e.g., environment variables on hosting platform)

## Future Enhancements

- [ ] S3 bucket integration for cloud logs
- [ ] Multiple recipient support
- [ ] Custom report templates
- [ ] Comparison with previous months
- [ ] Traffic trending graphs
- [ ] GeoIP location analysis
- [ ] Daily/weekly report options
