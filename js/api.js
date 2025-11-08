/**
 * GoHighLevel API Integration
 *
 * This module handles all API interactions with GoHighLevel
 */

/**
 * Submit lead data to GoHighLevel
 * @param {Object} formData - The collected form data
 * @param {number} score - The calculated score
 * @param {string} qualification - 'qualified' or 'unqualified'
 * @param {string} tag - The tag to apply
 * @returns {Promise<Object>} The API response
 */
async function submitToGoHighLevel(formData, score, qualification, tag) {
  // Prepare the payload for GoHighLevel API
  const payload = {
    email: formData.email,
    phone: formData.phone,
    name: formData.fullName,
    tags: [tag],
    customFields: [
      {
        key: CONFIG.CUSTOM_FIELDS.score,
        field_value: score.toString()
      },
      {
        key: CONFIG.CUSTOM_FIELDS.payingMore,
        field_value: formData.payingMore
      },
      {
        key: CONFIG.CUSTOM_FIELDS.shade,
        field_value: formData.shade
      },
      {
        key: CONFIG.CUSTOM_FIELDS.inverterOutside,
        field_value: formData.inverterOutside
      },
      {
        key: CONFIG.CUSTOM_FIELDS.qualification,
        field_value: qualification
      }
    ]
  };

  // Make the API request
  const response = await fetch(CONFIG.GHL_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.GHL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  // Handle response
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} - ${errorData.message || response.statusText}`);
  }

  return await response.json();
}

/**
 * Validate API configuration
 * @returns {Object} Validation result with status and message
 */
function validateAPIConfig() {
  const errors = [];

  if (!CONFIG.GHL_API_KEY || CONFIG.GHL_API_KEY === 'YOUR_GHL_API_KEY_HERE') {
    errors.push('GHL API Key is not configured');
  }

  if (!CONFIG.GHL_LOCATION_ID || CONFIG.GHL_LOCATION_ID === 'YOUR_LOCATION_ID_HERE') {
    errors.push('GHL Location ID is not configured');
  }

  if (!CONFIG.GHL_API_URL) {
    errors.push('GHL API URL is not configured');
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    submitToGoHighLevel,
    validateAPIConfig
  };
}
