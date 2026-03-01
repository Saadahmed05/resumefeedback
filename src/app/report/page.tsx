"use client";

import { useSearchParams } from "next/navigation";

export default function ReportPage() {
  const searchParams = useSearchParams();
  const data = searchParams.get("result");

  if (!data) {
    return <div className="p-8">No report data found.</div>;
  }

  const report = JSON.parse(decodeURIComponent(data));

  const getColor = () => {
    if (report.match_level === "High") return "text-green-600";
    if (report.match_level === "Medium") return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">
        Internship Resume Benchmark Report
      </h1>

      {/* Match Level */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Match Level</h2>
        <p className={`text-2xl font-bold ${getColor()}`}>
          {report.match_level}
        </p>
      </div>

 {/* Likely Screening Blockers */}
<div className="mb-6">
  <h2 className="text-xl font-semibold mb-2">
    Likely Screening Blockers
  </h2>

  {report.likely_rejection_factors.length === 0 ? (
    <p className="text-green-600">
      No major screening blockers detected. Resume shows strong shortlisting signals.
    </p>
  ) : (
    <ul className="list-disc pl-6 text-red-700">
      {report.likely_rejection_factors.map((item: string, i: number) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )}
</div>

      {/* Strengths */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Strengths</h2>
        <ul className="list-disc pl-6 text-green-700">
          {report.strengths.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Gaps */}
<div className="mb-6">
  <h2 className="text-xl font-semibold mb-2">Gaps</h2>

  {report.gaps.length === 0 ? (
    <p className="text-green-600">
      No significant gaps identified compared to internship benchmark patterns.
    </p>
  ) : (
    <ul className="list-disc pl-6 text-red-700">
      {report.gaps.map((item: string, i: number) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )}
</div>

{/* Action Plan */}
<div className="mb-6">
  <h2 className="text-xl font-semibold mb-2">Action Plan</h2>

  {report.improvements.length === 0 ? (
    <p className="text-green-600">
      Your resume already aligns well with common internship shortlisting patterns. 
      Focus on tailoring it per company and role.
    </p>
  ) : (
    <ul className="list-disc pl-6">
      {report.improvements.map((item: string, i: number) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )}
</div>

      {/* Improved Bullet */}
      <div className="mb-8 p-4 bg-white border rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">
          Example Resume Upgrade
        </h2>
        <p>{report.improved_bullet_example}</p>
      </div>

      {/* Credibility Statement */}
      <p className="text-sm text-gray-500 mt-10">
        Based on common internship screening patterns observed across SWE internship resumes.
      </p>
    </div>
  );
}