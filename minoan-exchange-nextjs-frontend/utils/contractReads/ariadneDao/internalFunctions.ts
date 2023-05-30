import { ethers } from "ethers";
import { AriadneDAO } from "../../abis";

export const getAllUpdateFunctions =()=>{
    const functions = AriadneDAO.filter((x)=>{
        return x.type === "function" && x.name?.startsWith('update') 
    })
    return functions
}
export const getFunctionCallDataAriadne = (
    methodName:string,
    input:any[]
    ) => {
      let iface = new ethers.utils.Interface(AriadneDAO);
      
      return iface.encodeFunctionData(methodName,input);
    };