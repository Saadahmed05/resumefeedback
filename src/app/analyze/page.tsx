"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AnalyzePage() {

  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {

    if (!file) {
      alert("Please upload a resume");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    const parseResponse = await fetch("/api/parse", {
      method: "POST",
      body: formData
    });

    const parsed = await parseResponse.json();

    if (!parseResponse.ok) {
      alert("Resume parsing failed");
      setLoading(false);
      return;
    }

    const compareResponse = await fetch("/api/compare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(parsed)
    });

    const result = await compareResponse.json();

    const encoded = encodeURIComponent(JSON.stringify(result));

    router.push(`/report?result=${encoded}`);

    setLoading(false);
  };

  return (

    <div className="min-h-screen flex flex-col items-center justify-center gap-6">

      <h1 className="text-3xl font-bold">
        Resume Analyzer
      </h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
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