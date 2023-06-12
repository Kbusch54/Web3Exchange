import { ExchangeAbi } from "../../abis";
import { usePrepareContractWrite, Address } from "wagmi";
import { usdc,exchange} from "../../address";

export const useWithdrawUsdc = (
    amount:number,
    signer: Address,
  ) => {
    const { config, error } = usePrepareContractWrite({
        address:exchange,
       abi:ExchangeAbi,
      functionName: "withdraw",
      args: [amount],
      account: signer,
    });
    return { config, error };
  };