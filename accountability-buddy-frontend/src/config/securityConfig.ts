// Security Configuration Types
interface SecurityHeaders {
    contentSecurityPolicy: string;
    xFrameOptions: string;
    strictTransportSecurity: string;
    xContentTypeOptions: string;
    referrerPolicy: string;
    permissionsPolicy: string;
  }
  
  interface SecurityConfig {
    headers: SecurityHeaders;
    applyHeaders: (response: any) => void;
    logConfig: () => void;
  }
  
  // Security Configuration
  const securityConfig: SecurityConfig = {
    headers: {
      // Content Security Policy (CSP)
      contentSecurityPolicy:
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self' data:; frame-ancestors 'none';",
  
      // Prevents the site from being framed to avoid clickjacking
      xFrameOptions: "SAMEORIGIN",
  
      // Enforces HTTPS with a max-age of one year and includes subdomains
      strictTransportSecurity: "max-age=31536000; includeSubDomains",
  
      // Prevents MIME type sniffing
      xContentTypeOptions: "nosniff",
  
      // Controls the Referer header to increase privacy
      referrerPolicy: "strict-origin-when-cross-origin",
  
      // Restricts browser features to enhance security
      permissionsPolicy:
        "geolocation=(), microphone=(), camera=(), payment=(), fullscreen=*",
    },
  
    // Function to apply headers to HTTP responses
    applyHeaders: function (response: any): void {
      for (const [key, value] of Object.entries(this.headers)) {
        response.setHeader(
          key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`),
          value
        );
      }
    },
  
    // Function to log security configuration (for debugging purposes)
    logConfig: function (): void {
      console.log("Current Security Headers:", this.headers);
    },
  };
  
  // Example Usage:
  // securityConfig.applyHeaders(response);
  // securityConfig.logConfig();
  
  export default securityConfig;
  