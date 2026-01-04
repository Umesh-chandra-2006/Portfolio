import { useEffect, useState } from 'react';
import { portfolioAPI } from '../../utils/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await portfolioAPI.getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-slate-200 rounded-t-xl"></div>
              <div className="p-6 bg-white rounded-b-xl">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Featured Projects</h2>
      <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
        A selection of my recent work demonstrating full-stack development, AI integration, and system design skills.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-blue-500 transition-all shadow-sm hover:shadow-lg"
          >
            {/* Project Image */}
            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-slate-100 group-hover:from-blue-100 group-hover:to-slate-200 transition-all flex items-center justify-center overflow-hidden">
              {project.visual ? (
                <img 
                  src={project.visual} 
                  alt={project.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="text-4xl">{project.featured ? '⭐' : '💻'}</div>
              )}
            </div>

            <div className="p-6">
              {/* Project Title */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {project.name}
                </h3>
                {project.featured && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">
                    Featured
                  </span>
                )}
              </div>

              {/* Tagline */}
              <p className="text-sm text-blue-600 font-medium mb-3">
                {project.tagline}
              </p>

              {/* Description */}
              <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack.slice(0, 4).map((tech) => (
                  <span 
                    key={tech} 
                    className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 4 && (
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    +{project.techStack.length - 4}
                  </span>
                )}
              </div>

              {/* Links */}
              <div className="flex items-center gap-4 text-sm">
                {project.links.demo && project.links.demo !== '#' && (
                  <a 
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700"
                  >
                    Live Demo
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                {project.links.github && project.links.github !== '#' && (
                  <a 
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-medium text-slate-700 hover:text-slate-900"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    Code
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
