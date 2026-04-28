// Stripe service to handle payment processing using admin-configured settings

export interface StripeConfig {
  enabled: boolean;
  liveMode: boolean;
  publishableKeyTest: string;
  publishableKeyLive: string;
  secretKeyTest: string;
  secretKeyLive: string;
  webhookSecretTest: string;
  webhookSecretLive: string;
}

// Get Stripe settings from localStorage (admin panel stores them there)
export const getStripeSettings = (): StripeConfig => {
  try {
    const raw = localStorage.getItem("stripe_settings");
    if (raw) {
      const settings = JSON.parse(raw);
      console.log('Stripe settings loaded from localStorage:', { 
        enabled: settings.enabled, 
        liveMode: settings.liveMode,
        hasTestKeys: !!settings.publishableKeyTest && !!settings.secretKeyTest,
        hasLiveKeys: !!settings.publishableKeyLive && !!settings.secretKeyLive
      });
      return settings;
    }
  } catch (error) {
    console.error('Error loading Stripe settings:', error);
  }
  
  // Return default settings if none found
  return {
    enabled: false,
    liveMode: false,
    publishableKeyTest: "",
    publishableKeyLive: "",
    secretKeyTest: "",
    secretKeyLive: "",
    webhookSecretTest: "",
    webhookSecretLive: ""
  };
};

// Get the appropriate keys based on mode
export const getActiveStripeKeys = () => {
  const settings = getStripeSettings();
  
  if (!settings.enabled) {
    return { enabled: false, publishableKey: null, secretKey: null };
  }
  
  const publishableKey = settings.liveMode ? settings.publishableKeyLive : settings.publishableKeyTest;
  const secretKey = settings.liveMode ? settings.secretKeyLive : settings.secretKeyTest;
  
  return {
    enabled: settings.enabled,
    liveMode: settings.liveMode,
    publishableKey: publishableKey || null,
    secretKey: secretKey || null
  };
};

// Check if Stripe is properly configured
export const isStripeConfigured = (): boolean => {
  const keys = getActiveStripeKeys();
  return keys.enabled && !!keys.publishableKey && !!keys.secretKey;
};

export default {
  getStripeSettings,
  getActiveStripeKeys,
  isStripeConfigured
};
