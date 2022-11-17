import { useRouter } from 'next/router'
import React from 'react'
import Layouts from '../components/Layouts'

export default function Unauthorized() {
    const router = useRouter();
    const {message} = router.query
  return (
  
    <Layouts title="Unauthorized Page">
        <h1 className='text-xl'>Access Denied</h1>
        {message && <div className='mb-4 text-red-500'>{message}</div>}
    </Layouts>
  )
}
