/**
 * API Route: Initialize Payment
 * POST /api/payment/initialize
 * Initializes a payment transaction with Paystack
 */

import { NextRequest, NextResponse } from 'next/server'
import { initializePayment } from '../../../../lib/paystack/service'
import type { DocumentPurchaseData } from '../../../../types/payment'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { documentId, documentTitle, documentPrice, customerName, customerEmail, customerPhone } = body
    
    if (!documentId || !documentTitle || !documentPrice || !customerName || !customerEmail) {
      return NextResponse.json(
        { 
          status: false, 
          message: 'Missing required fields: documentId, documentTitle, documentPrice, customerName, customerEmail' 
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { 
          status: false, 
          message: 'Invalid email format' 
        },
        { status: 400 }
      )
    }

    // Validate price is a positive number
    if (typeof documentPrice !== 'number' || documentPrice <= 0) {
      return NextResponse.json(
        { 
          status: false, 
          message: 'Document price must be a positive number' 
        },
        { status: 400 }
      )
    }

    const purchaseData: DocumentPurchaseData = {
      documentId,
      documentTitle,
      documentPrice,
      customerName,
      customerEmail,
      customerPhone,
    }

    const paymentResponse = await initializePayment(purchaseData)

    // Save initial payment data to Firebase
    try {
      const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentReference: paymentResponse.data.reference,
          documentId: purchaseData.documentId,
          documentTitle: purchaseData.documentTitle,
          documentPrice: purchaseData.documentPrice,
          customerName: purchaseData.customerName,
          customerEmail: purchaseData.customerEmail,
          customerPhone: purchaseData.customerPhone,
          authorizationUrl: paymentResponse.data.authorization_url,
          accessCode: paymentResponse.data.access_code
        })
      })

      if (!saveResponse.ok) {
        console.warn('⚠️ Failed to save payment data to Firebase, but continuing with payment flow')
      } else {
        console.log('💾 Payment data saved to Firebase successfully')
      }
    } catch (firebaseError) {
      console.warn('⚠️ Firebase save error (non-blocking):', firebaseError)
      // Don't block payment flow for database errors
    }

    // Log successful payment initialization for testing
    console.log('✅ Payment Initialized Successfully:', {
      reference: paymentResponse.data.reference,
      amount: purchaseData.documentPrice,
      currency: 'ZAR',
      customer: purchaseData.customerEmail,
      document: purchaseData.documentTitle
    })

    return NextResponse.json(paymentResponse)

  } catch (error) {
    console.error('Payment initialization error:', error)
    
    return NextResponse.json(
      { 
        status: false, 
        message: error instanceof Error ? error.message : 'Failed to initialize payment' 
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
      message: 'Method not allowed. Use POST to initialize payment.' 
    },
    { status: 405 }
  )
} 