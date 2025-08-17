"use server"

import { signIn, signOut } from "@/auth"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function Login(email:string, password:string){
    try {
        const existingUser = await prisma.user.findUnique({
            where: {email: email}
        })
        if(!existingUser){
            //check if the user is a lawyer
            const lawyer = await prisma.lawyer.findUnique({
                where: {email: email}
            });
            if(!lawyer){
                return {success: false, message: "User does not exist"}
            }
             const isMatch = bcrypt.compareSync(password, lawyer.password)
        if(!isMatch){
            return {success: false, message: "Incorrect password"}
        }
            await signIn("credentials", {
                email: email,
                password: password,
                redirect: true, // Redirect to the default NextAuth.js page after sign in
                redirectTo: "/dashbaord", // Redirect to dashboard after sign in
            })
        return {success: true, message: "Sign in successfully"}
        }
        const isMatch = bcrypt.compareSync(password, existingUser.password)
        if(!isMatch){
            return {success: false, message: "Incorrect password"}
        }
            await signIn("credentials", {
                email: email,
                password: password,
                redirect: false,
            })
        return {success: true, message: "Sign in successfully"}
    } catch (error) {
        console.error(error)
        return {success: false, message: "There's an error somewhere"}
    }
}

export async function LogOut(){
    await signOut(
        {redirectTo: "/login"} // Redirect to login page after sign out
    )
}

export async function SignUp(email:string, password:string, firstName: string, lastName:string,
        phoneNumber: string,
        address: string,
        city: string,
        state: string,
        zipCode: string,
        isIndigent: string,
        proofOfIndigencyUrl: string){
    try {
        const existingUser = await prisma.user.findUnique({
            where: {email: email}
        })
        if (existingUser){
            return {success: false, message: "Email already in use"}
        }

        await signIn("credentials", {
            email: email,
            password: password,
            redirect: false
        })
        return {success: true, message: "User created successfully"}
        
    } catch (error) {
        console.error(error)
        return {success: false, message: "Failed to create a user"}
    }
}

export async function lawyerSignUp(email:string, password:string, fullName: string,
        phoneNumber: string,
        nbaNumber: string,
        callToBarYear: string,
        stateOfCall: string,
        location: string,
        specialization: string,
        Bio: string,
        avatar: string,
        ){
    try {
        const existingUser = await prisma.user.findUnique({
            where: {email: email}
        })
        if (existingUser){
            return {success: false, message: "Email already in use"}
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        await prisma.lawyer.create({
            data: {
                email,
                password: hashedPassword,
                fullName,
                phoneNumber,
                nbaNumber,
                callToBarYear: parseInt(callToBarYear, 10),
                stateOfCall,
            }
        })
        return {success: true, message: "User created successfully"}
        
    } catch (error) {
        console.error(error)
        return {success: false, message: "Failed to create a user"}
    }
}