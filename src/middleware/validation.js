import {check,validationResult} from "express-validator"
import errormessage from "../utilies/errormessage.js"


class validator{
    static inputvalidator(req,res,next){
        const error=validationResult(req)

        if(!error==error.isEmpty()){
            error.errors.map((err)=>{
                return errormessage(res,401,err.msg)
            })
        }else{
            return next()
        }
    }

    static userAccountRule(){
        return[
            // check("fullName","please write your firstName correctly").trim().isAlpha(),
            check("email","please write your email correctly").trim().isEmail(),
            check("password","make  your stronger password").trim().isStrongPassword(),
           
        ]
    }
}
export default validator