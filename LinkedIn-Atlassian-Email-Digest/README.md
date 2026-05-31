# Atlassian LinkedIn Email Digest

Atlassian의 LinkedIn 공식 계정 새 게시물을 자동으로 감지하여 이메일 다이제스트로 발송하는 Node.js 앱입니다.

## 기능

- Atlassian LinkedIn 페이지 자동 크롤링 (Puppeteer)
- 새 게시물만 감지 (중복 방지)
- HTML 이메일 다이제스트 자동 발송 (Nodemailer)
- Cron 스케줄 기반 정기 실행
- 웹 대시보드에서 수신자·스케줄 설정, 즉시 실행 가능

## 빠른 시작

### 1. 설치

```bash
cd LinkedIn-Atlassian-Email-Digest
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열어 다음 항목을 입력합니다:

| 변수 | 설명 |
|------|------|
| `SMTP_HOST` | SMTP 서버 (기본: smtp.gmail.com) |
| `SMTP_PORT` | 포트 (기본: 587) |
| `SMTP_USER` | 발신 이메일 계정 |
| `SMTP_PASS` | 앱 비밀번호 (Gmail의 경우 App Password) |
| `FROM_EMAIL` | 발신자 이메일 |
| `TO_EMAILS` | 수신자 이메일 (쉼표로 구분) |
| `CRON_SCHEDULE` | 실행 주기 Cron (기본: `0 9 * * *`) |
| `LINKEDIN_EMAIL` | LinkedIn 로그인 이메일 (선택, 비로그인 크롤링 제한 시) |
| `LINKEDIN_PASS` | LinkedIn 비밀번호 (선택) |

> **Gmail 앱 비밀번호 발급**: Google 계정 → 보안 → 2단계 인증 → 앱 비밀번호

### 3. 실행

```bash
npm start
```

브라우저에서 `http://localhost:3000` 으로 접속하면 웹 대시보드를 사용할 수 있습니다.

## 웹 대시보드

| 기능 | 설명 |
|------|------|
| 현황 카드 | 서비스 상태, 수신자 수, 마지막 실행 정보 |
| 서비스 토글 | 자동 모니터링 ON/OFF |
| 지금 실행 | 스케줄과 무관하게 즉시 실행 |
| 설정 저장 | 수신자 이메일, Cron 주기 변경 |
| 실행 로그 | 최근 50건의 실행 기록 |

## 아키텍처

```
server.js     Express API + Cron 스케줄러
scraper.js    Puppeteer LinkedIn 크롤러
emailer.js    Nodemailer HTML 이메일 발송
index.html    웹 대시보드 프론트엔드
```

## 주의사항

- LinkedIn 크롤링은 LinkedIn 서비스 약관에 위배될 수 있습니다. 개인 학습·연구 목적으로만 사용하세요.
- LinkedIn은 비로그인 상태에서 공개 페이지를 제한적으로 노출합니다. 더 안정적인 크롤링을 위해 `LINKEDIN_EMAIL` / `LINKEDIN_PASS` 설정을 권장합니다.
- 서버를 24시간 운영하려면 PM2, Docker, 혹은 클라우드 VM을 사용하세요.

## PM2로 백그라운드 실행 (선택)

```bash
npm install -g pm2
pm2 start server.js --name atlassian-digest
pm2 save
pm2 startup
```
