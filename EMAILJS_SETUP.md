# EmailJS Setup Guide

This project uses EmailJS to send emails directly from the frontend without requiring a backend server.

## Installation

EmailJS has been installed via npm:
```bash
npm install @emailjs/browser
```

## Configuration

### 1. Get EmailJS Credentials

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template
4. Get your:
   - Public Key
   - Service ID
   - Template ID

### 2. Update Environment Variables

Update the following variables in your `.env` file:

```env
# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key_here
VITE_EMAILJS_SERVICE_ID=your_actual_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id_here
```

### 3. Email Template Example

Create a template in EmailJS dashboard with these variables:

```
{{to_name}},

{{message}}

From: {{from_name}}
Email: {{to_email}}
Subject: {{subject}}
```

## Usage

### Basic Email Sending

```typescript
import { sendEmail } from '@/services/emailService';

const result = await sendEmail({
  to_email: 'recipient@example.com',
  to_name: 'John Doe',
  from_name: 'Your Name',
  message: 'Your message here',
  subject: 'Email Subject'
});
```

### Contact Form

```typescript
import { sendContactEmail } from '@/services/emailService';

const result = await sendContactEmail({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Your message here',
  subject: 'Contact Form Submission'
});
```

### Order Confirmation

```typescript
import { sendOrderConfirmationEmail } from '@/services/emailService';

const result = await sendOrderConfirmationEmail({
  customerEmail: 'customer@example.com',
  customerName: 'Jane Doe',
  orderId: 'ORD-12345',
  orderTotal: 99.99,
  items: [{ name: 'Product 1', quantity: 2 }]
});
```

## Components

### ContactForm Component

A ready-to-use contact form component is available at `src/components/ContactForm.tsx`.

```tsx
import ContactForm from '@/components/ContactForm';

// Use in your component
<ContactForm />
```

## Security Notes

- EmailJS is suitable for transactional emails (contact forms, order confirmations, etc.)
- Do not use for bulk email marketing
- Your public key is exposed in the frontend, but EmailJS has rate limiting and security measures
- Consider implementing additional validation on your email templates

## Rate Limits

EmailJS has the following rate limits on free plans:
- 200 emails per month
- 2 requests per second

Check your EmailJS dashboard for current limits and consider upgrading for higher volume.

## Troubleshooting

### Common Issues

1. **"Email not sent" error**: Check your environment variables are correctly set
2. **Template not found**: Verify your template ID matches exactly
3. **Service not found**: Ensure your email service is properly configured in EmailJS dashboard
4. **CORS issues**: Make sure your domain is added to EmailJS allowed domains

### Debug Mode

Enable debug logging in development:

```typescript
// In emailService.ts
emailjs.init(EMAILJS_PUBLIC_KEY, {
  debug: true // Enable debug mode
});
```

## Additional Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS React Guide](https://www.emailjs.com/docs/sdk/react/)
- [Email Template Variables](https://www.emailjs.com/docs/features/email-templates/)
