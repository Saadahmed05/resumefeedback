"use client";

import { useState, useEffect } from "react";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleAnalyze = async () => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setResult(data);
    setUnlocked(false);
  };

  const handlePayment = async () => {
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
      });

      const order = await res.json();

      if (!order.id) {
        alert("Payment setup failed");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "ShortlistAI",
        description: "Unlock Full Resume Insights",
        order_id: order.id,
        handler: function () {
          alert("✅ Payment Successful (Test Mode)");
          setUnlocked(true);
        },
        theme: { color: "#111827" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        padding: 20,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ maxWidth: 700, margin: "auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 20 }}>
          🚀 ShortlistAI
        </h1>

        <textarea
          placeholder="Paste your resume here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        />

        <button
          onClick={handleAnalyze}
          style={{
            marginTop: 15,
            padding: "12px 24px",
            background: "#111827",
            color: "white",
            borderRadius: 8,
            border: "none",
            fontWeight: "bold",
          }}
        >
          Analyze Resume
        </button>

        {result && (
          <div
            style={{
              marginTop: 30,
              padding: 25,
              borderRadius: 12,
              background: "white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ fontSize: 22 }}>
              Score: <b>{result.score}/100</b>
            </h2>

            {/* Progress Bar */}
            <div
              style={{
                height: 10,
                background: "#eee",
                borderRadius: 5,
                margin: "12px 0",
              }}
            >
              <div
                style={{
                  width: `${result.score}%`,
                  height: "100%",
                  background: "#22c55e",
                  borderRadius: 5,
                }}
              />
            </div>

            {/* Recruiter Insight */}
            <p style={{ marginBottom: 15 }}>
              💼 <b>Recruiter Insight:</b> {result.summary}
            </p>

            {/* Strengths */}
            <h3>✅ Strengths</h3>
            <ul>
              {result.strengths?.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            {/* LOCKED SECTION */}
            {!unlocked ? (
              <div
                style={{
                  marginTop: 20,
                  padding: 15,
                  borderRadius: 10,
                  background: "#f3f4f6",
                }}
              >
                <h3>⚠️ Gaps</h3>
                <p style={{ filter: "blur(4px)" }}>
                  Hidden insights about missing experience...
                </p>

                <h3>🚀 Improvements</h3>
                <p style={{ filter: "blur(4px)" }}>
                  Actionable steps to increase your score...
                </p>

                <button
                  onClick={handlePayment}
                  style={{
                    marginTop: 15,
                    padding: "12px 24px",
                    background: "#111827",
                    color: "white",
                    borderRadius: 8,
                    border: "none",
                    fontWeight: "bold",
                  }}
                >
                  🔓 Unlock for ₹49
                </button>
              </div>
            ) : (
              <>
                <h3>⚠️ Gaps</h3>
                <ul>
                  {result.gaps?.map((g: string, i: number) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>

                <h3>🚀 Improvements</h3>
                <ul>
                  {result.improvements?.map((imp: string, i: number) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}