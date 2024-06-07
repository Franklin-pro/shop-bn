import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type:String,
        required:true
    },
    productImage: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    productDescription: {
        type:String,
        required:true
    },
    productPrice: {
        type:String,
        required:true
    },
    postedAt: {
        type:Date,
        default: new Date(Date.now()),
    },
})

const Product = mongoose.model("Product", productSchema)

export default Product