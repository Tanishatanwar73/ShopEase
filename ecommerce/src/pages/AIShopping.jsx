import { useState } from "react";
import { askAI } from "../services/api";

function AIShopping() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAskAI = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const data = await askAI(prompt);

      if (data.success) {
        setAnswer(data.answer);
      } else {
        const friendlyMessage =
          data.message &&
          data.message.toLowerCase().includes("not available")
            ? "This product is not available in our store right now. We will add it soon."
            : data.message || "Failed to get AI response";

        setError(friendlyMessage);
      }
    } catch (error) {
      console.error(error);
      setError("This product is not available in our store right now. We will add it soon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-white p-6 shadow">

          <h1 className="text-3xl font-bold">
            🤖 AI Shopping Assistant
          </h1>

          <p className="mt-2 text-gray-600">
            Ask our AI assistant for shopping help.
          </p>

          <form onSubmit={handleAskAI} className="mt-6">

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: I need comfortable shoes under ₹2000"
              className="min-h-[130px] w-full rounded-lg border p-4 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-4 rounded-lg bg-black px-6 py-3 text-white disabled:opacity-50"
            >
              {loading ? "Thinking..." : "Ask AI"}
            </button>

          </form>

          {error && (
            <div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          {answer && (
            <div className="mt-6 rounded-lg border bg-gray-50 p-5">

              <h2 className="mb-3 text-xl font-semibold">
                AI Response
              </h2>

              <p className="whitespace-pre-wrap text-gray-700">
                {answer}
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AIShopping;