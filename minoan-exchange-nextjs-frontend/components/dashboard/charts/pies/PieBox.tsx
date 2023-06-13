import React from 'react'
import RechartPie from '../../../charts/poolCharts/recharts/RechartPie'

interface Props {
    
}

const PieBox: React.FC<Props> = () => {
    return (
        <div className='col-span-12 mx-0 md:mx-12 lg:col-span-6 2xl:col-span-4 3xl-col-span-3 px-8'>
        <div className='h-16 w-1/2 rounded-tr-2xl bg-slate-800  border-b border-blue-300'>
            <p className='text-white text-3xl text-center pt-4'>Investments</p>
        </div>
        <div className='text-white text-3xl w-1/2 bg-[rgba(24,24,35,255)]'></div>
        <div className='bg-slate-800 flex flex-col flex-wrap rounded-2xl rounded-tl-none'>
            <RechartPie />

        </div>
    </div>
    )
}

export default PieBox
