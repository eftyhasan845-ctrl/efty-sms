"use client";

import { useState } from "react";

export default function Home() {
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          number,
          message
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setStatus("✅ SMS request sent successfully!");
      setMessage("");

    } catch (error) {
      setStatus("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div className="card">

        <h1>Efty SMS</h1>
        <p>SMS Sender Panel</p>

        <form onSubmit={handleSubmit}>

          <label>Phone Number</label>

          <input
            type="tel"
            placeholder="01XXXXXXXXX"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />

          <label>Message</label>

          <textarea
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={480}
            required
          />

          <div className="counter">
            {message.length}/480
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send SMS"}
          </button>

        </form>

        {status && (
          <div className="status">
            {status}
          </div>
        )}

        <footer>Developer by Efty</footer>

      </div>
    </main>
  );
}
