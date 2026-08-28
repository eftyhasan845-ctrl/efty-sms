import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { number, message } = await request.json();

    if (!/^01\d{9}$/.test(number)) {
      return NextResponse.json(
        { error: "Invalid Bangladesh mobile number." },
        { status: 400 }
      );
    }

    if (!message || message.length > 480) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const API_URL = process.env.SMS_API_URL;
    const API_KEY = process.env.SMS_API_KEY;

    if (!API_URL) {
      return NextResponse.json(
        { error: "SMS API is not configured." },
        { status: 500 }
      );
    }

    const finalMessage =
      `${message}\n\nDeveloper by Efty`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY
          ? { Authorization: `Bearer ${API_KEY}` }
          : {})
      },
      body: JSON.stringify({
        number,
        message: finalMessage
      }),
      cache: "no-store"
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "SMS provider rejected the request." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "SMS request sent successfully."
    });

  } catch {
    return NextResponse.json(
      { error: "Server error." },
      { status: 500 }
    );
  }
}
