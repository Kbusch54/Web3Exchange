import { ExchangeAbi } from "../../abis";
import { usePrepareContractWrite, Address } from "wagmi";
import { exchange} from "../../address";
import { parseUnits } from "ethers/lib/utils.js";

export const useClosePosition = (
    signer: Address,
    tradeId:string,
    payload:string
  ) => {
    const { config, error } = usePrepareContractWrite({
        address:exchange,
       abi:ExchangeAbi,
       chainId:5,
      functionName: "closeOutPosition",
      args: [tradeId,payload],
      account: signer,
      gas: parseUnits("200000", "wei").toBigInt(),
      
    });
    return { config, error };
  };


