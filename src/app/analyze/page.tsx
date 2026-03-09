"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  const analyzeResume = async () => {
    if (!file) {
      setError("Please upload a resume.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      // Parse resume
      const parseResponse = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      const parsed = await parseResponse.json();

      // Compare resume
      const compareResponse = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed),
      });

      const report = await compareResponse.json();

      // IMPORTANT: send result to report page
      const encoded = encodeURIComponent(JSON.stringify(report));

      router.push(`/report?result=${encoded}`);

    } catch (err) {
      setError("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">

      <h1 className="text-3xl font-bold mb-6">
        Analyze Your SWE Internship Resume
      </h1>

      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={analyzeResume}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {error && (
        <p className="text-red-600 mt-4">{error}</p>
      )}

    </div>
  );
}