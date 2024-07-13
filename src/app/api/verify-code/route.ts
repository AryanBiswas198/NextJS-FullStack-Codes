import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod';

export async function POST(request: Request){
    await dbConnect();
    try{
        const {username, code} = await request.json();

        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({username: decodedUsername});

        if(!user){
            return Response.json({
                success: false,
                message: "User Not Found",
            }, {status: 401});
        }

        const isCodeValid = user.verifyCode == code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "Account verified successfully",
            }, {status: 200});
        }
        else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification Code has Expired, Please Sign-up again to get a new Code",
            }, {status: 400});
        }
        else{
            return Response.json({
                success: false,
                message: "Incorrect Verification Code!!",
            }, {status: 400});
        }
    }catch(err: any){
        console.error('Error verifying User ', err);
        return Response.json({
            success: false,
            message: "Error verifying User",
        }, {status: 500});
    }
}