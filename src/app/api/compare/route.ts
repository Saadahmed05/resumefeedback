import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const parsed = await req.json();

    let score = 0;

    const strengths: string[] = [];
    const gaps: string[] = [];
    const likely_rejection_factors: string[] = [];
    const improvements: string[] = [];

    if (parsed.production_projects) {
      score += 15;
      strengths.push("Has production or deployed projects.");
    } else {
      gaps.push("No deployed project detected.");
      improvements.push(
        "Deploy one project using AWS, Vercel, or Netlify."
      );
    }

    if (parsed.metrics_present) {
      score += 15;
      strengths.push("Projects include measurable impact.");
    } else {
      gaps.push("Projects lack measurable metrics.");
      improvements.push(
        "Add metrics like performance improvements or user numbers."
      );
    }

    if (parsed.github_present) {
      score += 15;
      strengths.push("GitHub portfolio detected.");
    } else {
      gaps.push("GitHub portfolio missing.");
      improvements.push(
        "Add a GitHub profile link with your projects."
      );
    }

    if (parsed.internships) {
      score += 20;
      strengths.push("Has internship or real work experience.");
    } else {
      likely_rejection_factors.push(
        "No internship experience listed."
      );
      improvements.push(
        "Try internships, freelance projects, or open source."
      );
    }

    if (parsed.tech_stack && parsed.tech_stack.length >= 3) {
      score += 15;
      strengths.push("Strong technology stack detected.");
    } else {
      gaps.push("Limited tech stack detected.");
      improvements.push(
        "Expand tech stack with backend, cloud, or databases."
      );
    }

    if (parsed.project_complexity === "advanced") {
      score += 20;
      strengths.push("Projects show advanced complexity.");
    } else {
      gaps.push("Projects appear basic.");
      improvements.push(
        "Build more complex systems like APIs or SaaS apps."
      );
    }

    if (score > 100) score = 100;

    let match_level = "Low";

    if (score >= 80) match_level = "High";
    else if (score >= 60) match_level = "Medium";

    const improved_bullet_example =
      "Deployed a full-stack application using AWS + Docker serving 500+ users.";

    return NextResponse.json({
      score,
      match_level,
      strengths,
      gaps,
      likely_rejection_factors,
      improvements,
      improved_bullet_example,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Comparison failed", details: String(error) },
      { status: 500 }
    );
  }
}