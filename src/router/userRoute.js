import express from 'express'
import userController from '../controller/userController.js'
import DataChecker from '../middleware/datachecker.js'
import validator from '../middleware/validation.js'

const router = express.Router()

router.post('/',DataChecker.emailExist,validator.userAccountRule(),validator.inputvalidator,userController.createUser)
router.get('/',userController.getAllUser)
router.delete('/',userController.deleteAllUser)
router.delete('/:id',userController.deleteOneUser)
router.post('/login',userController.login)
router.post('/forgot',userController.forgotPassword)
router.post('/reset/:token',userController.resetPassword)


export default router