import { Address } from "wagmi";
import { getAmmName, getAridneFromAmm } from "../doas";
import { getAllProposals } from "app/lib/supabase/allProposals";
import { cache } from "react";

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
export const getTradeDurationByUser = (trades: any, newArrLength:number,user?: Address,amm?:Address) => {
    let duration :{ date: string; value: number; }[] = [];;
    let avg =0;
    for (let i = trades.length >= newArrLength? newArrLength-1:trades.length-1; i >=0; i--) {
        if(user){
            if(trades[i].user.id.toLowerCase() !== user.toLowerCase() || trades[i].isActive == true) continue;
        }
        if(amm){
            if(trades[i].ammPool.id.toLowerCase() !== amm.toLowerCase()) continue;
        }
        duration.push({date:trades[i].created,value:trades[i].tradeBalance.exitTime - trades[i].created})
        avg += trades[i].tradeBalance.exitTime - trades[i].created;
    }
    avg = avg/duration.length;
    return {duration,avg};
}
export const getTardeSidesByAmm = (trades: any, amm?:Address,user?:Address) => {
   let data:{name:string,value:number} []= [{name:'long',value:0},{name:'short',value:0}];
   let long = 0;
    let short = 0;
   for (let i = 0; i <trades.length; i++) {
        if(user){
            if(trades[i].user.id.toLowerCase() !== user.toLowerCase() || trades[i].isActive == true) continue;
        }
        if(amm){
            if(trades[i].ammPool.id.toLowerCase() !== amm.toLowerCase()) continue;
        }
        if(trades[i].tradeBalance.side == 1){
            
           long ++;
        }else{
            short ++;
        }
    }
    data[0].value = long;
    data[1].value = short;
    return data;
}
export const getProposalsByAmm = (proposals: any, amm?:Address,user?:Address) => {
    let data:{date:string,beforeExecuted:number} []= [];
    var today = new Date();
    var substract_no_of_days = 300;
    const firstDate = today.setTime(today.getTime() - substract_no_of_days* 24 * 60 * 60 * 10);
    const fd = new Date(firstDate).toISOString().substring(0, 10);
    data.push({date:fd,beforeExecuted:0})
    for (let i = 0; i <proposals.length; i++) {
            if(user){
                if(proposals[i].executor.toLowerCase() !== user.toLowerCase() && proposals[i].proposer !== user.toLowerCase()) continue;
            }
            if(amm){
                if(proposals[i].dAO?.ammPool?.id.toLowerCase() !== amm.toLowerCase() && proposals[i].dAO?.id.toLowerCase() !== amm.toLowerCase() && proposals[i].theseusDAO?.id.toLowerCase() !== amm.toLowerCase() ) continue;
            }
            if(proposals[i].executor == null) continue;
            const timeBeforeExecution = (proposals[i].passedAt - proposals[i].proposedAt)*1000;
            const dateOfExecution = new Date(proposals[i].passedAt * 1000).toISOString().substring(0, 10);
            data.push({date:dateOfExecution,beforeExecuted:timeBeforeExecution})
        }
    return data;
}
export const getProposalTime = (proposals: any, amm?:Address,user?:Address) => {
    let avgProposalTime =0;
    let proposalsnum = 0;

    for (let i = 0; i <proposals.length; i++) {
            if(user){
                if(proposals[i].executor.toLowerCase() !== user.toLowerCase() && proposals[i].proposer !== user.toLowerCase()) continue;
            }
            if(amm){
                if(proposals[i].dAO?.ammPool?.id.toLowerCase() !== amm.toLowerCase() && proposals[i].dAO?.id.toLowerCase() !== amm.toLowerCase() && proposals[i].theseusDAO?.id.toLowerCase() !== amm.toLowerCase() ) continue;
            }
            if(proposals[i].executor == null) continue;
            proposalsnum++;
            avgProposalTime += (proposals[i].passedAt - proposals[i].proposedAt)*1000;
        }
    return avgProposalTime/proposalsnum;
}

export const getTradeHistory = (trades: any, user?: Address,amm?:Address) => {
    let data: { date: string; Tesla: number; Google: number; Meta: number; All: number; }[] = [];
    let dateMap = new Map();
    let leastDate;
    for (let i = 0; i <trades.length; i++) {
        if(user){
            if(trades[i].user.id.toLowerCase() !== user.toLowerCase() || trades[i].isActive == true) continue;
        }
        if(amm){
            if(trades[i].ammPool.id.toLowerCase() !== amm.toLowerCase()) continue;
        }
        let created = new Date((trades[i].created * 1000) ).toISOString().substring(0, 10);
        if(!leastDate) leastDate = created;
        if(leastDate > created) leastDate = created;
        if(dateMap.has(created)){
            let temp = dateMap.get(created);
            temp[getAmmName(trades[i].ammPool.id) as keyof typeof temp] ++;
            temp['All'] ++;
            dateMap.set(created,temp);
        }else{
            let temp: { "Tesla": number; "Google": number; "Meta": number; "All": number; }= {"Tesla":0,"Google":0,"Meta":0,"All":0};
            let ammName = getAmmName(trades[i].ammPool.id);
            temp[ammName as keyof typeof temp] ++;
            temp['All'] ++;
            dateMap.set(created,temp);
        }   
    }
    if(amm){
        const name = getAmmName(amm);
        // @ts-ignore
        let newData: { date: string , [key: string]: number }[] = [];
        // @ts-ignore
        newData.push({ date: leastDate, [name]: 0 });
        dateMap.forEach((value, key) => {
            newData.push({ date: key, [name]: value[name] }); // Use square brackets to set the key dynamically
            
        });
        return newData;
    }else{
        // @ts-ignore
        data.push({date:leastDate,Tesla:0,Google:0,Meta:0,All:0})
        dateMap.forEach((value, key) => {
            data.push({date:key,Tesla:value.Tesla,Google:value.Google,Meta:value.Meta,All:value.All})
        });
       
        return data;
    
    
    }
}
    export const getProposalSignersByAmm = cache(async(amm?:Address,user?:Address) => {
        const proposals = await getAllProposals();
        let avgSignatures =0;
        let numOfProposals =0;
        proposals.data?.forEach((proposal:any) => {
            
            if(user){
                if(proposal.executor.toLowerCase() !== user.toLowerCase() && proposal.proposer !== user.toLowerCase()) return;
            }
            if(amm){
                if(proposal.contractAddress.toLowerCase() !== getAridneFromAmm(amm).toLowerCase()) return;
            }
            numOfProposals++;
            avgSignatures += proposal.signatures.length;
        });
        return [avgSignatures/numOfProposals,numOfProposals];

    });