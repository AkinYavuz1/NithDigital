/**
 * generate-design-pdf.js
 * Renders design-N.html files to PDFs using Edge headless.
 * Falls back to a jspdf summary PDF if Edge is not found.
 *
 * Usage:
 *   node src/scripts/generate-design-pdf.js <client-slug>
 */

const fs = require('fs')
const path = require('path')
const { execSync, spawnSync } = require('child_process')

const clientSlug = process.argv[2]
if (!clientSlug) {
  console.error('Usage: node generate-design-pdf.js <client-slug>')
  process.exit(1)
}

const designsDir = path.join(process.cwd(), 'designs', clientSlug)
if (!fs.existsSync(designsDir)) {
  console.error(`Designs folder not found: ${designsDir}`)
  process.exit(1)
}

// ─── Find Edge executable ─────────────────────────────────────────────────────

function resolveEdgePath() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ]
  // Also check PATH
  try {
    const result = spawnSync('where', ['msedge'], { encoding: 'utf8' })
    if (result.stdout && result.stdout.trim()) {
      candidates.unshift(result.stdout.trim().split('\n')[0].trim())
    }
  } catch {}

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate
  }
  return null
}

// ─── Render with Edge headless ────────────────────────────────────────────────

function renderWithEdge(edgePath, htmlFile, pdfFile) {
  // Build a valid Windows file URI: file:///C:/path/to/file.html
  const fileUri = 'file:///' + htmlFile.replace(/\\/g, '/').replace(/^([a-zA-Z]):/, '$1:')
  const cmd = [
    `"${edgePath}"`,
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--print-to-pdf="${pdfFile}"`,
    '--print-to-pdf-no-header',
    '--no-margins',
    `"${fileUri}"`,
  ].join(' ')

  console.log(`  Rendering with Edge: ${path.basename(htmlFile)}`)
  try {
    execSync(cmd, { timeout: 30000, stdio: 'pipe' })
    // Edge may create the file with a slightly different name; check
    if (fs.existsSync(pdfFile)) {
      const stat = fs.statSync(pdfFile)
      console.log(`  ✓ ${path.basename(pdfFile)} (${Math.round(stat.size / 1024)}KB)`)
      return true
    }
    console.warn(`  Edge ran but PDF not found at ${pdfFile}`)
    return false
  } catch (err) {
    console.warn(`  Edge rendering failed: ${err.message}`)
    return false
  }
}

// ─── jsPDF fallback ───────────────────────────────────────────────────────────

function renderWithJspdf(htmlFile, pdfFile, designNum) {
  try {
    const { jsPDF } = require('jspdf')
    const html = fs.readFileSync(htmlFile, 'utf-8')

    // Extract design metadata from the label bar
    const labelMatch = html.match(/Design\s+(\d+)\s+of\s+3\s*\|([^<]+)/i)
    const labelText = labelMatch ? labelMatch[0] : `Design ${designNum}`

    // Extract hex colours
    const hexRe = /#([0-9a-fA-F]{6})\b/g
    const colors = new Set()
    let m
    while ((m = hexRe.exec(html)) !== null) colors.add('#' + m[1])
    const colorList = Array.from(colors).slice(0, 7)

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const W = 210
    let y = 15

    // Header
    doc.setFontSize(16)
    doc.setTextColor(30, 30, 30)
    doc.text(`Nith Digital — Design Proposal`, W / 2, y, { align: 'center' })
    y += 8
    doc.setFontSize(11)
    doc.setTextColor(80, 80, 80)
    doc.text(labelText.substring(0, 100), W / 2, y, { align: 'center' })
    y += 10

    // Divider
    doc.setDrawColor(200, 200, 200)
    doc.line(15, y, W - 15, y)
    y += 8

    // Color swatches
    doc.setFontSize(12)
    doc.setTextColor(30, 30, 30)
    doc.text('Colour Palette', 15, y)
    y += 6
    const swatchSize = 18
    const swatchGap = 22
    colorList.forEach((hex, i) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      doc.setFillColor(r, g, b)
      doc.setDrawColor(180, 180, 180)
      doc.rect(15 + i * swatchGap, y, swatchSize, swatchSize, 'FD')
      doc.setFontSize(7)
      doc.setTextColor(60, 60, 60)
      doc.text(hex, 15 + i * swatchGap, y + swatchSize + 4)
    })
    y += swatchSize + 12

    // Note about HTML
    doc.setFontSize(11)
    doc.setTextColor(50, 50, 50)
    doc.text('Full visual mockup available as HTML:', 15, y)
    y += 6
    doc.setFontSize(9)
    doc.setTextColor(0, 80, 160)
    doc.text(htmlFile, 15, y)
    y += 10

    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text('Open the HTML file in any browser for the full interactive preview at 1440px.', 15, y)
    y += 10

    // Divider
    doc.setDrawColor(200, 200, 200)
    doc.line(15, y, W - 15, y)
    y += 8

    // Extract text content summary
    const textRe = /<(?:h1|h2|h3|p)[^>]*>([^<]{10,200})<\/(?:h1|h2|h3|p)>/gi
    const texts = []
    let tm
    while ((tm = textRe.exec(html)) !== null && texts.length < 12) {
      const t = tm[1].trim()
      if (t.length > 10 && !t.includes('{') && !t.includes('@')) texts.push(t)
    }

    doc.setFontSize(11)
    doc.setTextColor(30, 30, 30)
    doc.text('Copy Preview', 15, y)
    y += 6
    doc.setFontSize(9)
    doc.setTextColor(60, 60, 60)
    for (const t of texts.slice(0, 10)) {
      const lines = doc.splitTextToSize('• ' + t, W - 30)
      doc.text(lines, 15, y)
      y += lines.length * 5 + 1
      if (y > 270) break
    }

    doc.save(pdfFile)
    const stat = fs.statSync(pdfFile)
    console.log(`  ✓ ${path.basename(pdfFile)} [jspdf fallback] (${Math.round(stat.size / 1024)}KB)`)
    return true
  } catch (err) {
    console.error(`  jspdf fallback also failed: ${err.message}`)
    return false
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const htmlFiles = fs.readdirSync(designsDir)
    .filter(f => f.match(/^design-\d+\.html$/))
    .sort()
    .map(f => path.join(designsDir, f))

  if (htmlFiles.length === 0) {
    console.error(`No design-N.html files found in ${designsDir}`)
    process.exit(1)
  }

  console.log(`\nGenerating PDFs for ${clientSlug} (${htmlFiles.length} designs)...`)

  const edgePath = resolveEdgePath()
  if (edgePath) {
    console.log(`  Edge found: ${edgePath}`)
  } else {
    console.log('  Edge not found — using jspdf fallback')
  }

  let successCount = 0
  for (let i = 0; i < htmlFiles.length; i++) {
    const htmlFile = htmlFiles[i]
    const pdfFile = htmlFile.replace(/\.html$/, '.pdf')
    const designNum = i + 1

    let ok = false
    if (edgePath) {
      ok = renderWithEdge(edgePath, htmlFile, pdfFile)
    }
    if (!ok) {
      ok = renderWithJspdf(htmlFile, pdfFile, designNum)
    }
    if (ok) successCount++
  }

  console.log(`\nDone: ${successCount}/${htmlFiles.length} PDFs generated`)
  console.log(`Location: ${designsDir}`)

  if (successCount < htmlFiles.length) {
    console.log('\nNote: Some PDFs used the jspdf fallback (colour swatches + copy preview).')
    console.log('Open the .html files in a browser for the full visual mockup.')
  }
}

main().catch(err => { console.error(err); process.exit(1) })
