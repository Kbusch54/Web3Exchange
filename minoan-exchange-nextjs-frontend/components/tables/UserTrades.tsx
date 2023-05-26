import React from 'react'
import SideSelection from './utils/SideSelection';
import SingleTrade from './SingleTrade';

interface Props {

}
const rows = [
    { id: 1, side: 1, asset: 'TSLA', size: 3.5, lev: '10', pnl: '200.47', created: 29304 },
    { id: 3, side: -1, asset: 'TSLA', size: 33.8, lev: '7', pnl: '20.47', created: 29304 },
    { id: 2, side: 1, asset: 'TSLA', size: 12.2, lev: '14', pnl: '30.47', created: 29304 },
    { id: 4, side: -1, asset: 'TSLA', size: 2.5, lev: '2', pnl: '5.29', created: 29304 },
    { id: 5, side: -1, asset: 'TSLA', size: 0.5, lev: '19', pnl: '-50.99', created: 29304 },
];

const UserTrades: React.FC<Props> = () => {
    const getInterestPayment = (loanAmt: number, interestRate: number, now: number, lastInterestPayed: number, interestPeriod: number) => {
        return (now - lastInterestPayed) / interestPeriod * (loanAmt / interestRate);
    }
    const getPnl = (baseAsset: number, quoteAsset: number, psize: number, k: number, startingCost: number, loanAmt: number, collateral: number) => {
        let quoteWPsz = quoteAsset + psize;
        let newBaseAsset = (k * 100000000) / quoteWPsz;
        return (baseAsset - newBaseAsset) - (startingCost + loanAmt) + collateral;
    }
    //startingCost
    return (
        <div className='border-2 border-amber-400/20 flex flex-col bg-slate-900 shadow-lg shadow-amber-400 rounded-2xl'>
            <div className='grid grid-cols-7 justify-evenly text-center '>
                <div className='text-white text-lg lg:text-2xl m-2'>TradeId</div>
                <div className='text-white text-lg lg:text-2xl m-2'>Assets</div>
                <div className='text-white text-lg lg:text-2xl m-2'>Side</div>
                <div className='text-white text-lg lg:text-2xl m-2'>Position Size</div>
                <div className='text-white text-lg lg:text-2xl m-2'>Leverage</div>
                <div className='text-white text-lg lg:text-2xl m-2'>Pnl</div>
                <div className='text-white text-lg lg:text-2xl m-2'>Active Since</div>
            </div>
            <hr className='border-white' />
            {rows.map((row,index) => (
                <SingleTrade key={row.id} row={row} index={index}/>
            ))}
        </div>
    )
}

export default UserTrades
