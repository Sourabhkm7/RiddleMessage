import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials:{
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier.email },
                            { username: credentials.identifier }
                        ]
                    })
                    if(!user) {
                        throw new Error("No user found with this email or username");
                    }
                    if(!user.isVerified) {
                        throw new Error("Please verify your account first");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if(isPasswordCorrect) {
                        return user;
                    } else{
                        throw new Error("Password is incorrect");
                    }
                    
                } catch (err:any) {
                    throw new Error(err.message);
                    
                }
            }

        })
    ],
    callbacks: {
        async jwt({token, user}) {
            return token;
        },
        async session({session,token}) {
            return session;
        },
        
    },

    pages:{
        signIn: '/sign-in'
    },
    session:{
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    
}