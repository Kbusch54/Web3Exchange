import { ethers } from "ethers";
import { Address } from "wagmi";
import { ariadneTesla, ariadneGoogle, ariadneMeta } from "../../address";
import { useGetCurrentId } from "../../contractReads/ariadneDao/currentId";

export const getTransactionHashFull = async (
    to: Address,
    callData: string,
    ammId: string
  ) => {
    const nonce = useGetCurrentId(ammId);
    const data = callData;
    const address = getAriadnePool(ammId);
  
    return new Promise((resolve) => {
      if (nonce) {
        console.log('The transaction hash');
        console.log(nonce.currentId?.valueOf);
        console.log(to);
        console.log(data);
        console.log(address);
        const transactionHash = nonce.currentId?.valueOf && getTransactionHash(nonce.currentId, to, 0, data, address);
        resolve([transactionHash, nonce.currentId]);
      } else {
        resolve(null);
      }
    });
  };
  

export const getTransactionHash = (_nonce:number, to:Address, value:number, data:string, address:Address) => {
    return ethers.utils.solidityKeccak256(
      ["address", "uint256", "address", "uint256", "bytes"],
      [address, _nonce, to, value, data]
    );
  };

  export const  getAriadnePool = (ammId: string) =>{
    const amm =ammId.toLowerCase();
    if(amm === "tesla"){
        return ariadneTesla;
    }else if(amm === "google"){
        return ariadneGoogle;
    }else if(amm === "meta"){
        return ariadneMeta;
    }
    else{
        return ariadneTesla;
    }
}