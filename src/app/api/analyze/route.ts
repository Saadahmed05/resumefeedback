import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const rawText: string = body.text || "";

    const text = rawText.toLowerCase();

    // DEBUG (remove later)
    console.log("----- RESUME TEXT START -----");
    console.log(text);
    console.log("----- RESUME TEXT END -----");

    // internship detection (robust)
    const internshipPatterns = [
      /Intern/,
      /intern/,
      /internship/,
      /software engineering intern/,
      /developer intern/,
      /summer intern/,
      /research intern/,
      /ai developer intern/,
      /machine learning intern/,
      /swe intern/,
      /trainee/,
      /apprentice/
    ];

    const internships = internshipPatterns.some((pattern) =>
      pattern.test(text)
    );

    const github_present =
      text.includes("github.com") ||
      text.includes("github");

    const production_projects =
      text.includes("deploy") ||
      text.includes("deployed") ||
      text.includes("production") ||
      text.includes("live");

    const metrics_present =
      text.includes("%") ||
      text.includes("improved") ||
      text.includes("increased") ||
      text.includes("reduced") ||
      text.includes("users");

    const tech_keywords = [
      "react",
      "node",
      "python",
      "aws",
      "docker",
      "mongodb",
      "postgres",
      "next.js"
    ];

    let techCount = 0;

    tech_keywords.forEach((tech) => {
      if (text.includes(tech)) techCount++;
    });

    const strong_tech_stack = techCount >= 3;

    let score = 40;

    if (internships) score += 25;
    if (github_present) score += 15;
    if (production_projects) score += 10;
    if (metrics_present) score += 10;
    if (strong_tech_stack) score += 10;

    const match_level =
      score >= 80 ? "High"
      : score >= 60 ? "Medium"
      : "Low";

    const strengths: string[] = [];
    const blockers: string[] = [];
    const gaps: string[] = [];
    const improvements: string[] = [];

    if (internships)
      strengths.push("Internship experience detected.");
    else {
      blockers.push("No internship experience listed.");
      gaps.push("Internship experience missing.");
      improvements.push(
        "Try internships, freelance projects, or open source."
      );
    }

    if (github_present)
      strengths.push("GitHub portfolio detected.");
    else
      improvements.push("Add a GitHub profile to showcase projects.");

    if (production_projects)
      strengths.push("Has production or deployed projects.");

    if (metrics_present)
      strengths.push("Projects include measurable impact.");

    if (!strong_tech_stack) {
      gaps.push("Limited tech stack detected.");
      improvements.push(
        "Expand tech stack with backend, cloud, or databases."
      );
    }

    return NextResponse.json({
      score,
      match_level,
      strengths,
      likely_rejection_factors: blockers,
      gaps,
      improvements,
      improved_bullet_example:
        "Deployed a full-stack application using AWS + Docker serving 500+ users."
    });

  } catch (error) {

    console.error("Analyze error:", error);

    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );

  }

}