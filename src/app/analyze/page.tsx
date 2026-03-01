"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const router = useRouter();
  const [resumeText, setResumeText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmed = resumeText.trim();
    if (!trimmed) {
      setError("Please paste resume text before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const parseResponse = await fetch("/api/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeText: trimmed }),
      });

      if (!parseResponse.ok) {
        const data = await parseResponse.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to parse resume");
      }

      const parseJson = await parseResponse.json();

      const compareResponse = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parseJson),
      });

      if (!compareResponse.ok) {
        const data = await compareResponse.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to compare resume");
      }

      const compareJson = await compareResponse.json();
      const encoded = encodeURIComponent(JSON.stringify(compareJson));

      router.push(`/report?result=${encoded}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unexpected error occurred";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Analyze Resume</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium">
          Resume text
          <textarea
            className="mt-1 block w-full min-h-[240px] rounded-md border border-gray-300 bg-white p-3 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            rows={15}
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            placeholder="Paste your resume here..."
          />
        </label>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-60"
        >
          {isSubmitting ? "Analyzing..." : "Analyze resume"}
        </button>
      </form>
    </div>
  );
}
