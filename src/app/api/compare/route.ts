import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const resume = await req.json();

    const strengths: string[] = [];
    const likely_rejection_factors: string[] = [];
    const gaps: string[] = [];
    const improvements: string[] = [];

    // Lower base score
    let score = 15;

    // Internship (most important)
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

    // GitHub portfolio
    if (resume.github_present) {
      score += 10;
      strengths.push("GitHub portfolio detected.");
    } else {
      gaps.push("No GitHub portfolio detected.");
      improvements.push("Add a GitHub profile with active projects.");
    }

    // Production projects
    if (resume.production_projects) {
      score += 10;
      strengths.push("Has production or deployed projects.");
    } else {
      gaps.push("Projects appear basic.");
      improvements.push("Deploy projects and include live links.");
    }

    // Metrics / measurable impact
    if (resume.metrics_present) {
      score += 10;
      strengths.push("Projects include measurable impact.");
    } else {
      improvements.push(
        "Add measurable impact (users, performance improvement, etc)."
      );
    }

    // Tech stack depth
    const techCount = resume.tech_stack ? resume.tech_stack.length : 0;

    if (techCount >= 5) {
      score += 10;
    } else if (techCount >= 3) {
      score += 5;
    } else {
      gaps.push("Limited tech stack detected.");
      improvements.push(
        "Expand tech stack with backend, databases, or cloud."
      );
    }

    // Project complexity
    if (resume.project_complexity === "advanced") {
      score += 10;
      strengths.push("Complex engineering projects detected.");
    } else {
      gaps.push("Projects appear basic.");
      improvements.push(
        "Build more complex systems like APIs or SaaS apps."
      );
    }

    // Experience bonus (very small)
    if (resume.experience_years >= 1) {
      score += 5;
    }

    // Hard cap
    if (score > 90) score = 90;

    // Match level classification
    let match_level = "Low";

    if (score >= 80) {
      match_level = "High";
    } else if (score >= 60) {
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
      { error: "Comparison failed" },
      { status: 500 }
    );

  }

}