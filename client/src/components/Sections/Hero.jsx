import { useEffect, useState } from 'react';
import { portfolioAPI } from '../../utils/api';

const Hero = () => {
  const [personal, setPersonal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await portfolioAPI.getPersonal();
        setPersonal(data);
      } catch (error) {
        console.error('Error fetching personal data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="hero" className="pt-24 pb-12 md:pt-32 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="animate-pulse">
          <div className="h-12 bg-slate-200 rounded w-96 mb-6"></div>
          <div className="h-6 bg-slate-200 rounded w-64 mb-10"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className="pt-24 pb-12 md:pt-32 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
        {personal?.name || 'Your Name'}
      </h1>
      <p className="text-xl md:text-2xl text-blue-600 font-semibold mb-4">
        {personal?.title || 'Software Engineer'}
      </p>
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10">
        {personal?.tagline || 'Building intelligent systems'}
      </p>
      <div className="mb-8">
        <span className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
          🎯 {personal?.status || 'Open to opportunities'}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <a 
          href="#projects" 
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
        >
          View Projects
        </a>
        <a 
          href="#contact" 
          className="px-8 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors"
        >
          Contact Me
        </a>
      </div>
    </section>
  );
};

export default Hero;
