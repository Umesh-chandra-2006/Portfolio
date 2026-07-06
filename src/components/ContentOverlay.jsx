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
  Twitter, 
  Award, 
  Briefcase, 
  Code, 
  ArrowDown 
} from 'lucide-react';

// Spring animation config for consistent, premium physics
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
          <motion.h1 
            className="hero-name"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            Umesh
          </motion.h1>
          <motion.p 
            className="hero-tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            AI Engineer &amp; Systems Thinker
          </motion.p>
          <motion.p 
            className="hero-desc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Building intelligent systems at the intersection of{" "}
            <span className="highlight">deep learning</span> and{" "}
            <span className="highlight">software engineering</span>.
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
          <h2 className="section-title">Internships</h2>
          <p className="section-subtitle">orbiting the industry</p>

          <div className="timeline">
            {[
              {
                role: "Machine Learning Intern",
                company: "Google",
                time: "Jun 2025 – Aug 2025",
                desc: "Developed transformer-based models for natural language understanding, improving inference latency by 40% through quantization and distillation techniques."
              },
              {
                role: "AI Research Intern",
                company: "DeepMind",
                time: "Jan 2025 – May 2025",
                desc: "Contributed to reinforcement learning research on multi-agent coordination, co-authoring a paper accepted at ICML 2025."
              },
              {
                role: "Data Science Intern",
                company: "Microsoft",
                time: "May 2024 – Aug 2024",
                desc: "Built end-to-end ML pipelines for predictive analytics on Azure, processing 50M+ daily events with sub-second latency."
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
                    {job.role} — <span className="highlight">{job.company}</span>
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
                title: "NeuralForge",
                tags: ["Python", "PyTorch", "CUDA"],
                desc: "A custom deep learning framework built from scratch, supporting automatic differentiation and GPU kernels."
              },
              {
                title: "Sentinel AI",
                tags: ["TensorFlow", "Vision", "Edge"],
                desc: "Real-time anomaly detection system for security cameras using lightweight CNNs optimized for edge deployment."
              },
              {
                title: "LinguaFlow",
                tags: ["NLP", "Transformers", "Rust"],
                desc: "High-performance NLP pipeline engine written in Rust with Python bindings, achieving 10x throughput increases."
              },
              {
                title: "Cosmos Sim",
                tags: ["WebGL", "Physics", "Three.js"],
                desc: "N-body gravitational simulation running in the browser with Barnes-Hut optimization, supporting 100K+ particles."
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
                <p className="card-desc">{project.desc}</p>
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
                  { name: "Python", icon: <Code size={14} /> },
                  { name: "Rust", icon: <Terminal size={14} /> },
                  { name: "C++", icon: <Cpu size={14} /> },
                  { name: "JavaScript", icon: <Globe size={14} /> },
                  { name: "TypeScript", icon: <Globe size={14} /> },
                  { name: "Go", icon: <Layers size={14} /> }
                ]
              },
              {
                cat: "ML / AI",
                items: [
                  { name: "PyTorch", icon: <Cpu size={14} /> },
                  { name: "TensorFlow", icon: <Cpu size={14} /> },
                  { name: "JAX", icon: <Activity size={14} /> },
                  { name: "Hugging Face", icon: <Layers size={14} /> },
                  { name: "ONNX", icon: <Layers size={14} /> },
                  { name: "LangChain", icon: <Layers size={14} /> }
                ]
              },
              {
                cat: "Infrastructure",
                items: [
                  { name: "Docker", icon: <Shield size={14} /> },
                  { name: "Kubernetes", icon: <Layers size={14} /> },
                  { name: "AWS", icon: <Globe size={14} /> },
                  { name: "GCP", icon: <Globe size={14} /> },
                  { name: "Azure", icon: <Globe size={14} /> },
                  { name: "Terraform", icon: <Terminal size={14} /> }
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
          <h2 className="section-title">Certifications</h2>
          <p className="section-subtitle">verified signals</p>

          <div className="grid-3">
            {[
              { title: "AWS Solutions Architect", issuer: "Professional", year: "2025" },
              { title: "TensorFlow Developer", issuer: "Google", year: "2024" },
              { title: "Deep Learning Spec", issuer: "deeplearning.ai", year: "2024" }
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
                <p className="card-meta">{cert.issuer} · {cert.year}</p>
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
              { label: "GitHub", href: "#", icon: <Code /> },
              { label: "LinkedIn", href: "#", icon: <Linkedin /> },
              { label: "Email", href: "mailto:umesh@example.com", icon: <Mail /> },
              { label: "Twitter / X", href: "#", icon: <Twitter /> }
            ].map((link, idx) => (
              <motion.a 
                href={link.href} 
                className="contact-button" 
                key={idx}
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
            © 2026 Umesh. Crafted with React, Framer Motion &amp; Three.js.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
