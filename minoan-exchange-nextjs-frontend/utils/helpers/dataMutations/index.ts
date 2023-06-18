import { Address } from "wagmi";

export const getPNlByUser = (trades: any, user: Address,newArrLength:number) => {
    let pnl :{ date: string; value: number; }[] = [];
    let avg =0;
    for (let i =  trades.length >= newArrLength? newArrLength-1:trades.length-1; i >=0; i--) {
        if(trades[i].user.id.toLowerCase() !== user.toLowerCase() || trades[i].isActive == true) continue;

        pnl.push({date:trades[i].created,value:trades[i].tradeBalance.pnl})
        avg += Number(trades[i].tradeBalance.pnl);
    }
    avg = avg/pnl.length;
    return {pnl,avg};
}
export const getTradeDurationByUser = (trades: any, user: Address,newArrLength:number) => {
    let duration :{ date: string; value: number; }[] = [];;
    let avg =0;
    for (let i = trades.length >= newArrLength? newArrLength-1:trades.length-1; i >=0; i--) {
        if(trades[i].user.id.toLowerCase() !== user.toLowerCase() || trades[i].isActive == true) continue;
        duration.push({date:trades[i].created,value:trades[i].tradeBalance.exitTime - trades[i].created})
        avg += trades[i].tradeBalance.exitTime - trades[i].created;
    }
    avg = avg/duration.length;
    return {duration,avg};
}