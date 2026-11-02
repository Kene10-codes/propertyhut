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

    // Validate user inputs
    if(!email) {
      dispatch({
         type: "LOGIN_ERROR",
         payload: {
           field: "email",
           message: "Email is required"
         } 
      })
      return;
    }

    if(!password) {
      dispatch({
         type: "LOGIN_ERROR",
         payload: {
           field: "password",
           message: "Password is required"
         } 
      })
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
          message: errorMessage
        },
      });
    } finally {
      dispatch({
        type: "FORM_RESET",
      });
    }
  }
  return (
    <div className="flex flex-col mx-auto justify-center items-center min-h-screen bg-gray-30 px-2 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto shadow-md space-y-6 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-sm p-5 sm:p-8">
        <div className="mb-4 md:mb-8">
          <h1 className="text-center font-bold  text-xl md:text-2xl lg:text-3xl py-2 text-teal-500">
            Log in on PropertyHut
          </h1>
          <p className="text-center text-sm md:text-base text-gray-600">
            Enter your details to get started.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-1 xm:p-2 md:p-3 lg:p-5 rounded-4xl grid grid-cols-1 gap-4 md:gap-6"
        >
          <Input
            label="Email:"
            type="email"
            error={`${error.email}`}
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
            error={`${error.password}`}
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
