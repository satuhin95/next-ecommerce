import { getSession } from "next-auth/react"
import Order from "../../../../models/Order"
import db from "../../../../utils/db"

const handler = async(req,res)=>{
    const session = await getSession({req})
    if (!session) {
        return res.status(401).send('Error: signIn Reguired')
    }

    await db.connect();
    const order = await Order.findById(req.query.id);
    if (order) {
       if (order.isPaid) {
            return res.status(400).send({message:"Error: order is already paid"})
       } 

       order.isPaid = true;
       order.paidAt  = Date.now();
        await order.save();
       await db.disconnect();
       return res.send({message:"Order  paid Sussceefully"})
    }else{
        await db.disconnect();
        return res.status(400).send({message:"Error: order not found"})
    }
}
export default handler;