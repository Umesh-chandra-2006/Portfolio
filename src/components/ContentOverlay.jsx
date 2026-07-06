import React from 'react';

export default function ContentOverlay() {
  return (
    <div className="scroll-container">
      {/* SECTION 0: Hero (Center) */}
      <section id="hero" className="section align-center">
        <div className="glass-panel">
          <h1 className="hero-name">Umesh</h1>
          <p className="hero-tagline">AI Engineer &amp; Systems Thinker</p>
          <p className="hero-desc">
            Building intelligent systems at the intersection of{" "}
            <span className="highlight">deep learning</span> and{" "}
            <span className="highlight">software engineering</span>.
          </p>
          <a href="#internships" className="hero-cta">
            Explore My Universe ↓
          </a>
        </div>
      </section>

      {/* SECTION 1: Internships (Left-aligned) */}
      <section id="internships" className="section align-left">
        <div className="glass-panel">
          <h2 class="section-title">Internships</h2>
          <p className="section-subtitle">orbiting the industry</p>

          <div className="timeline">
            <div className="timeline-item">
              <span className="timeline-dot"></span>
              <div className="timeline-content">
                <h3 className="card-title">
                  Machine Learning Intern — <span className="highlight">Google</span>
                </h3>
                <p className="card-meta">Jun 2025 – Aug 2025</p>
                <p className="card-desc">
                  Developed transformer-based models for natural language understanding,
                  improving inference latency by 40% through quantization and distillation techniques.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <span className="timeline-dot"></span>
              <div className="timeline-content">
                <h3 className="card-title">
                  AI Research Intern — <span className="highlight">DeepMind</span>
                </h3>
                <p className="card-meta">Jan 2025 – May 2025</p>
                <p className="card-desc">
                  Contributed to reinforcement learning research on multi-agent coordination,
                  co-authoring a paper accepted at ICML 2025.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <span className="timeline-dot"></span>
              <div className="timeline-content">
                <h3 className="card-title">
                  Data Science Intern — <span className="highlight">Microsoft</span>
                </h3>
                <p className="card-meta">May 2024 – Aug 2024</p>
                <p className="card-desc">
                  Built end-to-end ML pipelines for predictive analytics on Azure,
                  processing 50M+ daily events with sub-second latency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Projects (Right-aligned) */}
      <section id="projects" className="section align-right">
        <div className="glass-panel">
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">born from nebulae of curiosity</p>

          <div className="grid-2">
            <div className="card">
              <h3 className="card-title">NeuralForge</h3>
              <div className="card-tags">
                <span className="tag">Python</span>
                <span className="tag">PyTorch</span>
                <span className="tag">CUDA</span>
              </div>
              <p className="card-desc">
                A custom deep learning framework built from scratch, supporting automatic
                differentiation, GPU kernels, and distributed training.
              </p>
            </div>

            <div className="card">
              <h3 className="card-title">Sentinel AI</h3>
              <div className="card-tags">
                <span className="tag">TensorFlow</span>
                <span className="tag">Vision</span>
                <span className="tag">Edge</span>
              </div>
              <p className="card-desc">
                Real-time anomaly detection system for security cameras using lightweight
                CNNs optimized for edge deployment on NVIDIA Jetson.
              </p>
            </div>

            <div className="card">
              <h3 className="card-title">LinguaFlow</h3>
              <div className="card-tags">
                <span className="tag">NLP</span>
                <span className="tag">Transformers</span>
                <span className="tag">Rust</span>
              </div>
              <p className="card-desc">
                High-performance NLP pipeline engine written in Rust with Python bindings,
                achieving 10x throughput over equivalent Python implementations.
              </p>
            </div>

            <div className="card">
              <h3 className="card-title">Cosmos Sim</h3>
              <div className="card-tags">
                <span className="tag">WebGL</span>
                <span className="tag">Physics</span>
                <span className="tag">Three.js</span>
              </div>
              <p className="card-desc">
                N-body gravitational simulation running in the browser with Barnes-Hut
                optimization, supporting 100K+ particles at 60fps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Skills (Left-aligned) */}
      <section id="skills" className="section align-left">
        <div className="glass-panel">
          <h2 className="section-title">Skills</h2>
          <p className="section-subtitle">focused energy</p>

          <div className="skills-container">
            <div className="skill-cat">
              <h3 className="skill-cat-title">Languages</h3>
              <div className="skills-grid">
                {["Python", "Rust", "C++", "JavaScript", "TypeScript", "Go"].map((skill) => (
                  <span className="skill-tag" key={skill}>{skill}</span>
                ))}
              </div>
            </div>

            <div className="skill-cat">
              <h3 className="skill-cat-title">ML / AI</h3>
              <div className="skills-grid">
                {["PyTorch", "TensorFlow", "JAX", "Hugging Face", "ONNX", "LangChain"].map((skill) => (
                  <span className="skill-tag" key={skill}>{skill}</span>
                ))}
              </div>
            </div>

            <div className="skill-cat">
              <h3 className="skill-cat-title">Infrastructure</h3>
              <div className="skills-grid">
                {["Docker", "Kubernetes", "AWS", "GCP", "Azure", "Terraform"].map((skill) => (
                  <span className="skill-tag" key={skill}>{skill}</span>
                ))}
              </div>
            </div>

            <div className="skill-cat">
              <h3 className="skill-cat-title">Data &amp; Others</h3>
              <div className="skills-grid">
                {["PostgreSQL", "Redis", "Kafka", "Spark", "Airflow", "Git", "Linux", "WebGL", "CUDA", "gRPC"].map((skill) => (
                  <span className="skill-tag" key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Certifications (Right-aligned) */}
      <section id="certifications" className="section align-right">
        <div className="glass-panel">
          <h2 className="section-title">Certifications</h2>
          <p className="section-subtitle">verified signals</p>

          <div className="grid-3">
            <div className="card gold-pulse">
              <h3 className="card-title">AWS Solutions Architect</h3>
              <p className="card-meta">Professional · 2025</p>
            </div>

            <div className="card gold-pulse">
              <h3 className="card-title">TensorFlow Developer</h3>
              <p className="card-meta">Google · 2024</p>
            </div>

            <div className="card gold-pulse">
              <h3 className="card-title">Deep Learning Spec</h3>
              <p className="card-meta">deeplearning.ai · 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Contact (Center) */}
      <section id="contact" className="section align-center">
        <div className="glass-panel">
          <h2 className="section-title">Contact</h2>
          <p className="section-subtitle">let's connect across the cosmos</p>

          <div className="contact-grid">
            <a href="#" className="contact-button" aria-label="GitHub">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              <span>GitHub</span>
            </a>

            <a href="#" className="contact-button" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>LinkedIn</span>
            </a>

            <a href="mailto:umesh@example.com" className="contact-button" aria-label="Email">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span>Email</span>
            </a>

            <a href="#" className="contact-button" aria-label="Twitter / X">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>Twitter / X</span>
            </a>
          </div>

          <p className="footer-text">
            © 2026 Umesh. Crafted with React, Three.js &amp; cosmic particles.
          </p>
        </div>
      </section>
    </div>
  );
}
