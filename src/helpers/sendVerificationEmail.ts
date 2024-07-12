import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string, 
    username: string,
    password: string,
    verifyCode: string,
): Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from: 'you@example.com',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
        });

        return {
            success: true,
            message: "Verification Email sent successfully !!",
        };
    }catch(err: any){
        console.error("Error Sending Verification Email: ", err);
        return {
            success: false,
            message: "Failed to send Verification Email",
        }
    }
}