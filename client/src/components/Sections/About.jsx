import { useEffect, useState } from 'react';
import { portfolioAPI } from '../../utils/api';

const About = () => {
  const [personal, setPersonal] = useState(null);
  const [education, setEducation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personalData, educationData] = await Promise.all([
          portfolioAPI.getPersonal(),
          portfolioAPI.getEducation()
        ]);
        setPersonal(personalData);
        setEducation(educationData);
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-4/5"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">About Me</h2>
        
        {/* Professional Summary */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 mb-8">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            {personal?.about}
          </p>
          <div className="flex items-center justify-center mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-200">
              🎯 {personal?.status}
            </span>
          </div>
          {personal?.resumeLink && (
            <div className="text-center">
              <a 
                href={personal.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Full Resume
              </a>
            </div>
          )}
        </div>

        {/* Education */}
        {education && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="mr-2">🎓</span>
              Education
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-semibold text-slate-900">{education.degree}</h4>
                <p className="text-lg text-blue-600 font-medium">{education.university}</p>
                <p className="text-slate-600">Expected Graduation: {education.graduation}</p>
                {education.gpa && (
                  <p className="text-slate-600 mt-1">GPA: {education.gpa}</p>
                )}
              </div>

              {education.coursework && education.coursework.length > 0 && (
                <div className="pt-4">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Relevant Coursework:</p>
                  <div className="flex flex-wrap gap-2">
                    {education.coursework.map((course) => (
                      <span key={course} className="text-sm px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {education.achievements && education.achievements.length > 0 && (
                <div className="pt-4">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Achievements:</p>
                  <ul className="space-y-1">
                    {education.achievements.map((achievement) => (
                      <li key={achievement} className="text-slate-600 flex items-start">
                        <span className="mr-2 text-blue-600">•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default About;
