# Scoring Customization Guide

This guide explains how to customize the scoring logic for your solar case qualification system.

## Understanding the Default Scoring

The default scoring system awards points based on three criteria:

```javascript
SCORING: {
  payingMoreYes: 50,       // Customer paying MORE after going solar
  shadeYes: 30,            // Solar panels are shaded
  inverterOutsideYes: 20,  // Inverter mounted outside
  threshold: 60            // Minimum score to qualify
}
```

### How It Works

1. Start with score = 0
2. Add points for each "yes" answer
3. Compare total score to threshold
4. Score ≥ threshold → **qualified**
5. Score < threshold → **unqualified**

## Modifying Point Values

### Simple Point Adjustment

Edit the `CONFIG.SCORING` object in `index.html` (or `js/config.js` for modular version):

```javascript
SCORING: {
  payingMoreYes: 75,       // Increased importance
  shadeYes: 40,            // Increased importance
  inverterOutsideYes: 10,  // Decreased importance
  threshold: 80            // Higher bar for qualification
}
```

### Changing the Threshold

The threshold determines the minimum score needed to qualify:

```javascript
SCORING: {
  // ... point values ...
  threshold: 50   // Lower threshold = more qualified leads
}
```

**Examples**:
- `threshold: 40` → More lenient (more qualified leads)
- `threshold: 80` → More strict (fewer qualified leads)
- `threshold: 100` → Very strict (only perfect scores)

## Adding New Questions

### Step 1: Add HTML Form Field

Add a new question to the form:

```html
<div class="form-group">
  <label>How long ago was your solar system installed? <span class="required">*</span></label>
  <div class="radio-group">
    <label>
      <input type="radio" name="installAge" value="0-1years" required>
      <span>0-1 years</span>
    </label>
    <label>
      <input type="radio" name="installAge" value="1-3years">
      <span>1-3 years</span>
    </label>
    <label>
      <input type="radio" name="installAge" value="3plus">
      <span>3+ years</span>
    </label>
  </div>
</div>
```

### Step 2: Update Configuration

Add scoring rules for the new question:

```javascript
SCORING: {
  payingMoreYes: 50,
  shadeYes: 30,
  inverterOutsideYes: 20,

  // New scoring rules
  installAge0to1: 60,      // Recently installed = high priority
  installAge1to3: 30,      // Mid-range
  installAge3plus: 10,     // Older installation

  threshold: 60
}
```

### Step 3: Collect Form Data

Update the form data collection:

```javascript
const formData = {
  fullName: document.getElementById('fullName').value.trim(),
  email: document.getElementById('email').value.trim(),
  phone: document.getElementById('phone').value.trim(),
  payingMore: document.querySelector('input[name="payingMore"]:checked').value,
  shade: document.querySelector('input[name="shade"]:checked').value,
  inverterOutside: document.querySelector('input[name="inverterOutside"]:checked').value,

  // Add new field
  installAge: document.querySelector('input[name="installAge"]:checked').value
};
```

### Step 4: Update Scoring Logic

Modify the `calculateScore()` function:

```javascript
function calculateScore(formData) {
  let score = 0;

  if (formData.payingMore === 'yes') {
    score += CONFIG.SCORING.payingMoreYes;
  }

  if (formData.shade === 'yes') {
    score += CONFIG.SCORING.shadeYes;
  }

  if (formData.inverterOutside === 'yes') {
    score += CONFIG.SCORING.inverterOutsideYes;
  }

  // Add new scoring logic
  if (formData.installAge === '0-1years') {
    score += CONFIG.SCORING.installAge0to1;
  } else if (formData.installAge === '1-3years') {
    score += CONFIG.SCORING.installAge1to3;
  } else if (formData.installAge === '3plus') {
    score += CONFIG.SCORING.installAge3plus;
  }

  return score;
}
```

### Step 5: Add Custom Field to API Payload

Update the GoHighLevel API payload:

```javascript
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
  // Add new field
  {
    key: 'install_age',
    field_value: formData.installAge
  },
  {
    key: CONFIG.CUSTOM_FIELDS.qualification,
    field_value: qualification
  }
]
```

## Advanced Scoring Patterns

### Weighted Scoring

Different questions have different importance levels:

```javascript
SCORING: {
  criticalIssue: 100,      // Critical issues get high score
  moderateIssue: 50,       // Moderate issues
  minorIssue: 20,          // Minor issues
  threshold: 100           // Requires at least one critical issue
}
```

### Negative Scoring

Subtract points for certain answers:

```javascript
function calculateScore(formData) {
  let score = 100;  // Start with high score

  // Deduct points for positive indicators
  if (formData.systemWorkingWell === 'yes') {
    score -= 50;  // System working well = lower priority
  }

  if (formData.underWarranty === 'yes') {
    score -= 30;  // Under warranty = lower priority
  }

  return Math.max(score, 0);  // Don't go below 0
}
```

### Tiered Qualification

Multiple qualification levels instead of just qualified/unqualified:

```javascript
function determineQualification(score) {
  if (score >= 80) return 'high_priority';
  if (score >= 50) return 'medium_priority';
  if (score >= 20) return 'low_priority';
  return 'unqualified';
}

function getQualificationTag(qualification) {
  const tagMap = {
    'high_priority': 'solar_case_urgent',
    'medium_priority': 'solar_case_standard',
    'low_priority': 'solar_case_followup',
    'unqualified': 'solar_case_disqualified'
  };
  return tagMap[qualification] || 'solar_case_unclassified';
}
```

### Conditional Scoring

Some questions depend on previous answers:

```javascript
function calculateScore(formData) {
  let score = 0;

  // Base question
  if (formData.payingMore === 'yes') {
    score += 50;

    // Conditional follow-up: only matters if paying more
    if (formData.howMuchMore === 'over50percent') {
      score += 30;  // Bonus for paying significantly more
    }
  }

  return score;
}
```

### Required Combinations

Lead must meet certain criteria combinations:

```javascript
function determineQualification(score, formData) {
  // Must have minimum score AND meet certain criteria
  const hasMinScore = score >= CONFIG.SCORING.threshold;
  const hasCriticalIssue = formData.payingMore === 'yes';

  if (hasMinScore && hasCriticalIssue) {
    return 'qualified';
  }

  return 'unqualified';
}
```

## Real-World Examples

### Example 1: Solar Performance Issues

```javascript
SCORING: {
  // Performance indicators
  payingMore: 60,
  productionBelow80: 50,
  frequentOutages: 40,

  // Physical issues
  visibleDamage: 50,
  shade: 30,
  inverterErrors: 40,

  // System age
  over5years: 20,

  threshold: 80  // Need multiple issues to qualify
}
```

### Example 2: Solar Buyout Qualification

```javascript
SCORING: {
  // Financial indicators
  payingTooMuch: 70,
  rateIncreasing: 40,

  // Contract issues
  badTerms: 60,
  cantAfford: 80,

  // Eligibility
  ownHome: 30,
  goodCredit: 20,

  threshold: 100  // Must have strong financial need
}
```

### Example 3: Maintenance Lead Qualification

```javascript
SCORING: {
  // System issues
  neverCleaned: 50,
  over3yearsOld: 30,
  performanceDrop: 60,

  // Urgency
  noMonitoring: 40,
  errors: 70,

  // Value
  largeSystem: 30,  // More panels = more revenue

  threshold: 70
}
```

## Testing Your Scoring

### Create Test Cases

```javascript
// Test case 1: Should qualify
const testLead1 = {
  payingMore: 'yes',      // +50
  shade: 'yes',           // +30
  inverterOutside: 'yes'  // +20
};
// Expected: 100 points → qualified

// Test case 2: Should not qualify
const testLead2 = {
  payingMore: 'no',       // 0
  shade: 'no',            // 0
  inverterOutside: 'yes'  // +20
};
// Expected: 20 points → unqualified
```

### Testing in Browser Console

```javascript
// Open browser console (F12)
// Test the scoring function

const testData = {
  payingMore: 'yes',
  shade: 'yes',
  inverterOutside: 'no'
};

const score = calculateScore(testData);
console.log('Score:', score);  // Should show 80

const qual = determineQualification(score);
console.log('Qualification:', qual);  // Should show "qualified"
```

## Best Practices

1. **Start Simple**: Begin with basic scoring, refine over time
2. **Test Thoroughly**: Create test cases for edge cases
3. **Document Changes**: Keep track of why you adjusted scores
4. **Review Regularly**: Analyze which leads convert best
5. **A/B Test**: Try different thresholds and compare results
6. **Get Feedback**: Ask sales team what makes a good lead

## Common Pitfalls

- **Too lenient**: Threshold too low → too many unqualified leads
- **Too strict**: Threshold too high → missing good leads
- **Unbalanced**: One question worth too many points
- **Overcomplicated**: Too many questions confuse users
- **Not tested**: Always test changes before going live

## Getting Help

- Review the default scoring in `js/scoring.js`
- Check browser console for errors
- Test with known good/bad leads
- Open an issue on GitHub

---

**Next Steps**: After customizing scoring, update your [CONFIGURATION.md](CONFIGURATION.md) and test thoroughly!
