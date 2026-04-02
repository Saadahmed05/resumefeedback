export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = (body.text || "").toLowerCase();

    if (!text.trim()) {
      return NextResponse.json(
        { error: "No resume text provided" },
        { status: 400 }
      );
    }

    // -------- SIGNALS --------
    const internships = text.includes("intern");
    const github_present = text.includes("github");

    const metrics_present =
      /\d+%|\d+\+|\d+ users/.test(text);

    const production_projects =
      text.includes("deploy") ||
      text.includes("production") ||
      text.includes("live");

    const oss_present =
      text.includes("open source") ||
      text.includes("contributed") ||
      text.includes("pull request");

    const tech_keywords = [
      "python","java","c++","javascript","react",
      "node","aws","docker","mongodb","postgres"
    ];

    const tech_stack = tech_keywords.filter((t) =>
      text.includes(t)
    );

    const tech_stack_count = tech_stack.length;

    // -------- SCORE --------
    let score = 30;

    if (internships) score += 20;
    else if (oss_present) score += 15;

    if (github_present) score += 10;
    if (metrics_present) score += 12;
    if (production_projects) score += 10;

    if (tech_stack_count >= 6) score += 18;
    else if (tech_stack_count >= 4) score += 12;
    else if (tech_stack_count >= 2) score += 6;

    // penalties
    if (!metrics_present) score -= 5;
    if (!production_projects) score -= 5;

    if (score > 92) score = 92;
    if (score < 35) score = 35;

    // -------- OUTPUT --------
    const strengths: string[] = [];
    const gaps: string[] = [];
    const improvements: string[] = [];

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

    if (!internships && !oss_present) {
      gaps.push("No real-world experience (internship or OSS)");
      improvements.push("Add internships or OSS contributions");
    }

    if (!metrics_present) {
      gaps.push("Projects lack measurable impact");
      improvements.push("Add numbers (%, users, performance)");
    }

    if (!production_projects) {
      gaps.push("Projects are not deployed");
      improvements.push("Deploy projects and add live links");
    }

    if (tech_stack_count < 4) {
      gaps.push("Tech stack below strong SWE level");
      improvements.push("Add backend, cloud, databases");
    }

    let summary = "";

    if (score >= 85) {
      summary = "Strong SWE resume. Very close to top-tier candidates.";
    } else if (score >= 70) {
      summary = "Good resume but missing key signals.";
    } else {
      summary = "Resume needs improvement for screening.";
    }

    return NextResponse.json({
      score,
      summary,
      strengths,
      gaps,
      improvements
    });

  } catch (err) {
    console.error("ERROR:", err);

    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}