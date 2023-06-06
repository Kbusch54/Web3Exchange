'use client';
import React,{useEffect, useState} from 'react'
import SideSelection from './utils/SideSelection';
import AddCollateralModal from '../modals/trade/AddCollateralModal';
import { Address } from 'wagmi';
import RemoveCollateralButton from '../forms/buttons/trade/RemoveCollateralButton';
import RemoveCollateralModal from '../modals/trade/RemoveCollateralModal';
import AddLiquidityModal from '../modals/trade/AddLiquidityModal';
import RemoveLiquidityModal from '../modals/trade/RemoveLiquidityModal';
import ClosePositionModal from '../modals/trade/ClosePositionModal';
import { formatEther, formatUnits } from 'ethers/lib/utils.js';

interface Props {
    user:Address;
    userAvailableBalance:number
    index:number;
    row: {
        id: string;
        side: number;
        asset: string;
        size: number;
        lev: number;
        pnl: string;
        created: number;
        information: {
            mmr: number;
            ffr: number;
            ffrReturn: string;
            liquidationPrice: number;
            interestRate: number;
            interestPeriod: number;
            interestAccrued: number;
            startCollateral: number;
            currentCollateral: number;
            openValue: number;
            currentValue: number;
        }
        other:{
            baseAssetReserve:number,
            quoteAssetReserve:number,
            loanAmt:number,
            maxLoanAmt:number,
            interestPeriodsPassed:number
            minLoanAmt:number,
        }
    }
}

const SingleTrade: React.FC<Props> = ({row,index,userAvailableBalance,user}) => {
    const [toggle, setToggle] = useState<boolean>(true)
    const loanAmt = 222898822;
    const mmr= 100000;
    const handleToggle = () => {
        setToggle(!toggle)
    }
    useEffect(() => {
        index == 0 && handleToggle()
    }, [])
   

    const margin = row.information.currentCollateral/(row.lev * row.information.startCollateral) *100
    return (
        <div key={row.id} className=' '>
        <div className='grid grid-cols-7 justify-evenly text-center border border-amber-400/40 rounded-lg '>
            <div className='text-white text-md  lg:text-xl m-2 gap-x-3 flex flex-row'>
                {/* @ts-ignore */}
                <button onClick={(e)=>handleToggle(e)}>{'->'}</button>
                <div>{row.id.slice(32,42)}</div>
            </div>
            <div className='text-white text-md  lg:text-xl m-2'>{row.asset}</div>
            <div className='text-white text-md  lg:text-xl m-2'><SideSelection side={row.side} /></div>
            <div className='text-white text-md  lg:text-xl m-2'>{(row.size/10**8).toFixed(4)}</div>
            <div className='text-white text-md  lg:text-xl m-2'>{row.lev}</div>
            <div className='text-white text-md  lg:text-xl m-2'>{Number(row.pnl) > 0 ? `$${(Number(formatUnits(String(Number(row.pnl)),6))).toFixed(2)}`:` - $${(Number(formatUnits(String(Number(row.pnl) *-1),6))).toFixed(2)}`}</div>
            <div className='text-white text-md  lg:text-xl m-2'>{row.created}</div>
        </div>
        <div >
            <div className={`bg-slate-800 ${toggle?'hidden':'block'}`}>

                <div className='text-white text-xl m-2'>Information</div>
                <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-11  xl:grid-cols-11 justify-evenly text-center border border-amber-400/40 rounded-lg '>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>MMR</p>
                        <p>{row.information.mmr/10**4}%</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>Current Margin</p>
                        <p>{margin.toFixed(2)}%</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>FFR</p>
                        <p>{Number(row.information.ffr)/10**4}</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>Liquidation Price</p>
                        <p>$123.44</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>Start Collateral</p>
                        <p>${formatUnits(row.information.startCollateral,6)}</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>Current Collateral</p>
                        <p>${formatUnits(row.information.currentCollateral,6)}</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>Interest Rate</p>
                        <p>{Number(row.information.interestRate)/10**4}%</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>Interest Periods</p>
                        <p>{row.other.interestPeriodsPassed}</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>Interest Accurred</p>
                        <p>${formatUnits(row.information.interestAccrued,6)}</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>Open Value</p>
                        <p>${row.information.openValue}</p>
                    </div>
                    <div className='text-white text-lg flex flex-col border border-white/10'>
                        <p>Current Value</p>
                        <p>${row.information.currentValue}</p>
                    </div>
                </div>
                <div className='flex flex-row justify-evenly text-center text-white mt-4 pb-4 text-sm md:text-md lg:text-xl'>
                    <AddCollateralModal user={user} tradeId={row.id} vaultBalance={userAvailableBalance} currentCollateral={row.information.currentCollateral}/>
                    <RemoveCollateralModal user={user} tradeId={row.id} minimummarginReq={Math.floor(row.information.mmr*row.other.loanAmt/10**6)} currentCollateral={row.information.currentCollateral}/>
                    <AddLiquidityModal user={user} tradeId={row.id} vaultBalance={userAvailableBalance} leverage={row.lev}  minLoanAmt={row.other.minLoanAmt}
                    positionSize={row.size} vammData={{baseAsset:row.other.baseAssetReserve,quoteAsset:row.other.quoteAssetReserve}} minimummarginReq={row.information.mmr} 
                    currentCollateral={row.information.currentCollateral} currrentLoanAmt={row.other.loanAmt} maxLoanAmt={row.other.maxLoanAmt} side={row.side}/>
                    <RemoveLiquidityModal user={user} tradeId={row.id} vaultBalance={userAvailableBalance} leverage={row.lev} 
                    currentPositionSize={row.size} vammData={{baseAsset:row.other.baseAssetReserve,quoteAsset:row.other.quoteAssetReserve}} minimummarginReq={row.information.mmr} 
                    currentCollateral={row.information.currentCollateral} currrentLoanAmt={row.other.loanAmt} maxLoanAmt={row.other.maxLoanAmt} side={row.side}/>
                    <ClosePositionModal user={user} tradeId={row.id} vaultBalance={userAvailableBalance} leverage={row.lev} 
                    currentPositionSize={row.size} vammData={{baseAsset:row.other.baseAssetReserve,quoteAsset:row.other.quoteAssetReserve}} minimummarginReq={row.information.mmr} 
                    currentCollateral={row.information.currentCollateral} currrentLoanAmt={row.other.loanAmt} maxLoanAmt={row.other.maxLoanAmt} side={row.side}/>
                </div>
            </div>
        </div>
    </div>
    )
}

export default SingleTrade
