# Setup Guide

This guide will walk you through setting up the Solar Case Scoring System in GoHighLevel.

## Prerequisites

- Active GoHighLevel account
- Access to GoHighLevel API settings
- A landing page where you want to add the qualification form

## Step-by-Step Setup

### 1. Get Your GoHighLevel API Credentials

#### Get API Key

1. Log in to your GoHighLevel account
2. Click on **Settings** (gear icon)
3. Navigate to **API** section
4. If you don't have an API key, click **Create API Key**
5. Copy your API key - you'll need this later
6. **Important**: Keep this key secure and never share it publicly

#### Get Location ID

1. In GoHighLevel, go to **Settings** > **Business Profile**
2. Your Location ID should be visible in the URL or settings
3. Alternatively, check the URL when viewing your dashboard: `https://app.gohighlevel.com/location/{LOCATION_ID}/`
4. Copy this ID

### 2. Create Custom Fields in GoHighLevel

You need to create custom fields to store the qualification data.

1. Go to **Settings** > **Custom Fields**
2. Click **Add Field**
3. Create the following fields:

| Field Name | Field Key | Field Type |
|------------|-----------|------------|
| Solar Case Score | `solar_case_score` | Number |
| Paying More Post Solar | `paying_more_post_solar` | Text |
| Panels Shaded | `panels_shaded` | Text |
| Inverter Outside | `inverter_outside` | Text |
| Qualification Status | `qualification_status` | Text |

**Important**: The **Field Key** must match exactly what's in the code. You can customize the Field Name to display however you want.

### 3. Create Tags

1. Go to **Contacts** > **Smart Lists** > **Tags**
2. Create two new tags:
   - `good_solar_case`
   - `low_quality_case`

You can customize these tag names, but make sure to update them in the configuration.

### 4. Configure the Form

#### Option A: Using index.html (Recommended for GHL)

1. Open the `index.html` file in a text editor
2. Find the `CONFIG` object (around line 140)
3. Replace the placeholder values:

```javascript
const CONFIG = {
  // Replace with your actual API key
  GHL_API_KEY: 'sk-abc123def456...',  // Your actual key

  // Replace with your actual Location ID
  GHL_LOCATION_ID: 'abc123def456...',  // Your actual ID

  // Leave this as-is unless using API v2
  GHL_API_URL: 'https://rest.gohighlevel.com/v1/contacts/',

  // Customize scoring if needed
  SCORING: {
    payingMoreYes: 50,
    shadeYes: 30,
    inverterOutsideYes: 20,
    threshold: 60
  },

  // Customize tags if needed
  TAGS: {
    qualified: 'good_solar_case',
    unqualified: 'low_quality_case'
  },

  // Update field keys if you used different ones
  CUSTOM_FIELDS: {
    score: 'solar_case_score',
    payingMore: 'paying_more_post_solar',
    shade: 'panels_shaded',
    inverterOutside: 'inverter_outside',
    qualification: 'qualification_status'
  }
};
```

#### Option B: Using Modular Files

1. Edit `js/config.js` with your credentials
2. Upload all files (HTML, CSS, JS) to your web hosting
3. Link to the hosted files from your GoHighLevel page

### 5. Add to GoHighLevel Page

#### Method 1: Custom Code Element (Recommended)

1. Open your GoHighLevel page in the page builder
2. Drag a **Custom Code** element onto the page
3. Copy the **entire contents** of `index.html`
4. Paste into the Custom Code element
5. Save the element
6. Save and publish your page

#### Method 2: Custom HTML Section

1. In the page builder, add a **Custom HTML** section
2. Paste the contents of `index.html`
3. Save and publish

### 6. Test the Integration

1. Open your published page in a browser
2. Fill out the form with test data
3. Submit the form
4. Check the browser console (F12 > Console) for any errors
5. Verify in GoHighLevel:
   - New contact was created
   - Contact has the correct tag
   - Custom fields are populated
   - Score is calculated correctly

#### Test Scenarios

**Test 1: Qualified Lead**
- Paying more: Yes (+50)
- Shaded: Yes (+30)
- Inverter outside: Yes (+20)
- **Total**: 100 points → Should be tagged `good_solar_case`

**Test 2: Unqualified Lead**
- Paying more: No (0)
- Shaded: No (0)
- Inverter outside: Yes (+20)
- **Total**: 20 points → Should be tagged `low_quality_case`

### 7. Troubleshooting

#### Form doesn't submit

1. Open browser console (F12)
2. Check for error messages
3. Common issues:
   - API key incorrect or expired
   - Location ID incorrect
   - CORS issues (API v2 might need different setup)

#### Custom fields not showing

1. Verify field keys match exactly in GHL and code
2. Check that fields are created in the correct location
3. Ensure field types are correct

#### Tags not applying

1. Verify tags exist in your GHL tag library
2. Check tag names match exactly (case-sensitive)
3. Check API permissions allow tag modification

#### API Error 401 (Unauthorized)

- Your API key is incorrect or expired
- Generate a new API key in GHL settings

#### API Error 404 (Not Found)

- Your Location ID might be incorrect
- Check the API endpoint URL (v1 vs v2)

#### CORS Errors

- If using modular files hosted externally
- Try using the single-file `index.html` version instead
- Or ensure your hosting allows CORS requests

### 8. GoHighLevel Automation (Optional)

You can set up automations to trigger when contacts are tagged:

1. Go to **Automation** > **Workflows**
2. Create a new workflow
3. Set trigger: **Tag Applied** → `good_solar_case`
4. Add actions:
   - Send email notification to sales team
   - Assign to specific user
   - Add to campaign
   - Send SMS
   - etc.

Repeat for `low_quality_case` tag with different actions.

## API Version Notes

### Using API v1 (Default)

```javascript
GHL_API_URL: 'https://rest.gohighlevel.com/v1/contacts/'
```

### Using API v2

```javascript
GHL_API_URL: 'https://services.leadconnectorhq.com/contacts/'
```

You may need to adjust the request payload structure for v2. Check GoHighLevel API documentation for details.

## Security Best Practices

### For Testing/Internal Use
- Current setup is fine - API key in client-side code

### For Production/Public Use

Consider these alternatives:

1. **Use GHL Form Webhook**
   - Create a GoHighLevel form
   - Set up a webhook to receive submissions
   - Process scoring on a serverless function
   - More secure - no exposed API key

2. **Backend Proxy**
   - Set up Cloudflare Worker or AWS Lambda
   - Form submits to your proxy
   - Proxy adds API key and submits to GHL
   - API key never exposed to client

3. **Environment Variables**
   - Use server-side rendering
   - Inject credentials from environment variables
   - Never commit real keys to version control

## Next Steps

- Customize the scoring logic → See [SCORING_GUIDE.md](SCORING_GUIDE.md)
- Adjust configuration → See [CONFIGURATION.md](CONFIGURATION.md)
- Set up automation workflows in GoHighLevel
- Monitor and optimize conversion rates

## Support

If you encounter issues:
1. Check browser console for error messages
2. Verify all credentials are correct
3. Test with API v1 endpoint first
4. Review GoHighLevel API documentation
5. Open an issue on GitHub

---

**Need help?** Check the other documentation files or open an issue on GitHub.
