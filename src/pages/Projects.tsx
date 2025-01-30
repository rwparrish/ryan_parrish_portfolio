import { Layout } from '../components/Layout';
import { TerminalText } from '../components/TerminalText';
import { ProjectCard } from '../components/ProjectCard';

export default function Projects() {
  const introContent = [
    {
      text: "Welcome to my project showcase. Each card represents a piece of my journey in software development. Feel free to explore the live demos or dive into the code.",
      delay: 0
    }
  ];

  const outroContent = [
    {
      text: 'I hope you are enjoying your time here and like what you see. Be sure to return to "Project" moon in the future as new projects are consistently coming together here.',
      delay: 8000
    }
  ];

  const projects = [
    {
      title: "Comp Widget",
      description: "An interactive web application designed to help students learn about numerical comparisons through visual block manipulation and comparison.",
      liveLink: "https://rwparrish.github.io/comp_widget/",
      githubLink: "https://github.com/rwparrish/comp_widget",
      technologies: ["React", "JavaScript", "HTML", "CSS"]
    },
    {
      title: "Japan Honeymoon",
      description: "An interactive visualization of our 2-week honeymoon adventure across Japan (Nov 27 - Dec 12, 2024). This project documents our circular journey through seven unique locations, starting and ending in Tokyo.",
      liveLink: "https://japan-honeymoon.vercel.app/",
      githubLink: "https://github.com/rwparrish/japan-honeymoon",
      technologies: ["Next.js", "TypeScript", "Tailwind", "Mapbox", "Cloudinary", "Vercel"]
    },
    {
      title: "Noodle Doodles",
      description: "Noodle Doodles is a website I built for my daughter Zoë to showcase her artwork online, with the potential to sell her creations in the future. The platform features an About page to learn more about the artist, a Gallery section displaying her artwork, and a Contact section with a form to get in touch. Future enhancements include AI-generated artwork combinations and automated email notifications using smtplib.",
      githubLink: "https://github.com/rwparrish/zoes-artwork",
      technologies: ["React", "JavaScript", "Python, Flask, SQLAlchemy"]
    },
    {
      title: "rarcli",
      description: "A command-line interface application for managing and browsing video game reviews. This application allows users to browse games, manage reviews, and track their gaming experiences.",
      githubLink: "https://github.com/rwparrish/rarcli",
      technologies: ["Python"]
    },
  ];

  return (
    <Layout title="Projects">
      {/* Intro Text Box */}
      <div style={{
        maxWidth: '900px',
        width: '100%',
        padding: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '8px',
        border: '1px solid #00ff88',
        boxShadow: '0 0 20px rgba(0, 255, 136, 0.2)',
        margin: '0 20px 20px 20px'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {introContent.map((item, index) => (
            <TerminalText
              key={index}
              text={item.text}
              delay={item.delay}
              speed={30}
            />
          ))}
        </div>
      </div>

      {/* Project Cards Container */}
      <div style={{
        maxWidth: '900px',
        width: '100%',
        margin: '0 20px 60px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          width: '100%'
        }}>
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>

      {/* Outro Text Box */}
      <div style={{
        maxWidth: '900px',
        width: '100%',
        padding: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '8px',
        border: '1px solid #00ff88',
        boxShadow: '0 0 20px rgba(0, 255, 136, 0.2)',
        margin: '0 20px 20px 20px'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {outroContent.map((item, index) => (
            <TerminalText
              key={index}
              text={item.text}
              delay={item.delay}
              speed={30}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
