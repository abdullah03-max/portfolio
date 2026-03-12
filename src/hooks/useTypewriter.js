import { useEffect, useState } from 'react';

function useTypewriter(words, speed = 75, hold = 1200) {
  const [displayText, setDisplayText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];
    const nextText = isDeleting
      ? currentWord.slice(0, Math.max(displayText.length - 1, 0))
      : currentWord.slice(0, displayText.length + 1);

    const timeout = setTimeout(
      () => {
        setDisplayText(nextText);

        if (!isDeleting && nextText === currentWord) {
          setTimeout(() => setIsDeleting(true), hold);
        }

        if (isDeleting && nextText.length === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => prev + 1);
        }
      },
      isDeleting ? speed / 2 : speed
    );

    return () => clearTimeout(timeout);
  }, [displayText, hold, isDeleting, speed, wordIndex, words]);

  return displayText;
}

export default useTypewriter;
