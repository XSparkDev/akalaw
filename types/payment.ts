/**
 * Payment-related TypeScript types for Paystack integration
 */

export interface PaymentData {
  email: string
  amount: number // Amount in cents (Paystack uses smallest currency unit, so multiply rand by 100)
  currency: string
  reference: string
  callback_url?: string
  metadata?: {
    documentId: string
    documentTitle: string
    customerName: string
    customerPhone?: string
  }
}

export interface PaymentInitializationResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export interface PaymentVerificationResponse {
  status: boolean
  message: string
  data: {
    id: number
    domain: string
    status: 'success' | 'failed' | 'abandoned'
    reference: string
    amount: number
    message: string
    gateway_response: string
    paid_at: string
    created_at: string
    channel: string
    currency: string
    ip_address: string
    metadata: {
      documentId: string
      documentTitle: string
      customerName: string
      customerPhone?: string
    }
    customer: {
      id: number
      first_name: string
      last_name: string
      email: string
      customer_code: string
      phone: string
    }
  }
}

export interface DocumentPurchaseData {
  documentId: string
  documentTitle: string
  documentPrice: number // Price in Rand (will be converted to cents)
  customerName: string
  customerEmail: string
  customerPhone?: string
}

export interface PaymentError {
  status: false
  message: string
  type?: string
} 