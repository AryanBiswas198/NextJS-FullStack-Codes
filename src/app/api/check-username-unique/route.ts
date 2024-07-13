import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod';
import { usernameValidation } from "@/schemas/signupSchema";
import { NextResponse } from "next/server";

// Create Query Schema
const UsernameQuerySchema = z.object({
    username: usernameValidation,

})

export async function GET(request: Request){
    await dbConnect();
    try{
        const {searchParams} = new URL(request.url);

        const queryParams = {
            username: searchParams.get('username'),
        }

        // Validate with zod
        const result = UsernameQuerySchema.safeParse(queryParams);
        console.log(result);

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(',') : "Invalid query parameters",
            }, {status: 400});
        }

        const {username} = result.data;

        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true});

        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: "Username is already taken !!",
            }, {status: 400});
        }

        return Response.json({
            success: true,
            message: "Username is Available!!",
        }, {status: 200});

    }
    catch(err: any){
        console.error("Error Checking Username ", err);
        return Response.json({
            success: false,
            message: "Error Checking Username",
        }, {status: 500});
    }

}