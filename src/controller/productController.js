import express from 'express'
import success from '../utilies/success.js'
import errormessage from '../utilies/errormessage.js'
import Product from '../model/product.js'
import cloudinary from '../utilies/cloud.js'
class productController {
    static async postProduct(req, res) {
        try {
            const { productName, productDescription, productPrice } = req.body;
            
            if (!req.file) {
                return res.status(400).json({ message: 'Please upload a product image.' });
            }
            
            // Upload image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'product'
            });
            
            // Create product with image data
            const product = await Product.create({
                productImage: {
                    public_id: result.public_id,
                    url: result.secure_url,
                },
                productName,
                productDescription,
                productPrice
            });
            
            if (!product) {
                return res.status(500).json({ message: 'Failed to create product.' });
            }
            
            return res.status(201).json({ message: 'Product posted successfully', product });
            
        } catch (error) {
            console.error('Error occurred:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    
static async getAllProduct(req,res){
    try {
        const product = await Product.find();
        if (product) {
            return success(res,200,` all product retrived`, product)
        } else {
            return errormessage(res,`failed to retrived`)
        }
    } catch (error) {
        console.log(`error is :`,error)
    }
}

static async getOneProduct(req,res){
    try {
        const id = req.params.id
        const product = await Product.findById(id)
         if (product) {
            return success(res,200,`data retrived successfully`,product)
         } else {
            return errormessage(res,401,`no data found`)
         }
    } catch (error) {
        
    }
}
static async deleteAllProduct(req,res){
    try {
        const product = await Product.deleteMany();
        if(product){
            return errormessage(res,201,`product deleted successfully`)
        }else{
            return errormessage(res,401,`product not deleted`)
        }
    } catch (error) {
        
    }
}

static async deleteOneProduct(req,res){
    try {
        const proId = req.params.id
        const product = await Product.findByIdAndDelete(proId);
        if(product){
            return errormessage(res,201,`product deleted successfully`)
        }else{
            return errormessage(res,401,`product not deleted by ${proId}`)
        }
    } catch (error) {
        
    }
}
static async updateProduct(req,res){
    try {
        const prodId = req.params.id
        const product = await Product.findByIdAndUpdate(prodId, req.body, {new : true})
        if(product){
            return success(res,200,`product successfully updated`,product)
        }
    } catch (error) {
        
    }
}
}
export default productController
