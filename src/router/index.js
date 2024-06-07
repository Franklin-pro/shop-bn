import express from 'express'
import userRoute from './userRoute'
import productRoute from './productRoute'
import blogRoute from '../router/blogRoute'
const router = express.Router()

router.use('/user',userRoute)
router.use('/product',productRoute)
router.use('/blog',blogRoute)

export default router