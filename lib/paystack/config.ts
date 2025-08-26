/**
 * Paystack Configuration
 * Handles API keys and base configuration for Paystack integration
 */

export const paystackConfig = {
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  secretKey: process.env.PAYSTACK_SECRET_KEY || '',
  baseUrl: 'https://api.paystack.co',
}

// Validate that required environment variables are present
export function validatePaystackConfig() {
  if (!paystackConfig.publicKey) {
    throw new Error('NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not defined in environment variables. Please add it to your .env.local file.')
  }

  if (!paystackConfig.secretKey) {
    throw new Error('PAYSTACK_SECRET_KEY is not defined in environment variables. Please add it to your .env.local file.')
  }
}

export default paystackConfig 