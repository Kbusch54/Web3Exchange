import React from 'react'
import { formatUnits } from 'ethers/lib/utils.js';
import SideSelection from '../utils/SideSelection';

interface Props {
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

const SingleGlobalTrade: React.FC<Props> = ({row,index}) => {
    
    return (
        <div key={row.id} className='grid grid-cols-7 justify-evenly text-center border border-amber-400/40 rounded-lg '>
            <div className='text-white text-md  lg:text-xl m-2 gap-x-3 flex flex-row'>
                <div>{row.id.slice(32,42)}</div>
            </div>
            <div className='text-white text-md  lg:text-xl m-2'>{row.asset}</div>
            <div className='text-white text-md  lg:text-xl m-2'><SideSelection side={row.side} /></div>
            <div className='text-white text-md  lg:text-xl m-2'>{(row.size/10**8).toFixed(4)}</div>
            <div className='text-white text-md  lg:text-xl m-2'>{row.lev}</div>
            <div className='text-white text-md  lg:text-xl m-2'>{Number(row.pnl) > 0 ? `$${(Number(formatUnits(String(Number(row.pnl)),6))).toFixed(2)}`:` - $${(Number(formatUnits(String(Number(row.pnl) *-1),6))).toFixed(2)}`}</div>
            <div className='text-white text-md  lg:text-xl m-2'>{row.created}</div>
        </div>
    )
}

export default SingleGlobalTrade
