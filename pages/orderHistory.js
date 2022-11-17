import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useReducer } from 'react'
import { getError } from '../utils/error'
import Layouts from './components/Layouts'
function reducer(state,action){
    switch (action.type) {
        case 'FATCH_REQUEST':
            return {...state,loading:true,error:''}
        case 'FATCH_SUCCESS':
            return {...state,loading:false,orders: action.payload ,error:''}
        case 'FATCH_FAIL':
            return {...state,loading:false,error: action.payload}
        default:
            return state;
    }
}

export default function OrderHistory() {
    const[{loading,error,orders},dispatch] = useReducer(reducer,{
        loading:true,
        orders:[],
        error:'',
    })
    useEffect(()=>{
        const fetchOrders = async()=>{
            try {
                dispatch({type:"FATCH_REQUEST"})
                const {data} = await axios.get(`/api/orders/history`);
                dispatch({type:"FATCH_SUCCESS",payload:data})
            } catch (error) {
                dispatch({type:"FATCH_FAIL",payload:getError(error)})
            }
        }
        fetchOrders();
    },[])
  return (
    <Layouts title="Order History">
        <h1 className='mb-3 text-xl text-center '>Order History</h1>
        {loading?(<div>Loading...</div>):error?(<div className='my-3 rounded-lg bg-red-100 p-3 text-red-700'>{error}</div>):(
        <div className='overflow-x-auto'>
            <table className='min-w-full'>
                <thead className='border-b'>
                    <tr>
                        <th className='px-5 text-left'>Id</th>
                        <th className='px-5 text-left'>Date</th>
                        <th className='px-5 text-left'>Total</th>
                        <th className='px-5 text-left'>Paid</th>
                        <th className='px-5 text-left'>Delivered</th>
                        <th className='px-5 text-left'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order)=>(
                        <tr key={order._id} className="border-b">
                            <td className='p-5'>{order._id.substring(20,24)}</td>
                            <td className='p-5'>{order.createdAt.substring(0,10)}</td>
                            <td className='p-5'>${order.totalPrice}</td>
                            {/* <td className='p-5'>{order.isPaid? `${order.paidAt.substring(0,10)}`:"Not Paid"}</td> */}
                            <td className='p-5'>{order.isPaid? "Paid":"Not Paid"}</td>
                            <td className='p-5'>{order.isDelivered? "Delivered":"Not Delivered"}</td>
                            <td className='p-5'>
                                <Link href={`/order/${order._id}`} >
                                <span className='text-blue-500'>Details</span>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        )}
    </Layouts>
  )
}
OrderHistory.auth =true;
