import { createClient } from "@supabase/supabase-js"
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main() {
  const { count: total } = await s.from("prospects").select("*", { count: "exact", head: true })
  const { count: withEmail } = await s.from("prospects").select("*", { count: "exact", head: true }).not("contact_email", "is", null)
  const { count: phoneOnly } = await s.from("prospects").select("*", { count: "exact", head: true }).not("contact_phone", "is", null).is("contact_email", null)
  const { count: neither } = await s.from("prospects").select("*", { count: "exact", head: true }).is("contact_email", null).is("contact_phone", null)
  const { count: emailHighScore } = await s.from("prospects").select("*", { count: "exact", head: true }).not("contact_email", "is", null).gte("score_overall", 6.5)
  console.log("Total:", total)
  console.log("With email:", withEmail)
  console.log("Phone only:", phoneOnly)
  console.log("Neither:", neither)
  console.log("Email + score >= 6.5:", emailHighScore)
}
main()
