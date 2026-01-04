const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const portfolioAPI = {
  // Get personal information
  getPersonal: async () => {
    const response = await fetch(`${API_BASE_URL}/api/personal`);
    if (!response.ok) throw new Error('Failed to fetch personal info');
    return response.json();
  },

  // Get all projects
  getProjects: async () => {
    const response = await fetch(`${API_BASE_URL}/api/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  // Get single project
  getProject: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`);
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
  },

  // Get featured project
  getFeaturedProject: async () => {
    const response = await fetch(`${API_BASE_URL}/api/projects/featured/top`);
    if (!response.ok) throw new Error('Failed to fetch featured project');
    return response.json();
  },

  // Get skills
  getSkills: async () => {
    const response = await fetch(`${API_BASE_URL}/api/skills`);
    if (!response.ok) throw new Error('Failed to fetch skills');
    return response.json();
  },

  // Get education
  getEducation: async () => {
    const response = await fetch(`${API_BASE_URL}/api/education`);
    if (!response.ok) throw new Error('Failed to fetch education');
    return response.json();
  },

  // Get complete portfolio (for resume generator)
  getCompletePortfolio: async () => {
    const response = await fetch(`${API_BASE_URL}/api/portfolio/complete`);
    if (!response.ok) throw new Error('Failed to fetch complete portfolio');
    return response.json();
  }
};
