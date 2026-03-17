import { useLogoSettings } from "@/hooks/useLogoSettings";
import { DEFAULT_LOGOS } from "@/lib/logoService";

interface LogoProps {
  type?: 'header' | 'footer' | 'admin' | 'favicon';
  className?: string;
  alt?: string;
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
}

const Logo = ({ 
  type = 'header', 
  className = "", 
  alt = "Fashion Spectrum",
  fallbackText = "FS",
  size = 'md'
}: LogoProps) => {
  const { logos } = useLogoSettings();

  // Get the appropriate logo URL based on type
  const getLogoUrl = () => {
    switch (type) {
      case 'header':
        return logos.header_logo_url;
      case 'footer':
        return logos.footer_logo_url;
      case 'admin':
        return logos.admin_logo_url;
      case 'favicon':
        return logos.favicon_url;
      default:
        return logos.header_logo_url;
    }
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-6 w-6';
      case 'md':
        return 'h-8 w-8';
      case 'lg':
        return 'h-12 w-12';
      case 'xl':
        return 'h-16 w-16';
      case '2xl':
        return 'h-20 w-20';
      case '3xl':
        return 'h-24 w-24';
      case '4xl':
        return 'h-32 w-32';
      case '5xl':
        return 'h-40 w-40';
      case '6xl':
        return 'h-48 w-48';
      case '7xl':
        return 'h-56 w-56';
      default:
        return 'h-8 w-8';
    }
  };

  const logoUrl = getLogoUrl();
  const sizeClasses = getSizeClasses();

  // For admin and header types, show logo if it exists
  const shouldShowLogo = logoUrl && (
    logoUrl.startsWith('data:') || 
    logoUrl.startsWith('http:') || 
    logoUrl.startsWith('https:') || 
    logoUrl === '/logo.png' ||
    logoUrl === '/favicon.png'
  );
  
  if ((type === 'admin' || type === 'header') && !shouldShowLogo) {
    return null;
  }

  return (
    <div className={`flex items-center ${className}`}>
      {shouldShowLogo ? (
        <img
          src={logoUrl}
          alt={alt}
          className={`${sizeClasses} object-contain`}
          onError={(e) => {
            // Fallback to text if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.fallback-text')) {
              const fallback = document.createElement('div');
              fallback.className = `fallback-text ${sizeClasses} bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-heading font-bold text-sm`;
              fallback.textContent = fallbackText;
              parent.appendChild(fallback);
            }
          }}
        />
      ) : (
        <div className={`${sizeClasses} bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-heading font-bold text-sm`}>
          {fallbackText}
        </div>
      )}
    </div>
  );
};

export default Logo;
