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

      // Step 1: Parse resume
      const parseResponse = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      if (!parseResponse.ok) {
        throw new Error("Failed to parse resume");
      }

      const parsedResult = await parseResponse.json();

      // Step 2: Compare resume signals
      const compareResponse = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedResult),
      });

      if (!compareResponse.ok) {
        throw new Error("Failed to analyze resume");
      }

      const report = await compareResponse.json();

      // Step 3: Redirect to report page
      router.push(`/report?result=${encodeURIComponent(JSON.stringify(report))}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">

      <h1 className="text-3xl font-bold mb-6">
        Analyze Your SWE Internship Resume
      </h1>

      <p className="text-gray-600 mb-6 text-center max-w-xl">
        Upload your resume and we will benchmark it against common SWE
        internship resume patterns.
      </p>

      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={analyzeResume}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {error && (
        <p className="text-red-600 mt-4">{error}</p>
      )}
    </div>
  );
}