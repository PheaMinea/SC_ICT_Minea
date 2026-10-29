import React, { useState, useEffect } from "react";

// Safe Unicode & Khmer Grapheme Splitter
const getGraphemes = (str) => {
  if (!str) return [];
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    try {
      const segmenter = new Intl.Segmenter("km", { granularity: "grapheme" });
      return Array.from(segmenter.segment(str), (s) => s.segment);
    } catch {
      return Array.from(str);
    }
  }
  return Array.from(str);
};

const TypewriterText = ({
  words = [],
  typingSpeed = 70,
  deletingSpeed = 35,
  delayBetween = 2200,
  className = "",
  cursorClassName = "",
  highlightClassName = "animated-gradient-text font-bold",
  showCursor = true,
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const currentWord = words[wordIndex % words.length] || "";
    const graphemes = getGraphemes(currentWord);

    let timeout;

    if (!isDeleting && charIndex < graphemes.length) {
      // Typing next character
      timeout = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
    } else if (!isDeleting && charIndex >= graphemes.length) {
      // Completed word, pause before deleting
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, delayBetween);
    } else if (isDeleting && charIndex > 0) {
      // Deleting characters
      timeout = setTimeout(() => {
        setCharIndex((prev) => prev - 1);
      }, deletingSpeed);
    } else if (isDeleting && charIndex === 0) {
      // Move to next word
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, delayBetween]);

  const currentWord = words[wordIndex % words.length] || "";
  const graphemes = getGraphemes(currentWord);
  const displayedText = graphemes.slice(0, charIndex).join("");

  return (
    <span className={`inline-flex items-center flex-wrap ${className}`}>
      <span className={highlightClassName}>{displayedText}</span>
      {showCursor && (
        <span
          className={`typewriter-cursor ${cursorClassName}`}
          aria-hidden="true"
        />
      )}
    </span>
  );
};

export default TypewriterText;
