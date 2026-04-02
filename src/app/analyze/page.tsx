"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const analyze = async () => {
    setLoading(true);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setResult(data);
    setUnlocked(false);
    setLoading(false);
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
      name: "Resume Analyzer",
      description: "Unlock full report",
      order_id: order.id,
      handler: function () {
        setUnlocked(true);
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Resume Analyzer</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%", height: 200 }}
      />

      <button onClick={analyze}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>

          <h2>Score: {result.score}/100</h2>
          <p>{result.summary}</p>

          <h3>Strengths</h3>
          <ul>
            {result.strengths.map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <div style={{ position: "relative" }}>

            {!unlocked && (
              <div style={{
                position: "absolute",
                background: "rgba(255,255,255,0.8)",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <button onClick={handlePayment}>
                  Unlock for ₹49
                </button>
              </div>
            )}

            <h3>Gaps</h3>
            <ul>
              {result.gaps.map((g: string, i: number) => (
                <li key={i}>{g}</li>
              ))}
            </ul>

            <h3>Improvements</h3>
            <ul>
              {result.improvements.map((imp: string, i: number) => (
                <li key={i}>{imp}</li>
              ))}
            </ul>

          </div>

        </div>
      )}
    </div>
  );
}