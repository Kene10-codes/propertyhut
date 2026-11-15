import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

import { forgotPasswordApi } from "../services/authService";
import Button from "../components/button/Button";
import Input from "../components/input/Input";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await forgotPasswordApi(email);

      setMessage(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-2">Forgot Password?</h1>

        <p className="text-gray-500 mb-6">
          Enter your registered email address and we'll send you a password
          reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full border rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {message && <p className="text-green-600 text-sm mb-4">{message}</p>}

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-teal-600 text-base hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
