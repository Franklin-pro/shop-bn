import express from 'express'
import BlogController from '../controller/blogController.js'
import upload from '../validation/productUpload.js'

const router = express.Router()


router.post('/',upload.single('blogsImage'),BlogController.createBlog)
router.get('/',BlogController.getAllBlog)

export default router