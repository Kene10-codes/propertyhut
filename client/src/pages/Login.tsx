import Input from "../components/input/Input";
import Button from "../components/button/Button";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { state, dispatch, login } = useAuth();
  const { email, password, isLoading, error } = state;

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    if (!email) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: {
          field: "email",
          message: "Email is required",
        },
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: {
          field: "email",
          message: "Please enter a valid email address",
        },
      });
      return;
    }

    if (!password) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: {
          field: "password",
          message: "Password is required",
        },
      });
      return;
    }

    if (password.length < 8) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: {
          field: "password",
          message: "Password must be at least 8 characters long",
        },
      });
      return;
    }

    try {
      await login(email, password);
      dispatch({ type: "LOGIN_SUCCESS" });
      navigate("/dashboard");
    } catch (error) {
      const errorMessage = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? "Unable to log in. Please try again."
        : error instanceof Error
          ? error.message
          : "Unable to log in. Please try again.";

      dispatch({
        type: "LOGIN_ERROR",
        payload: {
          field: "general",
          message: errorMessage,
        },
      });
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-2 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl space-y-6 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-4 md:mb-8">
          <h1 className="py-2 text-center text-xl font-bold text-teal-500 md:text-2xl lg:text-3xl">
            Log in on PropertyHut
          </h1>
          <p className="text-center text-sm text-gray-600 md:text-base">
            Enter your details to get started.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 rounded-4xl bg-white p-1 md:gap-6 xm:p-2 md:p-3 lg:p-5"
        >
          {error.general && (
            <p className="text-center text-sm text-red-600" role="alert">
              {error.general}
            </p>
          )}

          <Input
            label="Email:"
            type="email"
            error={error.email || undefined}
            placeholder="Email"
            className="mb-1 md:my-2"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              dispatch({
                type: "SET_EMAIL",
                payload: e.target.value,
              })
            }
          />

          <Input
            label="Password:"
            type="password"
            error={error.password || undefined}
            placeholder="Password"
            className="mb-1 md:my-2"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              dispatch({
                type: "SET_PASSWORD",
                payload: e.target.value,
              })
            }
          />

          <Button type="submit" className="grid md:grid-cols-3">
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
