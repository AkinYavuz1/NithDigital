/**
 * One-time script to get a Google Calendar OAuth refresh token.
 * Uses the existing GSC OAuth client (desktop app flow).
 *
 * Run: node scripts/get-calendar-token.mjs
 * Then paste the code shown in the browser, and copy the refresh_token into .env.local
 */

import { createServer } from 'http'
import { URL } from 'url'

// Reads from env — set these before running:
// GSC_CLIENT_ID and GSC_CLIENT_SECRET are already in .env.local
// Run with: node -r dotenv/config scripts/get-calendar-token.mjs
const CLIENT_ID = process.env.GSC_CLIENT_ID || process.env.GOOGLE_CALENDAR_CLIENT_ID
const CLIENT_SECRET = process.env.GSC_CLIENT_SECRET || process.env.GOOGLE_CALENDAR_CLIENT_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Error: GSC_CLIENT_ID and GSC_CLIENT_SECRET must be set in environment')
  process.exit(1)
}
const REDIRECT_URI = 'http://localhost:3333/callback'

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
].join(' ')

const authUrl =
  `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${encodeURIComponent(CLIENT_ID)}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&access_type=offline` +
  `&prompt=consent`

console.log('\n=== Google Calendar OAuth Token Generator ===\n')
console.log('1. Open this URL in your browser:\n')
console.log(authUrl)
console.log('\n2. Authorise with your Google account (hello@nithdigital.uk)')
console.log('3. You will be redirected to localhost — the token will be printed here.\n')

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:3333')
  if (url.pathname !== '/callback') {
    res.end('Not found')
    return
  }

  const code = url.searchParams.get('code')
  if (!code) {
    res.end('No code in callback')
    return
  }

  res.end('<h2>Got the code! Check your terminal for the refresh token.</h2>')

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  })

  const tokens = await tokenRes.json()

  if (tokens.error) {
    console.error('\nError exchanging code:', tokens)
    server.close()
    return
  }

  console.log('\n=== SUCCESS — add these to your .env.local ===\n')
  console.log(`GOOGLE_CALENDAR_CLIENT_ID=${CLIENT_ID}`)
  console.log(`GOOGLE_CALENDAR_CLIENT_SECRET=${CLIENT_SECRET}`)
  console.log(`GOOGLE_CALENDAR_REFRESH_TOKEN=${tokens.refresh_token}`)
  console.log(`GOOGLE_CALENDAR_ID=primary`)
  console.log('\n==============================================\n')

  server.close()
})

server.listen(3333, () => {
  console.log('Waiting for OAuth callback on http://localhost:3333/callback ...\n')
})
