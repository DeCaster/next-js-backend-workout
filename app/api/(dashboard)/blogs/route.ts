
import connect from "@/lib/db";
import Category from "@/lib/modals/category";
import User from "@/lib/modals/user";
import Blog from "@/lib/modals/blog";
import { Types } from "mongoose";
import { NextResponse } from "next/server";


//how to add middlewares

export const GET = async (req: Request) => {
    try {
        const {searchParams} = new URL(req.url);
        const userId = searchParams.get('userId');
        const categoryId = searchParams.get('categoryId');
        const searchKeywords = searchParams.get('keywords') as string
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')
        const page:any= parseInt(searchParams.get('page') || '1')
        const limit:any = parseInt(searchParams.get('limit')|| '10')//how many blocks need toi be visible

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message: 'userId is not found'}), {status: 404});
        }
        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({message: 'categoryId is not found'}), {status: 404});
        }
        await connect();
        const user = await User.findById(userId);
        if(!user){
            return new NextResponse(JSON.stringify({message: 'user not found'}), {status: 404});
        }
        const category = await Category.findById(categoryId);
        if(!category){
            return new NextResponse(JSON.stringify({message: 'category not found'}), {status: 404});
        }
        
        const filter: any = {
            user:new Types.ObjectId(userId),
            categoryId: new Types.ObjectId(categoryId)
        };
        if(searchKeywords){
            filter.$or = [
                {
                    title:{$regex:searchKeywords,$options:'i'}
                },
                {
                    description:{$regex:searchKeywords,$options:'i'}
                },

            ]
        }
        if(startDate && endDate){
            filter.createdAt = {
                $gte: new Date(startDate),//greater than equals to
                $lte: new Date(endDate)//less than equals to
            } 
        }else if(startDate){
            filter.createdAt = {
                $gte: new Date(startDate),//greater than equals to
            }
        }else if(endDate){
            filter.createdAt = {
                $lte: new Date(endDate),//less than equals to
            }
        }
        const skip = (Number(page) - 1) * Number(limit);
        const blogs = await Blog.find(filter).sort({ createdAt: 'asc' }).skip(skip).limit(Number(limit));//sort this data out in ascending order desc means descending yukselen ve azalan anlaminda

        return new NextResponse(JSON.stringify(blogs), { status: 200 });
    } catch (error:any) {
        return new NextResponse("Error"+error.message, { status: 500 });
    }
}

export const POST = async (req: Request) => {
    try {
        const {searchParams} = new URL(req.url);
        const userId = searchParams.get('userId');
        const categoryId = searchParams.get('categoryId');

        const body = await req.json();
        const {title,description} = body

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message: 'userId is not found'}), {status: 404});
        }
        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({message: 'categoryId is not found'}), {status: 404});
        }
        await connect();
        const user = await User.findById(userId);
        if(!user){
            return new NextResponse(JSON.stringify({message: 'user not found'}), {status: 404});
        }
        const category = await Category.findById(categoryId);
        if(!category){
            return new NextResponse(JSON.stringify({message: 'category not found'}), {status: 404});
        }
        const newBlog = new Blog({
            title,
            description,
            user: new Types.ObjectId(userId),
            categoryId: new Types.ObjectId(categoryId)
        })
        await newBlog.save();
        return new NextResponse(JSON.stringify({message: 'blog created',blog:newBlog}), { status: 200 });
    } catch (error:any) {
        
    }
}