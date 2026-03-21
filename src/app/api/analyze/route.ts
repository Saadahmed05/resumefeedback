export const runtime = "nodejs";

import { NextResponse } from "next/server";
const pdfParse = require("pdf-parse");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // 🚫 Prevent large file crashes
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Use a PDF under 2MB." },
        { status: 400 }
      );
    }

    let text = "";

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const data = await pdfParse(buffer);
      text = data.text.toLowerCase();
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        { error: "Failed to parse PDF. Try another file." },
        { status: 500 }
      );
    }

    // -------- SIGNALS --------
    const internships =
      text.includes("intern") || text.includes("internship");

    const github_present =
      text.includes("github.com") || text.includes("github");

    const metrics_present =
      /\d+%|\d+\+|\d+ users|\d+ms|\d+ seconds/.test(text);

    const production_projects =
      text.includes("deploy") ||
      text.includes("production") ||
      text.includes("live");

    const oss_present =
      text.includes("open source") ||
      text.includes("oss") ||
      text.includes("contributed") ||
      text.includes("pull request");

    const strong_oss =
      text.includes("merged") ||
      text.includes("maintainer");

    const tech_keywords = [
      "python","java","c++","javascript","react",
      "node","aws","docker","kubernetes","mongodb","postgres"
    ];

    const tech_stack = tech_keywords.filter((t) =>
      text.includes(t)
    );

    const tech_stack_count = tech_stack.length;

    // -------- SCORE --------
    let score = 25;

    if (internships) score += 20;
    else if (oss_present) score += 15;

    if (github_present) score += 10;
    if (metrics_present) score += 10;
    if (production_projects) score += 10;

    if (strong_oss) score += 5;

    if (tech_stack_count >= 5) score += 15;
    else if (tech_stack_count >= 3) score += 8;

    if (score > 90) score = 90;

    // -------- DYNAMIC OUTPUT --------
    const strengths: string[] = [];
    const gaps: string[] = [];
    const improvements: string[] = [];

    if (internships)
      strengths.push("Internship experience detected");

    if (oss_present)
      strengths.push("Open-source contributions detected");

    if (github_present)
      strengths.push("GitHub portfolio detected");

    if (metrics_present)
      strengths.push("Projects include measurable impact");

    if (production_projects)
      strengths.push("Deployed projects detected");

    if (!internships && !oss_present) {
      gaps.push("No internship or open-source experience");
      improvements.push("Add internships or OSS contributions");
    }

    if (!metrics_present) {
      gaps.push("No measurable project impact");
      improvements.push("Add numbers like % improvement or users");
    }

    if (!production_projects) {
      gaps.push("Projects are not deployed");
      improvements.push("Deploy projects and include links");
    }

    if (tech_stack_count < 4) {
      gaps.push("Tech stack below average");
      improvements.push("Add backend, cloud, or DB skills");
    }

    if (!github_present) {
      gaps.push("No GitHub portfolio");
      improvements.push("Add GitHub projects");
    }

    // -------- SUMMARY --------
    let summary = "";

    if (score >= 80) {
      summary =
        "Strong resume. You're close to top-tier SWE internship level.";
    } else if (score >= 65) {
      summary =
        "Decent resume but missing key signals recruiters expect.";
    } else {
      summary =
        "Your resume lacks multiple key signals recruiters look for.";
    }

    return NextResponse.json({
      score,
      summary,
      strengths,
      gaps,
      improvements,
      comparison: {
        accepted_avg_score: 82,
        difference: 82 - score
      }
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}