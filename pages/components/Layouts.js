import React, { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Store, StoreProvider } from '../../utils/Store';
import { ToastContainer } from 'react-toastify';
import { signOut, useSession } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css'
import { Menu } from '@headlessui/react'
import DropdownLink from './DropdownLink';
import Cookies from 'js-cookie';

export default function Layouts({title, children}) {
  const {status, data:session} = useSession();
  const {state,dispatch} = useContext(Store);
  const {cart} = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(()=>{
    setCartItemsCount(cart.cartItems.reduce((a,c)=> a + c.quantity, 0))
  },[cart.cartItems])
  const logoutHandler =()=>{
    Cookies.remove('cart');
    dispatch({type:"CART_RESET" })
    signOut({callbackUrl:'/login'})
  }

  return (
    <>
     <Head>
        <title>{title?title:"Ecom"}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position='bottom-center' limit={1} />
      <div className='flex min-h-screen flex-col justify-between'>
        <header>
            <nav className='flex h-12 items-center px-4 justify-between shadow-md'>
                <Link href="/">
                    <h2 className='text-lg font-bold'>Ecommerce</h2>
                </Link>
                <div>
                    <Link href="/cart">
                        <span className='p-2 font-bold '>Cart
                        {cartItemsCount> 0 && (
                          <span className='ml-1  rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                            {cartItemsCount}

                          </span>
                        )}
                        </span>
                    </Link>
                    
                      {status === 'loading' ? ('Loading')  : session?.user?(
                        <Menu as="div" className="relative inline-block" >
                          <Menu.Button className="text-blue-600">
                            {session.user.name}
                          </Menu.Button>
                          <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white text-xl  shadow-lg"> 
                            <Menu.Item>
                              <DropdownLink className="flex p-2  hover:bg-gray-300 focus:ring" href="/profile">
                                Profile
                              </DropdownLink>
                            </Menu.Item>
                            <Menu.Item>
                              <DropdownLink className="flex p-2 hover:bg-gray-300 focus:ring" href="/orderHistory">
                                Order History
                              </DropdownLink>
                            </Menu.Item>
                            <Menu.Item>
                              <a className="flex p-2 hover:bg-gray-300 focus:ring" onClick={logoutHandler}>
                                Logout
                              </a>
                            </Menu.Item>
                          </Menu.Items>
                        </Menu>
                        
                        ):(
                          <Link href="/login">
                            <span className='p-2 font-bold'>Login</span>
                          </Link>
                        )}
                        
                </div>
            </nav>
        </header>
        <main className='container m-auto mt-4 px-4'>
            {children}
        </main>
        <footer className='flex justify-center items-center h-10 shadow-inner'>
            Copyright &copy; 2022 Ecommerce
        </footer>
      </div>
    </>
  )
}
