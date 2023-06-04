import React,{use} from 'react'
import SideSelection from './utils/SideSelection';
import SingleTrade from './SingleTrade';
import { Address } from 'wagmi';
import request, { gql } from 'graphql-request';
import { ethers } from 'ethers';

interface Props {
    user: Address;
    userAvailableBalance: number;
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
        }
    }
}
async function fetchTradeData(user: string) {
    const query = gql` 
      query getTrades($user: String!) {
            trades(where:{user:$user}){
                id
                created
                tradeBalance{
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
                    tradeId{     
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
                vamm{
                    id
                symbol
                loanPool{
                    maxLoan
                    mmr
                    interestPeriod
                }
                priceData{
                    marketPrice
                    indexPrice 
                }
                    snapshots{
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



    const endpoint = "https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest";
    const variables = { user: user };
    const data = await request(endpoint, query, variables);

    return data;
}
// const rows = [
//     { id: '0x783gbd874', side: 1, asset: 'TSLA', size: 353849506, lev: 10, pnl: '200.47', created: 29304 },
//     { id: '0x783gbd874', side: -1, asset: 'TSLA', size: 3385712905, lev: 7, pnl: '20.47', created: 29304 },
//     { id: '0x783gbd874', side: 1, asset: 'TSLA', size: 1223958693, lev: 14, pnl: '30.47', created: 29304 },
//     { id: '0x783gbd874', side: -1, asset: 'TSLA', size: 253748591, lev: 2, pnl: '5.29', created: 29304 },
//     { id: '0x783gbd874', side: -1, asset: 'TSLA', size: 59383811, lev: 19, pnl: '-50.99', created: 29304 },
// ];

const UserTrades: React.FC<Props> = ({ user, userAvailableBalance }) => {
    const getInterestPayment = (loanAmt: number, interestRate: number, now: number, lastInterestPayed: number, interestPeriod: number) => {
        return Math.floor((now - lastInterestPayed) / interestPeriod) * (loanAmt * interestRate/10**6);
    }
    const getPnl = (baseAsset: number, quoteAsset: number, psize: number, startingCost: number, loanAmt: number, collateral: number,interestPayed:number) => {
        let quoteWPsz = Number(quoteAsset) + Number(psize);
        let k = Number(baseAsset) * Number(quoteAsset);
        let newBaseAsset = (Number(k) ) / Number(quoteWPsz);
        let cost  = startingCost - collateral;
        return Math.floor(Math.abs(Number(baseAsset) - Number(newBaseAsset)) - Math.abs(Number(cost) + Number(loanAmt) + Number(interestPayed)) );
    }
    const tradeData  = use(fetchTradeData(user));
    const encodedData =(addr1:Address, addr2:Address, num:Number, intNum:Number)=> ethers.utils.defaultAbiCoder.encode(['address', 'address', 'uint256', 'int256'], [addr1, addr2, num, intNum]);


    // console.log(tradeData);

    // tradeData.trades.map((trade: any) => {console.log('this is trades',trade)});
    const tradesToRows = (trades: any) => {
        return trades.map((trade: any) => {
            const { tradeBalance, startingCost, isActive, liquidated, vamm } = trade;
            const { side, positionSize, leverage, pnl, interestRate, LastFFRPayed, collateral, LastInterestPayed, tradeId, loanAmt, entryPrice } = tradeBalance;
            const { mmr, interestPeriod,maxLoan } = vamm.loanPool;
            const { marketPrice, indexPrice } = vamm.priceData;
            const { ffr,baseAssetReserve,quoteAssetReserve } = vamm.snapshots[0];
            const now = Math.floor(Date.now()/1000);
            const interestPayment = getInterestPayment(loanAmt, interestRate, now, LastInterestPayed, interestPeriod);
            const pnlCalc = getPnl(baseAssetReserve, quoteAssetReserve, positionSize, startingCost, loanAmt, collateral,interestPayment);
            const vammAdd = vamm.id;
            const tradeID = encodedData(user,vammAdd,trade.created,side);
            return {
                id: tradeID,
                side: side,
                asset: vamm.symbol,
                size: positionSize,
                lev: leverage,
                pnl: pnlCalc,
                created: trade.created,
                information: {
                    mmr: mmr,
                    ffr: ffr,
                    ffrReturn: 'ffrReturn',
                    liquidationPrice: 'liquidationPrice',
                    interestRate: interestRate,
                    interestPeriod: interestPeriod,
                    interestAccrued: interestPayment,
                    startCollateral: collateral,
                    currentCollateral: collateral - (startingCost-collateral) - interestPayment,
                    openValue: 'openValue',
                    currentValue: 'currentValue',
                },
                other:{
                    baseAssetReserve:baseAssetReserve,
                    quoteAssetReserve:quoteAssetReserve,
                    loanAmt:loanAmt,
                    maxLoanAmt:maxLoan,
                    interestPeriodsPassed:Math.floor((now - LastInterestPayed) / interestPeriod)
                }
            }
        })

    }
    const rows = tradesToRows(tradeData.trades);
    // console.log('rows',rowsa);
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
            {/* @ts-ignore */}
            {rows.map((row, index) => (
                <SingleTrade key={row.id} row={row} index={index} user={user} userAvailableBalance={userAvailableBalance} />
            ))}
        </div>
    )
}

export default UserTrades
