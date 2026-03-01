export function getResumeParsingPrompt(resumeText: string): string {
  return `
You are an AI that extracts structured signals from a resume.

Return ONLY a single valid JSON object with EXACTLY the following shape and property names:
{
  "experience_years": number,
  "tech_stack": string[],
  "production_projects": boolean,
  "metrics_present": boolean,
  "internships": boolean,
  "github_present": boolean,
  "project_complexity": "basic" | "intermediate" | "production"
}

Requirements:
- Do NOT include markdown.
- Do NOT include explanations, comments, or any text before or after the JSON.
- The response MUST be strict JSON that can be parsed by a standard JSON parser.
- All keys MUST be present.
- "tech_stack" MUST be an array of strings.
- Booleans MUST be true or false, not strings.

Resume to analyze:
"""${resumeText}"""
`.trim();
}
