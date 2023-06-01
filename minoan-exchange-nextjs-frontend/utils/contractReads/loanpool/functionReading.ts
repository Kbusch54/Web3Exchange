import { ethers } from "ethers";
import { LoanPoolAbi,AriadneDAO } from "../../abis";

export const getAllFunctions =()=>{
    const functions = LoanPoolAbi.filter((x)=>{
        return x.type === "function" && !x.name?.startsWith('setMinAndMax') && x.name?.startsWith('set') && !x.name?.startsWith('setTheseus')
    })
    return functions
}
export const getFunctionCallDataLoanPool = (
    methodName:string,
    input:any[]
    ) => {
      let iface = new ethers.utils.Interface(LoanPoolAbi);
      
      return iface.encodeFunctionData(methodName,input);
    };

    export const getallTheseusFunctions =()=>{
        const functions = LoanPoolAbi.filter((x)=>{
            return x.type === "function" && x.name?.startsWith('setMinAndMax') && x.name?.startsWith('setTheseus') && x.name?.startsWith('init')
        })
        return functions
    }
 
    
