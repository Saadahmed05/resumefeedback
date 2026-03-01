import { NextResponse } from "next/server";

import {
  CandidateProfile,
  INTERNSHIP_BENCHMARK,
  BenchmarkReport,
} from "@/lib/benchmark";

interface CompareRequestBody {
  candidateProfile?: CandidateProfile;
  result?: CandidateProfile;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CompareRequestBody;

    const candidate =
      body.candidateProfile ?? (body.result as CandidateProfile | undefined);

    if (!candidate) {
      return NextResponse.json(
        { error: "Missing 'candidateProfile' in request body" },
        { status: 400 }
      );
    }

    const {
      production_projects = false,
      metrics_present = false,
      github_present = false,
      internships = false,
    } = candidate;

    // 1. match_level
    const highSignals = [
      production_projects,
      metrics_present,
      github_present,
    ].filter(Boolean).length;

    let match_level: BenchmarkReport["match_level"] = "Low";
    if (production_projects && metrics_present && github_present) {
      match_level = "High";
    } else if (highSignals >= 2) {
      match_level = "Medium";
    }

    // 2. likely_rejection_factors
    const likely_rejection_factors: string[] = [];
    if (!production_projects) {
      likely_rejection_factors.push(
        "No clear evidence of production project experience."
      );
    }
    if (!metrics_present) {
      likely_rejection_factors.push(
        "No quantified impact or performance metrics in the resume."
      );
    }
    if (!github_present) {
      likely_rejection_factors.push(
        "No GitHub or portfolio link demonstrating code samples."
      );
    }
    if (!internships) {
      likely_rejection_factors.push("No prior internship experience listed.");
    }

    // 3. strengths (any true high-signal fields)
    const strengths: string[] = [];
    if (production_projects) {
      strengths.push("Has experience working on production projects.");
    }
    if (metrics_present) {
      strengths.push("Includes quantified impact and performance metrics.");
    }
    if (github_present) {
      strengths.push("Provides GitHub or portfolio with code samples.");
    }
    if (internships) {
      strengths.push("Has completed at least one internship.");
    }

    // 4. gaps (any missing fields)
    const gaps: string[] = [];
    if (!production_projects) {
      gaps.push("Lack of clear production deployment experience.");
    }
    if (!metrics_present) {
      gaps.push("Missing bullet points with measurable impact or metrics.");
    }
    if (!github_present) {
      gaps.push("No GitHub/portfolio link to review code quality.");
    }
    if (!internships) {
      gaps.push("No internship history, which is often expected for interns.");
    }

    // 5. improvements (actionable suggestions for each missing field)
    const improvements: string[] = [];
    if (!production_projects) {
      improvements.push(
        "Add at least one project that has been deployed (e.g., to Vercel, AWS, or similar) and explicitly mention the environment as 'production'."
      );
    }
    if (!metrics_present) {
      improvements.push(
        "Rewrite project bullets to include concrete metrics (e.g., latency, throughput, user growth, or error reduction)."
      );
    }
    if (!github_present) {
      improvements.push(
        "Create or add a GitHub profile link with 1–2 well-structured repositories that reflect your best work."
      );
    }
    if (!internships) {
      improvements.push(
        "Seek internships, open-source contributions, or freelance work that provides practical experience and can be listed on your resume."
      );
    }

    // 6. improved_bullet_example
    let improved_bullet_example: string;
    if (!metrics_present) {
      improved_bullet_example =
        "Implemented a caching layer for REST APIs using Redis, reducing average response time by 45% and decreasing database load by 30%.";
    } else {
      improved_bullet_example =
        "Deployed a full-stack application to a production environment (AWS + Docker), setting up CI/CD pipelines and basic monitoring/alerting.";
    }

    const report: BenchmarkReport = {
      match_level,
      likely_rejection_factors,
      strengths,
      gaps,
      improvements,
      improved_bullet_example,
    };

    // INTERNSHIP_BENCHMARK is imported for future use/comparisons.
    void INTERNSHIP_BENCHMARK;

    return NextResponse.json(report);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error occurred";

    return NextResponse.json(
      {
        error: "Failed to generate comparison report",
        message,
      },
      { status: 500 }
    );
  }
}
