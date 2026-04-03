import { calculateTax, formatCurrency } from '@/lib/taxCalc'

describe('calculateTax', () => {
  test('below personal allowance — no income tax, but Class 2 NI applies above £6,725', () => {
    const r = calculateTax({ grossIncome: 10000, allowableExpenses: 0, otherIncome: 0, studentLoanPlan: 'none' })
    expect(r.incomeTax).toBe(0)
    // Class 2 NI fires above small profits threshold (£6,725), not personal allowance
    expect(r.class2NI).toBeCloseTo(3.45 * 52, 1)
    expect(r.class4NI).toBe(0)
  })

  test('below small profits threshold — no NI at all', () => {
    const r = calculateTax({ grossIncome: 5000, allowableExpenses: 0, otherIncome: 0, studentLoanPlan: 'none' })
    expect(r.incomeTax).toBe(0)
    expect(r.class2NI).toBe(0)
    expect(r.class4NI).toBe(0)
    expect(r.totalTax).toBe(0)
  })

  test('basic rate taxpayer', () => {
    const r = calculateTax({ grossIncome: 30000, allowableExpenses: 0, otherIncome: 0, studentLoanPlan: 'none' })
    expect(r.taxableProfit).toBe(30000)
    // Income tax: (30000 - 12570) * 0.20 = 3486
    expect(r.incomeTax).toBeCloseTo(3486, 0)
    // Class 2: 3.45 * 52 = 179.40
    expect(r.class2NI).toBeCloseTo(179.4, 1)
    // Class 4: (30000 - 12570) * 0.06 = 1045.80
    expect(r.class4NI).toBeCloseTo(1045.8, 1)
  })

  test('allowable expenses reduce taxable profit', () => {
    const r = calculateTax({ grossIncome: 40000, allowableExpenses: 10000, otherIncome: 0, studentLoanPlan: 'none' })
    expect(r.taxableProfit).toBe(30000)
  })

  test('personal allowance tapers above £100k', () => {
    const r = calculateTax({ grossIncome: 110000, allowableExpenses: 0, otherIncome: 0, studentLoanPlan: 'none' })
    // PA reduces by £1 per £2 over £100k: 12570 - (10000/2) = 7570
    expect(r.personalAllowance).toBe(7570)
  })

  test('personal allowance is zero at £125,140+', () => {
    const r = calculateTax({ grossIncome: 130000, allowableExpenses: 0, otherIncome: 0, studentLoanPlan: 'none' })
    expect(r.personalAllowance).toBe(0)
  })

  test('higher rate tax kicks in above £50,270', () => {
    const r = calculateTax({ grossIncome: 60000, allowableExpenses: 0, otherIncome: 0, studentLoanPlan: 'none' })
    expect(r.higherRateTax).toBeGreaterThan(0)
  })

  test('student loan plan 2', () => {
    const r = calculateTax({ grossIncome: 40000, allowableExpenses: 0, otherIncome: 0, studentLoanPlan: 'plan2' })
    // (40000 - 27295) * 0.09 = 1143.45
    expect(r.studentLoan).toBeCloseTo(1143.45, 1)
  })

  test('effective rate is 0 for zero income', () => {
    const r = calculateTax({ grossIncome: 0, allowableExpenses: 0, otherIncome: 0, studentLoanPlan: 'none' })
    expect(r.effectiveRate).toBe(0)
  })

  test('monthly set aside is totalTax / 12', () => {
    const r = calculateTax({ grossIncome: 30000, allowableExpenses: 0, otherIncome: 0, studentLoanPlan: 'none' })
    expect(r.monthlySetAside).toBeCloseTo(r.totalTax / 12, 5)
  })
})

describe('formatCurrency', () => {
  test('formats integer', () => {
    expect(formatCurrency(1234)).toBe('£1,234.00')
  })
  test('formats decimal', () => {
    expect(formatCurrency(1234.5)).toBe('£1,234.50')
  })
  test('formats zero', () => {
    expect(formatCurrency(0)).toBe('£0.00')
  })
  test('formats large number', () => {
    expect(formatCurrency(1000000)).toBe('£1,000,000.00')
  })
})
