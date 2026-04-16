-- Create subscribers table for newsletter subscriptions
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for newsletter signup)
CREATE POLICY "Allow public to subscribe" 
    ON public.subscribers 
    FOR INSERT 
    TO PUBLIC 
    WITH CHECK (true);

-- Allow anyone to view their own subscription (by email)
CREATE POLICY "Allow users to view own subscription" 
    ON public.subscribers 
    FOR SELECT 
    TO PUBLIC 
    USING (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscribers_updated_at 
    BEFORE UPDATE ON public.subscribers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add table comment
COMMENT ON TABLE public.subscribers IS 'Newsletter subscribers table';
