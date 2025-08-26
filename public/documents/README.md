# Legal Documents Directory

This directory contains the legal documents that are delivered to customers after successful payment.

## File Structure

Each document should have both PDF and Word versions:

```
offer-to-purchase-residential.pdf
offer-to-purchase-residential.docx
last-will-testament.pdf
last-will-testament.docx
living-will.pdf
living-will.docx
```

## Document Mapping

The system maps document IDs to filenames:

- **Document ID 1**: Offer To Purchase - Residential Property
  - `offer-to-purchase-residential.pdf`
  - `offer-to-purchase-residential.docx`

- **Document ID 2**: Last Will & Testament
  - `last-will-testament.pdf`
  - `last-will-testament.docx`

- **Document ID 3**: Living Will
  - `living-will.pdf`
  - `living-will.docx`

## Adding New Documents

1. Add the PDF and Word files to this directory
2. Update the `getDocumentFiles()` function in `/app/api/download/[reference]/route.ts`
3. Add the document to the `legalDocuments` array in `/app/page.tsx`

## Security Notes

- Documents are only accessible via the secure download API
- Downloads are logged and tracked
- Only customers with successful payments can download documents
- Each download is recorded with IP address and timestamp 