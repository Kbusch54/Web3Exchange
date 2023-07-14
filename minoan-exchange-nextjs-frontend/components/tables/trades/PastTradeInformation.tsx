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
            ffrPayed:number;
            ffrReturn: string;
            liquidationPrice: number;
            interestRate: number;
            interestPeriod: number;
            interestAccrued: number;
            startCollateral: number;
            currentCollateral: number;
            openValue: number;
            currentValue: number;
            entryPrice: number;
            exitPrice: number;
            exitTime: number;
        }
        other: {
            baseAssetReserve: number,
            quoteAssetReserve: number,
            loanAmt: number,
            maxLoanAmt: number,
            interestPeriodsPassed: number
            minLoanAmt: number,
            openLeverage: number,
            openLoan: number,
            tradingFee: number,
            openLeverageAmt: number

        }
    }
}

const PastTradeInformation: React.FC<Props> = ({ row, user }) => {
    const getDateTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();
        return `${month}/${day} ${hour > 12 ? hour - 12 : hour}:${min < 10 ? '0'.concat(min.toString()) : min} ${hour > 12 ? 'PM' : 'AM'}`;
    }
    return (
        <div className={`bg-slate-800 `}>

            <div className='text-white text-xl m-2'>Information</div>
            <div className='grid grid-cols-3 lg:grid-cols-4  3xl:grid-cols-7  justify-evenly text-center border border-amber-400/40 rounded-lg '>
                <div className='text-white text-lg flex flex-col border border-white/10'>
                    <p className='text-green-500'>Open Value</p>
                    <p>${moneyFormatter(row.information.openValue)}</p>
                </div>
                <div className='text-white text-lg flex flex-col border border-white/10'>
                    <p className='text-red-500'>Close Value</p>
                    <p>${moneyFormatter(Number(Number(row.information.exitPrice)*Number(row.size)/10**8))}</p>
                </div>
                <div className='text-white text-lg flex flex-col border border-white/10'>
                    <p>Total PNL</p>
                    <p>${moneyFormatter(Number(row.pnl))}</p>
                </div>
                <div className='text-white text-lg flex flex-col border border-white/10'>
                    <p>Interest Fees</p>
                    <p>${moneyFormatter(row.information.interestAccrued)}</p>
                </div>
                <div className='text-white text-lg flex flex-col border border-white/10'>
                    <p>FFR Total</p>
                    <p>${moneyFormatter(Number(row.information.ffrPayed))}</p>
                </div>
                <div className='text-white text-lg flex flex-col border border-white/10'>
                    <p>Trading Fee</p>
                    <p>${moneyFormatter(row.other.tradingFee)}</p>
                </div>
                <div className='text-white text-lg flex flex-col border border-white/10'>
                    <p>Total Cost</p>
                    <p>${moneyFormatter(Number(row.information.interestAccrued) + Number(row.other.tradingFee) + Number(Number(row.information.ffr) * Number(row.other.openLoan)*Number(-row.side) / 10**6)) }</p>
                </div>
                <div className='text-white text-lg flex flex-col border border-white/10'>
                    <p className='text-green-500'>Open Time</p>
                    <p>{row.created}</p>
                </div>
                <div className='text-white text-lg flex flex-col border border-white/10'>
                    <p className='text-red-500'>Close Time</p>
                    <p>{getDateTime(row.information.exitTime)}</p>
                </div>
                <div className='text-white text-lg flex flex-col border border-white/10'>
                    <p className='text-green-500'>Open Collateral</p>
                    <p>${moneyFormatter(row.information.startCollateral)}</p>
                </div>
                <div className='text-white text-lg flex flex-col border border-white/10'>
                    <p className='text-green-500'>Open Loan</p>
                    <p>${moneyFormatter(row.other.openLoan)}</p>
                </div>
                <div className='text-white text-lg flex flex-col border border-white/10'>
                    <p className='text-green-500'>Open Leverage</p>
                    <p>{row.other.openLeverage}</p>
                </div>
                <div className='text-white text-lg flex flex-col border border-white/10'>
                    <p className='text-green-500'>Open Price</p>
                    <p>${moneyFormatter(row.information.entryPrice)}</p>
                </div>
                <div className='text-white text-lg flex flex-col border border-white/10'>
                    <p className='text-red-500'>Close Price</p>
                    <p>${moneyFormatter(row.information.exitPrice)}</p>
                </div>

            </div>
        </div>
    )
}

export default PastTradeInformation
