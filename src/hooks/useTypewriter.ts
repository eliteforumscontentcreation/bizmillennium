import { useState, useEffect } from "react";

export function useTypewriter(text: string, speed: number = 100, startDelay: number = 300) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);

    const startTimeout = setTimeout(() => {
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
    }, startDelay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, startDelay]);

  return { displayedText, isComplete };
}

// New hook for looping typewriter effect
export function useLoopingTypewriter(text: string, typingSpeed: number = 100, pauseDuration: number = 2000) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleTyping = () => {
      const fullText = text;
      
      if (!isDeleting && displayedText === fullText) {
        // Pause at the end before deleting
        timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
      } else if (isDeleting && displayedText === "") {
        // Start typing again
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        timeout = setTimeout(handleTyping, 500);
      } else {
        // Continue typing or deleting
        const shouldDelete = isDeleting;
        const newText = shouldDelete
          ? fullText.substring(0, displayedText.length - 1)
          : fullText.substring(0, displayedText.length + 1);
        
        setDisplayedText(newText);
        timeout = setTimeout(handleTyping, shouldDelete ? typingSpeed / 2 : typingSpeed);
      }
    };

    timeout = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, loopNum, text, typingSpeed, pauseDuration]);

  return displayedText;
}