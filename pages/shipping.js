import React, { useContext, useEffect } from 'react'
import Layouts from '../components/Layouts'
import CheckoutWizard from '../components/CheckoutWizard'
import { useForm } from 'react-hook-form'
import { Store } from '../utils/Store'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
export default function ShippingScreen() {
    const router = useRouter();
    const {register,handleSubmit,setValue, formState: { errors }, } = useForm();

    const {state,dispatch} = useContext(Store);
    const {cart} = state;
    const {shippingAddress} = cart;

    useEffect(()=>{
        setValue('fullName',shippingAddress.fullName);
        setValue('address',shippingAddress.address);
        setValue('city',shippingAddress.city);
        setValue('zipCode',shippingAddress.zipCode);
        setValue('country',shippingAddress.country);
    },[setValue,shippingAddress])

    const submitHandler =({fullName, address, city, zipCode, country})=>{
        dispatch({
            type:"SAVE_SHIPPING_ADDRESS",
            payload:{fullName,address,city,zipCode,country},
        });
        Cookies.set('cart', 
        JSON.stringify({
            ...cart, 
            shippingAddress:{
                fullName,
                address,
                city,
                zipCode,
                country
            }
        }))
        router.push('/payment')
    }
  return (
   <Layouts title="Shipping Address">
    <CheckoutWizard activeStep={1}/>
    <form className='mx-auto max-w-screen-md' onSubmit={handleSubmit(submitHandler)}>
        <h1 className='mb-4 text-xl'>Shipping Address</h1>
        <div className='mb-4'>
            <label htmlFor='fullName'>FullName &nbsp;</label>
            <input className='w-full' id='fullName' autoFocus {...register('fullName',{
                required:"Please Enter Your Full Name"
            })} />
            {errors.fullName && (
                <div className='text-red-500'>{errors.fullName.message}</div>
            )}
        </div>
        <div className='mb-4'>
            <label htmlFor='address'>Address &nbsp;</label>
            <input className='w-full' id='address' autoFocus {...register('address',{
                required:"Please Enter Your address",
                minLength:{value:3, message:'Address is more then 3 chars'}
            })} />
            {errors.address && (
                <div className='text-red-500'>{errors.address.message}</div>
            )}
        </div>
        <div className='mb-4'>
            <label htmlFor='city'>City &nbsp;</label>
            <input className='w-full' id='city' autoFocus {...register('city',{
                required:"Please Enter Your city"
            })} />
            {errors.city && (
                <div className='text-red-500'>{errors.city.message}</div>
            )}
        </div>
        <div className='mb-4'>
            <label htmlFor='zipCode'>Zip Code &nbsp;</label>
            <input className='w-full' id='zipCode' autoFocus {...register('zipCode',{
                required:"Please Enter Your zipCode"
            })} />
            {errors.zipCode && (
                <div className='text-red-500'>{errors.zipCode.message}</div>
            )}
        </div>
        <div className='mb-4'>
            <label htmlFor='country'>Country &nbsp;</label>
            <input className='w-full' id='country' autoFocus {...register('country',{
                required:"Please Enter Your country"
            })} />
            {errors.country && (
                <div className='text-red-500'>{errors.country.message}</div>
            )}
        </div>
        <div className='mb-4 flex justify-between'>
            <button className='rounded font-bold bg-teal-300 py-2 px-4 shadow outline-none hover:bg-teal-400 active:bg-teal-500'>Next</button>
        </div>

    </form>
   </Layouts>
  )
}
ShippingScreen.auth = true;