"use client";

import { useState } from "react";

export default function Page() {
  const [text, setText] = useState("");

  const analyze = async () => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    alert(JSON.stringify(data));
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Resume Analyzer</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={analyze}>
        Analyze
      </button>
    </div>
  );
}