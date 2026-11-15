import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { verifyEmailApi } from "../services/authService";

const VerifyEmail = () => {
  const { token } = useParams();

  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const verifyEmail = async () => {
      if (!token) {
        setError("Invalid verification link.");
        setLoading(false);
        return;
      }
      try {
        const response = await verifyEmailApi(token);
        if (active) {
          setSuccess(response.message);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Email verification failed",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    // Invoke function
    verifyEmail();

    return () => {
      active = false;
    };
  }, [token]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow text-center">
        {loading && (
          <>
            <h1 className="text-2xl font-bold mb-3">Verifying Email</h1>
            <p className="text-gray-500">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {success && (
          <>
            <div className="text-green-600 text-4xl mb-4">✔</div>
            <h1 className="text-2xl font-bold mb-3">Email Verified</h1>
            <p className="text-gray-500 mb-6">{success}</p>
            <Link
              to={"/login"}
              className="block bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700"
            >
              Continue to Login
            </Link>
          </>
        )}

        {error && (
          <>
            <div className="text-red-600 text-4xl mb-4">!</div>
            <h1 className="text-2xl font-bold mb-3">
              Email verification Failed
            </h1>
            <p className="text-red-500 mb-6">{error}</p>
            <Link
              to={"/resend-verification"}
              className="block bg-teal-600 text-white p-3 rounded-lg"
            >
              Request New Verification Link
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
