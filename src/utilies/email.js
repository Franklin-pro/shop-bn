import nodemailer from "nodemailer";

const sendLoginEmail=async(userinfo)=>{
    let transport=nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        },
    });
    let mailoptions={
        from:process.env.EMAIL,
        to:userinfo.email,
        subject:` Login Notification✅`,
        html:`<p><b>${userinfo.username}</b> Your Login Successfuly Done!!!! Thank you.🎉🎉🎊</p>`
    };
    transport.sendMail(mailoptions,function(err,info){
        if(err){
            console.log(err)
        }
        else{
            console.log(info)
        }
    });
}
export default sendLoginEmail