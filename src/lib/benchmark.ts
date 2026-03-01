export type ProjectComplexity = "basic" | "intermediate" | "production";

export interface CandidateProfile {
  experience_years: number;
  tech_stack: string[];
  production_projects: boolean;
  metrics_present: boolean;
  internships: boolean;
  github_present: boolean;
  project_complexity: ProjectComplexity;
}

export interface BenchmarkReport {
  match_level: "High" | "Medium" | "Low";
  likely_rejection_factors: string[];
  strengths: string[];
  gaps: string[];
  improvements: string[];
  improved_bullet_example: string;
}

export const INTERNSHIP_BENCHMARK: CandidateProfile = {
  experience_years: 1,
  tech_stack: [],
  production_projects: true,
  metrics_present: true,
  internships: true,
  github_present: true,
  project_complexity: "intermediate",
};
