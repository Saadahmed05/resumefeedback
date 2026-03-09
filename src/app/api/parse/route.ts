export const runtime = "nodejs";

import { NextResponse } from "next/server";

const pdf = require("pdf-parse");

export async function POST(req: Request) {
  try {

    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No resume uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const parsed = await pdf(buffer);

    const text = parsed.text.toLowerCase();

    const internships =
      text.includes("intern") ||
      text.includes("internship");

    const github_present =
      text.includes("github");

    const production_projects =
      text.includes("deploy") ||
      text.includes("production") ||
      text.includes("live");

    const metrics_present =
      text.includes("%") ||
      text.includes("improved") ||
      text.includes("reduced");

    const tech_stack: string[] = [];

    if (text.includes("react")) tech_stack.push("React");
    if (text.includes("node")) tech_stack.push("Node");
    if (text.includes("python")) tech_stack.push("Python");
    if (text.includes("aws")) tech_stack.push("AWS");
    if (text.includes("docker")) tech_stack.push("Docker");

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

    console.error("Resume parsing error:", error);

    return NextResponse.json(
      {
        error: "Failed to parse resume",
        details: String(error)
      },
      { status: 500 }
    );

  }
}