/**
 * API Route: Document Download
 * GET /api/download/[reference]
 * Allows customers to download their purchased documents
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPaymentByReference } from '../../../../lib/firebase/firestore'
import path from 'path'
import fs from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: { reference: string } }
) {
  try {
    const reference = params.reference

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      )
    }

    // Verify payment exists and is successful
    const paymentRecord = await getPaymentByReference(reference)

    if (!paymentRecord) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      )
    }

    if (paymentRecord.paymentStatus !== 'success') {
      return NextResponse.json(
        { error: 'Payment not completed successfully' },
        { status: 403 }
      )
    }

    // Map document ID to file paths
    const documentFiles = getDocumentFiles(paymentRecord.documentId)

    if (!documentFiles) {
      return NextResponse.json(
        { error: 'Document files not found' },
        { status: 404 }
      )
    }

    // Return the ZIP file containing both PDF and Word versions
    const filePath = path.join(process.cwd(), 'public', 'documents', documentFiles.zip)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('❌ Document file not found:', filePath)
      return NextResponse.json(
        { 
          error: 'Document file not available yet. We are preparing your document and will email it to you shortly. Please contact support if you need immediate assistance.',
          reference: reference,
          documentTitle: paymentRecord.documentTitle 
        },
        { status: 404 }
      )
    }

    // Record download in database
    try {
      const { recordDocumentDownload } = await import('../../../../lib/firebase/firestore')
      await recordDocumentDownload(
        reference,
        paymentRecord.customerEmail,
        paymentRecord.documentId,
        {
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      )
    } catch (error) {
      console.warn('⚠️ Failed to record download (non-blocking):', error)
    }

    // Read and serve the file
    const fileBuffer = fs.readFileSync(filePath)
    const fileName = `${paymentRecord.documentTitle.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}.zip`

    console.log('📥 Document download served:', {
      reference,
      customer: paymentRecord.customerEmail,
      document: paymentRecord.documentTitle,
      fileName
    })

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Expires': '0',
        'Pragma': 'no-cache'
      }
    })

  } catch (error) {
    console.error('❌ Download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Map document ID to file paths
 */
function getDocumentFiles(documentId: string): { zip: string } | null {
  const documentMap: { [key: string]: { zip: string } } = {
    '1': {
      zip: 'offer-to-purchase-residential.zip'
    },
    '2': {
      zip: 'last-will-testament.zip'
    },
    '3': {
      zip: 'living-will.zip'
    }
  }

  return documentMap[documentId] || null
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to download documents.' },
    { status: 405 }
  )
} 