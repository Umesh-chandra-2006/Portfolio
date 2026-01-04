# Portfolio JARVIS Lite 🚀

> A streamlined, intelligent portfolio website featuring a fast FAQ-style AI assistant and an admin-only resume generator. Built to ship quickly while demonstrating AI integration capabilities.

## 🎯 Project Status

**Week 1 (Foundation): ✅ COMPLETE**
- [x] Portfolio data structure with comprehensive schema
- [x] Backend API with Express serving all portfolio data
- [x] Responsive React frontend with Tailwind CSS
- [x] All sections: Hero, About, Projects, Skills, Contact, Education
- [x] Mobile-responsive design
- [x] Fast loading with optimized data fetching

**Week 2 (JARVIS FAQ Bot): 🚧 READY TO BUILD**
**Week 3 (Resume Generator): 📅 PLANNED**

## 📁 Project Structure

```
JARVIS/
├── client/                 # React frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/     # Navbar, Footer
│   │   │   └── Sections/   # Hero, About, Projects, Skills, Contact
│   │   └── utils/
│   │       └── api.js      # API helper functions
│   └── .env                # Frontend environment variables
│
├── server/                 # Node.js + Express backend
│   ├── data/              # JSON data files
│   │   ├── personal.json
│   │   ├── projects.json
│   │   ├── skills.json
│   │   └── education.json
│   ├── index.js           # Express server
│   └── .env               # Backend environment variables
│
└── package.json           # Root package with concurrent dev scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone and navigate to project:**
   ```bash
   cd d:\JARVIS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   **Backend** (`server/.env`):
   ```env
   PORT=5000
   GEMINI_API_KEY=your_api_key_here
   ADMIN_PASSWORD=your_secure_password
   ```

   **Frontend** (`client/.env`):
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Customize your data** in `server/data/`:
   - `personal.json` - Your personal information
   - `projects.json` - Your projects with bullets and metrics
   - `skills.json` - Your technical skills
   - `education.json` - Your education details

### Running the Application

**Development mode** (both frontend and backend):
```bash
npm run dev
```

This starts:
- Backend API: http://localhost:5000
- Frontend: http://localhost:5173

**Backend only:**
```bash
cd server
npm run dev
```

**Frontend only:**
```bash
cd client
npm run dev
```

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/personal` | GET | Get personal information |
| `/api/projects` | GET | Get all projects (sorted by priority) |
| `/api/projects/:id` | GET | Get single project by ID |
| `/api/projects/featured/top` | GET | Get featured project |
| `/api/skills` | GET | Get skills by category |
| `/api/education` | GET | Get education details |
| `/api/portfolio/complete` | GET | Get all portfolio data (for resume generator) |

## 🎨 Tech Stack

### Frontend
- ⚛️ **React 19** - UI framework
- ⚡ **Vite** - Build tool and dev server
- 🎨 **Tailwind CSS** - Utility-first CSS
- 📱 **Responsive Design** - Mobile-first approach

### Backend
- 🟢 **Node.js** - Runtime
- 🚂 **Express** - Web framework
- 📄 **JSON Files** - Data storage (MVP)
- 🔒 **CORS** enabled

### AI Integration (Week 2+)
- 🤖 **Google Gemini API** - AI-powered FAQ and resume generation
- 💰 **Free tier** - Cost-effective solution

## 📝 Customizing Your Portfolio

### 1. Personal Information

Edit `server/data/personal.json`:
```json
{
  "name": "Your Name",
  "title": "CS Student | Software Engineer",
  "tagline": "Building intelligent systems",
  "about": "Your professional summary...",
  "status": "Seeking Summer 2026 SWE/ML internships",
  "contact": {
    "email": "you@email.com",
    "linkedin": "linkedin.com/in/yourname",
    "github": "github.com/yourname",
    "location": "City, State"
  },
  "resumeLink": "/resume.pdf"
}
```

### 2. Projects

Edit `server/data/projects.json`. Each project should include:
- **Basic Info**: name, tagline, description
- **Tech Stack**: Array of technologies
- **Bullets**: Achievement-focused bullet points with metrics
- **Links**: demo, github, case study
- **Keywords**: For FAQ matching and resume generation
- **Priority**: Lower number = higher priority (1 = featured)

Example:
```json
{
  "id": "project-id",
  "name": "Project Name",
  "tagline": "One-line description",
  "description": "2-3 sentence detailed description with impact",
  "techStack": ["React", "Node.js", "PostgreSQL"],
  "bullets": [
    "Built X that achieved Y with Z metric",
    "Implemented A reducing B by 40%"
  ],
  "links": {
    "demo": "https://demo.com",
    "github": "https://github.com/you/project",
    "caseStudy": ""
  },
  "visual": "path/to/image.png",
  "date": "January 2026",
  "priority": 1,
  "keywords": ["backend", "api", "database"],
  "featured": true
}
```

### 3. Skills

Edit `server/data/skills.json`:
```json
[
  {
    "category": "Languages",
    "skills": [
      {
        "name": "Python",
        "proficiency": "Advanced",
        "yearsExperience": 3,
        "projectsUsed": ["project-id"]
      }
    ]
  }
]
```

### 4. Education

Edit `server/data/education.json`:
```json
{
  "degree": "B.S. Computer Science",
  "university": "University Name",
  "graduation": "May 2026",
  "gpa": "3.8/4.0",
  "coursework": ["Course 1", "Course 2"],
  "achievements": ["Achievement 1"]
}
```

## 🎯 Week 1 Completion Checklist

- [x] Backend API setup with all routes
- [x] Data structure with comprehensive schema
- [x] Frontend components with API integration
- [x] Hero section with dynamic data
- [x] About section with education
- [x] Projects section with cards
- [x] Skills section organized by category
- [x] Contact section with social links
- [x] Navbar with smooth navigation
- [x] Footer with dynamic links
- [x] Loading states for all components
- [x] Mobile responsive design
- [x] Development servers running concurrently

## 🚀 Next Steps (Week 2 & 3)

### Week 2: JARVIS FAQ Bot
- [ ] Gemini API integration
- [ ] Predefined question categorization
- [ ] Chat widget UI component
- [ ] Response caching for common questions
- [ ] Rate limiting implementation
- [ ] Error handling and fallbacks

### Week 3: Resume Generator (Admin Only)
- [ ] Admin authentication route
- [ ] JD parsing and analysis
- [ ] Project recommendation engine
- [ ] Resume generation with AI
- [ ] ATS compatibility scoring
- [ ] PDF/DOCX export
- [ ] Email delivery

## 📊 Performance Goals

- ✅ Page load: < 2 seconds
- ✅ Mobile responsive
- 🎯 FAQ response: < 1 second (cached)
- 🎯 Resume generation: < 10 seconds

## 🔧 Troubleshooting

**Backend not starting?**
- Check if port 5000 is available
- Verify `.env` file exists in `server/` directory
- Run `cd server && npm install`

**Frontend not loading?**
- Check if backend is running on port 5000
- Verify `VITE_API_URL` in `client/.env`
- Clear browser cache

**Data not showing?**
- Check browser console for errors
- Verify JSON files in `server/data/` are valid
- Test API endpoints directly: `http://localhost:5000/api/personal`

## 📚 Resources

- [Gemini API Documentation](https://ai.google.dev/tutorials/get_started_web)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

## 📝 License

MIT

## 🤝 Contributing

This is a personal portfolio project. Feel free to fork and customize for your own use!

---

**Built with ❤️ following the "Ship Fast, Iterate Based on Feedback" philosophy**
