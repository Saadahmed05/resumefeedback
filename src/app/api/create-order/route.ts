import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // 🔴 SAFETY CHECK (prevents build/runtime crash)
    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      return NextResponse.json(
        { error: "Razorpay keys not configured" },
        { status: 500 }
      );
    }

    // ✅ Initialize Razorpay safely
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // ✅ Create order
    const order = await razorpay.orders.create({
      amount: 4900, // ₹49
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json(order);

  } catch (err: any) {
    console.error("RAZORPAY ERROR:", err);

    return NextResponse.json(
      { error: err.message || "Order creation failed" },
      { status: 500 }
    );
  }
}