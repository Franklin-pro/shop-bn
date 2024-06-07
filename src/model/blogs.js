import mongoose from "mongoose";

const blogsSchema = new mongoose.Schema({
    blogsImage: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    blogTitle: {
        type:String,
        required:true
    },
    blogsDescription: {
        type:String,
        required:true
    },
postedAt: {
    type:Date,
    default:Date.now()
}
})

const Blog = mongoose.model('Blog',blogsSchema)

export default Blog