import FormData from 'form-data';
import Mailgun from 'mailgun.js';

// Mailgun configuration
const MAILGUN_API_KEY = import.meta.env.VITE_MAILGUN_API_KEY;
const MAILGUN_DOMAIN = import.meta.env.VITE_MAILGUN_DOMAIN;

// Initialize Mailgun
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: MAILGUN_API_KEY
});

export interface EmailParams {
  to_email: string;
  to_name?: string;
  from_name: string;
  message: string;
  subject?: string;
  [key: string]: any; // Allow additional template parameters
}

export const sendEmail = async (params: EmailParams): Promise<boolean> => {
  try {
    const data = {
      from: `${params.from_name} <noreply@${MAILGUN_DOMAIN}>`,
      to: params.to_email,
      subject: params.subject || 'No Subject',
      text: params.message,
      html: params.html || `<p>${params.message}</p>`
    };

    await mg.messages.create(MAILGUN_DOMAIN, data);
    console.log('Email sent successfully via Mailgun');
    return true;
  } catch (error) {
    console.error('Failed to send email via Mailgun:', error);
    return false;
  }
};

export const sendContactEmail = async (formData: {
  name: string;
  email: string;
  message: string;
  subject?: string;
}): Promise<boolean> => {
  const adminEmails = ['sendthistoash1@gmail.com', 'anjudeepak84@gmail.com'];
  
  const emailContent = `
    New Contact Form Submission
    
    From: ${formData.name} (${formData.email})
    Subject: ${formData.subject || 'New Contact Form Submission'}
    
    Message:
    ${formData.message}
  `;

  try {
    // Send to all admin emails
    const promises = adminEmails.map(adminEmail => 
      mg.messages.create(MAILGUN_DOMAIN, {
        from: `FashionSpectrum Contact Form <noreply@${MAILGUN_DOMAIN}>`,
        to: adminEmail,
        subject: formData.subject || 'New Contact Form Submission',
        text: emailContent,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${formData.name} (${formData.email})</p>
          <p><strong>Subject:</strong> ${formData.subject || 'New Contact Form Submission'}</p>
          <h3>Message:</h3>
          <p>${formData.message}</p>
        `
      })
    );
    
    await Promise.all(promises);
    console.log('Contact emails sent successfully to all admins via Mailgun');
    return true;
  } catch (error) {
    console.error('Failed to send contact emails via Mailgun:', error);
    return false;
  }
};

export const sendOrderConfirmationEmail = async (orderData: {
  customerEmail: string;
  customerName: string;
  orderId: string;
  orderTotal: number;
  items: any[];
}): Promise<boolean> => {
  const itemsList = orderData.items.map((item: any) => 
    `<li>${item.name || item.product_name} - $${item.price || item.total}</li>`
  ).join('');

  const emailContent = `
    Order Confirmation - ${orderData.orderId}
    
    Dear ${orderData.customerName},
    
    Thank you for your order! Your order ${orderData.orderId} has been confirmed.
    
    Order Total: $${orderData.orderTotal}
    
    Items:
    ${orderData.items.map((item: any) => `- ${item.name || item.product_name}: $${item.price || item.total}`).join('\n')}
  `;

  return sendEmail({
    to_email: orderData.customerEmail,
    to_name: orderData.customerName,
    from_name: 'Kaftan Store',
    message: emailContent,
    subject: `Order Confirmation - ${orderData.orderId}`,
    html: `
      <h2>Order Confirmation - ${orderData.orderId}</h2>
      <p>Dear ${orderData.customerName},</p>
      <p>Thank you for your order! Your order ${orderData.orderId} has been confirmed.</p>
      <h3>Order Total: $${orderData.orderTotal}</h3>
      <h3>Items:</h3>
      <ul>${itemsList}</ul>
    `
  });
};

export const sendNewsletterEmail = async (email: string): Promise<boolean> => {
  try {
    const data = {
      from: `FashionSpectrum <noreply@${MAILGUN_DOMAIN}>`,
      to: email,
      subject: 'Welcome to FashionSpectrum!',
      text: 'Thank you for subscribing to our newsletter! You will now receive updates about new collections, special offers, and exclusive deals.',
      html: `
        <h2>Welcome to FashionSpectrum!</h2>
        <p>Thank you for subscribing to our newsletter!</p>
        <p>You will now receive updates about new collections, special offers, and exclusive deals.</p>
      `
    };

    await mg.messages.create(MAILGUN_DOMAIN, data);
    console.log('Newsletter email sent successfully via Mailgun');
    return true;
  } catch (error) {
    console.error('Failed to send newsletter email via Mailgun:', error);
    return false;
  }
};

export default mg;
