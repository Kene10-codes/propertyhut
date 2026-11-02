import Input from "../components/input/Input";
import Button from "../components/button/Button";
import { useAuth } from "../hooks/useAuth";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();
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
      const response = await login({ email, password });

      if (!response.data) {
        dispatch({
          type: "LOGIN_ERROR",
          payload: {
            field: undefined,
            message: "Something went wrong",
          },
        });
        return;
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data.token,
      });
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid credentials";

      dispatch({
        type: "LOGIN_ERROR",
        payload: {
          field: undefined,
          message: errorMessage,
        },
      });
    } finally {
      dispatch({ type: "FORM_RESET" });
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
