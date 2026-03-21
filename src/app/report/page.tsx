"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!file) {
      alert("Please upload a PDF");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (result.error) {
      alert(result.error);
      setLoading(false);
      return;
    }

    const encoded = encodeURIComponent(JSON.stringify(result));
    router.push(`/report?data=${encoded}`);

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-10">
      <h1 className="text-3xl font-bold">Resume Analyzer</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
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