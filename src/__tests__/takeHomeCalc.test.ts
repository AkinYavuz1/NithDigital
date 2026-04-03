// Take-home calculator logic extracted from TakeHomeClient.tsx

const PA = 12570
const BASIC_LIMIT = 50270
const HIGHER_LIMIT = 125140
const NI_CLASS2_WEEKLY = 3.45
const NI_CLASS4_LOWER = 12570
const NI_CLASS4_UPPER = 50270

function calcIncomeTax(income: number): number {
  const taxable = Math.max(0, income - PA)
  let tax = 0
  tax += Math.min(taxable, BASIC_LIMIT - PA) * 0.20
  if (income > BASIC_LIMIT) tax += (Math.min(income, HIGHER_LIMIT) - BASIC_LIMIT) * 0.40
  if (income > HIGHER_LIMIT) tax += (income - HIGHER_LIMIT) * 0.45
  return Math.max(0, tax)
}

function calcClass4NI(taxableProfit: number): number {
  let class4 = 0
  if (taxableProfit > NI_CLASS4_LOWER) {
    class4 += (Math.min(taxableProfit, NI_CLASS4_UPPER) - NI_CLASS4_LOWER) * 0.09
  }
  if (taxableProfit > NI_CLASS4_UPPER) {
    class4 += (taxableProfit - NI_CLASS4_UPPER) * 0.02
  }
  return class4
}

function calcStudentLoan(income: number, plan: string): number {
  const plans: Record<string, { threshold: number; rate: number }> = {
    plan1: { threshold: 24990, rate: 0.09 },
    plan2: { threshold: 27295, rate: 0.09 },
    plan4: { threshold: 31395, rate: 0.09 },
    plan5: { threshold: 25000, rate: 0.09 },
    postgrad: { threshold: 21000, rate: 0.06 },
  }
  if (plan === 'none' || !plans[plan]) return 0
  const { threshold, rate } = plans[plan]
  return Math.max(0, income - threshold) * rate
}

describe('Income tax (take-home calculator)', () => {
  test('below personal allowance — no tax', () => {
    expect(calcIncomeTax(10000)).toBe(0)
  })

  test('exactly at personal allowance — no tax', () => {
    expect(calcIncomeTax(12570)).toBe(0)
  })

  test('basic rate band', () => {
    // (30000 - 12570) * 0.20 = 3486
    expect(calcIncomeTax(30000)).toBeCloseTo(3486, 0)
  })

  test('higher rate band', () => {
    // basic: (50270-12570)*0.20 = 7540; higher: (60000-50270)*0.40 = 3892; total = 11432
    expect(calcIncomeTax(60000)).toBeCloseTo(11432, 0)
  })

  test('additional rate band', () => {
    expect(calcIncomeTax(200000)).toBeGreaterThan(calcIncomeTax(125140))
  })
})

describe('Class 4 NI', () => {
  test('below lower threshold — no Class 4', () => {
    expect(calcClass4NI(10000)).toBe(0)
  })

  test('within main band', () => {
    // (30000 - 12570) * 0.09 = 1568.70
    expect(calcClass4NI(30000)).toBeCloseTo(1568.7, 1)
  })

  test('above upper limit — 2% on excess', () => {
    const result = calcClass4NI(60000)
    const mainBand = (NI_CLASS4_UPPER - NI_CLASS4_LOWER) * 0.09
    const excess = (60000 - NI_CLASS4_UPPER) * 0.02
    expect(result).toBeCloseTo(mainBand + excess, 1)
  })
})

describe('Student loan repayment', () => {
  test('no plan — no repayment', () => {
    expect(calcStudentLoan(40000, 'none')).toBe(0)
  })

  test('plan 2 — 9% above £27,295', () => {
    expect(calcStudentLoan(40000, 'plan2')).toBeCloseTo((40000 - 27295) * 0.09, 2)
  })

  test('below plan 2 threshold — no repayment', () => {
    expect(calcStudentLoan(25000, 'plan2')).toBe(0)
  })

  test('postgrad — 6% above £21,000', () => {
    expect(calcStudentLoan(30000, 'postgrad')).toBeCloseTo((30000 - 21000) * 0.06, 2)
  })
})

describe('Take-home integration', () => {
  test('take-home = taxableProfit - total deductions', () => {
    const gross = 40000
    const expenses = 5000
    const taxableProfit = gross - expenses
    const incomeTax = calcIncomeTax(taxableProfit)
    const class2 = taxableProfit > NI_CLASS4_LOWER ? NI_CLASS2_WEEKLY * 52 : 0
    const class4 = calcClass4NI(taxableProfit)
    const totalDeductions = incomeTax + class2 + class4
    const takeHome = taxableProfit - totalDeductions
    expect(takeHome).toBeGreaterThan(0)
    expect(takeHome).toBeLessThan(taxableProfit)
  })
})
