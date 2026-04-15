#!/usr/bin/env node
/**
 * Token usage test harness — compares "old" vs "new" approach for one prospect record.
 *
 * OLD approach: Single agent call with full verbose prompt + full why_them context
 *               asking for all fields + outreach_hook in one go, prose output.
 *
 * NEW approach: Two focused calls:
 *   1. Research call — JSON-only output, minimal instructions
 *   2. Hook call    — JSON-only, just business_name + why_them (existing backfill pattern)
 *
 * Runs against a REAL prospect already in the DB (Glenkens Tree Surgeons) so
 * the why_them content is genuine. Does NOT write anything to Supabase.
 */

const https = require('https');
const fs = require('fs');

// ─── Config ──────────────────────────────────────────────────────────────────

const env = Object.fromEntries(
  fs.readFileSync('C:/nithdigital/.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => [l.split('=')[0].trim(), l.slice(l.indexOf('=') + 1).trim()])
);

const ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-6'; // As specified — Sonnet only

// ─── Real prospect record (Glenkens Tree Surgeons — already in DB) ───────────

const REAL_PROSPECT = {
  business_name: 'Glenkens Tree Surgeons',
  url: 'https://www.glenkenstreesurgeons.co.uk/',
  location: 'Dumfries and Galloway (Castle Douglas / Glenkens area)',
  sector: 'Trades & Construction',
  why_them: 'Website exists but is a near-empty Wix shell — no visible gallery, no contact details, no quote form, and no readable content beyond the company name. With 15+ years in business and a family-run operation this is a credible company being let down badly by digital presence. Wix platform also limits SEO performance.'
};

// ─── HTTP helper ──────────────────────────────────────────────────────────────

function callAnthropic(systemPrompt, userMessage, maxTokens = 1024) {
  const body = {
    model: MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }]
  };
  const bodyStr = JSON.stringify(body);
  const options = {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(bodyStr)
    }
  };
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

function tokenReport(label, res) {
  const usage = res.body.usage || {};
  const input = usage.input_tokens || 0;
  const output = usage.output_tokens || 0;
  const total = input + output;
  const outputText = res.body.content?.[0]?.text || '[no output]';
  return { label, input, output, total, outputText };
}

function printReport(r) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  ${r.label}`);
  console.log(`${'─'.repeat(60)}`);
  console.log(`  Input tokens:  ${r.input}`);
  console.log(`  Output tokens: ${r.output}`);
  console.log(`  TOTAL:         ${r.total}`);
  console.log(`\n  Output preview:`);
  console.log(`  ${r.outputText.slice(0, 300).replace(/\n/g, '\n  ')}`);
}

// ═════════════════════════════════════════════════════════════════════════════
// OLD APPROACH — single verbose call, prose output, all fields in one prompt
// ═════════════════════════════════════════════════════════════════════════════

const OLD_SYSTEM = `You are a market research assistant for Nith Digital, a web design agency based in Dumfries & Galloway, Scotland.

Your job is to research local businesses and assess them as sales prospects. For each business you should think carefully about their digital presence, their likely ability to pay for web services, how much they need help, and how well they fit Nith Digital's services.

Nith Digital offers: new websites (£700-£1,800), website rebuilds (£895-£2,000), SEO retainers (£200-£500/month), Google Business Profile management (£150-£300/month), booking system integration (£500-£1,200), and e-commerce add-ons (£800-£2,000).

D&G is a rural area of South West Scotland. Businesses tend to be small, owner-operated, and often have outdated or no web presence. The ideal prospect has been trading for several years, has a real customer base, and is being let down by their digital presence.

For each prospect, provide a thorough assessment covering all the following areas:
- A detailed explanation of why this business is worth targeting
- What service Nith Digital should recommend and why
- A realistic price range
- Scores for need (1-10), ability to pay (1-10), fit with our services (1-10), and accessibility (1-10)
- An overall score out of 10
- A personalised outreach hook sentence for cold email outreach

Please be thorough and detailed in your assessment.`;

const OLD_USER = `Please assess the following business prospect for Nith Digital:

Business Name: ${REAL_PROSPECT.business_name}
Website: ${REAL_PROSPECT.url}
Location: ${REAL_PROSPECT.location}
Sector: ${REAL_PROSPECT.sector}
Research notes: ${REAL_PROSPECT.why_them}

Provide a full prospect assessment including why we should target them, recommended service, price range, scores (need/pay/fit/access/overall), and a personalised outreach hook sentence for cold email.`;

// ═════════════════════════════════════════════════════════════════════════════
// NEW APPROACH — two lean calls, JSON-only output, minimal instructions
// ═════════════════════════════════════════════════════════════════════════════

// Call 1: Score + structure (JSON only)
const NEW_SYSTEM_RESEARCH = `You are a prospect scoring assistant. Return ONLY a JSON object. No explanation, no markdown, no code fences.`;

const NEW_USER_RESEARCH = `Score this business prospect for a D&G web design agency. Return ONLY this JSON:
{"score_need":0,"score_pay":0,"score_fit":0,"score_access":0,"score_overall":0.0,"recommended_service":"","price_range_low":0,"price_range_high":0}

Business: ${REAL_PROSPECT.business_name}
Sector: ${REAL_PROSPECT.sector}
Notes: ${REAL_PROSPECT.why_them}`;

// Call 2: Hook only (same as existing backfill pattern)
const NEW_SYSTEM_HOOK = `You write cold email opening sentences for a web design agency targeting small UK businesses.

Given research notes about a prospect, write exactly ONE sentence that:
- Addresses the business owner in second person (you/your)
- Identifies one specific, observable problem with their online presence
- Sounds like something noticed while casually browsing
- Is 25 words or fewer
- Does NOT start with "I noticed" every time — vary the opener
- Focuses on website issues only

Reply with ONLY the sentence. No quotes. No explanation.`;

const NEW_USER_HOOK = `Business: ${REAL_PROSPECT.business_name}
Sector: ${REAL_PROSPECT.sector}
Notes: ${REAL_PROSPECT.why_them}`;

// ═════════════════════════════════════════════════════════════════════════════
// MAIN
// ═════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('═'.repeat(60));
  console.log('  TOKEN USAGE TEST HARNESS');
  console.log(`  Model: ${MODEL}`);
  console.log(`  Prospect: ${REAL_PROSPECT.business_name}`);
  console.log('  NOTE: Read-only — nothing written to Supabase');
  console.log('═'.repeat(60));

  // ── OLD approach ───────────────────────────────────────────────────────────
  console.log('\nRunning OLD approach (single verbose call)...');
  const oldRes = await callAnthropic(OLD_SYSTEM, OLD_USER, 1024);
  const oldReport = tokenReport('OLD — single verbose call (prose output)', oldRes);
  printReport(oldReport);

  // Small delay between API calls
  await new Promise(r => setTimeout(r, 500));

  // ── NEW approach — call 1: scoring ─────────────────────────────────────────
  console.log('\nRunning NEW approach — call 1 (scoring, JSON only)...');
  const newRes1 = await callAnthropic(NEW_SYSTEM_RESEARCH, NEW_USER_RESEARCH, 256);
  const newReport1 = tokenReport('NEW — call 1: scoring (JSON only)', newRes1);
  printReport(newReport1);

  await new Promise(r => setTimeout(r, 500));

  // ── NEW approach — call 2: hook ────────────────────────────────────────────
  console.log('\nRunning NEW approach — call 2 (hook sentence only)...');
  const newRes2 = await callAnthropic(NEW_SYSTEM_HOOK, NEW_USER_HOOK, 100);
  const newReport2 = tokenReport('NEW — call 2: outreach hook only', newRes2);
  printReport(newReport2);

  // ── Summary ────────────────────────────────────────────────────────────────
  const oldTotal = oldReport.total;
  const newTotal = newReport1.total + newReport2.total;
  const saving = oldTotal - newTotal;
  const savingPct = ((saving / oldTotal) * 100).toFixed(1);

  console.log('\n' + '═'.repeat(60));
  console.log('  SUMMARY');
  console.log('═'.repeat(60));
  console.log(`  Old approach (1 call):         ${oldTotal} tokens`);
  console.log(`  New approach (2 calls):        ${newTotal} tokens`);
  console.log(`    ├─ Scoring call:             ${newReport1.total}`);
  console.log(`    └─ Hook call:                ${newReport2.total}`);
  console.log(`  Saving per record:             ${saving} tokens (${savingPct}%)`);
  console.log(`\n  Projected saving over 306 records:`);
  console.log(`    ${(saving * 306).toLocaleString()} tokens`);
  console.log('═'.repeat(60));
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
