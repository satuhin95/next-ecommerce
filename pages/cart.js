import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react'
import { Store } from '../utils/Store'
import Layouts from '../components/Layouts';
import {XCircleIcon} from '@heroicons/react/outline'
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import axios from 'axios';
 function CartScreen() {
    const {state,dispatch} = useContext(Store);
    const router = useRouter(); 
    const { cart:{cartItems},} = state;
    const removeItem = (item)=>{
        dispatch({
            type:"CART_REMOVE_ITEM",
            payload:item
        })
        toast.error('Product remove to the cart')
        
    }
    
    const updateCartHandler =async (item,qty)=>{
        const quantity = Number(qty);
        const {data} = await axios.get(`/api/products/${item._id}`);
        
        if (data.countInStock < quantity) {
           return toast.error('Product Out of stock')
        }
        dispatch({
            type:"CART_ADD_ITEM",
            payload:{...item, quantity}
        })
        toast.success('Product updated in the cart')
    }
  return (
    <Layouts>
        <h1 className='mb-4 text-xl'>Shopping Cart</h1>
        {
            cartItems.length ===0 ?(
                <div>
                    Cart is empty. <Link href="/">Go Shopping</Link>
                </div>
            ):(<div className='grid md:grid-cols-4 md:gap-5'>
                <div className='overflow-x-auto md:col-span-3'>
                    <table className='min-w-full'>
                        <thead className='border-b'>
                            <tr>
                                <th className='px-5 text-left'>Item</th>
                                <th className='px-5 text-right'>Quentity</th>
                                <th className='px-5 text-right'>Price</th>
                                <th className='px-5 text-right'>Action</th>
                            </tr>
                            </thead> 
                           <tbody>
                            {cartItems.map((item)=>(
                                <tr key={item.slug} className="border-b">
                                    <td>
                                        <Link href={`/product/${item.slug}`}>
                                            <div className='flex items-center'>
                                            <Image src={item.image}
                                            alt={item.name}
                                            width={50}
                                            height={50}
                                            >
                                            </Image> &nbsp; {item.name}
                                            </div>
                                        </Link>
                                    </td>
                                    <td className='p-5 text-right'>
                                        <select value={item.quantity} onChange={(e)=>updateCartHandler(item, e.target.value)}>
                                            {[...Array(item.countInStock).keys()].map((i)=>(
                                                <option key={i + 1} value={i + 1}>
                                                    {i + 1}
                                                </option>
                                            
                                            ))}
                                            
                                        </select>
                                    </td>
                                    <td className='p-5 text-right'>${item.price}</td>
                                    <td className='p-5 text-right'>
                                        <button onClick={()=>removeItem(item)}>
                                            <XCircleIcon className="h-5 w-5"></XCircleIcon>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                           </tbody>
                        
                    </table>
                </div>
                <div className='md-5 block rounded-lg border border-gray-200 shadow-md p-5'>
                    <ul>
                        <li>
                            <div className='pb-4 text-xl'>Subtotal ({cartItems.reduce((a,c) => a + c.quantity,0)})
                            {' '}
                            : $ 
                            {cartItems.reduce((a,b)=>a + b.quantity * b.price,0)}
                            </div>
                        </li>
                        <li>
                            <button onClick={()=>router.push('login?redirect=/shipping')} className='rounded font-bold bg-teal-300 py-2 px-4 shadow outline-none hover:bg-teal-400 active:bg-teal-500 w-full'>
                                Check Out
                            </button>
                        </li>
                    </ul>
                </div>
            </div>)
        }
    </Layouts>
  )
}

export default dynamic(()=>Promise.resolve(CartScreen), {ssr:false})
