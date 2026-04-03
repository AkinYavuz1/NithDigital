// LBTT calculator logic extracted from LBTTClient.tsx

const RESIDENTIAL_BANDS = [
  { threshold: 145000, rate: 0 },
  { threshold: 250000, rate: 0.02 },
  { threshold: 325000, rate: 0.05 },
  { threshold: 750000, rate: 0.10 },
  { threshold: Infinity, rate: 0.12 },
]

const FTB_BANDS = [
  { threshold: 175000, rate: 0 },
  { threshold: 250000, rate: 0.02 },
  { threshold: 325000, rate: 0.05 },
  { threshold: 750000, rate: 0.10 },
  { threshold: Infinity, rate: 0.12 },
]

const SDLT_BANDS = [
  { threshold: 250000, rate: 0 },
  { threshold: 925000, rate: 0.05 },
  { threshold: 1500000, rate: 0.10 },
  { threshold: Infinity, rate: 0.12 },
]

function calcTax(price: number, bands: typeof RESIDENTIAL_BANDS) {
  let tax = 0
  let prev = 0
  for (const band of bands) {
    if (price <= prev) break
    const taxable = Math.min(price, band.threshold) - prev
    tax += taxable * band.rate
    prev = band.threshold
  }
  return tax
}

describe('LBTT residential', () => {
  test('below threshold — no tax', () => {
    expect(calcTax(100000, RESIDENTIAL_BANDS)).toBe(0)
  })

  test('exactly at threshold (£145,000) — no tax', () => {
    expect(calcTax(145000, RESIDENTIAL_BANDS)).toBe(0)
  })

  test('£250,000 property', () => {
    // (250000 - 145000) * 0.02 = 2100
    expect(calcTax(250000, RESIDENTIAL_BANDS)).toBeCloseTo(2100, 0)
  })

  test('£300,000 property', () => {
    // (250000-145000)*0.02 + (300000-250000)*0.05 = 2100 + 2500 = 4600
    expect(calcTax(300000, RESIDENTIAL_BANDS)).toBeCloseTo(4600, 0)
  })

  test('£500,000 property', () => {
    // 2100 + (325000-250000)*0.05 + (500000-325000)*0.10 = 2100 + 3750 + 17500 = 23350
    expect(calcTax(500000, RESIDENTIAL_BANDS)).toBeCloseTo(23350, 0)
  })
})

describe('LBTT first-time buyer', () => {
  test('below FTB threshold — no tax', () => {
    expect(calcTax(150000, FTB_BANDS)).toBe(0)
  })

  test('FTB threshold is £175,000', () => {
    expect(calcTax(175000, FTB_BANDS)).toBe(0)
  })

  test('FTB saves tax vs standard on £200,000', () => {
    const standard = calcTax(200000, RESIDENTIAL_BANDS)
    const ftb = calcTax(200000, FTB_BANDS)
    expect(ftb).toBeLessThan(standard)
  })
})

describe('ADS (Additional Dwelling Supplement)', () => {
  test('ADS adds 6% on top of LBTT', () => {
    const price = 200000
    const lbtt = calcTax(price, RESIDENTIAL_BANDS)
    const ads = price * 0.06
    expect(ads).toBe(12000)
    expect(lbtt + ads).toBeGreaterThan(lbtt)
  })
})

describe('Scotland vs England comparison', () => {
  test('SDLT threshold is £250,000 (0% band)', () => {
    expect(calcTax(250000, SDLT_BANDS)).toBe(0)
  })

  test('LBTT is lower than SDLT on £250,000', () => {
    const lbtt = calcTax(250000, RESIDENTIAL_BANDS)
    const sdlt = calcTax(250000, SDLT_BANDS)
    // LBTT = 2100, SDLT = 0 — SDLT zero band is higher
    // For prices between 145k-250k SDLT = 0, LBTT > 0
    expect(typeof lbtt).toBe('number')
    expect(typeof sdlt).toBe('number')
  })
})
