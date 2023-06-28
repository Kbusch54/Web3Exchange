import React from 'react'
import { moneyFormatter } from 'utils/helpers/functions';
import { Address } from 'wagmi';

interface Props {
    refetch: () => void;
    user: Address;
    userAvailableBalance: number
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
        other: {
            baseAssetReserve: number,
            quoteAssetReserve: number,
            loanAmt: number,
            maxLoanAmt: number,
            interestPeriodsPassed: number
            minLoanAmt: number,
        }
    }
}

const PastTradeInformation: React.FC<Props> = ({row,user}) => {
    return (
        <div className={`bg-slate-800 `}>

        <div className='text-white text-xl m-2'>Information</div>
        <div className='grid grid-cols-3 lg:grid-cols-4  3xl:grid-cols-7  justify-evenly text-center border border-amber-400/40 rounded-lg '>
            <div className='text-white text-lg flex flex-col border border-white/10'>
                <p className='text-green-500'>Open Value</p>
                <p>{row.information.mmr / 10 ** 4}%</p>
            </div>
            <div className='text-white text-lg flex flex-col border border-white/10'>
                <p className='text-red-500'>Close Value</p>
                <p>{(20*100).toFixed(2)}%</p>
            </div>
            <div className='text-white text-lg flex flex-col border border-white/10'>
                <p>Total PNl</p>
                <p>{Number(row.information.ffr) / 10 ** 4}</p>
            </div>
            <div className='text-white text-lg flex flex-col border border-white/10'>
                <p>Interest Fees</p>
                <p>$123.44</p>
            </div>
            <div className='text-white text-lg flex flex-col border border-white/10'>
                <p>FFR Total</p>
                <p>${moneyFormatter(row.information.startCollateral)}</p>
            </div>
            <div className='text-white text-lg flex flex-col border border-white/10'>
                <p>Trading Fee</p>
                <p>${moneyFormatter(row.information.currentCollateral)}</p>
            </div>
            <div className='text-white text-lg flex flex-col border border-white/10'>
                <p>Total Cost</p>
                <p>{Number(row.information.interestRate) / 10 ** 4}%</p>
            </div>
            <div className='text-white text-lg flex flex-col border border-white/10'>
                <p className='text-green-500'>Open Time</p>
                <p>{row.other.interestPeriodsPassed}</p>
            </div>
            <div className='text-white text-lg flex flex-col border border-white/10'>
                <p className='text-red-500'>Close Time</p>
                <p>${row.information.currentValue}</p>
            </div>
            <div className='text-white text-lg flex flex-col border border-white/10'>
                <p className='text-green-500'>Open Collateral</p>
                <p>${row.information.openValue}</p>
            </div>
            <div className='text-white text-lg flex flex-col border border-white/10'>
                <p className='text-green-500'>Open Loan</p>
                <p>${row.information.currentValue}</p>
            </div>
            <div className='text-white text-lg flex flex-col border border-white/10'>
                <p className='text-green-500'>Open Leverage</p>
                <p>${row.information.openValue}</p>
            </div>
            <div className='text-white text-lg flex flex-col border border-white/10'>
                <p className='text-green-500'>Open Price</p>
                <p>${row.information.currentValue}</p>
            </div>
            <div className='text-white text-lg flex flex-col border border-white/10'>
                <p className='text-red-500'>Close Price</p>
                <p>${row.information.openValue}</p>
            </div>
         
        </div>
        </div>
    )
}

export default PastTradeInformation
