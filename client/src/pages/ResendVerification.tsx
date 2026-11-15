import { useState } from "react";

import { resendVerificationEmailApi } from "../services/authService";
import Button from "../components/button/Button";
import Input from "../components/input/Input";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await resendVerificationEmailApi(email);

      setMessage(response.message);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send verification email.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-2">Resend Verification Email</h1>

        <p className="text-gray-500 mb-6">
          Enter your email address to receive another verification link.
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full border rounded-lg p-3 mb-4"
          />

          {message && <p className="text-green-600 text-sm mb-4">{message}</p>}

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white p-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResendVerification;
