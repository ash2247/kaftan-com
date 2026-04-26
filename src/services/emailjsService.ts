import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_CONTACT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID;
const EMAILJS_ORDER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID;
const EMAILJS_AUTOREPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;

// Initialize EmailJS
if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export interface EmailParams {
  to_email: string;
  to_name?: string;
  from_name: string;
  message: string;
  subject?: string;
  [key: string]: any;
}

export const sendEmail = async (params: EmailParams): Promise<boolean> => {
  try {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      console.error('EmailJS not configured. Please set VITE_EMAILJS_SERVICE_ID and VITE_EMAILJS_TEMPLATE_ID in .env');
      return false;
    }

    const templateParams = {
      to_email: params.to_email,
      to_name: params.to_name || params.to_email,
      from_name: params.from_name,
      message: params.message,
      subject: params.subject || 'No Subject',
      ...params
    };

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    console.log('Email sent successfully via EmailJS');
    return true;
  } catch (error) {
    console.error('Failed to send email via EmailJS:', error);
    return false;
  }
};

export const sendAutoReplyEmail = async (formData: {
  name: string;
  email: string;
  message: string;
  subject?: string;
}): Promise<boolean> => {
  try {
    if (!EMAILJS_SERVICE_ID) {
      console.error('EmailJS not configured');
      return false;
    }

    const templateId = EMAILJS_AUTOREPLY_TEMPLATE_ID || EMAILJS_TEMPLATE_ID;
    if (!templateId) {
      console.error('EmailJS auto-reply template not configured');
      return false;
    }

    const templateParams = {
      to_email: formData.email,
      to_name: formData.name,
      from_name: 'Fashion Spectrum',
      subject: formData.subject || 'Your inquiry has been received',
      message: formData.message,
      title: formData.subject || 'Your inquiry',
      reply_to: 'sendthistoash1@gmail.com'
    };

    await emailjs.send(EMAILJS_SERVICE_ID, templateId, templateParams);
    console.log('Auto-reply email sent successfully to customer via EmailJS');
    return true;
  } catch (error) {
    console.error('Failed to send auto-reply email via EmailJS:', error);
    return false;
  }
};

export const sendContactEmail = async (formData: {
  name: string;
  email: string;
  message: string;
  subject?: string;
}): Promise<boolean> => {
  try {
    if (!EMAILJS_SERVICE_ID) {
      console.error('EmailJS not configured. Please set VITE_EMAILJS_SERVICE_ID in .env');
      return false;
    }

    const templateId = EMAILJS_CONTACT_TEMPLATE_ID || EMAILJS_TEMPLATE_ID;
    if (!templateId) {
      console.error('EmailJS template not configured');
      return false;
    }

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      to_name: 'Admin',
      message: formData.message,
      subject: formData.subject || 'New Contact Form Submission',
      time: new Date().toLocaleString(),
      phone: 'Not provided'
    };

    // Send admin notification
    await emailjs.send(EMAILJS_SERVICE_ID, templateId, templateParams);
    console.log('Contact email sent successfully to admins via EmailJS');

    return true;
  } catch (error) {
    console.error('Failed to send contact email via EmailJS:', error);
    return false;
  }
};

// Separate function to send auto-reply to users
export const sendUserAutoReply = async (formData: {
  name: string;
  email: string;
  subject?: string;
}): Promise<boolean> => {
  try {
    if (!EMAILJS_SERVICE_ID) {
      console.error('EmailJS not configured for auto-reply');
      return false;
    }

    const autoReplyTemplateId = EMAILJS_AUTOREPLY_TEMPLATE_ID || EMAILJS_TEMPLATE_ID;
    if (!autoReplyTemplateId) {
      console.error('Auto-reply template not configured');
      return false;
    }

    const templateParams = {
      to_email: formData.email,
      to_name: formData.name,
      from_name: 'Fashion Spectrum',
      subject: formData.subject || 'Your inquiry has been received',
      message: 'Thank you for contacting Fashion Spectrum! We have received your message and will get back to you within 24 hours.'
    };

    await emailjs.send(EMAILJS_SERVICE_ID, autoReplyTemplateId, templateParams);
    console.log('Auto-reply sent successfully to user via EmailJS');

    return true;
  } catch (error) {
    console.error('Failed to send auto-reply via EmailJS:', error);
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
  try {
    if (!EMAILJS_SERVICE_ID) {
      console.error('EmailJS not configured. Please set VITE_EMAILJS_SERVICE_ID in .env');
      return false;
    }

    const templateId = EMAILJS_ORDER_TEMPLATE_ID || EMAILJS_TEMPLATE_ID;
    if (!templateId) {
      console.error('EmailJS template not configured');
      return false;
    }

    const itemsList = orderData.items.map((item: any) => 
      `${item.name || item.product_name} - $${item.price || item.total}`
    ).join(', ');

    const templateParams = {
      to_email: orderData.customerEmail,
      to_name: orderData.customerName,
      from_name: 'Fashion Spectrum',
      order_id: orderData.orderId,
      order_total: orderData.orderTotal,
      items: itemsList,
      message: `Your order ${orderData.orderId} has been confirmed. Total: $${orderData.orderTotal}. Items: ${itemsList}`,
      subject: `Order Confirmation - ${orderData.orderId}`
    };

    await emailjs.send(EMAILJS_SERVICE_ID, templateId, templateParams);
    console.log('Order confirmation email sent successfully via EmailJS');
    return true;
  } catch (error) {
    console.error('Failed to send order confirmation email via EmailJS:', error);
    return false;
  }
};

export const sendNewsletterAdminNotification = async (subscriberEmail: string): Promise<boolean> => {
  try {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      console.error('EmailJS not configured');
      return false;
    }

    const templateParams = {
      from_name: 'Fashion Spectrum System',
      from_email: 'noreply@fashionspectrum.com',
      to_name: 'Admin',
      message: `New newsletter subscription received from: ${subscriberEmail}\n\nThe user has been successfully added to the mailing list and will receive future newsletters.`,
      subject: 'New Newsletter Subscription - Fashion Spectrum'
    };

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    console.log('Newsletter admin notification sent successfully via EmailJS');
    return true;
  } catch (error) {
    console.error('Failed to send newsletter admin notification via EmailJS:', error);
    return false;
  }
};

export const sendNewsletterEmail = async (email: string): Promise<boolean> => {
  try {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      console.error('EmailJS not configured');
      return false;
    }

    // Send welcome email to subscriber
    const templateParams = {
      to_email: email,
      to_name: email,
      from_name: 'Fashion Spectrum',
      message: 'Thank you for subscribing to our newsletter! You will now receive updates about new collections, special offers, and exclusive deals.',
      subject: 'Welcome to Fashion Spectrum Newsletter!'
    };

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    console.log('Newsletter email sent successfully via EmailJS');

    // Send admin notification
    await sendNewsletterAdminNotification(email);
    console.log('Newsletter admin notification sent successfully');

    return true;
  } catch (error) {
    console.error('Failed to send newsletter email via EmailJS:', error);
    return false;
  }
};

export default emailjs;
