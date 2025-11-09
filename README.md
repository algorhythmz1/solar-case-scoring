# Solar Case Scoring System

A lightweight, client-side qualification system for solar cases that integrates seamlessly with GoHighLevel landing pages. This tool helps you automatically score and qualify solar leads based on specific criteria, routing them appropriately within your CRM.

## 🎯 Features

- **Client-Side Scoring**: All scoring logic runs in the browser - no backend required
- **GoHighLevel Integration**: Direct API integration for seamless lead capture
- **Customizable Scoring**: Easy-to-modify scoring rules via configuration
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **No Build Tools**: Copy-paste ready for GoHighLevel custom code blocks

## 📋 What It Does

1. Presents a pre-qualification form to potential solar case leads
2. Collects contact information and qualification questions
3. Uses conditional logic to show/hide relevant questions based on responses
4. Calculates a deterministic score based on answers
5. Determines qualification status (qualified/unqualified)
6. Submits lead data to GoHighLevel with:
   - All survey answers
   - Calculated score
   - Qualification status
   - Routing tag
7. Redirects to appropriate result page:
   - High-score page for qualified leads
   - Low-score page for unqualified leads

## 🚀 Quick Start

### Option 1: Single File (Easiest for GoHighLevel)

1. Open `index.html`
2. Replace these values in the `CONFIG` object:
   ```javascript
   GHL_API_KEY: 'your_actual_api_key',
   GHL_LOCATION_ID: 'your_location_id',
   ```
3. Copy the entire file contents
4. Paste into a GoHighLevel **Custom Code** element
5. Publish your page

### Option 2: Modular Files (Better for Development)

1. Edit `js/config.js` with your GoHighLevel credentials
2. Upload all files to your web hosting
3. Link to `index-modular.html`

See [SETUP.md](SETUP.md) for detailed instructions.

## 📊 Scoring Logic

The system calculates a qualification score based on conditional questions that appear when the installer is not responsive.

| Question | Answer | Points |
|----------|--------|--------|
| Panels covered in shade? | Yes | +30 |
| Panels covered in shade? | No | 0 |
| Inverter installed outside? | Yes | +20 |
| Inverter installed outside? | No | 0 |
| Electricity costs | Paying more after installation | +50 |
| Electricity costs | Breaking even | +25 |
| Electricity costs | Saving money | 0 |

**Qualification Threshold**: 60 points

- Score ≥ 60 → Qualified (redirects to high-score result page)
- Score < 60 → Not Qualified (redirects to low-score result page)

**Note**: Scoring only applies when users follow the conditional path where installer status = "No".

## 🔧 Customization

### Modify Scoring Rules

Edit the `CONFIG.SCORING` object:

```javascript
SCORING: {
  payingMoreYes: 50,      // Adjust point values
  shadeYes: 30,
  inverterOutsideYes: 20,
  threshold: 60           // Change qualification threshold
}
```

### Add New Questions

1. Add HTML form field to `index.html`
2. Collect value in form submission handler
3. Add scoring logic in `calculateScore()` function
4. Add custom field to API payload

See [SCORING_GUIDE.md](SCORING_GUIDE.md) for detailed examples.

### Change Tags

Edit the `CONFIG.TAGS` object:

```javascript
TAGS: {
  qualified: 'your_qualified_tag',
  unqualified: 'your_unqualified_tag'
}
```

## 📁 File Structure

```
solar-case-scoring/
├── index.html              # All-in-one version (recommended for GHL)
├── ghl-embed.html          # GoHighLevel embed version (copy-paste ready)
├── result-high-score.html  # Qualified leads result page
├── result-low-score.html   # Unqualified leads result page
├── index-modular.html      # Modular version
├── css/
│   └── styles.css          # Separated styles
├── js/
│   ├── config.js           # Configuration
│   ├── scoring.js          # Scoring logic
│   └── api.js              # API integration
├── examples/
│   ├── basic-form.html     # Minimal example
│   └── advanced-form.html  # Advanced features
├── README.md               # This file
├── SETUP.md                # Detailed setup guide
├── SCORING_GUIDE.md        # Scoring customization guide
└── CONFIGURATION.md        # Configuration reference
```

## 🔐 Security Considerations

**⚠️ Important**: The current implementation exposes your API key in client-side code. This is suitable for:
- Internal tools
- Low-volume applications
- Development/testing

**For production environments**, consider:
1. Using GoHighLevel form webhooks instead of direct API calls
2. Implementing a backend proxy (Cloudflare Workers, AWS Lambda)
3. Using environment variables and server-side rendering

See [CONFIGURATION.md](CONFIGURATION.md) for secure deployment options.

## 🛠️ Requirements

- GoHighLevel account with API access
- Modern web browser (Chrome, Firefox, Safari, Edge)
- GoHighLevel custom fields configured
- Tags created in GoHighLevel tag library

## 📖 Documentation

- [Setup Guide](SETUP.md) - Step-by-step setup instructions
- [Scoring Guide](SCORING_GUIDE.md) - Customize scoring logic
- [Configuration Reference](CONFIGURATION.md) - All configuration options

## 🚦 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the documentation files
- Review GoHighLevel API documentation

## 🗺️ Roadmap

- [ ] Backend proxy implementation example
- [ ] Webhook-based alternative
- [ ] Multi-step form wizard
- [ ] Analytics dashboard integration
- [ ] A/B testing framework
- [ ] Predictive ML scoring model
- [ ] Salesforce integration
- [ ] Zapier/Make.com templates

## 🙏 Acknowledgments

Built for solar case qualification and lead routing optimization.

---

**Version**: 1.0.0
**Last Updated**: November 2024
