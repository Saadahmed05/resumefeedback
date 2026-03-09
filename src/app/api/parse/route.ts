import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Temporary safe parser (guaranteed output)
    const parsedResume = {
      experience_years: 1,
      tech_stack: ["React", "Node", "AWS"],
      production_projects: true,
      metrics_present: true,
      internships: true,
      github_present: true,
      project_complexity: "basic"
    };

    return NextResponse.json(parsedResume);

  } catch (error) {

    return NextResponse.json(
      {
        error: "Failed to parse resume",
        details: String(error)
      },
      { status: 500 }
    );

  }
}