import  bcrypt  from "bcryptjs";
import { Request, Response } from "express";


import { token } from "../utils/token.js";
import { User } from "../model/User.js";


async function login(req: Request, res: Response) {
  // Destructure the request body
  const { email, password } = req.body;

  // Validate the email and password
  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      error: "Invalid email or password",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: "Password should be atleast 8 characters!",
    });
  }

  // Check if email exists already or not
  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(404).json({
      error: "User already exists",
    });
  }

  if(user.status === "pending") {
    return res.status(403).json({
      error: "You cannot log in now, waiting for admin approval"
    })
  }

  if(user.status === "rejected"){
    return res.status(403).json({
      error: "Your request was rejected!, try again"
    })
  }

  // Generate token
  const generatedToken = token(user);
  console.log("generated token", generatedToken);

  res.status(200).json({
    message: "Log in successfully",
    token: generatedToken
  })
}


async function signup(req: Request, res: Response) {
  const { firstName, lastName, email, role, password, phone } = req.body;

   // Check if email exists already
   const existingEmail = await User.findOne({ email });

   if(existingEmail){
    return res.status(409).json({
       message: "Email exists already!"
    })
   }

   // Check Phone exists
   const existingPhone = await User.findOne({ phone });
   
   if(existingPhone){
    return res.status(409).json({
       message: "Phone number exists already!"
    })
   }

  // Generate salt Password
  const salt = await bcrypt.genSalt(12);

  // Hash password
  const hashedPassword = await bcrypt.hash(password, salt);

  const status = role === "agent" ? "pending" : "approved";

  const user = await User.create({
      firstName,
      lastName,
      email,
      status,
      role,
      password: hashedPassword
  })

  return res.status(201).json({
     message: status === "pending" ? "Kndly wait for admin to approve" : "User registered succesfully",
     user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName
     }
  })

}

export { login, signup };