import { AriadneDAO } from "../../../abis";
import { usePrepareContractWrite, Address } from "wagmi";
import { ariadneGoogle,ariadneMeta,ariadneTesla,loanpool} from "../../../address";
import { parseUnits } from "ethers/lib/utils.js";
import { getAriadnePool } from "../../../helpers/doas";

export const useNewProposal = (
    callData:string,
    ammId:string,
    signer: Address,
  ) => {
    // newProposal(address payable to,bytes calldata data
   
    const ariadneAddress = getAriadnePool(ammId);
    const { config, error } = usePrepareContractWrite({
        address:ariadneAddress,
       abi:AriadneDAO,
       chainId:5,
      functionName: "newProposal",
      args: [loanpool,callData],
      overrides: {
        from: signer,
        gasLimit: parseUnits("200000", "wei"),
      },
      
    });
    return { config, error };
  };


