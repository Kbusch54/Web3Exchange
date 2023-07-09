import { UsdcAbi } from "../../abis";
import { usePrepareContractWrite, Address } from "wagmi";
import { usdc as usdcAddress} from "../../address";

export const useApproveUsdc = (
    signer: Address,
  ) => {
    const { config, error } = usePrepareContractWrite({
        address:usdcAddress,
       abi:UsdcAbi,
      functionName: "faucet",
      args: [ ],
      account: signer,
    });
    return { config, error };
  };