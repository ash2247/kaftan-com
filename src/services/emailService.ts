import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

// Initialize EmailJS with your public key
emailjs.init(EMAILJS_PUBLIC_KEY);

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
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      params
    );
    
    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
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
  
  const emailParams = {
    to_name: 'Admin',
    from_name: formData.name,
    message: formData.message,
    subject: formData.subject || 'New Contact Form Submission',
    customer_email: formData.email,
    customer_name: formData.name
  };

  try {
    // Send to all admin emails
    const promises = adminEmails.map(adminEmail => 
      emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          ...emailParams,
          to_email: adminEmail
        }
      )
    );
    
    await Promise.all(promises);
    console.log('Contact emails sent successfully to all admins');
    return true;
  } catch (error) {
    console.error('Failed to send contact emails:', error);
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
  return sendEmail({
    to_email: orderData.customerEmail,
    to_name: orderData.customerName,
    from_name: 'Kaftan Store',
    message: `Your order ${orderData.orderId} has been confirmed. Total: $${orderData.orderTotal}`,
    subject: `Order Confirmation - ${orderData.orderId}`,
    order_id: orderData.orderId,
    order_total: orderData.orderTotal,
    items: orderData.items
  });
};

export default emailjs;
