import Layouts from '../components/Layouts';
import ProductItem from '../components/ProductItem';
import db from '../utils/db'
import Product from "../models/Product";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../utils/Store";
import { toast } from "react-toastify";
export default function Home({products}) {
    const {state,dispatch} = useContext(Store)
    const {cart} = state;
     const cartHandaler = async(product)=>{
      const existItem = cart.cartItems.find((x)=>x.slug === product.slug);
      const quantity = existItem ? Number(existItem.quantity || 0) + 1 : 1;
      const {data} = await axios.get(`/api/products/${product._id}`);


    if (data.countInStok < quantity) {
      toast.error('Sorry. Product Is Out of stock')
        return;
    }
    dispatch({
      type:'CART_ADD_ITEM',
      payload:{...product,quantity}
    });

    toast.success('Product added to the cart')
    
  }
  
  return (
    <Layouts title="Ecommerce Home Page">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product,i)=>(
          <ProductItem product={product} key={i} cartHandaler={cartHandaler}/>
        ))}
      </div>
    </Layouts>
  )
}
export async function getServerSideProps(){
  await db.connect();
  const products = await Product.find().lean();
  return{
    props:{
      products:products.map(db.convertDocToObj),
    }
  }
}