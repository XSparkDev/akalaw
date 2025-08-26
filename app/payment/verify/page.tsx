"use client"

/**
 * Payment Verification Page
 * Users are redirected here after completing payment on Paystack
 */

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2, FileText, Download, Mail } from 'lucide-react'

interface VerificationResult {
  status: 'loading' | 'success' | 'failed' | 'error'
  message: string
  documentTitle?: string
  reference?: string
  amount?: number
}

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [result, setResult] = useState<VerificationResult>({
    status: 'loading',
    message: 'Verifying your payment...'
  })

  useEffect(() => {
    const reference = searchParams.get('reference')
    
    if (!reference) {
      setResult({
        status: 'error',
        message: 'Invalid payment reference. Please try again.'
      })
      return
    }

    verifyPayment(reference)
  }, [searchParams])

  const verifyPayment = async (reference: string) => {
    try {
      const response = await fetch(`/api/payment/verify?reference=${reference}`)
      const data = await response.json()

      if (data.status && data.data.status === 'success') {
        setResult({
          status: 'success',
          message: 'Payment successful! Your document is ready for download.',
          documentTitle: data.data.metadata.documentTitle,
          reference: data.data.reference,
          amount: data.data.amount / 100 // Convert from cents to rand
        })
      } else {
        setResult({
          status: 'failed',
          message: data.data?.gateway_response || 'Payment was not successful. Please try again.'
        })
      }
    } catch (error) {
      console.error('Verification error:', error)
      setResult({
        status: 'error',
        message: 'Failed to verify payment. Please contact support.'
      })
    }
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  const handleDownloadDocument = () => {
    if (!result.reference) return
    
    // Download document via secure API
    const downloadUrl = `/api/download/${result.reference}`
    
    // Create a temporary link and trigger download
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${result.documentTitle?.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    console.log('📥 Document download initiated:', {
      reference: result.reference,
      document: result.documentTitle
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-8 text-center">
          
          {/* Loading State */}
          {result.status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h1>
              <p className="text-gray-600">{result.message}</p>
            </>
          )}

          {/* Success State */}
          {result.status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-4">{result.message}</p>
              
              {result.documentTitle && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <FileText className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">Document Purchased</span>
                  </div>
                  <p className="text-green-700 text-sm">{result.documentTitle}</p>
                  {result.amount && (
                    <p className="text-green-600 text-sm mt-1">Amount: R{result.amount.toLocaleString()}</p>
                  )}
                  {result.reference && (
                    <p className="text-green-600 text-xs mt-1">Reference: {result.reference}</p>
                  )}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <Mail className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-blue-800">Document Delivered!</span>
                </div>
                <p className="text-blue-700 text-sm">
                  We've automatically sent your document to your email address. You can also download it directly using the button below.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleDownloadDocument}
                  className="w-full bg-primary hover:bg-primary-600 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Document Now
                </Button>
                <Button
                  onClick={handleBackToHome}
                  variant="outline"
                  className="w-full"
                >
                  Back to Home
                </Button>
              </div>
            </>
          )}

          {/* Failed State */}
          {result.status === 'failed' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
              <p className="text-gray-600 mb-6">{result.message}</p>
              
              <div className="space-y-3">
                <Button
                  onClick={handleBackToHome}
                  className="w-full bg-primary hover:bg-primary-600 text-white"
                >
                  Try Again
                </Button>
              </div>
            </>
          )}

          {/* Error State */}
          {result.status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Error</h1>
              <p className="text-gray-600 mb-6">{result.message}</p>
              
              <div className="space-y-3">
                <Button
                  onClick={handleBackToHome}
                  className="w-full bg-primary hover:bg-primary-600 text-white"
                >
                  Back to Home
                </Button>
              </div>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  )
} 