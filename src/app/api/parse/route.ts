import { NextResponse } from "next/server";

interface ParseRequestBody {
  resumeText: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ParseRequestBody>;

    if (typeof body.resumeText !== "string" || !body.resumeText.trim()) {
      return NextResponse.json(
        { error: "Invalid or missing 'resumeText' in request body" },
        { status: 400 }
      );
    }

    const resumeText = body.resumeText.trim();
    const lower = resumeText.toLowerCase();

    // metrics_present: "%" or "improved" or "increased"
    const metrics_present =
      resumeText.includes("%") ||
      lower.includes("improved") ||
      lower.includes("increased");

    // production_projects: "deployed" or "aws" or "docker" or "production"
    const production_projects =
      lower.includes("deployed") ||
      lower.includes("aws") ||
      lower.includes("docker") ||
      lower.includes("production");

    // internships: contains "intern"
    const internships = lower.includes("intern");

    // github_present: contains "github"
    const github_present = lower.includes("github");

    // project_complexity: production > intermediate > basic
    let project_complexity: "basic" | "intermediate" | "production" = "basic";
    if (lower.includes("scalable") || lower.includes("microservices")) {
      project_complexity = "production";
    } else if (lower.includes("rest api") || lower.includes("authentication")) {
      project_complexity = "intermediate";
    }

    // tech_stack detection
    const techKeywords = ["React", "Node", "MongoDB", "Python", "Java", "AWS"];
    const tech_stack: string[] = [];

    for (const tech of techKeywords) {
      const techLower = tech.toLowerCase();
      if (lower.includes(techLower)) {
        tech_stack.push(tech);
      }
    }

    // experience_years: count patterns like "2022-2023" or "1 year"
    let experience_years = 0;

    const rangePattern = /\b(19|20)\d{2}\s*[–-]\s*(19|20)\d{2}\b/g;
    const singleYearPattern = /\b\d+\s+year(s)?\b/gi;

    experience_years += Array.from(resumeText.matchAll(rangePattern)).length;
    experience_years += Array.from(resumeText.matchAll(singleYearPattern)).length;

    const result = {
      experience_years,
      tech_stack,
      production_projects,
      metrics_present,
      internships,
      github_present,
      project_complexity,
    };

    return NextResponse.json({ result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error occurred";

    return NextResponse.json(
      {
        error: "Failed to parse resume",
        message,
      },
      { status: 500 }
    );
  }
}
