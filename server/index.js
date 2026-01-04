import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read JSON files
const readJSON = async (filename) => {
  const filePath = path.join(__dirname, 'data', filename);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
};

// ==================== Portfolio Data Routes ====================

// Get personal information
app.get('/api/personal', async (req, res) => {
  try {
    const data = await readJSON('personal.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load personal information' });
  }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const data = await readJSON('projects.json');
    // Sort by priority (lower number = higher priority)
    const sorted = data.sort((a, b) => a.priority - b.priority);
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

// Get single project by id
app.get('/api/projects/:id', async (req, res) => {
  try {
    const data = await readJSON('projects.json');
    const project = data.find(p => p.id === req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to load project' });
  }
});

// Get featured project
app.get('/api/projects/featured/top', async (req, res) => {
  try {
    const data = await readJSON('projects.json');
    const featured = data.find(p => p.featured === true);
    if (featured) {
      res.json(featured);
    } else {
      // Return highest priority project if no featured
      const sorted = data.sort((a, b) => a.priority - b.priority);
      res.json(sorted[0]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to load featured project' });
  }
});

// Get skills
app.get('/api/skills', async (req, res) => {
  try {
    const data = await readJSON('skills.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load skills' });
  }
});

// Get education
app.get('/api/education', async (req, res) => {
  try {
    const data = await readJSON('education.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load education' });
  }
});

// Get all portfolio data (for resume generator)
app.get('/api/portfolio/complete', async (req, res) => {
  try {
    const [personal, projects, skills, education] = await Promise.all([
      readJSON('personal.json'),
      readJSON('projects.json'),
      readJSON('skills.json'),
      readJSON('education.json')
    ]);

    res.json({
      personal,
      projects: projects.sort((a, b) => a.priority - b.priority),
      skills,
      education
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load complete portfolio data' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'JARVIS Lite API is running',
    endpoints: [
      '/api/personal',
      '/api/projects',
      '/api/projects/:id',
      '/api/projects/featured/top',
      '/api/skills',
      '/api/education',
      '/api/portfolio/complete'
    ]
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
