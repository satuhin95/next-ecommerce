import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import { getError } from "../../utils/error";
import Layouts from "../../components/Layouts";

    function reducer(state,action){
        switch (action.type) {
            case "FATCH_REQUEST":
                return {...state,loading:true,error:''};
            case "FATCH_SUCCESS":
                return {...state,loading:false,order:action.payload, error:''};    
            case "FATCH_FAIL":
                return {...state,loading:false, error:action.payload};     
            case "PAY_REQUEST":
                return {...state,loadingPay:true};     
            case "PAY_SUCCESS":
                return {...state,loadingPay:false, successPay:true};     
            case "PAY_FAIL":
                return {...state,loadingPay:false,errorPay: action.payload}; 
            case "PAY_RESET":
                return {...state,loadingPay:false, successPay:false,errorPay:''};          
        
            default:
                state;
        }
    }

 function OrderScreen() {
    const {query} = useRouter();
    const orderId = query.id
    const [{loading,error,order,successPay,loadingPay},dispatch] = useReducer(reducer,{
        loading:true,
        order:{},
        error:'',
    })
    useEffect(()=>{
        const fatchOrder = async()=>{
            try {
                dispatch({type:'FATCH_REQUEST'});
                const {data} = await axios.get(`/api/orders/${orderId}`)
                dispatch({type:'FATCH_SUCCESS',payload:data})
            } catch (error) {
                dispatch({type:'FATCH_SUCCESS',payload:getError(error)})
            }
        }
        if (!order._id ||successPay || (order._id && order._id !== orderId)) {
            fatchOrder();
            if (successPay) {
                dispatch({type:"PAY_RESET"})
            }
        }
        
    },[order,orderId,successPay])
    const {
        shippingAddress,
        orderItems,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        isPaid,
        paidAt,
        isDelivered,
        deliveredAt
    } = order;
    const payOrder = async()=>{
        try {
            dispatch({type:'PAY_REQUEST'});
            const {data} = await axios.put(`/api/orders/${order._id}/pay`,orderId)
            dispatch({type:'PAY_SUCCESS', payload:data});
            toast.success('Order is Paid Successfully')
        } catch (error) {
            dispatch({type:'PAY_FAIL', payload:getError(error)});
            toast.success(getError(error))
        }
    }
  return(
    <Layouts title={`Order ${orderId}`}>

        <h1 className="mb-4 text-xl">{`Order ${orderId}`}</h1>
        {loading? (<div>Loading...</div>):error?(
            <div className="my-3 rounded-lg bg-red-100 p-3 text-red-700">{error}</div>):(
              <div className="grid md:grid-cols-4 md:gap-5">
                <div className='overflow-x-auto md:col-span-3'>
                    <div className='mb-5  p-5 block rounded-lg border border-gray-200 shadow-md'>
                        <h2 className='mb-2 text-lg'>Shipping Address</h2>
                        <div>
                            {shippingAddress.fullName},{shippingAddress.address},{" "}
                            {shippingAddress.city},{shippingAddress.zipCode},{" "}
                            {shippingAddress.country}
                        </div>
                        {isDelivered?(
                            <div className="my-3 rounded-lg bg-red-100 p-3 text-green-700">Delivered at {deliveredAt}</div>
                        ):(
                            <div className="my-3 rounded-lg bg-red-100 p-3 text-red-700">Not Delivered!</div>
                        )}
                    </div>
                    <div className='mb-5  p-5 block rounded-lg border border-gray-200 shadow-md'>
                        <h2 className='mb-2 text-lg'>Payment Method</h2>
                        <div>{paymentMethod}</div>
                        {isPaid?(
                            <div className="my-3 rounded-lg bg-green-400 p-3 text-white">Paid at {paidAt}</div>
                        ):(
                            <div className="my-3 rounded-lg bg-red-100 p-3 text-red-700">Not Paid!</div>
                        )}
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
                                {orderItems?.map((item)=>(
                                    <tr key={item._id} className='border-b'>
                                     <td>
                                        <div className='flex items-center'>
                                        <Image src={item.image}
                                        alt={item.name}
                                        width={50}
                                        height={50}
                                        >
                                        </Image> &nbsp; {item.name}
                                        </div>
                                    </td>
                                    <td className='p-5 text-right'>{item.quantity}</td>
                                    <td className='p-5 text-right'>${item.price}</td>
                                    <td className='p-5 text-right'>${item.price * item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
         
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
                            <div className="w-full">
                                {loadingPay ?(<div>Loading...</div>): isPaid?" " :( 
                                <div onClick={payOrder} className="rounded cursor-pointer font-bold text-center bg-teal-300 py-2 px-4 shadow outline-none hover:bg-teal-400 active:bg-teal-500 w-full">
                                    CashOnDelivery
                                </div>
                                )}   
                                
                            </div>

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
OrderScreen.auth = true;
export default OrderScreen;