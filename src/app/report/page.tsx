"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ReportContent() {

  const params = useSearchParams();
  const data = params.get("result");

  if (!data) {
    return <div className="p-10">No Report Data Found</div>;
  }

  const report = JSON.parse(decodeURIComponent(data));

  const getColor = () => {
    if (report.match_level === "High") return "text-green-600";
    if (report.match_level === "Medium") return "text-yellow-600";
    return "text-red-600";
  };

  return (

    <div className="min-h-screen p-10">

      <h1 className="text-3xl font-bold mb-6">
        Resume Benchmark Report
      </h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Resume Score</h2>
        <p className="text-4xl font-bold text-blue-600">
          {report.score}/100
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Match Level</h2>
        <p className={`text-2xl font-bold ${getColor()}`}>
          {report.match_level}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Strengths</h2>
        <ul className="list-disc pl-6 text-green-700">
          {report.strengths.map((s: string, i: number) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Likely Screening Blockers</h2>
        <ul className="list-disc pl-6 text-red-700">
          {report.likely_rejection_factors.map((s: string, i: number) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Gaps</h2>
        <ul className="list-disc pl-6">
          {report.gaps.map((s: string, i: number) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Action Plan</h2>
        <ul className="list-disc pl-6">
          {report.improvements.map((s: string, i: number) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 p-4 border rounded">
        <h2 className="font-semibold mb-2">Example Resume Upgrade</h2>
        <p>{report.improved_bullet_example}</p>
      </div>

    </div>

  );
}

export default function ReportPage() {

  return (
    <Suspense fallback={<div className="p-10">Loading report...</div>}>
      <ReportContent />
    </Suspense>
  );

}