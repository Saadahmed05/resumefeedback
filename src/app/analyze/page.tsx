"use client";

import { useState } from "react";
import Script from "next/script";

export default function Home() {
  const [text, setText] = useState("");

  const handleAnalyze = async () => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    alert(JSON.stringify(data));
  };

  const handlePayment = async () => {
    try {
      // CREATE ORDER
      const res = await fetch("/api/create-order", {
        method: "POST",
      });

      const order = await res.json();
      console.log("ORDER RESPONSE:", order);

      if (!order.id) {
        alert("Order creation failed ❌");
        return;
      }

      // OPEN RAZORPAY
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "ShortlistAI",
        description: "Unlock Resume Insights",
        order_id: order.id,

        handler: function (response: any) {
          alert("Payment successful ✅");
          console.log(response);
        },

        prefill: {
          name: "Test User",
          email: "test@example.com",
        },

        theme: {
          color: "#000000",
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
      {/* ✅ THIS IS THE IMPORTANT PART */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div style={{ padding: 40 }}>
        <h1>🚀 ShortlistAI</h1>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          style={{ width: "100%", marginBottom: 20 }}
        />

        <br />

        <button onClick={handleAnalyze}>
          Analyze Resume
        </button>

        <br /><br />

        <button onClick={handlePayment}>
          🔓 Unlock for ₹49
        </button>
      </div>
    </>
  );
}