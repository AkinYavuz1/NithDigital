export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'

type WebsitePackage = 'starter' | 'growth' | 'premium'

interface ROIRequest {
  sector: string
  current_monthly_cost?: number
  avg_job_value?: number
  jobs_per_month?: number
  website_package?: WebsitePackage
}

const PACKAGE_COSTS: Record<WebsitePackage, number> = {
  starter: 595,
  growth: 995,
  premium: 1495,
}

const MONTHLY_CARE_PLAN = 75

function buildSummary(
  sector: string,
  annualTotalCost: number,
  roiModel: Record<string, any>
): string {
  const pkg = Object.values(PACKAGE_COSTS).find(v => v === roiModel.package_cost)

  if (sector === 'Accommodation') {
    const m = roiModel.roi_model.accommodation
    return `A professional website would save around £${m.booking_com_monthly_commission.toLocaleString()} per month in Booking.com commission, paying for itself in roughly ${m.months_to_payback} month${m.months_to_payback === 1 ? '' : 's'}.`
  }
  if (sector === 'Trades & Construction' || sector === 'Trades') {
    const m = roiModel.roi_model.trades
    return `Just ${m.extra_jobs_needed} extra job${m.extra_jobs_needed === 1 ? '' : 's'} per month from online visibility would cover the full cost of the website within ${m.months_to_payback} month${m.months_to_payback === 1 ? '' : 's'}.`
  }
  if (sector === 'Food & Drink') {
    const m = roiModel.roi_model.food_drink
    return `An additional ${m.extra_covers_needed} covers per week at £${m.avg_cover_spend} average spend would recover the full investment within ${m.months_to_payback} month${m.months_to_payback === 1 ? '' : 's'}.`
  }
  if (sector === 'Professional Services') {
    const m = roiModel.roi_model.generic
    return `With an expected ${m.annual_roi_percent}% ROI in year one, the website typically pays for its full £${annualTotalCost.toLocaleString()} annual cost within ${m.months_to_payback} month${m.months_to_payback === 1 ? '' : 's'}.`
  }
  const m = roiModel.roi_model.generic
  return `Based on a 15% uplift on typical monthly revenue, this website would deliver an estimated ${m.annual_roi_percent}% ROI and pay back the full investment within ${m.months_to_payback} month${m.months_to_payback === 1 ? '' : 's'}.`
}

export async function POST(req: NextRequest) {
  const body: ROIRequest = await req.json()

  const { sector, website_package = 'growth' } = body

  if (!sector) {
    return NextResponse.json({ error: 'sector is required' }, { status: 400 })
  }

  if (website_package && !PACKAGE_COSTS[website_package]) {
    return NextResponse.json(
      { error: 'website_package must be starter, growth, or premium' },
      { status: 400 }
    )
  }

  const packageCost = PACKAGE_COSTS[website_package]
  const annualTotalCost = packageCost + 12 * MONTHLY_CARE_PLAN

  let roiModel: Record<string, any> = {}

  const normSector = sector.toLowerCase()

  if (normSector.includes('accommodation') || normSector.includes('b&b') || normSector.includes('hotel') || normSector.includes('self-catering') || normSector.includes('glamping')) {
    // Accommodation: saving on Booking.com commission
    const bookingComMonthlyCommission = body.current_monthly_cost ?? 1200
    const annualSaving = bookingComMonthlyCommission * 12
    const monthsToPayback = Math.ceil(annualTotalCost / bookingComMonthlyCommission)

    roiModel = {
      accommodation: {
        booking_com_monthly_commission: bookingComMonthlyCommission,
        months_to_payback: monthsToPayback,
        annual_saving: annualSaving,
      },
    }
  } else if (
    normSector.includes('trade') ||
    normSector.includes('plumb') ||
    normSector.includes('electric') ||
    normSector.includes('joiner') ||
    normSector.includes('builder') ||
    normSector.includes('landscap') ||
    normSector.includes('home service') ||
    normSector.includes('paint')
  ) {
    // Trades: extra jobs needed
    const avgJobValue = body.avg_job_value ?? 350
    const extraJobsPerMonth = 1.5
    const monthlyRevUplift = extraJobsPerMonth * avgJobValue
    const monthsToPayback = Math.ceil(annualTotalCost / (extraJobsPerMonth * avgJobValue * 12 / 12))
    // simpler: months = annualTotalCost / monthlyRevUplift
    const months = Math.ceil(annualTotalCost / monthlyRevUplift)

    roiModel = {
      trades: {
        extra_jobs_needed: Math.ceil(annualTotalCost / avgJobValue),
        avg_job_value: avgJobValue,
        months_to_payback: months,
      },
    }
  } else if (normSector.includes('food') || normSector.includes('drink') || normSector.includes('restaurant') || normSector.includes('cafe') || normSector.includes('café') || normSector.includes('pub')) {
    // Food & Drink: extra covers
    const avgCoverSpend = 22
    const extraCoversPerWeek = 8
    const monthlyRevUplift = extraCoversPerWeek * avgCoverSpend * 4.33
    const monthsToPayback = Math.ceil(annualTotalCost / monthlyRevUplift)

    roiModel = {
      food_drink: {
        extra_covers_needed: extraCoversPerWeek,
        avg_cover_spend: avgCoverSpend,
        months_to_payback: monthsToPayback,
      },
    }
  } else if (normSector.includes('professional') || normSector.includes('solicitor') || normSector.includes('accountant') || normSector.includes('legal')) {
    // Professional services: 2 new clients/year
    const avgClientValue = 800
    const newClientsPerYear = 2
    const annualRevUplift = avgClientValue * newClientsPerYear
    const annualRoiPercent = Math.round((annualRevUplift / annualTotalCost) * 100)
    const monthsToPayback = Math.ceil((annualTotalCost / annualRevUplift) * 12)

    roiModel = {
      generic: {
        months_to_payback: monthsToPayback,
        annual_roi_percent: annualRoiPercent,
      },
    }
  } else {
    // Default: 15% revenue uplift on £3,500/month baseline
    const monthlyBaseline = 3500
    const monthlyUplift = monthlyBaseline * 0.15
    const annualUplift = monthlyUplift * 12
    const annualRoiPercent = Math.round((annualUplift / annualTotalCost) * 100)
    const monthsToPayback = Math.ceil(annualTotalCost / monthlyUplift)

    roiModel = {
      generic: {
        months_to_payback: monthsToPayback,
        annual_roi_percent: annualRoiPercent,
      },
    }
  }

  const result = {
    package_cost: packageCost,
    monthly_care_plan: MONTHLY_CARE_PLAN,
    annual_total_cost: annualTotalCost,
    sector,
    website_package,
    roi_model: roiModel,
    summary: '',
  }

  result.summary = buildSummary(sector, annualTotalCost, result)

  return NextResponse.json(result)
}
