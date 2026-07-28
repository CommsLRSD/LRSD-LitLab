# Literacy Pal - Literacy Intervention Assistant

A beautiful, modern web application designed to help educators navigate the Multi-Tiered System of Supports (MTSS) for literacy interventions.

## 🎯 Features

### ✅ Completed Features

#### 🏠 **Home Page**
- Beautiful animated hero section with gradient background
- Quick access navigation cards to all main sections
- "Provide Feedback" button for user input
- Fully responsive design

#### 📅 **Assessment Schedules**
- English Program schedules (K, Grade 1, Grades 2-8)
- French Immersion Program schedules (K, Grade 1, Grade 2, Grades 3-5, Grades 6-8)
- Assessment Best Practices guide
- Responsive table layout

#### 🎯 **Interventions System**
- Three-tier intervention framework
- **Visual journey view**: the flowchart is a connected trail, not a one-card-at-a-time wizard
  - Sticky "The Process" map shows every step — done, in progress and still to come — at a glance
  - Completed steps stay on screen as connected cards showing the answer that was given
  - The live step is spotlighted (numbered marker, "You are here" flag) and the next step is previewed
  - Any earlier step can be revisited by clicking its trail card or its entry in the process map
- Beautiful tier landing pages with gradient headers
- **Tier 1**: Universal Screening & Core Instruction
  - 8-principle checklist for explicit instruction (functional)
  - Links to interventions and score understanding
- **Tier 2**: Small Group Intervention  
  - 5-principle checklist (functional)
  - Framework for 8-week intervention cycles
- **Tier 3**: Intensive Individual Intervention
  - Characteristics overview (functional)
  - Framework for intensive support

#### 📚 **Information & Support**
- Understanding Scores & Percentiles
  - Color-coded score system (Blue, Green, Yellow, Red)
  - Percentile interpretation guide
- Comprehensive FAQs
  - DIBELS, THaFoL, CTOPP-2 assessments
  - LRSD Portal data access

#### 🔗 **Resources**
- 24+ external resource links across 6 categories
- Assessment tools, intervention programs, professional development
- Digital tools, research resources, family materials

### ⏳ In Development

The following features have foundational structure but need completion:

- **Complete Tier Flowcharts**: Full decision trees for all three tiers
- **Interventions Menu**: Filterable database of interventions and assessments
- **Progress Tracking**: Student journey and history tracking
- **Data Input**: Forms for entering assessment results
- **Export Features**: PDF generation and print views

See [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) for detailed progress tracking.

## 🚀 Getting Started

### Running Locally

1. Clone the repository:
```bash
git clone https://github.com/CommsLRSD/LRSD-LitLab.git
cd LRSD-LitLab
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

- **GitHub Pages**: Enable in repository settings
- **Netlify**: Drag and drop deployment
- **Vercel**: Connect your repository
- **AWS S3 + CloudFront**: Upload to S3 bucket
- **Any web server**: Upload files to public directory

## 📁 File Structure

```
LRSD-LitLab/
├── index.html                    # Main HTML (700+ lines)
├── app.js                        # Application logic (800+ lines)
├── styles.css                    # Styling (2000+ lines)
├── data/
│   ├── interventions.json        # Intervention data
│   └── tier-flowcharts.json      # Tier flowchart data
├── Literacy_App_Spec.md          # App specification
├── IMPLEMENTATION_STATUS.md      # Detailed progress tracking
├── README.md                     # This file
├── TIER_SYSTEM_GUIDE.md          # Tier system documentation
└── OVERHAUL_SUMMARY.md           # Previous overhaul summary
```

## 🎨 Design Philosophy

1. **Beautiful**: Modern gradient designs, smooth animations
2. **Intuitive**: Clear navigation, logical flow
3. **Minimalistic**: Clean, uncluttered interface
4. **Fun**: Engaging hover effects and subtle animations
5. **Easy to Navigate**: Clear hierarchy, consistent patterns

## 💻 Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with custom properties, animations, gradients
- **Vanilla JavaScript**: No frameworks, pure JavaScript
- **JSON**: Data-driven approach
- **Mobile-First**: Responsive design from the ground up

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

© 2025 Literacy Pal - Literacy Intervention Assistant. All rights reserved.

## 🆘 Support

For questions or issues, please open an issue on the GitHub repository or contact your school's literacy coordinator.

## 📸 Screenshots

### Home Page
![Home](https://github.com/user-attachments/assets/f55d41c9-388c-4a8b-bcdc-946f3f8b988e)

### Interventions
![Interventions](https://github.com/user-attachments/assets/54ecb85d-6daa-4c08-84d5-8253b9d7e188)

### Assessment Schedules
The Assessment Schedules section features an interactive calendar view and table view that display when different literacy assessments occur throughout the school year for both English and French Immersion programs across all grade levels.

**Features:**
- **Interactive Calendar View**: Visual grid layout showing assessments, report cards, and intervention periods by month and grade level
- **Table View**: Compact table format with assessment names and timing
- **Toggle Control**: Switch between calendar and table views with preference persistence
- **Color-Coded Badges**: Each assessment type (DIBELS, CTOPP-2, THAFoL, IDAPEL) has a distinct color
- **Visual Indicators**: Report card icons and intervention period bars for easy reference
- **Responsive Design**: Mobile-friendly with horizontal scrolling and sticky first column
- **Accessibility**: Full keyboard navigation and screen reader support
- **Data-Driven**: All content rendered from `data/assessment-schedules.json`

![Schedules](https://github.com/user-attachments/assets/bb7238e8-18aa-413d-bdee-310b3f318544)

### Information & Support
![Info](https://github.com/user-attachments/assets/796204e9-a3fe-4555-83e5-9f6311819294)

---

**Status**: Production-ready for current scope. Tier flowcharts and interventions menu are in development.
