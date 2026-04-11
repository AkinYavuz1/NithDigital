/**
 * gsc-auth.ts
 *
 * One-off OAuth helper: exchanges an authorization code for a refresh token
 * you can store in .env.local as GSC_REFRESH_TOKEN.
 *
 * Usage:
 *   1. Set GSC_CLIENT_ID and GSC_CLIENT_SECRET in .env.local first
 *   2. Run: npx ts-node scripts/gsc-auth.ts
 *   3. Open the printed URL in a browser, sign in with the Google account
 *      that owns nithdigital.uk in Search Console, click Allow
 *   4. Browser will redirect to http://localhost/?code=...  (the page won't load,
 *      that's fine — we just need the `code` value from the URL bar)
 *   5. Paste the code back into this script when prompted
 *   6. Copy the printed refresh_token into .env.local as GSC_REFRESH_TOKEN
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import * as readline from 'readline'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const CLIENT_ID = process.env.GSC_CLIENT_ID
const CLIENT_SECRET = process.env.GSC_CLIENT_SECRET
const REDIRECT_URI = 'http://localhost'
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('ERROR: set GSC_CLIENT_ID and GSC_CLIENT_SECRET in .env.local first.')
  process.exit(1)
}

const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
authUrl.searchParams.set('client_id', CLIENT_ID)
authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
authUrl.searchParams.set('response_type', 'code')
authUrl.searchParams.set('scope', SCOPE)
authUrl.searchParams.set('access_type', 'offline')
authUrl.searchParams.set('prompt', 'consent')

console.log('\n1. Open this URL in your browser:\n')
console.log(authUrl.toString())
console.log('\n2. Sign in with the Google account that has access to nithdigital.uk in Search Console.')
console.log('3. Click Allow.')
console.log('4. Browser will fail to load http://localhost/?code=...&scope=...  — that is fine.')
console.log('5. Copy the ENTIRE `code` parameter value from the URL bar (between code= and &scope).\n')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

rl.question('Paste the code here: ', async (code) => {
  rl.close()
  const trimmed = code.trim()
  if (!trimmed) {
    console.error('No code provided.')
    process.exit(1)
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: trimmed,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('\nToken exchange failed:', data)
    process.exit(1)
  }

  if (!data.refresh_token) {
    console.error('\nNo refresh_token returned. Revoke access at https://myaccount.google.com/permissions and try again with prompt=consent.')
    console.error('Raw response:', data)
    process.exit(1)
  }

  console.log('\n✓ Success. Add this line to .env.local:\n')
  console.log(`GSC_REFRESH_TOKEN=${data.refresh_token}`)
  console.log('\nThen run: npx ts-node scripts/sync-gsc.ts --backfill 1m')
})
