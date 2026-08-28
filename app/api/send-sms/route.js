import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { number, message } = await request.json();

    // Number validation
    if (!/^01\d{9}$/.test(number)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Bangladesh mobile number."
        },
        { status: 400 }
      );
    }

    // Message validation
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Message is required."
        },
        { status: 400 }
      );
    }

    if (message.length > 480) {
      return NextResponse.json(
        {
          success: false,
          error: "Message is too long."
        },
        { status: 400 }
      );
    }

    const API_URL = process.env.SMS_API_URL;

    if (!API_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "SMS_API_URL is missing."
        },
        { status: 500 }
      );
    }

    // Developer credit
    const finalMessage =
      `${message.trim()}\n\nDeveloper by Efty`;

    /*
      IMPORTANT:
      এখানে আপনার authorized SMS provider-এর
      official request format বসাতে হবে।
    */

    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        number: number,
        message: finalMessage
      }),

      cache: "no-store"
    });

    const providerText = await response.text();

    // Provider HTTP error
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "SMS provider returned an error.",
          providerResponse: providerText
        },
        { status: 502 }
      );
    }

    // Empty response = don't claim success
    if (!providerText) {
      return NextResponse.json(
        {
          success: false,
          error: "Provider returned an empty response."
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Provider accepted the request.",
      providerResponse: providerText
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Server error."
      },
      { status: 500 }
    );
  }
}
