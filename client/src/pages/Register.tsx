import Input from "../components/input/Input";
import Button from "../components/button/Button";
import Select from "../components/select/Select";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authService";

const Register = () => {
  const { signupState, signupDispatch } = useAuth();
  const {
    firstName,
    lastName,
    email,
    phone,
    role,
    password,
    isLoading,
    error,
  } = signupState;
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Handle form submission logic here
    signupDispatch({ type: "SIGNUP_START" });

    if (!firstName) {
      signupDispatch({
        type: "SIGNUP_ERROR",
        payload: {
          field: "firstName",
          message: "First name is required",
        },
      });
      return;
    }

    if (!lastName) {
      signupDispatch({
        type: "SIGNUP_ERROR",
        payload: {
          field: "lastName",
          message: "Last name is required",
        },
      });
      return;
    }

    if (!email) {
      signupDispatch({
        type: "SIGNUP_ERROR",
        payload: {
          field: "email",
          message: "Email is required",
        },
      });
      return;
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) === false) {
      signupDispatch({
        type: "SIGNUP_ERROR",
        payload: {
          field: "email",
          message: "Please enter a valid email address",
        },
      });
      return;
    }

    if (!phone) {
      signupDispatch({
        type: "SIGNUP_ERROR",
        payload: {
          field: "phone",
          message: "Phone number is required",
        },
      });
      return;
    }

    const strictLocalRegex = /^0[789][01]\d{8}$/;
    if(!strictLocalRegex.test(phone)) {
      signupDispatch({
        type: "SIGNUP_ERROR",
        payload: {
          field: "phone",
          message: "Please enter a valid local phone number starting with 07, 08, or 09",
        },
      });
      return;
    }

    if (!role) {
      signupDispatch({
        type: "SIGNUP_ERROR",
        payload: {
          field: "role",
          message: "Role is required",
        },
      });
      return;
    }

    if (!password) {
      signupDispatch({
        type: "SIGNUP_ERROR",
        payload: {
          field: "password",
          message: "Password is required",
        },
      });
      return;
    }

    if (password.length < 8) {
      signupDispatch({
        type: "SIGNUP_ERROR",
        payload: {
          field: "password",
          message: "Password must be at least 8 characters long",
        },
      });
      return;
    }

    try {
      const response = signup({
        firstName,
        lastName,
        email,
        phone,
        role,
        password,
      });

      if (!response) {
        signupDispatch({
          type: "SIGNUP_ERROR",
          payload: {
            field: undefined,
            message: "Something went wrong",
          },
        });
        return;
      }

      signupDispatch({
        type: "SIGNUP_SUCCESS",
        payload: {
          email,
          firstName,
          lastName,
          phone,
          role,
        },
      });
      // NAVIGATE TO LOGIN PAGE
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid credentials";

      signupDispatch({
        type: "SIGNUP_ERROR",
        payload: {
          field: undefined,
          message: errorMessage,
        },
      });
    } finally {
      signupDispatch({ type: "FORM_RESET" });
    }
  }

  return (
    <div className="flex flex-col mx-auto justify-center items-center min-h-screen bg-gray-30 px-2 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto shadow-md space-y-6 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-sm p-5 sm:p-8">
        <div className="mb-4 md:mb-8">
          <h1 className="text-center font-bold  text-xl md:text-2xl lg:text-3xl py-2 text-teal-500">
            Register on PropertyHut
          </h1>
          <p className="text-center text-sm md:text-base text-gray-600">
            Enter your details to get started.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-1 xm:p-2 md:p-3 lg:p-5 rounded-4xl"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <Input
              label="First Name:"
              value={firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                signupDispatch({
                  type: "SET_FIRST_NAME",
                  payload: e.target.value,
                })
              }
              error={error.firstName || undefined}
              placeholder="First Name"
              className="mb-1 md:my-2"
            />
            <Input
              label="Last Name:"
              value={lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                signupDispatch({
                  type: "SET_LAST_NAME",
                  payload: e.target.value,
                })
              }
              error={error.lastName || undefined}
              placeholder="Last Name"
              className="mb-1 md:my-2"
            />

            <Input
              label="Email:"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                signupDispatch({
                  type: "SET_EMAIL",
                  payload: e.target.value,
                })
              }
              error={error.email || undefined}
              placeholder="Email"
              className="mb-1 md:my-2"
            />

            <Select
              label="Choose Account Type:"
              options={[
                { label: "User", value: "user" },
                { label: "Agent", value: "agent" },
              ]}
              value={role === "user" || role === "agent" ? role : undefined}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                signupDispatch({
                  type: "SET_ROLE",
                  payload: e.target.value as typeof role,
                })
              }
              error={error.role || undefined}
            />

            <Input
              label="Phone Number:"
              type="tel"
              placeholder="Phone Number"
              className="mb-1 md:my-2"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                signupDispatch({
                  type: "SET_PHONE",
                  payload: e.target.value,
                })
              }
              error={error.phone || undefined}
            />

            <Input
              label="Password:"
              type="password"
              className="mb-1 md:my-2"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                signupDispatch({
                  type: "SET_PASSWORD",
                  payload: e.target.value,
                })
              }
              error={error.password || undefined}
            />
          </div>
          <Button type="submit" className="w-full mt-5">
            {isLoading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Register;
