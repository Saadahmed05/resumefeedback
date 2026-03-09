"use client";

import { useEffect, useState } from "react";

export default function ReportPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    try {
      const data = localStorage.getItem("reportData");

      if (!data) return;

      const parsed = JSON.parse(data);
      setReport(parsed);
    } catch (err) {
      console.error("Report parsing failed:", err);
    }
  }, []);

  if (!report || typeof report !== "object") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            No Report Data Found
          </h1>
          <p className="text-gray-600">
            Please analyze your resume again.
          </p>
        </div>
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
      <h1 className="text-3xl font-bold mb-8">
        Internship Resume Benchmark Report
      </h1>

      {/* SCORE */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold">
          Internship Readiness Score
        </h2>

        <p className="text-4xl font-bold text-blue-600">
          {report.score} / 100
        </p>

        <p className="text-gray-600 mt-2">
          Top SWE internship resumes usually score <b>80+</b>.
        </p>
      </div>

      {/* MATCH LEVEL */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Match Level</h2>

        <p className={`text-2xl font-bold ${getColor()}`}>
          {report.match_level}
        </p>
      </div>

      {/* STRENGTHS */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Strengths</h2>

        {report.strengths?.length === 0 ? (
          <p className="text-gray-600">
            No major strengths detected.
          </p>
        ) : (
          <ul className="list-disc pl-6 text-green-700">
            {report.strengths?.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      {/* SCREENING BLOCKERS */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Likely Screening Blockers
        </h2>

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

      {/* GAPS */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Gaps</h2>

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

      {/* ACTION PLAN */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Action Plan to Improve
        </h2>

        {report.improvements?.length === 0 ? (
          <p className="text-green-600">
            Your resume aligns well with common internship screening patterns.
          </p>
        ) : (
          <ul className="list-disc pl-6">
            {report.improvements?.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      {/* EXAMPLE IMPROVEMENT */}
      <div className="mb-8 p-4 bg-white border rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">
          Example Resume Upgrade
        </h2>

        <p>{report.improved_bullet_example}</p>
      </div>

      {/* CREDIBILITY TEXT */}
      <p className="text-sm text-gray-500 mt-12">
        Based on common internship screening patterns observed across
        SWE internship resumes.
      </p>
    </div>
  );
}