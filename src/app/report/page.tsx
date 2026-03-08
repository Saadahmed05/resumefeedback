"use client";

import { useEffect, useState } from "react";

export default function ReportPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    try {
      const data = localStorage.getItem("reportData");

      if (data) {
        const parsed = JSON.parse(data);
        setReport(parsed);
      }
    } catch (err) {
      console.error("Report parse error:", err);
    }
  }, []);

  if (!report || typeof report !== "object") {
    return (
      <div className="p-8">
        No report data found. Please analyze your resume again.
      </div>
    );
  }

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

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Resume Score</h2>
        <p className="text-4xl font-bold">{report.score}/100</p>
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
          {report.strengths?.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Likely Screening Blockers</h2>

        {report.likely_rejection_factors?.length === 0 ? (
          <p className="text-green-600">
            No major screening blockers detected.
          </p>
        ) : (
          <ul className="list-disc pl-6 text-red-700">
            {report.likely_rejection_factors?.map(
              (item: string, i: number) => (
                <li key={i}>{item}</li>
              )
            )}
          </ul>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Gaps</h2>

        {report.gaps?.length === 0 ? (
          <p className="text-green-600">
            No significant gaps identified.
          </p>
        ) : (
          <ul className="list-disc pl-6 text-red-700">
            {report.gaps?.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Action Plan</h2>
        <ul className="list-disc pl-6">
          {report.improvements?.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8 p-4 bg-white border rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">
          Example Resume Upgrade
        </h2>
        <p>{report.improved_bullet_example}</p>
      </div>

      <p className="text-sm text-gray-500 mt-10">
        Based on common internship screening patterns observed across SWE internship resumes.
      </p>
    </div>
  );
}