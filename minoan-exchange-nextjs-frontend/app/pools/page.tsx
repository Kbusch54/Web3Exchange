import React from 'react'
import Image, { StaticImageData } from 'next/image';
import MetaSymbol from "../../public/assets/metaSymbol.png";
import TeslaSymbol from '../../public/assets/teslaSymbol.png';
import GoogleSymbol from '../../public/assets/googleSymbol.png';
import helmet from "../../public/assets/silhoute-helmet.png"


interface Props {
  
}

interface Stock {
    name: string;
    symbol: string;
    img: StaticImageData;
    id: number;
}
const page: React.FC<Props> = () => {
    const stocks:Stock[] = [
        {
        id:0,
        name: 'Meta',
        symbol: 'META',
        img: MetaSymbol}
    ,
        {
            id:1,
            name: 'Tesla',
            symbol: 'TSLA',
            img: TeslaSymbol
        },
    {
        id:2,
        name: 'Google',
        symbol: 'GOOG',
        img: GoogleSymbol
    }
];
    return (
        <div className='text-white text-center my-12  m-12 md:mx-24'>
           <h1 className='text-5xl md:text-7xl m-12'>Ariadne Pools</h1>
            <div className='flex flex-wrap  items-center justify-between gap-12 '>
                {stocks.map(stock => (
                   <div key={stock.id} className='pool-card'>
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
                    </div>
                ))}
            </div>
        </div>
    )
}

export default page
