'use client'
import React, { useEffect, useState } from 'react'
import RechartPie from '../../../charts/poolCharts/recharts/RechartPie'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface Props {

}

const PieBox: React.FC<Props> = () => {
    const [selected, setSelected] = useState(false)
    const [graphType, setGraphType] = useState(0)
    useEffect(() => {
        setSelected(prev=>false)
    }, [graphType])
    return (
        <div className='col-span-12 mx-0 md:mx-12 lg:col-span-6 2xl:col-span-4 3xl-col-span-3 px-8'>
            <div className='h-16 w-1/2 rounded-tr-2xl bg-slate-800  border-b border-blue-300 relative'>
                <div className='flex flex-row justify-between mx-6 lg:mx-0 3xl:mx-4'>

                    <p className='text-white text-3xl pt-4'>{graphType == 0 ? 'Investments' : "Staking"}</p>
                    <button className={`text-3xl text-white ${selected ? 'hidden' : 'block'}`} onClick={() => setSelected(prev => !prev)} >
                        <KeyboardArrowDownIcon height={50} />
                    </button>
                    <button className={`text-3xl text-white ${!selected ? 'hidden' : 'block'}`} onClick={() => setSelected(prev => !prev)}>
                        <KeyboardArrowUpIcon height={50} />
                    </button>
                </div>
                <div className={`absolute right-0 w-full  ${selected?'grid':'hidden'} bg-slate-800 border-2 border-slate-700  grid-cols-2   `} >
                    <button onClick={()=>setGraphType(1)} className={` col-span-1 text-xl text-center ${graphType == 0?'text-white hover:text-slate-800 hover:bg-white  hover:scale-110':'text-slate-800 bg-white border-4 border-slate-900 scale-90'}`}>Staking</button>
                    <button onClick={()=>setGraphType(0)} className={` col-span-1 text-xl text-center ${graphType == 1?'text-white hover:text-slate-800 hover:bg-white  hover:scale-110':'text-slate-800 bg-white border-4 border-slate-900 scale-90'}`}>Investments</button>
                </div>
            </div>
            <div className='text-white text-3xl w-1/2 bg-[rgba(24,24,35,255)]'></div>
            <div className='bg-slate-800 flex flex-col flex-wrap rounded-2xl rounded-tl-none'>
                <RechartPie />

            </div>
        </div>
    )
}

export default PieBox
