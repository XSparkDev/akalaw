/**
 * API Route: Save Payment Data
 * POST /api/payment/save
 * Saves payment information to Firebase Firestore
 */

import { NextRequest, NextResponse } from 'next/server'
import { Timestamp } from 'firebase/firestore'
import { createPaymentRecord } from '../../../../lib/firebase/firestore'
import { extractPriceFromString } from '../../../../lib/paystack/service'
import type { CreatePaymentRecord } from '../../../../types/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Extract data from request
    const {
      paymentReference,
      documentId,
      documentTitle,
      documentPrice,
      customerName,
      customerEmail,
      customerPhone,
      authorizationUrl,
      accessCode
    } = body

    // Validate required fields
    if (!paymentReference || !documentId || !documentTitle || !documentPrice || !customerName || !customerEmail) {
      return NextResponse.json(
        { 
          status: false, 
          message: 'Missing required fields' 
        },
        { status: 400 }
      )
    }

    // Get request metadata
    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    // Parse document price if it's a string
    const parsedPrice = typeof documentPrice === 'string' 
      ? extractPriceFromString(documentPrice) 
      : documentPrice

    // Determine document category from ID
    const getDocumentCategory = (docId: string): string => {
      switch (docId) {
        case '1': return 'property'
        case '2': case '3': return 'estate'
        default: return 'other'
      }
    }

    // Create payment record data
    const paymentData: CreatePaymentRecord = {
      // Unique identifiers
      paymentReference,
      
      // Customer information
      customerName,
      customerEmail,
      customerPhone,
      
      // Document information
      documentId,
      documentTitle,
      documentCategory: getDocumentCategory(documentId),
      documentPrice: parsedPrice,
      documentFormat: 'PDF & Word',
      
      // Payment details
      paymentStatus: 'pending',
      amount: parsedPrice * 100, // Convert to cents
      currency: 'ZAR',
      
      // Paystack details
      paystackData: {
        authorizationUrl,
        accessCode,
        channel: 'unknown', // Will be updated after payment
        domain: 'test', // Will be updated after verification
      },
      
      // Additional metadata
      metadata: {
        userAgent,
        ipAddress,
        source: 'web',
        disclaimerAccepted: true,
        disclaimerAcceptedAt: Timestamp.now()
      }
    }

    // Save to database
    const documentId_fb = await createPaymentRecord(paymentData)

    console.log('💾 Payment data saved to Firebase:', {
      firestoreId: documentId_fb,
      paymentReference,
      customerEmail,
      documentTitle,
      amount: parsedPrice
    })

    return NextResponse.json({
      status: true,
      message: 'Payment data saved successfully',
      data: {
        firestoreId: documentId_fb,
        paymentReference
      }
    })

  } catch (error) {
    console.error('❌ Error saving payment data:', error)
    
    return NextResponse.json(
      { 
        status: false, 
        message: error instanceof Error ? error.message : 'Failed to save payment data' 
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { 
      status: false, 
      message: 'Method not allowed. Use POST to save payment data.' 
    },
    { status: 405 }
  )
} 