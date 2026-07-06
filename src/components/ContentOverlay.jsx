import React from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Cpu, 
  Layers, 
  Shield, 
  Activity, 
  Globe, 
  Linkedin, 
  Mail, 
  Github,
  Award, 
  Briefcase, 
  Code, 
  ArrowDown 
} from 'lucide-react';

const cardSpring = {
  type: "spring",
  stiffness: 100,
  damping: 18,
  mass: 1
};

export default function ContentOverlay() {
  return (
    <div className="scroll-container">
      {/* SECTION 0: Hero (Center) */}
      <section id="hero" className="section align-center">
        <motion.div 
          className="glass-panel"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div 
            className="hero-eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            Pre-final year (Anurag University) Hyderabad
          </motion.div>
          <motion.h1 
            className="hero-name"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            Umesh Chandra
          </motion.h1>
          <motion.p 
            className="hero-tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Building things that actually <span className="highlight">work</span>
          </motion.p>
          <motion.p 
            className="hero-desc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            AI Engineer Intern at IISPPR. I build and ship production-grade full-stack products that scale. Selected in top 1.4% of 40,000+ applicants.
          </motion.p>
          <motion.a 
            href="#internships" 
            className="hero-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore My Universe <ArrowDown size={16} />
          </motion.a>
        </motion.div>
      </section>

      {/* SECTION 1: Internships (Left-aligned) */}
      <section id="internships" className="section align-left">
        <motion.div 
          className="glass-panel"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="section-title">Experience</h2>
          <p className="section-subtitle">orbiting the industry</p>

          <div className="timeline">
            {[
              {
                role: "AI Engineer Intern",
                company: "IISPPR",
                time: "May 2026 – Aug 2026 (Ongoing)",
                desc: "Building LLM-orchestrated automation pipelines in n8n. Developed a 3-agent academic-text generation pipeline (rewriting, verifier, and refinement agents) that preserves semantic meaning."
              },
              {
                role: "Software Engineer Intern",
                company: "Slayyers",
                time: "Jul 2025 – Dec 2025",
                desc: "Architected and shipped RESTful microservices for a 60-minute delivery platform (checkout flow, order tracking, and routing). Implemented Redis caching that cut API latency by over 40%."
              },
              {
                role: "Software Engineer Co-op Intern",
                company: "AlgoUniversity (YC-backed)",
                time: "May 2025 – Jul 2025",
                desc: "Selected from 40,000+ applicants (top 1.4%). Solo-built and shipped a sandboxed C++/Python online judge execution engine with hard TLE/MLE/CE detection serving 150+ students."
              }
            ].map((job, idx) => (
              <motion.div 
                className="timeline-item" 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
              >
                <span className="timeline-dot"></span>
                <div className="timeline-content">
                  <h3 className="card-title">
                    {job.role} at <span className="highlight">{job.company}</span>
                  </h3>
                  <p className="card-meta">{job.time}</p>
                  <p className="card-desc">{job.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: Projects (Right-aligned) */}
      <section id="projects" className="section align-right">
        <motion.div 
          className="glass-panel"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">born from nebulae of curiosity</p>

          <div className="grid-2">
            {[
              {
                title: "PlaceIQ",
                tags: ["React", "Node.js", "FastAPI", "MongoDB", "OpenRouter API", "Docker"],
                desc: "Multi-tenant placement platform with 4-tier hierarchical RBAC across 10 indexed MongoDB schemas and 65 REST endpoints. Deployed with a hybrid ATS resume-scoring pipeline (combining keyword matching with OpenRouter AI review), FastAPI scraper, Twilio alerts, and Docker CI/CD.",
                link: "https://place-iq-six.vercel.app",
                github: "https://github.com/Umesh-chandra-2006/PlaceIQ"
              },
              {
                title: "Code Slayer",
                tags: ["AWS EC2/ECR", "React", "Node.js", "Docker", "MongoDB", "Gemini API"],
                desc: "Full-stack online judge that served 150+ users with 500+ submissions in its first month. Features a sandboxed C++/Python execution engine with hard limit detection (1,000ms timeout, 256MB RAM), a 3-scenario Gemini AI code reviewer, and JWT + RBAC authorization.",
                link: "https://codeslayer.me",
                github: "https://github.com/Umesh-chandra-2006/Code_Slayer"
              }
            ].map((project, idx) => (
              <motion.div 
                className="card"
                key={idx}
                whileHover={{ 
                  y: -5, 
                  borderColor: "rgba(0, 212, 255, 0.3)", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)" 
                }}
                transition={cardSpring}
              >
                <h3 className="card-title">{project.title}</h3>
                <div className="card-tags">
                  {project.tags.map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                </div>
                <p className="card-desc" style={{ marginBottom: "1.5rem" }}>{project.desc}</p>
                <div className="project-links">
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      Live <Globe size={12} style={{ marginLeft: "2px" }} />
                    </a>
                  )}
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    GitHub <Github size={12} style={{ marginLeft: "2px" }} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 3: Skills (Left-aligned) */}
      <section id="skills" className="section align-left">
        <motion.div 
          className="glass-panel"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="section-title">Skills</h2>
          <p className="section-subtitle">focused energy</p>

          <div className="skills-container">
            {[
              {
                cat: "Languages",
                items: [
                  { name: "C++", icon: <Code size={14} /> },
                  { name: "Python", icon: <Code size={14} /> },
                  { name: "JavaScript", icon: <Globe size={14} /> },
                  { name: "Java", icon: <Cpu size={14} /> },
                  { name: "C", icon: <Terminal size={14} /> }
                ]
              },
              {
                cat: "AI / Agents",
                items: [
                  { name: "LangGraph", icon: <Cpu size={14} /> },
                  { name: "n8n", icon: <Layers size={14} /> },
                  { name: "Multi-agent Pipelines", icon: <Activity size={14} /> },
                  { name: "Gemini API", icon: <Cpu size={14} /> },
                  { name: "Claude API", icon: <Cpu size={14} /> },
                  { name: "OpenRouter API", icon: <Globe size={14} /> }
                ]
              },
              {
                cat: "Backend & Infrastructure",
                items: [
                  { name: "Node.js", icon: <Terminal size={14} /> },
                  { name: "Express.js", icon: <Terminal size={14} /> },
                  { name: "FastAPI", icon: <Cpu size={14} /> },
                  { name: "REST APIs", icon: <Layers size={14} /> },
                  { name: "Docker", icon: <Shield size={14} /> },
                  { name: "AWS (EC2, ECR, S3)", icon: <Globe size={14} /> },
                  { name: "Kubernetes (GKE)", icon: <Layers size={14} /> },
                  { name: "MongoDB", icon: <Layers size={14} /> },
                  { name: "Redis", icon: <Activity size={14} /> },
                  { name: "PostgreSQL", icon: <Layers size={14} /> }
                ]
              },
              {
                cat: "Frontend & Integrations",
                items: [
                  { name: "React", icon: <Globe size={14} /> },
                  { name: "Tailwind CSS", icon: <Layers size={14} /> },
                  { name: "React Native", icon: <Globe size={14} /> },
                  { name: "Zustand", icon: <Activity size={14} /> },
                  { name: "Three.js", icon: <Globe size={14} /> },
                  { name: "FFmpeg", icon: <Terminal size={14} /> }
                ]
              }
            ].map((group, gIdx) => (
              <div className="skill-cat" key={gIdx}>
                <h3 className="skill-cat-title">{group.cat}</h3>
                <div className="skills-grid">
                  {group.items.map((skill, sIdx) => (
                    <motion.span 
                      className="skill-tag" 
                      key={sIdx}
                      whileHover={{ 
                        scale: 1.05, 
                        borderColor: "rgba(0, 212, 255, 0.4)", 
                        color: "#00d4ff",
                        backgroundColor: "rgba(0, 212, 255, 0.05)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      {skill.icon}
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 4: Certifications (Right-aligned) */}
      <section id="certifications" className="section align-right">
        <motion.div 
          className="glass-panel"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="section-title">Credentials</h2>
          <p className="section-subtitle">verified signals</p>

          <div className="grid-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            {[
              { 
                title: "AlgoUniversity Accelerator", 
                issuer: "Accelerator: Top 1.4% of 40,000", 
                detail: "Focused on production DSA and systems curriculum with mentorship from engineers at Google and Apple." 
              },
              { 
                title: "Google Agentathon", 
                issuer: "Guinness World Record Event", 
                detail: "Developed MarketPulse-X (a 6-agent supply chain intelligence pipeline on Kubernetes) with 15k+ participants." 
              },
              { 
                title: "Google Cloud Skill Badges", 
                issuer: "25 Skill Badges", 
                detail: "Verified badges including Gemini Application Development, Multimodal RAG, and MLOps for Generative AI." 
              },
              { 
                title: "MERN Stack Training", 
                issuer: "Suntek (Institution-wide)", 
                detail: "Selected among 150 students across all branches institution-wide for an industry-led full-stack development program." 
              }
            ].map((cert, idx) => (
              <motion.div 
                className="card gold-pulse" 
                key={idx}
                whileHover={{ 
                  y: -5, 
                  borderColor: "rgba(251, 191, 36, 0.4)",
                  backgroundColor: "rgba(251, 191, 36, 0.02)"
                }}
                transition={cardSpring}
              >
                <Award size={20} className="highlight" style={{ marginBottom: "1rem" }} />
                <h3 className="card-title" style={{ fontSize: "1.05rem" }}>{cert.title}</h3>
                <p className="card-meta" style={{ color: "var(--color-gold)", fontSize: "0.75rem" }}>{cert.issuer}</p>
                <p className="card-desc" style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>{cert.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 5: Contact (Center) */}
      <section id="contact" className="section align-center">
        <motion.div 
          className="glass-panel"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="section-title">Contact</h2>
          <p className="section-subtitle">let's connect across the cosmos</p>

          <div className="contact-grid">
            {[
              { label: "GitHub", href: "https://github.com/Umesh-chandra-2006", icon: <Github /> },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/tirumani-umesh-chandra-b3b5b8314/", icon: <Linkedin /> },
              { label: "Email", href: "mailto:thirumaniumeshchandra2006@gmail.com", icon: <Mail /> }
            ].map((link, idx) => (
              <motion.a 
                href={link.href} 
                className="contact-button" 
                key={idx}
                target={link.href.startsWith("mailto:") ? "_self" : "_blank"}
                rel="noopener noreferrer"
                whileHover={{ 
                  y: -3, 
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  backgroundColor: "rgba(255, 255, 255, 0.04)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={cardSpring}
              >
                {link.icon}
                <span>{link.label}</span>
              </motion.a>
            ))}
          </div>

          <p className="footer-text">
            © 2026 Umesh Chandra. Hyderabad, India · Open to opportunities.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
