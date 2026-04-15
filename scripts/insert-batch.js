#!/usr/bin/env node
/**
 * Generic batch insert script — reads JSON from stdin or a file arg, inserts into prospects.
 * Usage: node insert-batch.js records.json
 *        echo '[{...}]' | node insert-batch.js
 */
const https = require('https');
const fs = require('fs');

const env = Object.fromEntries(
  fs.readFileSync('C:/nithdigital/.env.local', 'utf8')
    .split('\n').filter(l => l.includes('='))
    .map(l => [l.split('=')[0].trim(), l.slice(l.indexOf('=') + 1).trim()])
);
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const input = process.argv[2] ? fs.readFileSync(process.argv[2], 'utf8') : fs.readFileSync('/dev/stdin', 'utf8');
const records = JSON.parse(input);

const bodyStr = JSON.stringify(records);
const options = {
  hostname: 'mrdozyxbonbukpmywxqi.supabase.co',
  path: '/rest/v1/prospects',
  method: 'POST',
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    'content-length': Buffer.byteLength(bodyStr)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    const body = JSON.parse(data);
    if (Array.isArray(body)) {
      console.log(`Inserted ${body.length} records:`);
      body.forEach(r => console.log(`  [${r.id.slice(0,8)}] ${r.business_name} | hook: "${r.outreach_hook}"`));
    } else {
      console.error('Error:', JSON.stringify(body, null, 2));
    }
  });
});
req.on('error', e => console.error('Error:', e.message));
req.write(bodyStr);
req.end();
