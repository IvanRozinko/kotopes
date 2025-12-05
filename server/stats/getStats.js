#!/usr/bin/env node
/**
 * Node.js log analyzer
 * - Reads access.log or access.log.gz
 * - Produces stats.json with separated bots and real users
 */

const fs = require('fs');
const zlib = require('zlib');
const readline = require('readline');

const inputFile = process.argv[2] || 'access.log';
const outputFile = process.argv[3] || 'stats.json';

// Regex patterns
const ipRegex = /^(\d+\.\d+\.\d+\.\d+)/;
const timeRegex = /\[(\d{2}\/\w{3}\/\d{4}:\d{2}:\d{2}:\d{2})/;
const uaRegex = /"[^"]*" "([^"]*)"/;

// Known bot patterns
const botPatterns = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /googlebot/i,
  /bingbot/i,
  /yandex/i,
  /baidu/i,
  /facebookexternalhit/i,
  /pingdom/i,
  /ahrefs/i,
  /semrush/i,
  /mj12bot/i,
  /cloudflare/i,
  /curl/i,
];

const stats = {
  totalRequests: 0,
  realUsers: {},
  bots: {},
  startTime: null,
  endTime: null,
};

function isBot(ua) {
  if (!ua || ua === '-') return true;
  return botPatterns.some((pat) => pat.test(ua));
}

function register(statsObj, ip, time) {
  if (!statsObj[ip]) statsObj[ip] = { count: 0, firstSeen: time, lastSeen: time };
  statsObj[ip].count++;
  if (time < statsObj[ip].firstSeen) statsObj[ip].firstSeen = time;
  if (time > statsObj[ip].lastSeen) statsObj[ip].lastSeen = time;
}

async function processFile(stream) {
  const rl = readline.createInterface({ input: stream });

  for await (const line of rl) {
    stats.totalRequests++;

    const ipMatch = line.match(ipRegex);
    const timeMatch = line.match(timeRegex);
    const uaMatch = line.match(uaRegex);

    if (!ipMatch || !timeMatch) continue;

    const ip = ipMatch[1];
    const time = timeMatch[1];
    const ua = uaMatch ? uaMatch[1] : '-';

    const date = new Date(time); // parsed timestamp

    if (!stats.startTime || date < stats.startTime) stats.startTime = date;
    if (!stats.endTime || date > stats.endTime) stats.endTime = date;

    if (isBot(ua)) { 
        register(stats.bots, ip, date); 
        stats.botsCount ? stats.botsCount++ : stats.botsCount = 1;
    } else {
        register(stats.realUsers, ip, date);
        stats.realUsersCount ? stats.realUsersCount++ : stats.realUsersCount = 1;
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(stats, null, 2));
  console.log(`Stats written to ${outputFile}`);
}

// Detect .gz
if (inputFile.endsWith('.gz')) {
  const gzStream = fs.createReadStream(inputFile).pipe(zlib.createGunzip());
  processFile(gzStream);
} else {
  const fileStream = fs.createReadStream(inputFile);
  processFile(fileStream);
}
