// Generates a 640x640 TradeDesk profile image as SVG, saved to public/tradedesk-profile.svg
// Run: node scripts/generate-tradedesk-logo.mjs

import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1B2A4A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f1e36;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="640" height="640" fill="url(#bg)" rx="80"/>

  <!-- Chat bubble (WhatsApp style) -->
  <path
    d="M200 160 L440 160 Q480 160 480 200 L480 340 Q480 380 440 380 L350 380 L310 430 L270 380 L200 380 Q160 380 160 340 L160 200 Q160 160 200 160 Z"
    fill="#D4A84B"
    opacity="0.15"
  />
  <path
    d="M200 155 L440 155 Q485 155 485 200 L485 340 Q485 385 440 385 L352 385 L310 438 L268 385 L200 385 Q155 385 155 340 L155 200 Q155 155 200 155 Z"
    fill="none"
    stroke="#D4A84B"
    stroke-width="8"
  />

  <!-- Spanner/wrench icon inside bubble -->
  <g transform="translate(220, 210) scale(1)">
    <!-- Wrench body -->
    <path
      d="M 60 20 C 40 20 25 35 25 55 C 25 65 29 74 36 80 L 10 145 C 7 152 10 160 17 163 C 24 166 32 163 35 156 L 61 91 C 63 91 65 92 67 92 C 87 92 102 77 102 57 C 102 50 100 44 96 39 L 78 57 L 65 57 L 58 44 L 76 26 C 71 22 66 20 60 20 Z"
      fill="#D4A84B"
      stroke="#D4A84B"
      stroke-width="2"
      stroke-linejoin="round"
    />
  </g>

  <!-- TD monogram -->
  <text
    x="320"
    y="510"
    font-family="Georgia, serif"
    font-size="52"
    font-weight="700"
    fill="#D4A84B"
    text-anchor="middle"
    letter-spacing="6"
  >TRADEDESK</text>

  <!-- Tagline -->
  <text
    x="320"
    y="555"
    font-family="Arial, sans-serif"
    font-size="22"
    fill="rgba(245,240,230,0.5)"
    text-anchor="middle"
    letter-spacing="2"
  >by Nith Digital</text>

  <!-- Gold accent line -->
  <line x1="200" y1="475" x2="440" y2="475" stroke="#D4A84B" stroke-width="2" opacity="0.4"/>
</svg>`

const outPath = join(__dirname, '..', 'public', 'tradedesk-profile.svg')
writeFileSync(outPath, svg, 'utf8')
console.log('✓ Saved to public/tradedesk-profile.svg')
console.log('  Upload this file to Twilio as the TradeDesk profile photo.')
console.log('  For a PNG version, open in Chrome and screenshot, or use:')
console.log('  https://cloudconvert.com/svg-to-png')
