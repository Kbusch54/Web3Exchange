import { AriadneDAO,TheseusDAOAbi } from "../../../abis";
import { usePrepareContractWrite, Address } from "wagmi";
import { ariadneGoogle,ariadneMeta,ariadneTesla,loanpool} from "../../../address";
import { parseUnits } from "ethers/lib/utils.js";
import { getAriadnePool } from "../../../helpers/doas";

export const useNewProposal = (
    addressTo:Address,
    callData:string,
    contractAddress:Address,
    signer: Address,
    options?:any
  ) => {
    // newProposal(address payable to,bytes calldata data
   

    const option = options?TheseusDAOAbi:AriadneDAO;
    const { config, error } = usePrepareContractWrite({
        address:contractAddress,
       abi:option,
       chainId:5,
      functionName: "newProposal",
      args: [addressTo,callData],
      account: signer,
        gas: parseUnits("400000", "wei").toBigInt(),
      
    });
    return { config, error };
  };


