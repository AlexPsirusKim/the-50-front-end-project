const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SEEN_POSTS_FILE = path.join(__dirname, 'seen-posts.json');
const ATLASSIAN_LINKEDIN_URL = 'https://www.linkedin.com/company/atlassian/posts/';

function loadSeenPosts() {
  if (!fs.existsSync(SEEN_POSTS_FILE)) return new Set();
  try {
    const data = JSON.parse(fs.readFileSync(SEEN_POSTS_FILE, 'utf8'));
    return new Set(data);
  } catch {
    return new Set();
  }
}

function saveSeenPosts(seenSet) {
  fs.writeFileSync(SEEN_POSTS_FILE, JSON.stringify([...seenSet]), 'utf8');
}

async function loginLinkedIn(page, email, password) {
  await page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle2' });
  await page.type('#username', email, { delay: 50 });
  await page.type('#password', password, { delay: 50 });
  await page.click('[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
}

async function scrapeAtlassianPosts() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1280,900'
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  await page.setViewport({ width: 1280, height: 900 });

  try {
    if (process.env.LINKEDIN_EMAIL && process.env.LINKEDIN_PASS) {
      console.log('Logging in to LinkedIn...');
      await loginLinkedIn(page, process.env.LINKEDIN_EMAIL, process.env.LINKEDIN_PASS);
    }

    console.log('Navigating to Atlassian LinkedIn page...');
    await page.goto(ATLASSIAN_LINKEDIN_URL, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for posts to load
    await page.waitForSelector('[data-urn], .feed-shared-update-v2, .occludable-update', {
      timeout: 15000
    }).catch(() => console.log('Post selector timeout — trying anyway'));

    // Scroll to load more posts
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 800));
      await new Promise(r => setTimeout(r, 1500));
    }

    const posts = await page.evaluate(() => {
      const results = [];
      const postEls = document.querySelectorAll(
        '[data-urn*="activity"], .feed-shared-update-v2, .occludable-update'
      );

      postEls.forEach(el => {
        const urnAttr = el.getAttribute('data-urn') || el.getAttribute('data-id') || '';
        const id = urnAttr || el.querySelector('a[href*="activity"]')?.href || '';

        const textEl = el.querySelector(
          '.feed-shared-text, .feed-shared-update-v2__description, .break-words'
        );
        const text = textEl ? textEl.innerText.trim() : '';

        const timeEl = el.querySelector('time, .feed-shared-actor__sub-description');
        const timeText = timeEl ? (timeEl.getAttribute('datetime') || timeEl.innerText.trim()) : '';

        const linkEl = el.querySelector('a[href*="activity"]');
        const postUrl = linkEl ? linkEl.href : '';

        const imgEl = el.querySelector('.feed-shared-image img, .ivm-view-attr__img--centered');
        const imageUrl = imgEl ? imgEl.src : '';

        const likesEl = el.querySelector(
          '.social-counts-reactions__count, [aria-label*="reaction"], .social-action-bar__reactions-count'
        );
        const likes = likesEl ? likesEl.innerText.trim() : '0';

        const commentsEl = el.querySelector(
          '[aria-label*="comment"], .social-action-bar__comments-count'
        );
        const comments = commentsEl ? commentsEl.innerText.trim() : '0';

        if (text && id) {
          results.push({ id, text, timeText, postUrl, imageUrl, likes, comments });
        }
      });

      return results;
    });

    const seenPosts = loadSeenPosts();
    const newPosts = posts.filter(p => !seenPosts.has(p.id));

    // Mark all current posts as seen
    posts.forEach(p => seenPosts.add(p.id));
    saveSeenPosts(seenPosts);

    console.log(`Found ${posts.length} posts, ${newPosts.length} new.`);
    return newPosts;
  } finally {
    await browser.close();
  }
}

module.exports = { scrapeAtlassianPosts };
