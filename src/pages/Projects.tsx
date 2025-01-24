import { Layout } from '../components/Layout';
import { TerminalText } from '../components/TerminalText';
import { ProjectCard } from '../components/ProjectCard';

export default function Projects() {
  const content = [
    {
      text: "Welcome to my project showcase. Each card represents a piece of my journey in software development. Feel free to explore the live demos or dive into the code.",
      delay: 0
    }
  ];

  const projects = [
    {
      title: "Project Name",
      description: "Project description goes here. This should be a brief overview of what the project does and what technologies were used.",
      liveLink: "https://project-demo.com",
      githubLink: "https://github.com/rwparrish/project-repo",
      technologies: ["React", "TypeScript", "Node.js"]
    },
    // Add more projects as needed
  ];

  return (
    <Layout title="Projects">
      {/* Text Box Container */}
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
          {content.map((item, index) => (
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
        margin: '0 20px'
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
    </Layout>
  );
}
