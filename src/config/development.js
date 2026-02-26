/**
 * Development Environment Configuration
 * Safe for development with full debugging capabilities
 */
export const DEVELOPMENT_CONFIG = {
  // Application Control
  APPLICATION_ENDED: false,
  MAINTENANCE_ENABLED: false,
  
  // Features
  ENABLE_DATA_PRIVACY_MODAL: true,
  ENABLE_DEBUG_TOOLS: false,
  ENABLE_CONSOLE_LOGS: false,
  
  // Logging
  LOG_LEVEL: 'debug', // debug, info, warn, error
  LOG_SENSITIVE_DATA: false, // Never log sensitive data, even in dev
  
  // Security
  ALLOW_LOCAL_STORAGE: true,
  ALLOW_EXPORT: true,
  
  // Performance
  ENABLE_ANIMATIONS: true,
  STRICT_VALIDATION: true
};