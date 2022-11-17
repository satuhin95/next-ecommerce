import  {  useRouter } from 'next/router'
import Layouts from '../../components/Layouts';
import Link from 'next/link';
import Image from 'next/image';
import { useContext } from 'react';
import { Store } from '../../utils/Store';
import db from '../../utils/db';
import Product from '../../models/Product';
import axios from 'axios';
import { toast } from 'react-toastify';


export default function ProductScreen(props) {
    const {product} = props;
    const {state,dispatch} = useContext(Store)
    const router = useRouter();
   
    if (!product) {
        return <div>Product Not Found!</div>
    }
    const cartHandaler = async()=>{
      const existItem = state.cart.cartItems.find((x)=>x.slug === product.slug);
      const quantity = existItem ? Number(existItem.quantity || 0) + 1 : 1;
      const {data} = await axios.get(`/api/products/${product._id}`);


      if (data.countInStock < quantity) {
        return toast.error('Product Out of stock')
          ;
      }
      dispatch({
        type:'CART_ADD_ITEM',
        payload:{...product,quantity}
      });
      router.push('/cart')
      toast.success('Product added to the cart')
    }
  return (
    <Layouts title={product.name}>
        <div className='py-2'>
          <Link  href="/"> <p className='text-blue-500'> Back To Products</p></Link>
        </div>
        <div className='grid md:grid-cols-4 md:gap-3'>
          <div className='md:col-span-2'>
            <Image 
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
             /> 

          </div>
          <div className='md:col-span-1'>
            <ul>
              <li>
                <h1 className='text-lg'>{product.name}</h1>
              </li>
              <li>Category: {product.category} </li>
              <li>Brand: {product.brand} </li>
              <li>{product.rating}  of {product.numReviews} reviews</li>
              <li>Description: {product.description} </li>
            </ul>
          </div>
          <div>
          <div className='md-5 block rounded-lg border border-gray-200 shadow-md p-5'>
            <div className='mb-2 flex justify-between'>
              <div>Price</div>
              <div> ${product.price}</div>
            </div>
              <div className='mb-2 flex justify-between'>
                <div>Status</div>
                <div>{product.countInStock > 0? 'In Stock' : 'Unavailable'}</div>
            </div>
            <button  onClick={cartHandaler} className='w-full rounded font-bold bg-teal-300 py-2 px-4 shadow outline-none hover:bg-teal-400 active:bg-teal-500'>Add To Cart</button>
          </div>
      
          </div>
        </div>
    </Layouts>
  )
}
export async function getServerSideProps(context){
  const {params} = context;
  const {slug} = params;
  await db.connect();
  const product = await Product.findOne({slug}).lean();
  await db.disconnect();
  return{
    props:{
      product: product ? db.convertDocToObj(product) : null,
    }
  }

}