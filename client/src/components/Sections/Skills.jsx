import { useEffect, useState } from 'react';
import { portfolioAPI } from '../../utils/api';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await portfolioAPI.getSkills();
        setSkills(data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Helper to get display skills (just names)
  const getDisplaySkills = (skillGroup) => {
    if (Array.isArray(skillGroup.skills[0])) {
      return skillGroup.skills;
    }
    // New format with objects
    return skillGroup.skills.map(s => s.name);
  };

  if (loading) {
    return (
      <section id="skills" className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white p-6 rounded-xl">
                <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-slate-200 rounded"></div>
                  <div className="h-8 bg-slate-200 rounded"></div>
                  <div className="h-8 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Technical Skills</h2>
        <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
          A comprehensive toolkit for building scalable systems, from frontend to backend to AI integration.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skillGroup) => (
            <div 
              key={skillGroup.category} 
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
                <span className="mr-2">{getCategoryIcon(skillGroup.category)}</span>
                {skillGroup.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {getDisplaySkills(skillGroup).map((item) => (
                  <span 
                    key={item} 
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Helper function to get icons for categories
const getCategoryIcon = (category) => {
  const icons = {
    'Languages': '💻',
    'Frameworks & Libraries': '⚡',
    'Tools & Platforms': '🛠️',
    'Concepts & Practices': '🎯',
    'Frontend': '🎨',
    'Backend': '⚙️',
    'AI/ML': '🤖'
  };
  return icons[category] || '📦';
};

export default Skills;
