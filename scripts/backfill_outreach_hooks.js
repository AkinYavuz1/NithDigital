#!/usr/bin/env node
/**
 * Backfill outreach_hook for all prospects where why_them is set but outreach_hook is null.
 * Uses claude-haiku-4-5-20251001 to generate a single, natural cold-email opener sentence.
 * Processes in batches of 20 for efficiency.
 */

const https = require('https');
const fs = require('fs');

// Load env
const env = Object.fromEntries(
  fs.readFileSync('C:/nithdigital/.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => [l.split('=')[0].trim(), l.slice(l.indexOf('=') + 1).trim()])
);

const ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;
const SUPABASE_URL = 'https://mrdozyxbonbukpmywxqi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZG96eXhib25idWtwbXl3eHFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIxMzgwNiwiZXhwIjoyMDkwNzg5ODA2fQ.RbS9M0NHEKZmDSGx_OEr9kE_kMAh5PpzJoEwFEimu-k';

const BATCH_SIZE = 20;
const MODEL = 'claude-haiku-4-5-20251001';

// ─── HTTP helpers ────────────────────────────────────────────────────────────

function httpsRequest(options, body) {
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
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function supabaseRequest(method, path, body) {
  const url = new URL(path, SUPABASE_URL);
  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    }
  };
  return httpsRequest(options, body);
}

function anthropicRequest(messages) {
  const body = {
    model: MODEL,
    max_tokens: 200,
    system: SYSTEM_PROMPT,
    messages
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

// ─── Fetch all prospects ─────────────────────────────────────────────────────

async function fetchAllProspects() {
  const path = '/rest/v1/prospects?select=id,business_name,sector,why_them&why_them=not.is.null&outreach_hook=is.null&order=id&limit=1000';
  const res = await supabaseRequest('GET', path);
  if (res.status !== 200 || !Array.isArray(res.body)) {
    throw new Error(`Failed to fetch prospects: ${res.status} ${JSON.stringify(res.body).substring(0, 200)}`);
  }
  return res.body;
}

// ─── Generate hook via Claude ────────────────────────────────────────────────

const SYSTEM_PROMPT = `You write cold email opening sentences for a web design agency targeting small UK businesses.

Given internal research notes about a prospect, write exactly ONE sentence that:
- Addresses the business owner in second person (you/your)
- Identifies one specific, observable problem with their online presence
- Sounds like something noticed while casually browsing — not a scraped data report
- Is 25 words or fewer
- Does NOT mention internal sales notes like "Easy close", "Upsell", "Gas Safe registered", "TRSS-approved", star ratings, or review counts
- Does NOT always start with "I noticed" — vary the opener naturally
- Focuses on website issues (not loading on mobile, outdated design, no booking system, not appearing in search, no website at all, broken features, slow load times, etc.)

Reply with ONLY the sentence. No quotes. No explanation. No preamble.`;

async function generateHook(prospect) {
  const userMsg = `Business: ${prospect.business_name}
Sector: ${prospect.sector}
Research notes: ${prospect.why_them}`;

  const res = await anthropicRequest([
    { role: 'user', content: userMsg }
  ]);

  if (res.status !== 200 || !res.body.content) {
    throw new Error(`Anthropic error ${res.status}: ${JSON.stringify(res.body).substring(0, 300)}`);
  }

  const text = res.body.content[0]?.text?.trim();
  if (!text) throw new Error('Empty response from Claude');
  return text;
}

// ─── Update prospect in Supabase ─────────────────────────────────────────────

async function updateHook(id, hook) {
  const path = `/rest/v1/prospects?id=eq.${id}`;
  const res = await supabaseRequest('PATCH', path, { outreach_hook: hook });
  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Supabase update failed for ${id}: ${res.status} ${JSON.stringify(res.body).substring(0, 200)}`);
  }
  return true;
}

// ─── Process a single batch ──────────────────────────────────────────────────

async function processBatch(batch, batchNum, totalBatches) {
  console.log(`\nBatch ${batchNum}/${totalBatches} — processing ${batch.length} prospects...`);
  const results = { success: 0, failed: 0, errors: [] };

  for (const prospect of batch) {
    try {
      const hook = await generateHook(prospect);
      await updateHook(prospect.id, hook);
      console.log(`  ✓ ${prospect.business_name}: "${hook}"`);
      results.success++;
    } catch (err) {
      console.error(`  ✗ ${prospect.business_name} (${prospect.id}): ${err.message}`);
      results.failed++;
      results.errors.push({ id: prospect.id, business: prospect.business_name, error: err.message });
    }

    // Small delay to avoid hammering APIs
    await new Promise(r => setTimeout(r, 100));
  }

  return results;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Fetching prospects from Supabase...');
  const prospects = await fetchAllProspects();
  console.log(`Found ${prospects.length} prospects needing outreach_hook backfill.`);

  if (prospects.length === 0) {
    console.log('Nothing to do.');
    return;
  }

  // Split into batches
  const batches = [];
  for (let i = 0; i < prospects.length; i += BATCH_SIZE) {
    batches.push(prospects.slice(i, i + BATCH_SIZE));
  }
  console.log(`Processing ${batches.length} batches of up to ${BATCH_SIZE}...`);

  let totalSuccess = 0;
  let totalFailed = 0;
  const allErrors = [];

  for (let i = 0; i < batches.length; i++) {
    const result = await processBatch(batches[i], i + 1, batches.length);
    totalSuccess += result.success;
    totalFailed += result.failed;
    allErrors.push(...result.errors);
    console.log(`  Batch done: ${result.success} ok, ${result.failed} failed. Running total: ${totalSuccess}/${prospects.length}`);
  }

  console.log('\n═══════════════════════════════════════');
  console.log(`COMPLETE`);
  console.log(`  Successfully updated: ${totalSuccess}`);
  console.log(`  Failed:               ${totalFailed}`);
  console.log(`  Total prospects:      ${prospects.length}`);

  if (allErrors.length > 0) {
    console.log('\nFailed records:');
    allErrors.forEach(e => console.log(`  - [${e.id}] ${e.business}: ${e.error}`));
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
