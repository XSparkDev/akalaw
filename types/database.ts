/**
 * Database TypeScript Interfaces
 * Defines data structures for Firebase Firestore collections
 */

import { Timestamp } from 'firebase/firestore'

// Payment record stored in database
export interface PaymentRecord {
  // Unique identifiers
  id?: string // Firestore document ID
  paymentReference: string // Paystack reference (e.g., AKA_LAW_123456789_abc123)
  paystackTransactionId?: number // Paystack transaction ID

  // Customer information
  customerName: string
  customerEmail: string
  customerPhone?: string

  // Document information
  documentId: string
  documentTitle: string
  documentCategory: string
  documentPrice: number // Price in Rand
  documentFormat: string // e.g., "PDF & Word"

  // Payment details
  paymentStatus: 'pending' | 'success' | 'failed' | 'abandoned'
  amount: number // Amount in cents (as stored by Paystack)
  currency: string // 'ZAR'
  gatewayResponse?: string // Paystack gateway response message
  
  // Timestamps
  createdAt: Timestamp
  paidAt?: Timestamp
  updatedAt: Timestamp

  // Paystack details
  paystackData?: {
    channel: string // e.g., 'card', 'bank'
    authorizationUrl?: string
    accessCode?: string
    domain: string
    ipAddress?: string
  }

  // Customer details from Paystack
  paystackCustomer?: {
    id: number
    customerCode: string
    firstName?: string
    lastName?: string
  }

  // Additional metadata
  metadata: {
    userAgent?: string
    ipAddress?: string
    source: 'web' | 'mobile' | 'api'
    disclaimerAccepted: boolean
    disclaimerAcceptedAt: Timestamp
  }
}

// Document download record (for tracking downloads)
export interface DocumentDownload {
  id?: string
  paymentReference: string
  customerEmail: string
  documentId: string
  downloadedAt: Timestamp
  ipAddress?: string
  userAgent?: string
}

// Analytics and reporting interface
export interface PaymentAnalytics {
  id?: string
  date: Timestamp // Daily aggregation
  totalTransactions: number
  totalAmount: number // in Rand
  successfulTransactions: number
  failedTransactions: number
  abandonedTransactions: number
  
  // Document breakdown
  documentSales: {
    [documentId: string]: {
      title: string
      count: number
      revenue: number
    }
  }
  
  // Payment methods
  paymentChannels: {
    [channel: string]: number
  }
}

// Customer record (for repeat customers)
export interface Customer {
  id?: string
  email: string
  name: string
  phone?: string
  
  // Purchase history
  totalPurchases: number
  totalSpent: number // in Rand
  firstPurchaseAt: Timestamp
  lastPurchaseAt: Timestamp
  
  // Documents purchased
  purchasedDocuments: string[] // Array of document IDs
  
  // Contact preferences
  preferences: {
    emailMarketing: boolean
    smsMarketing: boolean
  }
  
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Error logs for debugging
export interface PaymentError {
  id?: string
  paymentReference?: string
  errorType: 'initialization' | 'verification' | 'database' | 'unknown'
  errorMessage: string
  errorDetails?: string
  customerEmail?: string
  documentId?: string
  
  // Request details
  requestData?: string
  responseData?: string
  
  createdAt: Timestamp
  resolved: boolean
  resolvedAt?: Timestamp
  notes?: string
}

// Collection names as constants
export const COLLECTIONS = {
  PAYMENTS: 'payments',
  DOWNLOADS: 'downloads', 
  ANALYTICS: 'analytics',
  CUSTOMERS: 'customers',
  ERRORS: 'payment_errors'
} as const

// Helper type for creating new payment records
export type CreatePaymentRecord = Omit<PaymentRecord, 'id' | 'createdAt' | 'updatedAt'> & {
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

// Helper type for updating payment records
export type UpdatePaymentRecord = Partial<Omit<PaymentRecord, 'id' | 'createdAt'>> & {
  updatedAt: Timestamp
} 