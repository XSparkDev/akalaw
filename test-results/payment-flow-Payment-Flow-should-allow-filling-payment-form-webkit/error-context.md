# Page snapshot

```yaml
- dialog "Complete Your Purchase":
  - heading "Complete Your Purchase" [level=2]
  - button:
    - img
  - heading "Offer To Purchase - Residential Property" [level=3]
  - paragraph:
    - strong: "Price:"
    - text: R 450
  - paragraph:
    - strong: "Format:"
    - text: ZIP (PDF & Word)
  - paragraph:
    - strong: "Category:"
    - text: property
  - heading "Your Information" [level=4]
  - text: Full Name *
  - textbox "Full Name *"
  - text: Email Address *
  - textbox "Email Address *": test@example.com
  - text: Phone Number (Optional)
  - textbox "Phone Number (Optional)"
  - button "Pay R 450 - Secure Payment" [disabled]:
    - img
    - text: Pay R 450 - Secure Payment
  - paragraph: Secure payment powered by Paystack
  - paragraph: You will be redirected to complete your payment
  - paragraph:
    - strong: "Included:"
    - text: Your purchase includes a complimentary 20-minute consultation with our qualified attorneys to discuss the document.
  - button "Close":
    - img
    - text: Close
```