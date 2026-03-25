🚀 Resume Benchmark AI

An AI-powered resume analysis tool that helps Software Engineering students understand why their resumes get rejected and how to improve them.

⸻

🔍 Problem

Most students applying for SWE internships face the same issue:
	•	Apply to 100+ roles
	•	Get no responses
	•	No feedback on what’s wrong

Resumes feel like they’re going into a black hole.

⸻

💡 Solution

Resume Benchmark AI analyzes resumes and provides:
	•	📊 Resume Score (out of 100)
	•	⚠️ Key gaps in the resume
	•	✅ Strengths detected
	•	📈 Comparison with accepted resumes
	•	🔒 Paywalled detailed insights

⸻

🧠 How It Works

The system extracts signals from resumes such as:
	•	Internship experience
	•	Open-source contributions (OSS)
	•	GitHub presence
	•	Tech stack depth
	•	Project deployment
	•	Measurable impact (metrics)

These signals are compared against patterns found in accepted SWE resumes.

⸻

✨ Features
	•	📄 Upload PDF resumes
	•	⚡ Instant analysis
	•	🧩 Dynamic scoring (not generic)
	•	🔍 Personalized feedback
	•	🔐 Paywall for detailed insights
	•	📊 Accepted resume benchmarking

⸻

🛠 Tech Stack
	•	Frontend: Next.js 14
	•	Backend: Next.js API Routes
	•	Parsing: pdf-parse
	•	Deployment: Vercel
	•	Language: TypeScript

⸻

📂 Project Structure

```
src/
├── app/
│   ├── analyze/       # Upload page
│   ├── report/        # Results page
│   └── api/analyze/   # Resume analysis logic
├── lib/               # (future dataset logic)
```

⸻

⚙️ Installation

Clone the repo:

```bash
git clone https://github.com/your-username/resume-benchmark-ai.git
cd resume-benchmark-ai
```

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

⸻

🚀 Deployment

This project is optimized for deployment on Vercel.

Make sure:
	•	Node runtime is enabled
	•	PDF size < 2MB
	•	Environment is correctly configured

⸻

📊 Future Improvements
	•	🤖 AI-based bullet point rewriting
	•	📚 Accepted resume dataset (1000+ resumes)
	•	🧠 Machine learning scoring model
	•	💳 Razorpay payment integration
	•	🏆 Resume leaderboard

⸻

💰 Monetization Model
	•	Free: Resume score + basic feedback
	•	Paid (₹199):
	•	Full gap analysis
	•	Improvement suggestions
	•	Advanced insights

⸻

🙌 Contributing

Feel free to open issues or contribute improvements.

⸻

📣 Feedback

This is an early-stage project.
If you try it, your feedback is highly valuable.

⸻

⭐ If you found this useful

Give it a star on GitHub — it helps a lot!

⸻

👨‍💻 Author

Built by Saad Ahmed
3rd Year CSE (AI & ML)

⸻

⚡ Vision

To build a data-driven resume intelligence platform that helps students land better opportunities.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


