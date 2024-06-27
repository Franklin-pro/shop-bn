import express from 'express'
import userRoute from './userRoute.js'
import productRoute from './productRoute.js'
import blogRoute from '../router/blogRoute.js'
import paymentRoute from '../router/paymentRoute.js'
const router = express.Router()

router.use('/user',userRoute)
router.use('/product',productRoute)
router.use('/blog',blogRoute)
router.use('/payment',paymentRoute)

export default router