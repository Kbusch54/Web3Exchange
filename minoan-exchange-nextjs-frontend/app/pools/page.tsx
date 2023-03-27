import React from 'react'
import helmet from "../../public/assets/silhoute-helmet.png"
import Link from 'next/link';
import { stocks } from '../utils/stockData';
import Image from 'next/image';
interface Props {
  
}
const page: React.FC<Props> = () => {
  
    return (
        <div className='text-white text-center my-12  m-12 md:mx-24'>
           <h1 className='text-5xl md:text-7xl m-12'>Ariadne Pools</h1>
            <div className='flex flex-wrap  items-center justify-between gap-12 '>
                {stocks.map(stock => (
                <div key={stock.slug}  className='pool-card'>
                    <a href={`/pools/${stock.slug}`}>

                        <div className='flex flex-row justify-between relative'>
                            <Image src={helmet} alt={'helmet'} width={120}/>
                            <div className='mr-2 relative'>
                                <p className="absolute -top-[4.45rem] right-12 text-green-500 text-8xl animate-pulse">.</p>
                                Active
                            </div>
                            <p className='text-lg absolute left-1/3 text-left'>{stock.symbol}</p>
                        </div>
                        <div className='m-auto block max-w-max h-24 '>
                            <Image src={stock.img} alt={'stock-img'} width={70} height={70} className=''/></div>
                        <h1 className='text-7xl mb-12'>{stock.name}</h1>
                    </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default page
