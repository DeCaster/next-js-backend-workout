
import connect from "@/lib/db";
import User from "@/lib/modals/user"
import { NextResponse } from "next/server"
import { Types } from "mongoose"
const ObjectId = require("mongoose").Types.ObjectId
export const GET = async () =>{
    try {
        await connect();
        const users = await User.find()
        return new NextResponse(JSON.stringify(users),{status:200})
    } catch (error) {
        return new NextResponse(JSON.stringify(error),{status:500})
    }
    
}

export const POST = async (request: Request) =>{
    try {
        const body = await request.json();
        await connect();
        const newUser = new User(body)
        await newUser.save()

        return new NextResponse(JSON.stringify({message:'user is created',user:newUser}),{status:201})

    } catch (error:any) {
        return new NextResponse(JSON.stringify(error),{status:500})    
    }
    
}
export const PATCH = async (request: Request) =>{
    try {
        const body = await request.json();
        const {userId, newUsername} = body
        await connect();//it is not necesery
        if(!userId || !newUsername){
            return new NextResponse(JSON.stringify({message:'userId or newUsername is required'}),{status:400})
        }
        if(!Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:'invalid userId'}),{status:400})
        }
        const updatedUser = await User.findByIdAndUpdate({_id:new ObjectId(userId)},{username:newUsername},{new:true})

        if(!updatedUser){
            return new NextResponse(JSON.stringify({message:'user not found'}),{status:404})
        }
        return new NextResponse(JSON.stringify({message:'user is updated',user:updatedUser}),{status:200})


    } catch (error:any) {
        return new NextResponse(JSON.stringify(error),{status:500})
    }
}
export const DELETE = async (request: Request) =>{
    try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get('userId')
        if(!userId){
            return new NextResponse(JSON.stringify({message:'userId is required'}),{status:400})
        }
        if(!Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:'invalid userId'}),{status:400})
        }
        await connect();// it not necesery
        const deletedUser = await User.findByIdAndDelete(new Types.ObjectId(userId))
        if(!deletedUser){
            return new NextResponse(JSON.stringify({message:'user not found'}),{status:404})
        }
        return new NextResponse(JSON.stringify({message:'user is deleted',user:deletedUser}),{status:200})
    } catch (error) {
        return new NextResponse(JSON.stringify(error),{status:500})
    }
}
//if we create document in parantesis it will none part of url