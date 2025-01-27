import { useTypewriter } from '../hooks/useTypewriter';

interface TerminalTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  color?: string;
  isLink?: boolean;
  href?: string;
  onClick?: () => void;
}

export function TerminalText({ text, speed = 50, delay = 0, className = '', color = '#00ff88', isLink, onClick }: TerminalTextProps) {
  const { displayedText } = useTypewriter(text, speed, delay);

  return isLink ? (
    <span 
      onClick={onClick}
      style={{
        color: color,
        textDecoration: 'none',
        borderBottom: `1px solid ${color}`,
        cursor: 'pointer',
        display: 'inline',
        userSelect: 'none'
      }}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick?.()}
    >
      {displayedText}
    </span>
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
