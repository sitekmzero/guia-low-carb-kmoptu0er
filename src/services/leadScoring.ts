export function calculateLeadScore(leadData: any) {
  let score = 0
  const breakdown = { source: 0, engagement: 0, interest: 0, recency: 0, firmographic: 0 }

  // Factor 1: Source (Max 20 points, scaled from max 60)
  const sourceScores: Record<string, number> = {
    course: 50,
    consultation: 60,
    'ebook-paid': 40,
    referral: 35,
    'landing-page': 25,
    'ebook-free': 20,
    blog: 15,
    'social-media': 10,
  }
  const sourceRaw = sourceScores[leadData.lead_source] || 15
  breakdown.source = Math.min((sourceRaw / 60) * 20, 20)

  // Factor 2: Engagement (Max 30 points)
  const engagementRaw =
    (leadData.email_opens || 0) * 5 +
    (leadData.email_clicks || 0) * 10 +
    (leadData.form_submissions || 0) * 15
  breakdown.engagement = Math.min((engagementRaw / 60) * 30, 30)

  // Factor 3: Product Interest (Max 25 points)
  const interests = leadData.product_interest || []
  const interestRaw = interests.includes('bundle')
    ? 40
    : interests.length > 1
      ? 30
      : interests.length === 1
        ? 15
        : 0
  breakdown.interest = Math.min((interestRaw / 50) * 25, 25)

  // Factor 4: Recency (Max 15 points)
  const daysSince = leadData.last_contacted
    ? (new Date().getTime() - new Date(leadData.last_contacted).getTime()) / (1000 * 3600 * 24)
    : 999
  breakdown.recency = daysSince <= 7 ? 15 : daysSince <= 30 ? 10 : daysSince <= 90 ? 5 : 0

  // Factor 5: Firmographic (Max 10 points)
  const firmRaw = (leadData.company ? 10 : 0) + (leadData.phone ? 5 : 0)
  breakdown.firmographic = Math.min((firmRaw / 15) * 10, 10)

  score =
    breakdown.source +
    breakdown.engagement +
    breakdown.interest +
    breakdown.recency +
    breakdown.firmographic

  return {
    leadScore: Math.round(score),
    scoreBreakdown: breakdown,
    recommendation: score >= 60 ? 'hot' : score >= 40 ? 'warm' : 'cold',
  }
}
