import { UsdcAbi } from "../abis";
import { usePrepareContractWrite, Address } from "wagmi";
import { usdc as usdcAddress,exchange} from "../address";

export const useApproveUsdc = (
    amount:number,
    signer: Address,
  ) => {
    const { config, error } = usePrepareContractWrite({
        address:usdcAddress,
       abi:UsdcAbi,
      functionName: "approve",
      args: [ exchange, amount],
      overrides: {
        from: signer,
      },
    });
    return { config, error };
  };