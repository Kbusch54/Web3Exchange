'use client';
import React,{useEffect, useState} from 'react'
import SideSelection from './utils/SideSelection';

interface Props {
    index:number;
    row:{
        id: number;
        side: number;
        asset: string;
        size: number;
        lev: string;
        pnl: string;
        created: number;
        // information: {
        //     mmr: number;
        //     ffr: number;
        //     ffrReturn:string;
        //     liquidationPrice: number;
        //     interestRate: number;
        //     interestPeriod: number;
        //     interestAccrued: number;
        //     startCollateral: number;
        //     currentCollateral: number;
        //     openValue: number;
        //     currentValue: number;
        // }      
    }
}

const SingleTrade: React.FC<Props> = ({row,index}) => {
    const [toggle, setToggle] = useState(true)
    
    const handleToggle = () => {
        setToggle(!toggle)
    }
    useEffect(() => {
        index==0&&handleToggle()
    }, [])
    return (
        <div key={row.id} className=' '>
        <div className='grid grid-cols-7 justify-evenly text-center border border-amber-400/40 rounded-lg '>
            <div className='text-white text-md  lg:text-xl m-2 gap-x-3 flex flex-row'>
                <button onClick={handleToggle}>{'->'}</button>
                <div>{row.id}</div>
            </div>
            <div className='text-white text-md  lg:text-xl m-2'>{row.asset}</div>
            <div className='text-white text-md  lg:text-xl m-2'><SideSelection side={row.side} /></div>
            <div className='text-white text-md  lg:text-xl m-2'>{row.size}</div>
            <div className='text-white text-md  lg:text-xl m-2'>{row.lev}</div>
            <div className='text-white text-md  lg:text-xl m-2'>{row.pnl}</div>
            <div className='text-white text-md  lg:text-xl m-2'>{row.created}</div>
        </div>
        <div >
            <div className={`bg-slate-800 ${toggle?'hidden':'block'}`}>

                <div className='text-white text-xl m-2'>Information</div>
                <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8  xl:grid-cols-10 justify-evenly text-center border border-amber-400/40 rounded-lg '>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>MMR</p>
                        <p>22</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>FFR</p>
                        <p>12.3</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>Liquidation Price</p>
                        <p>$123.44</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>Start Collateral</p>
                        <p>22.22</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>Current Collateral</p>
                        <p>10.22</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>Interest Rate</p>
                        <p>2%</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>Interest Period</p>
                        <p>2hrs</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>Interest Accurred</p>
                        <p>$3.99</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>Open Value</p>
                        <p>$278.33</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>Current Value</p>
                        <p>$391.82</p>
                    </div>
                </div>
                <div className='flex flex-row justify-evenly text-center text-white mt-4 pb-4 text-sm md:text-md lg:text-xl'>
                    <button className='lg:px-2 py-1 bg-green-500 rounded-xl hover:scale-125'>Add Collateral</button>
                    <button className='lg:px-2 py-1 bg-orange-500 rounded-xl hover:scale-125'>Remove Collateral</button>
                    <button className='lg:px-2 py-1 bg-blue-500 rounded-xl hover:scale-125'>Add Liquidity</button>
                    <button className='lg:px-2 py-1 bg-amber-500 rounded-xl hover:scale-125'>Remove Liquidity</button>
                    <button className='lg:px-2 py-1 bg-red-500 rounded-xl hover:scale-125'>Close Position</button>
                </div>
            </div>
        </div>
    </div>
    )
}

export default SingleTrade
