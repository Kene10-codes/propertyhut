import { useState } from "react";
import type { SignupFormData } from "../types/auth";

import Input from "../components/input/Input";
import Button from "../components/button/Button";

const initialState: SignupFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
};

const Register = () => {
  const [signupForm, setSignupForm] = useState<SignupFormData | null>(
    initialState,
  );

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

        <form className="bg-white p-1 xm:p-2 md:p-3 lg:p-5 rounded-4xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <Input
              label="First Name:"
              placeholder="First Name"
              className="mb-1 md:my-2"
            />
            <Input
              label="Last Name:"
              placeholder="Last Name"
              className="mb-1 md:my-2"
            />

            <Input
              label="Email:"
              type="email"
              placeholder="Email"
              className="mb-1 md:my-2"
            />

            <Input
              label="Phone Number:"
              type="tel"
              placeholder="Phone Number"
              className="mb-1 md:my-2"
            />

            <Input label="Password:" type="password" className="mb-1 md:my-2" />
          </div>
          <Button type="submit" className="w-full mt-5">
            Sign up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
