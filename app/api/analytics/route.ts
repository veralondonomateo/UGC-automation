import { NextResponse } from 'next/server'
import { getAnalyticsData } from '@/lib/analytics/queries'

export async function GET() {
  const data = await getAnalyticsData()
  return NextResponse.json(data)
}
