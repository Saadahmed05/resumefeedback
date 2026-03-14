import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const resume = await req.json();

    const strengths: string[] = [];
    const likely_rejection_factors: string[] = [];
    const gaps: string[] = [];
    const improvements: string[] = [];

    let score = 35; // base score

    // Internship
    if (resume.internships) {
      score += 20;
      strengths.push("Internship experience detected.");
    } else {
      likely_rejection_factors.push("No internship experience listed.");
      gaps.push("No internship history.");
      improvements.push(
        "Try internships, freelance work, or open-source contributions."
      );
    }

    // GitHub
    if (resume.github_present) {
      score += 10;
      strengths.push("GitHub portfolio detected.");
    } else {
      gaps.push("No GitHub portfolio detected.");
      improvements.push(
        "Add a GitHub profile with active projects."
      );
    }

    // Production projects
    if (resume.production_projects) {
      score += 10;
      strengths.push("Has production or deployed projects.");
    } else {
      gaps.push("Projects appear basic.");
      improvements.push(
        "Deploy projects and include live links."
      );
    }

    // Metrics
    if (resume.metrics_present) {
      score += 10;
      strengths.push("Projects include measurable impact.");
    } else {
      improvements.push(
        "Add measurable impact (users, performance improvement, etc)."
      );
    }

    // Tech stack
    if (resume.tech_stack && resume.tech_stack.length >= 5) {
      score += 10;
    } else if (resume.tech_stack && resume.tech_stack.length >= 3) {
      score += 5;
    } else {
      gaps.push("Limited tech stack detected.");
      improvements.push(
        "Expand tech stack with backend, databases, or cloud."
      );
    }

    // Experience bonus
    if (resume.experience_years && resume.experience_years >= 1) {
      score += 5;
    }

    // Cap score so 100 is rare
    if (score > 92) score = 92;

    // Match level
    let match_level = "Low";

    if (score >= 85) {
      match_level = "High";
    } else if (score >= 65) {
      match_level = "Medium";
    }

    const improved_bullet_example =
      "Deployed a full-stack application using AWS + Docker serving 500+ users.";

    return NextResponse.json({
      score,
      match_level,
      strengths,
      likely_rejection_factors,
      gaps,
      improvements,
      improved_bullet_example
    });

  } catch (error) {

    return NextResponse.json(
      {
        error: "Comparison failed"
      },
      { status: 500 }
    );

  }

}