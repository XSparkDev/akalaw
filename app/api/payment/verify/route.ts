/**
 * API Route: Verify Payment
 * GET /api/payment/verify?reference=PAYMENT_REFERENCE
 * Verifies a payment transaction with Paystack
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyPayment } from '../../../../lib/paystack/service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { 
          status: false, 
          message: 'Payment reference is required' 
        },
        { status: 400 }
      )
    }

    const verificationResponse = await verifyPayment(reference)

    // Update payment record in Firebase with verification results
    try {
      const { updatePaymentRecord, getPaymentByReference } = await import('../../../../lib/firebase/firestore')
      
      const updateData = {
        paymentStatus: verificationResponse.data.status as 'success' | 'failed' | 'abandoned',
        amount: verificationResponse.data.amount,
        gatewayResponse: verificationResponse.data.gateway_response,
        paystackTransactionId: verificationResponse.data.id,
        paystackData: {
          channel: verificationResponse.data.channel,
          domain: verificationResponse.data.domain,
          ipAddress: verificationResponse.data.ip_address
          // Note: Removed authorizationUrl and accessCode to avoid undefined values
        },
        paystackCustomer: {
          id: verificationResponse.data.customer.id,
          customerCode: verificationResponse.data.customer.customer_code,
          firstName: verificationResponse.data.customer.first_name,
          lastName: verificationResponse.data.customer.last_name
        }
      }

      await updatePaymentRecord(reference, updateData)
      console.log('💾 Payment verification saved to Firebase:', reference)

      // Send emails if payment was successful
      if (verificationResponse.data.status === 'success') {
        console.log('✅ Payment successful - initiating email sending process...')
        try {
          // Get the updated payment record with all details
          const paymentRecord = await getPaymentByReference(reference)
          
          if (paymentRecord) {
            console.log('💾 Payment record found for email sending:', {
              customerEmail: paymentRecord.customerEmail,
              documentTitle: paymentRecord.documentTitle,
              reference: paymentRecord.paymentReference
            })
            
            const { sendPaymentNotificationEmails } = await import('../../../../lib/email/service')
            
            console.log('📧 Calling sendPaymentNotificationEmails...')
            const emailResult = await sendPaymentNotificationEmails({
              customerName: paymentRecord.customerName,
              customerEmail: paymentRecord.customerEmail,
              customerPhone: paymentRecord.customerPhone,
              documentTitle: paymentRecord.documentTitle,
              documentCategory: paymentRecord.documentCategory,
              documentId: paymentRecord.documentId,
              amount: paymentRecord.documentPrice,
              reference: paymentRecord.paymentReference,
              paymentDate: new Date()
            })

            console.log('📧 Email notifications completed:', {
              reference,
              customerEmailSent: emailResult.customerEmailSent,
              adminEmailSent: emailResult.adminEmailSent
            })
          } else {
            console.error('❌ No payment record found for email sending')
          }
        } catch (emailError) {
          console.error('❌ Email sending error (non-blocking):', emailError)
          if (emailError instanceof Error) {
            console.error('❌ Email error details:', emailError.message)
            console.error('❌ Email error stack:', emailError.stack)
          }
          // Don't block verification for email errors
        }
      } else {
        console.log('⚠️ Payment not successful, skipping email sending')
      }

    } catch (firebaseError) {
      console.warn('⚠️ Firebase update error (non-blocking):', firebaseError)
      // Don't block verification flow for database errors
    }

    // Log payment verification result for testing
    console.log('🔍 Payment Verification Result:', {
      reference,
      status: verificationResponse.data.status,
      amount: verificationResponse.data.amount,
      currency: verificationResponse.data.currency,
      customer: verificationResponse.data.customer.email,
      document: verificationResponse.data.metadata.documentTitle,
      gateway_response: verificationResponse.data.gateway_response
    })

    return NextResponse.json(verificationResponse)

  } catch (error) {
    console.error('Payment verification error:', error)
    
    return NextResponse.json(
      { 
        status: false, 
        message: error instanceof Error ? error.message : 'Failed to verify payment' 
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { 
      status: false, 
      message: 'Method not allowed. Use GET with reference parameter to verify payment.' 
    },
    { status: 405 }
  )
} 