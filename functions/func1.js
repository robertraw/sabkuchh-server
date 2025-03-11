export const checkUser=(req,res)=>{
    let {name,password}=req.body;
    if(name=='rohit'&&password=='12344321')
        res.json('ok')
    else res.status(401).json({message:'invalid'})
}
const checkUsername =(users,req,res)=>{
  for (let i in  users)
  { if (users[i].email==req.body.email)
      return users[i] ;}
    return false;
}