import { RUNTIME_CONFIG as CONFIG } from '../config'
import { logger } from '../utils/logger'

export const submitToGoogleSheets = async (data, familyMembers) => {
  const startTime = performance.now()
  
  try {
    // Validate configuration
    if (!CONFIG.GOOGLE_SHEETS.scriptURL) {
      throw new Error('Google Sheets script URL is not configured')
    }

    // Prepare the payload
    const payload = {
      ...data,
      familyMembers: JSON.stringify(familyMembers),
      timestamp: new Date().toISOString(),
    }

    logger.debug('Submitting to Google Sheets:', payload)

    // Submit to Google Sheets
    const response = await fetch(CONFIG.GOOGLE_SHEETS.scriptURL, {
      method: 'POST',
      mode: 'no-cors', // Important for Google Apps Script
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(payload),
    })

    const duration = performance.now() - startTime
    logger.performance('Google Sheets submission', duration)

    // With no-cors, we can't read the response
    // So we assume success if no error was thrown
    return {
      success: true,
      message: 'Form submitted successfully',
    }

  } catch (error) {
    logger.error('Google Sheets submission failed:', error)
    
    // Save to localStorage as backup
    try {
      const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]')
      submissions.push({
        data,
        familyMembers,
        timestamp: new Date().toISOString(),
        error: error.message,
      })
      localStorage.setItem('formSubmissions', JSON.stringify(submissions))
      logger.info('Backup saved to localStorage')
    } catch (backupError) {
      logger.error('Backup failed:', backupError)
    }

    return {
      success: false,
      message: error.message || 'Failed to submit form',
    }
  }
}