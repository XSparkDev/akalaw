/**
 * Email Service
 * Handles sending emails via Resend
 */

import { resend, emailConfig, isEmailServiceAvailable } from './config'
import { getCustomerEmailTemplate, getAdminEmailTemplate, CustomerEmailData, AdminEmailData } from './templates'

/**
 * Send document delivery email to customer
 */
export async function sendCustomerDocumentEmail(data: CustomerEmailData): Promise<boolean> {
  console.log('🔄 Starting customer email send process...', {
    customerEmail: data.customerEmail,
    documentTitle: data.documentTitle,
    reference: data.reference
  })

  if (!isEmailServiceAvailable()) {
    console.warn('⚠️ Email service not configured. Skipping customer email.')
    console.warn('⚠️ RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET' : 'NOT SET')
    return false
  }

  try {
    console.log('📧 Sending customer email via Resend...')
    
    const result = await resend.emails.send({
      from: `${emailConfig.fromName} <${emailConfig.from}>`,
      to: data.customerEmail,
      replyTo: emailConfig.replyTo,
      subject: `Your Legal Document: ${data.documentTitle} - Reference ${data.reference}`,
      html: getCustomerEmailTemplate(data)
    })

    if (result.error) {
      console.error('❌ Resend API Error:', result.error)
      return false
    }

    console.log('📧 Customer document email sent successfully:', {
      emailId: result.data?.id,
      recipient: data.customerEmail,
      document: data.documentTitle,
      reference: data.reference
    })

    return true
  } catch (error) {
    console.error('❌ Error sending customer email:', error)
    if (error instanceof Error) {
      console.error('❌ Error details:', error.message)
      console.error('❌ Error stack:', error.stack)
    }
    return false
  }
}

/**
 * Send payment notification email to admin
 */
export async function sendAdminNotificationEmail(data: AdminEmailData): Promise<boolean> {
  console.log('🔄 Starting admin email send process...', {
    adminEmail: emailConfig.adminEmail,
    customerName: data.customerName,
    amount: data.amount
  })

  if (!isEmailServiceAvailable()) {
    console.warn('⚠️ Email service not configured. Skipping admin notification.')
    return false
  }

  try {
    console.log('📧 Sending admin notification via Resend...')
    
    const result = await resend.emails.send({
      from: `${emailConfig.fromName} <${emailConfig.from}>`,
      to: emailConfig.adminEmail,
      replyTo: emailConfig.replyTo,
      subject: `💳 New Document Purchase - R${data.amount} - ${data.customerName}`,
      html: getAdminEmailTemplate(data)
    })

    if (result.error) {
      console.error('❌ Resend API Error (Admin):', result.error)
      return false
    }

    console.log('📧 Admin notification email sent successfully:', {
      emailId: result.data?.id,
      adminEmail: emailConfig.adminEmail,
      customer: data.customerName,
      document: data.documentTitle,
      amount: data.amount,
      reference: data.reference
    })

    return true
  } catch (error) {
    console.error('❌ Error sending admin notification:', error)
    if (error instanceof Error) {
      console.error('❌ Error details:', error.message)
    }
    return false
  }
}

/**
 * Send both customer and admin emails for a successful payment
 */
export async function sendPaymentNotificationEmails(paymentData: {
  customerName: string
  customerEmail: string
  customerPhone?: string
  documentTitle: string
  documentCategory: string
  documentId: string
  amount: number
  reference: string
  paymentDate: Date
}): Promise<{ customerEmailSent: boolean; adminEmailSent: boolean }> {
  
  console.log('📧 Starting payment notification emails process...', {
    customerEmail: paymentData.customerEmail,
    documentTitle: paymentData.documentTitle,
    reference: paymentData.reference,
    amount: paymentData.amount
  })
  
  const downloadUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/${paymentData.reference}`
  console.log('🔗 Download URL generated:', downloadUrl)
  
  // Customer email data
  const customerEmailData: CustomerEmailData = {
    customerName: paymentData.customerName,
    customerEmail: paymentData.customerEmail,
    documentTitle: paymentData.documentTitle,
    amount: paymentData.amount,
    reference: paymentData.reference,
    downloadUrl
  }

  // Admin email data
  const adminEmailData: AdminEmailData = {
    customerName: paymentData.customerName,
    customerEmail: paymentData.customerEmail,
    customerPhone: paymentData.customerPhone,
    documentTitle: paymentData.documentTitle,
    documentCategory: paymentData.documentCategory,
    amount: paymentData.amount,
    reference: paymentData.reference,
    paymentDate: paymentData.paymentDate.toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Send emails concurrently
  const [customerEmailSent, adminEmailSent] = await Promise.all([
    sendCustomerDocumentEmail(customerEmailData),
    sendAdminNotificationEmail(adminEmailData)
  ])

  console.log('📧 Payment notification emails summary:', {
    reference: paymentData.reference,
    customerEmailSent,
    adminEmailSent,
    customer: paymentData.customerEmail,
    document: paymentData.documentTitle
  })

  return { customerEmailSent, adminEmailSent }
} 