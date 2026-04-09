-- Add Stripe fields to orders table
-- This migration adds fields to store Stripe payment information

-- Add stripe_payment_intent_id field
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Add stripe_payment_status field
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_payment_status TEXT DEFAULT 'pending';

-- Add stripe_customer_id field (optional, for saving customer cards)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add stripe_payment_method_id field (optional, for saving payment method)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_payment_method_id TEXT;

-- Add stripe_receipt_url field (for Stripe receipt)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_receipt_url TEXT;

-- Add stripe_error field (for Stripe error messages)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_error TEXT;

-- Add stripe_metadata field (for additional Stripe metadata)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_metadata JSONB;

-- Create index on stripe_payment_intent_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent_id ON public.orders(stripe_payment_intent_id);

-- Add comment to explain the fields
COMMENT ON COLUMN public.orders.stripe_payment_intent_id IS 'Stripe Payment Intent ID for tracking payments';
COMMENT ON COLUMN public.orders.stripe_payment_status IS 'Stripe payment status (pending, succeeded, failed, canceled)';
COMMENT ON COLUMN public.orders.stripe_customer_id IS 'Stripe Customer ID for saving payment methods';
COMMENT ON COLUMN public.orders.stripe_payment_method_id IS 'Stripe Payment Method ID for the card used';
COMMENT ON COLUMN public.orders.stripe_receipt_url IS 'URL to Stripe receipt for the payment';
COMMENT ON COLUMN public.orders.stripe_error IS 'Error message from Stripe if payment failed';
COMMENT ON COLUMN public.orders.stripe_metadata IS 'Additional metadata from Stripe';
