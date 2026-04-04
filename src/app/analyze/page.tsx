"use client";

import { useState } from "react";
import Script from "next/script";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);

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
  };

  const handlePayment = async () => {
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
      });

      const order = await res.json();
      console.log("ORDER RESPONSE:", order);

      if (!order.id) {
        alert("Order creation failed ❌");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "ShortlistAI",
        description: "Unlock Resume Insights",
        order_id: order.id,

        handler: function () {
          alert("Payment successful ✅");
        },

        theme: {
          color: "#111827",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment setup failed ❌");
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-2">
          🚀 ShortlistAI
        </h1>
        <p className="text-gray-600 mb-6">
          Fix your resume before recruiters reject it
        </p>

        {/* INPUT CARD */}
        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-2xl">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your resume here..."
            className="w-full border rounded-lg p-3 h-40 mb-4 outline-none"
          />

          <button
            onClick={handleAnalyze}
            className="bg-black text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            Analyze Resume
          </button>
        </div>

        {/* RESULT */}
        {result && (
          <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-2xl mt-6">

            <h2 className="text-xl font-semibold mb-2">
              Score: {result.score}/100
            </h2>

            {/* PROGRESS BAR */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${result.score}%` }}
              ></div>
            </div>

            <p className="mb-4 text-gray-700">
              📊 Recruiter Insight: {result.summary}
            </p>

            {/* STRENGTHS */}
            <div className="mb-4">
              <h3 className="font-semibold text-green-600 mb-2">
                ✅ Strengths
              </h3>
              <ul className="list-disc ml-5 text-gray-700">
                {result.strengths?.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* LOCKED SECTION */}
            <div className="opacity-60">
              <h3 className="font-semibold text-yellow-600">
                ⚠️ Gaps
              </h3>
              <p>Unlock to view</p>

              <h3 className="font-semibold text-blue-600 mt-3">
                🚀 Improvements
              </h3>
              <p>Unlock to view</p>
            </div>

            {/* BUTTON */}
            <button
              onClick={handlePayment}
              className="mt-4 w-full bg-black text-white py-3 rounded-lg hover:opacity-90"
            >
              🔓 Unlock for ₹49
            </button>

          </div>
        )}
      </div>
    </>
  );
}