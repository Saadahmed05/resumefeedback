import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
  try {
    const order = await razorpay.orders.create({
      amount: 4900,
      currency: "INR",
      receipt: "resume_unlock",
    });

    return NextResponse.json(order);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Payment failed" },
      { status: 500 }
    );
  }
}