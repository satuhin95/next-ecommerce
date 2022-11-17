import User from "../../../models/User";
import db from '../../../utils/db'
import bcrypt from 'bcryptjs'
import { toast } from "react-toastify";
async function handler(req,res){
    if (req.method !=='POST') {
        return;
    }
    const {name,email,password} = req.body;
    if (!name || !email || !email.includes('@') || !password || password.trim().length < 4) {
        res.status(422).send({
            message:"Validation error"
        })
        return;
    }
    
    const existinguser = await User.findOne({email:email})
    if(existinguser){
        res.status(422).send({
            message:"User already existe"
        })
        await db.disconnect();
        return;
    }
    const newUser = new User({
        name,
        email,
        password:bcrypt.hashSync(password),
        isAdmin:false,
    });
    const user = await newUser.save();
    await db.disconnect();
    res.status(201).send({
        message:'Created user!',
        _id:user._id,
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin,
    })
    toast.success('User registerd successfully')
}
export default handler;