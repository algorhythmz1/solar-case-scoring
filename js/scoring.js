/**
 * Solar Case Scoring Logic
 *
 * This module contains all scoring and qualification logic
 * for the solar case pre-qualification system.
 */

/**
 * Calculate the total score based on form responses
 * @param {Object} formData - The collected form data
 * @returns {number} The calculated score
 */
function calculateScore(formData) {
  let score = 0;

  // Award points if customer is paying MORE for electricity after solar
  if (formData.payingMore === 'yes') {
    score += CONFIG.SCORING.payingMoreYes;
  }

  // Award points if panels are shaded during the day
  if (formData.shade === 'yes') {
    score += CONFIG.SCORING.shadeYes;
  }

  // Award points if inverter is mounted outside
  if (formData.inverterOutside === 'yes') {
    score += CONFIG.SCORING.inverterOutsideYes;
  }

  return score;
}

/**
 * Determine if a case is qualified based on score
 * @param {number} score - The calculated score
 * @returns {string} 'qualified' or 'unqualified'
 */
function determineQualification(score) {
  return score >= CONFIG.SCORING.threshold ? 'qualified' : 'unqualified';
}

/**
 * Get the appropriate tag based on qualification status
 * @param {string} qualification - 'qualified' or 'unqualified'
 * @returns {string} The tag to apply in GoHighLevel
 */
function getQualificationTag(qualification) {
  return qualification === 'qualified'
    ? CONFIG.TAGS.qualified
    : CONFIG.TAGS.unqualified;
}

/**
 * Get a detailed breakdown of the score
 * @param {Object} formData - The collected form data
 * @returns {Object} Score breakdown with details
 */
function getScoreBreakdown(formData) {
  const breakdown = {
    items: [],
    total: 0
  };

  if (formData.payingMore === 'yes') {
    breakdown.items.push({
      question: 'Paying more for electricity',
      points: CONFIG.SCORING.payingMoreYes
    });
    breakdown.total += CONFIG.SCORING.payingMoreYes;
  }

  if (formData.shade === 'yes') {
    breakdown.items.push({
      question: 'Panels are shaded',
      points: CONFIG.SCORING.shadeYes
    });
    breakdown.total += CONFIG.SCORING.shadeYes;
  }

  if (formData.inverterOutside === 'yes') {
    breakdown.items.push({
      question: 'Inverter mounted outside',
      points: CONFIG.SCORING.inverterOutsideYes
    });
    breakdown.total += CONFIG.SCORING.inverterOutsideYes;
  }

  return breakdown;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateScore,
    determineQualification,
    getQualificationTag,
    getScoreBreakdown
  };
}
