'use client'
import React, { useEffect, useState } from 'react'
import RechartTinyBar from '../../../charts/poolCharts/recharts/RechartTinyBar'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Address } from 'wagmi';
import { getPNlByUser, getTradeDurationByUser } from 'utils/helpers/dataMutations';
import { getHoursAndMinutes, moneyFormatter } from 'utils/helpers/functions';
interface Props {
    userData: any,
    user: Address

}

const TinyBar: React.FC<Props> = ({ userData, user }) => {
    const [selected, setSelected] = useState(false)
    const [graphType, setGraphType] = useState(0)
    const { pnl, avg: avgPnl } = getPNlByUser(userData.trades, user, 9);
    const { duration, avg: avgDuration } = getTradeDurationByUser(userData.trades, user, 9);

    return (
        <div className='col-span-6 2xl:col-span-2 self-center mx-16 mt-4 md:mx-40 md:mt-6 2xl:mx-0 2xl:mt-0 2xl:pr-4'>
            <div className='flex flex-row justify-between bg-slate-800 rounded-2xl px-4 my-4 relative'>
                <p className='text-white text-3xl text-center p-4'>{graphType == 0 ? 'PNL' : "Trade Duration"}</p>
                <button className={`text-3xl text-white ${selected ? 'hidden' : 'block'}`} onClick={() => setSelected(prev => !prev)} >
                    <KeyboardArrowDownIcon height={50} />
                </button>
                <button className={`text-3xl text-white ${!selected ? 'hidden' : 'block'}`} onClick={() => setSelected(prev => !prev)}>
                    <KeyboardArrowUpIcon height={50} />
                </button>
                <div className={`absolute right-0 top-24 w-full  ${selected ? 'grid' : 'hidden'} bg-slate-800 border-2 border-slate-700  grid-cols-2   `} >
                    <button onClick={() => setGraphType(0)} className={` col-span-1 text-lg text-center ${graphType == 1 ? 'text-white hover:text-slate-800 hover:bg-white  hover:scale-110' : 'text-slate-800 bg-white border-4 border-slate-900 scale-90'}`}>PNL</button>
                    <button onClick={() => setGraphType(1)} className={` col-span-1 text-lg text-center ${graphType == 0 ? 'text-white hover:text-slate-800 hover:bg-white  hover:scale-110' : 'text-slate-800 bg-white border-4 border-slate-900 scale-90'}`}>Trade Durations</button>
                </div>
            </div>
            {graphType == 0 ? (
                pnl && pnl.length > 0 && avgPnl ? (
                    <div className=' flex flex-col flex-wrap bg-slate-800 rounded-2xl '>
                        <div className='flex flex-row justify-between align-middle place-items-center px-2 mt-8 text-white text-2xl text-center'>
                            <p className='mt-6'>Avg PNL</p>
                            <p className='text-amber-400 text-lg'>${moneyFormatter(avgPnl)}</p>
                        </div>
                            <RechartTinyBar height={270} toolTipLabel='$' toolTipPost='PNL' dataBar={pnl} />
                    </div>

                ) : (
                    <div className=' flex flex-col flex-wrap bg-slate-800 rounded-2xl '>
                        <div className='flex flex-row justify-between align-middle place-items-center px-2 mt-8 text-white text-2xl text-center'>
                            <p className='mt-6'>Avg PNL</p>
                            <p className='text-amber-400 text-lg'>${0.00}</p>
                        </div>
                            <h1 className='text-white text-center mt-12 mb-20'>N/A</h1>
                    </div>
                )

            ) : (
                duration && duration.length > 0 && avgDuration ? (
                    <div className=' flex flex-col flex-wrap bg-slate-800 rounded-2xl '>
                        <div className='flex flex-row justify-between align-middle place-items-center px-2 mt-8 text-white text-2xl text-center'>
                            <p className=''>Avg Duration</p>
                            <p className='text-amber-400 text-lg'>{getHoursAndMinutes(avgDuration*1000)[0].toString()}</p>
                        </div>
                            <RechartTinyBar height={270}  dataBar={duration} toolTipLabel='Duration: ' />
                    </div>

                ) : (
                    <div className=' flex flex-col flex-wrap bg-slate-800 rounded-2xl '>
                        <div className='flex flex-row justify-between align-middle place-items-center px-2 mt-8 text-white text-2xl text-center'>
                            <p className=''>Avg Duration</p>
                            <p className='text-amber-400 text-lg'>0h 0m</p>
                        </div>
                            <h1 className='text-white text-center mt-12 mb-20'>N/A</h1>
                    </div>
                )
            )}
        </div>
    )
}

export default TinyBar
