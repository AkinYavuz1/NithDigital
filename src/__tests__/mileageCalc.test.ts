// Mileage calculator logic extracted from mileage/new/page.tsx

const RATE_STANDARD = 0.45
const RATE_REDUCED = 0.25
const RATE_THRESHOLD = 10000

function calcMileageClaim(miles: number, totalMilesBefore: number): { claim: number; rate: number } {
  const newTotal = totalMilesBefore + miles
  if (totalMilesBefore >= RATE_THRESHOLD) {
    return { claim: miles * RATE_REDUCED, rate: RATE_REDUCED }
  }
  if (newTotal <= RATE_THRESHOLD) {
    return { claim: miles * RATE_STANDARD, rate: RATE_STANDARD }
  }
  // Split rate: some at 45p, rest at 25p
  const at45p = RATE_THRESHOLD - totalMilesBefore
  const at25p = miles - at45p
  return {
    claim: at45p * RATE_STANDARD + at25p * RATE_REDUCED,
    rate: RATE_REDUCED, // final rate is reduced
  }
}

describe('Mileage claim calculator', () => {
  test('45p rate within first 10,000 miles', () => {
    const { claim, rate } = calcMileageClaim(100, 0)
    expect(rate).toBe(0.45)
    expect(claim).toBe(45)
  })

  test('25p rate after 10,000 miles', () => {
    const { claim, rate } = calcMileageClaim(100, 10000)
    expect(rate).toBe(0.25)
    expect(claim).toBe(25)
  })

  test('split rate when crossing threshold', () => {
    // 9900 done, add 200 miles: 100 at 45p + 100 at 25p = 45 + 25 = 70
    const { claim } = calcMileageClaim(200, 9900)
    expect(claim).toBe(70)
  })

  test('zero miles — zero claim', () => {
    const { claim } = calcMileageClaim(0, 0)
    expect(claim).toBe(0)
  })

  test('large journey all at 45p', () => {
    const { claim } = calcMileageClaim(5000, 0)
    expect(claim).toBe(5000 * 0.45)
  })

  test('large journey all at 25p', () => {
    const { claim } = calcMileageClaim(5000, 10000)
    expect(claim).toBe(5000 * 0.25)
  })

  test('exactly at threshold boundary', () => {
    const { claim, rate } = calcMileageClaim(1, 9999)
    expect(rate).toBe(0.45)
    expect(claim).toBe(0.45)
  })
})
