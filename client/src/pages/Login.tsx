
import { useState } from "react"
import Input from "../components/input/Input"
import Button from "../components/button/Button"

const Login = () => {
 
  return (
    <div className="flex flex-col mx-auto justify-center items-center min-h-screen bg-gray-30 px-2 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto shadow-md space-y-6 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-sm p-5 sm:p-8">
        <div className="mb-4 md:mb-8">
          <h1 className="text-center font-bold  text-xl md:text-2xl lg:text-3xl py-2 text-teal-500">Log in on PropertyHut</h1>
          <p className="text-center text-sm md:text-base text-gray-600">
            Enter your details to get started.
          </p>
        </div>
         
       <form className="bg-white p-1 xm:p-2 md:p-3 lg:p-5 rounded-4xl grid grid-cols-1 gap-4 md:gap-6">     
           <Input
            label="Email:"
            type="email"
            placeholder="Email"
            className = "mb-1 md:my-2"
          />

           <Input
            label="Password:"
            type="password"
            className = "mb-1 md:my-2"
          />

          <Button 
            type="submit"
            className="grid md:grid-cols-3"
          >
           Log in
            </Button>
       </form>
       </div>
    </div>
  )
}

export default Login
