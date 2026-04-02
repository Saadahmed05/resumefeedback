export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = (body.text || "").toLowerCase();

    if (!text) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    // ======================
    // DETECTION LOGIC
    // ======================

    const internships =
      text.includes("intern") ||
      text.includes("internship");

    const github_present =
      text.includes("github");

    const metrics_present =
      /\d+%|\d+\+|\d+ users|\d+x/.test(text);

    const production_projects =
      text.includes("deploy") ||
      text.includes("production") ||
      text.includes("live");

    const oss_present =
      text.includes("open source") ||
      text.includes("contributed");

    const tech_keywords = [
      "react",
      "node",
      "express",
      "mongodb",
      "sql",
      "aws",
      "docker",
      "kubernetes",
      "python",
      "java",
      "typescript",
    ];

    let tech_stack_count = 0;
    tech_keywords.forEach((tech) => {
      if (text.includes(tech)) tech_stack_count++;
    });

    // ======================
    // SCORE CALCULATION
    // ======================

    let score = 40;

    if (internships) score += 20;
    if (oss_present) score += 15;
    if (github_present) score += 10;
    if (metrics_present) score += 10;
    if (production_projects) score += 10;

    if (tech_stack_count >= 4) score += 10;

    if (score > 95) score = 95;

    // ======================
    // STRENGTHS
    // ======================

    const strengths: string[] = [];

    if (internships)
      strengths.push("Internship experience detected");

    if (oss_present)
      strengths.push("Open-source contributions detected");

    if (github_present)
      strengths.push("GitHub portfolio detected");

    if (metrics_present)
      strengths.push("Projects include measurable impact");

    if (production_projects)
      strengths.push("Deployed projects detected");

    if (tech_stack_count >= 4)
      strengths.push("Strong technical stack");

    // ======================
    // GAPS + IMPROVEMENTS
    // ======================

    const gaps: string[] = [];
    const improvements: string[] = [];
    let scoreBoost = 0;

    // EXPERIENCE
    if (!internships && !oss_present) {
      gaps.push(
        "No real-world experience (internship or open-source) detected"
      );

      improvements.push(
        "Add internship or open-source experience → +15% score boost"
      );

      scoreBoost += 15;
    }

    // METRICS
    if (!metrics_present) {
      gaps.push("Projects lack measurable impact");

      improvements.push(
        "Add metrics (%, users, performance improvements) → +10% score boost"
      );

      scoreBoost += 10;
    }

    // DEPLOYMENT
    if (!production_projects) {
      gaps.push("Projects are not deployed/live");

      improvements.push(
        "Deploy projects (Vercel, AWS, etc.) → +10% score boost"
      );

      scoreBoost += 10;
    }

    // TECH STACK
    if (tech_stack_count < 4) {
      gaps.push("Tech stack is not strong enough");

      improvements.push(
        "Add backend + database + cloud skills → +12% score boost"
      );

      scoreBoost += 12;
    }

    // ======================
    // SUMMARY
    // ======================

    let summary = "";

    if (score >= 85) {
      summary =
        "Strong SWE resume. Very close to top-tier candidates.";
    } else if (score >= 70) {
      summary =
        "Good resume with solid fundamentals, but needs improvements to stand out.";
    } else if (score >= 50) {
      summary =
        "Average resume. Several key improvements needed for shortlisting.";
    } else {
      summary =
        "Weak resume. Significant improvements required to get shortlisted.";
    }

    // ======================
    // RESPONSE
    // ======================

    return NextResponse.json({
      score,
      summary,
      strengths,
      gaps,
      improvements,
      potential_increase: scoreBoost,
    });

  } catch (err: any) {
    console.error("ERROR:", err);

    return NextResponse.json(
      { error: err.message || "Analysis failed" },
      { status: 500 }
    );
  }
}