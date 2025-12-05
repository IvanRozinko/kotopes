#!/usr/bin/env node
/**
 * Email Monthly Statistics
 * - Runs getStats.js on the latest log file
 * - Generates an HTML report
 * - Sends it via email
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { spawn } = require('child_process');

// Config from environment variables
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;

// Get the latest log file from logs folder (4 levels up: server/stats -> server -> root -> node -> kotopes parent)
function getLatestLogFile() {
  const logsDir = path.join(__dirname, '..', '..', '..', '..', 'logs');
  
  if (!fs.existsSync(logsDir)) {
    console.warn(`Logs directory not found: ${logsDir}`);
    console.log(`Note: logs should be at: C:\\kotopes\\logs`);
    return null;
  }

  const files = fs.readdirSync(logsDir)
    .filter(f => f.includes('kotopes.kr.ua.access.log') && (f.endsWith('.gz')))
    .sort()
    .reverse();

  return files.length > 0 ? path.join(logsDir, files[0]) : null;
}

// Run getStats.js and return promise with stats
function runGetStats(logFile, outputFile) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [
      path.join(__dirname, 'getStats.js'),
      logFile,
      outputFile
    ]);

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        const stats = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
        resolve(stats);
      } else {
        reject(new Error(`getStats.js exited with code ${code}: ${stderr}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

// Generate HTML email content
function generateEmailHTML(stats, logFileName) {
  const totalRealUsers = Object.keys(stats.realUsers || {}).length;
  const totalBots = Object.keys(stats.bots || {}).length;
  const startTime = stats.startTime ? new Date(stats.startTime).toLocaleString() : 'N/A';
  const endTime = stats.endTime ? new Date(stats.endTime).toLocaleString() : 'N/A';

  const topRealUsers = Object.entries(stats.realUsers || {})
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([ip, data]) => `<tr><td>${ip}</td><td>${data.count}</td><td>${data.firstSeen}</td></tr>`)
    .join('');

  const topBots = Object.entries(stats.bots || {})
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([ip, data]) => `<tr><td>${ip}</td><td>${data.count}</td><td>${data.firstSeen}</td></tr>`)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 900px; margin: 0 auto; padding: 20px; }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
        .stat-box { background: #ecf0f1; padding: 15px; border-radius: 5px; border-left: 4px solid #3498db; }
        .stat-label { font-weight: bold; color: #7f8c8d; font-size: 0.9em; }
        .stat-value { font-size: 2em; color: #2c3e50; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #3498db; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #bdc3c7; }
        tr:hover { background: #ecf0f1; }
        .period { color: #7f8c8d; font-style: italic; margin: 10px 0; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #bdc3c7; color: #95a5a6; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📊 Monthly Site Statistics Report</h1>
        
        <p class="period">
          <strong>Log File:</strong> ${logFileName}<br>
          <strong>Period:</strong> ${startTime} to ${endTime}
        </p>

        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-label">Total Requests</div>
            <div class="stat-value">${(stats.totalRequests || 0).toLocaleString()}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Unique Real Users</div>
            <div class="stat-value">${totalRealUsers.toLocaleString()}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Real User Requests</div>
            <div class="stat-value">${(stats.realUsersCount || 0).toLocaleString()}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Bot/Crawler Requests</div>
            <div class="stat-value">${(stats.botsCount || 0).toLocaleString()}</div>
          </div>
        </div>

        <h2>🔝 Top 10 Real Users (by requests)</h2>
        <table>
          <thead>
            <tr>
              <th>IP Address</th>
              <th>Requests</th>
              <th>First Seen</th>
            </tr>
          </thead>
          <tbody>
            ${topRealUsers || '<tr><td colspan="3">No data</td></tr>'}
          </tbody>
        </table>

        <h2>🤖 Top 10 Bots/Crawlers (by requests)</h2>
        <table>
          <thead>
            <tr>
              <th>IP Address</th>
              <th>Requests</th>
              <th>First Seen</th>
            </tr>
          </thead>
          <tbody>
            ${topBots || '<tr><td colspan="3">No data</td></tr>'}
          </tbody>
        </table>

        <div class="footer">
          <p>This is an automated report generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send email
async function sendEmail(htmlContent, stats, logFileName) {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !RECIPIENT_EMAIL) {
    throw new Error('Missing email configuration. Please set SMTP_HOST, SMTP_USER, SMTP_PASS, and RECIPIENT_EMAIL in .env');
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    secure: SMTP_PORT === '465',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates
    },
  });

  const subject = `kotopes.kr.ua Monthly Stats - ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;

  const mailOptions = {
    from: FROM_EMAIL,
    to: RECIPIENT_EMAIL,
    subject: subject,
    html: htmlContent,
    attachments: [
      {
        filename: `stats-${new Date().toISOString().split('T')[0]}.json`,
        content: JSON.stringify(stats, null, 2),
      },
    ],
  };

  return transporter.sendMail(mailOptions);
}

// Main
async function main() {
  try {
    console.log('📧 Starting monthly stats email job...');

    const logFile = getLatestLogFile();
    if (!logFile) {
      throw new Error('No log files found in logs folder');
    }

    console.log(`📄 Processing log file: ${logFile}`);

    const outputFile = path.join(__dirname, `stats-${Date.now()}.json`);
    const stats = await runGetStats(logFile, outputFile);

    console.log(`✅ Stats generated: ${stats.totalRequests} total requests, ${Object.keys(stats.realUsers).length} unique IPs`);

    const htmlContent = generateEmailHTML(stats, path.basename(logFile));
    const result = await sendEmail(htmlContent, stats, path.basename(logFile));

    console.log(`✉️  Email sent successfully! Message ID: ${result.messageId}`);

    // Clean up temp stats file
    fs.unlinkSync(outputFile);
    console.log('✨ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
