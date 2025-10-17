// Application constants
export const APP_NAME = 'Smart Diet Scanner'
export const APP_VERSION = '1.0.0'

// Local storage keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'smartDietUser',
  SCANNED_PRODUCTS: 'smartDietScannedProducts',
  APP_SETTINGS: 'smartDietSettings'
}

// Health score thresholds
export const HEALTH_SCORES = {
  EXCELLENT: 80,
  GOOD: 60,
  FAIR: 40,
  POOR: 0
}

// Analysis severity levels
export const SEVERITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
}

// Supported image formats
export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
]

// Maximum file size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024