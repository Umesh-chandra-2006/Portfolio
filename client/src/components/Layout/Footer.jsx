import { useEffect, useState } from 'react';
import { portfolioAPI } from '../../utils/api';

const Footer = () => {
  const [personal, setPersonal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await portfolioAPI.getPersonal();
        setPersonal(data);
      } catch (error) {
        console.error('Error fetching personal data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} {personal?.name || 'Portfolio'}. All rights reserved.</p>
            <p className="text-sm text-slate-400 mt-1">Built with React, Node.js, and Gemini AI</p>
          </div>
          <div className="flex space-x-6">
            {personal?.contact?.github && (
              <a 
                href={`https://${personal.contact.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="GitHub"
              >
                GitHub
              </a>
            )}
            {personal?.contact?.linkedin && (
              <a 
                href={`https://${personal.contact.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                LinkedIn
              </a>
            )}
            {personal?.contact?.email && (
              <a 
                href={`mailto:${personal.contact.email}`}
                className="hover:text-white transition-colors"
                aria-label="Email"
              >
                Email
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
