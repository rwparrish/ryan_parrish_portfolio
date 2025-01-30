import './ProjectCard.css';


interface ProjectCardProps {
  title: string;
  description: string;
  liveLink?: string;
  githubLink: string;
  technologies: string[];
}

export const ProjectCard = ({ title, description, liveLink, githubLink, technologies }: ProjectCardProps) => {
  return (
    <div className="project-card">
      <div className="nebula-background" />
      <div className="stars" />
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="technologies">
        {technologies.map((tech, index) => (
          <span key={index} className="tech-tag">{tech}</span>
        ))}
      </div>
      <div className="project-links">
        {liveLink && (
          <a href={liveLink} target="_blank" rel="noopener noreferrer" className="project-link">
            Live Demo
          </a>
        )}
        <a href={githubLink} target="_blank" rel="noopener noreferrer" className="project-link">
          GitHub
        </a>
      </div>
    </div>
  );
};

export default ProjectCard; 