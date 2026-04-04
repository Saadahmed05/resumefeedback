import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: 4900, // ₹49
      currency: "INR",
      receipt: "receipt_order_1",
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("RAZORPAY ERROR:", error);

    return NextResponse.json(
      { error: "Order creation failed", details: error.message },
      { status: 500 }
    );
  }
}