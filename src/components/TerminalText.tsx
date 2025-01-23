import { useTypewriter } from '../hooks/useTypewriter';

interface TerminalTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  color?: string;
}

export function TerminalText({ text, speed = 50, delay = 0, className = '', color }: TerminalTextProps) {
  const { displayedText } = useTypewriter(text, speed, delay);

  return (
    <div className={className} style={{ 
      fontFamily: '"Share Tech Mono", monospace',
      whiteSpace: 'pre-wrap',
      color: color
    }}>
      {displayedText}
    </div>
  );
}
