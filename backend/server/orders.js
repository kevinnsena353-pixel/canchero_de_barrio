const express=require("express");
const pool=require("./db");
const {requireAdmin}=require("./auth");
const router=express.Router();

function makeReference(){
  const d=new Date().toISOString().slice(0,10).replaceAll("-","");
  return `CAN-${d}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
}
function normalizeItem(item){
  const quantity=Math.max(1,parseInt(item.quantity,10)||1);
  const price=Math.max(0,Math.round(Number(item.unitPrice)||0));
  return {
    type:String(item.type||"product").slice(0,30),
    name:String(item.name||item.garment||"Producto").slice(0,200),
    modelId:item.modelId?String(item.modelId).slice(0,120):null,
    garment:item.garment?String(item.garment).slice(0,120):null,
    size:item.size?String(item.size).slice(0,30):null,
    color:item.color?String(item.color).slice(0,80):null,
    designId:item.designId?String(item.designId).slice(0,120):null,
    designName:item.designName?String(item.designName).slice(0,200):null,
    designSrc:item.designSrc?String(item.designSrc).slice(0,2000):null,
    quantity,unitPriceCents:price*100,itemData:item
  };
}

router.post("/",async(req,res)=>{
  const client=await pool.connect();
  try{
    const {customer,shipping,items,notes}=req.body||{};
    if(!customer?.name||!customer?.email||!customer?.phone) return res.status(400).json({error:"Faltan datos del cliente."});
    if(!shipping?.address||!shipping?.city) return res.status(400).json({error:"Faltan datos de entrega."});
    if(!Array.isArray(items)||!items.length) return res.status(400).json({error:"El carrito está vacío."});
    const normalized=items.map(normalizeItem);
    const totalCents=normalized.reduce((s,i)=>s+i.unitPriceCents*i.quantity,0);
    if(totalCents<=0) return res.status(400).json({error:"Total inválido."});

    await client.query("BEGIN");
    const ref=makeReference();
    const r=await client.query(
      `INSERT INTO orders(reference,customer_name,customer_email,customer_phone,shipping_address,shipping_city,total_cents,currency,notes)
       VALUES($1,$2,$3,$4,$5,$6,$7,'COP',$8) RETURNING id,reference,created_at`,
      [ref,String(customer.name).trim(),String(customer.email).trim().toLowerCase(),String(customer.phone).trim(),
       String(shipping.address).trim(),String(shipping.city).trim(),totalCents,notes?String(notes).slice(0,2000):null]);
    const order=r.rows[0];
    for(const i of normalized){
      await client.query(
        `INSERT INTO order_items(order_id,type,name,model_id,garment,size,color,design_id,design_name,design_src,quantity,unit_price_cents,item_data)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [order.id,i.type,i.name,i.modelId,i.garment,i.size,i.color,i.designId,i.designName,i.designSrc,i.quantity,i.unitPriceCents,JSON.stringify(i.itemData)]);
    }
    await client.query("COMMIT");
    res.status(201).json({ok:true,order:{id:order.id,reference:order.reference,totalCents,totalCop:totalCents/100,paymentStatus:"pending",orderStatus:"new"}});
  }catch(e){await client.query("ROLLBACK");console.error(e);res.status(500).json({error:"No se pudo crear el pedido."});}
  finally{client.release();}
});

router.get("/",requireAdmin,async(req,res)=>{
  try{
    const r=await pool.query(`SELECT id,reference,customer_name,customer_email,customer_phone,shipping_city,total_cents,currency,order_status,payment_status,payment_provider,payment_reference,payment_transaction_id,created_at,updated_at FROM orders ORDER BY created_at DESC LIMIT 200`);
    res.json({orders:r.rows});
  }catch(e){console.error(e);res.status(500).json({error:"No se pudieron cargar los pedidos."});}
});
router.get("/:id",requireAdmin,async(req,res)=>{
  try{
    const o=await pool.query("SELECT * FROM orders WHERE id=$1",[req.params.id]);
    if(!o.rows[0]) return res.status(404).json({error:"Pedido no encontrado."});
    const i=await pool.query("SELECT * FROM order_items WHERE order_id=$1 ORDER BY id",[req.params.id]);
    res.json({order:o.rows[0],items:i.rows});
  }catch(e){console.error(e);res.status(500).json({error:"No se pudo cargar el pedido."});}
});
router.patch("/:id/status",requireAdmin,async(req,res)=>{
  const os=["new","processing","ready","shipped","completed","cancelled"], ps=["pending","approved","declined","voided","error"];
  const {orderStatus,paymentStatus}=req.body||{};
  if(orderStatus&&!os.includes(orderStatus)) return res.status(400).json({error:"Estado de pedido inválido."});
  if(paymentStatus&&!ps.includes(paymentStatus)) return res.status(400).json({error:"Estado de pago inválido."});
  try{
    const r=await pool.query(`UPDATE orders SET order_status=COALESCE($1,order_status),payment_status=COALESCE($2,payment_status) WHERE id=$3 RETURNING *`,
      [orderStatus||null,paymentStatus||null,req.params.id]);
    if(!r.rows[0]) return res.status(404).json({error:"Pedido no encontrado."});
    res.json({ok:true,order:r.rows[0]});
  }catch(e){console.error(e);res.status(500).json({error:"No se pudo actualizar el pedido."});}
});
module.exports=router;
