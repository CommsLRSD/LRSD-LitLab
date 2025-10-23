# Literacy Pal - Literacy Intervention Assistant

A web application designed to help educators navigate the Multi-Tiered System of Supports (MTSS) for literacy interventions.

## Features

### Step-by-Step Intervention Wizard
- **Tier 1 - Universal Classroom Interventions**: High-quality instruction for all students (80%)
  - Review principles of explicit and systematic instruction
  - Select literacy screener (DIBELS, CTOPP-2, THaFoL, IDAPEL)
  - Evaluate effectiveness with intelligent branching logic
  - Determine next steps based on student success rates

- **Tier 2 - Small Group Interventions**: Targeted support for at-risk students (15%)
  - Review small group intervention requirements
  - Select drill-down assessments based on screener results
  - Choose evidence-based interventions (placeholder)
  - Complete 8-week intervention cycle with progress monitoring
  - Fade to Tier 1 or move to Tier 3 based on results

- **Tier 3 - Personalized Interventions**: Intensive support for students with significant needs (5%)
  - Review intensive intervention characteristics
  - Select comprehensive diagnostic assessments
  - Choose personalized interventions (placeholder)
  - Complete 8-week intensive cycle with weekly monitoring
  - Fade to Tier 2 or meet with clinicians based on results

### User Experience
- **One Step at a Time**: Only one step visible at a time for focused workflow
- **Back Button**: Navigate to previous steps throughout the process
- **Smart Branching**: Logic-based navigation based on educator choices
- **Smooth Transitions**: Modern animations triggered only by user interactions
- **No Distractions**: Removed all constantly running animations
- **Welcome Animation**: Single, welcoming animation on initial page load

### Single Page Application
- All content contained in a single HTML file with multiple sections
- Instant navigation between sections without page reloads
- Dynamic content visibility managed through JavaScript
- Responsive and modern design

### Educational Content
- **Interventions**: Step-by-step wizard for all three intervention tiers
- **Assessment Schedules**: Universal screening and progress monitoring guidelines
- **Understanding Scores**: How to interpret assessment results
- **FAQs**: Common questions about MTSS and literacy interventions
- **Resources**: Helpful materials, programs, and references

## Technology Stack

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern minimalist styling with solid colors, smooth animations, and responsive design
- **Vanilla JavaScript**: No frameworks - pure JavaScript for all functionality
- **JSON**: Data-driven approach with structured intervention data

## File Structure

```
Literacy-Pal/
├── index.html              # Main entry point with all page sections
├── app.js                  # Application logic and filtering
├── styles.css              # Application styling
├── data/
│   └── interventions.json # Intervention data structure
└── README.md
```

## Getting Started

### Running Locally

1. Clone the repository:
```bash
git clone https://github.com/CommsLRSD/Literacy-Pal.git
cd Literacy-Pal
```

2. Serve the application using any static web server:

**Using Python 3:**
```bash
python3 -m http.server 8080
```

**Using Node.js (http-server):**
```bash
npx http-server -p 8080
```

**Using PHP:**
```bash
php -S localhost:8080
```

3. Open your browser and navigate to `http://localhost:8080`

### Deployment

Since this is a static web application, it can be deployed to any static hosting service:

- **GitHub Pages**: Simply enable GitHub Pages in your repository settings
- **Netlify**: Drag and drop the entire folder
- **Vercel**: Connect your repository
- **AWS S3 + CloudFront**: Upload files to an S3 bucket
- **Any web server**: Upload files to your server's public directory

## Data Structure

The application uses a hierarchical JSON structure in `data/interventions.json`:

```json
{
  "tiers": [
    {
      "id": "tier1",
      "name": "Tier 1 - Universal/Core Instruction",
      "screeners": [
        {
          "id": "dibels",
          "name": "DIBELS",
          "testAreas": [
            {
              "id": "phonemic-awareness",
              "name": "Phonemic Awareness",
              "pillars": [
                {
                  "id": "phoneme-segmentation",
                  "name": "Phoneme Segmentation",
                  "interventions": [
                    {
                      "name": "Sound Boxes (Elkonin Boxes)",
                      "description": "...",
                      "duration": "10-15 minutes",
                      "groupSize": "Small group (3-5 students)",
                      "frequency": "Daily",
                      "resources": "..."
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## How to Use

1. **Select a Tier**: Choose to start with Tier 1, Tier 2, or Tier 3 based on student needs
2. **Follow the Wizard**: Complete each step in the guided process
3. **Make Decisions**: Choose appropriate options based on student data
4. **Navigate**: Use the back button to review previous steps if needed
5. **Follow Recommendations**: The system will guide you to appropriate next steps based on your selections

For detailed information about the tier system and flows, see [TIER_SYSTEM_GUIDE.md](TIER_SYSTEM_GUIDE.md).

## Adding New Interventions

To add new interventions, edit `data/interventions.json` following the existing structure. The application will automatically load and display the new data.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

© 2025 Literacy Pal - Literacy Intervention Assistant. All rights reserved.

## Support

For questions or issues, please open an issue on the GitHub repository.
