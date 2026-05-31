require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const { scrapeAtlassianPosts } = require('./scraper');
const { sendDigestEmail } = require('./emailer');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const LOG_FILE = path.join(__dirname, 'digest-log.json');
const CONFIG_FILE = path.join(__dirname, 'config.json');

function loadConfig() {
  const defaults = {
    recipients: (process.env.TO_EMAILS || '').split(',').filter(Boolean),
    schedule: process.env.CRON_SCHEDULE || '0 9 * * *',
    enabled: true,
    lastRun: null,
    lastPostCount: 0
  };
  if (!fs.existsSync(CONFIG_FILE)) return defaults;
  try {
    return { ...defaults, ...JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')) };
  } catch {
    return defaults;
  }
}

function saveConfig(cfg) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), 'utf8');
}

function loadLog() {
  if (!fs.existsSync(LOG_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function appendLog(entry) {
  const log = loadLog();
  log.unshift({ ...entry, timestamp: new Date().toISOString() });
  fs.writeFileSync(LOG_FILE, JSON.stringify(log.slice(0, 50), null, 2), 'utf8');
}

let cronJob = null;

async function runDigest() {
  const config = loadConfig();
  console.log(`[${new Date().toISOString()}] Running digest check...`);
  try {
    const posts = await scrapeAtlassianPosts();
    config.lastRun = new Date().toISOString();
    config.lastPostCount = posts.length;
    saveConfig(config);

    if (posts.length > 0 && config.recipients.length > 0) {
      await sendDigestEmail(posts, config.recipients);
      appendLog({ status: 'sent', postCount: posts.length, recipients: config.recipients });
    } else if (posts.length === 0) {
      appendLog({ status: 'no_new_posts', postCount: 0 });
    } else {
      appendLog({ status: 'skipped_no_recipients', postCount: posts.length });
    }

    return { success: true, posts };
  } catch (err) {
    console.error('Digest error:', err.message);
    appendLog({ status: 'error', error: err.message });
    throw err;
  }
}

function startCron(schedule) {
  if (cronJob) cronJob.stop();
  cronJob = cron.schedule(schedule, runDigest, { timezone: 'Asia/Seoul' });
  console.log(`Cron scheduled: ${schedule}`);
}

// ── API Routes ────────────────────────────────────────────────

app.get('/api/status', (req, res) => {
  const config = loadConfig();
  res.json({
    enabled: config.enabled,
    schedule: config.schedule,
    recipients: config.recipients,
    lastRun: config.lastRun,
    lastPostCount: config.lastPostCount,
    log: loadLog().slice(0, 10)
  });
});

app.post('/api/config', (req, res) => {
  const config = loadConfig();
  const { recipients, schedule, enabled } = req.body;
  if (recipients !== undefined) config.recipients = recipients;
  if (schedule !== undefined) {
    if (!cron.validate(schedule)) {
      return res.status(400).json({ error: 'Invalid cron expression' });
    }
    config.schedule = schedule;
    if (config.enabled) startCron(config.schedule);
  }
  if (enabled !== undefined) {
    config.enabled = enabled;
    if (enabled) startCron(config.schedule);
    else if (cronJob) { cronJob.stop(); cronJob = null; }
  }
  saveConfig(config);
  res.json({ success: true, config });
});

app.post('/api/run-now', async (req, res) => {
  try {
    const result = await runDigest();
    res.json({ success: true, newPostCount: result.posts.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/log', (req, res) => {
  res.json(loadLog());
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Start ──────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  const config = loadConfig();
  if (config.enabled) startCron(config.schedule);
});
