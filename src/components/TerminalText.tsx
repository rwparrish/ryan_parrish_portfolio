import { useTypewriter } from '../hooks/useTypewriter';

interface TerminalTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  color?: string;
  isLink?: boolean;
  href?: string;
}

export function TerminalText({ text, speed = 50, delay = 0, className = '', color = '#00ff88', isLink, href }: TerminalTextProps) {
  const { displayedText } = useTypewriter(text, speed, delay);

  return isLink && href ? (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: color,
        textDecoration: 'none',
        borderBottom: `1px solid ${color}`,
      }}
    >
      {displayedText}
    </a>
  ) : (
    <div className={className} style={{ 
      fontFamily: '"Share Tech Mono", monospace',
      whiteSpace: 'pre-wrap',
      color: color
    }}>
      {displayedText}
    </div>
  );
}
