import React from 'react'
import RechartTinyBar from '../../../charts/poolCharts/recharts/RechartTinyBar'

interface Props {

}

const TinyBar: React.FC<Props> = () => {
    return (
        <div className='col-span-6 2xl:col-span-2 self-center mx-16 mt-4 md:mx-40 md:mt-6 2xl:mx-0 2xl:mt-0 2xl:pr-4'>
            <div className='flex flex-row justify-between bg-slate-800 rounded-2xl px-4 my-4'>
                <p className='text-white text-3xl text-center p-4'>PNL</p>
                <button className='text-white text-3xl text-center p-4'>d</button>
            </div>
            <div className=' flex flex-col flex-wrap bg-slate-800 rounded-2xl '>
                <div className='flex flex-row justify-between align-middle place-items-center px-2 mt-8 text-white text-2xl text-center'>
                    <p className=''>Earnings</p>
                    <p className='text-amber-400 text-lg'>+$200.77</p>
                </div>
                <RechartTinyBar height={270} />
            </div>
        </div>
    )
}

export default TinyBar
