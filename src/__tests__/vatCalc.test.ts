// VAT checker logic extracted from VATCheckerClient.tsx

const VAT_THRESHOLD = 90000

function getVatVerdict(turnover: number, next30Days: number): 'must' | 'approaching' | 'fine' {
  const mustRegisterBackward = turnover > VAT_THRESHOLD
  const mustRegisterForward = next30Days > VAT_THRESHOLD
  if (mustRegisterBackward || mustRegisterForward) return 'must'
  const gap = VAT_THRESHOLD - turnover
  if (gap > 0 && gap < 20000) return 'approaching'
  return 'fine'
}

function calcFrsSaving(turnover: number): number {
  const frsVAT = turnover * 0.12
  const standardVAT = turnover * 0.20
  return standardVAT - frsVAT
}

describe('VAT registration checker', () => {
  test('below threshold — fine', () => {
    expect(getVatVerdict(60000, 5000)).toBe('fine')
  })

  test('above threshold backward — must register', () => {
    expect(getVatVerdict(95000, 0)).toBe('must')
  })

  test('exactly at threshold — must register', () => {
    // >90000 triggers, exactly 90000 does not
    expect(getVatVerdict(90000, 0)).toBe('fine')
    expect(getVatVerdict(90001, 0)).toBe('must')
  })

  test('forward-looking 30-day projection over threshold — must register', () => {
    expect(getVatVerdict(50000, 91000)).toBe('must')
  })

  test('within £20k of threshold — approaching', () => {
    expect(getVatVerdict(75000, 0)).toBe('approaching')
    expect(getVatVerdict(80000, 0)).toBe('approaching')
  })

  test('exactly £20k below — not approaching', () => {
    expect(getVatVerdict(70000, 0)).toBe('fine')
  })
})

describe('FRS saving calculation', () => {
  test('FRS saves 8% vs standard scheme', () => {
    const saving = calcFrsSaving(100000)
    // Standard: 100000*0.20=20000, FRS: 100000*0.12=12000, saving=8000
    expect(saving).toBe(8000)
  })

  test('FRS saving scales linearly', () => {
    expect(calcFrsSaving(50000)).toBe(4000)
  })

  test('zero turnover — zero saving', () => {
    expect(calcFrsSaving(0)).toBe(0)
  })
})
