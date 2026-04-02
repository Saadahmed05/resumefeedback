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

  const getColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-2">
        Resume Analyzer 🚀
      </h1>

      <p className="text-gray-500 mb-6">
        Get instant feedback like a recruiter
      </p>

      {/* INPUT */}
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

          {/* SCORE */}
          <h2 className="text-2xl font-bold mb-2">
            Score: {result.score}/100
          </h2>

          {/* PROGRESS BAR */}
          <div className="w-full bg-gray-200 h-4 rounded-full mb-4">
            <div
              className={`${getColor(result.score)} h-4 rounded-full`}
              style={{ width: `${result.score}%` }}
            />
          </div>

          <p className="text-gray-600 mb-6">
            {result.summary}
          </p>

          {/* STRENGTHS */}
          <div className="mb-4">
            <h3 className="font-semibold text-green-600 mb-1">
              ✅ Strengths
            </h3>
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {result.strengths.length > 0 ? (
                result.strengths.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))
              ) : (
                <li>No strong signals detected</li>
              )}
            </ul>
          </div>

          {/* GAPS */}
          <div className="mb-4">
            <h3 className="font-semibold text-red-500 mb-1">
              ⚠️ Gaps
            </h3>
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {result.gaps.length > 0 ? (
                result.gaps.map((g: string, i: number) => (
                  <li key={i}>{g}</li>
                ))
              ) : (
                <li>No major gaps detected</li>
              )}
            </ul>
          </div>

          {/* IMPROVEMENTS */}
          <div>
            <h3 className="font-semibold text-blue-600 mb-1">
              🚀 Improvements
            </h3>
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {result.improvements.length > 0 ? (
                result.improvements.map((imp: string, i: number) => (
                  <li key={i}>{imp}</li>
                ))
              ) : (
                <li>Your resume is already strong</li>
              )}
            </ul>
          </div>

        </div>
      )}

    </div>
  );
}