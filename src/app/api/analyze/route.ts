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
    // DETECTION
    // ======================

    const internships =
      text.includes("intern") ||
      text.includes("internship")
      text.includes("EXPERIENCE");
      text.includes("experience");
      text.includes("Experience");
      text.includes("Intern");

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
      "react","node","express","mongodb","sql",
      "aws","docker","kubernetes","python","java","typescript"
    ];

    let tech_stack_count = 0;
    tech_keywords.forEach((tech) => {
      if (text.includes(tech)) tech_stack_count++;
    });

    // ======================
    // STRICT SCORING
    // ======================

    let score = 20; // 🔥 lower base

    // Experience
    if (internships) score += 18;
    else if (oss_present) score += 12;

    // Core signals
    if (github_present) score += 8;
    if (metrics_present) score += 12;
    if (production_projects) score += 10;

    // Tech depth
    if (tech_stack_count >= 6) score += 15;
    else if (tech_stack_count >= 4) score += 10;
    else if (tech_stack_count >= 2) score += 5;

    // Penalties (IMPORTANT)
    if (!metrics_present) score -= 5;
    if (!production_projects) score -= 5;

    // Clamp realistic range
    if (score > 88) score = 88;
    if (score < 30) score = 30;

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

    if (!internships && !oss_present) {
      gaps.push("No real-world experience detected");
      improvements.push(
        "Add internship or open-source work → +15% score boost"
      );
      scoreBoost += 15;
    }

    if (!metrics_present) {
      gaps.push("No measurable impact in projects");
      improvements.push(
        "Add metrics (%, users, performance gains) → +10% boost"
      );
      scoreBoost += 10;
    }

    if (!production_projects) {
      gaps.push("Projects are not deployed");
      improvements.push(
        "Deploy projects (Vercel, AWS) → +10% boost"
      );
      scoreBoost += 10;
    }

    if (tech_stack_count < 4) {
      gaps.push("Tech stack is below strong SWE level");
      improvements.push(
        "Add backend + cloud + DB skills → +12% boost"
      );
      scoreBoost += 12;
    }

    // ======================
    // SUMMARY (MORE REALISTIC)
    // ======================

    let summary = "";

    if (score >= 80) {
      summary =
        "Strong resume. You’re close to top-tier SWE candidates.";
    } else if (score >= 65) {
      summary =
        "Decent resume, but missing key signals recruiters expect.";
    } else if (score >= 50) {
      summary =
        "Average resume. Needs improvements to pass screening.";
    } else {
      summary =
        "Weak resume. Likely to get filtered out in early stages.";
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