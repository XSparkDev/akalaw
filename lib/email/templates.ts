/**
 * Email Templates
 * HTML email templates for customer and admin notifications
 */

export interface CustomerEmailData {
  customerName: string
  customerEmail: string
  documentTitle: string
  amount: number
  reference: string
  downloadUrl: string
}

export interface AdminEmailData {
  customerName: string
  customerEmail: string
  customerPhone?: string
  documentTitle: string
  documentCategory: string
  amount: number
  reference: string
  paymentDate: string
}

/**
 * Customer Email Template - Document Delivery
 */
export function getCustomerEmailTemplate(data: CustomerEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Legal Document Purchase</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: #1e40af; color: white; padding: 30px; text-align: center; }
        .logo { font-size: 24px; font-weight: bold; }
        .content { padding: 40px 30px; }
        .document-info { background: #f1f5f9; border-left: 4px solid #1e40af; padding: 20px; margin: 20px 0; }
        .download-button { display: inline-block; background: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .download-button:hover { background: #1d4ed8; }
        .consultation-info { background: #dcfce7; border-left: 4px solid #16a34a; padding: 20px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; font-size: 14px; color: #6b7280; }
        .reference { font-family: monospace; background: #f3f4f6; padding: 5px 10px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">AKA LAW</div>
          <p>Anchané Kriek Attorneys</p>
        </div>
        
        <div class="content">
          <h2>Thank you for your purchase, ${data.customerName}!</h2>
          
          <p>Your legal document purchase has been successfully processed. You can download your document using the link below.</p>
          
          <div class="document-info">
            <h3>📄 Document Details</h3>
            <p><strong>Document:</strong> ${data.documentTitle}</p>
            <p><strong>Amount Paid:</strong> R${data.amount.toLocaleString()}</p>
            <p><strong>Reference:</strong> <span class="reference">${data.reference}</span></p>
            <p><strong>Format:</strong> PDF & Word Document</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.downloadUrl}" class="download-button">📥 Download Your Document</a>
          </div>
          
          <div class="consultation-info">
            <h3>🎁 FREE Consultation Included!</h3>
            <p><strong>Your purchase includes a complimentary 20-minute consultation</strong> with one of our qualified attorneys to discuss the document and answer any questions about its use.</p>
            <p>To schedule your consultation, simply reply to this email or call us at <strong>+27 82 562 3826</strong>.</p>
          </div>
          
          <h3>📋 Important Notes:</h3>
          <ul>
            <li>This document is for informational purposes and does not constitute legal advice</li>
            <li>We recommend reviewing the document with a qualified attorney before use</li>
            <li>Your 20-minute consultation can help ensure proper usage</li>
            <li>Keep this email and your reference number for your records</li>
          </ul>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact us:</p>
          <ul>
            <li><strong>Email:</strong> info@akalaw.co.za</li>
            <li><strong>Phone:</strong> +27 82 562 3826</li>
            <li><strong>Website:</strong> www.akalaw.co.za</li>
          </ul>
        </div>
        
        <div class="footer">
          <p><strong>AKA Law - Anchané Kriek Attorneys</strong></p>
          <p>2 Lenchen Park, Lenchen Avenue South, Centurion, 0046, South Africa</p>
          <p>This email was sent because you purchased a legal document from our website.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Admin Email Template - Payment Notification
 */
export function getAdminEmailTemplate(data: AdminEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Document Purchase - ${data.reference}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: #059669; color: white; padding: 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .success-badge { background: #dcfce7; color: #166534; padding: 10px 20px; border-radius: 25px; display: inline-block; font-weight: bold; margin-bottom: 20px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .info-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #1e40af; }
        .info-card h4 { margin: 0 0 10px 0; color: #1e40af; }
        .reference { font-family: monospace; background: #f3f4f6; padding: 5px 10px; border-radius: 3px; }
        .amount { font-size: 24px; font-weight: bold; color: #059669; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
        @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💳 New Document Purchase</h1>
          <p>Payment Successfully Processed</p>
        </div>
        
        <div class="content">
          <div class="success-badge">✅ PAYMENT SUCCESSFUL</div>
          
          <h2>Purchase Details</h2>
          
          <div class="info-grid">
            <div class="info-card">
              <h4>👤 Customer Information</h4>
              <p><strong>Name:</strong> ${data.customerName}</p>
              <p><strong>Email:</strong> ${data.customerEmail}</p>
              ${data.customerPhone ? `<p><strong>Phone:</strong> ${data.customerPhone}</p>` : ''}
            </div>
            
            <div class="info-card">
              <h4>📄 Document Information</h4>
              <p><strong>Title:</strong> ${data.documentTitle}</p>
              <p><strong>Category:</strong> ${data.documentCategory}</p>
              <p><strong>Format:</strong> PDF & Word</p>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f0fdf4; border-radius: 8px;">
            <div class="amount">R${data.amount.toLocaleString()}</div>
            <p><strong>Payment Date:</strong> ${data.paymentDate}</p>
            <p><strong>Reference:</strong> <span class="reference">${data.reference}</span></p>
          </div>
          
          <h3>📋 Action Items:</h3>
          <ul>
            <li>Customer has been automatically sent the document via email</li>
            <li>Customer has access to 20-minute free consultation</li>
            <li>Payment has been recorded in the system</li>
            <li>Customer data has been saved for future reference</li>
          </ul>
          
          <h3>📊 Customer Contact:</h3>
          <p>The customer may contact you for their free consultation or if they have any questions about the document.</p>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <p><strong>💡 Reminder:</strong> Each document purchase includes a complimentary 20-minute consultation. Make sure to provide excellent service to encourage repeat business and referrals.</p>
          </div>
        </div>
        
        <div class="footer">
          <p>This notification was automatically generated by the AKA Law website payment system.</p>
          <p>Payment processed via Paystack • Document delivered via automated system</p>
        </div>
      </div>
    </body>
    </html>
  `
} 