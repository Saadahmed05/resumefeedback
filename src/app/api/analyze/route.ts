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
      text.includes("internship");

    const github_present = text.includes("github");

    const metrics_present =
      /\d+%|\d+\+|\d+ users|\d+x/.test(text);

    const production_projects =
      text.includes("deploy") ||
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
    // SCORING
    // ======================

    let score = 25;

    if (internships) score += 18;
    else if (oss_present) score += 12;

    if (github_present) score += 8;
    if (metrics_present) score += 12;
    if (production_projects) score += 10;

    if (tech_stack_count >= 6) score += 15;
    else if (tech_stack_count >= 4) score += 10;
    else if (tech_stack_count >= 2) score += 5;

    if (!metrics_present) score -= 5;
    if (!production_projects) score -= 5;

    if (score > 88) score = 88;
    if (score < 30) score = 30;

    // ======================
    // STRENGTHS
    // ======================

    const strengths: string[] = [];

    if (internships)
      strengths.push("You have real internship experience");

    if (oss_present)
      strengths.push("You have open-source contributions");

    if (github_present)
      strengths.push("You have a visible GitHub profile");

    if (metrics_present)
      strengths.push("Your projects show measurable impact");

    if (production_projects)
      strengths.push("You have deployed/live projects");

    if (tech_stack_count >= 4)
      strengths.push("Your tech stack is solid");

    // ======================
    // GAPS + IMPROVEMENTS
    // ======================

    const gaps: string[] = [];
    const improvements: string[] = [];
    let scoreBoost = 0;

    if (!internships && !oss_present) {
      gaps.push("No real-world experience (internship or open-source)");

      improvements.push(
        "Add at least 1 internship or open-source contribution → +15 points"
      );

      scoreBoost += 15;
    }

    if (!metrics_present) {
      gaps.push("Projects don’t show measurable results");

      improvements.push(
        "Add numbers (%, users, performance gains) → +10 points"
      );

      scoreBoost += 10;
    }

    if (!production_projects) {
      gaps.push("Projects are not deployed");

      improvements.push(
        "Deploy your projects (Vercel, AWS) → +10 points"
      );

      scoreBoost += 10;
    }

    if (tech_stack_count < 4) {
      gaps.push("Tech stack is not strong enough");

      improvements.push(
        "Add backend + database + cloud skills → +12 points"
      );

      scoreBoost += 12;
    }

    // 🔥 IMPORTANT FIX: even strong resumes get improvement
    if (gaps.length === 0) {
      gaps.push("No major weaknesses, but lacks standout differentiation");
    
      improvements.push(
        "Improve bullet points with stronger impact and clarity → +5 to +10 points"
      );
    
      improvements.push(
        "Add 1 standout project (SaaS / system design) → +8 to +12 points"
      );
    
      scoreBoost += 10;
    }

    // ======================
    // SUMMARY (FIXED)
    // ======================

    let summary = "";

    if (score >= 80) {
      summary =
        "Strong resume. You are close to top-tier candidates, but small improvements can push you higher.";
    } else if (score >= 65) {
      summary =
        "Good resume, but missing a few key signals recruiters look for.";
    } else if (score >= 50) {
      summary =
        "Average resume. Needs improvements to increase shortlist chances.";
    } else {
      summary =
        "Weak resume. Likely to be rejected in initial screening.";
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