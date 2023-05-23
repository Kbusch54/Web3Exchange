import React from 'react'
import SideSelection from './utils/SideSelection';


interface Props {
    
}
const rows = [
    { id: 1, side: 1, asset: 'TSLA', size: 3.5, lev: '10', pnl: '200.47' },
    { id: 3, side: -1, asset: 'TSLA', size: 33.8, lev: '7', pnl: '20.47' },
    { id: 2, side: 1, asset: 'TSLA', size: 12.2, lev: '14', pnl: '30.47' },
    { id: 4, side: -1, asset: 'TSLA', size: 2.5, lev: '2', pnl: '5.29' },
    { id: 5, side: -1, asset: 'TSLA', size: 0.5, lev: '19', pnl: '-50.99' },
];
const GlobalTradesBox: React.FC<Props> = () => {
    //psize: position size
    //lev: leverage
    //usdcamt:   let quoteWPsz = quoteAssetReserve + positionSize;
    // newBaseAsset =(k*100000000) / quoteWPsz);
    // usdcAmt = baseAssetReserve- newBaseAsset;
    const getPnl = (baseAsset:number, quoteAsset:number, psize:number, k:number,startingCost:number,loanAmt:number) => {
        let quoteWPsz = quoteAsset + psize;
        let newBaseAsset = (k*100000000) / quoteWPsz;
        return (baseAsset - newBaseAsset) - (startingCost + loanAmt);
    }
    //startingCost
    return (
        <div className='border-2 border-amber-400 flex flex-col bg-slate-900 shadow-lg shadow-amber-400 '>
            <div className='grid grid-cols-5 justify-evenly text-center '>
                <div className='text-white text-2xl m-2'>Assets</div>
                <div className='text-white text-2xl m-2'>Side</div>
                <div className='text-white text-2xl m-2'>Position Size</div>
                <div className='text-white text-2xl m-2'>Leverage</div>
                <div className='text-white text-2xl m-2'>Pnl</div>
            </div>
            <hr className='border-white'/>  
            {rows.map((row) => (
                <div key={row.id} className='grid grid-cols-5 justify-evenly text-center border border-amber-400 rounded-lg '>
                    <div className='text-white text-xl m-2'>{row.asset}</div>
                    <div className='text-white text-xl m-2'><SideSelection side={row.side}/></div>
                    <div className='text-white text-xl m-2'>{row.size}</div>
                    <div className='text-white text-xl m-2'>{row.lev}</div>
                    <div className='text-white text-xl m-2'>{row.pnl}</div>
                    </div>
            ))}
        </div>
    )
}

export default GlobalTradesBox
