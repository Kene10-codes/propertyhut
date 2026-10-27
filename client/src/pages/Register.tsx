
import { useState } from "react"
import Input from "../components/input/Input"

const Register = () => {
 
  return (
    <div className="flex flex-col mx-auto justify-center items-center min-h-screen bg-gray-30 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto shadow-md space-y-6 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <h1 className="text-center font-bold  text-md md:text-xl lg:text-2xl py-4 text-teal-500">Register on PropertyHut</h1>
          <p className="text-center text-sm text-gray-600">
            Enter your details to get started.
          </p>
        </div>
         
       <form className="bg-white p-5 rounded-4xl grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            label="First Name:"
            placeholder="First Name"
            className = "my-2"
          />
           <Input
            label="Last Name:"
            placeholder="Last Name"
            className = "my-2"
          />

           <Input
            label="Email:"
            type="email"
            placeholder="Email"
            className = "my-2"
          />

           <Input
            label="Password:"
            type="password"
            className = "my-2"
          />
       </form>
       </div>
    </div>
  )
}

export default Register
