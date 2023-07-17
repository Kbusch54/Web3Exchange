import { ExchangeAbi } from "../../abis";
import { usePrepareContractWrite, Address } from "wagmi";
import { exchange} from "../../address";

export const useDepositUsdc = (
    amount:number,
    signer: Address,
  ) => {
    console.log("amount",amount)
    console.log("signer",signer)
    console.log('exhcnage',exchange)
    const { config, error } = usePrepareContractWrite({
        address:exchange,
       abi:ExchangeAbi,
      functionName: "deposit",
      args: [amount],
      account: signer,

    });
    return { config, error };
  };