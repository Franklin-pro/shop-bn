import express from 'express'
import BlogController from '../controller/blogController'
import upload from '../validation/productUpload'

const router = express.Router()


router.post('/',upload.single('blogsImage'),BlogController.createBlog)
router.get('/',BlogController.getAllBlog)

export default router