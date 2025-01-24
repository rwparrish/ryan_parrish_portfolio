interface ProjectCardProps {
  title: string;
  description: string;
  liveLink: string;
  githubLink: string;
  technologies: string[];
}

export function ProjectCard({ title, description, liveLink, githubLink, technologies }: ProjectCardProps) {
  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.5)',
      border: '1px solid #00ff88',
      borderRadius: '4px',
      padding: '20px',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 20px rgba(0, 255, 136, 0.3)'
      }
    }}>
      <h3 style={{
        color: '#00ff88',
        margin: '0 0 10px 0',
        fontFamily: '"Share Tech Mono", monospace'
      }}>{title}</h3>
      
      <p style={{
        color: '#fff',
        margin: '0 0 15px 0',
        flex: 1
      }}>{description}</p>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '15px'
      }}>
        {technologies.map((tech, index) => (
          <span key={index} style={{
            background: 'rgba(0, 255, 136, 0.1)',
            color: '#00ff88',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.8em'
          }}>
            {tech}
          </span>
        ))}
      </div>
      
      <div style={{
        display: 'flex',
        gap: '10px'
      }}>
        <a
          href={liveLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#00ff88',
            textDecoration: 'none',
            padding: '8px 12px',
            border: '1px solid #00ff88',
            borderRadius: '4px',
            fontSize: '0.9em',
            transition: 'background-color 0.2s',
            ':hover': {
              backgroundColor: 'rgba(0, 255, 136, 0.1)'
            }
          }}
        >
          Live Demo
        </a>
        <a
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#00ff88',
            textDecoration: 'none',
            padding: '8px 12px',
            border: '1px solid #00ff88',
            borderRadius: '4px',
            fontSize: '0.9em',
            transition: 'background-color 0.2s',
            ':hover': {
              backgroundColor: 'rgba(0, 255, 136, 0.1)'
            }
          }}
        >
          GitHub
        </a>
      </div>
    </div>
  );
} 