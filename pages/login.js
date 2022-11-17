import Link from 'next/link'
import React, { useEffect } from 'react'
import Layouts from './components/Layouts'
import {useForm} from 'react-hook-form'
import{signIn, useSession} from 'next-auth/react'
import {  toast } from 'react-toastify';
import { getError } from '../utils/error'
import { useRouter } from 'next/router'

export default function LoginScreen() {
    const router = useRouter()
    const {redirect} = router.query;
    const {data: session} = useSession();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const submitHandler =async ({email, password})=>{
        try {
            const result = await signIn('credentials',{
                redirect:false,
                email,
                password,
            });
            if (result.error) {
                toast.error(result.error)
            }
        } catch (err) {
            toast.error(getError(err))
        }
    }

    useEffect(()=>{
        if (session?.user) {
            router.push( redirect || '/');
        }
    },[redirect,session,router])
  return (
    <Layouts title="Login">
        <form className='mx-auto max-w-screen-md' onSubmit={handleSubmit(submitHandler)}>
            <h1 className='mb-4 text-xl'>Login</h1>
            <div className='mb-4'>
                <label htmlFor='email'>Email</label>
                <input type="email" {...register('email',{required: "Please enter email",
                pattern:{
                    value:/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/i,
                    message:"Please enter valid email"
                }
            })} className='w-full' id='email' autoFocus></input>
                {errors.email && (<div className='text-red-500'>{errors.email.message}</div>)}
            </div>
            <div className='mb-4'>
                <label htmlFor='password'>Password</label>
                <input type="password" {...register('password',{required: "Please enter password",
                minLength:{value:4,message:"Pasword is more than 3 chars"},
            })} className='w-full' id='password' autoFocus></input>
                {errors.password && (<div className='text-red-500'>{errors.password.message}</div>)}
            </div>
            <div className='mb-4'>
                <button className='rounded font-bold bg-teal-300 py-2 px-4 shadow outline-none hover:bg-teal-400 active:bg-teal-500'>Login</button>
            </div>
            <div className='mb-4'>
                Don&apos;t have an account?
                <Link href="register">
                    <span className='text-blue-500  text-lg'>Register</span>
                </Link>
            </div>

        </form>
    </Layouts>
  )
}
