// Lightweight Supabase REST client for edge functions.
// Uses fetch directly — no @supabase/ssr dependency — to keep Worker bundle small.

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

type QueryResult<T> = Promise<{ data: T[] | null; error: string | null }>

export function edgeSupabase(table: string) {
  return {
    select(columns = '*') {
      const params = new URLSearchParams({ select: columns })
      const filters: string[] = []
      const orders: string[] = []
      let limitVal = ''
      let rangeHeader = ''

      const chain = {
        eq(col: string, val: string | boolean) {
          filters.push(`${col}=eq.${val}`)
          return chain
        },
        neq(col: string, val: string) {
          filters.push(`${col}=neq.${val}`)
          return chain
        },
        order(col: string, opts?: { ascending?: boolean }) {
          orders.push(`${col}.${opts?.ascending === false ? 'desc' : 'asc'}`)
          return chain
        },
        limit(n: number) {
          limitVal = String(n)
          return chain
        },
        range(from: number, to: number) {
          rangeHeader = `${from}-${to}`
          return chain
        },
        single() {
          limitVal = '1'
          return {
            then: (resolve: (v: { data: Record<string, unknown> | null; error: string | null }) => void) => {
              const url = buildUrl()
              fetch(url, { headers: buildHeaders() })
                .then(r => r.json())
                .then((rows: Record<string, unknown>[]) => {
                  resolve({ data: rows?.[0] ?? null, error: null })
                })
                .catch(e => resolve({ data: null, error: String(e) }))
            },
          }
        },
        then<T>(resolve: (v: { data: T[] | null; count: number; error: string | null }) => void): void {
          const url = buildUrl()
          fetch(url, { headers: buildHeaders(true) })
            .then(async r => {
              const data = await r.json() as T[]
              const countHeader = r.headers.get('content-range')
              const count = countHeader ? parseInt(countHeader.split('/')[1] || '0') : 0
              resolve({ data, count, error: null })
            })
            .catch(e => resolve({ data: null, count: 0, error: String(e) }))
        },
      }

      function buildUrl() {
        if (filters.length) filters.forEach(f => params.append(f.split('=')[0], f.split('=').slice(1).join('=')))
        if (orders.length) params.set('order', orders.join(','))
        if (limitVal) params.set('limit', limitVal)
        const url = `${URL}/rest/v1/${table}?${params}`
        return url
      }

      function buildHeaders(count = false) {
        const h: Record<string, string> = {
          apikey: KEY,
          Authorization: `Bearer ${KEY}`,
        }
        if (count) h['Prefer'] = 'count=exact'
        if (rangeHeader) h['Range'] = rangeHeader
        return h
      }

      return chain
    },
  }
}
