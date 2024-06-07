import express from 'express'
import productController from '../controller/productController'
import upload from '../validation/productUpload'



const router = express.Router()

router.post('/',upload.single('productImage'),productController.postProduct)
router.get('/',productController.getAllProduct)
router.get('/:id',productController.getOneProduct)
router.delete('/',productController.deleteAllProduct)
router.delete('/:id',productController.deleteOneProduct)

export default router