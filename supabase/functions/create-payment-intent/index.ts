// @ts-ignore - Deno imports are not recognized by TypeScript but work in Deno runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore - esm.sh imports are not recognized by TypeScript but work in Deno runtime
import Stripe from "https://esm.sh/stripe@14.21.0";
// @ts-ignore - Supabase client imports are not recognized by TypeScript but work in Deno runtime
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to get Stripe settings from database
async function getStripeSettings(supabase: any) {
  try {
    console.log('Fetching Stripe settings from database...');
    
    // Get settings from site_settings table where key starts with 'stripe_'
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')
      .like('key', 'stripe_%');

    console.log('Stripe settings query result:', { data, error });

    if (error) {
      console.error('Error fetching Stripe settings:', error);
      return null;
    }

    // Convert settings to object
    const settings: any = {};
    data?.forEach((setting: any) => {
      settings[setting.key.replace('stripe_', '')] = setting.value;
    });

    console.log('Processed Stripe settings:', { 
      enabled: settings.enabled, 
      liveMode: settings.live_mode,
      hasTestKeys: !!settings.publishable_key_test && !!settings.secret_key_test,
      hasLiveKeys: !!settings.publishable_key_live && !!settings.secret_key_live
    });

    return settings;
  } catch (error) {
    console.error('Error getting Stripe settings:', error);
    return null;
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, currency = 'aud', metadata } = await req.json();

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    // @ts-ignore - Deno.env is not recognized by TypeScript but works in Deno runtime
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    // @ts-ignore - Deno.env is not recognized by TypeScript but works in Deno runtime
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get Stripe settings from database
    const stripeSettings = await getStripeSettings(supabase);
    
    if (!stripeSettings || !stripeSettings.enabled) {
      return new Response(
        JSON.stringify({ error: 'Stripe not enabled' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the appropriate secret key based on mode
    const stripeSecretKey = stripeSettings.live_mode ? stripeSettings.secret_key_live : stripeSettings.secret_key_test;
    
    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: 'Stripe keys not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: metadata || {},
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return new Response(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
