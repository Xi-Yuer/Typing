"use client"
import React, { useEffect, useRef, useState } from "react";
import "./SentenceInput.css"; // 样式可以参考 tailwind 或自定义

interface WordData {
  text: string;
  isFill: boolean; // 是否需要填写
  userInput?: string;
  correct?: boolean;
}

const initialWords: WordData[] = [
  { text: "I", isFill: true },
  { text: "like", isFill: true },
  { text: "this", isFill: true },
  { text: "food", isFill: true },
];

export default function SentenceInput() {
  const [words, setWords] = useState(initialWords);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInputValue(val);

    setWords((prev) =>
      prev.map((w, i) =>
        i === activeIndex ? { ...w, userInput: val } : w
      )
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      checkAnswer();
    }
  }

  function checkAnswer() {
    setWords((prev) =>
      prev.map((w) =>
        w.isFill
          ? { ...w, correct: w.userInput?.trim().toLowerCase() === w.text.toLowerCase() }
          : w
      )
    );

    // 自动跳到下一个需要填写的
    let next = activeIndex + 1;
    while (next < words.length && !words[next].isFill) next++;
    if (next < words.length) {
      setActiveIndex(next);
      setInputValue(words[next].userInput || "");
    }
  }

  return (
    <div className="sentence-container" onClick={() => inputRef.current?.focus()}>
      <div className="words-wrapper">
        {words.map((w, i) =>
          w.isFill ? (
            <div
              key={i}
              className={`word-box ${
                i === activeIndex ? "active" : ""
              } ${w.correct === false ? "error" : ""} ${
                w.correct ? "correct" : ""
              }`}
              style={{ minWidth: "4ch" }}
              onClick={() => {
                setActiveIndex(i);
                setInputValue(w.userInput || "");
              }}
            >
              {w.userInput || ""}
            </div>
          ) : (
            <div key={i} className="word-static">
              {w.text}
            </div>
          )
        )}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="hidden-input"
        />
      </div>
    </div>
  );
}