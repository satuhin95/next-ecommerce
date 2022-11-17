import Image from 'next/image'
import Link from 'next/link'


export default function ProductItem({product,cartHandaler}) {
  return (
    <div className='md-5 block rounded-lg border border-gray-200 shadow-md'>
      <Link href={`/product/${product?.slug}`}>
        <Image width={350} height={250}  src={product?.image} alt={product?.name} className="rounded shadow"/>
      </Link>
      <div className='flex flex-col items-center justify-start p-5'>
      <Link href={`/product/${product?.slug}`}>
        <h2 className='text-lg'>{product?.name}</h2>
        </Link>
        <p className='mb-2'>{product?.brand}</p>
        <p>${product?.price}</p>
        <button onClick={()=>cartHandaler(product)} className='rounded font-bold bg-teal-300 py-2 px-4 shadow outline-none hover:bg-teal-400 active:bg-teal-500'>Add to Cart</button>
      </div>
    </div>
  )
}
