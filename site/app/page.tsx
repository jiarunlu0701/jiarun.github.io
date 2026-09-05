'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUpRight, Pause, Play } from 'lucide-react';
import ParticleField from './particle-field';
import CopyEmail from './copy-email';
import { useHeroNavigation } from './use-hero-navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const experiences = [
  {
    company: 'Apple', team: 'Wireless Technologies & Ecosystems', location: 'Cupertino, CA', dates: 'MAY — AUG 2026',
    summary: 'Connecting devices. Across the entire stack.',
    description: 'Built wireless connectivity infrastructure spanning C++ radio daemons, Objective-C framework APIs, and SwiftUI clients across iOS, iPadOS, and watchOS.',
    metrics: [{ value: '19', label: 'XPC commands exposed' }, { value: '5', label: 'SwiftUI demo & debug clients' }],
    details: ['Developed per-peer link monitoring over an IEEE 802.15.4 Thread mesh, detecting disconnections and restoring state when peers rejoined.', 'Designed a 26-byte packet format for location, heart rate, node role, and signal strength, with length-based parsing for compatibility.', 'Presented live multi-device demonstrations to a Senior Director and was selected from five candidates to present to the organization’s Vice President.'],
    tags: ['C++', 'Objective-C', 'SwiftUI', 'Thread', 'XPC'],
  },
  {
    company: 'SAP', team: 'Digital School', location: 'Shanghai, China', dates: 'OCT 2023 — APR 2024',
    summary: 'Making AI useful. In everyday workflows.',
    description: 'Developed backend services and AI applications for SAP’s Digital School and Greater China teams, improving content workflows and customer support.',
    metrics: [{ value: '40+', label: 'Content creation hours saved / month' }, { value: '85%', label: 'Company-specific response accuracy' }],
    details: ['Architected a backend in a five-person team with Node.js, Express.js, and WebSocket, including bcrypt password hashing and role-based access control.', 'Built an LLM-powered newsletter application that saved more than 40 hours of manual content creation per month.', 'Created a self-hosted support agent using RAG, LangChain, and Llama2, achieving 85% response accuracy on company-specific questions.'],
    tags: ['Node.js', 'Express.js', 'WebSocket', 'LangChain', 'RAG'],
  },
  {
    company: 'NewsBreak', team: 'Scala & Presto SQL', location: 'Mountain View, CA', dates: 'JAN — JUL 2023',
    summary: 'Less manual work. More useful data.',
    description: 'Built Scala and Presto SQL workflows that automated reporting and improved data processing for business teams.',
    metrics: [{ value: '80%', label: 'Reduction in manual effort' }, { value: '58%', label: 'Improvement in processing efficiency' }],
    details: ['Automated Presto SQL table generation in a Scala backend, reducing manual effort by 80%.', 'Refined aggregation and filtering queries to improve database processing efficiency by 58%.', 'Worked with two business department managers on an interactive reporting template, saving approximately 20 hours of manual analysis per month.'],
    tags: ['Scala', 'Presto SQL', 'Data workflows', 'Reporting'],
  },
];

const skills = [
  { number: '01', title: 'Languages', items: ['Swift', 'Objective-C', 'C++', 'Python', 'Java', 'JavaScript', 'SQL', 'HTML5', 'CSS3', 'Bash'] },
  { number: '02', title: 'Apple ecosystem', items: ['SwiftUI', 'ThreadNetwork', 'CoreLocation', 'CoreMotion', 'HealthKit', 'MapKit', 'CloudKit', 'XPC'] },
  { number: '03', title: 'Wireless & systems', items: ['IEEE 802.15.4 / Thread mesh', 'Wireless protocol design', 'Packet design', 'RF link monitoring', 'Daemon programming', 'IPC', 'Concurrency', 'System design', 'Interoperability'] },
  { number: '04', title: 'Engineering & tools', items: ['OOP', 'Data structures', 'Algorithms', 'Design patterns', 'Xcode', 'Git', 'GitHub Actions', 'Docker', 'Linux', 'CI/CD'] },
];

export default function Home() {
  const [paused, setPaused] = useState(false);
  const navigateFromHero = useHeroNavigation(paused);
  return (
    <main id="top" onClick={navigateFromHero}>
      <a className="skip-link" href="#about">Skip to content</a>
      <header className="navigation">
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#education">Education</a>
          <a href="#skills">Skills</a>
        </nav>
        <a className="nav-contact" href="https://www.linkedin.com/in/jiarun-lu/" target="_blank" rel="noopener noreferrer">Let’s talk <ArrowUpRight size={16} /></a>
      </header>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-stage">
          <ParticleField paused={paused} />
          <div className="hero-copy">
            <h1 id="hero-title">Jiarun Lu</h1>
            <div className="hero-description"><p className="hero-line">Connecting ideas, devices, and people.</p><a className="hero-link" href="#about">A little about me <ArrowDown size={16} /></a></div>
          </div>
          <div className="hero-bottom">
            <div className="particle-controls"><span>Move to explore. Scroll to unfold.</span><button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play particle animation' : 'Pause particle animation'} aria-pressed={paused}>{paused ? <Play size={15} /> : <Pause size={15} />}</button></div>
            <a href="#about" className="scroll-link" aria-label="Scroll to about"><ArrowDown size={20} /></a>
          </div>
        </div>
      </section>
      <section id="about" className="about section-light" tabIndex={-1}>
        <div className="about-grid">
          <figure className="portrait"><img src="./jiarun-lu.jpg" alt="Jiarun Lu sitting outdoors in a sunlit forest" width="6140" height="4093" /><figcaption><span>Jiarun Lu</span><span>Beyond the screen. ↗</span></figcaption></figure>
          <div className="about-copy"><p className="eyebrow">HELLO, I’M JIARUN.</p><h2>A little about me.</h2><p>I’m a software engineer and computer science master’s student at the University of Southern California.</p><p>My work connects devices, software, and people—from wireless protocols and C++ daemons to SwiftUI interfaces, backend systems, and AI applications.</p><a className="text-link" href="https://www.linkedin.com/in/jiarun-lu/" target="_blank" rel="noopener noreferrer">Find me on LinkedIn <ArrowUpRight size={18} /></a></div>
        </div>
      </section>
      <section id="experience" className="experience section-light" tabIndex={-1}>
        <div className="section-intro"><h2>Experience</h2><span className="quiet-label">2023 — 2026</span></div>
        <Accordion className="experience-list" defaultValue={['Apple']} multiple>
          {experiences.map((experience) => (
            <AccordionItem className="experience-item" value={experience.company} key={experience.company}>
              <AccordionTrigger className="experience-trigger">
                <span className="company-column"><span className="company-name">{experience.company}</span><span className="company-location">{experience.location}</span></span>
                <span className="role-column"><span className="role-title">Software Engineer Intern</span><span className="team-name">{experience.team}</span></span>
                <span className="experience-date">{experience.dates}</span>
              </AccordionTrigger>
              <AccordionContent className="experience-details">
                <div className="experience-body"><div className="experience-story"><h3>{experience.summary}</h3><ul>{[experience.description, ...experience.details].map((detail) => <li key={detail}>{detail}</li>)}</ul><div className="tech-tags">{experience.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><div className="experience-metrics">{experience.metrics.map((metric) => <div className="metric" key={metric.value}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div></div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <section id="education" className="education section-light" tabIndex={-1}>
        <div className="section-intro"><h2>Education</h2></div>
        <div className="education-grid">
          <article className="education-card"><div className="school-top"><span className="school-abbreviation">USC</span><span className="degree-level">GRADUATE</span></div><div className="school-body"><p className="study-date">AUG 2024 — DEC 2026</p><h3>University of Southern California</h3><p className="degree-name">M.S. in Computer Science</p><p className="school-location">Los Angeles, CA</p></div><div className="school-footer"><span>Computer science</span><span>01</span></div></article>
          <article className="education-card"><div className="school-top"><span className="school-abbreviation">UCSB</span><span className="degree-level">UNDERGRADUATE</span></div><div className="school-body"><p className="study-date">SEP 2019 — DEC 2022</p><h3>University of California, Santa Barbara</h3><p className="degree-name">B.S. in Actuarial Science</p><p className="school-location">Santa Barbara, CA</p><p className="honors">Dean’s Honor List<br /><span>Fall 2020 · Winter 2021 · Spring 2021</span></p></div><div className="school-footer"><span>Mathematics & analytical thinking</span><span>02</span></div></article>
        </div>
      </section>
      <section id="skills" className="skills" tabIndex={-1}>
        <div className="section-intro"><h2>Skills</h2></div>
        <div className="skills-grid">{skills.map((skill) => <article className="skill-group" key={skill.number}><div className="skill-title"><span>{skill.number}</span><h3>{skill.title}</h3></div><ul>{skill.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div>
      </section>
      <footer className="footer">
        <div className="footer-top"><div><a className="contact-heading" href="https://www.linkedin.com/in/jiarun-lu/" target="_blank" rel="noopener noreferrer">Let’s connect.<ArrowUpRight strokeWidth={1} /></a></div><div className="contact-links"><CopyEmail /><a href="https://www.linkedin.com/in/jiarun-lu/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={17} /></a></div></div>
        <div className="footer-bottom"><span>© 2026 Jiarun Lu</span><span>Los Angeles, California</span><a href="#top">Back to top <ArrowUpRight size={14} /></a></div>
      </footer>
    </main>
  );
}
