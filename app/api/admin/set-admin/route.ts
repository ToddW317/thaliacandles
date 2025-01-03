import { NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    // Get user by email
    const user = await adminAuth.getUserByEmail(email)
    
    // Set custom claims
    await adminAuth.setCustomUserClaims(user.uid, {
      admin: true
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error setting admin claims:', error)
    return NextResponse.json({ error: 'Failed to set admin claims' }, { status: 500 })
  }
} 