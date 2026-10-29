import React, { useState, useEffect } from "react";

const CODE_SNIPPETS = [
  {
    fileName: "Developer.js",
    language: "javascript",
    code: [
      { text: "// 🎓 SC Academy - Digital Skills Training 2026", type: "comment" },
      { text: "const student = new Developer({", type: "code" },
      { text: '  academy: "SC Academy Cambodia",', type: "code" },
      { text: '  skills: ["Web Dev", "Design", "Network"],', type: "code" },
      { text: '  duration: "3-6 Months Hands-on Lab",', type: "code" },
      { text: '  goal: "Professional Job Ready"', type: "code" },
      { text: "});", type: "code" },
      { text: "", type: "empty" },
      { text: "await student.learnByDoing();", type: "action" },
      { text: 'console.log("🚀 Success: Future Built!");', type: "success" },
    ],
  },
  {
    fileName: "Website.jsx",
    language: "react",
    code: [
      { text: "// 💻 Real-World Web Development Course", type: "comment" },
      { text: "export default function DreamCareer() {", type: "code" },
      { text: '  const [skills, setSkills] = useState(["React", "API"]);', type: "code" },
      { text: "  return (", type: "code" },
      { text: '    <div className="sc-academy-graduate">', type: "code" },
      { text: "      <h1>Build Modern Web Applications</h1>", type: "code" },
      { text: '      <Badge status="100% Practical" />', type: "code" },
      { text: "    </div>", type: "code" },
      { text: "  );", type: "code" },
      { text: "}", type: "code" },
    ],
  },
];

const TerminalHero = ({ className = "" }) => {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const activeSnippet = CODE_SNIPPETS[snippetIndex];
  const allLines = activeSnippet.code;

  useEffect(() => {
    let timer;
    const currentLine = allLines[currentLineIndex];

    if (!currentLine) {
      // Completed entire snippet, wait 4 seconds then switch to next snippet
      timer = setTimeout(() => {
        setSnippetIndex((prev) => (prev + 1) % CODE_SNIPPETS.length);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
      }, 4000);
      return () => clearTimeout(timer);
    }

    if (currentCharIndex < currentLine.text.length) {
      // Typing current line character by character
      const speed = Math.floor(Math.random() * 20) + 25; // 25ms-45ms realistic typing speed
      timer = setTimeout(() => {
        setCurrentCharIndex((prev) => prev + 1);
      }, speed);
    } else {
      // Line finished, move to next line after brief pause
      timer = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, currentLine.type === "empty" ? 80 : 180);
    }

    return () => clearTimeout(timer);
  }, [currentLineIndex, currentCharIndex, snippetIndex, allLines]);

  // Syntax highlighter formatter with dark/light mode adaptive contrast
  const renderHighlightedLine = (text, type) => {
    if (type === "comment") {
      return <span className="text-slate-500 dark:text-slate-400 italic">{text}</span>;
    }
    if (type === "success") {
      return (
        <span>
          <span className="text-purple-600 dark:text-purple-400">console</span>
          <span className="text-slate-600 dark:text-slate-300">.</span>
          <span className="text-blue-600 dark:text-blue-400">log</span>
          <span className="text-amber-600 dark:text-amber-300">(</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{text.slice(12, -2)}</span>
          <span className="text-amber-600 dark:text-amber-300">)</span>
          <span className="text-slate-600 dark:text-slate-300">;</span>
        </span>
      );
    }

    // Basic regex-based live syntax colors
    const parts = text.split(/(\b(?:const|let|var|new|await|export|default|function|return|import|from)\b|"[^"]*"|'[^']*'|[{}[\](),;]|<[^>]*>)/g);

    return parts.map((part, i) => {
      if (!part) return null;
      if (/^(const|let|var|new|await|export|default|function|return|import|from)$/.test(part)) {
        return (
          <span key={i} className="text-purple-600 dark:text-purple-400 font-semibold">
            {part}
          </span>
        );
      }
      if (part.startsWith('"') || part.startsWith("'")) {
        return (
          <span key={i} className="text-emerald-600 dark:text-emerald-300 font-medium">
            {part}
          </span>
        );
      }
      if (/^[{}()[\];,]$/.test(part)) {
        return (
          <span key={i} className="text-amber-600 dark:text-amber-400 font-bold">
            {part}
          </span>
        );
      }
      if (part.startsWith("<") || part.startsWith("</")) {
        return (
          <span key={i} className="text-cyan-600 dark:text-cyan-400 font-medium">
            {part}
          </span>
        );
      }
      if (part.includes("student") || part.includes("skills") || part.includes("Developer")) {
        return (
          <span key={i} className="text-blue-600 dark:text-sky-300 font-semibold">
            {part}
          </span>
        );
      }
      return (
        <span key={i} className="text-slate-800 dark:text-slate-200">
          {part}
        </span>
      );
    });
  };

  return (
    <div
      className={`relative w-full max-w-2xl bg-transparent shadow-none text-left font-mono transition-all duration-300 ${className}`}
    >
      {/* Pure Live Typing Code */}
      <div className="py-2 px-0 text-xs sm:text-sm md:text-base leading-relaxed overflow-x-auto min-h-[220px] bg-transparent select-none">
        <div className="space-y-1.5">
          {allLines.map((line, idx) => {
            // Lines before the current active typing line (already typed completely)
            if (idx < currentLineIndex) {
              return (
                <div key={idx} className="flex items-start group bg-transparent">
                  <span className="w-6 sm:w-7 shrink-0 text-slate-500 text-right pr-3 select-none text-xs font-mono opacity-60">
                    {idx + 1}
                  </span>
                  <span className="flex-1 break-words drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    {renderHighlightedLine(line.text, line.type)}
                  </span>
                </div>
              );
            }

            // Currently typing line
            if (idx === currentLineIndex) {
              const typedText = line.text.slice(0, currentCharIndex);
              return (
                <div key={idx} className="flex items-start bg-transparent">
                  <span className="w-6 sm:w-7 shrink-0 text-sky-400 font-bold text-right pr-3 select-none text-xs font-mono">
                    {idx + 1}
                  </span>
                  <span className="flex-1 break-words drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    {renderHighlightedLine(typedText, line.type)}
                    {/* Live blinking cursor at active position */}
                    <span className="inline-block w-2 h-4 sm:h-5 bg-sky-400 ml-0.5 align-middle animate-pulse"></span>
                  </span>
                </div>
              );
            }

            // Lines not yet reached
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default TerminalHero;
