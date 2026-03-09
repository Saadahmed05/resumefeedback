"use client";

import { useSearchParams } from "next/navigation";

export default function ReportPage() {

  const searchParams = useSearchParams();
  const result = searchParams.get("result");

  if (!result) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-bold">
          No Report Data Found
        </h2>
        <p>Please analyze your resume again.</p>
      </div>
    );
  }

  const report = JSON.parse(decodeURIComponent(result));

  return (
    <div className="min-h-screen p-8">

      <h1 className="text-3xl font-bold mb-6">
        Internship Resume Benchmark Report
      </h1>

      <h2 className="text-xl font-semibold">
        Internship Readiness Score
      </h2>

      <p className="text-4xl font-bold text-blue-600 mb-4">
        {report.score} / 100
      </p>

      <p className="text-gray-600 mb-6">
        Top SWE internship resumes usually score <b>80+</b>.
      </p>

      <h3 className="text-xl font-semibold mt-6">Strengths</h3>
      <ul className="list-disc pl-6">
        {report.strengths?.map((s: string, i: number) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mt-6">
        Likely Screening Blockers
      </h3>
      <ul className="list-disc pl-6">
        {report.likely_rejection_factors?.map((s: string, i: number) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mt-6">Gaps</h3>
      <ul className="list-disc pl-6">
        {report.gaps?.map((s: string, i: number) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mt-6">Action Plan</h3>
      <ul className="list-disc pl-6">
        {report.improvements?.map((s: string, i: number) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

    </div>
  );
}