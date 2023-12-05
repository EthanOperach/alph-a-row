import React from 'react'
import { useState, useEffect } from "react";
import "./App.css";

// regex for even/odd sequences
const pattern = /[acegikmoqsuwy_ ]+|[bdfhjlnprtvxz_ ]+/gi;

function App() {

  const [input, setInput] = useState("");
  const [longestStreak, setlongestStreak] = useState("");
  const [matchLength, setMatchLength] = useState(0);

  useEffect(() => {
    fetch("/alph-a-row", {
      method: "POST",
      body: JSON.stringify({}),
      headers: new Headers({
        "content-type": "application/json",
      }),
    }).then(async (res) => {
      const data = await res.json();
      console.log(data);
    });

    // finds longest streak with regex matching
    const matches = [...input.matchAll(pattern)].map(match => match[0]);
    if (matches.length > 0) {
      setlongestStreak(matches.reduce((a, b) => a.replace(/ /g, '').length >= b.replace(/ /g, '').length ? a : b));
      setMatchLength(longestStreak.replace(/ /g, '').length)
    }
    if (input.length === 0) {
      setlongestStreak("");
      setMatchLength(0);
    }

    const handleKeyPress = (key: KeyboardEvent) => {
      // regex for alphanumeric + special characters
      if (/^[a-z0-9!@#$&()\\-`.+,/'"_ ]$/i.test(key.key) && !key.ctrlKey && !key.altKey) {
        setInput(input + key.key);
      }
      if (key.key === "Backspace") {
        setInput(input.slice(0, -1));
      }
    }

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    }
  }, [input, longestStreak]);

  let firstInputSlice = input.substring(0, input.indexOf(longestStreak));
  let secondInputSlice = input.substring(input.indexOf(longestStreak) + longestStreak.length);

  // fixes awkward space underline
  if (longestStreak.endsWith(' ')) {
    setlongestStreak(longestStreak.slice(0, -1));
    secondInputSlice = ' ' + secondInputSlice;
  }

  return (
    <div>
      <div className="streakInput">
        <span>{firstInputSlice}</span>
        <span className="match">{longestStreak}</span>
        <span>{secondInputSlice}</span>
        <span className="cursor"><i></i></span>
      </div>
      <div className="streakResult"> Longest even or odd streak: {matchLength} </div>
    </div>
  );
}

export default App;
