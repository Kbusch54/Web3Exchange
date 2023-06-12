import { AriadneDAO } from "../../../abis";
import { usePrepareContractWrite, Address } from "wagmi";
import { parseUnits } from "ethers/lib/utils.js";
import { getAriadnePool } from "../../../helpers/doas";

export const useExecuteProposal = (
    nonce:number,
    addressTo:Address,
    transactionHash:string,
    signatures:string[],
    contractAdd:Address,
    signer: Address,
  ) => {

    const { config, error } = usePrepareContractWrite({
        address:contractAdd,
       abi:AriadneDAO,
       chainId:5,
      functionName: "executeTransaction",
      args: [nonce,addressTo,0,transactionHash,signatures],
      account: signer,
        gas: parseUnits("200000", "wei").toBigInt(),
      
    });
    return { config, error };
  };


