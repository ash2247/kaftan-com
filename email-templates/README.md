# EmailJS Auto-Reply Template Setup

## Auto-Reply Email Template

The auto-reply template sends an automatic response to customers when they submit the contact form.

### EmailJS Template Configuration

1. Go to your [EmailJS Dashboard](https://dashboard.emailjs.com/admin/templates)
2. Click "Create New Template"
3. Use the HTML code from `auto-reply.html`
4. Set the template name to "Auto Reply"
5. Configure these template variables:

### Required Template Variables

| Variable | Description |
|----------|-------------|
| `{{to_name}}` | Customer's name |
| `{{to_email}}` | Customer's email address |
| `{{subject}}` | Subject of their inquiry |
| `{{message}}` | Customer's message content |
| `{{title}}` | Short title of the inquiry (same as subject) |
| `{{from_name}}` | Your company name (e.g., "Kaftan Store") |

### HTML Template for EmailJS

```html
<div style="font-family: system-ui, sans-serif, Arial; font-size: 16px; max-width: 600px; margin: 0 auto;">
  <a style="text-decoration: none; outline: none" href="https://your-website.com" target="_blank">
    <img style="height: 32px; vertical-align: middle" height="32px" src="https://your-logo-url.com/logo.png" alt="Kaftan Store" />
  </a>
  
  <p style="padding-top: 16px; border-top: 1px solid #eaeaea">Hi {{to_name}},</p>
  
  <p>
    Thank you for reaching out to us! We have received your message regarding "{{subject}}", and we'll do our
    best to respond to you within 24-48 business hours.
  </p>
  
  <p style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
    <strong>Your Message:</strong><br/>
    {{message}}
  </p>
  
  <p>
    If your inquiry is urgent, please feel free to contact us directly at <a href="mailto:support@your-store.com">support@your-store.com</a>.
  </p>
  
  <p style="padding-top: 16px; border-top: 1px solid #eaeaea">
    Best regards,<br />
    <strong>The Kaftan Store Team</strong>
  </p>
  
  <p style="font-size: 12px; color: #666; padding-top: 16px; border-top: 1px solid #eaeaea;">
    This is an automated response. Please do not reply to this email.
  </p>
</div>
```

### Admin Notification Template

For the admin notification email, use this simpler template:

```html
<h2>New Contact Form Submission</h2>
<p><strong>From:</strong> {{from_name}} ({{from_email}})</p>
<p><strong>Subject:</strong> {{subject}}</p>
<h3>Message:</h3>
<p>{{message}}</p>
```

### Template Variables for Admin Email

| Variable | Description |
|----------|-------------|
| `{{from_name}}` | Customer's name |
| `{{from_email}}` | Customer's email |
| `{{to_email}}` | Admin email addresses |
| `{{subject}}` | Email subject |
| `{{message}}` | Customer's message |

## How It Works

When a customer submits the contact form:

1. **Admin Notification**: Sent to `sendthistoash1@gmail.com` and `anjudeepak84@gmail.com`
2. **Auto-Reply**: Automatically sent to the customer's email

## Environment Variables

After creating templates in EmailJS, update your `.env`:

```env
VITE_EMAILJS_PUBLIC_KEY=1KJ7wpQiONuj11t_m
VITE_EMAILJS_SERVICE_ID=service_3vs6v76
VITE_EMAILJS_TEMPLATE_ID=template_0asz1ta
VITE_EMAILJS_CONTACT_TEMPLATE_ID=your_admin_template_id
VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID=your_autoreply_template_id
```

## Testing

1. Create both templates in EmailJS
2. Copy the Template IDs
3. Update `.env` with the correct IDs
4. Submit a test message through the contact form
5. Check both admin inbox and customer auto-reply
