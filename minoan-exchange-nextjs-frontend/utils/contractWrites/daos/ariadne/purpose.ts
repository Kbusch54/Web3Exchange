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
   

    const { config, error } = usePrepareContractWrite({
        address:contractAddress,
       abi:options? TheseusDAOAbi: AriadneDAO,
       chainId:5,
      functionName: "newProposal",
      args: [addressTo,callData],
      overrides: {
        from: signer,
        gasLimit: parseUnits("400000", "wei"),
      },
      
    });
    return { config, error };
  };


