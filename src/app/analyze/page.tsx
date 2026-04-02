"use client";

import { useState } from "react";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [unlocked, setUnlocked] = useState(false);

  const analyze = async () => {
    if (!text.trim()) {
      alert("Paste your resume first");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setResult(data);
    setUnlocked(false); // reset lock

    setLoading(false);
  };

  const getColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">

      <h1 className="text-4xl font-bold mb-2">
        Resume Analyzer 🚀
      </h1>

      <p className="text-gray-500 mb-6">
        Fix your resume before recruiters reject it
      </p>

      <textarea
        placeholder="Paste your resume here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full max-w-2xl h-60 p-4 border rounded-lg shadow-sm"
      />

      <button
        onClick={analyze}
        className="mt-4 bg-black text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {result && (
        <div className="mt-8 w-full max-w-2xl bg-white p-6 rounded-lg shadow">

          {/* SCORE */}
          <h2 className="text-2xl font-bold">
            Score: {result.score}/100
          </h2>

          <div className="w-full bg-gray-200 h-4 rounded-full my-3">
            <div
              className={`${getColor(result.score)} h-4 rounded-full`}
              style={{ width: `${result.score}%` }}
            />
          </div>

          <p className="text-gray-600 mb-4">
            {result.summary}
          </p>

          <p className="text-sm text-gray-500 mb-4">
            ⚡ Improve your score by +{result.potential_increase} points
          </p>

          {/* STRENGTHS */}
          <div className="mb-4">
            <h3 className="font-semibold text-green-600">
              ✅ Strengths
            </h3>
            <ul className="list-disc ml-5 text-sm">
              {result.strengths.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* PAYWALL SECTION */}
          <div className="relative">

            {!unlocked && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center rounded-lg z-10">
                <p className="font-semibold mb-2">
                  🔒 Unlock detailed gaps & fixes
                </p>
                <button
                  onClick={() => setUnlocked(true)}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Unlock for ₹49
                </button>
              </div>
            )}

            {/* GAPS */}
            <div className="mb-4">
              <h3 className="font-semibold text-red-500">
                ⚠️ Gaps
              </h3>
              <ul className="list-disc ml-5 text-sm">
                {result.gaps.map((g: string, i: number) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>

            {/* IMPROVEMENTS */}
            <div>
              <h3 className="font-semibold text-blue-600">
                🚀 Improvements
              </h3>
              <ul className="list-disc ml-5 text-sm">
                {result.improvements.map((imp: string, i: number) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}