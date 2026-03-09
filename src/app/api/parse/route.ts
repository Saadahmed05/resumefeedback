import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    const body = await req.json();
    const text = body.text.toLowerCase();

    const internships =
      text.includes("intern");

    const github_present =
      text.includes("github");

    const production_projects =
      text.includes("deploy") ||
      text.includes("production");

    const metrics_present =
      text.includes("%") ||
      text.includes("improved");

    const tech_stack: string[] = [];

    if (text.includes("react")) tech_stack.push("React");
    if (text.includes("node")) tech_stack.push("Node");
    if (text.includes("python")) tech_stack.push("Python");
    if (text.includes("aws")) tech_stack.push("AWS");

    const project_complexity =
      text.includes("api") ||
      text.includes("pipeline")
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
      { error: "Parse failed", details: String(error) },
      { status: 500 }
    );

  }
}