/**
 * Email Configuration
 * Handles email sending via Resend
 */

import { Resend } from 'resend'

// Initialize Resend with API key
export const resend = new Resend(process.env.RESEND_API_KEY)

// Log initialization status
console.log('🔧 Email service initializing...', {
  hasApiKey: !!process.env.RESEND_API_KEY,
  apiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 8) + '...' || 'NOT SET'
})

// Email configuration
export const emailConfig = {
  from: 'info@akalaw.co.za', // Your verified domain email
  fromName: 'AKA Law',
  adminEmail: 'websales@akalaw.co.za',
  replyTo: 'info@akalaw.co.za'
}

// Validate email configuration
export function validateEmailConfig() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined in environment variables. Please add it to your .env.local file.')
  }
  
  console.log('✅ Email service configured with Resend API key:', process.env.RESEND_API_KEY.substring(0, 10) + '...')
}

// Check if email service is available
export const isEmailServiceAvailable = () => !!process.env.RESEND_API_KEY 