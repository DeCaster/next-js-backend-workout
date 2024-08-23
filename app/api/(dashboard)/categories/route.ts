import connect from "@/lib/db";
import Category from "@/lib/modals/category";
import User from "@/lib/modals/user";

import { Types } from "mongoose";
import { NextResponse } from "next/server";


export const GET = async (req: Request) => {
    try {
        const {searchParams} = new URL(req.url)
        const userId = searchParams.get('userId')

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message: 'UserId is not found'}), {status: 404})
        }
        await connect();// it is not necessary
        const user = await User.findById(userId)
        if(!user){
            return new NextResponse(JSON.stringify({message: 'User is not valid in database'}), {status: 404})
        }
        const categories = await Category.find({user: new Types.ObjectId(userId)})
        return new NextResponse(JSON.stringify(categories), {status: 200})

    } catch (error) {
        return new NextResponse(JSON.stringify({message: 'Something went wrong(error was catched)'}), {status: 500})
    }
}
export const POST = async (req: Request) => {
    try {
        const {searchParams} = new URL(req.url)
        const userId = searchParams.get('userId')
        const {title} = await req.json()
        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message: 'UserId is not found'}), {status: 404})
        }
        await connect();
        const user = await User.findById(userId)
        if(!user){
            return new NextResponse(JSON.stringify({message: 'User is not valid in database'}), {status: 404})
        }
        const newCategory = await Category.create({title, user: new Types.ObjectId(userId)})
        
        await newCategory.save()
        return new NextResponse(JSON.stringify({message:'category is created', category: newCategory}), {status: 200})

    } catch (error) {
        return new NextResponse(JSON.stringify({message: 'Something went wrong(error was catched)'}), {status: 500})
    }
}