// Logger utility for consistent logging across the application
import { RUNTIME_CONFIG } from '../config'

export const logger = {
  config: null,

  initialize(config) {
    this.config = config
  },

  debug(message, data = null) {
    if (this.config?.LOG_LEVEL === 'debug') {
      console.log(`🔍 [DEBUG] ${message}`, data ? data : '')
    }
  },

  info(message, data = null) {
    console.log(`ℹ️ [INFO] ${message}`, data ? data : '')
  },

  warn(message, data = null) {
    console.warn(`⚠️ [WARN] ${message}`, data ? data : '')
  },

  error(message, error = null) {
    console.error(`❌ [ERROR] ${message}`, error ? error : '')
  },

  performance(operation, duration) {
    if (this.config?.LOG_LEVEL === 'debug') {
      console.log(`⚡ [PERF] ${operation} took ${duration.toFixed(2)}ms`)
    }
  },

  logSubmission(data, familyMembers) {
    if (this.config?.ENABLE_DEBUG_TOOLS) {
      console.log('📝 [SUBMISSION] Form data:', { data, familyMembers })
    }
  },
}