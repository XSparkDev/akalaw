/**
 * Paystack Service
 * Contains utility functions for interacting with Paystack API
 */

import { paystackConfig, validatePaystackConfig } from './config'
import type { 
  PaymentData, 
  PaymentInitializationResponse, 
  PaymentVerificationResponse, 
  DocumentPurchaseData 
} from '../../types/payment'

/**
 * Generate a unique payment reference
 */
export function generatePaymentReference(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `AKA_LAW_${timestamp}_${random}`.toUpperCase()
}

/**
 * Convert Rand to cents (Paystack uses smallest currency unit)
 */
export function randToCents(rand: number): number {
  return Math.round(rand * 100)
}

/**
 * Convert cents to Rand
 */
export function centsToRand(cents: number): number {
  return cents / 100
}

// Legacy function names for backward compatibility
export const nairaToKobo = randToCents
export const koboToNaira = centsToRand

/**
 * Initialize a payment transaction with Paystack
 */
export async function initializePayment(
  purchaseData: DocumentPurchaseData
): Promise<PaymentInitializationResponse> {
  validatePaystackConfig() // Validate environment variables before proceeding
  
  const reference = generatePaymentReference()
  const amount = randToCents(purchaseData.documentPrice)
  
  const paymentData: PaymentData = {
    email: purchaseData.customerEmail,
    amount,
    currency: 'ZAR',
    reference,
    callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/verify?reference=${reference}`,
    metadata: {
      documentId: purchaseData.documentId,
      documentTitle: purchaseData.documentTitle,
      customerName: purchaseData.customerName,
      customerPhone: purchaseData.customerPhone,
    }
  }

  const response = await fetch(`${paystackConfig.baseUrl}/transaction/initialize`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${paystackConfig.secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error('Paystack API Error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorBody,
      secretKeyPrefix: paystackConfig.secretKey.substring(0, 15) + '...'
    })
    throw new Error(`Payment initialization failed: ${response.status} ${response.statusText} - ${errorBody}`)
  }

  return response.json()
}

/**
 * Verify a payment transaction with Paystack
 */
export async function verifyPayment(
  reference: string
): Promise<PaymentVerificationResponse> {
  validatePaystackConfig() // Validate environment variables before proceeding
  
  const response = await fetch(
    `${paystackConfig.baseUrl}/transaction/verify/${reference}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackConfig.secretKey}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    const errorBody = await response.text()
    console.error('Paystack Verification Error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorBody
    })
    throw new Error(`Payment verification failed: ${response.status} ${response.statusText} - ${errorBody}`)
  }

  return response.json()
}

/**
 * Extract price from price string (e.g., "R 450" -> 450)
 */
export function extractPriceFromString(priceString: string): number {
  const match = priceString.match(/\d+/)
  return match ? parseInt(match[0], 10) : 0
} 