import User from "../model/user";
import errormessage from '../utilies/errormessage'

class DataChecker {
    static userRegisterIsEmpty=(req,res,next)=>{
        const {username,email,password}=req.body
      

        if(username==""){
            return errormessage(res,401,`please provide your userName`)
        }
    
        else if(email==""){
            return errormessage(res,401,`please provide yuor email`)
        }
        else if(password==""){  
            return errormessage(res,401,`please provide yuor password`)
        }
        else{
            return next()
        }
    }
static async emailExist(req,res,next){
    const email = req.body.email;
    const user = await User.findOne({email})

    if(user){
        return errormessage(res,401,`already email exist`)
    }else{
        return next()
    }
}
}
export default DataChecker