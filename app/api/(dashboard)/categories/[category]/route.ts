
import connect from "@/lib/db";
import Category from "@/lib/modals/category";
import User from "@/lib/modals/user";

import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const PATCH = async (request: Request,context:{params:any}) => {
    const categoryId = context.params.category
    try {
        const body = await request.json();
        const {title} = body
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get('userId')

        if(!userId || Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message: 'userId is not found'}), {status: 404})
        }
        if(!categoryId || Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({message: 'categoryId is not found'}), {status: 404})
        }
        await connect();

        const user = await User.findById(userId);
        if(!user){
            return new NextResponse(JSON.stringify({message: 'user not found'}), {status: 404})
        }
        const category = await Category.findOne({ _id: categoryId,user:userId });

        if(!category){
            return new NextResponse(JSON.stringify({message: 'category not found'}), {status: 404})
        }
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, {title},{new: true});

        return new NextResponse(JSON.stringify({message: 'category updated', category: updatedCategory}), {status: 200})

        
    } catch (error:any) {
        return new NextResponse("Error in updating category "+ error.message, { status: 500 });
        
    }
}

export const DELETE = async(request: Request,context:{params:any}) => {
    const categoryId = context.params.category
    try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get('userId')
        if(!userId || Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message: 'userId is not found'}), {status: 404})
        }
        if(!categoryId || Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({message: 'categoryId is not found'}), {status: 404})
        }
        await connect();
        const user = await User.findById(userId);
        if(!user){
            return new NextResponse(JSON.stringify({message: 'user not found'}), {status: 404})
        }
        const category = await Category.findOne({ _id: categoryId,user:userId });
        if(!category){
            return new NextResponse(JSON.stringify({message: 'category not found ord does not belong to user'}), {status: 404})
        }
        await category.findByIdAndDelete(categoryId)
        return new NextResponse(JSON.stringify({message: 'category deleted'}), {status: 200})
    } catch (error:any) {
        return new NextResponse("Error in deleting category "+ error.message, { status: 500 });
    }

}