// Configuration file for environment variables and app settings
export const CONFIG = {
  // Environment
  ENV: import.meta.env.MODE,
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
  
  // Feature flags
  MAINTENANCE_ENABLED: false, // Set to true to enable maintenance mode
  APPLICATION_ENDED: false, // Set to true to end applications
  ENABLE_DATA_PRIVACY_MODAL: true,
  
  // Debug Tools Configuration
  // Set to true to force debug tools ON, false to force OFF, or use 'auto' for environment-based
  FORCE_DEBUG_TOOLS: false, // Options: true, false, 'auto'
  
  // Google Sheets Configuration
  GOOGLE_SHEETS: {
    scriptURL: import.meta.env.VITE_GOOGLE_SCRIPT_URL || '',
  },
  
  // Logging
  // Set to 'debug' for verbose logging, 'error' for errors only, or use 'auto' for environment-based
  FORCE_LOG_LEVEL: 'error', // Options: 'debug', 'error', 'auto'
}

// Compute derived values
export const getDebugToolsEnabled = () => {
  if (CONFIG.FORCE_DEBUG_TOOLS === true) return true;
  if (CONFIG.FORCE_DEBUG_TOOLS === false) return false;
  // 'auto' mode - use environment
  return import.meta.env.DEV;
}

export const getLogLevel = () => {
  if (CONFIG.FORCE_LOG_LEVEL === 'debug') return 'debug';
  if (CONFIG.FORCE_LOG_LEVEL === 'error') return 'error';
  // 'auto' mode - use environment
  return import.meta.env.DEV ? 'debug' : 'error';
}

// Export the computed config
export const RUNTIME_CONFIG = {
  ...CONFIG,
  ENABLE_DEBUG_TOOLS: getDebugToolsEnabled(),
  LOG_LEVEL: getLogLevel(),
}