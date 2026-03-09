import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    const formData = await req.formData();
    const file = formData.get("resume") as File;

    const text = await file.text();
    const lower = text.toLowerCase();

    const internships =
      lower.includes("intern") ||
      lower.includes("internship");

    const github_present =
      lower.includes("github.com");

    const production_projects =
      lower.includes("deploy") ||
      lower.includes("production") ||
      lower.includes("live");

    const metrics_present =
      lower.includes("%") ||
      lower.includes("users") ||
      lower.includes("performance");

    const tech_stack = [];

    if (lower.includes("react")) tech_stack.push("React");
    if (lower.includes("node")) tech_stack.push("Node");
    if (lower.includes("aws")) tech_stack.push("AWS");
    if (lower.includes("docker")) tech_stack.push("Docker");
    if (lower.includes("python")) tech_stack.push("Python");

    const project_complexity =
      lower.includes("api") || lower.includes("microservice")
        ? "advanced"
        : "basic";

    return NextResponse.json({
      internships,
      github_present,
      production_projects,
      metrics_present,
      tech_stack,
      project_complexity
    });

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