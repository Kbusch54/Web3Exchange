import { AriadneDAO } from "../../../abis";
import { usePrepareContractWrite, Address } from "wagmi";
import { ariadneGoogle,ariadneMeta,ariadneTesla,loanpool} from "../../../address";
import { parseUnits } from "ethers/lib/utils.js";

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

  function getAriadnePool(ammId: string) {
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
