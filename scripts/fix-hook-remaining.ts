import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function wordCount(s: string): number {
  return s.trim().split(/\s+/).length;
}

async function main() {
  // Fetch all remaining hooks over 25 words
  const { data, error } = await supabase
    .from('prospects')
    .select('id, business_name, outreach_hook')
    .not('outreach_hook', 'is', null);

  if (error || !data) {
    console.error('Error:', error);
    process.exit(1);
  }

  const over25 = data.filter(r => r.outreach_hook && wordCount(r.outreach_hook) > 25);
  console.log(`Hooks still over 25 words: ${over25.length}`);
  over25.forEach(r => {
    console.log(JSON.stringify({ id: r.id, name: r.business_name, words: wordCount(r.outreach_hook), hook: r.outreach_hook }));
  });
}

main();
