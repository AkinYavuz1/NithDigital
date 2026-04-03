export interface TaxInput {
  grossIncome: number
  allowableExpenses: number
  otherIncome: number
  studentLoanPlan: 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgrad'
}

export interface TaxResult {
  taxableProfit: number
  combinedIncome: number
  personalAllowance: number
  incomeTax: number
  basicRateTax: number
  higherRateTax: number
  additionalRateTax: number
  class2NI: number
  class4NI: number
  studentLoan: number
  totalTax: number
  effectiveRate: number
  monthlySetAside: number
  basicRateAmount: number
  higherRateAmount: number
  additionalRateAmount: number
}

export function calculateTax(input: TaxInput): TaxResult {
  const { grossIncome, allowableExpenses, otherIncome, studentLoanPlan } = input

  const taxableProfit = Math.max(0, grossIncome - allowableExpenses)
  const combinedIncome = taxableProfit + otherIncome

  // Personal Allowance taper
  let personalAllowance = 12570
  if (combinedIncome > 100000) {
    personalAllowance = Math.max(0, 12570 - Math.floor((combinedIncome - 100000) / 2))
  }

  // Income tax bands
  const taxableIncome = Math.max(0, combinedIncome - personalAllowance)
  const basicRateLimit = 50270 - personalAllowance
  const higherRateLimit = 125140 - personalAllowance

  const basicRateAmount = Math.min(taxableIncome, basicRateLimit)
  const higherRateAmount = Math.min(Math.max(0, taxableIncome - basicRateLimit), higherRateLimit - basicRateLimit)
  const additionalRateAmount = Math.max(0, taxableIncome - higherRateLimit)

  const basicRateTax = basicRateAmount * 0.20
  const higherRateTax = higherRateAmount * 0.40
  const additionalRateTax = additionalRateAmount * 0.45
  const incomeTax = basicRateTax + higherRateTax + additionalRateTax

  // Class 2 NI
  const smallProfitsThreshold = 6725
  const class2NI = taxableProfit > smallProfitsThreshold ? 3.45 * 52 : 0

  // Class 4 NI
  const class4Lower = 12570
  const class4Upper = 50270
  const class4Band1 = Math.min(Math.max(0, taxableProfit - class4Lower), class4Upper - class4Lower)
  const class4Band2 = Math.max(0, taxableProfit - class4Upper)
  const class4NI = class4Band1 * 0.06 + class4Band2 * 0.02

  // Student loan
  let studentLoan = 0
  const repaymentRates: Record<string, { threshold: number; rate: number }> = {
    plan1: { threshold: 22015, rate: 0.09 },
    plan2: { threshold: 27295, rate: 0.09 },
    plan4: { threshold: 27660, rate: 0.09 },
    plan5: { threshold: 25000, rate: 0.09 },
    postgrad: { threshold: 21000, rate: 0.06 },
  }
  if (studentLoanPlan !== 'none' && repaymentRates[studentLoanPlan]) {
    const { threshold, rate } = repaymentRates[studentLoanPlan]
    studentLoan = Math.max(0, combinedIncome - threshold) * rate
  }

  const totalTax = incomeTax + class2NI + class4NI + studentLoan
  const effectiveRate = combinedIncome > 0 ? (totalTax / combinedIncome) * 100 : 0
  const monthlySetAside = totalTax / 12

  return {
    taxableProfit,
    combinedIncome,
    personalAllowance,
    incomeTax,
    basicRateTax,
    higherRateTax,
    additionalRateTax,
    class2NI,
    class4NI,
    studentLoan,
    totalTax,
    effectiveRate,
    monthlySetAside,
    basicRateAmount,
    higherRateAmount,
    additionalRateAmount,
  }
}

export function formatCurrency(n: number): string {
  return `£${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}
