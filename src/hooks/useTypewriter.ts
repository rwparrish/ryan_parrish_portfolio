import { useState, useEffect, useCallback } from 'react';

export function useTypewriter(text: string, speed: number = 50, delay: number = 0) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const typeText = useCallback(() => {
    let currentIndex = 0;
    
    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(intervalId);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    const timeoutId = setTimeout(typeText, delay);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [text, delay, typeText]);

  return { displayedText, isComplete };
} 