# GoHighLevel Setup Guide

This guide will walk you through setting up the Solar Loan Cancellation form in GoHighLevel.

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

You need to create custom fields to store the form data.

1. Go to **Settings** > **Custom Fields**
2. Click **Add Field**
3. Create the following fields:

| Field Name | Field Key | Field Type |
|------------|-----------|------------|
| Solar Case Score | `solar_case_score` | Number |
| State | `state` | Text |
| Has Solar Loan | `has_solar_loan` | Text |
| Solar Lender | `solar_lender` | Text |
| Solar Warranty | `solar_warranty` | Text |
| Warranty Duration | `warranty_duration` | Text |
| Installer Status | `installer_status` | Text |
| Panels Shade | `panels_shade` | Text |
| Inverter Outside | `inverter_outside` | Text |
| Electricity Cost | `electricity_cost` | Text |
| Additional Info | `additional_info` | Text (Long) |
| Qualification Status | `qualification_status` | Text |

**Important**: The **Field Key** must match exactly what's in the table above. You can customize the Field Name to display however you want.

### 3. Create Tags

1. Go to **Contacts** > **Smart Lists** > **Tags**
2. Create two new tags:
   - `good_solar_case`
   - `low_quality_case`

You can customize these tag names, but make sure to update them in the configuration (Step 4).

### 4. Configure the Form

#### Option A: Using ghl-embed.html (Easiest - Recommended)

1. Open the `ghl-embed.html` file from the repository
2. Find the `CONFIG` object (around line 413)
3. Replace the placeholder values:

```javascript
const CONFIG = {
  // Replace with your actual API key
  GHL_API_KEY: 'YOUR_GHL_API_KEY_HERE',

  // Replace with your actual Location ID
  GHL_LOCATION_ID: 'YOUR_LOCATION_ID_HERE',

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

  // Custom field keys (must match what you created in Step 2)
  CUSTOM_FIELDS: {
    score: 'solar_case_score',
    state: 'state',
    hasLoan: 'has_solar_loan',
    lender: 'solar_lender',
    warranty: 'solar_warranty',
    warrantyDuration: 'warranty_duration',
    installerStatus: 'installer_status',
    panelsShade: 'panels_shade',
    inverterOutside: 'inverter_outside',
    electricityCost: 'electricity_cost',
    additionalInfo: 'additional_info',
    qualification: 'qualification_status'
  }
};
```

4. Save the file with your updated credentials

#### Option B: Using index.html (Full HTML Version)

1. Open the `index.html` file
2. Find the `CONFIG` object (around line 424)
3. Replace the same values as shown in Option A above

### 5. Add to GoHighLevel Page

#### Method 1: Custom Code Element (Recommended)

1. Open your GoHighLevel page in the page builder
2. Drag a **Custom Code** element onto the page where you want the form
3. **Copy the entire contents** of `ghl-embed.html` (this is the ready-to-paste version)
4. Paste into the Custom Code element
5. Click **Save** on the element
6. Save and **Publish** your page

#### Method 2: Custom HTML Section

1. In the page builder, add a **Custom HTML** section
2. Paste the contents of `ghl-embed.html`
3. Save and publish

**Note**: Use `ghl-embed.html` for GoHighLevel - it's already formatted without the outer HTML tags that GHL provides.

### 6. Test the Integration

1. Open your published page in a browser
2. Fill out the form with test data
3. Submit the form
4. Check the browser console (F12 > Console) for any errors
5. Verify in GoHighLevel:
   - New contact was created
   - Contact has the correct tag
   - All custom fields are populated
   - Score is calculated correctly

#### Test Scenarios

**Test 1: Has Loan - Qualified Lead**
- State: Any state
- Has loan: Yes
- Lender: GoodLeap (or any lender)
- **Expected**: Should be tagged `good_solar_case`

**Test 2: No Loan - Unqualified Lead**
- State: Any state
- Has loan: No
- Lender: Any
- **Expected**: Should be tagged `low_quality_case`

**Test 3: Full Conditional Flow**
1. Select lender: Mosaic, GoodLeap, or Other → Shows warranty question
2. Select warranty: Yes → Shows warranty duration question
3. Select warranty 5+ years: Yes → Shows installer status question
4. Select installer responsive: No → Shows 4 additional questions (shade, inverter, cost, additional info)

### 7. Troubleshooting

#### Form doesn't submit

1. Open browser console (F12 > Console tab)
2. Check for error messages
3. Common issues:
   - API key incorrect or expired
   - Location ID incorrect
   - Custom field keys don't match exactly

#### Custom fields not showing in GoHighLevel

1. Verify field keys match **exactly** (case-sensitive) in GHL and code
2. Check that fields are created in the correct location
3. Ensure field types are correct (Number for score, Text for others)

#### Tags not applying

1. Verify tags exist in your GHL tag library
2. Check tag names match exactly (case-sensitive)
3. Check API key has permission to add tags

#### API Error 401 (Unauthorized)

- Your API key is incorrect or expired
- Generate a new API key in GHL settings

#### API Error 404 (Not Found)

- Your Location ID might be incorrect
- Check the API endpoint URL (v1 vs v2)

#### Form shows but fields don't appear conditionally

- Make sure JavaScript is running (check browser console)
- Verify there are no JavaScript errors in console
- Try refreshing the page

### 8. GoHighLevel Automation (Optional)

Set up automations to trigger when contacts are tagged:

**For Qualified Leads:**
1. Go to **Automation** > **Workflows**
2. Create a new workflow
3. Set trigger: **Tag Applied** → `good_solar_case`
4. Add actions:
   - Send email to sales team
   - Assign to specific user
   - Add to high-priority campaign
   - Send immediate follow-up SMS
   - Create calendar appointment

**For Unqualified Leads:**
1. Create another workflow
2. Set trigger: **Tag Applied** → `low_quality_case`
3. Add actions:
   - Add to nurture campaign
   - Send educational email series
   - Schedule follow-up for later date

## Form Fields Explained

The form collects the following information:

1. **What state do you live in?** - 50 US states dropdown
2. **Do you currently have a loan for your solar panels?** - Yes/No
3. **Who is your lender?** - 12 lender options
4. **Did your solar system come with a warranty?** *(Conditional: Shows only for Mosaic, GoodLeap, Other)*
5. **Was your warranty 5 years or longer?** *(Conditional: Shows if warranty = Yes)*
6. **Is your installer out of business?** *(Conditional: Shows if warranty duration = Yes)*
7. **Are your panels covered in shade?** *(Conditional: Shows if installer status = No)*
8. **Is your inverter box outside?** *(Conditional: Shows if installer status = No)*
9. **Electricity cost comparison** *(Conditional: Shows if installer status = No)*
10. **Additional information** *(Conditional: Optional text area if installer status = No)*

## API Version Notes

### Using API v1 (Default - Recommended)

```javascript
GHL_API_URL: 'https://rest.gohighlevel.com/v1/contacts/'
```

### Using API v2

```javascript
GHL_API_URL: 'https://services.leadconnectorhq.com/contacts/'
```

You may need to adjust the request payload structure for v2. Check GoHighLevel API documentation for details.

## Security Considerations

**⚠️ Important**: The current implementation includes the API key in client-side code. This is suitable for:
- Internal tools
- Low-volume applications
- Development/testing

**For high-security production environments**, consider:

1. **Use GHL Form Webhook**
   - Create a GoHighLevel form
   - Set up a webhook to receive submissions
   - Process scoring on a serverless function
   - API key never exposed to client

2. **Backend Proxy**
   - Set up Cloudflare Worker or AWS Lambda
   - Form submits to your proxy
   - Proxy adds API key and submits to GHL
   - API key never exposed

## Next Steps

- Customize the form styling if needed (edit the `<style>` section)
- Adjust scoring logic → See [SCORING_GUIDE.md](SCORING_GUIDE.md)
- Fine-tune configuration → See [CONFIGURATION.md](CONFIGURATION.md)
- Set up automation workflows in GoHighLevel
- Monitor form submissions and conversion rates

## Support

If you encounter issues:
1. Check browser console (F12) for error messages
2. Verify all credentials are correct and fields match exactly
3. Test with API v1 endpoint first
4. Review GoHighLevel API documentation
5. Open an issue on GitHub

---

**Quick Reference**:
- **Form file**: `ghl-embed.html` (easiest for GHL)
- **Full version**: `index.html` (standalone page)
- **Config location**: Around line 413-463 in ghl-embed.html
- **Tags to create**: `good_solar_case`, `low_quality_case`
