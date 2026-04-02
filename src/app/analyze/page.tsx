"use client";

import { useState } from "react";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    if (!text.trim()) {
      alert("Paste your resume first");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-2">
        Resume Analyzer 🚀
      </h1>

      <p className="text-gray-500 mb-6">
        Paste your resume and get instant feedback
      </p>

      {/* TEXTAREA */}
      <textarea
        placeholder="Paste your resume here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full max-w-2xl h-60 p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
      />

      {/* BUTTON */}
      <button
        onClick={analyze}
        className="mt-4 bg-black text-white px-6 py-3 rounded-lg hover:opacity-90"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {/* RESULT */}
      {result && (
        <div className="mt-8 w-full max-w-2xl bg-white p-6 rounded-lg shadow">

          <h2 className="text-2xl font-bold mb-2">
            Score: {result.score}/100
          </h2>

          <p className="text-gray-600 mb-4">
            {result.summary}
          </p>

          {/* STRENGTHS */}
          <div className="mb-4">
            <h3 className="font-semibold">✅ Strengths</h3>
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {result.strengths.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* GAPS */}
          <div className="mb-4">
            <h3 className="font-semibold">⚠️ Gaps</h3>
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {result.gaps.map((g: string, i: number) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </div>

          {/* IMPROVEMENTS */}
          <div>
            <h3 className="font-semibold">🚀 Improvements</h3>
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {result.improvements.map((imp: string, i: number) => (
                <li key={i}>{imp}</li>
              ))}
            </ul>
          </div>

        </div>
      )}

    </div>
  );
}