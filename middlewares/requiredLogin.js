module.exports = (req,res,next)=>
{
  if(!req.user){
      res.status(401).send({error:'you have to sign in '});
  }
  next();
};