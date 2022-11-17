import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Store } from '../utils/Store';
import CheckoutWizard from './components/CheckoutWizard'
import Layouts from './components/Layouts'

export default function PaymentScreen() {
    const router = useRouter()
    const [selectPaymentMethod,setSelectPaymentMethod] = useState('');
    const {state, dispatch} = useContext(Store)
    const {cart} = state;
    const {shippingAddress, paymentMethod} = cart;
    const submitHandler =(e)=>{
        e.preventDefault();
        if (!selectPaymentMethod) {
            toast.error("Payment method is required")
        }
        dispatch({
            type:"SAVE_PAYMENT_METHOD",
            payload:selectPaymentMethod
        })
        Cookies.set('cart',
            JSON.stringify({
                ...cart,
                paymentMethod:selectPaymentMethod,
            })
        )
    }
    useEffect(()=>{
        if (!shippingAddress.address) {
            return router.push('/shipping')
        }
        setSelectPaymentMethod(paymentMethod || '')
    },[router,setSelectPaymentMethod,paymentMethod])
  return (
    <Layouts title="Payment Method">
        <CheckoutWizard activeStep={2}/>
        <form className='mx-auto max-w-screen-md ' onSubmit={submitHandler}>
            {
                // ['PayPal','Stripe','CashOnDelivery'].map((payment)=>(
                ['PayPal','Stripe','CashOnDelivery'].map((payment)=>(
                    <div key={payment} className="mb-4">
                        <input 
                            name='paumentMethod'
                            className='p-2 outline-none focus:ring-0'
                            id={payment}
                            type="radio"
                            checked={selectPaymentMethod===payment}
                            onChange={()=>setSelectPaymentMethod(payment)}
                        />
                        <label className='p-2 text-lg' htmlFor={payment}>{payment}</label>
                    </div>
                ))
            }
            <div className='mb-4 flex justify-between'>
                <button onClick={()=> router.push('/shipping')} type="button" className='rounded font-bold bg-teal-300 py-2 px-4 shadow outline-none hover:bg-teal-400 active:bg-teal-500'>
                    Back
                </button>
                <button onClick={()=> router.push('/placeorder')} className='rounded font-bold bg-teal-300 py-2 px-4 shadow outline-none hover:bg-teal-400 active:bg-teal-500'>Next</button>

            </div>
        </form>
    </Layouts>
  )
}
PaymentScreen.auth = true;