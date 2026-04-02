"use client";

import { useState, useEffect } from "react";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [unlocked, setUnlocked] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleAnalyze = async () => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setResult(data);
    setUnlocked(false);
  };

  const handlePayment = async () => {
    const res = await fetch("/api/create-order", {
      method: "POST",
    });

    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "ShortlistAI",
      description: "Unlock full report",
      order_id: order.id,
      handler: function () {
        setUnlocked(true);
      },
      theme: { color: "#000" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
        Resume Analyzer
      </h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={handleAnalyze}
        style={{
          marginTop: 15,
          padding: "10px 20px",
          background: "black",
          color: "white",
          borderRadius: 6,
          border: "none",
        }}
      >
        Analyze Resume
      </button>

      {result && (
        <div
          style={{
            marginTop: 30,
            padding: 20,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        >
          <h2>Score: {result.score}/100</h2>

          <div
            style={{
              height: 10,
              background: "#eee",
              borderRadius: 5,
              overflow: "hidden",
              margin: "10px 0",
            }}
          >
            <div
              style={{
                width: `${result.score}%`,
                height: "100%",
                background:
                  result.score > 80 ? "green" : result.score > 60 ? "orange" : "red",
              }}
            />
          </div>

          <p>{result.summary}</p>

          <h3>✅ Strengths</h3>
          <ul>
            {result.strengths?.map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          {/* 🔒 LOCKED SECTION */}
          {!unlocked ? (
            <div style={{ opacity: 0.5 }}>
              <h3>⚠️ Gaps</h3>
              <p>Unlock to view</p>

              <h3>🚀 Improvements</h3>
              <p>Unlock to view</p>

              <button
                onClick={handlePayment}
                style={{
                  marginTop: 15,
                  padding: "10px 20px",
                  background: "black",
                  color: "white",
                  borderRadius: 6,
                  border: "none",
                }}
              >
                Unlock for ₹49
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
  );
}