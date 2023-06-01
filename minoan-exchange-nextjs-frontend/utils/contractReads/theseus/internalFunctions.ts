import { ethers } from "ethers";
import { TheseusDAOAbi } from "../../abis";

export const getAllUpdateFunctions =()=>{
    const functions = TheseusDAOAbi.filter((x)=>{
        return x.type === "function" && x.name?.startsWith('update') 
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