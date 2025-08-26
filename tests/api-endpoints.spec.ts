import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test('should initialize payment successfully', async ({ request }) => {
    const response = await request.post('/api/payment/initialize', {
      data: {
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '+27123456789',
        documentId: '1',
        documentTitle: 'Offer To Purchase - Residential Property',
        documentPrice: 450,
        documentCategory: 'property'
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBeTruthy();
    expect(data.data.reference).toBeDefined();
    expect(data.data.authorizationUrl).toBeDefined();
  });

  test('should save payment data to Firebase', async ({ request }) => {
    const response = await request.post('/api/payment/save', {
      data: {
        paymentReference: 'TEST_REF_123',
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '+27123456789',
        documentId: '1',
        documentTitle: 'Offer To Purchase - Residential Property',
        documentPrice: 450,
        documentCategory: 'property'
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBeTruthy();
  });

  test('should handle payment verification', async ({ request }) => {
    // First create a test payment
    const initResponse = await request.post('/api/payment/initialize', {
      data: {
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '+27123456789',
        documentId: '1',
        documentTitle: 'Offer To Purchase - Residential Property',
        documentPrice: 450,
        documentCategory: 'property'
      }
    });

    const initData = await initResponse.json();
    const reference = initData.data.reference;

    // Test verification endpoint
    const verifyResponse = await request.get(`/api/payment/verify?reference=${reference}`);
    expect(verifyResponse.ok()).toBeTruthy();
  });

  test('should handle download endpoint', async ({ request }) => {
    // This test would require a valid payment reference
    // For now, just test that the endpoint exists
    const response = await request.get('/api/download/TEST_REF_123');
    // Should return 404 for invalid reference, but endpoint should exist
    expect(response.status()).toBe(404);
  });
}); 