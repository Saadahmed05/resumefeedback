"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const router = useRouter();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!text.trim()) {
      alert("Paste your resume text");
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

      const result = await res.json();

      if (result.error) {
        alert(result.error);
        setLoading(false);
        return;
      }

      const encoded = encodeURIComponent(JSON.stringify(result));
      router.push(`/report?data=${encoded}`);

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-10">

      <h1 className="text-3xl font-bold">
        Resume Analyzer
      </h1>

      <textarea
        placeholder="Paste your resume text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full max-w-xl h-52 border p-3 rounded"
      />

      <button
        onClick={analyze}
        className="bg-black text-white px-6 py-3 rounded"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

    </div>
  );
}