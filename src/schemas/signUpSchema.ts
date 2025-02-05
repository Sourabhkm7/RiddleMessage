import {z} from 'zod';

export const usernameValidation = z.
string()
.min(2, "Username must be atleast 2 characters long")
.max(20, "Username must be less than 20 characters long")
.regex(/^[a-zA-Z0-9]+$/, "Username must only contain alphanumeric characters");



export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(8, {message: "Password must be atleast 8 characters long"}),
    confirmPassword: z.string().min(8, {message:"Password must be atleast 8 characters long"})
});