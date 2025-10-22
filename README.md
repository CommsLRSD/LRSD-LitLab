# Litera - Literacy Intervention Assistant

A web application designed to help educators guide literacy interventions based on student assessment data.

## Features

### Multi-Level Filtering System
- **Hierarchical Navigation**: Filter interventions through a multi-level system:
  - Tier (1: Universal/Core, 2: Targeted/Supplemental, 3: Intensive/Individual)
  - Screener (DIBELS, FastBridge)
  - Test Area (Phonemic Awareness, Phonics, Reading Fluency, Comprehension)
  - Pillar (Specific skill areas within each test area)
  - Interventions (Detailed strategies with duration, group size, frequency, and resources)

### Single Page Application
- Dynamic content loading without page refreshes
- Smooth navigation between sections
- Responsive and modern design

### Educational Content
- **Interventions**: Main filtering interface to find appropriate strategies
- **Assessment Schedules**: Universal screening and progress monitoring guidelines
- **Understanding Scores**: How to interpret assessment results
- **FAQs**: Common questions about MTSS and literacy interventions
- **Resources**: Helpful materials, programs, and references

## Technology Stack

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with gradient headers, card layouts, and responsive design
- **Vanilla JavaScript**: No frameworks - pure JavaScript for all functionality
- **JSON**: Data-driven approach with structured intervention data

## File Structure

```
Litera/
├── index.html              # Main entry point
├── css/
│   └── style.css          # Application styling
├── js/
│   └── app.js             # Application logic and filtering
├── data/
│   └── interventions.json # Intervention data structure
├── pages/
│   ├── assessment-schedules.html
│   ├── understanding-scores.html
│   ├── faqs.html
│   └── resources.html
└── README.md
```

## Getting Started

### Running Locally

1. Clone the repository:
```bash
git clone https://github.com/CommsLRSD/Litera.git
cd Litera
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

1. **Select a Tier**: Choose the appropriate tier based on student needs
2. **Select a Screener**: Choose the assessment tool used (DIBELS or FastBridge)
3. **Select a Test Area**: Identify the specific area of concern
4. **Select a Pillar**: Narrow down to the specific skill
5. **View Interventions**: See detailed intervention strategies with implementation details

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

© 2025 Litera - Literacy Intervention Assistant. All rights reserved.

## Support

For questions or issues, please open an issue on the GitHub repository.
