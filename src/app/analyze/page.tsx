"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {

  const router = useRouter();
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {

    if (!resumeText.trim()) {
      alert("Please paste your resume text.");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: resumeText
        })
      });

      const result = await response.json();

      const encoded = encodeURIComponent(JSON.stringify(result));

      router.push(`/report?result=${encoded}`);

    } catch (error) {

      alert("Analysis failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex flex-col items-center justify-center p-10 gap-6">

      <h1 className="text-3xl font-bold">
        Resume Analyzer
      </h1>

      <p className="text-gray-500">
        Paste your resume text below
      </p>

      <textarea
        className="w-full max-w-3xl h-80 border p-4 rounded"
        placeholder="Paste your entire resume here..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />

      <button
        onClick={analyzeResume}
        className="bg-black text-white px-6 py-3 rounded"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

    </div>

  );

}