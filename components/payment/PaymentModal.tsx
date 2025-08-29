"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, X } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  document: {
    id: number
    title: string
    price: string
    format: string
    category: string
  } | null
}

export function PaymentModal({ isOpen, onClose, document }: PaymentModalProps) {
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  // Reset form when modal opens/closes
  const handleModalChange = (open: boolean) => {
    if (!open) {
      setCustomerData({ name: "", email: "", phone: "" })
      setError("")
      setIsProcessing(false)
      onClose()
    }
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user starts typing
  }

  // Validate form data
  const validateForm = () => {
    if (!customerData.name.trim()) {
      setError("Full name is required")
      return false
    }
    if (!customerData.email.trim()) {
      setError("Email address is required")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      setError("Please enter a valid email address")
      return false
    }
    return true
  }

  // Extract price as number from string like "R 450"
  const extractPrice = (priceString: string): number => {
    const match = priceString.match(/(\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  // Handle payment initialization
  const handlePayment = async () => {
    if (!document || !validateForm()) return

    setIsProcessing(true)
    setError("")

    try {
      // Prepare payment data
      const paymentData = {
        documentId: document.id.toString(),
        documentTitle: document.title,
        documentPrice: extractPrice(document.price),
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone || undefined,
      }

      console.log('🚀 Initializing payment with data:', paymentData)

      // Initialize payment with Paystack
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Payment initialization failed')
      }

      if (result.status && result.data?.authorization_url) {
        console.log('✅ Payment initialized successfully, redirecting to Paystack')
        
        // Redirect to Paystack payment page
        window.location.href = result.data.authorization_url
      } else {
        throw new Error('Invalid response from payment service')
      }

    } catch (error) {
      console.error('❌ Payment initialization error:', error)
      setError(error instanceof Error ? error.message : 'Payment initialization failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!document) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleModalChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Complete Your Purchase
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Summary */}
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <h3 className="font-semibold text-primary mb-2">{document.title}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Price:</strong> {document.price}</p>
              <p><strong>Format:</strong> {document.format}</p>
              <p><strong>Category:</strong> {document.category}</p>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Your Information</h4>
            
            <div>
              <Label htmlFor="customer-name">Full Name *</Label>
              <Input
                id="customer-name"
                type="text"
                placeholder="Enter your full name"
                value={customerData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={isProcessing}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="customer-email">Email Address *</Label>
              <Input
                id="customer-email"
                type="email"
                placeholder="your.email@example.com"
                value={customerData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isProcessing}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="customer-phone">Phone Number (Optional)</Label>
              <Input
                id="customer-phone"
                type="tel"
                placeholder="+27 12 345 6789"
                value={customerData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={isProcessing}
                className="mt-1"
              />
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Payment Button */}
          <div className="space-y-3">
            <Button
              onClick={handlePayment}
              disabled={isProcessing || !customerData.name || !customerData.email}
              className="w-full bg-primary hover:bg-primary-600 text-white py-3"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay {document.price} - Secure Payment
                </>
              )}
            </Button>

            <div className="text-xs text-gray-500 text-center space-y-1">
              <p>Secure payment powered by Paystack</p>
              <p>You will be redirected to complete your payment</p>
            </div>
          </div>

          {/* Included Benefits Reminder */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>Included:</strong> Your purchase includes a complimentary 20-minute consultation 
              with our qualified attorneys to discuss the document.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 