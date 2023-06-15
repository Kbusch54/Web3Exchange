'use client'
import React, { use, useEffect } from 'react'
import SingleTrade from './SingleTrade';
import { Address } from 'wagmi';
import request, { gql } from 'graphql-request';
import { ethers } from 'ethers';
import SingleGlobalTrade from './SingleGlobalTrade';
import { getAmmId } from '../../../utils/helpers/doas';
import { getGlobalTradeData } from '../../../app/lib/graph/globalTradeData';

interface Props {
    user: Address;
    userAvailableBalance: number;
    active?: boolean;
    amm?: string;
    global?: boolean;
}
interface rows {
    row: {
        id: string;
        side: number;
        asset: string;
        size: number;
        lev: number;
        pnl: string;
        created: number;
        isActive: boolean;
        userAdd: Address;
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
async function fetchGlobalTradeData() {
    const query = gql` 
      query getTrades {
    trades {
      id
      created
      user{
        id
      }
      tradeBalance {
        side
        positionSize
        leverage
        pnl
        interestRate
        LastFFRPayed
        collateral
        LastInterestPayed
        LastFFRPayed
        LastInterestPayed
        tradeId {
          tradeId
        }
        loanAmt
        positionSize
        leverage
        entryPrice
      }
      startingCost
      isActive
      liquidated
      vamm {
        id
        symbol
        loanPool {
          maxLoan
          minLoan
          mmr
          interestPeriod
        }
        priceData {
          marketPrice
          indexPrice
        }
        snapshots {
          quoteAssetReserve
          baseAssetReserve
          marketPrice
          ffr
          indexPrice
        }
      }
    }
  }
`;

// (orderBy: created orderDirection: desc)

    const endpoint = "https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest";
    // const variables = {};
    const data = await request(endpoint, query);

    return data;
}



const AllTrades: React.FC<Props> = ({ user, userAvailableBalance, active = true, amm, global=false }) => {
    const getInterestPayment = (loanAmt: number, interestRate: number, now: number, lastInterestPayed: number, interestPeriod: number) => {
        return Math.floor((now - lastInterestPayed) / interestPeriod) * (loanAmt * interestRate / 10 ** 6);
    }
    const getPnl = (baseAsset: number, quoteAsset: number, psize: number, startingCost: number, loanAmt: number, collateral: number, interestPayed: number) => {
        let quoteWPsz = Number(quoteAsset) + Number(psize);
        let k = Number(baseAsset) * Number(quoteAsset);
        let newBaseAsset = (Number(k)) / Number(quoteWPsz);
        let cost = startingCost - collateral;
        return Math.floor(Math.abs(Number(baseAsset) - Number(newBaseAsset)) - Math.abs(Number(cost) + Number(loanAmt) + Number(interestPayed)));
    }
    const encodedData = (addr1: Address, addr2: Address, num: Number, intNum: Number) => ethers.utils.defaultAbiCoder.encode(['address', 'address', 'uint256', 'int256'], [addr1, addr2, num, intNum]);
   
    const tradesToRows = (trades: any) => {
        return trades.map((trade: any) => {
            const { tradeBalance, startingCost, isActive, liquidated, vamm,user } = trade;
            const { side, positionSize, leverage, pnl, interestRate, LastFFRPayed, collateral, LastInterestPayed, tradeId, loanAmt, entryPrice } = tradeBalance;
            const { mmr, interestPeriod, maxLoan, minLoan } = vamm.loanPool;
            const { marketPrice, indexPrice } = vamm.priceData;
            const { ffr, baseAssetReserve, quoteAssetReserve } = vamm.snapshots[0];
            const now = Math.floor(Date.now() / 1000);
            const interestPayment = getInterestPayment(loanAmt, interestRate, now, LastInterestPayed, interestPeriod);
            const pnlCalc = getPnl(baseAssetReserve, quoteAssetReserve, positionSize, startingCost, loanAmt, collateral, interestPayment);
            const vammAdd = vamm.id;
            const tradeID = encodedData(user.id, vammAdd, trade.created, side);
            const getDateTime = (timestamp: number) => {
                const date = new Date(timestamp * 1000);
                const month = date.getMonth()+1;
                const day = date.getDate();
                const hour = date.getHours();
                const min = date.getMinutes();
                const sec = date.getSeconds();
                return `${month}/${day} ${hour > 12 ? hour - 12 : hour}:${min} ${hour > 12 ? 'PM' : 'AM'}`;
            }
            return {
                id: tradeID,
                side: side,
                asset: vamm.symbol,
                size: positionSize,
                lev: leverage,
                pnl: pnlCalc,
                created: getDateTime(trade.created),
                isActive: isActive,
                liquidated: liquidated,
                vamm: vamm.id,
                userAdd: user.id,
                information: {
                    mmr: mmr,
                    ffr: ffr,
                    ffrReturn: 'ffrReturn',
                    liquidationPrice: 'liquidationPrice',
                    interestRate: interestRate,
                    interestPeriod: interestPeriod,
                    interestAccrued: interestPayment,
                    startCollateral: collateral,
                    currentCollateral: collateral - (startingCost - collateral) - interestPayment,
                    openValue: 'openValue',
                    currentValue: 'currentValue',
                },
                other: {
                    baseAssetReserve: baseAssetReserve,
                    quoteAssetReserve: quoteAssetReserve,
                    loanAmt: loanAmt,
                    maxLoanAmt: maxLoan,
                    interestPeriodsPassed: Math.floor((now - LastInterestPayed) / interestPeriod),
                    minLoanAmt: minLoan,

                }
            }
        })

    }
    const tradeData:any = use(getGlobalTradeData());
    if(tradeData.error) return <div>Error...</div>;

    const rows: rows = tradesToRows(tradeData.trades);
    let inD = 0;
    const ammId = amm?getAmmId(amm):null;
    if (!global) {
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
                {/* @ts-ignore */}
                {rows.map((row, index) => {
                      console.log('this is row',row.isActive,row.id)
                    if (active && row.isActive && !row.liquidated && String(row.userAdd).toLowerCase() === String(user).toLowerCase()) {
                        if(amm? (String(row.vamm).toLowerCase() === String(ammId).toLowerCase()):true){
                            return <SingleTrade key={row.id} row={row} index={index} user={user} userAvailableBalance={userAvailableBalance} />;
                        }else{
                            return null;
                        }
                    } else if (!active && (!row.isActive || row.liquidated) &&String(row.userAdd).toLowerCase() === String(user).toLowerCase()) {
                        if(amm? (String(row.vamm).toLowerCase() === String(ammId).toLowerCase()):true){
                            return <SingleTrade key={row.id} row={row} index={index} user={user} userAvailableBalance={userAvailableBalance} />;
                        }else{
                            return null;
                        }
                    } else {
                        return null;
                    }
                })}

            </div>
        )
    } else {
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
                {/* @ts-ignore */}
                {rows.map((row, index) => {
                    console.log('this is row',row.isActive)
                    if (active && row.isActive && !row.liquidated && String(row.userAdd).toLowerCase() != String(user).toLowerCase()) {
                        if(amm? (String(row.vamm).toLowerCase() === String(ammId).toLowerCase()):true){
                            return <SingleGlobalTrade key={row.id} row={row} index={index} />;
                        }else{
                            return null;
                        }
                    } else if (!active && (!row.isActive || row.liquidated) && String(row.userAdd).toLowerCase() != String(user).toLowerCase()) {
                        if(amm? (String(row.vamm).toLowerCase() === String(ammId).toLowerCase()):true){
                            return <SingleGlobalTrade key={row.id} row={row} index={index} />;
                        }else{
                            return null;
                        }
                    } else {
                        return null;
                    }
                })}

            </div>
        )
    }

}

export default AllTrades
