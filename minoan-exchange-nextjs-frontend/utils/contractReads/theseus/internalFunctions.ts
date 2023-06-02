import { ethers } from "ethers";
import { TheseusDAOAbi,CreateAriadneAbi,LoanPoolAbi,AriadneDAO,ExchangeAbi,StakingAbi,UsdcAbi,AmmViewerAbi } from "../../abis";
import { ammViewer, ariadneTesla, createAriadnes, exchange, loanpool, staking, theseus, usdc } from "../../address";
import { Address } from "wagmi";

 const getAllUpdateFunctions =()=>{
    const functions = TheseusDAOAbi.filter((x)=>{
        return x.type === "function" && (x.name?.startsWith('update') || x.name?.startsWith('deposit') )
    })
    return functions
}
export const getFunctionCallDataThesesus = (
    methodName:string,
    input:any[]
    ) => {
      let iface = new ethers.utils.Interface(TheseusDAOAbi);
      
      return iface.encodeFunctionData(methodName,input);
    };

 const getAllCreateAriadneFunctions =()=>{
    const functions = CreateAriadneAbi.filter((x)=>{
        return x.type === "function" && (x.name?.startsWith('create') || x.name?.startsWith('update') || x.name?.startsWith('set'))
    })
    return functions
}
 export const getAllExchangeFunctions =()=>{
    const functions = ExchangeAbi.filter((x)=>{
        return x.type === "function" && ( x.name?.startsWith('register')  || x.name?.startsWith('update') || x.name?.startsWith('deposit')|| x.name?.startsWith('withdraw')|| x.name?.startsWith('set') ||  x.name?.startsWith('addAmm'))
    })
    return functions
}
 const getAllStakingFunctions =()=>{
    const functions = StakingAbi.filter((x)=>{
        return x.type === "function" && (x.name?.startsWith('set') || x.name?.startsWith('update'))
    })
    return functions
}
 const getAllUsdcFunctions =()=>{
    const functions = UsdcAbi.filter((x)=>{
        return x.type === "function" && (x.name?.startsWith('approve') || x.name?.startsWith('transfer'))
    })
    return functions
}
 const getAllAmmViewerFunctions =()=>{
    const functions = AmmViewerAbi.filter((x)=>{
        return x.type === "function" && (x.name?.startsWith('update') || x.name?.startsWith('remove') || x.name?.startsWith('add'))
    })
    return functions
}
export const getFunctionCallDataThesesusAll= (
    methodName:string,
    input:any[],
    abi:string) => {
    const ABI = getAbi(abi);
    const addressTo = getAddress(abi);
        let iface = new ethers.utils.Interface(ABI);
        return [iface.encodeFunctionData(methodName,input),addressTo];
    };
     const getAllTheseusFunctions =()=>{
        const functions = LoanPoolAbi.filter((x)=>{
            return x.type === "function" && (x.name?.startsWith('setMinAndMax') || x.name?.startsWith('setTheseus') || x.name?.startsWith('init'))
        })
        return functions
    }


    const getAbi = (abi:string)=>{
        if(abi === "internal"){
            return TheseusDAOAbi;
        }else if(abi === "ariadne"){
            return CreateAriadneAbi;
        }else if(abi === "loanPool"){
            return LoanPoolAbi;
        }else if(abi === "ariadneDao"){
            return AriadneDAO;
        }else if(abi === "exchange"){
            return ExchangeAbi;
        }else if(abi === "staking"){
            return StakingAbi;
        }else if(abi === "usdc"){
            return UsdcAbi;
        }else if(abi === "ammViewer"){
            return AmmViewerAbi;
        }else{
            return TheseusDAOAbi;
        }
    }
    const getAddress = (abi:string)=>{
        if(abi === "internal"){
            return theseus;
        }else if(abi === "ariadne"){
            return createAriadnes;
        }else if(abi === "loanPool"){
            return loanpool;
        }else if(abi === "ariadneDao"){
            return ariadneTesla;
        }else if(abi === "exchange"){
            return exchange;
        }else if(abi === "staking"){
            return staking;
        }else if(abi === "usdc"){
            return usdc;
        }else if(abi === "ammViewer"){
            return ammViewer;
        }else{
            return theseus;
        }
    }



    export const getFunctionsOf = (contract:string)=>{
        if(contract === "internal"){
             const hello =getAllUpdateFunctions();
                return hello;
        }else if(contract === "ariadne"){
            return getAllCreateAriadneFunctions();
        }else if(contract === "loanPool"){
            return getAllTheseusFunctions();
        }else if(contract === "exchange"){
            return getAllExchangeFunctions();
        }else if(contract === "staking"){
            return getAllStakingFunctions();
        }else if(contract === "usdc"){
            return getAllUsdcFunctions();
        }else if(contract === "ammViewer"){
            return getAllAmmViewerFunctions();
        }else{
            return getAllUpdateFunctions();
        }
}