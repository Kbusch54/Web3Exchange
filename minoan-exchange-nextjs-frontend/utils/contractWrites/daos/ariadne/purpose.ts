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
        address:'0x1637bdDd2E139DeBA037387844c316B05F6B6d4E',
       abi:AriadneDAO,
       chainId:5,
      functionName: "newProposal",
      args: ['0xa71Cb4B8850063e8cdddC1438FbFF20d901ef0e5',callData],
      overrides: {
        from: signer,
        // gasLimit: parseUnits("200000", "wei"),
      },
      
    });
    return { config, error };
  };


