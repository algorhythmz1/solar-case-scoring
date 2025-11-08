/**
 * Solar Case Scoring Configuration
 *
 * IMPORTANT: Replace the placeholder values below with your actual GoHighLevel credentials
 * Never commit real API keys to version control!
 */

const CONFIG = {
  // ========================================
  // GoHighLevel API Credentials
  // ========================================

  // Your GoHighLevel API Key (get from GHL Settings > API)
  GHL_API_KEY: 'YOUR_GHL_API_KEY_HERE',

  // GoHighLevel Location ID (get from GHL Settings)
  GHL_LOCATION_ID: 'YOUR_LOCATION_ID_HERE',

  // API Endpoint (v1 or v2 depending on your GHL setup)
  // v1: https://rest.gohighlevel.com/v1/contacts/
  // v2: https://services.leadconnectorhq.com/contacts/
  GHL_API_URL: 'https://rest.gohighlevel.com/v1/contacts/',

  // ========================================
  // Scoring Configuration
  // ========================================

  SCORING: {
    // Points awarded if customer is paying MORE for electricity post-solar
    payingMoreYes: 50,

    // Points awarded if solar panels are shaded during the day
    shadeYes: 30,

    // Points awarded if inverter is mounted outside
    inverterOutsideYes: 20,

    // Minimum score threshold to be considered "qualified"
    threshold: 60
  },

  // ========================================
  // Tags Configuration
  // ========================================

  TAGS: {
    // Tag applied to qualified leads (score >= threshold)
    qualified: 'good_solar_case',

    // Tag applied to unqualified leads (score < threshold)
    unqualified: 'low_quality_case'
  },

  // ========================================
  // Custom Field Mapping
  // ========================================

  // These keys must match the custom field keys in your GoHighLevel account
  // Go to GHL Settings > Custom Fields to create or find these field keys
  CUSTOM_FIELDS: {
    score: 'solar_case_score',
    payingMore: 'paying_more_post_solar',
    shade: 'panels_shaded',
    inverterOutside: 'inverter_outside',
    qualification: 'qualification_status'
  }
};

// Export for use in other modules (if using ES6 modules)
// If using in browser without modules, CONFIG is available globally
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
