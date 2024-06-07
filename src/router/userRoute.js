import express from 'express'
import userController from '../controller/userController'
import DataChecker from '../middleware/datachecker'
import validator from '../middleware/validation'

const router = express.Router()

router.post('/',DataChecker.emailExist,validator.userAccountRule(),validator.inputvalidator,userController.createUser)
router.get('/',userController.getAllUser)
router.delete('/',userController.deleteAllUser)
router.post('/login',userController.login)
router.post('/forgot',userController.forgotPassword)
router.post('/reset/:token',userController.resetPassword)


export default router