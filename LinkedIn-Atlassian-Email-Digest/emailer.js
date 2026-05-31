const nodemailer = require('nodemailer');

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

function buildHtmlEmail(posts, checkDate) {
  const postRows = posts.map(post => `
    <div style="border:1px solid #e0e0e0;border-radius:8px;padding:20px;margin-bottom:20px;background:#fff;">
      <div style="font-size:13px;color:#666;margin-bottom:10px;">
        ${post.timeText ? `🕐 ${post.timeText}` : ''}
        ${post.likes ? `&nbsp;&nbsp;👍 ${post.likes}` : ''}
        ${post.comments ? `&nbsp;&nbsp;💬 ${post.comments}` : ''}
      </div>
      ${post.imageUrl ? `<img src="${post.imageUrl}" alt="post image" style="max-width:100%;border-radius:6px;margin-bottom:12px;" />` : ''}
      <p style="font-size:15px;color:#1a1a1a;line-height:1.6;white-space:pre-wrap;margin:0 0 12px 0;">${escapeHtml(post.text.slice(0, 600))}${post.text.length > 600 ? '…' : ''}</p>
      ${post.postUrl ? `<a href="${post.postUrl}" style="color:#0077b5;font-size:13px;text-decoration:none;">LinkedIn에서 전체 보기 →</a>` : ''}
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Atlassian LinkedIn 업데이트 다이제스트</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:640px;margin:0 auto;padding:24px 16px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0052cc 0%,#0747a6 100%);border-radius:12px;padding:28px 24px;margin-bottom:24px;text-align:center;">
      <img src="https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/apple-touch-icon.png"
           alt="Atlassian" width="48" height="48" style="border-radius:8px;margin-bottom:12px;" />
      <h1 style="color:#fff;font-size:22px;margin:0 0 6px 0;">Atlassian LinkedIn 다이제스트</h1>
      <p style="color:#b8d0f9;font-size:13px;margin:0;">${checkDate} 기준 &nbsp;·&nbsp; 새 게시물 ${posts.length}건</p>
    </div>

    <!-- Body -->
    ${posts.length > 0 ? postRows : `
      <div style="text-align:center;padding:40px;color:#666;background:#fff;border-radius:8px;">
        <p style="font-size:16px;">이번 주기에 새 게시물이 없습니다.</p>
      </div>
    `}

    <!-- Footer -->
    <div style="text-align:center;padding:20px;color:#999;font-size:12px;">
      <p style="margin:0;">이 메일은 <strong>LinkedIn Atlassian Email Digest</strong> 서비스에서 자동으로 발송되었습니다.</p>
      <p style="margin:4px 0 0 0;">
        <a href="https://www.linkedin.com/company/atlassian/posts/" style="color:#0077b5;text-decoration:none;">Atlassian LinkedIn 페이지 방문</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendDigestEmail(posts, recipients) {
  const transport = createTransport();
  const checkDate = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  await transport.sendMail({
    from: `"Atlassian Digest" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to: recipients.join(', '),
    subject: `[Atlassian] LinkedIn 새 게시물 ${posts.length}건 — ${new Date().toLocaleDateString('ko-KR')}`,
    html: buildHtmlEmail(posts, checkDate),
    text: posts.map(p => `${p.timeText}\n${p.text}\n${p.postUrl}\n`).join('\n---\n')
  });

  console.log(`Digest sent to: ${recipients.join(', ')}`);
}

module.exports = { sendDigestEmail };
