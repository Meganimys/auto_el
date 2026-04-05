"use client";

import { useState } from "react";

export default function EmailVerificationBlock({
  email,
  onSuccess,
}: {
  email: string;
  onSuccess: () => void;
}) {
  const [isSent, setIsSent] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/email/send", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSent(true);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Помилка відправки");
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/email/verify", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.error);
      }
    } catch {
      setError("Помилка перевірки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      {!isSent ? (
        <button
          type="button"
          onClick={sendCode}
          disabled={loading}
          className="bg-green-700 h-10 rounded-xl"
        >
          {loading ? "Відправка..." : "Надіслати код"}
        </button>
      ) : (
        <>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Введіть код"
            className="border h-10 rounded p-2 text-black"
          />

          <button
            type="button"
            onClick={verify}
            disabled={loading}
            className="bg-green-700 h-10 rounded-xl"
          >
            {loading ? "Перевірка..." : "Підтвердити"}
          </button>
        </>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}