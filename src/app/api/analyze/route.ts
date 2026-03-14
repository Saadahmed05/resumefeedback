import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const text = body.text.toLowerCase().replace(/\s+/g, " ");

    // internship detection
    const internshipPatterns = [
      /intern/,
      /internship/,
      /software engineering intern/,
      /developer intern/,
      /summer intern/,
      /research intern/,
      /trainee/,
      /apprentice/
    ];

    const internships = internshipPatterns.some((pattern) =>
      pattern.test(text)
    );

    const github_present =
      text.includes("github.com") ||
      text.includes("github ");

    const production_projects =
      text.includes("deploy") ||
      text.includes("production") ||
      text.includes("live");

    const metrics_present =
      text.includes("%") ||
      text.includes("improved") ||
      text.includes("reduced");

    let score = 40;

    if (internships) score += 20;
    if (github_present) score += 15;
    if (production_projects) score += 15;
    if (metrics_present) score += 10;

    const match_level =
      score >= 80 ? "High"
      : score >= 60 ? "Medium"
      : "Low";

    const strengths: string[] = [];
    const gaps: string[] = [];
    const improvements: string[] = [];
    const blockers: string[] = [];

    if (internships)
      strengths.push("Internship experience detected");

    else {
      blockers.push("No internship experience listed");
      gaps.push("Internship experience missing");
      improvements.push("Try to secure an internship or open source contribution");
    }

    if (github_present)
      strengths.push("GitHub profile included");

    else
      improvements.push("Add your GitHub profile link");

    if (production_projects)
      strengths.push("Production or deployed projects detected");

    else
      improvements.push("Deploy at least one project");

    return NextResponse.json({
      score,
      match_level,
      strengths,
      likely_rejection_factors: blockers,
      gaps,
      improvements,
      improved_bullet_example:
        "Built and deployed a full-stack React + Node application used by 100+ users."
    });

  } catch (error) {

    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );

  }

}