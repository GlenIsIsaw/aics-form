/**
 * Production Environment Configuration
 * Maximum security, no debugging, optimized for users
 */
export const PRODUCTION_CONFIG = {
  // Application Control
  APPLICATION_ENDED: false,
  MAINTENANCE_ENABLED: false,
  
  // Features
  ENABLE_DATA_PRIVACY_MODAL: true,
  ENABLE_DEBUG_TOOLS: false, // CRITICAL: Disable in production
  ENABLE_CONSOLE_LOGS: false, // CRITICAL: Disable in production
  
  // Logging
  LOG_LEVEL: 'error', // Only log errors
  LOG_SENSITIVE_DATA: false, // Never log sensitive data
  
  // Security
  ALLOW_LOCAL_STORAGE: false, // Disable localStorage in production
  ALLOW_EXPORT: false, // Disable data export
  
  // Performance
  ENABLE_ANIMATIONS: true,
  STRICT_VALIDATION: true
};