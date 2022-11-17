import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Store } from '../utils/Store'
import CheckoutWizard from './components/CheckoutWizard'
import Layouts from './components/Layouts'
import {getError} from '../utils/error'
import axios from 'axios'
import Cookies from 'js-cookie'
export default function PlaceOrderScreen() {
    const [loading ,setLoading] = useState(false);
    const router = useRouter();
    const {state ,dispatch} = useContext(Store);
    const {cart} = state;
    const {cartItems,shippingAddress,paymentMethod} = cart;

    const  round2 = (num)=> Math.round(num * 100 + Number.EPSILON) / 100; 
 
    const itemsPrice = round2(cartItems.reduce((a,b)=>a + b.quantity * b.price,0));
    const shippingPrice = itemsPrice > 200 ? 0: 15;
    const taxPrice = round2(itemsPrice * 0.15);
    const totalPrice = round2(itemsPrice  + shippingPrice + taxPrice);

    useEffect(()=>{
        if (!paymentMethod) {
            router.push('/payment')
        }
    },[router,paymentMethod])
    const placeOrderHandler = async()=>{
        try {
            setLoading(true);
            const {data} = await axios.post('/api/orders',{
                orderItems:cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice
            })
            setLoading(false)
            dispatch({ type:"CART_CLEAR_ITEMS"})
            Cookies.set('cart',JSON.stringify({
                ...cart,
                cartItems:[],
            }))
            router.push(`/order/${data._id}`);
            
        } catch (error) {
            setLoading(false)
            toast.error(getError(error))
        }
    }
  return (
    <Layouts title="Place Order">
        <CheckoutWizard activeStep={3}/>
        <h1 className='mb-4 text-xl'>Place Order</h1>
        {cartItems.length ===0?
        (
            <div>Cart is Empty. <Link href="/">Go Shopping</Link> </div>
        ):(
            <div className='grid md:grid-cols-4 md:gap-5'>
                <div className='overflow-x-auto md:col-span-3'>
                    <div className='mb-5  p-5 block rounded-lg border border-gray-200 shadow-md'>
                        <h2 className='mb-2 text-lg'>Shipping Address</h2>
                        <div>
                            {shippingAddress.fullName},{shippingAddress.address},{" "}
                            {shippingAddress.city},{shippingAddress.zipCode},{" "}
                            {shippingAddress.country}
                        </div>
                        <div className='mt-3'>
                        <Link href="/shipping">
                             <span className='text-blue-500 text-lg'>Edit</span>
                         </Link>
                         </div>
                    </div>
                    <div className='mb-5  p-5 block rounded-lg border border-gray-200 shadow-md'>
                        <h2 className='mb-2 text-lg'>Payment Method</h2>
                        <div>{paymentMethod}</div>
                        <div className='mt-3'>
                         <Link href="/payment">
                             <span className='text-blue-500 text-lg'>Edit</span>
                         </Link>
                        </div>
                    </div>  
                    <div className='mb-5  p-5 block rounded-lg border border-gray-200 shadow-md overflow-x-auto'>
                        <h2 className='mb-2 text-lg'>Order Items</h2>
                        <table className='min-w-full'>
                        <thead className='border-b'>
                            <tr>
                                <th className='px-5 text-left'>Item</th>
                                <th className='px-5 text-right'>Quentity</th>
                                <th className='px-5 text-right'>Price</th>
                                <th className='px-5 text-right'>Subtotal</th>
                            </tr>
                            </thead> 
                            <tbody>
                                {cartItems?.map((item)=>(
                                    <tr key={item._id} className='border-b'>
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
                                    <td className='p-5 text-right'>{item.quantity}</td>
                                    <td className='p-5 text-right'>${item.price}</td>
                                    <td className='p-5 text-right'>${item.price * item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                        <div className='mt-3'>
                         <Link href="/cart">
                             <span className='text-blue-500 text-lg'>Edit</span>
                         </Link>
                        </div>
         
                    </div>   
                    
                </div>
                <div>
                    <div className='mb-5  p-5 block rounded-lg border border-gray-200 shadow-md'>
                        <h2 className='mb-2 text-lg'>Order Summary</h2>
                        <ul>
                            <li>
                                <div className='mb-2 flex justify-between'>
                                    <div>Items</div>
                                    <div>${itemsPrice}</div>
                                </div>
                            </li>
                            <li>
                                <div className='mb-2 flex justify-between'>
                                    <div>Tax</div>
                                    <div>${taxPrice}</div>
                                </div>
                            </li>
                            <li>
                                <div className='mb-2 flex justify-between'>
                                    <div>Shipping</div>
                                    <div>${shippingPrice}</div>
                                </div>
                            </li>
                            <li>
                                <div className='mb-2 flex justify-between'>
                                    <div>Total</div>
                                    <div>${totalPrice}</div>
                                </div>
                            </li>
                            <li>
                                <button 
                                disabled={loading}
                                onClick={placeOrderHandler}
                                className="w-full rounded font-bold bg-teal-300 py-2 px-4 shadow outline-none hover:bg-teal-400 active:bg-teal-500"
            
                                >
                                    {loading? "Loading...":"Place Order"}

                                </button>
                            </li>
                        </ul>            
                    </div>
                </div>
            </div>
        )

        }
    </Layouts>
  )
}
PlaceOrderScreen.auth = true;
