import { ExchangeAbi } from "../../abis";
import { usePrepareContractWrite, Address } from "wagmi";
import { usdc,exchange} from "../../address";

export const useDepositUsdc = (
    amount:number,
    signer: Address,
  ) => {
    const { config, error } = usePrepareContractWrite({
        address:exchange,
       abi:ExchangeAbi,
      functionName: "deposit",
      args: [amount],
      overrides: {
        from: signer,
      },
    });
    return { config, error };
  };