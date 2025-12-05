#!/usr/bin/env node
/**
 * Monthly Stats Email Scheduler
 * Runs every 1st of the month at 00:00
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const cron = require('node-cron');
const { spawn } = require('child_process');
const path = require('path');

// Schedule task: every 1st of the month at 00:00
// Cron format: minute hour day month dayOfWeek
const CRON_EXPRESSION = '0 0 1 * *';

console.log('📅 Monthly Stats Email Scheduler started');
console.log(`⏰ Scheduled to run at: ${CRON_EXPRESSION} (every 1st of the month at 00:00 UTC)`);

const task = cron.schedule(CRON_EXPRESSION, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Running monthly stats job at ${new Date().toLocaleString()}`);
  console.log(`${'='.repeat(60)}\n`);

  const emailProcess = spawn('node', [path.join(__dirname, 'emailStats.js')]);

  emailProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  emailProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  emailProcess.on('close', (code) => {
    if (code === 0) {
      console.log(`\n✅ Job completed successfully at ${new Date().toLocaleString()}\n`);
    } else {
      console.error(`\n❌ Job failed with exit code ${code}\n`);
    }
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down scheduler...');
  task.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Shutting down scheduler...');
  task.stop();
  process.exit(0);
});
