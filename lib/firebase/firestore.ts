/**
 * Firestore Database Functions
 * Handles all database operations for payments and customer data
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  increment
} from 'firebase/firestore'

import { db } from './config'
import {
  PaymentRecord,
  CreatePaymentRecord,
  UpdatePaymentRecord,
  Customer,
  DocumentDownload,
  PaymentError,
  COLLECTIONS
} from '../../types/database'

// ==================== PAYMENT FUNCTIONS ====================

/**
 * Create initial payment record when payment is initialized
 */
export async function createPaymentRecord(paymentData: CreatePaymentRecord): Promise<string> {
  try {
    const now = Timestamp.now()
    
    const paymentRecord: CreatePaymentRecord = {
      ...paymentData,
      createdAt: now,
      updatedAt: now,
      paymentStatus: 'pending'
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.PAYMENTS), paymentRecord)
    
    console.log('💾 Payment record created:', {
      id: docRef.id,
      reference: paymentData.paymentReference,
      customer: paymentData.customerEmail,
      amount: paymentData.documentPrice
    })

    return docRef.id
  } catch (error) {
    console.error('❌ Error creating payment record:', error)
    await logPaymentError({
      errorType: 'database',
      errorMessage: 'Failed to create payment record',
      errorDetails: error instanceof Error ? error.message : String(error),
      paymentReference: paymentData.paymentReference,
      customerEmail: paymentData.customerEmail,
      documentId: paymentData.documentId
    })
    throw error
  }
}

/**
 * Update payment record after verification
 */
export async function updatePaymentRecord(
  paymentReference: string,
  updateData: Partial<PaymentRecord>
): Promise<void> {
  try {
    // Find payment by reference
    const paymentsRef = collection(db, COLLECTIONS.PAYMENTS)
    const q = query(paymentsRef, where('paymentReference', '==', paymentReference))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      throw new Error(`Payment record not found for reference: ${paymentReference}`)
    }

    const paymentDoc = querySnapshot.docs[0]
    const paymentId = paymentDoc.id

    const updatedData: UpdatePaymentRecord = {
      ...updateData,
      updatedAt: Timestamp.now()
    }

    // Add paidAt timestamp if payment is successful
    if (updateData.paymentStatus === 'success' && !updateData.paidAt) {
      updatedData.paidAt = Timestamp.now()
    }

    await updateDoc(doc(db, COLLECTIONS.PAYMENTS, paymentId), updatedData)

    console.log('✅ Payment record updated:', {
      id: paymentId,
      reference: paymentReference,
      status: updateData.paymentStatus,
      amount: updateData.amount ? updateData.amount / 100 : 'unchanged'
    })

    // Update customer record if payment is successful
    if (updateData.paymentStatus === 'success') {
      const currentData = paymentDoc.data() as PaymentRecord
      await updateCustomerRecord(currentData)
    }

  } catch (error) {
    console.error('❌ Error updating payment record:', error)
    await logPaymentError({
      errorType: 'database',
      errorMessage: 'Failed to update payment record',
      errorDetails: error instanceof Error ? error.message : String(error),
      paymentReference
    })
    throw error
  }
}

/**
 * Get payment record by reference
 */
export async function getPaymentByReference(paymentReference: string): Promise<PaymentRecord | null> {
  try {
    const paymentsRef = collection(db, COLLECTIONS.PAYMENTS)
    const q = query(paymentsRef, where('paymentReference', '==', paymentReference))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const paymentDoc = querySnapshot.docs[0]
    return {
      id: paymentDoc.id,
      ...paymentDoc.data()
    } as PaymentRecord

  } catch (error) {
    console.error('❌ Error fetching payment record:', error)
    return null
  }
}

/**
 * Get payment history for a customer
 */
export async function getCustomerPayments(customerEmail: string): Promise<PaymentRecord[]> {
  try {
    const paymentsRef = collection(db, COLLECTIONS.PAYMENTS)
    const q = query(
      paymentsRef,
      where('customerEmail', '==', customerEmail),
      orderBy('createdAt', 'desc'),
      limit(50)
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PaymentRecord[]

  } catch (error) {
    console.error('❌ Error fetching customer payments:', error)
    return []
  }
}

// ==================== CUSTOMER FUNCTIONS ====================

/**
 * Update or create customer record
 */
export async function updateCustomerRecord(paymentData: PaymentRecord): Promise<void> {
  try {
    const customersRef = collection(db, COLLECTIONS.CUSTOMERS)
    const q = query(customersRef, where('email', '==', paymentData.customerEmail))
    const querySnapshot = await getDocs(q)

    const now = Timestamp.now()

    if (querySnapshot.empty) {
      // Create new customer
      const newCustomer: Omit<Customer, 'id'> = {
        email: paymentData.customerEmail,
        name: paymentData.customerName,
        phone: paymentData.customerPhone,
        totalPurchases: 1,
        totalSpent: paymentData.documentPrice,
        firstPurchaseAt: now,
        lastPurchaseAt: now,
        purchasedDocuments: [paymentData.documentId],
        preferences: {
          emailMarketing: false,
          smsMarketing: false
        },
        createdAt: now,
        updatedAt: now
      }

      await addDoc(customersRef, newCustomer)
      console.log('👤 New customer created:', paymentData.customerEmail)

    } else {
      // Update existing customer
      const customerDoc = querySnapshot.docs[0]
      const currentData = customerDoc.data() as Customer

      const updatedData = {
        name: paymentData.customerName, // Update name in case it changed
        phone: paymentData.customerPhone || currentData.phone,
        totalPurchases: increment(1),
        totalSpent: increment(paymentData.documentPrice),
        lastPurchaseAt: now,
        purchasedDocuments: [
          ...new Set([...currentData.purchasedDocuments, paymentData.documentId])
        ],
        updatedAt: now
      }

      await updateDoc(doc(db, COLLECTIONS.CUSTOMERS, customerDoc.id), updatedData)
      console.log('👤 Customer updated:', paymentData.customerEmail)
    }

  } catch (error) {
    console.error('❌ Error updating customer record:', error)
    // Don't throw error for customer update failures
  }
}

// ==================== DOWNLOAD TRACKING ====================

/**
 * Record document download
 */
export async function recordDocumentDownload(
  paymentReference: string,
  customerEmail: string,
  documentId: string,
  metadata?: { ipAddress?: string; userAgent?: string }
): Promise<void> {
  try {
    const downloadRecord: Omit<DocumentDownload, 'id'> = {
      paymentReference,
      customerEmail,
      documentId,
      downloadedAt: Timestamp.now(),
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent
    }

    await addDoc(collection(db, COLLECTIONS.DOWNLOADS), downloadRecord)
    console.log('📥 Download recorded:', { paymentReference, documentId })

  } catch (error) {
    console.error('❌ Error recording download:', error)
    // Don't throw error for download tracking failures
  }
}

// ==================== ERROR LOGGING ====================

/**
 * Log payment-related errors for debugging
 */
export async function logPaymentError(errorData: Omit<PaymentError, 'id' | 'createdAt' | 'resolved'>): Promise<void> {
  try {
    const errorRecord: Omit<PaymentError, 'id'> = {
      ...errorData,
      createdAt: Timestamp.now(),
      resolved: false
    }

    await addDoc(collection(db, COLLECTIONS.ERRORS), errorRecord)
    console.log('🚨 Error logged:', errorData.errorType, errorData.errorMessage)

  } catch (error) {
    console.error('❌ Failed to log error:', error)
    // Silently fail - don't break the main flow
  }
}

// ==================== ANALYTICS FUNCTIONS ====================

/**
 * Get payment statistics for dashboard
 */
export async function getPaymentStatistics(days: number = 30): Promise<{
  totalPayments: number
  successfulPayments: number
  totalRevenue: number
  averageOrderValue: number
}> {
  try {
    const paymentsRef = collection(db, COLLECTIONS.PAYMENTS)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    const q = query(
      paymentsRef,
      where('createdAt', '>=', Timestamp.fromDate(cutoffDate))
    )
    
    const querySnapshot = await getDocs(q)
    const payments = querySnapshot.docs.map(doc => doc.data() as PaymentRecord)

    const successfulPayments = payments.filter(p => p.paymentStatus === 'success')
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.documentPrice, 0)

    return {
      totalPayments: payments.length,
      successfulPayments: successfulPayments.length,
      totalRevenue,
      averageOrderValue: successfulPayments.length > 0 ? totalRevenue / successfulPayments.length : 0
    }

  } catch (error) {
    console.error('❌ Error fetching payment statistics:', error)
    return {
      totalPayments: 0,
      successfulPayments: 0,
      totalRevenue: 0,
      averageOrderValue: 0
    }
  }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Check if customer has already purchased a document
 */
export async function hasCustomerPurchasedDocument(
  customerEmail: string,
  documentId: string
): Promise<boolean> {
  try {
    const paymentsRef = collection(db, COLLECTIONS.PAYMENTS)
    const q = query(
      paymentsRef,
      where('customerEmail', '==', customerEmail),
      where('documentId', '==', documentId),
      where('paymentStatus', '==', 'success'),
      limit(1)
    )
    
    const querySnapshot = await getDocs(q)
    return !querySnapshot.empty

  } catch (error) {
    console.error('❌ Error checking document purchase:', error)
    return false
  }
} 