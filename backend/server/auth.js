function requireAdmin(req,res,next){
  const expected=process.env.ADMIN_TOKEN;
  const received=req.headers.authorization||"";
  const token=received.startsWith("Bearer ")?received.slice(7):"";
  if(!expected) return res.status(500).json({error:"ADMIN_TOKEN no está configurado."});
  if(!token || token!==expected) return res.status(401).json({error:"No autorizado."});
  next();
}
module.exports={requireAdmin};
