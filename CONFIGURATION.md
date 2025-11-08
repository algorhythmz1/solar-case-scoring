# Configuration Reference

Complete reference for all configuration options in the Solar Case Scoring System.

## Configuration Object Structure

```javascript
const CONFIG = {
  GHL_API_KEY: '',
  GHL_LOCATION_ID: '',
  GHL_API_URL: '',
  SCORING: { ... },
  TAGS: { ... },
  CUSTOM_FIELDS: { ... }
};
```

## GoHighLevel API Settings

### `GHL_API_KEY`

**Type**: String
**Required**: Yes
**Description**: Your GoHighLevel API key

**How to get**:
1. GoHighLevel Settings → API
2. Create or copy existing API key
3. Keep secure - never commit to version control

**Example**:
```javascript
GHL_API_KEY: 'sk-abc123def456...'
```

### `GHL_LOCATION_ID`

**Type**: String
**Required**: Yes
**Description**: Your GoHighLevel location identifier

**How to get**:
1. Check URL in GHL dashboard: `/location/{LOCATION_ID}/`
2. Or: Settings → Business Profile

**Example**:
```javascript
GHL_LOCATION_ID: 'abc123def456...'
```

### `GHL_API_URL`

**Type**: String
**Required**: Yes
**Description**: GoHighLevel API endpoint URL

**Options**:
- **API v1** (default): `https://rest.gohighlevel.com/v1/contacts/`
- **API v2**: `https://services.leadconnectorhq.com/contacts/`

**Example**:
```javascript
GHL_API_URL: 'https://rest.gohighlevel.com/v1/contacts/'
```

## Scoring Configuration

### `SCORING.payingMoreYes`

**Type**: Number
**Default**: 50
**Description**: Points awarded if customer is paying MORE for electricity after going solar

**Recommended range**: 0-100

### `SCORING.shadeYes`

**Type**: Number
**Default**: 30
**Description**: Points awarded if solar panels are shaded during the day

**Recommended range**: 0-100

### `SCORING.inverterOutsideYes`

**Type**: Number
**Default**: 20
**Description**: Points awarded if inverter is mounted on the outside of the house

**Recommended range**: 0-100

### `SCORING.threshold`

**Type**: Number
**Default**: 60
**Description**: Minimum score required to be considered "qualified"

**Recommended range**: 0-200 (depends on your point values)

**Example**:
```javascript
SCORING: {
  payingMoreYes: 50,
  shadeYes: 30,
  inverterOutsideYes: 20,
  threshold: 60
}
```

## Tag Configuration

### `TAGS.qualified`

**Type**: String
**Default**: `'good_solar_case'`
**Description**: Tag applied to qualified leads (score ≥ threshold)

**Requirements**:
- Tag must exist in GoHighLevel tag library
- Case-sensitive

### `TAGS.unqualified`

**Type**: String
**Default**: `'low_quality_case'`
**Description**: Tag applied to unqualified leads (score < threshold)

**Example**:
```javascript
TAGS: {
  qualified: 'high_priority_solar',
  unqualified: 'low_priority_solar'
}
```

## Custom Field Mapping

All custom field keys must match exactly with your GoHighLevel custom fields.

### `CUSTOM_FIELDS.score`

**Type**: String
**Default**: `'solar_case_score'`
**GHL Field Type**: Number
**Description**: Stores the calculated score

### `CUSTOM_FIELDS.payingMore`

**Type**: String
**Default**: `'paying_more_post_solar'`
**GHL Field Type**: Text
**Description**: Stores answer to "paying more" question

### `CUSTOM_FIELDS.shade`

**Type**: String
**Default**: `'panels_shaded'`
**GHL Field Type**: Text
**Description**: Stores answer to "shaded" question

### `CUSTOM_FIELDS.inverterOutside`

**Type**: String
**Default**: `'inverter_outside'`
**GHL Field Type**: Text
**Description**: Stores answer to "inverter location" question

### `CUSTOM_FIELDS.qualification`

**Type**: String
**Default**: `'qualification_status'`
**GHL Field Type**: Text
**Description**: Stores qualification result ('qualified' or 'unqualified')

**Example**:
```javascript
CUSTOM_FIELDS: {
  score: 'solar_case_score',
  payingMore: 'paying_more_post_solar',
  shade: 'panels_shaded',
  inverterOutside: 'inverter_outside',
  qualification: 'qualification_status'
}
```

## Environment-Specific Configurations

### Development Configuration

```javascript
const CONFIG = {
  GHL_API_KEY: 'test_key_here',
  GHL_LOCATION_ID: 'test_location',
  GHL_API_URL: 'https://rest.gohighlevel.com/v1/contacts/',
  SCORING: {
    payingMoreYes: 50,
    shadeYes: 30,
    inverterOutsideYes: 20,
    threshold: 30  // Lower threshold for testing
  },
  TAGS: {
    qualified: 'test_qualified',
    unqualified: 'test_unqualified'
  },
  CUSTOM_FIELDS: {
    score: 'test_score',
    payingMore: 'test_paying_more',
    shade: 'test_shade',
    inverterOutside: 'test_inverter',
    qualification: 'test_qualification'
  }
};
```

### Production Configuration

```javascript
const CONFIG = {
  GHL_API_KEY: 'production_key_here',  // Real API key
  GHL_LOCATION_ID: 'production_location',
  GHL_API_URL: 'https://rest.gohighlevel.com/v1/contacts/',
  SCORING: {
    payingMoreYes: 50,
    shadeYes: 30,
    inverterOutsideYes: 20,
    threshold: 60  // Stricter threshold
  },
  TAGS: {
    qualified: 'good_solar_case',
    unqualified: 'low_quality_case'
  },
  CUSTOM_FIELDS: {
    score: 'solar_case_score',
    payingMore: 'paying_more_post_solar',
    shade: 'panels_shaded',
    inverterOutside: 'inverter_outside',
    qualification: 'qualification_status'
  }
};
```

## Secure Configuration Methods

### Method 1: Environment Variables (Recommended for Production)

**Not possible with current client-side implementation**. Requires backend proxy.

### Method 2: Separate Config File (Git-ignored)

1. Create `js/config.local.js` (git-ignored)
2. Copy from `js/config.js`
3. Add real credentials to `config.local.js`
4. Update HTML to use `config.local.js`

**.gitignore**:
```
js/config.local.js
```

**HTML**:
```html
<script src="js/config.local.js"></script>  <!-- Real credentials -->
```

### Method 3: Backend Proxy (Most Secure)

Create a serverless function that:
1. Receives form data
2. Adds API credentials server-side
3. Submits to GoHighLevel
4. Returns success/error

**Example with Cloudflare Workers**:
```javascript
// worker.js
export default {
  async fetch(request) {
    const formData = await request.json();

    const response = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.GHL_API_KEY}`,  // From environment
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    return new Response(await response.text(), {
      status: response.status
    });
  }
};
```

## Validation and Error Handling

The system validates configuration before submitting:

```javascript
function validateAPIConfig() {
  const errors = [];

  if (!CONFIG.GHL_API_KEY || CONFIG.GHL_API_KEY === 'YOUR_GHL_API_KEY_HERE') {
    errors.push('GHL API Key is not configured');
  }

  if (!CONFIG.GHL_LOCATION_ID || CONFIG.GHL_LOCATION_ID === 'YOUR_LOCATION_ID_HERE') {
    errors.push('GHL Location ID is not configured');
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}
```

## Common Configuration Patterns

### Multiple Location Support

If managing multiple locations, create separate config files:

```
js/
  config-location-1.js
  config-location-2.js
  config-location-3.js
```

### A/B Testing Configurations

Test different scoring thresholds:

```javascript
// Variant A: Lenient
SCORING: { threshold: 40 }

// Variant B: Strict
SCORING: { threshold: 80 }
```

Track which converts better.

### Industry-Specific Configs

Different scoring for different markets:

```javascript
// Residential solar
SCORING: {
  payingMoreYes: 50,
  threshold: 60
}

// Commercial solar
SCORING: {
  contractIssues: 80,
  threshold: 100
}
```

## Troubleshooting Configuration Issues

### API Key Invalid

**Symptom**: 401 Unauthorized error
**Solution**:
- Verify API key is correct
- Check key hasn't expired
- Ensure no extra spaces in string

### Custom Fields Not Saving

**Symptom**: Fields empty in GHL
**Solution**:
- Verify field keys match exactly
- Check fields exist in correct location
- Ensure field types match (Number, Text, etc.)

### Tags Not Applying

**Symptom**: Contacts created but no tags
**Solution**:
- Verify tags exist in tag library
- Check tag names are exact (case-sensitive)
- Ensure API key has permission to add tags

### CORS Errors

**Symptom**: Network error in console
**Solution**:
- Use API v1 endpoint
- Consider backend proxy
- Check browser console for exact error

## Configuration Checklist

Before deploying:

- [ ] API key is valid and active
- [ ] Location ID is correct
- [ ] All custom fields created in GHL
- [ ] Custom field keys match exactly
- [ ] Tags created in GHL tag library
- [ ] Tag names match exactly
- [ ] Scoring threshold is appropriate
- [ ] Tested with sample data
- [ ] Error handling works
- [ ] Success message displays

## Additional Resources

- [Setup Guide](SETUP.md) - Step-by-step setup
- [Scoring Guide](SCORING_GUIDE.md) - Customize scoring logic
- [GoHighLevel API Docs](https://highlevel.stoplight.io/)

---

**Need Help?** Open an issue on GitHub with your configuration questions (without sharing real API keys!).
