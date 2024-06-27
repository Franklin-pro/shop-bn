import express from 'express'
import cloudinary from '../utilies/cloud.js'
import Blog from '../model/blogs.js'
import success from '../utilies/success.js'
import errormessage from '../utilies/errormessage.js'



class BlogController{
    static async createBlog(req,res){
        const {blogTitle,blogsDescription} = req.body
        if(!req.file){
            return res.status(400).json({message: 'Please upload a blog image.'})
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder:'product'
        })

        const product = await Blog.create({
            blogsImage:{
                public_id : result.public_id,
                url : result.secure_url
            },
            blogTitle,
            blogsDescription
        });
        if (!product) {
            return res.status(500).json({ message: 'Failed to create blogs.' });
        } else {
            return res.status(201).json({ message: 'Blog posted successfully', product });
        }
    }
    static async getAllBlog(req,res){
        const blog = await Blog.find();
        if(blog){
            return success(res,200,'all blog retrived',blog)
        }
        else{
            return errormessage(res,401,`no blog retrived`)
        }
    }
}

export default BlogController